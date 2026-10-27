//! Parameter definitions and `.QUP` parser for Quilts (1996 -> 2026).
//! Implements both Quadratic (`D_4`/`Z_4`) and Hexagonal (`D_6`/`Z_6`) symmetric chaos maps.

use std::f64::consts::PI;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(C)]
pub enum QuiltType {
    Quad = 0,
    Hex = 1,
}

#[derive(Debug, Clone, Copy)]
#[repr(C)]
pub struct QuiltParams {
    pub quilt_type: QuiltType,
    pub lambda: f64,
    pub alpha: f64,
    pub beta: f64,
    pub gamma: f64,
    pub omega: f64,
    pub shift: f64,
    /// Integer lattice multiplier `m` for quadratic quilts (`ma` in QUILTS.PAS)
    pub ma: f64,
    /// Linear lattice parameter `a` (`m1`) for hexagonal quilts
    pub a: f64,
    /// Linear lattice parameter `b` (`m2`) for hexagonal quilts
    pub b: f64,
}

impl Default for QuiltParams {
    fn default() -> Self {
        Self::default_hex_1996()
    }
}

impl QuiltParams {
    /// Original `defaultQuad` from `QUILTS.PAS` (lines 632-641)
    pub fn default_quad_1996() -> Self {
        Self {
            quilt_type: QuiltType::Quad,
            lambda: -0.11,
            alpha: -0.26,
            beta: 0.19,
            gamma: -0.059,
            omega: 0.07,
            shift: 0.5,
            ma: 2.0,
            a: 0.5,
            b: 0.866,
        }
    }

    /// Original `defaultHex` from `QUILTS.PAS` (lines 645-655)
    pub fn default_hex_1996() -> Self {
        Self {
            quilt_type: QuiltType::Hex,
            lambda: 0.02,
            alpha: -0.1,
            beta: 0.14,
            gamma: 0.052,
            omega: 0.0,
            shift: 0.0,
            ma: 2.0,
            a: 0.5,
            b: 0.866,
        }
    }

    /// Parse a historical `.QUP` parameter file from March 1996
    pub fn from_qup_str(input: &str) -> Result<Self, String> {
        let lines: Vec<&str> = input
            .lines()
            .map(|l| l.trim())
            .filter(|l| !l.is_empty())
            .collect();
        if lines.len() < 8 {
            return Err("Invalid .QUP file: fewer than 8 lines".to_string());
        }
        let quilt_type = if lines[0].eq_ignore_ascii_case("quadQuilt") {
            QuiltType::Quad
        } else {
            QuiltType::Hex
        };

        let parse_line = |idx: usize| -> Result<f64, String> {
            lines
                .get(idx)
                .ok_or_else(|| format!("Missing line {}", idx))?
                .parse::<f64>()
                .map_err(|e| format!("Parse error on line {}: {}", idx, e))
        };

        let lambda = parse_line(1)?;
        let alpha = parse_line(2)?;
        let beta = parse_line(3)?;
        let gamma = parse_line(4)?;
        let omega = parse_line(5)?;
        let shift = parse_line(6)?;

        let (ma, a, b) = match quilt_type {
            QuiltType::Quad => {
                let ma = parse_line(7)?;
                let a = parse_line(8).unwrap_or(0.5);
                let b = parse_line(9).unwrap_or(0.866);
                (ma, a, b)
            }
            QuiltType::Hex => {
                let a = parse_line(7)?;
                let b = parse_line(8).unwrap_or(0.866);
                (2.0, a, b)
            }
        };

        Ok(Self {
            quilt_type,
            lambda,
            alpha,
            beta,
            gamma,
            omega,
            shift,
            ma,
            a,
            b,
        })
    }

    /// Serialize to historical `.QUP` format
    pub fn to_qup_string(&self) -> String {
        let header = match self.quilt_type {
            QuiltType::Quad => "quadQuilt",
            QuiltType::Hex => "hexQuilt",
        };
        match self.quilt_type {
            QuiltType::Quad => format!(
                "{}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n",
                header,
                self.lambda,
                self.alpha,
                self.beta,
                self.gamma,
                self.omega,
                self.shift,
                self.ma
            ),
            QuiltType::Hex => format!(
                "{}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n{: .14E}\n",
                header,
                self.lambda,
                self.alpha,
                self.beta,
                self.gamma,
                self.omega,
                self.shift,
                self.a,
                self.b
            ),
        }
    }
}

