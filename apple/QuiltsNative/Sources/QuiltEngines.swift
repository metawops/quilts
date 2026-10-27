import Foundation
import Accelerate
import Metal
import simd

public enum NativeComputeEngine: String, CaseIterable, Identifiable {
    case scalar1996 = "1. Pascal 1996 Reference (Scalar 1:1)"
    case swiftSIMD4 = "2. Swift Native SIMD4 + Chebyshev Fast-Trig"
    case accelerateMultiCore = "3. Apple Accelerate (vForce) + Multi-Core GCD"
    case metalGPU = "4. Apple Metal GPU Compute Shader (Unified Memory)"

    public var id: String { rawValue }
}

public final class NativeQuiltSimulator {
    public var params: QuiltPreset
    public var tileSize: Int
    public var histogram: [UInt32]
    public var totalIterations: UInt64 = 0
    public var orbitX: Double = 0.1
    public var orbitY: Double = 0.334
    public var simdX = SIMD4<Float>(0.1, 0.23, 0.47, 0.71)
    public var simdY = SIMD4<Float>(0.334, 0.51, 0.19, 0.83)

    // Metal GPU state
    private let metalDevice: MTLDevice?
    private let commandQueue: MTLCommandQueue?
    private var computePipeline: MTLComputePipelineState?
    private var orbitBuffer: MTLBuffer?
    private var histBuffer: MTLBuffer?
    private let gpuThreadCount = 16384

    public init(tileSize: Int = 384, initialPreset: QuiltPreset = .defaultHex1996) {
        self.tileSize = tileSize
        self.params = initialPreset
        self.histogram = Array(repeating: 0, count: tileSize * tileSize)

        self.metalDevice = MTLCreateSystemDefaultDevice()
        self.commandQueue = metalDevice?.makeCommandQueue()
        setupMetalPipeline()
    }

