// QuiltsCompute.metal – Native Apple Silicon GPU Compute Shader for Quilts V2.0
// Executes thousands of independent chaotic trajectories in parallel using hardware SFU fast::sin / fast::cos
// and accumulates directly into Unified Memory via atomic_fetch_add_explicit.

#include <metal_stdlib>
using namespace metal;

struct MetalQuiltParams {
    uint quiltType; // 0 = Quad, 1 = Hex
    uint tileSize;
    uint stepsPerThread;
    uint padding;
    float lambda;
    float alpha;
    float beta;
    float gamma;
    float omega;
    float shift;
    float ma;
    float a;
    float b;
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
    float x = pos.x;
    float y = pos.y;
    const float p2 = 6.28318530718f;
    const float p4 = 12.56637061436f;
    const float p6 = 18.84955592154f;
    const float sq3 = 1.73205080757f;
    const float invSq3_2 = 2.0f / sq3;
    const float k22 = sq3 * 0.5f;
    const float scale = float(p.tileSize);
    const uint maxIdx = p.tileSize - 1;

    if (p.quiltType == 0) {
        for (uint i = 0; i < p.stepsPerThread; ++i) {
            float sx = fast::sin(p2 * x);
            float sy = fast::sin(p2 * y);
            float cx = fast::cos(p2 * x);
            float cy = fast::cos(p2 * y);

            float xnew = (p.lambda + p.alpha * cy) * sx
                       - p.omega * sy
                       + p.beta * fast::sin(p4 * x)
                       + p.gamma * fast::sin(p6 * x) * fast::cos(p4 * y)
                       + p.ma * x + p.shift;

            float ynew = (p.lambda + p.alpha * cx) * sy
                       + p.omega * sx
                       + p.beta * fast::sin(p4 * y)
                       + p.gamma * fast::sin(p6 * y) * fast::cos(p4 * x)
                       + p.ma * y + p.shift;

            x = xnew - floor(xnew);
            y = ynew - floor(ynew);

            uint mx = min(maxIdx, uint(x * scale));
            uint my = min(maxIdx, uint(y * scale));
            atomic_fetch_add_explicit(&histogram[my * p.tileSize + mx], 1u, memory_order_relaxed);
        }
    } else {
        const float e111 = 1.0f, e112 = -1.0f / sq3;
        const float e122 = 2.0f / sq3;
        const float e131 = -1.0f, e132 = -(e112 + e122);
        const float em11 = 2.0f * e111, em12 = 2.0f * e112 + e122;
        const float em21 = e131, em22 = 2.0f * e122 + e132;
        const float em31 = 2.0f * e131 + e111, em32 = 2.0f * e132 + e112;
        const float en11 = 3.0f * e111, en12 = 3.0f * e112 + 2.0f * e122;
        const float en21 = 2.0f * e131, en22 = 3.0f * e122 + 2.0f * e132;
        const float en31 = 3.0f * e131 + 2.0f * e111, en32 = 3.0f * e132 + 2.0f * e112;
        const float enh11 = 3.0f * e111, enh12 = 3.0f * e112 + e122;
        const float enh21 = e131, enh22 = 3.0f * e122 + e132;
        const float enh31 = 3.0f * e131 + e111, enh32 = 3.0f * e132 + e112;

        for (uint i = 0; i < p.stepsPerThread; ++i) {
            float s11 = fast::sin(p2 * (e111 * x + e112 * y));
            float s12 = fast::sin(p2 * (e122 * y));
            float s13 = fast::sin(p2 * (e131 * x + e132 * y));
            float s21 = fast::sin(p2 * (em11 * x + em12 * y));
            float s22 = fast::sin(p2 * (em21 * x + em22 * y));
            float s23 = fast::sin(p2 * (em31 * x + em32 * y));
            float s31 = fast::sin(p2 * (en11 * x + en12 * y));
            float s32 = fast::sin(p2 * (en21 * x + en22 * y));
            float s33 = fast::sin(p2 * (en31 * x + en32 * y));
            float s3h1 = fast::sin(p2 * (enh11 * x + enh12 * y));
            float s3h2 = fast::sin(p2 * (enh21 * x + enh22 * y));
            float s3h3 = fast::sin(p2 * (enh31 * x + enh32 * y));

            float sx = e111 * s11 + e131 * s13;
            float sy = e112 * s11 + e122 * s12 + e132 * s13;

            float xnew = p.a * x - p.b * y + p.lambda * sx - p.omega * sy
                       + p.alpha * (em11 * s21 + em21 * s22 + em31 * s23)
                       + p.a11 * s31 + p.a21 * s32 + p.a31 * s33
                       + p.ah11 * s3h1 + p.ah21 * s3h2 + p.ah31 * s3h3;

            float ynew = p.a * y + p.b * x + p.lambda * sy + p.omega * sx
                       + p.alpha * (em12 * s21 + em22 * s22 + em32 * s23)
                       + p.a12 * s31 + p.a22 * s32 + p.a32 * s33
                       + p.ah12 * s3h1 + p.ah22 * s3h2 + p.ah32 * s3h3;

            float by = ynew * invSq3_2;
            float bx = xnew - 0.5f * by;

            bx = bx - floor(bx);
            by = by - floor(by);

            x = bx + 0.5f * by;
            y = by * k22;

            uint mx = min(maxIdx, uint(bx * scale));
            uint my = min(maxIdx, uint(by * scale));
            atomic_fetch_add_explicit(&histogram[my * p.tileSize + mx], 1u, memory_order_relaxed);
        }
    }

    orbits[gid] = float2(x, y);
}
