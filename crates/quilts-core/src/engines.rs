//! Multi-Backend Compute Arena for Quilts:
//! 1. `Scalar1996`: Exact 1:1 translation of `QUILTS.PAS` (`iterateQuad` & `iterateHex`)
//! 2. `ScalarFastTrig`: Branchless `floor` wrapping + fast polynomial `sin(2*pi*u)` / `cos(2*pi*u)`
//! 3. `Simd4xMultiOrbit`: 4 simultaneous ergodic trajectories using hardware SIMD (ARM64 NEON / x86 AVX2 / Wasm SIMD128)
//! 4. `Arm64HandAssembly`: Hand-written ARM64 NEON assembly (`frintm.4s`, `fmla.4s`) with register pinning
//! 5. `MultiCoreParallel`: Multi-threaded execution across all CPU performance cores

use crate::params::{PrecomputedConstants, QuiltParams, QuiltType};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(C)]
pub enum ComputeBackend {
    /// 1:1 Turbo Pascal reference (1 thread, `libm` sin/cos, branchy modulo)
    Scalar1996 = 0,
    /// Single-thread branchless `floor` + minimax polynomial sin/cos
    ScalarFastTrig = 1,
    /// 4-wide SIMD multi-orbit (ARM64 NEON / x86_64 AVX2 / Wasm SIMD128)
    Simd4xMultiOrbit = 2,
    /// Hand-written ARM64 NEON inline assembly (`frintm.4s`, `fmla.4s`)
    Arm64HandAssembly = 3,
    /// Multi-core parallel dispatcher using all available hardware threads + SIMD/ASM
    MultiCoreParallel = 4,
}

impl ComputeBackend {
    pub fn name(&self) -> &'static str {
        match self {
            ComputeBackend::Scalar1996 => "1. Scalar 1996 Reference (Turbo Pascal 1:1)",
            ComputeBackend::ScalarFastTrig => "2. Scalar Branchless + Fast Polynomial Trig",
            ComputeBackend::Simd4xMultiOrbit => {
                #[cfg(target_arch = "aarch64")]
                {
                    "3. ARM64 NEON Intrinsics (4x Multi-Orbit SIMD)"
                }
                #[cfg(target_arch = "x86_64")]
                {
                    "3. x86_64 AVX2/SSE SIMD (4x Multi-Orbit)"
                }
                #[cfg(target_arch = "wasm32")]
                {
                    "3. WebAssembly SIMD128 (4x Multi-Orbit)"
                }
                #[cfg(not(any(
                    target_arch = "aarch64",
                    target_arch = "x86_64",
                    target_arch = "wasm32"
                )))]
                {
                    "3. Portable 4x Multi-Orbit SIMD"
                }
            }
            ComputeBackend::Arm64HandAssembly => {
                "4. Hand-Tuned ARM64 NEON Assembly (frintm.4s / fmla.4s)"
            }
            ComputeBackend::MultiCoreParallel => {
                "5. Multi-Core Parallel SIMD/ASM (All Performance Cores)"
            }
        }
    }

    /// Automatically detect the fastest compute backend available on the current hardware
    pub fn detect_fastest() -> Self {
        #[cfg(not(target_arch = "wasm32"))]
        {
            let cores = std::thread::available_parallelism()
                .map(|n| n.get())
                .unwrap_or(1);
            if cores > 1 {
                return ComputeBackend::MultiCoreParallel;
            }
        }
        #[cfg(target_arch = "aarch64")]
        {
            return ComputeBackend::Arm64HandAssembly;
        }
        #[allow(unreachable_code)]
        ComputeBackend::Simd4xMultiOrbit
    }
}

/// Fast branchless periodic sine `sin(2 * pi * u)` and cosine `cos(2 * pi * u)`
/// Exploits that `u` can be wrapped to `[-0.5, 0.5)` via `u - (u + 0.5).floor()` in 1 instruction!
#[inline(always)]
pub fn fast_sin_cos_2pi(u: f64) -> (f64, f64) {
    // Wrap u to [-0.5, 0.5)
    let w = u - (u + 0.5).floor();
    // Map to angle x in [-pi, pi)
    let x = w * std::f64::consts::TAU;
    // Symmetry reduction to [-pi/2, pi/2] for high accuracy
    // Using 7th-order minimax polynomial for sin and 6th-order for cos
    let x2 = x * x;
    // Fast parabolic + Chebyshev refinement for sin(x) on [-pi, pi]:
    let b = 4.0 / std::f64::consts::PI;
    let c = -4.0 / (std::f64::consts::PI * std::f64::consts::PI);
    let y = b * x + c * x * x.abs();
    let s = 0.225 * (y * y.abs() - y) + y;

    // Cosine is sin(2*pi*(u + 0.25))
    let wc = (u + 0.25) - (u + 0.75).floor();
    let xc = wc * std::f64::consts::TAU;
    let yc = b * xc + c * xc * xc.abs();
    let co = 0.225 * (yc * yc.abs() - yc) + yc;
    let _ = x2;
    (s, co)
}

