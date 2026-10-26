# Quilts – Symmetric Chaos on the Torus

Periodische chaotische Attraktoren (*„Symmetric Quilts“*) und symmetrische Abbildungen nach **Michael Field** und **Martin Golubitsky** – von einer MS-DOS-Implementierung in Turbo Pascal aus dem März 1996 in die moderne Welt übertragen.

---

## Persönliche Historie: März 1996 bis heute

Im **März 1996** entstand die ursprüngliche Version dieses Programms – **`QUILTS.PAS` (Quilts V1.1)** – in **Borland Turbo Pascal** unter **MS-DOS**. Inspiriert durch das Buch *Symmetry in Chaos* (dt. *Chaotische Symmetrien*) von Michael Field und Martin Golubitsky war das Ziel, die darin beschriebenen periodischen Torus-Attraktoren („Quilts“) selbst zu berechnen, interaktiv zu erforschen und hochauflösend einzufärben.

### Technische Eckdaten des Originals von 1996 (`QUILTS.PAS`)
- **Umgebung & Grafik:** Rund 2.233 Zeilen Turbo Pascal mit dem BGI-Treiber `SVGA256.BGI` für 256-Farben-SVGA-Auflösungen unter MS-DOS.
- **Zwei Symmetriegitter:** Vollständige Implementierung sowohl **quadratischer Quilts** (`iterateQuad`, $\mathbb{D}_4$- bzw. $\mathbb{Z}_4$-Symmetrie auf dem Einheitsquadrat) als auch **hexagonaler Quilts** (`iterateHex`, $\mathbb{D}_6$- bzw. $\mathbb{Z}_6$-Symmetrie auf dem hexagonalen Gitter).
- **2D-Dichte-Histogramm & Kachelung:** Während der Iteration wurden die Trefferhäufigkeiten pro Pixel gezählt (`mcount`) und die Grundzelle periodisch zu einem nahtlosen $n \times n$-Teppich (*Quilt*) gekachelt – wahlweise Punkt für Punkt während der Rechnung oder im schnellen Block-Kopiermodus (`fastMode` via `GetImage`/`PutImage`).
- **Farbpaletten & Editor:** Direkte Unterstützung der klassischen `.MAP`-Farbpaletten aus *Fractint* (ca. 80 Palettendateien von `ALTERN.MAP` über `FIREstrm.MAP` und `ROYAL.MAP` bis hin zu eigenen Kreationen wie `STEFAN1.MAP`) sowie ein direkt in die SVGA-Benutzungsoberfläche integrierter **RGB-Paletten-Editor** mit Farbverlaufs-Interpolation (`[s]pread`) und Schwellenwert-Filterung (`lowBorder`).
- **Parameter-Presets (`.QUP`):** 19 gespeicherte Parameterdateien (`ABB2_6.QUP` bis `ABBD_9.QUP`), die exakt die Buch-Abbildungen aus *Symmetry in Chaos* rekonstruieren.
- **Bildexport:** Eigener Encoder für unkomprimierte, farbpalettenbasierte 8-Bit-Truevision-TGA-Dateien (`.TGA`), um die berechneten Grafiken verlustfrei abzuspeichern.
- **Erster Windows-Ansatz (April 1996):** Nur wenige Wochen später entstand im April 1996 ein erster Entwurf einer ereignisgesteuerten Windows-Benutzungsoberfläche in **Borland Delphi** (`uMain.pas`, `uMatPara.pas`, `uImgPara.pas`), der jedoch ein unvollendeter Prototyp blieb.

### 30 Jahre später (2026)
Fast genau dreißig Jahre nach den ersten Zeilen in Turbo Pascal wurden die Originaldateien – Quelltexte, `.QUP`-Parameterdateien und alle historischen `.MAP`-Farbpaletten – von einer alten Diskette gerettet. Dieses Projekt bewahrt die historischen Schätze von 1996 und implementiert die Algorithmen mit moderner Hardware-Beschleunigung und einer zeitgemäßen, interaktiven Benutzungsoberfläche neu.

---

## Mathematischer Hintergrund

Die zugrunde liegende Mathematik verbindet **chaotische dynamische Systeme** mit **diskreten Symmetriegruppen** in der Ebene ($\mathbb{R}^2 \cong \mathbb{C}$) und auf dem zweidimensionalen Torus ($\mathbb{T}^2 = \mathbb{R}^2 / \mathcal{L}$). Obwohl einzelne Trajektorien empfindlich von den Anfangsbedingungen abhängen (Chaos), besitzt das invariante Maß des Attraktors im Grenzwert vieler Iterationen exakt die Symmetrie der zugrunde liegenden Gruppe $\Gamma$.

