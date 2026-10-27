import SwiftUI
import CoreGraphics

@main
struct QuiltsNativeApp: App {
    var body: some Scene {
        WindowGroup("Quilts V2.0 – Symmetric Chaos on Apple Silicon") {
            QuiltsMainView()
                .frame(minWidth: 1120, minHeight: 740)
        }
    }
}

struct QuiltsMainView: View {
    private let catalog = QuiltsCatalog.loadFromWorkspace()
    @State private var sim = NativeQuiltSimulator(tileSize: 384)
    @State private var selectedPresetID: String = "BUILTIN_HEX_1996"
    @State private var selectedPaletteID: String = "VOLCANO3"
    @State private var selectedEngine: NativeComputeEngine = .metalGPU
    @State private var isRunning: Bool = true
    @State private var nperiod: Int = 3
    @State private var lowBorder: Int = 0
    @State private var totalIterationsText: String = "0"
    @State private var throughputText: String = "0.0 MIt/s"
    @State private var renderedImage: CGImage?
    @State private var benchmarkReport: String = ""

    private let timer = Timer.publish(every: 1.0 / 30.0, on: .main, in: .common).autoconnect()

    var currentPalette: QuiltPalette {
        catalog.palettes.first(where: { $0.id == selectedPaletteID }) ?? .fallbackVolcano
    }

    var body: some View {
        NavigationSplitView {
            Form {
                Section("Hardware & Rechen-Backend") {
                    Picker("Engine", selection: $selectedEngine) {
                        ForEach(NativeComputeEngine.allCases) { eng in
                            Text(eng.rawValue).tag(eng)
                        }
                    }
                    HStack {
                        Button(isRunning ? "⏸ Pause" : "▶ Weiter") {
                            isRunning.toggle()
                        }
                        .buttonStyle(.borderedProminent)

                        Button("↺ Neustart") {
                            sim.reset()
                            updateCanvasImage()
                        }
                    }
                    Button("⚡ Alle 4 Engines benchmarken (20M Iter.)") {
                        runBenchmarkSuite()
                    }
                    if !benchmarkReport.isEmpty {
                        Text(benchmarkReport)
                            .font(.system(.caption, design: .monospaced))
                            .padding(6)
                    }
                }

                Section("Historische .QUP Presets (1996)") {
                    Picker("Preset", selection: $selectedPresetID) {
                        ForEach(catalog.presets) { preset in
                            Text("\(preset.id) (\(preset.type.uppercased()))").tag(preset.id)
                        }
                    }
                    .onChange(of: selectedPresetID) { _, newValue in
                        if let p = catalog.presets.first(where: { $0.id == newValue }) {
                            sim.params = p
                            sim.reset()
                            updateCanvasImage()
                        }
                    }
                }

                Section("Kachelung & Fractint Paletten (.MAP)") {
                    Stepper("Kachel-Periode (nperiod): \(nperiod)×\(nperiod)", value: $nperiod, in: 1...10)
                        .onChange(of: nperiod) { _, _ in updateCanvasImage() }

                    Picker("Palette (.MAP)", selection: $selectedPaletteID) {
                        ForEach(catalog.palettes) { pal in
                            Text(pal.id).tag(pal.id)
                        }
                    }
                    .onChange(of: selectedPaletteID) { _, _ in updateCanvasImage() }
                }
            }
            .formStyle(.grouped)
            .navigationSplitViewColumnWidth(min: 340, ideal: 360)
        } detail: {
            VStack(spacing: 12) {
                HStack(spacing: 24) {
                    Label("Iterationen: \(totalIterationsText)", systemImage: "number.circle")
                    Label("Durchsatz: \(throughputText)", systemImage: "bolt.fill")
                        .foregroundStyle(.blue)
                    Label("Preset: \(sim.params.title)", systemImage: "sparkles")
                }
                .font(.system(.subheadline, design: .monospaced))
                .padding(.top, 8)

                if let img = renderedImage {
                    Image(decorative: img, scale: 1.0)
                        .resizable()
                        .interpolation(.high)
                        .aspectRatio(1.0, contentMode: .fit)
                        .background(Color.black)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .padding(12)
                } else {
                    Rectangle()
                        .fill(Color.black)
                        .aspectRatio(1.0, contentMode: .fit)
                        .padding(12)
                }
            }
        }
        .onAppear {
            if let first = catalog.presets.first {
                sim.params = first
            }
            updateCanvasImage()
        }
        .onReceive(timer) { _ in
            guard isRunning else { return }
            let batch = selectedEngine == .metalGPU ? 4_000_000 : 600_000
            let t0 = CFAbsoluteTimeGetCurrent()
            sim.step(engine: selectedEngine, iterations: batch)
            let dt = max(0.0001, CFAbsoluteTimeGetCurrent() - t0)
            let mits = (Double(batch) / 1_000_000.0) / dt
            totalIterationsText = NumberFormatter.localizedString(from: NSNumber(value: sim.totalIterations), number: .decimal)
            throughputText = String(format: "%.1f MIt/s", mits)
            updateCanvasImage()
        }
    }

