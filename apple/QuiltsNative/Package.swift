// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "QuiltsNative",
    platforms: [
        .macOS(.v14),
        .iOS(.v17)
    ],
    products: [
        .executable(name: "QuiltsNative", targets: ["QuiltsNative"])
    ],
    targets: [
        .executableTarget(
            name: "QuiltsNative",
            path: "Sources",
            exclude: ["QuiltsCompute.metal"],
            linkerSettings: [
                .linkedFramework("Metal"),
                .linkedFramework("MetalKit"),
                .linkedFramework("Accelerate"),
                .linkedFramework("CoreGraphics")
            ]
        )
    ]
)
