//! High-speed 2D Canvas RGBA8888 renderer with periodic Quilt tiling (`nperiod`)
//! Supports both Quadratic (`plotpointsQuad`) and Hexagonal (`plotpointsHex`) lattice tilings.

use crate::palette::{ColorMappingMode, Palette};
use crate::params::QuiltType;

pub fn render_quilt_to_rgba(
    histogram: &[u32],
    tile_size: usize,
    quilt_type: QuiltType,
    palette: &Palette,
    nperiod: usize,
    max_hit: u32,
    out_rgba: &mut [u8],
    canvas_width: usize,
    canvas_height: usize,
) {
    let nperiod = nperiod.max(1);
    let lut = palette.build_rgba_lut();
    let low_border = palette.low_border;
    let mode = palette.mapping_mode;
    let gamma_inv = 1.0 / palette.gamma.max(0.1);
    let log_max = ((max_hit.max(2) as f32).ln()).max(1.0);
    let sqrt_max = ((max_hit.max(2) as f32).sqrt()).max(1.0);

    // Pre-map the fundamental tile [tile_size x tile_size] from hit count to packed RGBA u32
    let mut tile_rgba = vec![lut[0]; tile_size * tile_size];
    for (idx, &mc) in histogram.iter().enumerate().take(tile_size * tile_size) {
        if mc == 0 || mc < low_border {
            tile_rgba[idx] = lut[0];
        } else {
            let color_idx: usize = match mode {
                ColorMappingMode::Classic1996 => (mc as usize).min(254),
                ColorMappingMode::LogarithmicHdr => {
                    let norm = ((mc as f32).ln() / log_max).clamp(0.0, 1.0).powf(gamma_inv);
                    (1 + (norm * 253.0) as usize).clamp(1, 254)
                }
                ColorMappingMode::SqrtGamma => {
                    let norm = ((mc as f32).sqrt() / sqrt_max)
                        .clamp(0.0, 1.0)
                        .powf(gamma_inv);
                    (1 + (norm * 253.0) as usize).clamp(1, 254)
                }
            };
            tile_rgba[idx] = lut[color_idx];
        }
    }

    let period_f = nperiod as f64;
    let scale_t = tile_size as f64;
    let inv_w = period_f / (canvas_width.max(1) as f64);
    let inv_h = period_f / (canvas_height.max(1) as f64);
    let two_over_sq3 = 2.0 / 3.0_f64.sqrt();

    match quilt_type {
        QuiltType::Quad => {
            // Precompute x-table for instant row rendering
            let mut x_lut = vec![0usize; canvas_width];
            for px in 0..canvas_width {
                let u = (px as f64 * inv_w).fract();
                x_lut[px] = ((u * scale_t) as usize).min(tile_size - 1);
            }

            for py in 0..canvas_height {
                // Note: In QUILTS.PAS line 507: ypix := trunc(npixely - npixely*y / nperiod);
                // So y=0 is at the bottom, y=nperiod is at the top.
                let y_world = (canvas_height - 1 - py) as f64 * inv_h;
                let v = y_world.fract();
                let my = ((v * scale_t) as usize).min(tile_size - 1);
                let tile_row = &tile_rgba[my * tile_size..(my + 1) * tile_size];
                let dst_row_start = py * canvas_width * 4;

                for px in 0..canvas_width {
                    let rgba = tile_row[x_lut[px]];
                    let offset = dst_row_start + px * 4;
                    out_rgba[offset..offset + 4].copy_from_slice(&rgba.to_le_bytes());
                }
            }
        }
        QuiltType::Hex => {
            // In QUILTS.PAS (`iterateHex` & `plotpointsHex`, lines 576-588, 856-868):
            // Cartesian (x, y) relates to oblique hex lattice coordinates (bx, by) via:
            //   by = (2 / sqrt(3)) * y
            //   bx = x - 0.5 * by
            // And both bx, by are wrapped modulo 1 into [0, 1)^2!
            for py in 0..canvas_height {
                let y_world = (canvas_height - 1 - py) as f64 * inv_h;
                let by_raw = y_world * two_over_sq3;
                let half_by = 0.5 * by_raw;
                let by = by_raw - by_raw.floor();
                let my = ((by * scale_t) as usize).min(tile_size - 1);
                let tile_row = &tile_rgba[my * tile_size..(my + 1) * tile_size];
                let dst_row_start = py * canvas_width * 4;

                for px in 0..canvas_width {
                    let x_world = px as f64 * inv_w;
                    let bx_raw = x_world - half_by;
                    let bx = bx_raw - bx_raw.floor();
                    let mx = ((bx * scale_t) as usize).min(tile_size - 1);
                    let rgba = tile_row[mx];
                    let offset = dst_row_start + px * 4;
                    out_rgba[offset..offset + 4].copy_from_slice(&rgba.to_le_bytes());
                }
            }
        }
    }
}
