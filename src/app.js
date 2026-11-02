// Interfaz: versión A (decoherencia) y versión B (compuerta por vibración compartida).
(() => {
  const $ = (id) => document.getElementById(id);
  const num = (x, d = 2) => Number(x.toFixed(d)).toLocaleString("es-AR");
  const pct = (x) => Math.round(x * 100) + " %";
  const val = (id) => parseFloat($(id).value);
  const T_MAX = 60;

  function versionA() {
    const p = { n: val("n"), g: val("g"), T: val("T"), dispersion: val("disp"), omega0: 1 };
    $("v-n").textContent = p.n;
    $("v-g").textContent = num(p.g);
    $("v-T").textContent = num(p.T, 1);
    $("v-disp").textContent = num(p.dispersion);
    const curva = Cuantica.curvaCoherencia(p, T_MAX, 900);
    const min = Math.min(...curva.map((c) => c[1]));
    const finales = curva.filter(([t]) => t > T_MAX * 0.6).map((c) => c[1]);
    const vuelve = Math.max(...finales) > 0.98;
    $("s-min").textContent = pct(min);
    $("s-vuelve").textContent = vuelve ? "Sí" : "No";
    $("s-meseta").textContent = p.n === 1 ? "Oscila" : pct(Cuantica.meseta(p));
    const series = [{ nombre: "Coherencia", puntos: curva }];
    Grafico.lineas($("g-coh"), {
      series, xMin: 0, xMax: T_MAX, yMin: 0, yMax: 1.05,
      xEtiqueta: "tiempo (en unidades de 1/ω)", yEtiqueta: "coherencia",
      horizontales: p.n > 1 ? [{ y: Cuantica.meseta(p), etiqueta: "meseta" }] : [],
      alto: 260,
    });
    $("txt-a").textContent = p.n === 1
      ? "Con una sola cuerda la superposición se pierde y vuelve: en cada período la cuerda regresa al mismo estado para las dos versiones de la partícula y deja de \"saber\" en cuál está."
      : `Con ${p.n} cuerdas de frecuencias distintas, las vueltas se desfasan y la coherencia se queda baja: la información sobre el estado se reparte en el entorno y no regresa (al menos por mucho tiempo).`;
  }

  function versionB() {
    const g = val("gb"), n = val("per"), T = val("Tb");
    $("v-gb").textContent = num(g, 3);
    $("v-per").textContent = n;
    $("v-Tb").textContent = num(T, 1);
    $("s-conc").textContent = pct(Cuantica.concurrencia(g, n));
    $("s-gopt").textContent = num(Cuantica.gOptimo(n), 3);
    const gs = [];
    for (let i = 0; i <= 200; i++) gs.push((0.5 * i) / 200);
    Grafico.lineas($("g-conc"), {
      series: [{ nombre: "Entrelazamiento final", puntos: gs.map((x) => [x, Cuantica.concurrencia(x, n)]) }],
      xMin: 0, xMax: 0.5, yMin: 0, yMax: 1.05,
      xEtiqueta: "acoplamiento g/ω", yEtiqueta: "concurrencia",
      verticales: [{ x: g, etiqueta: "ahora" }],
      alto: 240,
    });
    const tFin = 2 * Math.PI * n;
    const pts = [];
    for (let i = 0; i <= 400; i++) {
      const t = (tFin * i) / 400;
      pts.push([t, Cuantica.coherenciaDuranteCompuerta(t, { gSobreOmega: g, T })]);
    }
    Grafico.lineas($("g-durante"), {
      series: [{ nombre: "Desenganche de la cuerda", puntos: pts, color: Grafico.colores().series[1] }],
      xMin: 0, xMax: tFin, yMin: 0, yMax: 1.05,
      xEtiqueta: "tiempo (1/ω)", yEtiqueta: "1 = desenganchadas",
      alto: 240,
    });
  }

  for (const id of ["n", "g", "T", "disp"]) $(id).addEventListener("input", versionA);
  for (const id of ["gb", "per", "Tb"]) $(id).addEventListener("input", versionB);
  window.addEventListener("resize", () => { versionA(); versionB(); });
  versionA();
  versionB();
})();