    private func setupMetalPipeline() {
        guard let device = metalDevice else { return }
        let shaderSource = """
        #include <metal_stdlib>
        using namespace metal;
        struct MetalQuiltParams {
            uint quiltType; uint tileSize; uint stepsPerThread; uint padding;
            float lambda; float alpha; float beta; float gamma; float omega; float shift; float ma; float a; float b;
            float a11, a12, a21, a22, a31, a32;
            float ah11, ah12, ah21, ah22, ah31, ah32;
        };
        kernel void quilt_iterate_kernel(
            device float2* orbits [[buffer(0)]],
            device atomic_uint* histogram [[buffer(1)]],
            constant MetalQuiltParams& p [[buffer(2)]],
            uint gid [[thread_position_in_grid]]
        ) {
            float2 pos = orbits[gid];
            float x = pos.x; float y = pos.y;
            const float p2 = 6.28318530718f; const float p4 = 12.56637061436f; const float p6 = 18.84955592154f;
            const float sq3 = 1.73205080757f; const float invSq3_2 = 2.0f / sq3; const float k22 = sq3 * 0.5f;
            const float scale = float(p.tileSize); const uint maxIdx = p.tileSize - 1;
            if (p.quiltType == 0) {
                for (uint i = 0; i < p.stepsPerThread; ++i) {
                    float sx = fast::sin(p2 * x); float sy = fast::sin(p2 * y);
                    float cx = fast::cos(p2 * x); float cy = fast::cos(p2 * y);
                    float xnew = (p.lambda + p.alpha * cy) * sx - p.omega * sy + p.beta * fast::sin(p4 * x) + p.gamma * fast::sin(p6 * x) * fast::cos(p4 * y) + p.ma * x + p.shift;
                    float ynew = (p.lambda + p.alpha * cx) * sy + p.omega * sx + p.beta * fast::sin(p4 * y) + p.gamma * fast::sin(p6 * y) * fast::cos(p4 * x) + p.ma * y + p.shift;
                    x = xnew - floor(xnew); y = ynew - floor(ynew);
                    uint mx = min(maxIdx, uint(x * scale)); uint my = min(maxIdx, uint(y * scale));
                    atomic_fetch_add_explicit(&histogram[my * p.tileSize + mx], 1u, memory_order_relaxed);
                }
            } else {
                const float e111 = 1.0f, e112 = -1.0f / sq3, e122 = 2.0f / sq3, e131 = -1.0f, e132 = -(e112 + e122);
                const float em11 = 2.0f * e111, em12 = 2.0f * e112 + e122, em21 = e131, em22 = 2.0f * e122 + e132, em31 = 2.0f * e131 + e111, em32 = 2.0f * e132 + e112;
                const float en11 = 3.0f * e111, en12 = 3.0f * e112 + 2.0f * e122, en21 = 2.0f * e131, en22 = 3.0f * e122 + 2.0f * e132, en31 = 3.0f * e131 + 2.0f * e111, en32 = 3.0f * e132 + 2.0f * e112;
                const float enh11 = 3.0f * e111, enh12 = 3.0f * e112 + e122, enh21 = e131, enh22 = 3.0f * e122 + e132, enh31 = 3.0f * e131 + e111, enh32 = 3.0f * e132 + e112;
                for (uint i = 0; i < p.stepsPerThread; ++i) {
                    float s11 = fast::sin(p2 * (e111 * x + e112 * y)); float s12 = fast::sin(p2 * (e122 * y)); float s13 = fast::sin(p2 * (e131 * x + e132 * y));
                    float s21 = fast::sin(p2 * (em11 * x + em12 * y)); float s22 = fast::sin(p2 * (em21 * x + em22 * y)); float s23 = fast::sin(p2 * (em31 * x + em32 * y));
                    float s31 = fast::sin(p2 * (en11 * x + en12 * y)); float s32 = fast::sin(p2 * (en21 * x + en22 * y)); float s33 = fast::sin(p2 * (en31 * x + en32 * y));
                    float s3h1 = fast::sin(p2 * (enh11 * x + enh12 * y)); float s3h2 = fast::sin(p2 * (enh21 * x + enh22 * y)); float s3h3 = fast::sin(p2 * (enh31 * x + enh32 * y));
                    float sx = e111 * s11 + e131 * s13; float sy = e112 * s11 + e122 * s12 + e132 * s13;
                    float xnew = p.a * x - p.b * y + p.lambda * sx - p.omega * sy + p.alpha * (em11 * s21 + em21 * s22 + em31 * s23) + p.a11 * s31 + p.a21 * s32 + p.a31 * s33 + p.ah11 * s3h1 + p.ah21 * s3h2 + p.ah31 * s3h3;
                    float ynew = p.a * y + p.b * x + p.lambda * sy + p.omega * sx + p.alpha * (em12 * s21 + em22 * s22 + em32 * s23) + p.a12 * s31 + p.a22 * s32 + p.a32 * s33 + p.ah12 * s3h1 + p.ah22 * s3h2 + p.ah32 * s3h3;
                    float by = ynew * invSq3_2; float bx = xnew - 0.5f * by;
                    bx = bx - floor(bx); by = by - floor(by);
                    x = bx + 0.5f * by; y = by * k22;
                    uint mx = min(maxIdx, uint(bx * scale)); uint my = min(maxIdx, uint(by * scale));
                    atomic_fetch_add_explicit(&histogram[my * p.tileSize + mx], 1u, memory_order_relaxed);
                }
            }
            orbits[gid] = float2(x, y);
        }
        """
        if let library = try? device.makeLibrary(source: shaderSource, options: nil),
           let fn = library.makeFunction(name: "quilt_iterate_kernel") {
            computePipeline = try? device.makeComputePipelineState(function: fn)
        }
        allocateMetalBuffers()
    }

    private func allocateMetalBuffers() {
        guard let device = metalDevice else { return }
        var initialOrbits = [SIMD2<Float>](repeating: .zero, count: gpuThreadCount)
        for i in 0..<gpuThreadCount {
            let k = Float(i + 1)
            let rx = fmod(k * 0.61803398875, 1.0)
            let ry = fmod(k * 0.75487766625, 1.0)
            initialOrbits[i] = SIMD2<Float>(rx, ry)
        }
        orbitBuffer = device.makeBuffer(
            bytes: initialOrbits,
            length: gpuThreadCount * MemoryLayout<SIMD2<Float>>.stride,
            options: .storageModeShared
        )
        histBuffer = device.makeBuffer(
            length: tileSize * tileSize * MemoryLayout<UInt32>.stride,
            options: .storageModeShared
        )
        if let ptr = histBuffer?.contents() {
            memset(ptr, 0, tileSize * tileSize * MemoryLayout<UInt32>.stride)
        }
    }

