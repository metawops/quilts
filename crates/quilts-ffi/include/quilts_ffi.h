#ifndef QUILTS_FFI_H
#define QUILTS_FFI_H

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct QuiltSimulator QuiltSimulator;

QuiltSimulator* quilts_sim_create(size_t tile_size);
void quilts_sim_destroy(QuiltSimulator* sim);

void quilts_sim_set_params(
    QuiltSimulator* sim,
    uint32_t quilt_type,
    double lambda,
    double alpha,
    double beta,
    double gamma,
    double omega,
    double shift,
    double ma,
    double a,
    double b
);

void quilts_sim_set_backend(QuiltSimulator* sim, uint32_t backend_id);

void quilts_sim_set_display_options(
    QuiltSimulator* sim,
    size_t nperiod,
    uint32_t low_border,
    uint8_t black_index,
    uint8_t color_offset,
    uint32_t mapping_mode,
    float gamma
);

uint64_t quilts_sim_step(QuiltSimulator* sim, uint64_t iterations);

void quilts_sim_render_rgba(
    QuiltSimulator* sim,
    uint8_t* out_rgba_ptr,
    size_t width,
    size_t height
);

const uint32_t* quilts_sim_histogram_ptr(const QuiltSimulator* sim);

#ifdef __cplusplus
}
#endif

#endif /* QUILTS_FFI_H */