/// Precomputed constants and lattice wave vectors for `iterateHex` and `iterateQuad`
/// Matches `QUILTS.PAS` lines 613-628 (`setVectors`) and lines 681-716 (`initialize`).
#[derive(Debug, Clone, Copy)]
pub struct PrecomputedConstants {
    pub p2: f64,
    pub p4: f64,
    pub p6: f64,
    pub sq3: f64,
    pub k11: f64,
    pub k12: f64,
    pub k21: f64,
    pub k22: f64,
    pub e111: f64,
    pub e112: f64,
    pub e121: f64,
    pub e122: f64,
    pub e131: f64,
    pub e132: f64,
    pub em11: f64,
    pub em12: f64,
    pub em21: f64,
    pub em22: f64,
    pub em31: f64,
    pub em32: f64,
    pub en11: f64,
    pub en12: f64,
    pub en21: f64,
    pub en22: f64,
    pub en31: f64,
    pub en32: f64,
    pub enh11: f64,
    pub enh12: f64,
    pub enh21: f64,
    pub enh22: f64,
    pub enh31: f64,
    pub enh32: f64,
    pub a11: f64,
    pub a12: f64,
    pub a21: f64,
    pub a22: f64,
    pub a31: f64,
    pub a32: f64,
    pub ah11: f64,
    pub ah12: f64,
    pub ah21: f64,
    pub ah22: f64,
    pub ah31: f64,
    pub ah32: f64,
}

impl PrecomputedConstants {
    pub fn from_params(params: &QuiltParams) -> Self {
        let p2 = 2.0 * PI;
        let p4 = 2.0 * p2;
        let p6 = 3.0 * p2;
        let sq3 = 3.0_f64.sqrt();

        let k11 = 1.0;
        let k12 = 0.0;
        let k21 = 0.5;
        let k22 = sq3 / 2.0;

        let e111 = 1.0;
        let e112 = -1.0 / sq3;
        let e121 = 0.0;
        let e122 = 2.0 / sq3;
        let e131 = -(e111 + e121);
        let e132 = -(e112 + e122);

        let em11 = 2.0 * e111 + e121;
        let em12 = 2.0 * e112 + e122;
        let em21 = 2.0 * e121 + e131;
        let em22 = 2.0 * e122 + e132;
        let em31 = 2.0 * e131 + e111;
        let em32 = 2.0 * e132 + e112;

        let en11 = 3.0 * e111 + 2.0 * e121;
        let en12 = 3.0 * e112 + 2.0 * e122;
        let en21 = 3.0 * e121 + 2.0 * e131;
        let en22 = 3.0 * e122 + 2.0 * e132;
        let en31 = 3.0 * e131 + 2.0 * e111;
        let en32 = 3.0 * e132 + 2.0 * e112;

        let enh11 = 3.0 * e111 + e121;
        let enh12 = 3.0 * e112 + e122;
        let enh21 = 3.0 * e121 + e131;
        let enh22 = 3.0 * e122 + e132;
        let enh31 = 3.0 * e131 + e111;
        let enh32 = 3.0 * e132 + e112;

        let a11 = params.beta;
        let a12 = params.gamma;
        let a21 = (-a11 - sq3 * a12) / 2.0;
        let a22 = (sq3 * a11 - a12) / 2.0;
        let a31 = -a11 - a21;
        let a32 = -a12 - a22;

        let ah11 = a11;
        let ah12 = -a12;
        let ah21 = (-ah11 - sq3 * ah12) / 2.0;
        let ah22 = (sq3 * ah11 - ah12) / 2.0;
        let ah31 = -ah11 - ah21;
        let ah32 = -ah12 - ah22;

        Self {
            p2,
            p4,
            p6,
            sq3,
            k11,
            k12,
            k21,
            k22,
            e111,
            e112,
            e121,
            e122,
            e131,
            e132,
            em11,
            em12,
            em21,
            em22,
            em31,
            em32,
            en11,
            en12,
            en21,
            en22,
            en31,
            en32,
            enh11,
            enh12,
            enh21,
            enh22,
            enh31,
            enh32,
            a11,
            a12,
            a21,
            a22,
            a31,
            a32,
            ah11,
            ah12,
            ah21,
            ah22,
            ah31,
            ah32,
        }
    }
}
