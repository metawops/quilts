//! C-ABI Zero-Copy Bridge (`quilts-ffi`) for Swift (macOS / iPadOS / iOS).

use quilts_core::engines::ComputeBackend;
use quilts_core::palette::ColorMappingMode;
use quilts_core::params::{QuiltParams, QuiltType};
use quilts_core::QuiltSimulator;
use std::slice;

#[no_mangle]
pub extern "C" fn quilts_sim_create(tile_size: usize) -> *mut QuiltSimulator {
    Box::into_raw(Box::new(QuiltSimulator::new(tile_size)))
}

#[no_mangle]
pub unsafe extern "C" fn quilts_sim_destroy(sim: *mut QuiltSimulator) {
    if !sim.is_null() {
        drop(Box::from_raw(sim));
    }
}

#[no_mangle]
pub unsafe extern "C" fn quilts_sim_set_params(
    sim: *mut QuiltSimulator,
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
    let Some(s) = sim.as_mut() else { return };
    s.set_params(QuiltParams {
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
pub unsafe extern "C" fn quilts_sim_set_backend(sim: *mut QuiltSimulator, backend_id: u32) {
    let Some(s) = sim.as_mut() else { return };
    s.backend = match backend_id {
        0 => ComputeBackend::Scalar1996,
        1 => ComputeBackend::ScalarFastTrig,
        2 => ComputeBackend::Simd4xMultiOrbit,
        3 => ComputeBackend::Arm64HandAssembly,
        _ => ComputeBackend::MultiCoreParallel,
    };
}

#[no_mangle]
pub unsafe extern "C" fn quilts_sim_set_display_options(
    sim: *mut QuiltSimulator,
    nperiod: usize,
    low_border: u32,
    black_index: u8,
    color_offset: u8,
    mapping_mode: u32,
    gamma: f32,
) {
    let Some(s) = sim.as_mut() else { return };
    s.nperiod = nperiod.max(1);
    s.palette.low_border = low_border;
    s.palette.black_index = black_index;
    s.palette.color_offset = color_offset;
    s.palette.mapping_mode = match mapping_mode {
        0 => ColorMappingMode::Classic1996,
        1 => ColorMappingMode::LogarithmicHdr,
        _ => ColorMappingMode::SqrtGamma,
    };
    s.palette.gamma = gamma;
}

#[no_mangle]
pub unsafe extern "C" fn quilts_sim_step(sim: *mut QuiltSimulator, iterations: u64) -> u64 {
    let Some(s) = sim.as_mut() else { return 0 };
    s.step_iterations(iterations);
    s.total_iterations
}

#[no_mangle]
pub unsafe extern "C" fn quilts_sim_render_rgba(
    sim: *mut QuiltSimulator,
    out_rgba_ptr: *mut u8,
    width: usize,
    height: usize,
) {
    let Some(s) = sim.as_mut() else { return };
    if out_rgba_ptr.is_null() {
        return;
    }
    let buf = slice::from_raw_parts_mut(out_rgba_ptr, width * height * 4);
    s.render_rgba(buf, width, height);
}

#[no_mangle]
pub unsafe extern "C" fn quilts_sim_histogram_ptr(sim: *const QuiltSimulator) -> *const u32 {
    let Some(s) = sim.as_ref() else {
        return std::ptr::null();
    };
    s.histogram.as_ptr()
}
