//! CLI Benchmark Arena for `quilts-core` on Apple Silicon / x86_64.
//! Compares all 5 CPU compute engines (Scalar 1996, Branchless FastTrig, 4x SIMD/NEON,
//! Hand-Tuned ARM64 Assembly, and Multi-Core Parallel) for both Quadratic and Hexagonal Quilts.

use quilts_core::engines::ComputeBackend;
use quilts_core::params::QuiltParams;
use quilts_core::QuiltSimulator;
use std::time::Instant;

fn run_bench_for_params(label: &str, params: QuiltParams, iterations: u64) {
    println!("================================================================================");
    println!("  {} ({:?}, {}M iterations)", label, params.quilt_type, iterations / 1_000_000);
    println!("================================================================================");
    println!(
        "  {:<54} | {:>10} | {:>12} | {:>8}",
        "Compute Engine", "Time (ms)", "Throughput", "Speedup"
    );
    println!("--------------------------------------------------------------------------------");

    let backends = [
        ComputeBackend::Scalar1996,
        ComputeBackend::ScalarFastTrig,
        ComputeBackend::Simd4xMultiOrbit,
        ComputeBackend::Arm64HandAssembly,
        ComputeBackend::MultiCoreParallel,
    ];

    let mut baseline_miter_s = 0.0;

    for backend in backends {
        let mut sim = QuiltSimulator::new(512);
        sim.set_params(params);
        sim.backend = backend;

        // Warm-up (100k iterations)
        sim.step_iterations(100_000);
        sim.reset_histogram();

        let t0 = Instant::now();
        sim.step_iterations(iterations);
        let elapsed = t0.elapsed().as_secs_f64();

        let miter_s = (iterations as f64 / 1_000_000.0) / elapsed;
        if backend == ComputeBackend::Scalar1996 {
            baseline_miter_s = miter_s;
        }
        let speedup = if baseline_miter_s > 0.0 {
            miter_s / baseline_miter_s
        } else {
            1.0
        };

        println!(
            "  {:<54} | {:>8.2}ms | {:>7.1} MIt/s | {:>6.2}x",
            backend.name(),
            elapsed * 1000.0,
            miter_s,
            speedup
        );
    }
    println!();
}

fn main() {
    let cores = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(1);
    println!("\nQUILTS V2.0 - HARDWARE COMPUTE BENCHMARK ARENA");
    println!(
        "Detected Architecture: {} | Hardware Threads: {} | Auto-Selected Engine: {}",
        std::env::consts::ARCH,
        cores,
        ComputeBackend::detect_fastest().name()
    );
    println!();

    let iterations = 20_000_000;
    run_bench_for_params(
        "Quadratic Quilt (ABB2_6 / Default Quad 1996)",
        QuiltParams::default_quad_1996(),
        iterations,
    );
    run_bench_for_params(
        "Hexagonal Quilt (ABB3_28 / Default Hex 1996)",
        QuiltParams::default_hex_1996(),
        iterations,
    );
}
