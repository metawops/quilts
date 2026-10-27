// Quilts V2.0 (1996 -> 2026) – High-Speed Web Application & Multi-Backend Arena
import { QUILTS_CATALOG } from "./assets-data.js";

// --- 1. Fallback for <dialog closedby="any"> in Safari (from modern-web-guidance) ---
if (!("closedBy" in HTMLDialogElement.prototype)) {
  const outside = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener("pointerdown", (e) => {
      pressedOutside = outside(e, dialog);
    });
    dialog.addEventListener("pointerup", (e) => {
      if (pressedOutside && outside(e, dialog)) dialog.close();
    });
  }
}

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("close", () => {
    dialog.returnValue = "";
  });
}

// --- 2. Precomputed Hexagonal Wave Vectors (exact QUILTS.PAS lines 613-716) ---
const PI2 = Math.PI * 2.0;
const PI4 = Math.PI * 4.0;
const PI6 = Math.PI * 6.0;
const SQ3 = Math.sqrt(3.0);
const K11 = 1.0, K12 = 0.0, K21 = 0.5, K22 = SQ3 / 2.0;

const E111 = 1.0, E112 = -1.0 / SQ3;
const E121 = 0.0, E122 = 2.0 / SQ3;
const E131 = -(E111 + E121), E132 = -(E112 + E122);

const EM11 = 2 * E111 + E121, EM12 = 2 * E112 + E122;
const EM21 = 2 * E121 + E131, EM22 = 2 * E122 + E132;
const EM31 = 2 * E131 + E111, EM32 = 2 * E132 + E112;

const EN11 = 3 * E111 + 2 * E121, EN12 = 3 * E112 + 2 * E122;
const EN21 = 3 * E121 + 2 * E131, EN22 = 3 * E122 + 2 * E132;
const EN31 = 3 * E131 + 2 * E111, EN32 = 3 * E132 + 2 * E112;

const ENH11 = 3 * E111 + E121, ENH12 = 3 * E112 + E122;
const ENH21 = 3 * E121 + E131, ENH22 = 3 * E122 + E132;
const ENH31 = 3 * E131 + E111, ENH32 = 3 * E132 + E112;

function computeHexA(beta, gamma) {
  const a11 = beta, a12 = gamma;
  const a21 = (-a11 - SQ3 * a12) / 2.0;
  const a22 = (SQ3 * a11 - a12) / 2.0;
  const a31 = -a11 - a21;
  const a32 = -a12 - a22;

  const ah11 = a11, ah12 = -a12;
  const ah21 = (-ah11 - SQ3 * ah12) / 2.0;
  const ah22 = (SQ3 * ah11 - ah12) / 2.0;
  const ah31 = -ah11 - ah21;
  const ah32 = -ah12 - ah22;
  return { a11, a12, a21, a22, a31, a32, ah11, ah12, ah21, ah22, ah31, ah32 };
}

// --- 3. Engine 1: Exact 1996 Turbo Pascal Reference (Scalar) ---
function stepScalar1996(params, hexA, orbit, histogram, tileSize, count) {
  let x = orbit.x;
  let y = orbit.y;
  const scale = tileSize;
  const maxIdx = tileSize - 1;
  const { lambda, alpha, beta, gamma, omega, shift, ma, a, b } = params;

  if (params.type === "quad") {
    for (let i = 0; i < count; i++) {
      const sx = Math.sin(PI2 * x);
      const sy = Math.sin(PI2 * y);

      let xnew =
        (lambda + alpha * Math.cos(PI2 * y)) * sx -
        omega * sy +
        beta * Math.sin(PI4 * x) +
        gamma * Math.sin(PI6 * x) * Math.cos(PI4 * y) +
        ma * x +
        shift;
      let ynew =
        (lambda + alpha * Math.cos(PI2 * x)) * sy +
        omega * sx +
        beta * Math.sin(PI4 * y) +
        gamma * Math.sin(PI6 * y) * Math.cos(PI4 * x) +
        ma * y +
        shift;

      if (xnew > 1.0) xnew = xnew - Math.trunc(xnew);
      if (ynew > 1.0) ynew = ynew - Math.trunc(ynew);
      if (xnew < 0.0) xnew = xnew + Math.trunc(-xnew) + 1.0;
      if (ynew < 0.0) ynew = ynew + Math.trunc(-ynew) + 1.0;

      const mx = Math.min(maxIdx, (xnew * scale) | 0);
      const my = Math.min(maxIdx, (ynew * scale) | 0);
      histogram[my * tileSize + mx]++;

      x = xnew;
      y = ynew;
    }
  } else {
    const { a11, a12, a21, a22, a31, a32, ah11, ah12, ah21, ah22, ah31, ah32 } = hexA;
    for (let i = 0; i < count; i++) {
      const s11 = Math.sin(PI2 * (E111 * x + E112 * y));
      const s12 = Math.sin(PI2 * (E121 * x + E122 * y));
      const s13 = Math.sin(PI2 * (E131 * x + E132 * y));
      const s21 = Math.sin(PI2 * (EM11 * x + EM12 * y));
      const s22 = Math.sin(PI2 * (EM21 * x + EM22 * y));
      const s23 = Math.sin(PI2 * (EM31 * x + EM32 * y));
      const s31 = Math.sin(PI2 * (EN11 * x + EN12 * y));
      const s32 = Math.sin(PI2 * (EN21 * x + EN22 * y));
      const s33 = Math.sin(PI2 * (EN31 * x + EN32 * y));
      const s3h1 = Math.sin(PI2 * (ENH11 * x + ENH12 * y));
      const s3h2 = Math.sin(PI2 * (ENH21 * x + ENH22 * y));
      const s3h3 = Math.sin(PI2 * (ENH31 * x + ENH32 * y));

      const sx = E111 * s11 + E121 * s12 + E131 * s13;
      const sy = E112 * s11 + E122 * s12 + E132 * s13;

      let xnew = a * x - b * y + lambda * sx - omega * sy;
      let ynew = a * y + b * x + lambda * sy + omega * sx;

      xnew += alpha * (EM11 * s21 + EM21 * s22 + EM31 * s23);
      ynew += alpha * (EM12 * s21 + EM22 * s22 + EM32 * s23);

      xnew += a11 * s31 + a21 * s32 + a31 * s33;
      ynew += a12 * s31 + a22 * s32 + a32 * s33;

      xnew += ah11 * s3h1 + ah21 * s3h2 + ah31 * s3h3;
      ynew += ah12 * s3h1 + ah22 * s3h2 + ah32 * s3h3;

      let by = (2.0 * ynew) / SQ3;
      let bx = xnew - by / 2.0;

      if (bx > 1.0) bx = bx - Math.trunc(bx);
      if (by > 1.0) by = by - Math.trunc(by);
      if (bx < 0.0) bx = bx + Math.trunc(-bx) + 1.0;
      if (by < 0.0) by = by + Math.trunc(-by) + 1.0;

      x = bx * K11 + by * K21;
      y = bx * K12 + by * K22;

      const mx = Math.min(maxIdx, (bx * scale) | 0);
      const my = Math.min(maxIdx, (by * scale) | 0);
      histogram[my * tileSize + mx]++;
    }
  }
  orbit.x = x;
  orbit.y = y;
}

