// Superposición y vibración: dos versiones del experimento mental, con
// fórmulas exactas (unidades con ħ = k_B = 1).
//
// A. Una partícula en superposición de dos estados, acoplada a "cuerdas"
//    (modos de vibración) con H = Σ ωₖ aₖ†aₖ + σz · Σ gₖ (aₖ + aₖ†).
//    Cada estado empuja a la cuerda para un lado distinto; mientras las dos
//    versiones de la cuerda difieren, la superposición pierde coherencia:
//      |ρ₀₁(t)| / |ρ₀₁(0)| = Π exp(−4 (gₖ/ωₖ)² (1 − cos ωₖt) · coth(ωₖ / 2T))
//    Con una sola cuerda la coherencia vuelve entera en cada período. Con
//    muchas cuerdas de frecuencias distintas, las vueltas se desfasan y la
//    pérdida se vuelve (casi) permanente: eso es la decoherencia.
//
// B. Dos partículas que comparten una sola cuerda: H = ω a†a + g (σz₁ + σz₂)(a + a†).
//    Al completar un período la cuerda se desengancha y las partículas quedan
//    con una fase que depende de si están alineadas o no: quedan entrelazadas.
//    Partiendo de ambas en superposición, la concurrencia (0 = nada,
//    1 = entrelazamiento máximo) después de n períodos es |sen(8π·n·(g/ω)²)|.
//    Es la idea de las compuertas de iones atrapados (Cirac y Zoller, 1995, y
//    sus sucesoras), que no dependen de la temperatura de la cuerda.
const Cuantica = (() => {
  function coth(x) {
    return 1 / Math.tanh(x);
  }

  // Factor térmico coth(ω / 2T); a temperatura cero vale 1.
  function factorTermico(omega, T) {
    if (T <= 0) return 1;
    return coth(omega / (2 * T));
  }

  // Exponente de pérdida de un modo: 4 (g/ω)² (1 − cos ωt) coth(ω/2T).
  function exponenteModo(t, { omega, g, T }) {
    const l = g / omega;
    return 4 * l * l * (1 - Math.cos(omega * t)) * factorTermico(omega, T);
  }

  // n cuerdas con frecuencias repartidas alrededor de ω₀ y acoplamiento total g
  // (cada una g/√n, para que la "fuerza" total no dependa de n).
  function modos({ n = 1, omega0 = 1, dispersion = 0.5, g = 0.3 }) {
    if (n === 1) return [{ omega: omega0, g }];
    const out = [];
    for (let k = 0; k < n; k++) {
      out.push({ omega: omega0 * (1 + dispersion * (k / (n - 1) - 0.5)), g: g / Math.sqrt(n) });
    }
    return out;
  }

  function coherencia(t, p) {
    const T = p.T ?? 1;
    let e = 0;
    for (const m of modos(p)) e += exponenteModo(t, { ...m, T });
    return Math.exp(-e);
  }

  // Nivel al que tiende la coherencia cuando las vueltas se desfasan (promedio de cos = 0).
  function meseta(p) {
    const T = p.T ?? 1;
    let e = 0;
    for (const m of modos(p)) { const l = m.g / m.omega; e += 4 * l * l * factorTermico(m.omega, T); }
    return Math.exp(-e);
  }

  function curvaCoherencia(p, tMax = 60, puntos = 600) {
    const out = [];
    for (let i = 0; i <= puntos; i++) {
      const t = (tMax * i) / puntos;
      out.push([t, coherencia(t, p)]);
    }
    return out;
  }

  // Versión B
  function concurrencia(gSobreOmega, periodos = 1) {
    return Math.abs(Math.sin(8 * Math.PI * periodos * gSobreOmega * gSobreOmega));
  }

  // Menor g/ω que da entrelazamiento máximo en n períodos: 8π n x² = π/2.
  function gOptimo(periodos = 1) {
    return 1 / (4 * Math.sqrt(periodos));
  }

  // Coherencia entre ramas con distinto espín total (alineadas vs. opuestas)
  // durante la compuerta: mide cuánto están enredadas las partículas con la cuerda.
  function coherenciaDuranteCompuerta(t, { gSobreOmega, T, omega = 1 }) {
    return Math.exp(-exponenteModo(t, { omega, g: gSobreOmega * omega, T }));
  }

  return { coth, factorTermico, exponenteModo, modos, coherencia, meseta, curvaCoherencia, concurrencia, gOptimo, coherenciaDuranteCompuerta };
})();

if (typeof module !== "undefined") module.exports = Cuantica;
