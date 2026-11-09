#!/usr/bin/env node
// Genera las figuras del paper (SVG) en esta carpeta y escribe las cifras que cita el texto.
// Uso: node paper/figuras/generar.js
// Contiene solo las funciones del modelo que hacen falta. Licencia MIT (ver LICENSE).
// Unidades: ħ = k_B = 1 y frecuencia de referencia ω₀ = 1, así que el tiempo va en 1/ω₀,
// la temperatura en ħω₀/k_B y el acoplamiento como g/ω (adimensional).
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const COLORES = ["#2a55c9", "#c25a00", "#1f7a4d", "#b3261e", "#7a3fb8", "#555555"];
const FUENTE = 'font-family="DejaVu Sans, Helvetica, Arial, sans-serif"';

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Números con coma decimal y signo menos tipográfico.
function num(x) {
  if (x === 0) return "0";
  const a = Math.abs(x);
  let s;
  if (a >= 1e4 || a < 1e-3) {
    const e = Math.floor(Math.log10(a));
    const m = x / 10 ** e;
    s = (Math.abs(m - 1) < 1e-9 ? "" : `${Number(m.toPrecision(2))}×`) + `10^${e}`;
  } else s = String(Number(x.toPrecision(3)));
  return s.replace(".", ",").replace(/-/g, "−");
}

function marcas(min, max, n = 5) {
  const crudo = (max - min) / n;
  const pot = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= crudo);
  const out = [];
  for (let x = Math.ceil(min / paso - 1e-9) * paso; x <= max + paso * 1e-9; x += paso) out.push(Math.abs(x) < paso * 1e-9 ? 0 : x);
  return out;
}

function potencias(min, max) {
  const out = [];
  for (let k = Math.floor(Math.log10(min)); k <= Math.ceil(Math.log10(max)); k++) out.push(10 ** k);
  return out;
}

