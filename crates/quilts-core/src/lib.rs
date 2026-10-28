//! `quilts-core`: High-performance modular compute engine for Symmetric Chaos Quilts (1996 -> 2026).

pub mod engines;
pub mod palette;
pub mod params;
pub mod renderer;

use engines::ComputeBackend;
use palette::Palette;
use params::{PrecomputedConstants, QuiltParams};

pub struct QuiltSimulator {
    pub params: QuiltParams,
    pub consts: PrecomputedConstants,
    pub palette: Palette,
    pub backend: ComputeBackend,
    pub tile_size: usize,
    pub nperiod: usize,
    pub total_iterations: u64,
    pub histogram: Vec<u32>,
    pub max_hit: u32,
    pub min_hit: u32,
    orbit_x: f64,
    orbit_y: f64,
    simd_orbits_x: [f64; 4],
    simd_orbits_y: [f64; 4],
}

impl QuiltSimulator {
    pub fn new(tile_size: usize) -> Self {
        let tile_size = tile_size.max(64);
        let params = QuiltParams::default_hex_1996();
        let consts = PrecomputedConstants::from_params(&params);
        Self {
            params,
            consts,
            palette: Palette::default(),
            backend: ComputeBackend::detect_fastest(),
            tile_size,
            nperiod: 3,
            total_iterations: 0,
            histogram: vec![0u32; tile_size * tile_size],
            max_hit: 0,
            min_hit: 0,
            orbit_x: 0.1,
            orbit_y: 0.334,
            simd_orbits_x: [0.1, 0.23, 0.47, 0.71],
            simd_orbits_y: [0.334, 0.51, 0.19, 0.83],
        }
    }

    pub fn reset_histogram(&mut self) {
        self.histogram.fill(0);
        self.total_iterations = 0;
        self.max_hit = 0;
        self.min_hit = 0;
        self.orbit_x = 0.1;
        self.orbit_y = 0.334;
        self.simd_orbits_x = [0.1, 0.23, 0.47, 0.71];
        self.simd_orbits_y = [0.334, 0.51, 0.19, 0.83];
    }

    pub fn set_params(&mut self, params: QuiltParams) {
        self.params = params;
        self.consts = PrecomputedConstants::from_params(&self.params);
        self.reset_histogram();
    }

    pub fn resize_tile(&mut self, new_tile_size: usize) {
        let new_tile_size = new_tile_size.max(64);
        if new_tile_size != self.tile_size {
            self.tile_size = new_tile_size;
            self.histogram = vec![0u32; new_tile_size * new_tile_size];
            self.reset_histogram();
        }
    }

    pub fn step_iterations(&mut self, count: u64) {
        match self.backend {
            ComputeBackend::Scalar1996 => {
                engines::run_scalar_1996(
                    &self.params,
                    &self.consts,
                    &mut self.orbit_x,
                    &mut self.orbit_y,
                    &mut self.histogram,
                    self.tile_size,
                    count,
                );
            }
            ComputeBackend::ScalarFastTrig => {
                engines::run_scalar_fast_trig(
                    &self.params,
                    &self.consts,
                    &mut self.orbit_x,
                    &mut self.orbit_y,
                    &mut self.histogram,
                    self.tile_size,
                    count,
                );
            }
            ComputeBackend::Simd4xMultiOrbit => {
                engines::run_simd_4x_multi_orbit(
                    &self.params,
                    &self.consts,
                    &mut self.simd_orbits_x,
                    &mut self.simd_orbits_y,
                    &mut self.histogram,
                    self.tile_size,
                    count,
                );
            }
            ComputeBackend::Arm64HandAssembly => {
                engines::run_arm64_hand_assembly(
                    &self.params,
                    &self.consts,
                    &mut self.simd_orbits_x,
                    &mut self.simd_orbits_y,
                    &mut self.histogram,
                    self.tile_size,
                    count,
                );
            }
            ComputeBackend::MultiCoreParallel => {
                engines::run_multicore_parallel(
                    &self.params,
                    &self.consts,
                    &mut self.histogram,
                    self.tile_size,
                    count,
                    self.total_iterations,
                );
            }
        }
        self.total_iterations = self.total_iterations.saturating_add(count);
    }

    pub fn update_hit_stats(&mut self) {
        let mut max_h = 0u32;
        let mut min_h = u32::MAX;
        for &h in &self.histogram {
            if h > max_h {
                max_h = h;
            }
            if h < min_h {
                min_h = h;
            }
        }
        self.max_hit = max_h;
        self.min_hit = if min_h == u32::MAX { 0 } else { min_h };
    }

    pub fn render_rgba(&mut self, out_rgba: &mut [u8], width: usize, height: usize) {
        self.update_hit_stats();
        renderer::render_quilt_to_rgba(
            &self.histogram,
            self.tile_size,
            self.params.quilt_type,
            &self.palette,
            self.nperiod,
            self.max_hit,
            out_rgba,
            width,
            height,
        );
    }
}