### 1. Symmetrische Torus-Abbildungen („Quilts“)

Betrachtet wird der zweidimensionale Torus $\mathbb{T}^2 = \mathbb{R}^2 / \mathcal{L}$, wobei $\mathcal{L}$ ein ebenes Gitter ist (das Einheitsquadrat-Gitter $\mathbb{Z}^2$ oder das hexagonale Gitter). Eine Abbildung $g: \mathbb{T}^2 \to \mathbb{T}^2$ lässt sich zu einer Abbildung $f: \mathbb{R}^2 \to \mathbb{R}^2$ der Form

$$f(X) = p(X) + L(X)$$

liften, wobei $p(X + \ell) = p(X)$ für alle $\ell \in \mathcal{L}$ doppelt-periodisch ist und $L$ eine lineare Abbildung bezeichnet, die das Gitter $\mathcal{L}$ invariant lässt. Fordert man, dass $f$ mit der Symmetriegruppe (Holohedrie) des Gitters kommutiert (bzw. bis auf Drehsymmetrie kommutiert), entstehen bei der Iteration $X_{k+1} = f(X_k) \bmod \mathcal{L}$ beschränkte chaotische Attraktoren, die sich periodisch in der Ebene als nahtlose **Quilt-Muster** aneinanderfügen lassen.

#### A. Quadratische Quilts ($\mathbb{D}_4$- und $\mathbb{Z}_4$-Symmetrie)
Auf dem Einheitsgitter $[0, 1)^2$ lautet die im Artikel [symmetric_chaos.pdf](symmetric_chaos.pdf) (Gleichung 1f) eingeführte $\mathbb{D}_4$-symmetrische Grundform:

$$f(x, y) = \lambda \begin{pmatrix} \sin(2\pi x) \\ \sin(2\pi y) \end{pmatrix} + \alpha \begin{pmatrix} \sin(2\pi x)\cos(2\pi y) \\ \sin(2\pi y)\cos(2\pi x) \end{pmatrix} + \beta \begin{pmatrix} \sin(4\pi x) \\ \sin(4\pi y) \end{pmatrix} + \gamma \begin{pmatrix} \sin(6\pi x)\cos(4\pi y) \\ \sin(6\pi y)\cos(4\pi x) \end{pmatrix} + m \begin{pmatrix} x \\ y \end{pmatrix} \pmod 1$$

In *Symmetry in Chaos* (1992) und in `QUILTS.PAS` (`iterateQuad`) ist diese Vorschrift zusätzlich um einen **Chiralitäts-/Symmetriebrechungsterm $\omega$** (bricht die Spiegelsymmetrie von $\mathbb{D}_4$ auf die reine Vierfach-Drehsymmetrie $\mathbb{Z}_4$) sowie eine **Gitterverschiebung $\text{shift}$** erweitert:

$$\begin{aligned}
x_{\text{neu}} &= \bigl((\lambda + \alpha \cos(2\pi y))\sin(2\pi x) - \omega \sin(2\pi y) + \beta \sin(4\pi x) + \gamma \sin(6\pi x)\cos(4\pi y) + m \cdot x + \text{shift}\bigr) \bmod 1 \\
y_{\text{neu}} &= \bigl((\lambda + \alpha \cos(2\pi x))\sin(2\pi y) + \omega \sin(2\pi x) + \beta \sin(4\pi y) + \gamma \sin(6\pi y)\cos(4\pi x) + m \cdot y + \text{shift}\bigr) \bmod 1
\end{aligned}$$

mit reellen Parametern $\lambda, \alpha, \beta, \gamma, \omega, \text{shift} \in \mathbb{R}$ und ganzzahligem Gitterfaktor $m \in \mathbb{Z}$.

#### B. Hexagonale Quilts ($\mathbb{D}_6$- und $\mathbb{Z}_6$-Symmetrie)
Auf dem hexagonalen Gitter mit den Basisvektoren $k_1 = (1, 0)^T$ und $k_2 = \bigl(\tfrac{1}{2}, \tfrac{\sqrt{3}}{2}\bigr)^T$ nutzt `iterateHex` drei um $120^\circ$ gedrehte Wellenvektor-Systeme erster, zweiter und dritter harmonischer Ordnung. Die Iteration koppelt den linearen Gitteranteil $(a x - b y,\; a y + b x)$ mit den trigonometrischen Summen derParameter $\lambda, \alpha, \beta, \gamma, \omega$, transformiert die Koordinaten über

$$b_y = \frac{2}{\sqrt{3}}\, y_{\text{neu}}, \qquad b_x = x_{\text{neu}} - \frac{1}{2}\, b_y$$