// Texto con superíndices para etiquetas del tipo 10^3.
function textoSVG(s) {
  return esc(s).replace(/\^(−?[0-9A-Za-z]+)/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
}

/**
 * Gráfico de líneas.
 * op: { series: [{nombre, puntos: [[x,y]], color?, punteada?, grosor?}], xMin, xMax, yMin, yMax,
 *       xEtiqueta, yEtiqueta, logX, logY, verticales: [{x, etiqueta}], horizontales: [{y, etiqueta}],
 *       ancho, alto, leyenda: "arriba" | "abajo" | null }
 */
function grafico(op) {
  const W = op.ancho || 640, H = op.alto || 400;
  const m = { l: 70, r: 18, t: op.leyenda === null ? 16 : 40, b: 56 };
  const tx = (x) => (op.logX ? Math.log10(x) : x);
  const ty = (y) => (op.logY ? Math.log10(y) : y);
  const pts = op.series.flatMap((s) => s.puntos).filter(([x, y]) => isFinite(tx(x)) && isFinite(ty(y)));
  const xMin = op.xMin ?? Math.min(...pts.map((p) => p[0]));
  const xMax = op.xMax ?? Math.max(...pts.map((p) => p[0]));
  const yMin = op.yMin ?? Math.min(...pts.map((p) => p[1]));
  const yMax = op.yMax ?? Math.max(...pts.map((p) => p[1]));
  const X = (x) => m.l + ((tx(x) - tx(xMin)) / (tx(xMax) - tx(xMin))) * (W - m.l - m.r);
  const Y = (y) => H - m.b - ((ty(y) - ty(yMin)) / (ty(yMax) - ty(yMin))) * (H - m.t - m.b);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  const mx = op.logX ? potencias(xMin, xMax) : marcas(xMin, xMax, op.marcasX || 6);
  const my = op.logY ? potencias(yMin, yMax) : marcas(yMin, yMax, op.marcasY || 5);
  for (const x of mx) {
    if (x < xMin - 1e-12 || x > xMax + 1e-12) continue;
    o.push(`<line x1="${X(x)}" y1="${m.t}" x2="${X(x)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(x)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${textoSVG(num(x))}</text>`);
  }
  for (const y of my) {
    if (y < yMin - 1e-12 || y > yMax + 1e-12) continue;
    o.push(`<line x1="${m.l}" y1="${Y(y)}" x2="${W - m.r}" y2="${Y(y)}" stroke="#e3e1db"/>`);
    o.push(`<text x="${m.l - 8}" y="${Y(y) + 4}" text-anchor="end" fill="#333">${textoSVG(num(y))}</text>`);
  }
  o.push(`<rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="none" stroke="#333"/>`);
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 14}" text-anchor="middle" fill="#111">${textoSVG(op.xEtiqueta)}</text>`);
  if (op.yEtiqueta) o.push(`<text transform="translate(18 ${m.t + (H - m.t - m.b) / 2}) rotate(-90)" text-anchor="middle" fill="#111">${textoSVG(op.yEtiqueta)}</text>`);
  o.push(`<clipPath id="area"><rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}"/></clipPath><g clip-path="url(#area)">`);
  (op.verticales || []).forEach((v, j) => {
    o.push(`<line x1="${X(v.x)}" y1="${m.t}" x2="${X(v.x)}" y2="${H - m.b}" stroke="#666" stroke-dasharray="4 4"/>`);
    // etiquetas escalonadas para que no se pisen si las líneas están cerca
    if (v.etiqueta) o.push(`<text x="${X(v.x) + 5}" y="${m.t + 16 + 15 * j}" fill="#444" font-size="12">${textoSVG(v.etiqueta)}</text>`);
  });
  for (const h of op.horizontales || []) {
    o.push(`<line x1="${m.l}" y1="${Y(h.y)}" x2="${W - m.r}" y2="${Y(h.y)}" stroke="#666" stroke-dasharray="4 4"/>`);
    if (h.etiqueta) o.push(`<text x="${W - m.r - 6}" y="${Y(h.y) - 6}" text-anchor="end" fill="#444" font-size="12">${textoSVG(h.etiqueta)}</text>`);
  }
  op.series.forEach((s, i) => {
    const d = [];
    let abierto = false;
    for (const [x, y] of s.puntos) {
      if (!isFinite(tx(x)) || !isFinite(ty(y))) { abierto = false; continue; }
      d.push(`${abierto ? "L" : "M"}${X(x).toFixed(2)} ${Y(y).toFixed(2)}`);
      abierto = true;
    }
    const color = s.color || COLORES[i % COLORES.length];
    o.push(`<path d="${d.join(" ")}" fill="none" stroke="${color}" stroke-width="${s.grosor || 2.2}"${s.punteada ? ' stroke-dasharray="7 5"' : ""} stroke-linejoin="round"/>`);
  });
  o.push("</g>");
  if (op.leyenda !== null) {
    let lx = m.l;
    op.series.forEach((s, i) => {
      if (!s.nombre) return;
      const color = s.color || COLORES[i % COLORES.length];
      o.push(`<line x1="${lx}" y1="${m.t - 16}" x2="${lx + 22}" y2="${m.t - 16}" stroke="${color}" stroke-width="3"${s.punteada ? ' stroke-dasharray="6 4"' : ""}/>`);
      o.push(`<text x="${lx + 28}" y="${m.t - 12}" fill="#111">${textoSVG(s.nombre)}</text>`);
      lx += 40 + s.nombre.length * 7.2;
    });
  }
  o.push("</svg>");
  return o.join("\n");
}

function guardar(nombre, svg) {
  fs.writeFileSync(path.join(__dirname, nombre + ".svg"), svg + "\n");
  console.log("figura:", nombre + ".svg");
}

/**
 * Barras apiladas horizontales. grupos: [{nombre, partes: [valor...]}], categorias: [nombre...]
 */