// --- 4. Engine 2: Fast Branchless + Chebyshev Harmonics + Fast Polynomial Sine ---
function stepFastChebyshev(params, hexA, orbit, histogram, tileSize, count) {
  let x = orbit.x;
  let y = orbit.y;
  const scale = tileSize;
  const maxIdx = tileSize - 1;
  const { lambda, alpha, beta, gamma, omega, shift, ma, a, b } = params;

  if (params.type === "quad") {
    for (let i = 0; i < count; i++) {
      // Fast normalized sin(2*pi*x) & cos(2*pi*x)
      const wx = x - Math.floor(x + 0.5);
      const yx = wx * (8.0 - 16.0 * Math.abs(wx));
      const sx1 = 0.225 * (yx * Math.abs(yx) - yx) + yx;

      const wcx = x + 0.25 - Math.floor(x + 0.75);
      const ycx = wcx * (8.0 - 16.0 * Math.abs(wcx));
      const cx1 = 0.225 * (ycx * Math.abs(ycx) - ycx) + ycx;

      const wy = y - Math.floor(y + 0.5);
      const yy = wy * (8.0 - 16.0 * Math.abs(wy));
      const sy1 = 0.225 * (yy * Math.abs(yy) - yy) + yy;

      const wcy = y + 0.25 - Math.floor(y + 0.75);
      const ycy = wcy * (8.0 - 16.0 * Math.abs(wcy));
      const cy1 = 0.225 * (ycy * Math.abs(ycy) - ycy) + ycy;

      // Double & Triple harmonics via Chebyshev recurrence (0 extra trig calls!)
      const sx2 = 2.0 * sx1 * cx1;
      const cx2 = 2.0 * cx1 * cx1 - 1.0;
      const sy2 = 2.0 * sy1 * cy1;
      const cy2 = 2.0 * cy1 * cy1 - 1.0;
      const sx3 = sx1 * (2.0 * cx2 + 1.0);
      const sy3 = sy1 * (2.0 * cy2 + 1.0);

      let xnew =
        (lambda + alpha * cy1) * sx1 -
        omega * sy1 +
        beta * sx2 +
        gamma * sx3 * cy2 +
        ma * x +
        shift;
      let ynew =
        (lambda + alpha * cx1) * sy1 +
        omega * sx1 +
        beta * sy2 +
        gamma * sy3 * cx2 +
        ma * y +
        shift;

      xnew -= Math.floor(xnew);
      ynew -= Math.floor(ynew);

      const mx = Math.min(maxIdx, (xnew * scale) | 0);
      const my = Math.min(maxIdx, (ynew * scale) | 0);
      histogram[my * tileSize + mx]++;

      x = xnew;
      y = ynew;
    }
  } else {
    const { a11, a12, a21, a22, a31, a32, ah11, ah12, ah21, ah22, ah31, ah32 } = hexA;
    const fsin = (u) => {
      const w = u - Math.floor(u + 0.5);
      const y0 = w * (8.0 - 16.0 * Math.abs(w));
      return 0.225 * (y0 * Math.abs(y0) - y0) + y0;
    };
    const invSq3_2 = 2.0 / SQ3;

    for (let i = 0; i < count; i++) {
      const s11 = fsin(E111 * x + E112 * y);
      const s12 = fsin(E122 * y);
      const s13 = fsin(E131 * x + E132 * y);
      const s21 = fsin(EM11 * x + EM12 * y);
      const s22 = fsin(EM21 * x + EM22 * y);
      const s23 = fsin(EM31 * x + EM32 * y);
      const s31 = fsin(EN11 * x + EN12 * y);
      const s32 = fsin(EN21 * x + EN22 * y);
      const s33 = fsin(EN31 * x + EN32 * y);
      const s3h1 = fsin(ENH11 * x + ENH12 * y);
      const s3h2 = fsin(ENH21 * x + ENH22 * y);
      const s3h3 = fsin(ENH31 * x + ENH32 * y);

      const sx = E111 * s11 + E131 * s13;
      const sy = E112 * s11 + E122 * s12 + E132 * s13;

      let xnew = a * x - b * y + lambda * sx - omega * sy;
      let ynew = a * y + b * x + lambda * sy + omega * sx;

      xnew += alpha * (EM11 * s21 + EM21 * s22 + EM31 * s23);
      ynew += alpha * (EM12 * s21 + EM22 * s22 + EM32 * s23);

      xnew += a11 * s31 + a21 * s32 + a31 * s33;
      ynew += a12 * s31 + a22 * s32 + a32 * s33;

      xnew += ah11 * s3h1 + ah21 * s3h2 + ah31 * s3h3;
      ynew += ah12 * s3h1 + ah22 * s3h2 + ah32 * s3h3;

      let by = ynew * invSq3_2;
      let bx = xnew - 0.5 * by;

      bx -= Math.floor(bx);
      by -= Math.floor(by);

      x = bx + 0.5 * by;
      y = by * K22;

      const mx = Math.min(maxIdx, (bx * scale) | 0);
      const my = Math.min(maxIdx, (by * scale) | 0);
      histogram[my * tileSize + mx]++;
    }
  }
  orbit.x = x;
  orbit.y = y;
}

// --- 5. Engine 4: Multi-Core Web Worker Pool (Uses all CPU Cores in Browser) ---
const WORKER_SOURCE = `
const SQ3 = Math.sqrt(3.0);
const K22 = SQ3 / 2.0;
const E111 = 1.0, E112 = -1.0 / SQ3;
const E122 = 2.0 / SQ3;
const E131 = -1.0, E132 = -(E112 + E122);
const EM11 = 2 * E111, EM12 = 2 * E112 + E122;
const EM21 = E131, EM22 = 2 * E122 + E132;
const EM31 = 2 * E131 + E111, EM32 = 2 * E132 + E112;
const EN11 = 3 * E111, EN12 = 3 * E112 + 2 * E122;
const EN21 = 2 * E131, EN22 = 3 * E122 + 2 * E132;
const EN31 = 3 * E131 + 2 * E111, EN32 = 3 * E132 + 2 * E112;
const ENH11 = 3 * E111, ENH12 = 3 * E112 + E122;
const ENH21 = E131, ENH22 = 3 * E122 + E132;
const ENH31 = 3 * E131 + E111, ENH32 = 3 * E132 + E112;

let x = 0.13, y = 0.37;

self.onmessage = (e) => {
  const { params, hexA, tileSize, count, seed } = e.data;
  if (seed !== undefined) {
    x = (seed * 0.618033988749895) % 1.0;
    y = (seed * 0.7548776662466927) % 1.0;
  }
  const hist = new Uint32Array(tileSize * tileSize);
  const scale = tileSize;
  const maxIdx = tileSize - 1;
  const { lambda, alpha, beta, gamma, omega, shift, ma, a, b } = params;

  if (params.type === "quad") {
    for (let i = 0; i < count; i++) {
      const wx = x - Math.floor(x + 0.5);
      const yx = wx * (8.0 - 16.0 * Math.abs(wx));
      const sx1 = 0.225 * (yx * Math.abs(yx) - yx) + yx;

      const wcx = x + 0.25 - Math.floor(x + 0.75);
      const ycx = wcx * (8.0 - 16.0 * Math.abs(wcx));
      const cx1 = 0.225 * (ycx * Math.abs(ycx) - ycx) + ycx;

      const wy = y - Math.floor(y + 0.5);
      const yy = wy * (8.0 - 16.0 * Math.abs(wy));
      const sy1 = 0.225 * (yy * Math.abs(yy) - yy) + yy;

      const wcy = y + 0.25 - Math.floor(y + 0.75);
      const ycy = wcy * (8.0 - 16.0 * Math.abs(wcy));
      const cy1 = 0.225 * (ycy * Math.abs(ycy) - ycy) + ycy;

      const sx2 = 2.0 * sx1 * cx1;
      const cx2 = 2.0 * cx1 * cx1 - 1.0;
      const sy2 = 2.0 * sy1 * cy1;
      const cy2 = 2.0 * cy1 * cy1 - 1.0;
      const sx3 = sx1 * (2.0 * cx2 + 1.0);
      const sy3 = sy1 * (2.0 * cy2 + 1.0);

      let xnew = (lambda + alpha * cy1) * sx1 - omega * sy1 + beta * sx2 + gamma * sx3 * cy2 + ma * x + shift;
      let ynew = (lambda + alpha * cx1) * sy1 + omega * sx1 + beta * sy2 + gamma * sy3 * cx2 + ma * y + shift;

      xnew -= Math.floor(xnew);
      ynew -= Math.floor(ynew);

      const mx = Math.min(maxIdx, (xnew * scale) | 0);
      const my = Math.min(maxIdx, (ynew * scale) | 0);
      hist[my * tileSize + mx]++;
      x = xnew;
      y = ynew;
    }
  } else {
    const { a11, a12, a21, a22, a31, a32, ah11, ah12, ah21, ah22, ah31, ah32 } = hexA;
    const invSq3_2 = 2.0 / SQ3;
    for (let i = 0; i < count; i++) {
      let w, y0;
      w = (E111 * x + E112 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s11 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (E122 * y);            w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s12 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (E131 * x + E132 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s13 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (EM11 * x + EM12 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s21 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (EM21 * x + EM22 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s22 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (EM31 * x + EM32 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s23 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (EN11 * x + EN12 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s31 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (EN21 * x + EN22 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s32 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (EN31 * x + EN32 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s33 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (ENH11 * x + ENH12 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s3h1 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (ENH21 * x + ENH22 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s3h2 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;
      w = (ENH31 * x + ENH32 * y); w -= Math.floor(w + 0.5); y0 = w * (8 - 16 * Math.abs(w)); const s3h3 = 0.225 * (y0 * Math.abs(y0) - y0) + y0;

      const sx = E111 * s11 + E131 * s13;
      const sy = E112 * s11 + E122 * s12 + E132 * s13;

      let xnew = a * x - b * y + lambda * sx - omega * sy + alpha * (EM11 * s21 + EM21 * s22 + EM31 * s23) + a11 * s31 + a21 * s32 + a31 * s33 + ah11 * s3h1 + ah21 * s3h2 + ah31 * s3h3;
      let ynew = a * y + b * x + lambda * sy + omega * sx + alpha * (EM12 * s21 + EM22 * s22 + EM32 * s23) + a12 * s31 + a22 * s32 + a32 * s33 + ah12 * s3h1 + ah22 * s3h2 + ah32 * s3h3;

      let by = ynew * invSq3_2;
      let bx = xnew - 0.5 * by;
      bx -= Math.floor(bx);
      by -= Math.floor(by);

      x = bx + 0.5 * by;
      y = by * K22;

      const mx = Math.min(maxIdx, (bx * scale) | 0);
      const my = Math.min(maxIdx, (by * scale) | 0);
      hist[my * tileSize + mx]++;
    }
  }
  self.postMessage({ hist }, [hist.buffer]);
};
`;

