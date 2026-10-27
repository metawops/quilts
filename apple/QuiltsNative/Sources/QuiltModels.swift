import Foundation

public struct QuiltPreset: Codable, Identifiable, Hashable {
    public let id: String
    public let filename: String
    public let title: String
    public var type: String // "quad" or "hex"
    public var lambda: Double
    public var alpha: Double
    public var beta: Double
    public var gamma: Double
    public var omega: Double
    public var shift: Double
    public var ma: Double
    public var a: Double
    public var b: Double

    public static let defaultHex1996 = QuiltPreset(
        id: "BUILTIN_HEX_1996",
        filename: "QUILTS.PAS",
        title: "QUILTS.PAS Built-in Hexagonal Default (1996)",
        type: "hex",
        lambda: 0.02,
        alpha: -0.1,
        beta: 0.14,
        gamma: 0.052,
        omega: 0.0,
        shift: 0.0,
        ma: 2.0,
        a: 0.5,
        b: 0.866
    )

    public static let defaultQuad1996 = QuiltPreset(
        id: "BUILTIN_QUAD_1996",
        filename: "QUILTS.PAS",
        title: "QUILTS.PAS Built-in Quadratic Default (1996)",
        type: "quad",
        lambda: -0.11,
        alpha: -0.26,
        beta: 0.19,
        gamma: -0.059,
        omega: 0.07,
        shift: 0.5,
        ma: 2.0,
        a: 0.5,
        b: 0.866
    )
}

public struct QuiltPalette: Codable, Identifiable, Hashable {
    public let id: String
    public let filename: String
    public var colors: [[UInt8]]

    public static var fallbackVolcano: QuiltPalette {
        var cols: [[UInt8]] = Array(repeating: [0, 0, 0], count: 256)
        for i in 1..<255 {
            let t = Double(i) / 254.0
            let r = UInt8(clamping: Int(255.0 * (0.5 + 0.5 * sin(t * 6.28318))))
            let g = UInt8(clamping: Int(255.0 * pow(t, 0.8)))
            let b = UInt8(clamping: Int(255.0 * (1.0 - t * 0.6)))
            cols[i] = [r, g, b]
        }
        cols[255] = [255, 255, 255]
        return QuiltPalette(id: "VOLCANO3", filename: "VOLCANO3.MAP", colors: cols)
    }
}

public struct QuiltsCatalog: Codable {
    public let presets: [QuiltPreset]
    public let palettes: [QuiltPalette]

    public static func loadFromWorkspace() -> QuiltsCatalog {
        let candidatePaths = [
            "../../assets/catalog.json",
            "assets/catalog.json",
            "/Users/stefan/KI_Projekte/Quilts/assets/catalog.json"
        ]
        for path in candidatePaths {
            let url = URL(fileURLWithPath: path)
            if let data = try? Data(contentsOf: url),
               let decoded = try? JSONDecoder().decode(QuiltsCatalog.self, from: data) {
                return decoded
            }
        }
        return QuiltsCatalog(
            presets: [.defaultHex1996, .defaultQuad1996],
            palettes: [.fallbackVolcano]
        )
    }
}