function barras(op) {
  const W = op.ancho || 640, alto = op.alturaBarra || 34, sep = op.separacion || 22;
  const m = { l: op.margenIzq || 210, r: 30, t: 54, b: 46 };
  const H = m.t + op.grupos.length * (alto + sep) - sep + m.b;
  const total = op.maximo || Math.max(...op.grupos.map((g) => g.partes.reduce((a, b) => a + b, 0)));
  const X = (v) => m.l + (v / total) * (W - m.l - m.r);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  let lx = m.l;
  op.categorias.forEach((c, i) => {
    o.push(`<rect x="${lx}" y="${m.t - 36}" width="14" height="14" fill="${(op.colores || COLORES)[i]}"/>`);
    o.push(`<text x="${lx + 20}" y="${m.t - 24}" fill="#111">${esc(c)}</text>`);
    lx += 34 + c.length * 7.2;
  });
  for (const v of marcas(0, total, op.marcas || 5)) {
    o.push(`<line x1="${X(v)}" y1="${m.t - 6}" x2="${X(v)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(v)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${num(v)}</text>`);
  }
  op.grupos.forEach((g, k) => {
    const y = m.t + k * (alto + sep);
    o.push(`<text x="${m.l - 10}" y="${y + alto / 2 + 5}" text-anchor="end" fill="#111">${esc(g.nombre)}</text>`);
    let acum = 0;
    g.partes.forEach((v, i) => {
      if (!v) return;
      o.push(`<rect x="${X(acum)}" y="${y}" width="${X(acum + v) - X(acum)}" height="${alto}" fill="${(op.colores || COLORES)[i]}"/>`);
      o.push(`<text x="${(X(acum) + X(acum + v)) / 2}" y="${y + alto / 2 + 5}" text-anchor="middle" fill="#fff" font-weight="bold">${num(v)}</text>`);
      acum += v;
    });
  });
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 10}" text-anchor="middle" fill="#111">${esc(op.xEtiqueta)}</text>`);
  o.push("</svg>");
  return o.join("\n");
}

