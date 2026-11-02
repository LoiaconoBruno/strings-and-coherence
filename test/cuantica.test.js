const test = require("node:test");
const assert = require("node:assert/strict");
const Q = require("../src/cuantica.js");

const cerca = (a, b, eps, msg) => assert.ok(Math.abs(a - b) < eps, msg || `${a} ≈ ${b}`);

test("con una sola cuerda, la coherencia vuelve entera en cada período", () => {
  const p = { n: 1, g: 0.3, T: 2 };
  for (const k of [1, 2, 5]) cerca(Q.coherencia(2 * Math.PI * k, p), 1, 1e-12);
});

test("con una sola cuerda, el mínimo es exp(−8 (g/ω)² coth(ω/2T)) a mitad de período", () => {
  const p = { n: 1, g: 0.3, T: 1 };
  const esperado = Math.exp(-8 * 0.09 * Q.coth(0.5));
  cerca(Q.coherencia(Math.PI, p), esperado, 1e-12);
});

test("a temperatura cero solo quedan las fluctuaciones cuánticas (coth → 1)", () => {
  assert.equal(Q.factorTermico(1, 0), 1);
  cerca(Q.coherencia(Math.PI, { n: 1, g: 0.3, T: 0 }), Math.exp(-8 * 0.09), 1e-12);
});

test("más temperatura, más pérdida", () => {
  const frio = Q.coherencia(Math.PI, { n: 1, g: 0.3, T: 0.5 });
  const caliente = Q.coherencia(Math.PI, { n: 1, g: 0.3, T: 5 });
  assert.ok(caliente < frio);
});

test("con muchas cuerdas la coherencia ya no vuelve: se queda en la meseta", () => {
  const p = { n: 60, g: 0.3, T: 1, dispersion: 0.6 };
  const tramo = [];
  for (let t = 40; t <= 60; t += 0.05) tramo.push(Q.coherencia(t, p));
  const prom = tramo.reduce((a, b) => a + b, 0) / tramo.length;
  cerca(prom, Q.meseta(p), 0.08, `promedio ${prom} vs meseta ${Q.meseta(p)}`);
  assert.ok(Math.max(...tramo) < 0.8, "no hay vueltas completas");
});

test("las cuerdas reparten el acoplamiento: la suma de g² se conserva", () => {
  const ms = Q.modos({ n: 25, g: 0.3 });
  cerca(ms.reduce((s, m) => s + m.g * m.g, 0), 0.09, 1e-12);
});

test("compuerta: con g/ω = 1/4 y un período, entrelazamiento máximo", () => {
  cerca(Q.concurrencia(0.25, 1), 1, 1e-12);
  cerca(Q.gOptimo(1), 0.25, 1e-12);
  cerca(Q.concurrencia(Q.gOptimo(3), 3), 1, 1e-12);
  assert.equal(Q.concurrencia(0, 1), 0);
});

test("al terminar cada período las partículas se desenganchan de la cuerda, a cualquier temperatura", () => {
  for (const T of [0, 1, 10]) cerca(Q.coherenciaDuranteCompuerta(2 * Math.PI, { gSobreOmega: 0.25, T }), 1, 1e-12);
  assert.ok(Q.coherenciaDuranteCompuerta(Math.PI, { gSobreOmega: 0.25, T: 10 }) < 0.01);
});