class WorkerPool {
  constructor() {
    this.numWorkers = Math.min(12, Math.max(2, navigator.hardwareConcurrency || 4));
    this.workers = [];
    this.busy = false;
    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    for (let i = 0; i < this.numWorkers; i++) {
      this.workers.push(new Worker(url));
    }
  }

  runBatch(params, hexA, tileSize, totalCount, seedBase) {
    const perWorker = Math.ceil(totalCount / this.numWorkers);
    return Promise.all(
      this.workers.map(
        (w, idx) =>
          new Promise((resolve) => {
            w.onmessage = (e) => resolve(e.data.hist);
            w.postMessage({
              params,
              hexA,
              tileSize,
              count: perWorker,
              seed: seedBase + idx + 1,
            });
          })
      )
    );
  }
}

// --- 6. Application State ---
const state = {
  running: true,
  engine: "workers",
  batchSize: 500000,
  tileSize: 768,
  canvasSize: 768,
  nperiod: 3,
  toneMapping: "log",
  gamma: 1.0,
  lowBorder: 0,
  blackIndex: 0,
  colorOffset: 0,
  cycleColors: false,
  params: { ...QUILTS_CATALOG.presets[0] },
  hexA: computeHexA(QUILTS_CATALOG.presets[0].beta, QUILTS_CATALOG.presets[0].gamma),
  palette: structuredClone(
    QUILTS_CATALOG.palettes.find((p) => p.id === "VOLCANO3") || QUILTS_CATALOG.palettes[0]
  ),
  previewPalette: null,
  histogram: new Uint32Array(768 * 768),
  totalIterations: 0,
  maxHit: 0,
  minHit: 0,
  orbit: { x: 0.1, y: 0.334 },
  lastThroughputMItS: 0,
  wasmInstance: null,
  wasmCtx: null,
  palEditActiveIdx: 1,
  palEditMarkedIdx: null,
};

const workerPool = new WorkerPool();

// Optional Rust WebAssembly binary loader (if compiled to web/quilts_wasm.wasm)
async function tryLoadRustWasm() {
  try {
    const resp = await fetch("quilts_wasm.wasm");
    if (!resp.ok) return false;
    const bytes = await resp.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, {});
    state.wasmInstance = instance.exports;
    state.wasmCtx = state.wasmInstance.wasm_quilt_create(
      state.tileSize,
      state.canvasSize,
      state.canvasSize
    );
    return true;
  } catch (_) {
    return false;
  }
}