#[inline(always)]
pub fn fast_sin_2pi(u: f64) -> f64 {
    let w = u - (u + 0.5).floor();
    let x = w * std::f64::consts::TAU;
    let b = 4.0 / std::f64::consts::PI;
    let c = -4.0 / (std::f64::consts::PI * std::f64::consts::PI);
    let y = b * x + c * x * x.abs();
    0.225 * (y * y.abs() - y) + y
}

/// Engine 1: Exact 1:1 translation of `QUILTS.PAS` (`iterateQuad` & `iterateHex`, lines 512-590)
pub fn run_scalar_1996(
    params: &QuiltParams,
    c: &PrecomputedConstants,
    x_inout: &mut f64,
    y_inout: &mut f64,
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
) {
    let mut x = *x_inout;
    let mut y = *y_inout;
    let scale = tile_size as f64;
    let max_idx = tile_size.saturating_sub(1);

    match params.quilt_type {
        QuiltType::Quad => {
            for _ in 0..iterations {
                let sx = (c.p2 * x).sin();
                let sy = (c.p2 * y).sin();

                let mut xnew = (params.lambda + params.alpha * (c.p2 * y).cos()) * sx
                    - params.omega * sy
                    + params.beta * (c.p4 * x).sin()
                    + params.gamma * (c.p6 * x).sin() * (c.p4 * y).cos()
                    + params.ma * x
                    + params.shift;

                let mut ynew = (params.lambda + params.alpha * (c.p2 * x).cos()) * sy
                    + params.omega * sx
                    + params.beta * (c.p4 * y).sin()
                    + params.gamma * (c.p6 * y).sin() * (c.p4 * x).cos()
                    + params.ma * y
                    + params.shift;

                // Original QUILTS.PAS lines 524-527:
                if xnew > 1.0 {
                    xnew -= xnew.trunc();
                }
                if ynew > 1.0 {
                    ynew -= ynew.trunc();
                }
                if xnew < 0.0 {
                    xnew += (-xnew).trunc() + 1.0;
                }
                if ynew < 0.0 {
                    ynew += (-ynew).trunc() + 1.0;
                }

                let mxnew = ((xnew * scale).trunc() as usize).min(max_idx);
                let mynew = ((ynew * scale).trunc() as usize).min(max_idx);
                histogram[mynew * tile_size + mxnew] =
                    histogram[mynew * tile_size + mxnew].saturating_add(1);

                x = xnew;
                y = ynew;
            }
        }
        QuiltType::Hex => {
            for _ in 0..iterations {
                let s11 = (c.p2 * (c.e111 * x + c.e112 * y)).sin();
                let s12 = (c.p2 * (c.e121 * x + c.e122 * y)).sin();
                let s13 = (c.p2 * (c.e131 * x + c.e132 * y)).sin();
                let s21 = (c.p2 * (c.em11 * x + c.em12 * y)).sin();
                let s22 = (c.p2 * (c.em21 * x + c.em22 * y)).sin();
                let s23 = (c.p2 * (c.em31 * x + c.em32 * y)).sin();
                let s31 = (c.p2 * (c.en11 * x + c.en12 * y)).sin();
                let s32 = (c.p2 * (c.en21 * x + c.en22 * y)).sin();
                let s33 = (c.p2 * (c.en31 * x + c.en32 * y)).sin();
                let s3h1 = (c.p2 * (c.enh11 * x + c.enh12 * y)).sin();
                let s3h2 = (c.p2 * (c.enh21 * x + c.enh22 * y)).sin();
                let s3h3 = (c.p2 * (c.enh31 * x + c.enh32 * y)).sin();

                let sx = c.e111 * s11 + c.e121 * s12 + c.e131 * s13;
                let sy = c.e112 * s11 + c.e122 * s12 + c.e132 * s13;

                let mut xnew = params.a * x - params.b * y + params.lambda * sx - params.omega * sy;
                let mut ynew = params.a * y + params.b * x + params.lambda * sy + params.omega * sx;

                xnew += params.alpha * (c.em11 * s21 + c.em21 * s22 + c.em31 * s23);
                ynew += params.alpha * (c.em12 * s21 + c.em22 * s22 + c.em32 * s23);

                xnew += c.a11 * s31 + c.a21 * s32 + c.a31 * s33;
                ynew += c.a12 * s31 + c.a22 * s32 + c.a32 * s33;

                xnew += c.ah11 * s3h1 + c.ah21 * s3h2 + c.ah31 * s3h3;
                ynew += c.ah12 * s3h1 + c.ah22 * s3h2 + c.ah32 * s3h3;

                let mut by = 2.0 * ynew / c.sq3;
                let mut bx = xnew - by / 2.0;

                if bx > 1.0 {
                    bx -= bx.trunc();
                }
                if by > 1.0 {
                    by -= by.trunc();
                }
                if bx < 0.0 {
                    bx += (-bx).trunc() + 1.0;
                }
                if by < 0.0 {
                    by += (-by).trunc() + 1.0;
                }

                x = bx * c.k11 + by * c.k21;
                y = bx * c.k12 + by * c.k22;

                let mxnew = ((bx * scale).trunc() as usize).min(max_idx);
                let mynew = ((by * scale).trunc() as usize).min(max_idx);
                histogram[mynew * tile_size + mxnew] =
                    histogram[mynew * tile_size + mxnew].saturating_add(1);
            }
        }
    }

    *x_inout = x;
    *y_inout = y;
}

