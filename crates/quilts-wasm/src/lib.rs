//! Dependency-free WebAssembly C-ABI exports for `quilts-core`
//! Can be compiled directly via `cargo build --release --target wasm32-unknown-unknown`
//! without requiring external `wasm-bindgen` CLI tooling!

use quilts_core::engines::ComputeBackend;
use quilts_core::palette::{ColorMappingMode, RgbColor};
use quilts_core::params::{QuiltParams, QuiltType};
use quilts_core::QuiltSimulator;

pub struct WasmContext {
    pub sim: QuiltSimulator,
    pub rgba_buffer: Vec<u8>,
    pub canvas_w: usize,
    pub canvas_h: usize,
}

#[no_mangle]
pub extern "C" fn wasm_quilt_create(tile_size: usize, canvas_w: usize, canvas_h: usize) -> *mut WasmContext {
    let sim = QuiltSimulator::new(tile_size);
    let rgba_buffer = vec![0u8; canvas_w * canvas_h * 4];
    Box::into_raw(Box::new(WasmContext {
        sim,
        rgba_buffer,
        canvas_w,
        canvas_h,
    }))
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_set_params(
    ctx: *mut WasmContext,
    quilt_type: u32,
    lambda: f64,
    alpha: f64,
    beta: f64,
    gamma: f64,
    omega: f64,
    shift: f64,
    ma: f64,
    a: f64,
    b: f64,
) {
    let Some(c) = ctx.as_mut() else { return };
    c.sim.set_params(QuiltParams {
        quilt_type: if quilt_type == 0 {
            QuiltType::Quad
        } else {
            QuiltType::Hex
        },
        lambda,
        alpha,
        beta,
        gamma,
        omega,
        shift,
        ma,
        a,
        b,
    });
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_set_backend(ctx: *mut WasmContext, backend_id: u32) {
    let Some(c) = ctx.as_mut() else { return };
    c.sim.backend = match backend_id {
        0 => ComputeBackend::Scalar1996,
        1 => ComputeBackend::ScalarFastTrig,
        _ => ComputeBackend::Simd4xMultiOrbit,
    };
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_set_palette_color(
    ctx: *mut WasmContext,
    index: usize,
    r: u8,
    g: u8,
    b: u8,
) {
    let Some(c) = ctx.as_mut() else { return };
    if index < 256 {
        c.sim.palette.colors[index] = RgbColor { r, g, b };
    }
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_set_display(
    ctx: *mut WasmContext,
    nperiod: usize,
    low_border: u32,
    black_index: u8,
    color_offset: u8,
    mapping_mode: u32,
    gamma: f32,
) {
    let Some(c) = ctx.as_mut() else { return };
    c.sim.nperiod = nperiod.max(1);
    c.sim.palette.low_border = low_border;
    c.sim.palette.black_index = black_index;
    c.sim.palette.color_offset = color_offset;
    c.sim.palette.mapping_mode = match mapping_mode {
        0 => ColorMappingMode::Classic1996,
        1 => ColorMappingMode::LogarithmicHdr,
        _ => ColorMappingMode::SqrtGamma,
    };
    c.sim.palette.gamma = gamma;
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_step(ctx: *mut WasmContext, iterations: u32) -> f64 {
    let Some(c) = ctx.as_mut() else { return 0.0 };
    c.sim.step_iterations(iterations as u64);
    c.sim.total_iterations as f64
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_reset(ctx: *mut WasmContext, tile_size: usize) {
    let Some(c) = ctx.as_mut() else { return };
    c.sim.resize_tile(tile_size);
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_histogram_ptr(ctx: *const WasmContext) -> *const u32 {
    let Some(c) = ctx.as_ref() else {
        return std::ptr::null();
    };
    c.sim.histogram.as_ptr()
}

#[no_mangle]
pub unsafe extern "C" fn wasm_quilt_render(ctx: *mut WasmContext) -> *const u8 {
    let Some(c) = ctx.as_mut() else {
        return std::ptr::null();
    };
    c.sim.render_rgba(&mut c.rgba_buffer, c.canvas_w, c.canvas_h);
    c.rgba_buffer.as_ptr()
}