    private func runBenchmarkSuite() {
        let testIters = 20_000_000
        var lines: [String] = ["Benchmark (20M Iterationen, \(sim.params.id)):"]
        var baseMIt = 1.0
        for eng in NativeComputeEngine.allCases {
            let benchSim = NativeQuiltSimulator(tileSize: 384, initialPreset: sim.params)
            let t0 = CFAbsoluteTimeGetCurrent()
            benchSim.step(engine: eng, iterations: testIters)
            let dt = max(0.0001, CFAbsoluteTimeGetCurrent() - t0)
            let mits = (Double(testIters) / 1_000_000.0) / dt
            if eng == .scalar1996 { baseMIt = mits }
            let speedup = mits / baseMIt
            lines.append(String(format: "• %@: %.1f MIt/s (%.1fx)", eng.rawValue, mits, speedup))
        }
        benchmarkReport = lines.joined(separator: "\n")
    }

    private func updateCanvasImage() {
        let canvasW = 640
        let canvasH = 640
        let tSize = sim.tileSize
        let hist = sim.histogram
        let pal = currentPalette.colors
        let maxHit = max(2, hist.max() ?? 2)
        let logMax = log(Double(maxHit))

        var lut = [UInt32](repeating: 0xFF000000, count: 256)
        for i in 0..<min(256, pal.count) {
            let c = pal[i]
            lut[i] = (255 << 24) | (UInt32(c[2]) << 16) | (UInt32(c[1]) << 8) | UInt32(c[0])
        }

        var tileRGBA = [UInt32](repeating: lut[0], count: tSize * tSize)
        for i in 0..<(tSize * tSize) {
            let mc = hist[i]
            if mc > UInt32(lowBorder) {
                let norm = min(1.0, log(Double(mc)) / logMax)
                let idx = min(254, max(1, 1 + Int(norm * 253.0)))
                tileRGBA[i] = lut[idx]
            }
        }

        var pixels = [UInt32](repeating: 0xFF000000, count: canvasW * canvasH)
        let invW = Double(nperiod) / Double(canvasW)
        let invH = Double(nperiod) / Double(canvasH)
        let twoOverSq3 = 2.0 / 3.0.squareRoot()
        let isQuad = sim.params.type == "quad"

        for py in 0..<canvasH {
            let yWorld = Double(canvasH - 1 - py) * invH
            if isQuad {
                let v = yWorld - floor(yWorld)
                let my = min(tSize - 1, Int(v * Double(tSize)))
                for px in 0..<canvasW {
                    let u = (Double(px) * invW).truncatingRemainder(dividingBy: 1.0)
                    let mx = min(tSize - 1, Int(u * Double(tSize)))
                    pixels[py * canvasW + px] = tileRGBA[my * tSize + mx]
                }
            } else {
                let byRaw = yWorld * twoOverSq3
                let halfBy = 0.5 * byRaw
                let by = byRaw - floor(byRaw)
                let my = min(tSize - 1, Int(by * Double(tSize)))
                for px in 0..<canvasW {
                    let bxRaw = Double(px) * invW - halfBy
                    let bx = bxRaw - floor(bxRaw)
                    let mx = min(tSize - 1, Int(bx * Double(tSize)))
                    pixels[py * canvasW + px] = tileRGBA[my * tSize + mx]
                }
            }
        }

        let data = Data(bytes: &pixels, count: pixels.count * 4)
        if let provider = CGDataProvider(data: data as CFData) {
            renderedImage = CGImage(
                width: canvasW,
                height: canvasH,
                bitsPerComponent: 8,
                bitsPerPixel: 32,
                bytesPerRow: canvasW * 4,
                space: CGColorSpaceCreateDeviceRGB(),
                bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
                provider: provider,
                decode: nil,
                shouldInterpolate: true,
                intent: .defaultIntent
            )
        }
    }
}