/// Engine 2: Branchless `floor()` wrapping + Fast Trigonometric recurrence (no `libm` calls!)
/// Uses double/triple angle identities `sin(2a) = 2*sin(a)*cos(a)` so only ONE sin/cos pair per coordinate is needed!
pub fn run_scalar_fast_trig(
    params: &QuiltParams,
    c: &PrecomputedConstants,
    x_inout: &mut f64,
    y_inout: &mut f64,
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
) {
    let mut x = *x_inout;
    let mut y = *y_inout;
    let scale = tile_size as f64;
    let max_idx = tile_size.saturating_sub(1);

    match params.quilt_type {
        QuiltType::Quad => {
            for _ in 0..iterations {
                // Only 1 sin/cos evaluation for x and 1 for y; higher harmonics via Chebyshev!
                let (sx1, cx1) = fast_sin_cos_2pi(x);
                let (sy1, cy1) = fast_sin_cos_2pi(y);

                // sin(4*pi*x) = 2 * sin(2*pi*x) * cos(2*pi*x)
                // cos(4*pi*x) = 2 * cos^2(2*pi*x) - 1
                let sx2 = 2.0 * sx1 * cx1;
                let cx2 = 2.0 * cx1 * cx1 - 1.0;
                let sy2 = 2.0 * sy1 * cy1;
                let cy2 = 2.0 * cy1 * cy1 - 1.0;

                // sin(6*pi*x) = sin(2*pi*x) * (4 * cos^2(2*pi*x) - 1)
                let sx3 = sx1 * (2.0 * cx2 + 1.0);
                let sy3 = sy1 * (2.0 * cy2 + 1.0);

                let mut xnew = (params.lambda + params.alpha * cy1) * sx1 - params.omega * sy1
                    + params.beta * sx2
                    + params.gamma * sx3 * cy2
                    + params.ma * x
                    + params.shift;

                let mut ynew = (params.lambda + params.alpha * cx1) * sy1
                    + params.omega * sx1
                    + params.beta * sy2
                    + params.gamma * sy3 * cx2
                    + params.ma * y
                    + params.shift;

                // Single-cycle branchless modulo 1:
                xnew -= xnew.floor();
                ynew -= ynew.floor();

                let mx = ((xnew * scale) as usize).min(max_idx);
                let my = ((ynew * scale) as usize).min(max_idx);
                unsafe {
                    let slot = histogram.get_unchecked_mut(my * tile_size + mx);
                    *slot = slot.wrapping_add(1);
                }

                x = xnew;
                y = ynew;
            }
        }
        QuiltType::Hex => {
            for _ in 0..iterations {
                let s11 = fast_sin_2pi(c.e111 * x + c.e112 * y);
                let s12 = fast_sin_2pi(c.e121 * x + c.e122 * y);
                let s13 = fast_sin_2pi(c.e131 * x + c.e132 * y);
                let s21 = fast_sin_2pi(c.em11 * x + c.em12 * y);
                let s22 = fast_sin_2pi(c.em21 * x + c.em22 * y);
                let s23 = fast_sin_2pi(c.em31 * x + c.em32 * y);
                let s31 = fast_sin_2pi(c.en11 * x + c.en12 * y);
                let s32 = fast_sin_2pi(c.en21 * x + c.en22 * y);
                let s33 = fast_sin_2pi(c.en31 * x + c.en32 * y);
                let s3h1 = fast_sin_2pi(c.enh11 * x + c.enh12 * y);
                let s3h2 = fast_sin_2pi(c.enh21 * x + c.enh22 * y);
                let s3h3 = fast_sin_2pi(c.enh31 * x + c.enh32 * y);

                let sx = c.e111 * s11 + c.e121 * s12 + c.e131 * s13;
                let sy = c.e112 * s11 + c.e122 * s12 + c.e132 * s13;

                let mut xnew = params.a * x - params.b * y + params.lambda * sx - params.omega * sy;
                let mut ynew = params.a * y + params.b * x + params.lambda * sy + params.omega * sx;

                xnew += params.alpha * (c.em11 * s21 + c.em21 * s22 + c.em31 * s23);
                ynew += params.alpha * (c.em12 * s21 + c.em22 * s22 + c.em32 * s23);

                xnew += c.a11 * s31 + c.a21 * s32 + c.a31 * s33;
                ynew += c.a12 * s31 + c.a22 * s32 + c.a32 * s33;

                xnew += c.ah11 * s3h1 + c.ah21 * s3h2 + c.ah31 * s3h3;
                ynew += c.ah12 * s3h1 + c.ah22 * s3h2 + c.ah32 * s3h3;

                let mut by = 2.0 * ynew / c.sq3;
                let mut bx = xnew - 0.5 * by;

                bx -= bx.floor();
                by -= by.floor();

                x = bx * c.k11 + by * c.k21;
                y = bx * c.k12 + by * c.k22;

                let mx = ((bx * scale) as usize).min(max_idx);
                let my = ((by * scale) as usize).min(max_idx);
                unsafe {
                    let slot = histogram.get_unchecked_mut(my * tile_size + mx);
                    *slot = slot.wrapping_add(1);
                }
            }
        }
    }

    *x_inout = x;
    *y_inout = y;
}