    public func reset() {
        histogram = Array(repeating: 0, count: tileSize * tileSize)
        totalIterations = 0
        orbitX = 0.1
        orbitY = 0.334
        allocateMetalBuffers()
    }

    public func step(engine: NativeComputeEngine, iterations: Int) {
        switch engine {
        case .scalar1996:
            runScalar1996(iterations: iterations)
        case .swiftSIMD4:
            runSwiftSIMD4(iterations: iterations)
        case .accelerateMultiCore:
            runAccelerateMultiCore(iterations: iterations)
        case .metalGPU:
            runMetalGPU(iterations: iterations)
        }
        totalIterations += UInt64(iterations)
    }

    private func runScalar1996(iterations: Int) {
        var x = orbitX
        var y = orbitY
        let p2 = Double.pi * 2.0
        let p4 = Double.pi * 4.0
        let p6 = Double.pi * 6.0
        let sq3 = 3.0.squareRoot()
        let scale = Double(tileSize)
        let maxIdx = tileSize - 1
        let p = params

        if p.type == "quad" {
            for _ in 0..<iterations {
                let sx = sin(p2 * x)
                let sy = sin(p2 * y)
                var xnew = (p.lambda + p.alpha * cos(p2 * y)) * sx - p.omega * sy + p.beta * sin(p4 * x) + p.gamma * sin(p6 * x) * cos(p4 * y) + p.ma * x + p.shift
                var ynew = (p.lambda + p.alpha * cos(p2 * x)) * sy + p.omega * sx + p.beta * sin(p4 * y) + p.gamma * sin(p6 * y) * cos(p4 * x) + p.ma * y + p.shift
                if xnew > 1.0 { xnew -= trunc(xnew) }
                if ynew > 1.0 { ynew -= trunc(ynew) }
                if xnew < 0.0 { xnew += trunc(-xnew) + 1.0 }
                if ynew < 0.0 { ynew += trunc(-ynew) + 1.0 }
                let mx = min(maxIdx, Int(xnew * scale))
                let my = min(maxIdx, Int(ynew * scale))
                histogram[my * tileSize + mx] &+= 1
                x = xnew
                y = ynew
            }
        } else {
            let e111 = 1.0, e112 = -1.0 / sq3, e122 = 2.0 / sq3, e131 = -1.0, e132 = -(e112 + e122)
            let em11 = 2.0 * e111, em12 = 2.0 * e112 + e122, em21 = e131, em22 = 2.0 * e122 + e132, em31 = 2.0 * e131 + e111, em32 = 2.0 * e132 + e112
            let en11 = 3.0 * e111, en12 = 3.0 * e112 + 2.0 * e122, en21 = 2.0 * e131, en22 = 3.0 * e122 + 2.0 * e132, en31 = 3.0 * e131 + 2.0 * e111, en32 = 3.0 * e132 + 2.0 * e112
            let enh11 = 3.0 * e111, enh12 = 3.0 * e112 + e122, enh21 = e131, enh22 = 3.0 * e122 + e132, enh31 = 3.0 * e131 + e111, enh32 = 3.0 * e132 + e112
            let a11 = p.beta, a12 = p.gamma, a21 = (-a11 - sq3 * a12) / 2.0, a22 = (sq3 * a11 - a12) / 2.0, a31 = -a11 - a21, a32 = -a12 - a22
            let ah11 = a11, ah12 = -a12, ah21 = (-ah11 - sq3 * ah12) / 2.0, ah22 = (sq3 * ah11 - ah12) / 2.0, ah31 = -ah11 - ah21, ah32 = -ah12 - ah22
            let k22 = sq3 / 2.0

            for _ in 0..<iterations {
                let s11 = sin(p2 * (e111 * x + e112 * y))
                let s12 = sin(p2 * (e122 * y))
                let s13 = sin(p2 * (e131 * x + e132 * y))
                let s21 = sin(p2 * (em11 * x + em12 * y))
                let s22 = sin(p2 * (em21 * x + em22 * y))
                let s23 = sin(p2 * (em31 * x + em32 * y))
                let s31 = sin(p2 * (en11 * x + en12 * y))
                let s32 = sin(p2 * (en21 * x + en22 * y))
                let s33 = sin(p2 * (en31 * x + en32 * y))
                let s3h1 = sin(p2 * (enh11 * x + enh12 * y))
                let s3h2 = sin(p2 * (enh21 * x + enh22 * y))
                let s3h3 = sin(p2 * (enh31 * x + enh32 * y))
                let sx = e111 * s11 + e131 * s13
                let sy = e112 * s11 + e122 * s12 + e132 * s13
                var xnew = p.a * x - p.b * y + p.lambda * sx - p.omega * sy + p.alpha * (em11 * s21 + em21 * s22 + em31 * s23) + a11 * s31 + a21 * s32 + a31 * s33 + ah11 * s3h1 + ah21 * s3h2 + ah31 * s3h3
                var ynew = p.a * y + p.b * x + p.lambda * sy + p.omega * sx + p.alpha * (em12 * s21 + em22 * s22 + em32 * s23) + a12 * s31 + a22 * s32 + a32 * s33 + ah12 * s3h1 + ah22 * s3h2 + ah32 * s3h3
                var by = 2.0 * ynew / sq3
                var bx = xnew - 0.5 * by
                bx -= floor(bx)
                by -= floor(by)
                x = bx + 0.5 * by
                y = by * k22
                let mx = min(maxIdx, Int(bx * scale))
                let my = min(maxIdx, Int(by * scale))
                histogram[my * tileSize + mx] &+= 1
            }
        }
        orbitX = x
        orbitY = y
    }