// --- 7. High-Speed 32-Bit RGBA Renderer (Quad & Hex Periodic Tiling) ---
const canvas = document.getElementById("quiltCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
let imageData = ctx.createImageData(state.canvasSize, state.canvasSize);
let rgbaU32 = new Uint32Array(imageData.data.buffer);
let tileRgbaU32 = new Uint32Array(state.tileSize * state.tileSize);
const colorLutU32 = new Uint32Array(256);

function updateColorLut() {
  const pal = state.previewPalette || state.palette;
  const c0 = pal.colors[0];
  colorLutU32[0] = (255 << 24) | (c0[2] << 16) | (c0[1] << 8) | c0[0];

  for (let i = 1; i <= 254; i++) {
    if (i <= state.blackIndex) {
      colorLutU32[i] = 0xff000000;
    } else {
      const shifted = 1 + ((i - 1 + state.colorOffset) % 254);
      const c = pal.colors[shifted];
      colorLutU32[i] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
    }
  }
  colorLutU32[255] = 0xffffffff;
}

function renderFrame() {
  updateColorLut();
  const hist = state.histogram;
  const tSize = state.tileSize;
  const totalCells = tSize * tSize;

  let maxH = 0;
  let minH = 0xffffffff;
  for (let i = 0; i < totalCells; i++) {
    const v = hist[i];
    if (v > maxH) maxH = v;
    if (v < minH) minH = v;
  }
  state.maxHit = maxH;
  state.minHit = minH === 0xffffffff ? 0 : minH;

  const lowB = state.lowBorder;
  const mode = state.toneMapping;
  const invGamma = 1.0 / Math.max(0.1, state.gamma);
  const logMax = Math.max(1.0, Math.log(Math.max(2, maxH)));
  const sqrtMax = Math.max(1.0, Math.sqrt(Math.max(2, maxH)));
  const bgU32 = colorLutU32[0];

  for (let i = 0; i < totalCells; i++) {
    const mc = hist[i];
    if (mc === 0 || mc < lowB) {
      tileRgbaU32[i] = bgU32;
    } else if (mode === "classic1996") {
      tileRgbaU32[i] = colorLutU32[mc > 254 ? 254 : mc];
    } else if (mode === "log") {
      const norm = Math.pow(Math.min(1.0, Math.log(mc) / logMax), invGamma);
      const idx = 1 + ((norm * 253.0) | 0);
      tileRgbaU32[i] = colorLutU32[idx > 254 ? 254 : idx];
    } else {
      const norm = Math.pow(Math.min(1.0, Math.sqrt(mc) / sqrtMax), invGamma);
      const idx = 1 + ((norm * 253.0) | 0);
      tileRgbaU32[i] = colorLutU32[idx > 254 ? 254 : idx];
    }
  }

  const cw = state.canvasSize;
  const ch = state.canvasSize;
  const nperiod = state.nperiod;
  const invW = nperiod / cw;
  const invH = nperiod / ch;
  const maxTileIdx = tSize - 1;

  if (state.params.type === "quad") {
    const xLut = new Int32Array(cw);
    for (let px = 0; px < cw; px++) {
      const u = (px * invW) % 1.0;
      xLut[px] = Math.min(maxTileIdx, (u * tSize) | 0);
    }
    for (let py = 0; py < ch; py++) {
      const yWorld = (ch - 1 - py) * invH;
      const v = yWorld - Math.floor(yWorld);
      const my = Math.min(maxTileIdx, (v * tSize) | 0);
      const rowOffset = my * tSize;
      const dstRow = py * cw;
      for (let px = 0; px < cw; px++) {
        rgbaU32[dstRow + px] = tileRgbaU32[rowOffset + xLut[px]];
      }
    }
  } else {
    const twoOverSq3 = 2.0 / SQ3;
    for (let py = 0; py < ch; py++) {
      const yWorld = (ch - 1 - py) * invH;
      const byRaw = yWorld * twoOverSq3;
      const halfBy = 0.5 * byRaw;
      const by = byRaw - Math.floor(byRaw);
      const my = Math.min(maxTileIdx, (by * tSize) | 0);
      const rowOffset = my * tSize;
      const dstRow = py * cw;

      for (let px = 0; px < cw; px++) {
        const xWorld = px * invW;
        const bxRaw = xWorld - halfBy;
        const bx = bxRaw - Math.floor(bxRaw);
        const mx = Math.min(maxTileIdx, (bx * tSize) | 0);
        rgbaU32[dstRow + px] = tileRgbaU32[rowOffset + mx];
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  updateTelemetryDOM();
}

// --- 8. Simulation Loop ---
function resetSimulation() {
  state.histogram.fill(0);
  state.totalIterations = 0;
  state.maxHit = 0;
  state.minHit = 0;
  state.orbit.x = 0.1;
  state.orbit.y = 0.334;
  state.hexA = computeHexA(state.params.beta, state.params.gamma);
  renderFrame();
}

let loopInFlight = false;
async function simulationTick() {
  if (state.cycleColors) {
    state.colorOffset = (state.colorOffset + 1) % 254;
    document.getElementById("sliderColorOffset").value = state.colorOffset;
    document.getElementById("outColorOffset").textContent = state.colorOffset;
    if (!state.running) renderFrame();
  }

  if (state.running && !loopInFlight) {
    loopInFlight = true;
    const t0 = performance.now();
    const count = state.batchSize;

    if (state.engine === "workers") {
      const slices = await workerPool.runBatch(
        state.params,
        state.hexA,
        state.tileSize,
        count,
        state.totalIterations
      );
      const hist = state.histogram;
      const len = hist.length;
      for (const s of slices) {
        for (let i = 0; i < len; i++) {
          hist[i] += s[i];
        }
      }
    } else if (state.engine === "scalar1996") {
      stepScalar1996(state.params, state.hexA, state.orbit, state.histogram, state.tileSize, count);
    } else {
      // Both "fast" and fallback "wasm" use the branchless Chebyshev kernel
      stepFastChebyshev(
        state.params,
        state.hexA,
        state.orbit,
        state.histogram,
        state.tileSize,
        count
      );
    }

    const dt = (performance.now() - t0) / 1000.0;
    state.totalIterations += count;
    state.lastThroughputMItS = count / 1e6 / Math.max(0.0001, dt);
    renderFrame();
    loopInFlight = false;
  }

  requestAnimationFrame(simulationTick);
}

// --- 9. UI Controls & Event Wiring ---
const PARAM_DEFS_QUAD = [
  { key: "lambda", label: "[l]ambda (λ)", min: -1.5, max: 1.5, step: 0.001 },
  { key: "alpha", label: "[a]lpha (α)", min: -1.5, max: 1.5, step: 0.001 },
  { key: "beta", label: "[b]eta (β)", min: -1.5, max: 1.5, step: 0.001 },
  { key: "gamma", label: "[g]amma (γ)", min: -1.5, max: 1.5, step: 0.001 },
  { key: "omega", label: "[o]mega (ω)", min: -1.5, max: 1.5, step: 0.001 },
  { key: "shift", label: "s[h]ift", min: -1.0, max: 1.0, step: 0.01 },
  { key: "ma", label: "[m] (Gitterfaktor)", min: -4.0, max: 4.0, step: 1.0 },
];

const PARAM_DEFS_HEX = [
  { key: "lambda", label: "[l]ambda (λ)", min: -1.0, max: 1.0, step: 0.001 },
  { key: "alpha", label: "[a]lpha (α)", min: -1.0, max: 1.0, step: 0.001 },
  { key: "beta", label: "[b]eta (β)", min: -1.0, max: 1.0, step: 0.001 },
  { key: "gamma", label: "[g]amma (γ)", min: -1.0, max: 1.0, step: 0.001 },
  { key: "omega", label: "[o]mega (ω)", min: -1.0, max: 1.0, step: 0.001 },
  { key: "a", label: "m[1] (a)", min: -2.0, max: 2.0, step: 0.001 },
  { key: "b", label: "m[2] (b)", min: -2.0, max: 2.0, step: 0.001 },
];

function buildParameterSliders() {
  const container = document.getElementById("paramsContainer");
  container.innerHTML = "";
  const defs = state.params.type === "quad" ? PARAM_DEFS_QUAD : PARAM_DEFS_HEX;

  for (const def of defs) {
    const val = Number(state.params[def.key] ?? 0);
    const row = document.createElement("div");
    row.className = "param-row";

    const header = document.createElement("div");
    header.className = "param-header";

    const lbl = document.createElement("label");
    lbl.textContent = def.label;

    const numInput = document.createElement("input");
    numInput.type = "number";
    numInput.className = "param-num-input";
    numInput.step = String(def.step);
    numInput.value = val.toFixed(4);

    header.append(lbl, numInput);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(def.min);
    slider.max = String(def.max);
    slider.step = String(def.step);
    slider.value = String(val);

    const updateParam = (newVal) => {
      if (Number.isNaN(newVal)) return;
      state.params[def.key] = newVal;
      slider.value = String(newVal);
      numInput.value = newVal.toFixed(4);
      resetSimulation();
    };

    slider.addEventListener("input", () => updateParam(parseFloat(slider.value)));
    numInput.addEventListener("change", () => updateParam(parseFloat(numInput.value)));

    row.append(header, slider);
    container.appendChild(row);
  }

  document.getElementById("btnTypeQuad").classList.toggle("active", state.params.type === "quad");
  document.getElementById("btnTypeHex").classList.toggle("active", state.params.type === "hex");
}

function populatePresets() {
  const sel = document.getElementById("selectPreset");
  sel.innerHTML = "";
  QUILTS_CATALOG.presets.forEach((p, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = `${p.id} (${p.type.toUpperCase()}) – ${p.title}`;
    if (idx === 0) opt.selected = true;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    const chosen = QUILTS_CATALOG.presets[Number(sel.value)];
    if (!chosen) return;
    state.params = { ...chosen };
    document.getElementById("presetDescription").textContent = chosen.title;
    buildParameterSliders();
    resetSimulation();
  });
}

function drawPaletteStrip() {
  const strip = document.getElementById("paletteStripCanvas");
  const sctx = strip.getContext("2d");
  const pal = state.previewPalette || state.palette;
  for (let i = 0; i < 256; i++) {
    const c = pal.colors[i];
    sctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    sctx.fillRect(i, 0, 1, strip.height);
  }
  document.getElementById("activePaletteName").textContent = pal.id;
}

function buildPaletteGradientCSS(colors) {
  const stops = [];
  for (let i = 0; i <= 16; i++) {
    const idx = Math.min(254, i * 15);
    const c = colors[idx];
    stops.push(`rgb(${c[0]},${c[1]},${c[2]}) ${(i / 16 * 100).toFixed(1)}%`);
  }
  return `linear-gradient(to right, ${stops.join(",")})`;
}

function populatePalettes(filter = "") {
  const list = document.getElementById("paletteList");
  list.innerHTML = "";
  const q = filter.trim().toLowerCase();

  for (const pal of QUILTS_CATALOG.palettes) {
    if (q && !pal.id.toLowerCase().includes(q)) continue;
    const item = document.createElement("div");
    item.className = "pal-item" + (pal.id === state.palette.id ? " active" : "");
    item.setAttribute("role", "option");

    const nameSpan = document.createElement("span");
    nameSpan.className = "pal-item-name";
    nameSpan.textContent = pal.id;

    const grad = document.createElement("div");
    grad.className = "pal-item-gradient";
    grad.style.background = buildPaletteGradientCSS(pal.colors);

    item.append(nameSpan, grad);

    // Live hover preview (just like QUILTS.PAS chooseBox(..., True))!
    item.addEventListener("mouseenter", () => {
      state.previewPalette = pal;
      drawPaletteStrip();
      renderFrame();
    });
    item.addEventListener("mouseleave", () => {
      state.previewPalette = null;
      drawPaletteStrip();
      renderFrame();
    });
    item.addEventListener("click", () => {
      state.palette = structuredClone(pal);
      state.previewPalette = null;
      drawPaletteStrip();
      populatePalettes(document.getElementById("searchPalette").value);
      renderFrame();
    });

    list.appendChild(item);
  }
}

function updateTelemetryDOM() {
  document.getElementById("statIterations").textContent =
    state.totalIterations.toLocaleString("de-DE");
  document.getElementById("statThroughput").textContent =
    `${state.lastThroughputMItS.toFixed(1)} MIt/s`;
  document.getElementById("statMinMax").textContent =
    `${state.maxHit.toLocaleString("de-DE")} / ${state.minHit}`;

  const engineLabels = {
    workers: `Multi-Worker (${workerPool.numWorkers} Kerne)`,
    wasm: state.wasmInstance ? "Rust Wasm SIMD" : "Chebyshev Fast-Wasm",
    fast: "JS Branchless Fast-Trig",
    scalar1996: "Pascal 1996 Skalar",
  };
  document.getElementById("statEngineBadge").textContent = engineLabels[state.engine];
}

// --- 10. Original 1996 8-Bit Color-Mapped Truevision TGA Export (`saveTGA` lines 127-207) ---
function exportOriginalTGA() {
  const width = state.canvasSize;
  const height = state.canvasSize;
  const headerSize = 18;
  const colorMapSize = 256 * 3;
  const pixelCount = width * height;
  const buffer = new Uint8Array(headerSize + colorMapSize + pixelCount);

  // TGA Header (exact match to QUILTS.PAS lines 142-177)
  buffer[0] = 0x00; // ID length
  buffer[1] = 0x01; // Color map type = 1 (color-mapped)
  buffer[2] = 0x01; // Image type = 1 (uncompressed color-mapped)
  buffer[3] = 0x00; buffer[4] = 0x00; // Color map origin (0)
  buffer[5] = 0x00; buffer[6] = 0x01; // Color map length (256 in little-endian: 0x0100)
  buffer[7] = 24;   // 24 bits per palette entry
  buffer[8] = 0x00; buffer[9] = 0x00; // X origin
  buffer[10] = 0x00; buffer[11] = 0x00; // Y origin
  buffer[12] = width & 0xff;
  buffer[13] = (width >> 8) & 0xff;
  buffer[14] = height & 0xff;
  buffer[15] = (height >> 8) & 0xff;
  buffer[16] = 0x08; // 8 bits per pixel index
  buffer[17] = 0x00; // Bottom-to-top descriptor

  let offset = 18;
  const pal = state.palette;
  for (let i = 0; i < 256; i++) {
    const c = pal.colors[i];
    buffer[offset++] = c[2]; // Blue
    buffer[offset++] = c[1]; // Green
    buffer[offset++] = c[0]; // Red
  }

  // Reconstruct 8-bit palette indices bottom-to-top (QUILTS.PAS lines 200-205)
  const hist = state.histogram;
  const tSize = state.tileSize;
  const maxTileIdx = tSize - 1;
  const nperiod = state.nperiod;
  const invW = nperiod / width;
  const invH = nperiod / height;
  const logMax = Math.max(1.0, Math.log(Math.max(2, state.maxHit)));
  const twoOverSq3 = 2.0 / SQ3;

  for (let yy = height - 1; yy >= 0; yy--) {
    const yWorld = (height - 1 - yy) * invH;
    for (let xx = 0; xx < width; xx++) {
      let mx, my;
      if (state.params.type === "quad") {
        const u = (xx * invW) % 1.0;
        const v = yWorld - Math.floor(yWorld);
        mx = Math.min(maxTileIdx, (u * tSize) | 0);
        my = Math.min(maxTileIdx, (v * tSize) | 0);
      } else {
        const byRaw = yWorld * twoOverSq3;
        const bxRaw = xx * invW - 0.5 * byRaw;
        const bx = bxRaw - Math.floor(bxRaw);
        const by = byRaw - Math.floor(byRaw);
        mx = Math.min(maxTileIdx, (bx * tSize) | 0);
        my = Math.min(maxTileIdx, (by * tSize) | 0);
      }
      const mc = hist[my * tSize + mx];
      let idx = 0;
      if (mc > 0 && mc >= state.lowBorder) {
        if (state.toneMapping === "classic1996") {
          idx = Math.min(254, mc);
        } else {
          const norm = Math.min(1.0, Math.log(mc) / logMax);
          idx = Math.min(254, Math.max(1, 1 + ((norm * 253) | 0)));
        }
      }
      buffer[offset++] = idx;
    }
  }

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${state.params.id || "QUILT"}.TGA`;
  a.click();
}

// --- 11. 16x16 Palette Editor Dialog (`colorEdit` from QUILTS.PAS) ---
function initPaletteEditor() {
  const dialog = document.getElementById("dialogPaletteEditor");
  const gridCanvas = document.getElementById("palGridCanvas");
  const gctx = gridCanvas.getContext("2d");

  const sliderR = document.getElementById("palSliderR");
  const sliderG = document.getElementById("palSliderG");
  const sliderB = document.getElementById("palSliderB");

  function renderPalGrid() {
    const size = 20; // 16 * 20 = 320
    const colors = state.palette.colors;
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        const idx = x * 16 + y;
        const c = colors[idx];
        gctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
        gctx.fillRect(x * size, y * size, size, size);

        if (idx === state.palEditActiveIdx) {
          const lum = (c[0] + c[1] + c[2]) / 3;
          gctx.strokeStyle = lum < 140 ? "#ffffff" : "#000000";
          gctx.lineWidth = 2;
          gctx.strokeRect(x * size + 1, y * size + 1, size - 2, size - 2);
        }
        if (idx === state.palEditMarkedIdx) {
          const lum = (c[0] + c[1] + c[2]) / 3;
          gctx.fillStyle = lum < 140 ? "#ffffff" : "#000000";
          gctx.fillRect(x * size + 7, y * size + 7, 6, 6);
        }
      }
    }

    const activeColor = colors[state.palEditActiveIdx];
    document.getElementById("palSwatchPreview").style.backgroundColor =
      `rgb(${activeColor[0]},${activeColor[1]},${activeColor[2]})`;
    document.getElementById("palActiveIdxLabel").textContent = String(state.palEditActiveIdx);
    document.getElementById("palMarkedIdxLabel").textContent =
      state.palEditMarkedIdx === null ? "–" : String(state.palEditMarkedIdx);

    sliderR.value = String(activeColor[0]);
    sliderG.value = String(activeColor[1]);
    sliderB.value = String(activeColor[2]);
    document.getElementById("palOutR").textContent = String(activeColor[0]);
    document.getElementById("palOutG").textContent = String(activeColor[1]);
    document.getElementById("palOutB").textContent = String(activeColor[2]);
  }

  gridCanvas.addEventListener("pointerdown", (e) => {
    const rect = gridCanvas.getBoundingClientRect();
    const x = Math.min(15, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * 16)));
    const y = Math.min(15, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * 16)));
    state.palEditActiveIdx = Math.min(254, x * 16 + y);
    renderPalGrid();
  });

  const onChannelChange = () => {
    const c = state.palette.colors[state.palEditActiveIdx];
    c[0] = Number(sliderR.value);
    c[1] = Number(sliderG.value);
    c[2] = Number(sliderB.value);
    renderPalGrid();
    drawPaletteStrip();
    renderFrame();
  };

  sliderR.addEventListener("input", onChannelChange);
  sliderG.addEventListener("input", onChannelChange);
  sliderB.addEventListener("input", onChannelChange);

  document.getElementById("btnPalMark").addEventListener("click", () => {
    state.palEditMarkedIdx =
      state.palEditMarkedIdx === state.palEditActiveIdx ? null : state.palEditActiveIdx;
    renderPalGrid();
  });

  document.getElementById("btnPalSpread").addEventListener("click", () => {
    if (state.palEditMarkedIdx === null) return;
    const start = Math.min(state.palEditActiveIdx, state.palEditMarkedIdx);
    const end = Math.max(state.palEditActiveIdx, state.palEditMarkedIdx);
    if (end - start >= 3) {
      const c1 = state.palette.colors[start];
      const c2 = state.palette.colors[end];
      const span = end - start + 1;
      const dr = (c2[0] - c1[0]) / span;
      const dg = (c2[1] - c1[1]) / span;
      const db = (c2[2] - c1[2]) / span;
      for (let i = start + 1; i < end; i++) {
        state.palette.colors[i] = [
          Math.round(c1[0] + (i - start) * dr),
          Math.round(c1[1] + (i - start) * dg),
          Math.round(c1[2] + (i - start) * db),
        ];
      }
      renderPalGrid();
      drawPaletteStrip();
      renderFrame();
    }
  });

  document.getElementById("btnPalCopy").addEventListener("click", () => {
    if (state.palEditMarkedIdx === null) return;
    state.palette.colors[state.palEditActiveIdx] = [
      ...state.palette.colors[state.palEditMarkedIdx],
    ];
    renderPalGrid();
    drawPaletteStrip();
    renderFrame();
  });

  document.getElementById("btnPalSwap").addEventListener("click", () => {
    if (state.palEditMarkedIdx === null) return;
    const tmp = [...state.palette.colors[state.palEditActiveIdx]];
    state.palette.colors[state.palEditActiveIdx] = [
      ...state.palette.colors[state.palEditMarkedIdx],
    ];
    state.palette.colors[state.palEditMarkedIdx] = tmp;
    renderPalGrid();
    drawPaletteStrip();
    renderFrame();
  });

  document.getElementById("btnPalSaveMap").addEventListener("click", () => {
    const lines = state.palette.colors.map((c, idx) => {
      const base = `${String(c[0]).padStart(4, " ")}${String(c[1]).padStart(4, " ")}${String(c[2]).padStart(4, " ")}`;
      return idx === 0 ? `${base}    Map edited with QUILTS V2.0` : base;
    });
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${state.palette.id || "CUSTOM"}.MAP`;
    a.click();
  });

  document.getElementById("btnOpenPaletteEditor").addEventListener("click", () => {
    renderPalGrid();
    dialog.showModal();
  });
}

// --- 12. Benchmark Arena Dialog ---
function initBenchmarkArena() {
  const dialog = document.getElementById("dialogBenchmark");
  document.getElementById("btnOpenBenchmark").addEventListener("click", () => {
    dialog.showModal();
  });

  document.getElementById("btnRunBenchmarkSuite").addEventListener("click", async () => {
    const container = document.getElementById("benchResultsContainer");
    const totalIters = Number(document.getElementById("benchIterationsSelect").value);
    container.innerHTML = `<p>Vermesse Engines mit ${(totalIters / 1e6).toFixed(0)} Mio. Iterationen (${state.params.id}, ${state.params.type.toUpperCase()})…</p>`;

    const dummyHist = new Uint32Array(state.tileSize * state.tileSize);
    const orbit = { x: 0.1, y: 0.334 };
    const results = [];

    // 1. Scalar 1996
    await new Promise((r) => setTimeout(r, 30));
    let t0 = performance.now();
    stepScalar1996(state.params, state.hexA, orbit, dummyHist, state.tileSize, totalIters);
    let dt1 = (performance.now() - t0) / 1000.0;
    const m1 = totalIters / 1e6 / dt1;
    results.push({ name: "1. Pascal 1996 Referenz (Skalar, Math.sin/cos)", miter: m1, ms: dt1 * 1000 });

    // 2. Branchless + Chebyshev Fast-Trig
    await new Promise((r) => setTimeout(r, 30));
    t0 = performance.now();
    stepFastChebyshev(state.params, state.hexA, orbit, dummyHist, state.tileSize, totalIters);
    let dt2 = (performance.now() - t0) / 1000.0;
    const m2 = totalIters / 1e6 / dt2;
    results.push({ name: "2. Branchless + Chebyshev Fast-Trig (1 Kern)", miter: m2, ms: dt2 * 1000 });

    // 3. Multi-Core Web Worker Pool
    await new Promise((r) => setTimeout(r, 30));
    t0 = performance.now();
    await workerPool.runBatch(state.params, state.hexA, state.tileSize, totalIters, 1);
    let dt3 = (performance.now() - t0) / 1000.0;
    const m3 = totalIters / 1e6 / dt3;
    results.push({
      name: `3. Multi-Core Web Worker Pool (${workerPool.numWorkers} Threads parallel)`,
      miter: m3,
      ms: dt3 * 1000,
    });

    const maxM = Math.max(...results.map((r) => r.miter));
    container.innerHTML = "";
    for (const r of results) {
      const speedup = r.miter / m1;
      const pct = Math.max(4, (r.miter / maxM) * 100);
      const row = document.createElement("div");
      row.className = "bench-row";
      row.innerHTML = `
        <div class="bench-row-header">
          <span>${r.name}</span>
          <span>${r.miter.toFixed(1)} MIt/s (${r.ms.toFixed(0)} ms · <strong>${speedup.toFixed(2)}×</strong>)</span>
        </div>
        <div class="bench-bar-track">
          <div class="bench-bar-fill" style="width: ${pct.toFixed(1)}%"></div>
        </div>
      `;
      container.appendChild(row);
    }
  });
}

// --- 12b. 5K / Dual-5K Ultra-HD Wallpaper Studio ---
const WALLPAPER_PRESETS = {
  dual5k_split: {
    label: "Dual 5K Split (2× 5120×2880 px nahtlos für Monitor Links & Rechts)",
    totalW: 10240,
    totalH: 2880,
    splitDual: true,
  },
  "5k": {
    label: "Single 5K Studio Display (5120×2880 px · 16:9)",
    totalW: 5120,
    totalH: 2880,
    splitDual: false,
  },
  dual5k_single: {
    label: "Dual 5K Panorama in 1 Datei (10240×2880 px · 32:9)",
    totalW: 10240,
    totalH: 2880,
    splitDual: false,
  },
  "6k": {
    label: "Apple 6K Pro Display XDR (6016×3384 px · 16:9)",
    totalW: 6016,
    totalH: 3384,
    splitDual: false,
  },
  "4k": {
    label: "4K UHD Monitor (3840×2160 px · 16:9)",
    totalW: 3840,
    totalH: 2160,
    splitDual: false,
  },
  ipad13: {
    label: "iPad Pro 13\" M4 (2752×2064 px · 4:3)",
    totalW: 2752,
    totalH: 2064,
    splitDual: false,
  },
  square4k: {
    label: "Quadratischer Kunstdruck (4096×4096 px · 1:1)",
    totalW: 4096,
    totalH: 4096,
    splitDual: false,
  },
};

/**
 * Builds an exact palette-index tile [0..254] from a histogram.
 * When `referenceLiveHist` is provided, performs exact Percentile / Quantile (CDF) Histogram Matching
 * so that a newly computed high-res histogram has the EXACT same color distribution as the user's live canvas!
 */
function buildMatchedTileIndices(hist, tSize, referenceLiveHist = null) {
  const totalCells = tSize * tSize;
  const lowB = state.lowBorder;
  const mode = state.toneMapping;
  const invGamma = 1.0 / Math.max(0.1, state.gamma);

  const computeRawIndices = (hArr) => {
    const len = hArr.length;
    let maxH = 0;
    for (let i = 0; i < len; i++) {
      if (hArr[i] > maxH) maxH = hArr[i];
    }
    const logMax = Math.max(1.0, Math.log(Math.max(2, maxH)));
    const sqrtMax = Math.max(1.0, Math.sqrt(Math.max(2, maxH)));
    const out = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      const mc = hArr[i];
      if (mc === 0 || mc < lowB) {
        out[i] = 0;
      } else if (mode === "classic1996") {
        out[i] = mc > 254 ? 254 : mc;
      } else if (mode === "log") {
        const norm = Math.pow(Math.min(1.0, Math.log(mc) / logMax), invGamma);
        const idx = 1 + ((norm * 253.0) | 0);
        out[i] = idx > 254 ? 254 : idx;
      } else {
        const norm = Math.pow(Math.min(1.0, Math.sqrt(mc) / sqrtMax), invGamma);
        const idx = 1 + ((norm * 253.0) | 0);
        out[i] = idx > 254 ? 254 : idx;
      }
    }
    return out;
  };

  if (!referenceLiveHist || referenceLiveHist === hist) {
    return computeRawIndices(hist);
  }

  // Exact CDF / Quantile Matching against `referenceLiveHist`:
  // 1. Compute the exact palette index distribution of the live canvas
  const refIndices = computeRawIndices(referenceLiveHist);
  const refSorted = new Uint8Array(refIndices);
  refSorted.sort();
  const refLen = refSorted.length;

  // 2. Rank-order the cells of `hist` and assign each quantile the exact palette index from `refSorted`
  const order = new Uint32Array(totalCells);
  for (let i = 0; i < totalCells; i++) order[i] = i;
  order.sort((a, b) => hist[a] - hist[b]);

  const matched = new Uint8Array(totalCells);
  const scaleRank = (refLen - 1) / Math.max(1, totalCells - 1);
  for (let rank = 0; rank < totalCells; rank++) {
    const cellIdx = order[rank];
    const refPos = (rank * scaleRank) | 0;
    matched[cellIdx] = refSorted[refPos];
  }
  return matched;
}

function renderWidescreenToRgbaU32(
  hist,
  tSize,
  quiltType,
  outRgbaU32,
  targetW,
  targetH,
  xStartOffsetPx,
  fullVirtualH,
  periodY,
  phaseX,
  phaseY,
  useBilinear,
  referenceLiveHist = null
) {
  updateColorLut();
  const tilePaletteIdx = buildMatchedTileIndices(hist, tSize, referenceLiveHist);
  const totalCells = tSize * tSize;
  const tileColorsU32 = new Uint32Array(totalCells);
  for (let i = 0; i < totalCells; i++) {
    tileColorsU32[i] = colorLutU32[tilePaletteIdx[i]];
  }

  const scalePerPixel = Math.max(0.25, periodY) / Math.max(1, fullVirtualH);
  const twoOverSq3 = 2.0 / SQ3;
  const isQuad = quiltType === "quad";

  // Smooth subpixel anti-aliasing between the exact pre-mapped RGBA tile pixels
  const sampleSubpixelRGB = (u, v) => {
    const fx = u * tSize;
    const fy = v * tSize;
    const x0 = Math.floor(fx) % tSize;
    const y0 = Math.floor(fy) % tSize;
    const x1 = (x0 + 1) % tSize;
    const y1 = (y0 + 1) % tSize;
    const dx = fx - Math.floor(fx);
    const dy = fy - Math.floor(fy);

    const c00 = tileColorsU32[y0 * tSize + x0];
    const c10 = tileColorsU32[y0 * tSize + x1];
    const c01 = tileColorsU32[y1 * tSize + x0];
    const c11 = tileColorsU32[y1 * tSize + x1];

    const w00 = (1 - dx) * (1 - dy);
    const w10 = dx * (1 - dy);
    const w01 = (1 - dx) * dy;
    const w11 = dx * dy;

    const r =
      ((c00 & 0xff) * w00 +
        (c10 & 0xff) * w10 +
        (c01 & 0xff) * w01 +
        (c11 & 0xff) * w11) |
      0;
    const g =
      (((c00 >> 8) & 0xff) * w00 +
        ((c10 >> 8) & 0xff) * w10 +
        ((c01 >> 8) & 0xff) * w01 +
        ((c11 >> 8) & 0xff) * w11) |
      0;
    const b =
      (((c00 >> 16) & 0xff) * w00 +
        ((c10 >> 16) & 0xff) * w10 +
        ((c01 >> 16) & 0xff) * w01 +
        ((c11 >> 16) & 0xff) * w11) |
      0;

    return (255 << 24) | (b << 16) | (g << 8) | r;
  };

  for (let py = 0; py < targetH; py++) {
    const yWorld = (fullVirtualH - 1 - py) * scalePerPixel + phaseY;
    const dstRow = py * targetW;

    if (isQuad) {
      const v = yWorld - Math.floor(yWorld);
      const my = Math.min(tSize - 1, (v * tSize) | 0);
      const rowOff = my * tSize;

      for (let px = 0; px < targetW; px++) {
        const xWorld = (px + xStartOffsetPx) * scalePerPixel + phaseX;
        const u = xWorld - Math.floor(xWorld);
        if (useBilinear) {
          outRgbaU32[dstRow + px] = sampleSubpixelRGB(u, v);
        } else {
          const mx = Math.min(tSize - 1, (u * tSize) | 0);
          outRgbaU32[dstRow + px] = tileColorsU32[rowOff + mx];
        }
      }
    } else {
      const byRaw = yWorld * twoOverSq3;
      const halfBy = 0.5 * byRaw;
      const by = byRaw - Math.floor(byRaw);
      const my = Math.min(tSize - 1, (by * tSize) | 0);
      const rowOff = my * tSize;

      for (let px = 0; px < targetW; px++) {
        const xWorld = (px + xStartOffsetPx) * scalePerPixel + phaseX;
        const bxRaw = xWorld - halfBy;
        const bx = bxRaw - Math.floor(bxRaw);
        if (useBilinear) {
          outRgbaU32[dstRow + px] = sampleSubpixelRGB(bx, by);
        } else {
          const mx = Math.min(tSize - 1, (bx * tSize) | 0);
          outRgbaU32[dstRow + px] = tileColorsU32[rowOff + mx];
        }
      }
    }
  }
}

function downloadCanvasAsPng(offCanvas, filename) {
  return new Promise((resolve) => {
    offCanvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 400);
    }, "image/png");
  });
}