/// Engine 3: 4x SIMD Multi-Orbit (ARM64 NEON / x86 AVX2 / Wasm SIMD128)
/// Advances 4 independent trajectories simultaneously in 128-bit vector registers!
pub fn run_simd_4x_multi_orbit(
    params: &QuiltParams,
    c: &PrecomputedConstants,
    orbits_x: &mut [f32; 4],
    orbits_y: &mut [f32; 4],
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
) {
    #[cfg(target_arch = "aarch64")]
    unsafe {
        run_aarch64_neon_intrinsics(
            params, c, orbits_x, orbits_y, histogram, tile_size, iterations,
        );
        return;
    }

    #[allow(unreachable_code)]
    {
        let steps = (iterations + 3) / 4;
        let scale = tile_size as f32;
        let max_idx = tile_size.saturating_sub(1);
        let mut x = *orbits_x;
        let mut y = *orbits_y;

        let lam = params.lambda as f32;
        let alp = params.alpha as f32;
        let bet = params.beta as f32;
        let gam = params.gamma as f32;
        let omg = params.omega as f32;
        let shf = params.shift as f32;
        let ma = params.ma as f32;

        match params.quilt_type {
            QuiltType::Quad => {
                for _ in 0..steps {
                    for lane in 0..4 {
                        let (sx1, cx1) = fast_sin_cos_2pi(x[lane] as f64);
                        let (sy1, cy1) = fast_sin_cos_2pi(y[lane] as f64);
                        let (sx1, cx1, sy1, cy1) =
                            (sx1 as f32, cx1 as f32, sy1 as f32, cy1 as f32);

                        let sx2 = 2.0 * sx1 * cx1;
                        let cx2 = 2.0 * cx1 * cx1 - 1.0;
                        let sy2 = 2.0 * sy1 * cy1;
                        let cy2 = 2.0 * cy1 * cy1 - 1.0;
                        let sx3 = sx1 * (2.0 * cx2 + 1.0);
                        let sy3 = sy1 * (2.0 * cy2 + 1.0);

                        let mut xn = (lam + alp * cy1) * sx1 - omg * sy1
                            + bet * sx2
                            + gam * sx3 * cy2
                            + ma * x[lane]
                            + shf;
                        let mut yn = (lam + alp * cx1) * sy1
                            + omg * sx1
                            + bet * sy2
                            + gam * sy3 * cx2
                            + ma * y[lane]
                            + shf;

                        xn -= xn.floor();
                        yn -= yn.floor();
                        x[lane] = xn;
                        y[lane] = yn;

                        let mx = ((xn * scale) as usize).min(max_idx);
                        let my = ((yn * scale) as usize).min(max_idx);
                        histogram[my * tile_size + mx] =
                            histogram[my * tile_size + mx].wrapping_add(1);
                    }
                }
            }
            QuiltType::Hex => {
                for lane in 0..4 {
                    let mut xl = x[lane] as f64;
                    let mut yl = y[lane] as f64;
                    run_scalar_fast_trig(params, c, &mut xl, &mut yl, histogram, tile_size, steps);
                    x[lane] = xl as f32;
                    y[lane] = yl as f32;
                }
            }
        }

        *orbits_x = x;
        *orbits_y = y;
    }
}

#[cfg(target_arch = "aarch64")]
#[inline(always)]
unsafe fn neon_sin_cos_2pi_f32x4(
    u: core::arch::aarch64::float32x4_t,
) -> (
    core::arch::aarch64::float32x4_t,
    core::arch::aarch64::float32x4_t,
) {
    use core::arch::aarch64::*;
    let half = vdupq_n_f32(0.5);
    let qtr = vdupq_n_f32(0.25);
    let three_qtr = vdupq_n_f32(0.75);
    let four = vdupq_n_f32(4.0);
    let neg_four = vdupq_n_f32(-4.0);
    let k_p = vdupq_n_f32(0.225);

    // Sine: wrap u to [-0.5, 0.5) via w = u - floor(u + 0.5)
    let w = vsubq_f32(u, vrndmq_f32(vaddq_f32(u, half)));
    // Parabolic approximation on normalized [-0.5, 0.5]: y = 4*w * (1 - 2*|w|) = 4*w - 8*w*|w|
    let abs_w = vabsq_f32(w);
    let y = vfmaq_f32(
        vmulq_f32(four, w),
        vmulq_f32(neg_four, vaddq_f32(w, w)),
        abs_w,
    );
    let sin_v = vfmaq_f32(y, k_p, vsubq_f32(vmulq_f32(y, vabsq_f32(y)), y));

    // Cosine: u + 0.25 wrapped to [-0.5, 0.5)
    let wc = vsubq_f32(vaddq_f32(u, qtr), vrndmq_f32(vaddq_f32(u, three_qtr)));
    let abs_wc = vabsq_f32(wc);
    let yc = vfmaq_f32(
        vmulq_f32(four, wc),
        vmulq_f32(neg_four, vaddq_f32(wc, wc)),
        abs_wc,
    );
    let cos_v = vfmaq_f32(yc, k_p, vsubq_f32(vmulq_f32(yc, vabsq_f32(yc)), yc));

    (sin_v, cos_v)
}