    private func runSwiftSIMD4(iterations: Int) {
        let steps = max(1, iterations / 4)
        var vx = simdX
        var vy = simdY
        let scale = Float(tileSize)
        let maxIdx = tileSize - 1
        let lam = Float(params.lambda), alp = Float(params.alpha), bet = Float(params.beta)
        let gam = Float(params.gamma), omg = Float(params.omega), shf = Float(params.shift), ma = Float(params.ma)
        let half = SIMD4<Float>(repeating: 0.5)
        let qtr = SIMD4<Float>(repeating: 0.25)
        let threeQtr = SIMD4<Float>(repeating: 0.75)

        @inline(__always)
        func fastSinCos(_ u: SIMD4<Float>) -> (SIMD4<Float>, SIMD4<Float>) {
            let w = u - (u + half).rounded(.down)
            let absW = abs(w)
            let y = w * (8.0 - 16.0 * absW)
            let s = 0.225 * (y * abs(y) - y) + y

            let wc = (u + qtr) - (u + threeQtr).rounded(.down)
            let absWc = abs(wc)
            let yc = wc * (8.0 - 16.0 * absWc)
            let c = 0.225 * (yc * abs(yc) - yc) + yc
            return (s, c)
        }

        if params.type == "quad" {
            for _ in 0..<steps {
                let (sx1, cx1) = fastSinCos(vx)
                let (sy1, cy1) = fastSinCos(vy)
                let sx2 = 2.0 * sx1 * cx1
                let cx2 = 2.0 * cx1 * cx1 - 1.0
                let sy2 = 2.0 * sy1 * cy1
                let cy2 = 2.0 * cy1 * cy1 - 1.0
                let sx3 = sx1 * (2.0 * cx2 + 1.0)
                let sy3 = sy1 * (2.0 * cy2 + 1.0)

                let xn = (lam + alp * cy1) * sx1 - omg * sy1 + bet * sx2 + gam * sx3 * cy2 + ma * vx + shf
                let yn = (lam + alp * cx1) * sy1 + omg * sx1 + bet * sy2 + gam * sy3 * cx2 + ma * vy + shf
                vx = xn - xn.rounded(.down)
                vy = yn - yn.rounded(.down)

                let ix = SIMD4<Int>(vx * scale)
                let iy = SIMD4<Int>(vy * scale)
                for lane in 0..<4 {
                    let mx = min(maxIdx, max(0, ix[lane]))
                    let my = min(maxIdx, max(0, iy[lane]))
                    histogram[my * tileSize + mx] &+= 1
                }
            }
            simdX = vx
            simdY = vy
        } else {
            runScalar1996(iterations: iterations)
        }
    }