function initWallpaperStudio() {
  const dialog = document.getElementById("dialogWallpaper");
  const prevCanvas = document.getElementById("wpPreviewCanvas");
  const pctx = prevCanvas.getContext("2d", { alpha: false });

  const selPreset = document.getElementById("wpSelectPresetSize");
  const selSourceMode = document.getElementById("wpSelectSourceMode");
  const selTileRes = document.getElementById("wpSelectTileRes");
  const selIters = document.getElementById("wpSelectIterations");
  const sliderPeriodY = document.getElementById("wpSliderPeriodY");
  const sliderPhaseX = document.getElementById("wpSliderPhaseX");
  const sliderPhaseY = document.getElementById("wpSliderPhaseY");
  const chkBilinear = document.getElementById("wpChkBilinear");

  const syncSourceControls = () => {
    const isLive = selSourceMode.value === "live";
    selTileRes.disabled = isLive;
    selIters.disabled = isLive;
  };
  selSourceMode.addEventListener("change", syncSourceControls);
  syncSourceControls();

  const updatePreview = () => {
    const presetKey = selPreset.value;
    const preset = WALLPAPER_PRESETS[presetKey];
    const periodY = Number(sliderPeriodY.value);
    const phaseX = Number(sliderPhaseX.value);
    const phaseY = Number(sliderPhaseY.value);
    const useBilinear = chkBilinear.checked;

    document.getElementById("wpOutPeriodY").textContent = periodY.toFixed(2);
    document.getElementById("wpOutPhaseX").textContent = phaseX.toFixed(2);
    document.getElementById("wpOutPhaseY").textContent = phaseY.toFixed(2);
    document.getElementById("wpPreviewLabel").textContent = `Live-Vorschau: ${preset.label}`;
    document.getElementById("wpAspectBadge").textContent = `${preset.totalW} × ${preset.totalH} px`;

    // Scale preview canvas to exact aspect ratio of target monitor setup
    const aspect = preset.totalW / preset.totalH;
    const prevH = 216;
    const prevW = Math.min(820, Math.round(prevH * aspect));
    if (prevCanvas.width !== prevW || prevCanvas.height !== prevH) {
      prevCanvas.width = prevW;
      prevCanvas.height = prevH;
    }

    const img = pctx.createImageData(prevW, prevH);
    const buf32 = new Uint32Array(img.data.buffer);
    renderWidescreenToRgbaU32(
      state.histogram,
      state.tileSize,
      state.params.type,
      buf32,
      prevW,
      prevH,
      0,
      prevH,
      periodY,
      phaseX,
      phaseY,
      useBilinear
    );
    pctx.putImageData(img, 0, 0);

    // Draw subtle center bezel guide line when Dual-5K is selected
    if (presetKey.startsWith("dual5k")) {
      const midX = Math.floor(prevW / 2) + 0.5;
      pctx.save();
      pctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      pctx.lineWidth = 1.5;
      pctx.setLineDash([5, 5]);
      pctx.beginPath();
      pctx.moveTo(midX, 0);
      pctx.lineTo(midX, prevH);
      pctx.stroke();
      pctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      pctx.fillRect(8, 8, 95, 20);
      pctx.fillRect(midX + 8, 8, 102, 20);
      pctx.fillStyle = "#ffffff";
      pctx.font = "600 11px -apple-system, sans-serif";
      pctx.fillText("◀ 5K LINKS", 14, 22);
      pctx.fillText("5K RECHTS ▶", midX + 14, 22);
      pctx.restore();
    }
  };

  selPreset.addEventListener("change", updatePreview);
  sliderPeriodY.addEventListener("input", updatePreview);
  sliderPhaseX.addEventListener("input", updatePreview);
  sliderPhaseY.addEventListener("input", updatePreview);
  chkBilinear.addEventListener("change", updatePreview);

  const openStudio = () => {
    sliderPeriodY.value = String(Math.min(6, Math.max(1, state.nperiod)));
    document.getElementById("wpProgressArea").hidden = true;
    updatePreview();
    dialog.showModal();
  };

  document.getElementById("btnOpenWallpaperStudio").addEventListener("click", openStudio);
  document.getElementById("btnQuickWallpaper").addEventListener("click", openStudio);

  document.getElementById("btnStartWallpaperRender").addEventListener("click", async () => {
    const btn = document.getElementById("btnStartWallpaperRender");
    const progArea = document.getElementById("wpProgressArea");
    const progStatus = document.getElementById("wpProgressStatus");
    const progPct = document.getElementById("wpProgressPct");
    const progBar = document.getElementById("wpProgressBar");

    const wasRunning = state.running;
    state.running = false;
    btn.disabled = true;
    progArea.hidden = false;

    try {
      const presetKey = selPreset.value;
      const preset = WALLPAPER_PRESETS[presetKey];
      const sourceMode = selSourceMode.value;
      const periodY = Number(sliderPeriodY.value);
      const phaseX = Number(sliderPhaseX.value);
      const phaseY = Number(sliderPhaseY.value);
      const useBilinear = chkBilinear.checked;

      let hdTileSize = state.tileSize;
      let hdHist = state.histogram;
      let refHistForMatching = null;

      if (sourceMode !== "live") {
        hdTileSize = Number(selTileRes.value);
        const totalIters = Number(selIters.value);
        hdHist = new Uint32Array(hdTileSize * hdTileSize);
        if (sourceMode === "recompute_matched") {
          refHistForMatching = state.histogram;
        }
        const chunkIters = 10_000_000;
        const chunks = Math.ceil(totalIters / chunkIters);
        let doneIters = 0;

        for (let c = 0; c < chunks; c++) {
          const batch = Math.min(chunkIters, totalIters - doneIters);
          const pct = Math.round((doneIters / totalIters) * 85);
          progStatus.textContent = `1/2 · Berechne ${hdTileSize}×${hdTileSize} Grundkachel (${(doneIters / 1e6).toFixed(0)} / ${(totalIters / 1e6).toFixed(0)} Mio. Iterationen auf ${workerPool.numWorkers} Kernen)…`;
          progPct.textContent = `${pct} %`;
          progBar.style.width = `${pct}%`;
          await new Promise((r) => setTimeout(r, 15));

          const slices = await workerPool.runBatch(
            state.params,
            state.hexA,
            hdTileSize,
            batch,
            c * 100 + 7
          );
          const len = hdHist.length;
          for (const s of slices) {
            for (let i = 0; i < len; i++) {
              hdHist[i] += s[i];
            }
          }
          doneIters += batch;
        }
      }

      const stem = `${state.params.id || "QUILT"}_${state.palette.id}`;

      if (preset.splitDual) {
        // Render Left 5K (5120x2880) and Right 5K (5120x2880) seamlessly
        const singleW = 5120;
        const singleH = 2880;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = singleW;
        offCanvas.height = singleH;
        const offCtx = offCanvas.getContext("2d", { alpha: false });
        const imgData = offCtx.createImageData(singleW, singleH);
        const buf32 = new Uint32Array(imgData.data.buffer);

        progStatus.textContent = "Rendere & speichere linken 5K-Monitor (5120×2880 px)…";
        progPct.textContent = "90 %";
        progBar.style.width = "90%";
        await new Promise((r) => setTimeout(r, 25));

        renderWidescreenToRgbaU32(
          hdHist,
          hdTileSize,
          state.params.type,
          buf32,
          singleW,
          singleH,
          0,
          singleH,
          periodY,
          phaseX,
          phaseY,
          useBilinear,
          refHistForMatching
        );
        offCtx.putImageData(imgData, 0, 0);
        await downloadCanvasAsPng(offCanvas, `${stem}_5K_LEFT_5120x2880.png`);

        progStatus.textContent = "Rendere & speichere rechten 5K-Monitor (5120×2880 px)…";
        progPct.textContent = "96 %";
        progBar.style.width = "96%";
        await new Promise((r) => setTimeout(r, 25));

        renderWidescreenToRgbaU32(
          hdHist,
          hdTileSize,
          state.params.type,
          buf32,
          singleW,
          singleH,
          singleW, // Seamless continuation at x = 5120!
          singleH,
          periodY,
          phaseX,
          phaseY,
          useBilinear,
          refHistForMatching
        );
        offCtx.putImageData(imgData, 0, 0);
        await downloadCanvasAsPng(offCanvas, `${stem}_5K_RIGHT_5120x2880.png`);
      } else {
        progStatus.textContent = `Rendere & komprimiere ${preset.totalW}×${preset.totalH} Ultra-HD PNG…`;
        progPct.textContent = "92 %";
        progBar.style.width = "92%";
        await new Promise((r) => setTimeout(r, 25));

        const offCanvas = document.createElement("canvas");
        offCanvas.width = preset.totalW;
        offCanvas.height = preset.totalH;
        const offCtx = offCanvas.getContext("2d", { alpha: false });
        const imgData = offCtx.createImageData(preset.totalW, preset.totalH);
        const buf32 = new Uint32Array(imgData.data.buffer);

        renderWidescreenToRgbaU32(
          hdHist,
          hdTileSize,
          state.params.type,
          buf32,
          preset.totalW,
          preset.totalH,
          0,
          preset.totalH,
          periodY,
          phaseX,
          phaseY,
          useBilinear,
          refHistForMatching
        );
        offCtx.putImageData(imgData, 0, 0);
        await downloadCanvasAsPng(
          offCanvas,
          `${stem}_${preset.totalW}x${preset.totalH}.png`
        );
      }

      progStatus.textContent = "✅ Fertig! Ultra-HD Wallpaper wurde heruntergeladen.";
      progPct.textContent = "100 %";
      progBar.style.width = "100%";
    } finally {
      btn.disabled = false;
      state.running = wasRunning;
    }
  });
}


