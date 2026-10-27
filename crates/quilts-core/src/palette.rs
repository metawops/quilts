//! Palette management, Fractint `.MAP` parser/writer, and real-time color manipulation
//! matching `QUILTS.PAS` (`loadPalette`, `savePalette`, `colorEdit`, `blackIndex`, `lowBorder`).

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(C)]
pub struct RgbColor {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(C)]
pub enum ColorMappingMode {
    /// Original 1996 behavior: `min(hit_count, 254)`
    Classic1996 = 0,
    /// Smooth logarithmic tone-mapping for high-density million-iteration attractors
    LogarithmicHdr = 1,
    /// Square-root tone-mapping with adjustable gamma
    SqrtGamma = 2,
}

#[derive(Debug, Clone)]
pub struct Palette {
    pub name: String,
    pub colors: [RgbColor; 256],
    /// Matches `blackIndex` in `QUILTS.PAS` (`<` and `>` keys in `colorEdit`)
    pub black_index: u8,
    /// Matches `lowBorder` in `QUILTS.PAS` (`+` and `-` keys)
    pub low_border: u32,
    /// Optional palette rotation offset (color cycling)
    pub color_offset: u8,
    pub mapping_mode: ColorMappingMode,
    pub gamma: f32,
}

impl Default for Palette {
    fn default() -> Self {
        let mut colors = [RgbColor { r: 0, g: 0, b: 0 }; 256];
        for i in 1..255 {
            let t = i as f32 / 254.0;
            colors[i] = RgbColor {
                r: (255.0 * (0.5 + 0.5 * (t * 6.28318).sin())) as u8,
                g: (255.0 * t.powf(0.8)) as u8,
                b: (255.0 * (1.0 - t * 0.6)) as u8,
            };
        }
        colors[255] = RgbColor {
            r: 255,
            g: 255,
            b: 255,
        };
        Self {
            name: "volcano3".to_string(),
            colors,
            black_index: 0,
            low_border: 0,
            color_offset: 0,
            mapping_mode: ColorMappingMode::Classic1996,
            gamma: 1.0,
        }
    }
}

impl Palette {
    /// Parse a Fractint `.MAP` palette file (`QUILTS.PAS` lines 244-323)
    pub fn from_map_str(name: &str, content: &str) -> Self {
        let mut pal = Self::default();
        pal.name = name.to_string();
        let mut index = 0usize;

        for line in content.lines() {
            if index > 255 {
                break;
            }
            let mut nums = line
                .split(|c: char| !c.is_ascii_digit())
                .filter(|s| !s.is_empty())
                .filter_map(|s| s.parse::<u16>().ok());

            if let (Some(r), Some(g), Some(b)) = (nums.next(), nums.next(), nums.next()) {
                pal.colors[index] = RgbColor {
                    r: r.min(255) as u8,
                    g: g.min(255) as u8,
                    b: b.min(255) as u8,
                };
                index += 1;
            }
        }

        // QUILTS.PAS line 330: setPalIndex(255, 63, 63, 63); { need white! }
        pal.colors[255] = RgbColor {
            r: 255,
            g: 255,
            b: 255,
        };
        pal
    }

    /// Export palette in Fractint `.MAP` format (`QUILTS.PAS` lines 336-350)
    pub fn to_map_string(&self) -> String {
        let mut out = String::with_capacity(256 * 20);
        for (i, c) in self.colors.iter().enumerate() {
            if i == 0 {
                out.push_str(&format!(
                    "{:4}{:4}{:4}    Map edited with QUILTS V2.0\n",
                    c.r, c.g, c.b
                ));
            } else {
                out.push_str(&format!("{:4}{:4}{:4}\n", c.r, c.g, c.b));
            }
        }
        out
    }

    /// Interpolate a smooth gradient range between two palette indices (`=` key in `colorEdit`, lines 1383-1405)
    pub fn create_gradient_range(&mut self, idx_a: u8, idx_b: u8) {
        let start = idx_a.min(idx_b) as usize;
        let end = idx_a.max(idx_b) as usize;
        if end - start < 3 {
            return;
        }
        let c1 = self.colors[start];
        let c2 = self.colors[end];
        let span = (end - start + 1) as f64;
        let dr = (c2.r as f64 - c1.r as f64) / span;
        let dg = (c2.g as f64 - c1.g as f64) / span;
        let db = (c2.b as f64 - c1.b as f64) / span;

        for i in (start + 1)..end {
            let step = (i - start) as f64;
            self.colors[i] = RgbColor {
                r: (c1.r as f64 + (step * dr).trunc()).clamp(0.0, 255.0) as u8,
                g: (c1.g as f64 + (step * dg).trunc()).clamp(0.0, 255.0) as u8,
                b: (c1.b as f64 + (step * db).trunc()).clamp(0.0, 255.0) as u8,
            };
        }
    }

    /// Precompute a 256-entry packed RGBA8888 lookup table (`u32`, little-endian `0xAABBGGRR`)
    /// respecting `black_index` and `color_offset`.
    #[inline]
    pub fn build_rgba_lut(&self) -> [u32; 256] {
        let mut lut = [0u32; 256];
        // Index 0 is background black
        let bg = self.colors[0];
        lut[0] = 0xFF00_0000 | ((bg.b as u32) << 16) | ((bg.g as u32) << 8) | (bg.r as u32);

        for i in 1..=254u8 {
            if i <= self.black_index {
                lut[i as usize] = 0xFF00_0000;
            } else {
                let shifted = 1 + ((i as usize - 1 + self.color_offset as usize) % 254);
                let c = self.colors[shifted];
                lut[i as usize] =
                    0xFF00_0000 | ((c.b as u32) << 16) | ((c.g as u32) << 8) | (c.r as u32);
            }
        }
        lut[255] = 0xFFFF_FFFF;
        lut
    }
}
