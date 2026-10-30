/**
 * Quilts V2 - Internationalization (i18n) Module
 * Complete English & German translations for all UI elements, tooltips, dialogs, and about cards.
 */

export const I18N = {
  de: {
    // --- Header & Topbar ---
    tagline: "Symmetric Chaos on the Torus · ",
    author_prefix: "von ",
    telemetry_iterations: "Iterationen",
    telemetry_throughput: "Durchsatz",
    telemetry_minmax: "Max / Min Treffer",
    telemetry_engine: "Aktive Engine",
    btn_wallpaper: "🖼 Wallpaper",
    btn_wallpaper_title: "Ultra-HD Wallpaper Studio (Mac & iPad)",
    btn_benchmark: "⚡ Benchmark",
    btn_benchmark_title: "Hardware Compute Benchmark-Arena",
    btn_palettes: "🎨 Paletten",
    btn_palettes_title: "16×16 Fractint Paletten-Editor",
    btn_about: "📖 Doku",
    btn_about_title: "Dokumentation: Über das Projekt & Bedienungsanleitung (How to)",
    btn_docs: "📖 Doku",
    btn_docs_title: "Dokumentation: Über das Projekt & Bedienungsanleitung (How to)",
    docs_title: "Dokumentation · Quilts V2",
    tab_about: "About",
    tab_howto: "How to ...",
    theme_light_title: "Helles Design (Standard)",
    theme_dark_title: "Dunkles Design",
    theme_system_title: "Systemeinstellung folgen",
    lang_de_title: "Deutsch",
    lang_en_title: "English",

    // --- Left Sidebar: Engine & Controls ---
    card_engine_title: "Steuerung & Hardware-Engine",
    btn_pause: "⏸ Pause <kbd>Space</kbd>",
    btn_resume: "▶ Weiter <kbd>Space</kbd>",
    btn_toggle_run_title: "Leertaste: Start / Stop",
    btn_restart: "🔄 Reset <kbd>R</kbd>",
    btn_restart_title: "Taste R: Histogramm zurücksetzen",
    lbl_engine_select: "Compute-Engine & Vektorisierung:",
    opt_engine_workers: "4. Multi-Core Web Worker Pool (Parallel)",
    opt_engine_wasm: "3. Rust / WebAssembly Kernel (Zero-Copy)",
    opt_engine_fast: "2. JS Branchless + Chebyshev Fast-Trig",
    opt_engine_scalar: "1. Pascal 1996 Referenz (Skalar 1:1)",
    lbl_batch_size: "Iterationen pro Frame-Batch",
    engine_badge_workers: "Multi-Worker ({n} Kerne)",
    engine_badge_wasm: "Rust Wasm SIMD",
    engine_badge_wasm_fallback: "Chebyshev Fast-Wasm",
    engine_badge_fast: "JS Fast-Trig",
    engine_badge_scalar: "Pascal 1996 Skalar",
    engine_hw_hint: "Hardware erkannt: {n} parallele Worker-Threads aktiv",
    engine_hw_hint_wasm: " · Rust Wasm geladen",

    // --- Left Sidebar: Presets ---
    card_presets_title: "Historische Presets (.QUP, 1996)",
    btn_import_qup: "Import",
    btn_import_qup_title: ".QUP Datei laden",
    search_preset_ph: "Preset suchen…",
    filter_all: "Alle",
    filter_quad: "Quad (D4)",
    filter_hex: "Hex (D6)",

    // --- Left Sidebar: Math Parameters ---
    card_params_title: "Mathematische Attraktor-Parameter",
    lbl_grid_type: "Symmetrie-Gitter:",
    btn_type_quad: "4-fach Quad (𝔻₄)",
    btn_type_quad_title: "Quadratische Torus-Kachelung mit 4-zähliger D4-Symmetrie",
    btn_type_hex: "6-fach Hex (𝔻₆)",
    btn_type_hex_title: "Hexagonale Torus-Kachelung mit 6-zähliger D6-Symmetrie",
    btn_reset_params: "↺ Standardwerte für diese Symmetrie",

    // --- Center Workspace & Canvas ---
    zoom_label: "Ansicht:",
    zoom_fit: "Einpassen (Fit)",
    zoom_100: "Original (100 %)",
    canvas_size_label: "Canvas:",
    btn_export_png: "📸 PNG speichern",
    btn_export_tga: "💾 Original .TGA (1996)",
    btn_export_tga_title: "Originalgetreuer 8-Bit Color-Mapped Truevision TGA-Export wie 1996",
    btn_export_qup: "📄 .QUP speichern",

    // --- Right Sidebar: Tiling & Coloring ---
    card_tiling_title: "Kachelung & Dichte-Färbung",
    lbl_periodic_tiling: "Periodische Kachelung (n × n)",
    lbl_tone_mapping: "Tone-Mapping & Dynamikkompression:",
    opt_tonemap_log: "1. Logarithmisch (HDR / log(1 + Hits))",
    opt_tonemap_sqrt: "2. Quadratwurzel-Kompression (sqrt)",
    opt_tonemap_classic: "3. Pascal 1996 Original (Clamping <= 254)",
    lbl_gamma: "Gamma-Kompression (Kontrast)",
    lbl_low_border: "Untere Farbschwelle (Low-Cutoff)",
    lbl_black_index: "Farbe 0 (Hintergrund-Farbe)",
    btn_cycle_start: "▶ Farbrotation starten",
    btn_cycle_stop: "⏸ Farbrotation stoppen",
    lbl_cycle_speed: "Rotations-Geschwindigkeit",

    // --- Right Sidebar: Palettes ---
    card_palettes_title: "83 Fractint Farbpaletten (.MAP)",
    search_palette_ph: "Palette suchen…",
    btn_open_pal_editor: "🎨 Paletten-Editor öffnen…",

    // --- Modal 1: Benchmark Arena ---
    bench_title: "⚡ Quilts Hardware- & Technologie-Benchmark-Arena",
    bench_subtitle: "Vergleicht den Durchsatz (Millionen Iterationen pro Sekunde) für identische Attraktor-Parameter.",
    bench_scope_label: "Test-Umfang pro Engine:",
    bench_opt_5m: "5 Mio. Iterationen (Schnelltest)",
    bench_opt_15m: "15 Mio. Iterationen (Standard)",
    bench_opt_40m: "40 Mio. Iterationen (Stresstest)",
    bench_btn_run: "▶ Benchmark-Suite jetzt starten",
    bench_placeholder: "Klicke auf „Benchmark-Suite jetzt starten“, um alle Engines live auf Deinem System zu vermessen.",
    bench_running_prefix: "Vermesse Engines mit",
    bench_running_suffix: "Mio. Iterationen",
    bench_native_title: "Hinweis zu den nativen Apple-Silicon-Engines (macOS / iPadOS / iOS & CLI):",
    bench_native_text: "Im nativen Swift/Metal-Projekt (<code>apple/QuiltsNative</code>) bzw. im Rust-CLI-Benchmark (<code>bench_arena</code>) erreichen handgeschriebener ARM64-NEON-Assembler (<code>asm!</code>) und der Apple Metal GPU Compute Shader Spitzenwerte von <strong>150 bis über 500 MIt/s</strong>.",
    btn_close: "Schließen",

    // --- Modal 2: Palette Editor ---
    pal_title: "🎨 16×16 Fractint Paletten-Editor (256 Farben)",
    pal_subtitle: "RGB-Werte direkt bearbeiten oder Farbverläufe interpolieren wie im Original von 1996.",
    pal_active_label: "Aktiver Index:",
    pal_marked_label: "Markierter Index:",
    pal_red: "Rot (0–255)",
    pal_green: "Grün (0–255)",
    pal_blue: "Blau (0–255)",
    pal_btn_mark: "[Space] Markieren / Lösen",
    pal_btn_spread: "[=] Verlauf erzeugen (Spread)",
    pal_btn_copy: "[C] Markierte Farbe hierhin kopieren",
    pal_btn_swap: "[X] Mit markierter Farbe tauschen",
    pal_btn_save: "[S] Als .MAP Datei exportieren",
    pal_close: "Fertig",

    // --- Modal 3: Wallpaper Studio ---
    wp_title: "🖼 Ultra-HD Wallpaper Studio (Mac & iPad)",
    wp_subtitle: "Erzeugt verzerrungsfreie, nahtlos gekachelte Hintergrundbilder für Mac-Monitore und iPads mit hochauflösendem Grundkachel-Histogramm und Subpixel-Glättung.",
    wp_preview_live_label: "Live-Ausschnitt & Seitenverhältnis-Vorschau",
    wp_target_label: "Ziel-Gerät & Ausgabeformat",
    wp_grp_mac: "🖥 Mac & Desktop-Monitore",
    wp_grp_ipad: "📱 Apple iPad",
    wp_grp_art: "🖼 Kunstdruck",
    wp_src_label: "Berechnungsquelle & Detailgrad",
    wp_opt_live: "1. Live-Histogramm direkt übernehmen (Echtzeit-Export, 0 s)",
    wp_opt_hd: "2. Ultra-HD Histogramm neu berechnen (Höchste Schärfe)",
    wp_tileres_label: "Grundkachel-Auflösung (Detailgrad)",
    wp_iters_label: "Iterations-Tiefe für Ultra-HD",
    wp_period_label: "Vertikale Kachel-Anzahl (Symmetrie-Maßstab)",
    wp_phasex_label: "Horizontaler Phasen-Versatz (X-Zentrierung)",
    wp_phasey_label: "Vertikaler Phasen-Versatz (Y-Zentrierung)",
    wp_bilinear_label: "Bilineare Subpixel-Glättung (Anti-Aliasing) aktivieren",
    wp_cancel: "Abbrechen",
    wp_render_btn: "🚀 Ultra-HD Wallpaper jetzt rendern & herunterladen",

    // --- Modal 4: About Modal ---
    about_title: "Über Quilts V2 · Symmetrie im Chaos",
    about_subtitle: "30 Jahre Historie (1996–2026) · Dynamische Systeme · Fractint-Lizenzen · Co-Autorenschaft mit Google Gemini",
    about_card1_title: "🕰️ 30 Jahre Historie: Von MS-DOS 1996 zum modernen Web 2026",
    about_card1_badge: "1996 → 2026",
    about_card1_text1: "Das originale <strong>Quilts</strong> wurde im <strong>März 1996</strong> von <strong>Stefan Wolfrum</strong> in Borland Turbo Pascal 7.0 für MS-DOS programmiert (<code>QUILTS.PAS</code>). Zur damaligen Ära der Intel 486- und frühen Pentium-Rechner lief die Berechnung im VGA-Modus 13h (320×200 Pixel) oder VESA Super-VGA (640×480 Pixel) mit einer festen Farbtiefe von 256 Farben aus 18-Bit-VGA-DAC-Registern.",
    about_card1_text2: "Exakt 30 Jahre später wurde der originale Quelltext von einer archivierten 3,5″-Diskette gerettet und als moderne, plattformunabhängige Web- und WebAssembly-Anwendung von Grund auf neu implementiert.",
    about_card1_text3: "<strong>Volle Rückwärtskompatibilität:</strong> Deine originalen <code>.QUP</code>-Parameterdateien von 1996 können über die Schaltfläche <em>„Import“</em> (im Bereich der historischen Presets) 1:1 geladen und über die Schaltfläche <em>„📄 .QUP speichern“</em> (unterhalb der Zeichenfläche) jederzeit wieder exportiert werden. Ebenso ist der originale, unkomprimierte 8-Bit Truevision TGA-Export (<code>saveTGA</code>) mit eingebetteter Farbtabelle direkt im Browser verfügbar.",

    about_card2_title: "📐 Mathematischer Hintergrund: Symmetrie im Chaos",
    about_card2_badge: "Dynamische Systeme & Torus 𝕋²",
    about_card2_intro: "Quilts simuliert diskrete, nichtlineare dynamische Systeme auf dem zweidimensionalen Torus <code>𝕋² = ℝ² / ℤ²</code>. Die mathematische Magie entsteht durch die Verknüpfung von deterministischem Chaos mit diskreten ebenen kristallographischen Raumgruppen:",
    about_card2_quad: "<strong>Quadratische Kachelung (Typ Quad):</strong> Basiert auf der Raumgruppe <code>p4m</code> (Punktgruppensymmetrie <code>𝔻₄</code>). Die quadratische Einheitskachel besitzt eine 4-zählige Rotationssymmetrie (90°-Drehungen) und vier Spiegelebenen (horizontal, vertikal und beide Diagonalen).",
    about_card2_hex: "<strong>Hexagonale Kachelung (Typ Hex):</strong> Basiert auf der Raumgruppe <code>p6m</code> (Punktgruppensymmetrie <code>𝔻₆</code> auf einem Dreiecksgitter mit Basisvektoren unter 60°/120°). Sie weist eine 6-zählige Rotationssymmetrie und sechs Spiegelebenen auf.",
    about_card2_ergodic: "<strong>Ergodizität & Dichte-Histogramm:</strong> Die Iterationsvorschrift verknüpft polynomiale Nichtlinearitäten mit periodischen Fourier- und Chebyshev-Harmonischen. Ein einzelner Startpunkt <code>(x₀, y₀)</code> durchläuft hunderte Millionen Iterationen. Ein hochauflösendes 2D-Akkumulations-Histogramm zählt, wie häufig die Trajektorie jede Zelle des Phasenraums trifft (ergodische Aufenthaltswahrscheinlichkeit).",
    about_card2_hdr: "<strong>Logarithmisches HDR Tone-Mapping:</strong> Da die Trefferhäufigkeiten Dynamikbereiche von über <code>10⁷ : 1</code> umspannen können, transformiert ein logarithmisches Mapping <code>log(1 + Hits)</code> bzw. eine Quadratwurzel-Kompression mit einstellbarem Gamma-Wert die Rohdaten stufenlos in die 256 Palettenfarben.",

    about_card3_title: "📚 Wissenschaftliche Literatur & Primärquellen",
    about_card3_badge: "Field & Golubitsky (1990/1992)",
    about_card3_intro: "Die mathematischen Grundlagen und Algorithmen gehen auf die Forschungsarbeiten von <strong>Michael Field</strong> und <strong>Martin Golubitsky</strong> zurück:",
    about_card3_book: "<em>Symmetry in Chaos: A Search for Pattern in Mathematics, Art and Nature</em>. Oxford University Press (2. Auflage 2009 bei SIAM, ISBN 978-0-898716-72-6).",
    about_card3_siam_link: "🔗 Offizieller SIAM E-Books Eintrag (DOI: 10.1137/1.9780898717709)",
    about_card3_paper: "<em>Symmetric Chaos: A pictorial exploration of an order imposed by symmetry within chaotic systems</em>. In: <em>Computers in Physics</em>, Vol. 4, No. 5 (Sep/Oct 1990), S. 470–479 (American Institute of Physics).",
    about_card3_paper_link: "🔗 AIP Publishing Journal (DOI: 10.1063/1.4822939)",
    about_card3_sciam: "<em>Symmetric Chaos</em>. In: <em>Scientific American</em>, Vol. 267, No. 6, S. 86–92. Deutsche Übersetzung: <em>Symmetrisches Chaos</em>, in: <em>Spektrum der Wissenschaft</em>, Februar 1993, S. 56–64.",
    about_card3_stewart: "<em>Fearful Symmetry: Is God a Geometer?</em>. Blackwell Publishers / Penguin Books.",

    about_card4_title: "🎨 Die 83 Fractint-Paletten (.MAP) & Urheberrechte",
    about_card4_badge: "Stone Soup Group (1988–2000)",
    about_card4_text1: "Die in Quilts V2 enthaltenen <strong>83 Farbpaletten</strong> (Dateiformat <code>.MAP</code> mit 256 RGB-Farbtriplets) stammen aus dem legendären Fraktal-Grafikprogramm <strong>Fractint</strong> der <em>Stone Soup Group</em> (u. a. Bert Tyler, Timothy Wegner, Mark Peterson, Pieter Branderhorst).",
    about_card4_text2: "Fractint war in den 1990er-Jahren der weltweite De-facto-Standard für Fraktal- und Chaossimulationen auf dem PC. Zahllose Enthusiasten und Fraktalkünstler aus der globalen Community steuerten damals eigene Farbtabellen als gemeinnützige Freeware bei.",
    about_card4_text3: "<strong>Urheberrechts- und Lizenzhinweis:</strong> Diese historischen Farbpaletten werden in Quilts V2 zu Dokumentations-, Bildungs- und Nostalgiezwecken zur Verfügung gestellt, um das visuelle Erscheinungsbild von 1996 getreu und unverfälscht erlebbar zu machen. Sämtliche Urheberrechte an den individuellen Farbgradienten verbleiben bei den ursprünglichen Urhebern der Stone Soup Group bzw. den damaligen Beitragsleistenden. Sollte ein Rechteinhaber Einwände gegen die Aufnahme einer bestimmten Farbpalette haben, bitten wir um einen kurzen Hinweis über das GitHub-Repository zur sofortigen Entfernung.",

    about_card5_title: "🤖 KI-Unterstützung & Google Gemini",
    about_card5_badge: "Entwicklung mit Google Gemini",
    about_card5_intro: "Quilts V2 entstand im Oktober 2026 als persönliches Projekt von <strong>Stefan Wolfrum</strong> mit Unterstützung von <strong>Google Gemini</strong> (Google DeepMind) in der agentischen Entwicklungsumgebung <strong>Google Antigravity</strong>:",
    about_card5_stefan: "<strong>Stefan Wolfrum</strong> (<a href=\"https://github.com/metawops\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"about-link\">@metawops</a>): Idee, mathematische Konzeption, Original-Implementierung 1996 in Borland Turbo Pascal (<code>QUILTS.PAS</code>), Gestaltung der Benutzungsoberfläche, Kuration historischer Presets & Paletten und Weiterentwicklung.",
    about_card5_gemini: "<strong>Google Gemini</strong> (Google DeepMind): KI-Pair-Programming via Google Antigravity. Dekodierung und Analyse des 16-Bit Real-Mode Pascal-Codes, mathematische Formalisierung der hexagonalen Dreiecks-Kachelung und bilinearen Subpixel-Interpolation, Entwicklung der hochoptimierten Rust / WebAssembly SIMD128-Engine, skalierbare Web-Worker-Multithreading-Architektur, Ultra-HD Wallpaper Studio mit CDF-Quantil-Matching sowie responsive Web-Benutzungsoberfläche.",

    about_card6_title: "🚀 Moderne Web-Architektur & Rechenleistung",
    about_card6_badge: "> 100 MIt/s · IEEE-754 f64",
    about_card6_li1: "<strong>Paralleles Multi-Threading:</strong> Skalierbarer Web-Worker-Pool, der sich automatisch an die vorhandene CPU-Kernanzahl Deines Geräts anpasst (<code>navigator.hardwareConcurrency</code>).",
    about_card6_li2: "<strong>Hardwarenahe Performance:</strong> Erreicht über <strong>100 Millionen Iterationen pro Sekunde</strong> auf modernen Multi-Core-Prozessoren (z. B. Apple Silicon M4 Pro).",
    about_card6_li3: "<strong>Höchste numerische Präzision (64-Bit Float):</strong> Durchgängige Berechnung in IEEE-754 64-Bit Doppelpräzision (<code>f64</code>) im Rust-Wasm-Kern wie in JavaScript garantiert mathematische Langzeitstabilität und verhindert Attraktor-Kollapse selbst bei Milliarden Iterationen.",
    about_card6_li4: "<strong>Ultra-HD Wallpaper Studio:</strong> Ermöglicht nahtlose Renderings für Single-5K (5120×2880 px), Dual-5K (10240×2880 px) und iPad Pro/Air mit Quantile-Histogramm-Matching und bilinearer Kantenglättung.",

    about_card7_title: "⌨️ Tastatur-Kurzbefehle & Datenschutz",
    about_card7_badge: "100 % Client-Side · Keine Tracker",
    about_card7_sc_space: "Simulation starten / anhalten",
    about_card7_sc_r: "Histogramm zurücksetzen & Neustart",
    about_card7_sc_t: "Symmetrie umschalten (Quad ↔ Hex)",
    about_card7_sc_plus: "Untere Farbschwelle (Low-Cutoff) anpassen",
    about_card7_sc_esc: "Aktives Dialogfenster schließen",
    about_card7_privacy: "🔒 <strong>Datenschutz:</strong> Quilts V2 arbeitet zu 100 % lokal in Deinem Browser. Es werden keinerlei Cookies, Analysewerkzeuge, Werbetracker oder Server-Datenbanken verwendet. Deine Rechenpower gehört Dir!",

    about_card8_title: "⚖️ Lizenz & Open Source",
    about_card8_badge: "MIT License · Version 0.4.0",
    about_card8_text1: "Quilts V2 ist freie Open-Source-Software und steht unter der <strong>MIT-Lizenz</strong>.<br>Copyright © 1996, 2026 Stefan Wolfrum.",
    about_card8_text2: "Quellcode, Dokumentation und Issues findest Du öffentlich auf GitHub:",
    about_btn_github: "🐙 GitHub Repository öffnen",
    about_btn_close: "Fertig / Schließen",

    // --- How to ... (Bedienungsanleitung & Parameter-Erklärungen) ---
    howto_c1_title: "🌟 Grundprinzip & Schnelleinstieg",
    howto_c1_badge: "Chaotische Attraktoren",
    howto_c1_intro: "Quilts berechnet <strong>symmetrische chaotische Attraktoren</strong> auf einem zweidimensionalen Torus (einer periodisch in sich geschlossenen Fläche). Ein mathematischer Punkt springt dabei unaufhörlich von Koordinate zu Koordinate. Ein hochauflösendes 2D-Gitter zählt im Hintergrund mit, wie oft jede Zelle getroffen wird (Ergodizität). Je öfter ein Pixel getroffen wird, desto heller bzw. intensiver wird es eingefärbt.",
    howto_c1_step1: "<strong>1. Preset auswählen:</strong> Wähle in der linken Leiste ein historisches Preset (z. B. <code>ABB2_6</code> oder <code>VOLCANO3</code>), um ein erprobtes Muster zu laden.",
    howto_c1_step2: "<strong>2. Simulation steuern:</strong> Mit der <kbd>Leertaste</kbd> startest und pausierst Du die Berechnung. Mit <kbd>R</kbd> setzt Du das Bild zurück.",
    howto_c1_step3: "<strong>3. Farbwelten entdecken:</strong> Klicke rechts auf eine der 83 Fractint-Paletten, um die Farbgebung in Echtzeit zu verändern.",
    howto_c1_step4: "<strong>4. Symmetrie wechseln:</strong> Wechsle mit <kbd>T</kbd> zwischen quadratischer (Quad, 4-zählig) und dreieckig-hexagonaler (Hex, 6-zählig) Symmetrie.",

    howto_c2_title: "⚙️ Steuerung & Hardware-Rechenkerne",
    howto_c2_badge: "Multi-Core & Vektorisierung",
    howto_c2_btn_run: "<strong>Start / Pause (<kbd>Space</kbd>):</strong> Startet oder stoppt den Rechenprozess. Auch bei Pause bleibt das Bild vollständig erhalten und kann frei eingefärbt oder exportiert werden.",
    howto_c2_btn_reset: "<strong>Reset / Neustart (<kbd>R</kbd>):</strong> Löscht das Treffer-Histogramm und beginnt eine frische Trajektorie mit dem aktuellen Startwert.",
    howto_c2_engine_desc: "<strong>Rechen-Backends (Compute Engines):</strong>",
    howto_c2_eng_workers: "• <strong>Multi-Core Web Worker Pool:</strong> Verteilt die mathematischen Iterationen auf alle CPU-Kerne Deines Geräts. Ideal für maximale Performance (> 100 bis 250+ MIt/s).",
    howto_c2_eng_wasm: "• <strong>Rust / WebAssembly Kernel:</strong> Hochoptimierter Wasm-Kern mit SIMD128-Vektorisierung und minimaler Latenz.",
    howto_c2_eng_fast: "• <strong>JS Branchless Fast-Trig:</strong> Verzweigungsfreie JavaScript-Berechnung mit schneller Chebyshev-Trigonometrie.",
    howto_c2_eng_scalar: "• <strong>Pascal 1996 Skalar:</strong> Die historische 1:1-Referenzberechnung aus Turbo Pascal mit Standard-Trigonometrie.",
    howto_c2_batch_desc: "<strong>Iterationen pro Frame-Batch:</strong> Bestimmt, wie viele Iterationen die Worker zwischen zwei Bildschirmanzeigen berechnen. Höhere Werte steigern den Gesamtdurchsatz, während kleinere Werte eine noch feinfühligere Schieberegler-Reaktion ermöglichen.",

    howto_c3_title: "📐 Symmetriegitter & Historische Presets",
    howto_c3_badge: "Quad (p4m) & Hex (p6m)",
    howto_c3_quad: "<strong>Quadratisches Gitter (Quad, 𝔻₄ / p4m):</strong> Kachelt den Torus auf einem rechtwinkligen Quadrat. Weist eine 4-fache Drehsymmetrie (90°) und 4 Spiegellinien (horizontal, vertikal, Diagonalen) auf.",
    howto_c3_hex: "<strong>Hexagonales Gitter (Hex, 𝔻₆ / p6m):</strong> Basiert auf einem gleichseitigen Dreiecksgitter mit 60°/120°-Winkeln. Weist eine 6-fache Drehsymmetrie und 6 Spiegellinien auf.",
    howto_c3_presets: "<strong>Historische Presets (.QUP):</strong> Enthält alle 21 Originalkonfigurationen aus dem Buch <em>Symmetry in Chaos</em> von Field & Golubitsky.",
    howto_c3_import: "<strong>Import-Funktion:</strong> Erlaubt das Einlesen von originalen <code>.QUP</code>-Dateien von 1996 sowie selbst erstellten Parametern.",

    howto_c4_title: "🎛️ Die mathematischen Parameter im Detail",
    howto_c4_badge: "Formel-Einfluss",
    howto_c4_intro: "Die Formel kombiniert polynomiale Nichtlinearität mit trigonometrischer Fourier-Rückkopplung. Jeder Regler verändert das Verhalten der Chaostrajektorie grundlegend:",
    howto_c4_lambda: "• <strong>λ (Lambda):</strong> Grund-Skalierung und linearer Expansions-/Dämpfungsfaktor. Bestimmt die grundlegende Ausdehnung des Attraktors im Raum. Ein zu hoher Wert lässt den Attraktor explodieren (Divergenz), ein zu kleiner lässt ihn zu einem einzelnen Punkt zusammenfallen.",
    howto_c4_alpha: "• <strong>α (Alpha):</strong> Quadratischer Term proportional zu <code>|z|²</code>. Erzeugt kreisförmige Krümmungen, Verbiegungen und ringförmige Schalen.",
    howto_c4_beta: "• <strong>β (Beta):</strong> Höherer harmonischer Term mit <code>Re(zⁿ)</code>. Koppelt die Trajektorie an die Symmetrieachsen der Grundzelle ($n=4$ bei Quad, $n=6$ bei Hex) und prägt die strahlenförmigen Hauptäste aus.",
    howto_c4_gamma: "• <strong>γ (Gamma):</strong> Konjugierter harmonischer Rückkopplungsterm (<code>z̄ⁿ⁻¹</code>). Erzeugt hochkomplexe, filigrane Schleifen, Falten und fraktale Schlaufen.",
    howto_c4_omega: "• <strong>ω (Omega):</strong> Rotations- und Chiralitäts-Parameter. Ist &omega; = 0, ist das Muster streng achsensymmetrisch (𝔻<sub>n</sub>). Ist &omega; &ne; 0, wird die Spiegelsymmetrie gebrochen (ℤ<sub>n</sub>) und es entstehen spektakuläre Wirbel, Strudel und Spiralen!",
    howto_c4_shift: "• <strong>Shift:</strong> Phasenverschiebung der periodischen Fourier-Harmonischen. Verschiebt die Symmetriezentren innerhalb der Torus-Kachel.",
    howto_c4_ma: "• <strong>ma (nur Quad):</strong> Harmonischer Multiplikator der Fourier-Wellenlänge im Einheitsquadrat.",
    howto_c4_ab: "• <strong>a & b (nur Hex):</strong> Geometrische Gitterfaktoren des hexagonalen Dreiecksgitters (Standard: $a=0.5, b=\\sqrt{3}/2 \\approx 0.866$).",
    howto_c4_reset: "• <strong>↺ Standardwerte:</strong> Setzt alle mathematischen Parameter auf die stabilen, harmonischen Buch-Referenzwerte der gewählten Symmetrie zurück.",

    howto_c5_title: "🎨 Kachelung, Farb-Mapping & Paletten",
    howto_c5_badge: "HDR-Tone-Mapping & Farbspiel",
    howto_c5_period: "<strong>[n]period (Kachel-Wiederholung n × n):</strong> Bestimmt, wie oft die Torus-Grundzelle horizontal und vertikal auf der Zeichenfläche gekachelt wird. Da die Kanten nahtlos ineinander übergehen, entstehen faszinierende Mosaikmuster.",
    howto_c5_tonemap: "<strong>Farb-Mapping Modus (Tone-Mapping):</strong>",
    howto_c5_tm_log: "• <strong>Logarithmisch HDR (Empfohlen):</strong> Verwendet <code>log(1 + Treffer)</code>. Macht sowohl schwach besuchte Außenbereiche als auch extrem dichte Zentren gleichzeitig brillant sichtbar.",
    howto_c5_tm_sqrt: "• <strong>Quadratwurzel (sqrt):</strong> Sanftere Dynamikkompression für besonders kontrastreiche Farbabstufungen.",
    howto_c5_tm_classic: "• <strong>Original 1996:</strong> Bildet Treffer direkt auf die Palette ab (Clamping bei 254) – exakt wie auf VGA-Röhrenmonitoren 1996.",
    howto_c5_gamma: "<strong>Kontrast / Gamma:</strong> Steuert die Helligkeitskurve. Kleinere Werte heben Schatten an, größere Werte machen dunkle Zonen tiefer.",
    howto_c5_lowborder: "<strong>lowBorder (Schwellenwert +/-):</strong> Blendet Pixel aus, die seltener als dieser Schwellenwert getroffen wurden. Ideal, um Rauschen zu entfernen und den Hintergrund tiefschwarz zu halten.",
    howto_c5_blackidx: "<strong>blackIndex:</strong> Legt fest, welche Palettenfarbe als Hintergrundfarbe gerendert wird.",
    howto_c5_cycling: "<strong>Farbrotation (Color Cycling):</strong> Rotiert die 256 Palettenfarben fortlaufend durch. Ein ikonischer Effekt der 90er-Demoszene, der ganz ohne Neuberechnung des Attraktors für fließende Bewegung sorgt.",
    howto_c5_editor: "<strong>16×16 Paletten-Editor:</strong> Erlaubt das freie Bearbeiten einzelner Farbindizes, das weiche Interpolieren von Farbverläufen (<code>[=] Spread</code>) und den Export eigener <code>.MAP</code>-Dateien.",

    howto_c6_title: "🖼️ Wallpaper Studio & Export-Möglichkeiten",
    howto_c6_badge: "Ultra-HD & Retro-Formate",
    howto_c6_png: "<strong>📸 PNG speichern:</strong> Lädt das aktuelle quadratische Bild verlustfrei als PNG-Datei herunter.",
    howto_c6_tga: "<strong>💾 Original .TGA (1996):</strong> Erzeugt eine echte 8-Bit Truevision TGA-Datei mit eingebetteter 256-Farben-Palette – exakt so wie <code>saveTGA</code> in MS-DOS 1996.",
    howto_c6_qup: "<strong>📄 .QUP speichern:</strong> Sichert Deine aktuellen mathematischen Parameter in einer Textdatei, die Du jederzeit wieder importieren kannst.",
    howto_c6_studio: "<strong>🖼 Ultra-HD Wallpaper Studio:</strong> Rendert gigantische Hintergrundbilder für 5K-Displays (5120×2880 px), Dual-5K Setups (10240×2880 px für zwei Monitore) sowie iPad Pro und Kunstdrucke. Dank Quantil-Histogramm-Matching und bilinearer Kantenglättung bleibt der Farbcharakter Deines Live-Bildes perfekt erhalten!",
  },

  en: {
    // --- Header & Topbar ---
    tagline: "Symmetric Chaos on the Torus · ",
    author_prefix: "by ",
    telemetry_iterations: "Iterations",
    telemetry_throughput: "Throughput",
    telemetry_minmax: "Max / Min Hits",
    telemetry_engine: "Active Engine",
    btn_wallpaper: "🖼 Wallpaper",
    btn_wallpaper_title: "Ultra-HD Wallpaper Studio (Mac & iPad)",
    btn_benchmark: "⚡ Benchmark",
    btn_benchmark_title: "Hardware Compute Benchmark Arena",
    btn_palettes: "🎨 Palettes",
    btn_palettes_title: "16×16 Fractint Palette Editor",
    btn_about: "📖 Docs",
    btn_about_title: "Documentation: About the Project & User Guide (How to)",
    btn_docs: "📖 Docs",
    btn_docs_title: "Documentation: About the Project & User Guide (How to)",
    docs_title: "Documentation · Quilts V2",
    tab_about: "About",
    tab_howto: "How to ...",
    theme_light_title: "Light Theme (Default)",
    theme_dark_title: "Dark Theme",
    theme_system_title: "Follow System Theme",
    lang_de_title: "Deutsch",
    lang_en_title: "English",

    // --- Left Sidebar: Engine & Controls ---
    card_engine_title: "Controls & Hardware Engine",
    btn_pause: "⏸ Pause <kbd>Space</kbd>",
    btn_resume: "▶ Resume <kbd>Space</kbd>",
    btn_toggle_run_title: "Spacebar: Start / Stop",
    btn_restart: "🔄 Reset <kbd>R</kbd>",
    btn_restart_title: "Key R: Reset histogram",
    lbl_engine_select: "Compute Engine & Vectorization:",
    opt_engine_workers: "4. Multi-Core Web Worker Pool (Parallel)",
    opt_engine_wasm: "3. Rust / WebAssembly Kernel (Zero-Copy)",
    opt_engine_fast: "2. JS Branchless + Chebyshev Fast-Trig",
    opt_engine_scalar: "1. Pascal 1996 Reference (Scalar 1:1)",
    lbl_batch_size: "Iterations per frame batch",
    engine_badge_workers: "Multi-Worker ({n} Cores)",
    engine_badge_wasm: "Rust Wasm SIMD",
    engine_badge_wasm_fallback: "Chebyshev Fast-Wasm",
    engine_badge_fast: "JS Fast-Trig",
    engine_badge_scalar: "Pascal 1996 Scalar",
    engine_hw_hint: "Hardware detected: {n} parallel worker threads active",
    engine_hw_hint_wasm: " · Rust Wasm loaded",

    // --- Left Sidebar: Presets ---
    card_presets_title: "Historical Presets (.QUP, 1996)",
    btn_import_qup: "Import",
    btn_import_qup_title: "Load .QUP file",
    search_preset_ph: "Search presets…",
    filter_all: "All",
    filter_quad: "Quad (D4)",
    filter_hex: "Hex (D6)",

    // --- Left Sidebar: Math Parameters ---
    card_params_title: "Mathematical Attractor Parameters",
    lbl_grid_type: "Symmetry Grid:",
    btn_type_quad: "4-Fold Quad (D4)",
    btn_type_quad_title: "Square torus tiling with 4-fold D4 symmetry",
    btn_type_hex: "6-Fold Hex (D6)",
    btn_type_hex_title: "Hexagonal torus tiling with 6-fold D6 symmetry",
    btn_reset_params: "↺ Reset to defaults for this symmetry",

    // --- Center Workspace & Canvas ---
    zoom_label: "View:",
    zoom_fit: "Fit to screen",
    zoom_100: "Original (100%)",
    canvas_size_label: "Canvas:",
    btn_export_png: "📸 Save PNG",
    btn_export_tga: "💾 Original .TGA (1996)",
    btn_export_tga_title: "Faithful 8-bit color-mapped Truevision TGA export as in 1996",
    btn_export_qup: "📄 Save .QUP",

    // --- Right Sidebar: Tiling & Coloring ---
    card_tiling_title: "Tiling & Density Coloring",
    lbl_periodic_tiling: "Periodic Tiling (n × n)",
    lbl_tone_mapping: "Tone Mapping & Dynamic Range Compression:",
    opt_tonemap_log: "1. Logarithmic (HDR / log(1 + Hits))",
    opt_tonemap_sqrt: "2. Square Root Compression (sqrt)",
    opt_tonemap_classic: "3. Pascal 1996 Original (Clamping <= 254)",
    lbl_gamma: "Gamma Compression (Contrast)",
    lbl_low_border: "Lower Color Threshold (Low-Cutoff)",
    lbl_black_index: "Color 0 (Background Color)",
    btn_cycle_start: "▶ Start Color Cycling",
    btn_cycle_stop: "⏸ Stop Color Cycling",
    lbl_cycle_speed: "Cycling Speed",

    // --- Right Sidebar: Palettes ---
    card_palettes_title: "83 Fractint Color Palettes (.MAP)",
    search_palette_ph: "Search palettes…",
    btn_open_pal_editor: "🎨 Open Palette Editor…",

    // --- Modal 1: Benchmark Arena ---
    bench_title: "⚡ Quilts Hardware & Technology Benchmark Arena",
    bench_subtitle: "Compares throughput (million iterations per second) for identical attractor parameters.",
    bench_scope_label: "Test scope per engine:",
    bench_opt_5m: "5M iterations (quick test)",
    bench_opt_15m: "15M iterations (standard)",
    bench_opt_40m: "40M iterations (stress test)",
    bench_btn_run: "▶ Run Benchmark Suite Now",
    bench_placeholder: "Click 'Run Benchmark Suite Now' to benchmark all engines live on your system.",
    bench_running_prefix: "Benchmarking engines with",
    bench_running_suffix: "M iterations",
    bench_native_title: "Note on native Apple Silicon engines (macOS / iPadOS / iOS & CLI):",
    bench_native_text: "In the native Swift/Metal project (<code>apple/QuiltsNative</code>) and the Rust CLI benchmark (<code>bench_arena</code>), handwritten ARM64 NEON assembly (<code>asm!</code>) and the Apple Metal GPU Compute Shader achieve peak speeds of <strong>150 to over 500 MIt/s</strong>.",
    btn_close: "Close",

    // --- Modal 2: Palette Editor ---
    pal_title: "🎨 16×16 Fractint Palette Editor (256 Colors)",
    pal_subtitle: "Edit RGB values directly or interpolate color gradients as in the 1996 original.",
    pal_active_label: "Active Index:",
    pal_marked_label: "Marked Index:",
    pal_red: "Red (0–255)",
    pal_green: "Green (0–255)",
    pal_blue: "Blue (0–255)",
    pal_btn_mark: "[Space] Mark / Unmark",
    pal_btn_spread: "[=] Create Gradient (Spread)",
    pal_btn_copy: "[C] Copy Marked Color Here",
    pal_btn_swap: "[X] Swap With Marked Color",
    pal_btn_save: "[S] Export as .MAP File",
    pal_close: "Done",

    // --- Modal 3: Wallpaper Studio ---
    wp_title: "🖼 Ultra-HD Wallpaper Studio (Mac & iPad)",
    wp_subtitle: "Generates distortion-free, seamlessly tiled wallpapers for Mac displays and iPads with high-resolution base tile histogram and subpixel smoothing.",
    wp_preview_live_label: "Live Crop & Aspect Ratio Preview",
    wp_target_label: "Target Display & Output Format",
    wp_grp_mac: "🖥 Mac & Desktop Displays",
    wp_grp_ipad: "📱 Apple iPad",
    wp_grp_art: "🖼 Fine Art Print",
    wp_src_label: "Compute Source & Detail Level",
    wp_opt_live: "1. Use live histogram directly (real-time export, 0 s)",
    wp_opt_hd: "2. Recompute Ultra-HD histogram (maximum sharpness)",
    wp_tileres_label: "Base Tile Resolution (Detail Level)",
    wp_iters_label: "Iteration Depth for Ultra-HD",
    wp_period_label: "Vertical Tile Count (Symmetry Scale)",
    wp_phasex_label: "Horizontal Phase Shift (X Centering)",
    wp_phasey_label: "Vertical Phase Shift (Y Centering)",
    wp_bilinear_label: "Enable bilinear subpixel smoothing (anti-aliasing)",
    wp_cancel: "Cancel",
    wp_render_btn: "🚀 Render & Download Ultra-HD Wallpaper Now",

    // --- Modal 4: About Modal ---
    about_title: "About Quilts V2 · Symmetry in Chaos",
    about_subtitle: "30 Years History (1996–2026) · Dynamical Systems · Fractint Licenses · Co-Authorship with Google Gemini",
    about_card1_title: "🕰️ 30 Years of History: From MS-DOS 1996 to Modern Web 2026",
    about_card1_badge: "1996 → 2026",
    about_card1_text1: "The original <strong>Quilts</strong> was written in <strong>March 1996</strong> by <strong>Stefan Wolfrum</strong> in Borland Turbo Pascal 7.0 for MS-DOS (<code>QUILTS.PAS</code>). In the era of Intel 486 and early Pentium machines, rendering was computed in VGA Mode 13h (320×200 pixels) or VESA Super-VGA (640×480 pixels) with a fixed palette depth of 256 colors driven by 18-bit VGA DAC registers.",
    about_card1_text2: "Exactly 30 years later, the original source code was recovered from an archived 3.5″ floppy disk and reimagined from the ground up as a modern, platform-independent Web and WebAssembly application.",
    about_card1_text3: "<strong>Full Backward Compatibility:</strong> Your original <code>.QUP</code> parameter files from 1996 can be imported 1:1 via the <em>“Import”</em> button (in the Historical Presets section) and exported anytime via the <em>“📄 Save .QUP”</em> button (below the canvas). Likewise, the original uncompressed 8-bit Truevision TGA export (<code>saveTGA</code>) with embedded palette table is natively supported right in the browser.",

    about_card2_title: "📐 Mathematical Background: Symmetry in Chaos",
    about_card2_badge: "Dynamical Systems & Torus 𝕋²",
    about_card2_intro: "Quilts simulates discrete, nonlinear dynamical systems on the two-dimensional torus <code>𝕋² = ℝ² / ℤ²</code>. The mathematical fascination emerges from coupling deterministic chaos with discrete planar crystallographic space groups:",
    about_card2_quad: "<strong>Square Tiling (Quad Type):</strong> Based on the space group <code>p4m</code> (point group symmetry <code>𝔻₄</code>). The square unit tile possesses 4-fold rotational symmetry (90° rotations) and four reflection axes (horizontal, vertical, and both diagonals).",
    about_card2_hex: "<strong>Hexagonal Tiling (Hex Type):</strong> Based on the space group <code>p6m</code> (point group symmetry <code>𝔻₆</code> on a triangular lattice with basis vectors at 60°/120°). It exhibits 6-fold rotational symmetry and six reflection axes.",
    about_card2_ergodic: "<strong>Ergodicity & Density Histogram:</strong> The recurrence relation couples polynomial nonlinearities with periodic Fourier and Chebyshev harmonics. A single initial seed <code>(x₀, y₀)</code> undergoes hundreds of millions of iterations. A high-resolution 2D accumulation histogram counts how frequently the orbit visits each cell of phase space (ergodic occupation measure).",
    about_card2_hdr: "<strong>Logarithmic HDR Tone Mapping:</strong> Because visit counts span dynamic ranges exceeding <code>10⁷ : 1</code>, logarithmic mapping <code>log(1 + Hits)</code> or square-root compression with customizable gamma curve smoothly projects raw counts into the 256 palette colors.",

    about_card3_title: "📚 Scientific Literature & Primary Sources",
    about_card3_badge: "Field & Golubitsky (1990/1992)",
    about_card3_intro: "The mathematical foundations and algorithms trace back to the pioneering research of <strong>Michael Field</strong> and <strong>Martin Golubitsky</strong>:",
    about_card3_book: "<em>Symmetry in Chaos: A Search for Pattern in Mathematics, Art and Nature</em>. Oxford University Press (2nd edition 2009 by SIAM, ISBN 978-0-898716-72-6).",
    about_card3_siam_link: "🔗 Official SIAM E-Books Entry (DOI: 10.1137/1.9780898717709)",
    about_card3_paper: "<em>Symmetric Chaos: A pictorial exploration of an order imposed by symmetry within chaotic systems</em>. In: <em>Computers in Physics</em>, Vol. 4, No. 5 (Sep/Oct 1990), pp. 470–479 (American Institute of Physics).",
    about_card3_paper_link: "🔗 AIP Publishing Journal (DOI: 10.1063/1.4822939)",
    about_card3_sciam: "<em>Symmetric Chaos</em>. In: <em>Scientific American</em>, Vol. 267, No. 6, pp. 86–92. German edition: <em>Symmetrisches Chaos</em>, in: <em>Spektrum der Wissenschaft</em>, February 1993, pp. 56–64.",
    about_card3_stewart: "<em>Fearful Symmetry: Is God a Geometer?</em>. Blackwell Publishers / Penguin Books.",

    about_card4_title: "🎨 The 83 Fractint Palettes (.MAP) & Copyright",
    about_card4_badge: "Stone Soup Group (1988–2000)",
    about_card4_text1: "The <strong>83 color palettes</strong> included in Quilts V2 (file format <code>.MAP</code> with 256 RGB color triplets each) originate from the legendary fractal graphics software <strong>Fractint</strong> by the <em>Stone Soup Group</em> (including Bert Tyler, Timothy Wegner, Mark Peterson, Pieter Branderhorst et al.).",
    about_card4_text2: "Fractint was the worldwide de facto standard for fractal and chaos exploration on PCs during the 1990s. Countless enthusiasts and fractal artists from the global community contributed custom color tables as public-domain freeware.",
    about_card4_text3: "<strong>Copyright and Licensing Notice:</strong> These historic color palettes are provided in Quilts V2 solely for documentation, educational, and nostalgic preservation purposes to faithfully recreate the visual experience of 1996. All copyrights in the individual color gradients remain with their original authors from the Stone Soup Group and community contributors. Should any rights holder object to the inclusion of a specific palette, please reach out via GitHub for immediate removal.",

    about_card5_title: "🤖 AI Assistance & Google Gemini",
    about_card5_badge: "Developed with Google Gemini",
    about_card5_intro: "Quilts V2 was created in October 2026 as a personal project by <strong>Stefan Wolfrum</strong> with assistance from <strong>Google Gemini</strong> (Google DeepMind) in the agentic development environment <strong>Google Antigravity</strong>:",
    about_card5_stefan: "<strong>Stefan Wolfrum</strong> (<a href=\"https://github.com/metawops\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"about-link\">@metawops</a>): Concept, mathematical setup, original 1996 implementation in Borland Turbo Pascal (<code>QUILTS.PAS</code>), UI design, curation of historical presets & palettes, and project development.",
    about_card5_gemini: "<strong>Google Gemini</strong> (Google DeepMind): AI assistance via Google Antigravity. Decoding and analysis of 16-bit real-mode Pascal code, mathematical formalization of hexagonal triangular tiling and bilinear subpixel interpolation, development of the high-performance Rust / WebAssembly SIMD128 engine, scalable Web Worker multi-threading architecture, Ultra-HD Wallpaper Studio with CDF quantile matching, and responsive web user interface.",

    about_card6_title: "🚀 Modern Web Architecture & Performance",
    about_card6_badge: "> 100 MIt/s · IEEE-754 f64",
    about_card6_li1: "<strong>Parallel Multi-Threading:</strong> Scalable Web Worker pool that automatically adapts to the number of CPU cores available on your system (<code>navigator.hardwareConcurrency</code>).",
    about_card6_li2: "<strong>Near-Metal Performance:</strong> Delivers over <strong>100 million iterations per second</strong> on modern multi-core processors (e.g. Apple Silicon M4 Pro).",
    about_card6_li3: "<strong>Highest Numerical Precision (64-Bit Float):</strong> End-to-end IEEE-754 64-bit double precision (<code>f64</code>) across both Rust-Wasm and JavaScript guarantees long-term mathematical stability and prevents attractor collapse over billions of iterations.",
    about_card6_li4: "<strong>Ultra-HD Wallpaper Studio:</strong> Enables seamless exports for Single-5K (5120×2880 px), Dual-5K (10240×2880 px), and iPad Pro/Air with quantile histogram matching and bilinear anti-aliasing.",

    about_card7_title: "⌨️ Keyboard Shortcuts & Privacy",
    about_card7_badge: "100% Client-Side · Zero Trackers",
    about_card7_sc_space: "Start / pause simulation",
    about_card7_sc_r: "Reset histogram & restart",
    about_card7_sc_t: "Toggle symmetry (Quad ↔ Hex)",
    about_card7_sc_plus: "Adjust lower color threshold (Low-Cutoff)",
    about_card7_sc_esc: "Close active modal dialog",
    about_card7_privacy: "🔒 <strong>Privacy:</strong> Quilts V2 operates 100% locally in your browser. No cookies, analytics, trackers, or remote databases are used. Your computing power belongs to you!",

    about_card8_title: "⚖️ License & Open Source",
    about_card8_badge: "MIT License · Version 0.4.0",
    about_card8_text1: "Quilts V2 is free open-source software distributed under the <strong>MIT License</strong>.<br>Copyright © 1996, 2026 Stefan Wolfrum.",
    about_card8_text2: "Source code, documentation, and issues are publicly available on GitHub:",
    about_btn_github: "🐙 Open GitHub Repository",
    about_btn_close: "Done / Close",

    // --- How to ... (User Guide & Parameter Manual) ---
    howto_c1_title: "🌟 Core Concept & Quick Start",
    howto_c1_badge: "Chaotic Attractors",
    howto_c1_intro: "Quilts computes <strong>symmetric chaotic attractors</strong> on a two-dimensional torus (a periodically closed manifold). A mathematical point leaps indefinitely from coordinate to coordinate according to nonlinear recurrence equations. In the background, a high-resolution 2D grid tallies visit counts for each cell (ergodicity). The more frequently a cell is visited, the brighter and more vibrantly it is colored.",
    howto_c1_step1: "<strong>1. Select a Preset:</strong> Choose a historical preset from the left panel (e.g. <code>ABB2_6</code> or <code>VOLCANO3</code>) to load proven attractor parameters.",
    howto_c1_step2: "<strong>2. Control Simulation:</strong> Press <kbd>Space</kbd> to start and pause computation. Press <kbd>R</kbd> to reset the canvas.",
    howto_c1_step3: "<strong>3. Explore Color Palettes:</strong> Click on any of the 83 Fractint palettes in the right panel to transform color gradients in real time.",
    howto_c1_step4: "<strong>4. Switch Symmetry:</strong> Press <kbd>T</kbd> to toggle between square (Quad, 4-fold) and triangular-hexagonal (Hex, 6-fold) symmetry.",

    howto_c2_title: "⚙️ Controls & Compute Engines",
    howto_c2_badge: "Multi-Core & Vectorization",
    howto_c2_btn_run: "<strong>Start / Pause (<kbd>Space</kbd>):</strong> Starts or pauses the simulation. While paused, the rendered attractor remains fully preserved and can be recolored, zoomed, or exported.",
    howto_c2_btn_reset: "<strong>Reset / Restart (<kbd>R</kbd>):</strong> Clears the accumulation histogram and starts a fresh trajectory with the current seed point.",
    howto_c2_engine_desc: "<strong>Compute Engines:</strong>",
    howto_c2_eng_workers: "• <strong>Multi-Core Web Worker Pool:</strong> Distributes mathematical iterations across all available CPU cores on your device. Delivers maximum performance (> 100 to 250+ MIt/s).",
    howto_c2_eng_wasm: "• <strong>Rust / WebAssembly Kernel:</strong> Highly optimized Wasm kernel with SIMD128 vectorization and zero-latency memory sharing.",
    howto_c2_eng_fast: "• <strong>JS Branchless Fast-Trig:</strong> Branch-free JavaScript engine utilizing Chebyshev polynomial trigonometry approximation.",
    howto_c2_eng_scalar: "• <strong>Pascal 1996 Scalar:</strong> The faithful 1:1 Turbo Pascal reference computation from 1996 using standard floating-point functions.",
    howto_c2_batch_desc: "<strong>Iterations per Frame Batch:</strong> Controls how many million iterations workers compute between display refreshes. Higher values maximize overall compute throughput, while lower values offer snappier slider responsiveness.",

    howto_c3_title: "📐 Symmetry Grids & Historical Presets",
    howto_c3_badge: "Quad (p4m) & Hex (p6m)",
    howto_c3_quad: "<strong>Square Grid (Quad, 𝔻₄ / p4m):</strong> Tiles the torus over an orthogonal square unit cell. Features 4-fold rotational symmetry (90°) and 4 reflection axes (horizontal, vertical, diagonals).",
    howto_c3_hex: "<strong>Hexagonal Grid (Hex, 𝔻₆ / p6m):</strong> Based on an equilateral triangular lattice with 60°/120° angles. Features 6-fold rotational symmetry and 6 reflection axes.",
    howto_c3_presets: "<strong>Historical Presets (.QUP):</strong> Contains all 21 original configurations published in Field & Golubitsky's <em>Symmetry in Chaos</em>.",
    howto_c3_import: "<strong>Import Feature:</strong> Allows loading original <code>.QUP</code> files from 1996 as well as custom exported parameter files.",

    howto_c4_title: "🎛️ Mathematical Parameters in Detail",
    howto_c4_badge: "Recurrence Dynamics",
    howto_c4_intro: "The recurrence formula couples polynomial nonlinearity with periodic trigonometric Fourier feedback. Each slider fundamentally shapes the chaotic trajectory:",
    howto_c4_lambda: "• <strong>λ (Lambda):</strong> Base scale and linear expansion/damping factor. Governs the overall spatial extent of the attractor. Too large a value causes the orbit to escape to infinity (divergence); too small collapses it to a single fixed point.",
    howto_c4_alpha: "• <strong>α (Alpha):</strong> Quadratic term proportional to <code>|z|²</code>. Creates circular bending, warping, and concentric shells.",
    howto_c4_beta: "• <strong>β (Beta):</strong> Higher harmonic term involving <code>Re(zⁿ)</code>. Locks the orbit to the unit cell's symmetry axes ($n=4$ for Quad, $n=6$ for Hex) and shapes distinct radial rays.",
    howto_c4_gamma: "• <strong>γ (Gamma):</strong> Conjugate harmonic feedback term (<code>z̄ⁿ⁻¹</code>). Produces intricate, delicate filigree ribbons, cusps, and fractal folds.",
    howto_c4_omega: "• <strong>ω (Omega):</strong> Rotation and chirality parameter. When &omega; = 0, the attractor is strictly mirror-symmetric (𝔻<sub>n</sub>). When &omega; &ne; 0, reflection symmetry is broken (ℤ<sub>n</sub>), generating dramatic swirls, vortices, and spiral pinwheels!",
    howto_c4_shift: "• <strong>Shift:</strong> Phase shift of periodic Fourier harmonics. Offsets the symmetry centers within the torus tile.",
    howto_c4_ma: "• <strong>ma (Quad only):</strong> Harmonic wave multiplier within the square unit tile.",
    howto_c4_ab: "• <strong>a & b (Hex only):</strong> Geometric lattice constants of the triangular grid (defaults: $a=0.5, b=\\sqrt{3}/2 \\approx 0.866$).",
    howto_c4_reset: "• <strong>↺ Default Values:</strong> Restores all mathematical sliders to the proven, harmonious reference values for the selected symmetry.",

    howto_c5_title: "🎨 Tiling, Density Coloring & Palettes",
    howto_c5_badge: "HDR Tone Mapping & Color Dynamics",
    howto_c5_period: "<strong>[n]period (Tile Repetitions n × n):</strong> Determines how many times the torus unit cell repeats across the canvas. Because edges wrap seamlessly, mesmerizing wallpaper patterns emerge.",
    howto_c5_tonemap: "<strong>Color Mapping Mode (Tone Mapping):</strong>",
    howto_c5_tm_log: "• <strong>Logarithmic HDR (Recommended):</strong> Applies <code>log(1 + Hits)</code>. Beautifully reveals both faint ethereal outer clouds and dense focal cores simultaneously.",
    howto_c5_tm_sqrt: "• <strong>Square Root (sqrt):</strong> Gentle dynamic range compression delivering punchy, vibrant mid-tone contrast.",
    howto_c5_tm_classic: "• <strong>Original 1996:</strong> Maps raw hit counts directly into palette indices with clamping at 254 — faithful to 1996 CRT VGA displays.",
    howto_c5_gamma: "<strong>Contrast / Gamma:</strong> Controls the transfer curve. Lower values lift dark regions; higher values produce richer, deeper shadows.",
    howto_c5_lowborder: "<strong>lowBorder (Threshold Cutoff +/-):</strong> Filters out pixels visited fewer times than this threshold. Ideal for silencing noise and keeping backgrounds pitch black.",
    howto_c5_blackidx: "<strong>blackIndex:</strong> Selects which palette index is assigned to unvisited background pixels.",
    howto_c5_cycling: "<strong>Color Cycling:</strong> Continuously rotates palette colors in real time. An iconic 90s demoscene effect that introduces fluid motion without recalculating the attractor.",
    howto_c5_editor: "<strong>16×16 Palette Editor:</strong> Modify RGB color slots individually, smoothly interpolate gradients (<code>[=] Spread</code>), and export custom <code>.MAP</code> files.",

    howto_c6_title: "🖼️ Wallpaper Studio & Export Options",
    howto_c6_badge: "Ultra-HD & Retro Formats",
    howto_c6_png: "<strong>📸 Save PNG:</strong> Downloads the current canvas rendering as a lossless PNG image.",
    howto_c6_tga: "<strong>💾 Original .TGA (1996):</strong> Exports a genuine 8-bit color-mapped Truevision TGA file with embedded 256-color palette — matching <code>saveTGA</code> from DOS 1996.",
    howto_c6_qup: "<strong>📄 Save .QUP:</strong> Saves your active mathematical parameters to a text file that can be loaded back anytime.",
    howto_c6_studio: "<strong>🖼 Ultra-HD Wallpaper Studio:</strong> Computes pristine, distortion-free desktop wallpapers for Single-5K (5120×2880), Dual-5K Split setups (10240×2880 for dual displays), and iPads. Quantile CDF color matching and bilinear anti-aliasing perfectly preserve your live canvas aesthetic!",
  },
};