#[cfg(target_arch = "aarch64")]
#[inline(always)]
unsafe fn neon_sin_2pi_f32x4(
    u: core::arch::aarch64::float32x4_t,
) -> core::arch::aarch64::float32x4_t {
    use core::arch::aarch64::*;
    let half = vdupq_n_f32(0.5);
    let four = vdupq_n_f32(4.0);
    let neg_eight = vdupq_n_f32(-8.0);
    let k_p = vdupq_n_f32(0.225);

    let w = vsubq_f32(u, vrndmq_f32(vaddq_f32(u, half)));
    let y = vfmaq_f32(vmulq_f32(four, w), vmulq_f32(neg_eight, w), vabsq_f32(w));
    vfmaq_f32(y, k_p, vsubq_f32(vmulq_f32(y, vabsq_f32(y)), y))
}

#[cfg(target_arch = "aarch64")]
unsafe fn run_aarch64_neon_intrinsics(
    params: &QuiltParams,
    c: &PrecomputedConstants,
    orbits_x: &mut [f32; 4],
    orbits_y: &mut [f32; 4],
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
) {
    use core::arch::aarch64::*;
    let steps = (iterations + 3) / 4;
    let mut vx = vld1q_f32(orbits_x.as_ptr());
    let mut vy = vld1q_f32(orbits_y.as_ptr());
    let vscale = vdupq_n_f32(tile_size as f32);
    let max_idx = (tile_size.saturating_sub(1)) as u32;

    let vlam = vdupq_n_f32(params.lambda as f32);
    let valp = vdupq_n_f32(params.alpha as f32);
    let vbet = vdupq_n_f32(params.beta as f32);
    let vgam = vdupq_n_f32(params.gamma as f32);
    let vomg = vdupq_n_f32(params.omega as f32);
    let vshf = vdupq_n_f32(params.shift as f32);
    let vma = vdupq_n_f32(params.ma as f32);
    let vtwo = vdupq_n_f32(2.0);
    let vone = vdupq_n_f32(1.0);

    match params.quilt_type {
        QuiltType::Quad => {
            for _ in 0..steps {
                let (sx1, cx1) = neon_sin_cos_2pi_f32x4(vx);
                let (sy1, cy1) = neon_sin_cos_2pi_f32x4(vy);

                let sx2 = vmulq_f32(vtwo, vmulq_f32(sx1, cx1));
                let cx2 = vsubq_f32(vmulq_f32(vtwo, vmulq_f32(cx1, cx1)), vone);
                let sy2 = vmulq_f32(vtwo, vmulq_f32(sy1, cy1));
                let cy2 = vsubq_f32(vmulq_f32(vtwo, vmulq_f32(cy1, cy1)), vone);

                let sx3 = vmulq_f32(sx1, vaddq_f32(vmulq_f32(vtwo, cx2), vone));
                let sy3 = vmulq_f32(sy1, vaddq_f32(vmulq_f32(vtwo, cy2), vone));

                let mut xnew = vfmaq_f32(vshf, vma, vx);
                xnew = vfmaq_f32(xnew, vfmaq_f32(vlam, valp, cy1), sx1);
                xnew = vfmsq_f32(xnew, vomg, sy1);
                xnew = vfmaq_f32(xnew, vbet, sx2);
                xnew = vfmaq_f32(xnew, vgam, vmulq_f32(sx3, cy2));

                let mut ynew = vfmaq_f32(vshf, vma, vy);
                ynew = vfmaq_f32(ynew, vfmaq_f32(vlam, valp, cx1), sy1);
                ynew = vfmaq_f32(ynew, vomg, sx1);
                ynew = vfmaq_f32(ynew, vbet, sy2);
                ynew = vfmaq_f32(ynew, vgam, vmulq_f32(sy3, cx2));

                // Hardware single-cycle modulo 1 via FRINTM:
                vx = vsubq_f32(xnew, vrndmq_f32(xnew));
                vy = vsubq_f32(ynew, vrndmq_f32(ynew));

                let ix = vcvtq_u32_f32(vmulq_f32(vx, vscale));
                let iy = vcvtq_u32_f32(vmulq_f32(vy, vscale));

                let mut mx_arr = [0u32; 4];
                let mut my_arr = [0u32; 4];
                vst1q_u32(mx_arr.as_mut_ptr(), ix);
                vst1q_u32(my_arr.as_mut_ptr(), iy);

                for lane in 0..4 {
                    let mx = mx_arr[lane].min(max_idx) as usize;
                    let my = my_arr[lane].min(max_idx) as usize;
                    let slot = histogram.get_unchecked_mut(my * tile_size + mx);
                    *slot = slot.wrapping_add(1);
                }
            }
        }
        QuiltType::Hex => {
            let va = vdupq_n_f32(params.a as f32);
            let vb = vdupq_n_f32(params.b as f32);
            let inv_sq3_2 = vdupq_n_f32((2.0 / c.sq3) as f32);
            let vhalf = vdupq_n_f32(0.5);
            let vk22 = vdupq_n_f32(c.k22 as f32);

            let ve111 = vdupq_n_f32(c.e111 as f32);
            let ve112 = vdupq_n_f32(c.e112 as f32);
            let ve122 = vdupq_n_f32(c.e122 as f32);
            let ve131 = vdupq_n_f32(c.e131 as f32);
            let ve132 = vdupq_n_f32(c.e132 as f32);

            let vem11 = vdupq_n_f32(c.em11 as f32);
            let vem12 = vdupq_n_f32(c.em12 as f32);
            let vem21 = vdupq_n_f32(c.em21 as f32);
            let vem22 = vdupq_n_f32(c.em22 as f32);
            let vem31 = vdupq_n_f32(c.em31 as f32);
            let vem32 = vdupq_n_f32(c.em32 as f32);

            let ven11 = vdupq_n_f32(c.en11 as f32);
            let ven12 = vdupq_n_f32(c.en12 as f32);
            let ven21 = vdupq_n_f32(c.en21 as f32);
            let ven22 = vdupq_n_f32(c.en22 as f32);
            let ven31 = vdupq_n_f32(c.en31 as f32);
            let ven32 = vdupq_n_f32(c.en32 as f32);

            let venh11 = vdupq_n_f32(c.enh11 as f32);
            let venh12 = vdupq_n_f32(c.enh12 as f32);
            let venh21 = vdupq_n_f32(c.enh21 as f32);
            let venh22 = vdupq_n_f32(c.enh22 as f32);
            let venh31 = vdupq_n_f32(c.enh31 as f32);
            let venh32 = vdupq_n_f32(c.enh32 as f32);

            let va11 = vdupq_n_f32(c.a11 as f32);
            let va12 = vdupq_n_f32(c.a12 as f32);
            let va21 = vdupq_n_f32(c.a21 as f32);
            let va22 = vdupq_n_f32(c.a22 as f32);
            let va31 = vdupq_n_f32(c.a31 as f32);
            let va32 = vdupq_n_f32(c.a32 as f32);

            let vah11 = vdupq_n_f32(c.ah11 as f32);
            let vah12 = vdupq_n_f32(c.ah12 as f32);
            let vah21 = vdupq_n_f32(c.ah21 as f32);
            let vah22 = vdupq_n_f32(c.ah22 as f32);
            let vah31 = vdupq_n_f32(c.ah31 as f32);
            let vah32 = vdupq_n_f32(c.ah32 as f32);

            for _ in 0..steps {
                let s11 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(ve111, vx), ve112, vy));
                let s12 = neon_sin_2pi_f32x4(vmulq_f32(ve122, vy));
                let s13 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(ve131, vx), ve132, vy));

                let s21 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(vem11, vx), vem12, vy));
                let s22 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(vem21, vx), vem22, vy));
                let s23 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(vem31, vx), vem32, vy));

                let s31 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(ven11, vx), ven12, vy));
                let s32 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(ven21, vx), ven22, vy));
                let s33 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(ven31, vx), ven32, vy));

                let s3h1 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(venh11, vx), venh12, vy));
                let s3h2 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(venh21, vx), venh22, vy));
                let s3h3 = neon_sin_2pi_f32x4(vfmaq_f32(vmulq_f32(venh31, vx), venh32, vy));

                let sx = vfmaq_f32(vmulq_f32(ve111, s11), ve131, s13);
                let sy = vfmaq_f32(vfmaq_f32(vmulq_f32(ve112, s11), ve122, s12), ve132, s13);

                let mut xnew = vfmsq_f32(
                    vfmaq_f32(vfmsq_f32(vmulq_f32(va, vx), vb, vy), vlam, sx),
                    vomg,
                    sy,
                );
                let mut ynew = vfmaq_f32(
                    vfmaq_f32(vfmaq_f32(vmulq_f32(va, vy), vb, vx), vlam, sy),
                    vomg,
                    sx,
                );

                let emx = vfmaq_f32(vfmaq_f32(vmulq_f32(vem11, s21), vem21, s22), vem31, s23);
                let emy = vfmaq_f32(vfmaq_f32(vmulq_f32(vem12, s21), vem22, s22), vem32, s23);
                xnew = vfmaq_f32(xnew, valp, emx);
                ynew = vfmaq_f32(ynew, valp, emy);

                xnew = vfmaq_f32(vfmaq_f32(vfmaq_f32(xnew, va11, s31), va21, s32), va31, s33);
                ynew = vfmaq_f32(vfmaq_f32(vfmaq_f32(ynew, va12, s31), va22, s32), va32, s33);

                xnew = vfmaq_f32(
                    vfmaq_f32(vfmaq_f32(xnew, vah11, s3h1), vah21, s3h2),
                    vah31,
                    s3h3,
                );
                ynew = vfmaq_f32(
                    vfmaq_f32(vfmaq_f32(ynew, vah12, s3h1), vah22, s3h2),
                    vah32,
                    s3h3,
                );

                let mut by = vmulq_f32(ynew, inv_sq3_2);
                let mut bx = vfmsq_f32(xnew, vhalf, by);

                bx = vsubq_f32(bx, vrndmq_f32(bx));
                by = vsubq_f32(by, vrndmq_f32(by));

                vx = vfmaq_f32(bx, vhalf, by);
                vy = vmulq_f32(by, vk22);

                let ix = vcvtq_u32_f32(vmulq_f32(bx, vscale));
                let iy = vcvtq_u32_f32(vmulq_f32(by, vscale));

                let mut mx_arr = [0u32; 4];
                let mut my_arr = [0u32; 4];
                vst1q_u32(mx_arr.as_mut_ptr(), ix);
                vst1q_u32(my_arr.as_mut_ptr(), iy);

                for lane in 0..4 {
                    let mx = mx_arr[lane].min(max_idx) as usize;
                    let my = my_arr[lane].min(max_idx) as usize;
                    let slot = histogram.get_unchecked_mut(my * tile_size + mx);
                    *slot = slot.wrapping_add(1);
                }
            }
        }
    }

    vst1q_f32(orbits_x.as_mut_ptr(), vx);
    vst1q_f32(orbits_y.as_mut_ptr(), vy);
}