in das schiefwinklige Fundamentalgebiet $[0, 1)^2$, reduziert modulo $1$ und projiziert für den nächsten Iterationsschritt zurück in kartesische Koordinaten.

---

### 2. Planare symmetrische Attraktoren („Symmetric Icons“)

Neben den Torus-Abbildungen beschreibt das im Projekt abgelegte Referenz-Paper [symmetric_chaos.pdf](symmetric_chaos.pdf) auch die Familie der $\mathbb{D}_n$- und $\mathbb{Z}_n$-äquivarianten Abbildungen in der komplexen Ebene $\mathbb{C}$ (mit $u = z\bar{z} = |z|^2$ und $v = z^n$):

$$f(z) = \bigl(\lambda + \alpha u + \beta \operatorname{Re}(v) + \omega i\bigr)z + \gamma \bar{z}^{n-1} + \delta \bigl(\operatorname{Re}((z/|z|)^n)\bigr)^p \frac{z}{|z|}$$

- Für $\omega = 0$ und $\delta = 0$ ergibt sich die klassische polynomiale $\mathbb{D}_n$-Familie (Gleichung 1a).
- Für $\omega \neq 0$ wird die Spiegelsymmetrie zu $\mathbb{Z}_n$ gebrochen (Gleichung 1c).
- Für $\delta \neq 0$ entsteht nahe dem Ursprung $z = 0$ eine zusätzliche nicht-polynomiale Skalierungsstruktur (Gleichung 1d).

---

### 3. Visualisierung über das invariante Maß (Dichte-Färbung)

Sowohl das von Field & Golubitsky entwickelte Programmpaket *Prism* (`iter` & `draw`) als auch `QUILTS.PAS` visualisieren nicht bloß die Punktmenge des Attraktors, sondern dessen **invariantes Maß** (Wahrscheinlichkeitsdichte):

1. Nach dem Verwerfen einer kurzen Einschwingphase (*Transienten*) wird die Abbildung millionenfach iteriert.
2. Für jedes getroffene Pixel $(i, j)$ wird ein Zähler $H(i, j)$ inkrementiert.
3. Da die Trefferverteilung extrem steil verläuft (typischerweise liegen über $95\,\%$ aller getroffenen Pixel im Bereich kleiner Trefferzahlen, während scharfe Kaustiken und Faltkanten extrem hohe Spitzenwerte aufweisen), wird die Trefferzahl über Farbpaletten bzw. nichtlineare Farbbänder auf RGB-Werte abgebildet.

---

## Literatur & Referenzen

1. **Originalartikel (im Repository als Referenz enthalten):**
   - **Mike Field, Martin Golubitsky:** *„Symmetric Chaos: A pictorial exploration of an order imposed by symmetry within chaotic systems“*, in: **Computers in Physics**, Vol. 4, No. 5 (Sep/Oct 1990), S. 470–479. ([`symmetric_chaos.pdf`](symmetric_chaos.pdf), [DOI: 10.1063/1.4822939](https://doi.org/10.1063/1.4822939))
2. **Das Standardwerk (Hauptquelle für `QUILTS.PAS` und die `.QUP`-Parameterdateien):**
   - **Michael Field, Martin Golubitsky:** *Symmetry in Chaos: A Search for Pattern in Mathematics, Art and Nature*, Oxford University Press, Oxford / New York, **1992**, ISBN 978-0-19-853689-5.
   - **Deutsche Ausgabe:** *Chaotische Symmetrien: Die Suche nach Mustern in Mathematik, Kunst und Natur*, Birkhäuser Verlag, Basel / Boston / Berlin, **1993**, ISBN 978-3-7643-2844-3.
   - **2., überarbeitete Auflage:** *Symmetry in Chaos: A Search for Pattern in Mathematics, Art, and Nature* (2nd Edition), Society for Industrial and Applied Mathematics (SIAM), Philadelphia, **2009**, ISBN 978-0-89871-672-6. ([SIAM Bookstore / DOI: 10.1137/1.9780898717709](https://doi.org/10.1137/1.9780898717709))
3. **Weiterführende mathematische Grundlagen:**
   - **Pascal Chossat, Martin Golubitsky:** *„Symmetry-increasing bifurcation of chaotic attractors“*, in: **Physica D: Nonlinear Phenomena**, Vol. 32, Issue 3 (1988), S. 362–392. ([DOI: 10.1016/0167-2789(88)90065-6](https://doi.org/10.1016/0167-2789(88)90065-6))
   - **Greg King, Ian Stewart:** *„Symmetric Chaos“*, in: *Nonlinear Equations in the Applied Sciences* (W. F. Ames, C. Rogers, Hrsg.), Academic Press, 1992, S. 257–315.