let currentLang = "de";

export function getLang() {
  const saved = localStorage.getItem("quilts-lang");
  if (saved === "de" || saved === "en") return saved;
  return navigator.language?.toLowerCase().startsWith("de") ? "de" : "en";
}

export function t(key, lang = currentLang) {
  return I18N[lang]?.[key] ?? I18N["de"]?.[key] ?? key;
}

export function setLanguage(lang) {
  if (lang !== "de" && lang !== "en") lang = "de";
  currentLang = lang;
  try {
    localStorage.setItem("quilts-lang", lang);
  } catch (_) {}

  document.documentElement.lang = lang;

  // Text content elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key, lang);
    if (val !== undefined) el.textContent = val;
  });

  // HTML content elements
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    const val = t(key, lang);
    if (val !== undefined) el.innerHTML = val;
  });

  // Titles / tooltips
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const val = t(key, lang);
    if (val !== undefined) el.title = val;
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    const val = t(key, lang);
    if (val !== undefined) el.placeholder = val;
  });

  // Aria labels
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const val = t(key, lang);
    if (val !== undefined) el.setAttribute("aria-label", val);
  });

  // Sync language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Dispatch custom event for dynamic components in app.js
  window.dispatchEvent(new CustomEvent("quilts-language-changed", { detail: { lang } }));
}