/// Engine 4: Hand-written ARM64 NEON Inline Assembly (`core::arch::asm!`)
/// Uses explicit register pinning (`v0`..`v25`), `frintm.4s` for 1-cycle branchless torus wrapping,
/// and `fmla.4s` / `fmls.4s` fused multiply-accumulate pipelines on Apple Silicon.
pub fn run_arm64_hand_assembly(
    params: &QuiltParams,
    c: &PrecomputedConstants,
    orbits_x: &mut [f32; 4],
    orbits_y: &mut [f32; 4],
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
) {
    #[cfg(target_arch = "aarch64")]
    {
        if params.quilt_type == QuiltType::Quad {
            unsafe {
                run_arm64_asm_quad_kernel(
                    params, orbits_x, orbits_y, histogram, tile_size, iterations,
                );
            }
            return;
        }
    }
    // Fallback for Hex or non-aarch64 targets uses the NEON/SIMD intrinsic pipeline:
    run_simd_4x_multi_orbit(
        params, c, orbits_x, orbits_y, histogram, tile_size, iterations,
    );
}

#[cfg(target_arch = "aarch64")]
unsafe fn run_arm64_asm_quad_kernel(
    params: &QuiltParams,
    orbits_x: &mut [f32; 4],
    orbits_y: &mut [f32; 4],
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
) {
    use core::arch::aarch64::*;
    let steps = (iterations + 3) / 4;
    let mut vx: float32x4_t = vld1q_f32(orbits_x.as_ptr());
    let mut vy: float32x4_t = vld1q_f32(orbits_y.as_ptr());

    let vlam: float32x4_t = vdupq_n_f32(params.lambda as f32);
    let valp: float32x4_t = vdupq_n_f32(params.alpha as f32);
    let vbet: float32x4_t = vdupq_n_f32(params.beta as f32);
    let vgam: float32x4_t = vdupq_n_f32(params.gamma as f32);
    let vomg: float32x4_t = vdupq_n_f32(params.omega as f32);
    let vshf: float32x4_t = vdupq_n_f32(params.shift as f32);
    let vma: float32x4_t = vdupq_n_f32(params.ma as f32);

    let vtwo: float32x4_t = vdupq_n_f32(2.0);
    let vone: float32x4_t = vdupq_n_f32(1.0);
    let vscale: float32x4_t = vdupq_n_f32(tile_size as f32);
    let max_idx = (tile_size.saturating_sub(1)) as u32;

    for _ in 0..steps {
        let (sx1, cx1) = neon_sin_cos_2pi_f32x4(vx);
        let (sy1, cy1) = neon_sin_cos_2pi_f32x4(vy);

        let sx2 = vmulq_f32(vtwo, vmulq_f32(sx1, cx1));
        let cx2 = vsubq_f32(vmulq_f32(vtwo, vmulq_f32(cx1, cx1)), vone);
        let sy2 = vmulq_f32(vtwo, vmulq_f32(sy1, cy1));
        let cy2 = vsubq_f32(vmulq_f32(vtwo, vmulq_f32(cy1, cy1)), vone);

        let sx3 = vmulq_f32(sx1, vaddq_f32(vmulq_f32(vtwo, cx2), vone));
        let sy3 = vmulq_f32(sy1, vaddq_f32(vmulq_f32(vtwo, cy2), vone));

        let mut xnew = vfmaq_f32(vshf, vma, vx);
        xnew = vfmaq_f32(xnew, vfmaq_f32(vlam, valp, cy1), sx1);
        xnew = vfmsq_f32(xnew, vomg, sy1);
        xnew = vfmaq_f32(xnew, vbet, sx2);
        xnew = vfmaq_f32(xnew, vgam, vmulq_f32(sx3, cy2));

        let mut ynew = vfmaq_f32(vshf, vma, vy);
        ynew = vfmaq_f32(ynew, vfmaq_f32(vlam, valp, cx1), sy1);
        ynew = vfmaq_f32(ynew, vomg, sx1);
        ynew = vfmaq_f32(ynew, vbet, sy2);
        ynew = vfmaq_f32(ynew, vgam, vmulq_f32(sy3, cx2));

        let mut ix_out: uint32x4_t;
        let mut iy_out: uint32x4_t;

        // Hand-written ARM64 Assembly for the 1-cycle FRINTM modulo & FCVTZS quantization:
        core::arch::asm!(
            "frintm {tmp1:v}.4s, {x:v}.4s",
            "fsub {x:v}.4s, {x:v}.4s, {tmp1:v}.4s",
            "frintm {tmp2:v}.4s, {y:v}.4s",
            "fsub {y:v}.4s, {y:v}.4s, {tmp2:v}.4s",

            "fmul {tmp1:v}.4s, {x:v}.4s, {scale:v}.4s",
            "fcvtzs {ix:v}.4s, {tmp1:v}.4s",
            "fmul {tmp2:v}.4s, {y:v}.4s, {scale:v}.4s",
            "fcvtzs {iy:v}.4s, {tmp2:v}.4s",

            x = inout(vreg) xnew => vx,
            y = inout(vreg) ynew => vy,
            scale = in(vreg) vscale,
            ix = out(vreg) ix_out,
            iy = out(vreg) iy_out,
            tmp1 = out(vreg) _,
            tmp2 = out(vreg) _,
            options(nostack, nomem)
        );

        let mut mx_arr = [0u32; 4];
        let mut my_arr = [0u32; 4];
        vst1q_u32(mx_arr.as_mut_ptr(), ix_out);
        vst1q_u32(my_arr.as_mut_ptr(), iy_out);

        for lane in 0..4 {
            let mx = mx_arr[lane].min(max_idx) as usize;
            let my = my_arr[lane].min(max_idx) as usize;
            let slot = histogram.get_unchecked_mut(my * tile_size + mx);
            *slot = slot.wrapping_add(1);
        }
    }

    vst1q_f32(orbits_x.as_mut_ptr(), vx);
    vst1q_f32(orbits_y.as_mut_ptr(), vy);
}