// --- 13. Theme Switcher (Light default + Dark + System, persisted in localStorage) ---
function initThemeSwitcher() {
  const meta = document.querySelector('meta[name="color-scheme"]');
  const buttons = document.querySelectorAll(".theme-btn");

  const syncButtons = () => {
    const current = meta.content || "light";
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.scheme === current);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const scheme = btn.dataset.scheme;
      meta.content = scheme;
      try {
        localStorage.setItem("color-scheme", scheme);
      } catch (_) {}
      syncButtons();
    });
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "color-scheme" && e.newValue) {
      meta.content = e.newValue;
      syncButtons();
    }
  });

  syncButtons();
}

// --- 14. Main Initialization ---
async function init() {
  initThemeSwitcher();
  populatePresets();
  buildParameterSliders();
  drawPaletteStrip();
  populatePalettes();
  initPaletteEditor();
  initBenchmarkArena();
  initWallpaperStudio();

  const hasRustWasm = await tryLoadRustWasm();
  document.getElementById("engineHardwareHint").textContent =
    `Hardware erkannt: ${workerPool.numWorkers} parallele Worker-Threads aktiv` +
    (hasRustWasm ? " · Rust Wasm geladen" : "");

  // Wire top-level controls
  const btnRun = document.getElementById("btnToggleRun");
  const pill = document.getElementById("runStatusPill");
  const toggleRun = () => {
    state.running = !state.running;
    btnRun.innerHTML = state.running ? "⏸ Pause <kbd>Space</kbd>" : "▶ Weiter <kbd>Space</kbd>";
    pill.textContent = state.running ? "RUNNING" : "PAUSED";
    pill.classList.toggle("paused", !state.running);
  };

  btnRun.addEventListener("click", toggleRun);
  document.getElementById("btnRestart").addEventListener("click", resetSimulation);

  document.getElementById("selectEngine").addEventListener("change", (e) => {
    state.engine = e.target.value;
    updateTelemetryDOM();
  });

  document.getElementById("sliderBatch").addEventListener("input", (e) => {
    state.batchSize = Number(e.target.value);
    document.getElementById("outBatch").textContent = state.batchSize.toLocaleString("de-DE");
  });

  document.getElementById("btnTypeQuad").addEventListener("click", () => {
    state.params.type = "quad";
    buildParameterSliders();
    resetSimulation();
  });
  document.getElementById("btnTypeHex").addEventListener("click", () => {
    state.params.type = "hex";
    buildParameterSliders();
    resetSimulation();
  });

  document.getElementById("sliderPeriod").addEventListener("input", (e) => {
    state.nperiod = Number(e.target.value);
    document.getElementById("outPeriod").textContent = `${state.nperiod} × ${state.nperiod}`;
    renderFrame();
  });

  document.getElementById("selectToneMapping").addEventListener("change", (e) => {
    state.toneMapping = e.target.value;
    renderFrame();
  });

  document.getElementById("sliderGamma").addEventListener("input", (e) => {
    state.gamma = Number(e.target.value);
    document.getElementById("outGamma").textContent = state.gamma.toFixed(2);
    renderFrame();
  });

  document.getElementById("sliderLowBorder").addEventListener("input", (e) => {
    state.lowBorder = Number(e.target.value);
    document.getElementById("outLowBorder").textContent = String(state.lowBorder);
    renderFrame();
  });

  document.getElementById("sliderBlackIndex").addEventListener("input", (e) => {
    state.blackIndex = Number(e.target.value);
    document.getElementById("outBlackIndex").textContent = String(state.blackIndex);
    renderFrame();
  });

  document.getElementById("sliderColorOffset").addEventListener("input", (e) => {
    state.colorOffset = Number(e.target.value);
    document.getElementById("outColorOffset").textContent = String(state.colorOffset);
    renderFrame();
  });

  document.getElementById("chkCycleColors").addEventListener("change", (e) => {
    state.cycleColors = e.target.checked;
  });

  document.getElementById("searchPalette").addEventListener("input", (e) => {
    populatePalettes(e.target.value);
  });

  document.getElementById("selectResolution").addEventListener("change", (e) => {
    state.tileSize = Number(e.target.value);
    state.histogram = new Uint32Array(state.tileSize * state.tileSize);
    tileRgbaU32 = new Uint32Array(state.tileSize * state.tileSize);
    resetSimulation();
  });

  document.getElementById("selectCanvasSize").addEventListener("change", (e) => {
    state.canvasSize = Number(e.target.value);
    canvas.width = state.canvasSize;
    canvas.height = state.canvasSize;
    imageData = ctx.createImageData(state.canvasSize, state.canvasSize);
    rgbaU32 = new Uint32Array(imageData.data.buffer);
    renderFrame();
  });

  // Exports & Imports
  document.getElementById("btnExportPng").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${state.params.id || "QUILT"}.png`;
    a.click();
  });

  document.getElementById("btnExportTga").addEventListener("click", exportOriginalTGA);

  document.getElementById("btnExportQup").addEventListener("click", () => {
    const p = state.params;
    const header = p.type === "quad" ? "quadQuilt" : "hexQuilt";
    const lines = [
      header,
      p.lambda.toExponential(14),
      p.alpha.toExponential(14),
      p.beta.toExponential(14),
      p.gamma.toExponential(14),
      p.omega.toExponential(14),
      p.shift.toExponential(14),
    ];
    if (p.type === "quad") {
      lines.push(p.ma.toExponential(14));
    } else {
      lines.push(p.a.toExponential(14), p.b.toExponential(14));
    }
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${p.id || "CUSTOM"}.QUP`;
    a.click();
  });

  const fileInputQup = document.getElementById("fileInputQup");
  document.getElementById("btnImportQup").addEventListener("click", () => fileInputQup.click());
  fileInputQup.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 8) {
      const isQuad = lines[0].toLowerCase().startsWith("quad");
      state.params = {
        id: file.name.replace(/\.[^.]+$/, ""),
        title: `Importiert: ${file.name}`,
        type: isQuad ? "quad" : "hex",
        lambda: parseFloat(lines[1]),
        alpha: parseFloat(lines[2]),
        beta: parseFloat(lines[3]),
        gamma: parseFloat(lines[4]),
        omega: parseFloat(lines[5]),
        shift: parseFloat(lines[6]),
        ma: isQuad ? parseFloat(lines[7]) : 2.0,
        a: isQuad ? 0.5 : parseFloat(lines[7]),
        b: isQuad ? 0.866 : parseFloat(lines[8] ?? "0.866"),
      };
      buildParameterSliders();
      resetSimulation();
    }
  });

  // Classic 1996 Keyboard Shortcuts (Space, R, T, +, -, <, >)
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (document.querySelector("dialog[open]")) return;
    if (e.key === " ") {
      e.preventDefault();
      toggleRun();
    } else if (e.key === "r" || e.key === "R") {
      resetSimulation();
    } else if (e.key === "t" || e.key === "T") {
      state.params.type = state.params.type === "quad" ? "hex" : "quad";
      buildParameterSliders();
      resetSimulation();
    } else if (e.key === "+") {
      state.lowBorder = Math.min(100, state.lowBorder + 1);
      document.getElementById("sliderLowBorder").value = state.lowBorder;
      document.getElementById("outLowBorder").textContent = state.lowBorder;
      renderFrame();
    } else if (e.key === "-") {
      state.lowBorder = Math.max(0, state.lowBorder - 1);
      document.getElementById("sliderLowBorder").value = state.lowBorder;
      document.getElementById("outLowBorder").textContent = state.lowBorder;
      renderFrame();
    }
  });

  requestAnimationFrame(simulationTick);
}

init();