    private func runAccelerateMultiCore(iterations: Int) {
        let cores = max(2, ProcessInfo.processInfo.activeProcessorCount)
        let perCore = max(1, iterations / cores)
        let tSize = tileSize
        let totalCells = tSize * tSize
        let p = params

        var partialBuffers = Array(repeating: [UInt32](repeating: 0, count: totalCells), count: cores)
        DispatchQueue.concurrentPerform(iterations: cores) { tid in
            let sim = NativeQuiltSimulator(tileSize: tSize, initialPreset: p)
            let seed = Float(tid + 1)
            sim.simdX = SIMD4<Float>(
                fmod(seed * 0.17, 1.0),
                fmod(seed * 0.31, 1.0),
                fmod(seed * 0.53, 1.0),
                fmod(seed * 0.79, 1.0)
            )
            sim.simdY = SIMD4<Float>(
                fmod(seed * 0.23, 1.0),
                fmod(seed * 0.41, 1.0),
                fmod(seed * 0.67, 1.0),
                fmod(seed * 0.89, 1.0)
            )
            sim.runSwiftSIMD4(iterations: perCore)
            partialBuffers[tid] = sim.histogram
        }

        for buf in partialBuffers {
            for i in 0..<totalCells {
                histogram[i] &+= buf[i]
            }
        }
    }

    private func runMetalGPU(iterations: Int) {
        guard let queue = commandQueue,
              let pipeline = computePipeline,
              let oBuf = orbitBuffer,
              let hBuf = histBuffer,
              let cmd = queue.makeCommandBuffer(),
              let enc = cmd.makeComputeCommandEncoder() else {
            runAccelerateMultiCore(iterations: iterations)
            return
        }

        let stepsPerThread = UInt32(max(1, iterations / gpuThreadCount))
        let sq3 = Float(3.0.squareRoot())
        let a11 = Float(params.beta), a12 = Float(params.gamma)
        let a21 = (-a11 - sq3 * a12) * 0.5, a22 = (sq3 * a11 - a12) * 0.5
        let a31 = -a11 - a21, a32 = -a12 - a22
        let ah11 = a11, ah12 = -a12
        let ah21 = (-ah11 - sq3 * ah12) * 0.5, ah22 = (sq3 * ah11 - ah12) * 0.5
        let ah31 = -ah11 - ah21, ah32 = -ah12 - ah22

        struct MetalQuiltParams {
            var quiltType: UInt32
            var tileSize: UInt32
            var stepsPerThread: UInt32
            var padding: UInt32 = 0
            var lambda, alpha, beta, gamma, omega, shift, ma, a, b: Float
            var a11, a12, a21, a22, a31, a32: Float
            var ah11, ah12, ah21, ah22, ah31, ah32: Float
        }

        var mp = MetalQuiltParams(
            quiltType: params.type == "quad" ? 0 : 1,
            tileSize: UInt32(tileSize),
            stepsPerThread: stepsPerThread,
            lambda: Float(params.lambda),
            alpha: Float(params.alpha),
            beta: Float(params.beta),
            gamma: Float(params.gamma),
            omega: Float(params.omega),
            shift: Float(params.shift),
            ma: Float(params.ma),
            a: Float(params.a),
            b: Float(params.b),
            a11: a11, a12: a12, a21: a21, a22: a22, a31: a31, a32: a32,
            ah11: ah11, ah12: ah12, ah21: ah21, ah22: ah22, ah31: ah31, ah32: ah32
        )

        enc.setComputePipelineState(pipeline)
        enc.setBuffer(oBuf, offset: 0, index: 0)
        enc.setBuffer(hBuf, offset: 0, index: 1)
        enc.setBytes(&mp, length: MemoryLayout<MetalQuiltParams>.stride, index: 2)

        let w = pipeline.threadExecutionWidth
        let threadsPerGroup = MTLSize(width: w, height: 1, depth: 1)
        let threadgroups = MTLSize(width: (gpuThreadCount + w - 1) / w, height: 1, depth: 1)
        enc.dispatchThreadgroups(threadgroups, threadsPerThreadgroup: threadsPerGroup)
        enc.endEncoding()

        cmd.commit()
        cmd.waitUntilCompleted()

        let ptr = hBuf.contents().bindMemory(to: UInt32.self, capacity: tileSize * tileSize)
        histogram = Array(UnsafeBufferPointer(start: ptr, count: tileSize * tileSize))
    }
}