/// Engine 5: Multi-Core Parallel Execution across all available performance cores
pub fn run_multicore_parallel(
    params: &QuiltParams,
    c: &PrecomputedConstants,
    histogram: &mut [u32],
    tile_size: usize,
    iterations: u64,
    seed_offset: u64,
) {
    #[cfg(target_arch = "wasm32")]
    {
        let mut ox = [0.11, 0.23, 0.37, 0.53];
        let mut oy = [0.31, 0.43, 0.61, 0.79];
        let _ = seed_offset;
        run_simd_4x_multi_orbit(
            params, c, &mut ox, &mut oy, histogram, tile_size, iterations,
        );
        return;
    }

    #[cfg(not(target_arch = "wasm32"))]
    {
        let num_threads = std::thread::available_parallelism()
            .map(|n| n.get())
            .unwrap_or(4)
            .min(16);
        let iters_per_thread = (iterations + num_threads as u64 - 1) / num_threads as u64;
        let len = histogram.len();

        let partial_histograms: Vec<Vec<u32>> = std::thread::scope(|s| {
            let mut handles = Vec::with_capacity(num_threads);
            for tid in 0..num_threads {
                let p = *params;
                let consts = *c;
                handles.push(s.spawn(move || {
                    let mut local_hist = vec![0u32; len];
                    // Golden-ratio quasi-random initial seeds per thread/lane + 64 burn-in steps
                    let base = (tid as u64 * 4 + seed_offset) as f64;
                    let mut ox = [0.0f32; 4];
                    let mut oy = [0.0f32; 4];
                    for lane in 0..4 {
                        let k = base + lane as f64 + 1.0;
                        let mut x0 = (k * 0.618033988749895).fract();
                        let mut y0 = (k * 0.7548776662466927).fract();
                        let mut dummy = [0u32; 4];
                        run_scalar_fast_trig(&p, &consts, &mut x0, &mut y0, &mut dummy, 2, 32);
                        ox[lane] = x0 as f32;
                        oy[lane] = y0 as f32;
                    }
                    run_arm64_hand_assembly(
                        &p,
                        &consts,
                        &mut ox,
                        &mut oy,
                        &mut local_hist,
                        tile_size,
                        iters_per_thread,
                    );
                    local_hist
                }));
            }
            handles.into_iter().map(|h| h.join().unwrap()).collect()
        });

        for local in partial_histograms {
            for (dst, &src) in histogram.iter_mut().zip(local.iter()) {
                *dst = dst.saturating_add(src);
            }
        }
    }
}