/** Diagrama de pasos en fila: cajas con número y texto, unidas por flechas. */
function pasos(lista, op = {}) {
  const W = op.ancho || 640, porFila = op.porFila || 3, cw = (W - 40 - (porFila - 1) * 30) / porFila, ch = op.altoCaja || 92;
  const filas = Math.ceil(lista.length / porFila);
  const H = 20 + filas * ch + (filas - 1) * 40 + 20;
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<defs><marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#555"/></marker></defs>`];
  const pos = lista.map((_, i) => {
    const f = Math.floor(i / porFila), c = f % 2 === 0 ? i % porFila : porFila - 1 - (i % porFila);
    return { x: 20 + c * (cw + 30), y: 20 + f * (ch + 40) };
  });
  lista.forEach((p, i) => {
    const { x, y } = pos[i];
    o.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="10" fill="#f3f5fc" stroke="${COLORES[0]}" stroke-width="1.5"/>`);
    o.push(`<text x="${x + 12}" y="${y + 24}" fill="${COLORES[0]}" font-weight="bold" font-size="14">${esc(p.titulo)}</text>`);
    (p.lineas || []).forEach((l, j) => o.push(`<text x="${x + 12}" y="${y + 46 + j * 17}" fill="#222">${esc(l)}</text>`));
    if (i + 1 < lista.length) {
      const a = pos[i], b = pos[i + 1];
      if (a.y === b.y) {
        const izq = b.x > a.x;
        o.push(`<line x1="${izq ? a.x + cw : a.x}" y1="${a.y + ch / 2}" x2="${izq ? b.x - 2 : b.x + cw + 2}" y2="${b.y + ch / 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      } else {
        o.push(`<line x1="${a.x + cw / 2}" y1="${a.y + ch}" x2="${b.x + cw / 2}" y2="${b.y - 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      }
    }
  });
  o.push("</svg>");
  return o.join("\n");
}

// ---------------------------------------------------------------------------
// Modelo A: desfasaje puro de un qubit acoplado a osciladores
// ---------------------------------------------------------------------------
const coth = (x) => 1 / Math.tanh(x);
const factorTermico = (omega, T) => (T <= 0 ? 1 : coth(omega / (2 * T)));
// Exponente de un modo: 4 (g/ω)² (1 − cos ωt) coth(ω/2T)
const exponenteModo = (t, { omega, g, T }) => 4 * (g / omega) ** 2 * (1 - Math.cos(omega * t)) * factorTermico(omega, T);
// Con eco (pulso π en t/2): 32 (g/ω)² sen⁴(ωt/4) coth(ω/2T)
const exponenteEco = (t, { omega, g, T }) => 32 * (g / omega) ** 2 * Math.sin((omega * t) / 4) ** 4 * factorTermico(omega, T);

function modos({ n = 1, omega0 = 1, dispersion = 0.5, g = 0.3 }) {
  if (n === 1) return [{ omega: omega0, g }];
  return Array.from({ length: n }, (_, k) => ({ omega: omega0 * (1 + dispersion * (k / (n - 1) - 0.5)), g: g / Math.sqrt(n) }));
}
const coherencia = (t, p) => Math.exp(-modos(p).reduce((e, m) => e + exponenteModo(t, { ...m, T: p.T }), 0));
const meseta = (p) => Math.exp(-modos(p).reduce((e, m) => e + 4 * (m.g / m.omega) ** 2 * factorTermico(m.omega, p.T), 0));
const curva = (p, tMax = 60, n = 1200) => Array.from({ length: n + 1 }, (_, i) => { const t = (tMax * i) / n; return [t, coherencia(t, p)]; });
const minimo = (p, tMax = 60) => Math.min(...curva(p, tMax, 6000).map(([, c]) => c));

// Modelo B: dos qubits y una cuerda compartida
const concurrencia = (x, n = 1) => Math.abs(Math.sin(8 * Math.PI * n * x * x));
const gOptimo = (n = 1) => 1 / (4 * Math.sqrt(n));
// Coherencia entre ramas de distinto espín total durante la compuerta (fuerza 2g)
const coherenciaCompuerta = (t, { x, T }) => Math.exp(-exponenteModo(t, { omega: 1, g: 2 * x, T }));

const pct = (x) => `${(100 * x).toFixed(1)} %`;
const f4 = (x) => Number(x.toPrecision(4));

// ---------------------------------------------------------------------------
// Cifras del texto
// ---------------------------------------------------------------------------
const UNA = { n: 1, g: 0.3, T: 1 };
const CINCUENTA = { n: 50, g: 0.3, T: 1, dispersion: 0.6 };
console.log(`coth(0,5) = ${f4(coth(0.5))}; exponente mínimo una cuerda = ${f4(8 * 0.09 * coth(0.5))}; coherencia mínima = ${pct(minimo(UNA))}; en t = 2π: ${pct(coherencia(2 * Math.PI, UNA))}`);
console.log(`50 cuerdas, dispersión 0,6, T = 1: mínimo ${pct(minimo(CINCUENTA))}, en t = 60: ${pct(coherencia(60, CINCUENTA))}, meseta ${pct(meseta(CINCUENTA))}; g por cuerda ${f4(0.3 / Math.sqrt(50))}`);
console.log(`50 cuerdas, T = 5: mínimo ${pct(minimo({ ...CINCUENTA, T: 5 }))}, meseta ${pct(meseta({ ...CINCUENTA, T: 5 }))}; coth(0,1) = ${f4(coth(0.1))}`);
const dw = 0.6 / 49;
console.log(`Separación de frecuencias Δω = ${f4(dw)}; recurrencia 2π/Δω = ${f4(2 * Math.PI / dw)}; coherencia en ese tiempo = ${pct(coherencia(2 * Math.PI / dw, CINCUENTA))}`);
console.log(`50 cuerdas sin dispersión: en t = 2π: ${pct(coherencia(2 * Math.PI, { ...CINCUENTA, dispersion: 0 }))}`);
console.log(`T = 0, una cuerda: g/ω = 0,1 → mínimo ${pct(minimo({ n: 1, g: 0.1, T: 0 }))}; g/ω = 0,6 → ${pct(minimo({ n: 1, g: 0.6, T: 0 }))}`);
console.log(`Versión B: C(0,25; 1) = ${pct(concurrencia(0.25, 1))}; C(0,25; 2) = ${pct(concurrencia(0.25, 2))}; óptimo para 2 períodos = ${f4(gOptimo(2))}`);
for (const T of [0, 1, 5]) {
  const mid = coherenciaCompuerta(Math.PI, { x: 0.25, T }), fin = coherenciaCompuerta(2 * Math.PI, { x: 0.25, T });
  console.log(`Compuerta, T = ${T}: coherencia con la cuerda a mitad ${pct(mid)}, al final ${pct(fin)}`);
}
for (const wt of [0.6, 2 * Math.PI, 4 * Math.PI]) {
  const p = { omega: 1, g: 0.3, T: 1 };
  console.log(`Eco, ωt = ${f4(wt)}: sin eco ${pct(Math.exp(-exponenteModo(wt, p)))}, con eco ${pct(Math.exp(-exponenteEco(wt, p)))}`);
}
// Conversión de unidades: T = 1 ↔ ħω/k_B
{
  const hbar = 1.054571817e-34, kB = 1.380649e-23;
  for (const [nombre, f] of [["1 MHz", 1e6], ["1 THz", 1e12]]) console.log(`T = 1 para ω/2π = ${nombre}: ${f4((hbar * 2 * Math.PI * f) / kB)} K`);
}

// ---------------------------------------------------------------------------
// Baño óhmico continuo: Γ(t) = ∫ J(ω)/ω² (1 − cos ωt) coth(ω/2T) dω, J = η ω e^(−ω/ωc)
// En el límite T ≫ ωc y t ≫ 1/ωc, Γ ≈ π η T t  →  T₂ = 1/(π η T)
// ---------------------------------------------------------------------------
const ETA = 0.02, WC = 5, TB = 20;
function gammaBano(t, { eta = ETA, wc = WC, T = TB, n = 40000, wMax = 60 } = {}) {
  let s = 0; const dw = wMax / n;
  for (let i = 0; i < n; i++) {
    const w = (i + 0.5) * dw;
    s += (eta * w * Math.exp(-w / wc) / (w * w)) * (1 - Math.cos(w * t)) * coth(w / (2 * T)) * dw;
  }
  return s;
}
{
  const t = 10, g = gammaBano(t), lin = Math.PI * ETA * TB * t;
  console.log(`Baño óhmico (η = ${ETA}, ωc = ${WC}, T = ${TB}): Γ(10) = ${f4(g)}, aproximación lineal π η T t = ${f4(lin)}; T₂ = 1/(πηT) = ${f4(1 / (Math.PI * ETA * TB))}`);
}

// ---------------------------------------------------------------------------
// Figuras
// ---------------------------------------------------------------------------
guardar("una-cuerda", grafico({
  series: [
    { nombre: "T = 0", puntos: curva({ n: 1, g: 0.3, T: 0 }, 25), color: COLORES[0] },
    { nombre: "T = 1", puntos: curva({ n: 1, g: 0.3, T: 1 }, 25), color: COLORES[1] },
    { nombre: "T = 5", puntos: curva({ n: 1, g: 0.3, T: 5 }, 25), color: COLORES[3] },
  ],
  xMin: 0, xMax: 25, yMin: 0, yMax: 1.05,
  verticales: [{ x: 2 * Math.PI, etiqueta: "2π" }, { x: 4 * Math.PI, etiqueta: "4π" }],
  xEtiqueta: "Tiempo ω₀t", yEtiqueta: "Coherencia |ρ₀₁(t)| / |ρ₀₁(0)|",
}));
guardar("muchas-cuerdas", grafico({
  series: [
    { nombre: "1 cuerda", puntos: curva(UNA), color: COLORES[0] },
    { nombre: "50 cuerdas, dispersión 0,6", puntos: curva(CINCUENTA), color: COLORES[1] },
  ],
  xMin: 0, xMax: 60, yMin: 0, yMax: 1.05,
  horizontales: [{ y: meseta(CINCUENTA), etiqueta: "meseta" }],
  xEtiqueta: "Tiempo ω₀t", yEtiqueta: "Coherencia |ρ₀₁(t)| / |ρ₀₁(0)|",
}));
{
  const Ts = Array.from({ length: 101 }, (_, i) => i * 0.1);
  guardar("temperatura", grafico({
    series: [
      { nombre: "Mínimo con 1 cuerda", puntos: Ts.map((T) => [T, Math.exp(-8 * 0.09 * factorTermico(1, T))]), color: COLORES[0] },
      { nombre: "Meseta con 50 cuerdas", puntos: Ts.map((T) => [T, meseta({ ...CINCUENTA, T })]), color: COLORES[1] },
    ],
    xMin: 0, xMax: 10, yMin: 0, yMax: 1,
    xEtiqueta: "Temperatura k_BT / ħω₀", yEtiqueta: "Coherencia",
  }));
}
{
  const xs = Array.from({ length: 301 }, (_, i) => i * 0.4 / 300);
  guardar("compuerta", grafico({
    series: [
      { nombre: "1 período", puntos: xs.map((x) => [x, concurrencia(x, 1)]), color: COLORES[0] },
      { nombre: "2 períodos", puntos: xs.map((x) => [x, concurrencia(x, 2)]), color: COLORES[1] },
    ],
    xMin: 0, xMax: 0.4, yMin: 0, yMax: 1.05,
    verticales: [{ x: gOptimo(2), etiqueta: "1/(4√2)" }, { x: 0.25, etiqueta: "1/4" }],
    xEtiqueta: "Acoplamiento g/ω", yEtiqueta: "Concurrencia al terminar",
  }));
  const ts = Array.from({ length: 301 }, (_, i) => (2 * Math.PI * i) / 300);
  guardar("durante-compuerta", grafico({
    series: [0, 1, 5].map((T, k) => ({ nombre: `T = ${T}`, puntos: ts.map((t) => [t, coherenciaCompuerta(t, { x: 0.25, T })]), color: [COLORES[0], COLORES[1], COLORES[3]][k] })),
    xMin: 0, xMax: 2 * Math.PI, yMin: 0, yMax: 1.05,
    xEtiqueta: "Tiempo ωt durante la compuerta", yEtiqueta: "Coherencia con la cuerda",
  }));
}
{
  const ts = Array.from({ length: 601 }, (_, i) => (4 * Math.PI * i) / 600), p = { omega: 1, g: 0.3, T: 1 };
  guardar("eco", grafico({
    series: [
      { nombre: "Sin eco", puntos: ts.map((t) => [t, Math.exp(-exponenteModo(t, p))]), color: COLORES[0] },
      { nombre: "Con un pulso π en t/2", puntos: ts.map((t) => [t, Math.exp(-exponenteEco(t, p))]), color: COLORES[1], punteada: true },
    ],
    xMin: 0, xMax: 4 * Math.PI, yMin: 0, yMax: 1.05,
    verticales: [{ x: 2 * Math.PI, etiqueta: "2π" }],
    xEtiqueta: "Tiempo total ωt", yEtiqueta: "Coherencia al final",
  }));
}
{
  const ts = Array.from({ length: 121 }, (_, i) => i * 0.1);
  guardar("bano", grafico({
    series: [
      { nombre: "Γ(t) numérico", puntos: ts.map((t) => [t, gammaBano(t, { n: 8000 })]), color: COLORES[1] },
      { nombre: "π η T t", puntos: ts.map((t) => [t, Math.PI * ETA * TB * t]), color: COLORES[0], punteada: true },
    ],
    xMin: 0, xMax: 12, yMin: 0,
    xEtiqueta: "Tiempo ω₀t", yEtiqueta: "Exponente de decoherencia Γ(t)",
  }));
}
