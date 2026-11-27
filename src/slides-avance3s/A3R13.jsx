import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { OPT } from '../slides-avance3/optimoNitrato.js';
import { BLOQUE } from './optimoBloque.js';
import { CAMPOS } from './camposBloque.js';
import { tanque } from './bloque.js';

// Optimización del modelo MRMT por bloques (versión simplificada; sustituye a los resultados por modelo de
// slides-avance3, A3D14 y A3D15): serie 33 (z_p⁰ = −600 m, demanda promediada por paso, γ = 1, iterados admisibles),
// iterados aceptados de mrmt_block_progreso.jsonl y su continuación (BLOQUE.historia: [nit, Ĵ, χ, z_p]); caudal inicial y
// último, cota de la bomba Q̄_n (OPT.cota) y tanque S_n de la recurrencia (bloque.js). Términos de Ĵ de las simulaciones
// de exportar_simplificada.py (CAMPOS.inicial y CAMPOS.optimo) cuando existen. Resultado preliminar: la corrida sigue.
const H = BLOQUE.historia, U = H[H.length - 1];
const DIAS = OPT.dt / 86400, NQ = BLOQUE.Q.length;
const S_INI = tanque(BLOQUE.Q0), S_OPT = tanque(BLOQUE.Q);
const AGUA = 'var(--a3-agua)', GRIS = 'var(--a3-estrato)';
const fmtZ = z => String(Math.round(z)).replace('-', '−');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sci = v => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(1)}·10${e < 0 ? '⁻' : ''}${String(Math.abs(e)).split('').map(c => SUP[c]).join('')}`; };

// Gráfica genérica: ejes con unidades; series [{ x, y, c, dash, paso }]; log en y opcional; líneas horizontales de referencia.
function Grafica({ titulo, series, xlab, xr, yr, log, ticksX, ticksY, refs = [], H: alto = 200, W = 600 }) {
    const L = 64, R = 12, T = 26, B = 36;
    const f = log ? Math.log10 : (v => v);
    const sx = v => L + (v - xr[0]) / (xr[1] - xr[0]) * (W - L - R);
    const sy = v => T + (f(yr[1]) - f(v)) / (f(yr[1]) - f(yr[0])) * (alto - T - B);
    const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
    const linea = s => s.x.map((x, i) => {
        const p = `${sx(x).toFixed(1)},${sy(Math.max(s.y[i], log ? yr[0] : -Infinity)).toFixed(1)}`;
        return s.paso && i ? `${sx(x).toFixed(1)},${sy(s.y[i - 1]).toFixed(1)} ${p}` : p;
    }).join(' ');
    return (
        <svg viewBox={`0 0 ${W} ${alto}`} style={{ width: '100%', display: 'block' }}>
            <text x={L} y={15} style={{ ...eje, fill: 'var(--sl-text)', fontSize: 15, fontWeight: 600 }}>{titulo}</text>
            {ticksY.map(([v, t]) => (
                <g key={v}>
                    <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="var(--a3-filete)" strokeWidth="0.7" />
                    <text x={L - 6} y={sy(v) + 5} textAnchor="end" style={eje}>{t}</text>
                </g>
            ))}
            {refs.map((r, i) => (
                <g key={i}>
                    <line x1={L} x2={W - R} y1={sy(r.y)} y2={sy(r.y)} stroke={r.c || GRIS} strokeDasharray="5 4" strokeWidth="1.3" />
                    <text x={W - R - 4} y={sy(r.y) - 5} textAnchor="end" style={{ ...eje, fill: r.c || GRIS }}>{r.t}</text>
                </g>
            ))}
            <line x1={L} x2={L} y1={T - 4} y2={alto - B} stroke="var(--sl-text)" />
            <line x1={L} x2={W - R} y1={alto - B} y2={alto - B} stroke="var(--sl-text)" />
            {ticksX.map(v => <text key={v} x={sx(v)} y={alto - B + 17} textAnchor="middle" style={eje}>{v}</text>)}
            <text x={W - R} y={alto - 3} textAnchor="end" style={eje}>{xlab}</text>
            {series.map((s, i) => <polyline key={i} points={linea(s)} fill="none" stroke={s.c} strokeWidth={s.w || 2.4} strokeDasharray={s.dash} />)}
        </svg>
    );
}

const it = H.map(r => r[0]);
const tQ = Array.from({ length: NQ + 1 }, (_, n) => n * DIAS);
const escalon = q => [...q, q[q.length - 1]];

export default function A3R13({ theme = 'dark' }) {
    const ti = CAMPOS.inicial, to = CAMPOS.optimo;
    const baja = 100 * (1 - U[1] / H[0][1]);
    return (
        <SlideLayout title="Optimización del modelo MRMT por bloques: convergencia y controles" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                En {U[0]} iteraciones, <InlineMath math="\hat J" /> baja de {H[0][1].toFixed(3)} a {U[1].toFixed(4)} ({baja.toFixed(1)} %) y el pozo
                sube de {fmtZ(H[0][3])} a {fmtZ(U[3])} m; todos los iterados cumplen las 360 restricciones.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 34px' }}>
                <Grafica titulo={`Funcional Ĵ [–] (χ: ${sci(H[0][2])} → ${sci(U[2])})`} xlab="iteración" xr={[1, Math.max(51, U[0])]} yr={[0.43, 0.52]}
                         ticksX={[1, 10, 20, 30, 40, 50].filter(v => v <= U[0])} ticksY={[0.44, 0.46, 0.48, 0.5, 0.52].map(v => [v, v.toFixed(2)])}
                         series={[{ x: it, y: H.map(r => r[1]), c: AGUA, w: 3 }]} />
                <Grafica titulo="Profundidad del pozo z_p [m]" xlab="iteración" xr={[1, Math.max(51, U[0])]} yr={[-650, -300]}
                         ticksX={[1, 10, 20, 30, 40, 50].filter(v => v <= U[0])} ticksY={[-600, -500, -400, -300].map(v => [v, fmtZ(v)])}
                         series={[{ x: it, y: H.map(r => r[3]), c: AGUA, w: 3 }]} />
                <Grafica titulo="Caudal Q_n [m²/s]" xlab="t [días]" xr={[0, 30]} yr={[0, 0.21]}
                         ticksX={[0, 10, 20, 30]} ticksY={[0, 0.05, 0.1, 0.15, 0.2].map(v => [v, String(v)])}
                         series={[{ x: tQ, y: escalon(OPT.cota), c: GRIS, dash: '4 3', paso: true, w: 1.4 },
                                  { x: tQ, y: escalon(BLOQUE.Q0), c: GRIS, paso: true, w: 1.8 },
                                  { x: tQ, y: escalon(BLOQUE.Q), c: AGUA, paso: true, w: 2.4 }]} />
                <Grafica titulo="Tanque S(t) [m³]" xlab="t [días]" xr={[0, 30]} yr={[0, OPT.S_max * 1.05]}
                         ticksX={[0, 10, 20, 30]} ticksY={[0, 500, 1000, 1500, 2000].map(v => [v, String(v)])}
                         refs={[{ y: OPT.S_max, t: 'S_max' }]}
                         series={[{ x: tQ, y: S_INI, c: GRIS, w: 1.8 }, { x: tQ, y: S_OPT, c: AGUA, w: 2.4 }]} />
            </div>
            <div style={{ display: 'flex', gap: 28, alignItems: 'baseline', marginTop: 2, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                <span><span style={{ color: AGUA, fontWeight: 600 }}>━</span> Ĵ / último iterado</span>
                <span><span style={{ color: GRIS, fontWeight: 600 }}>━</span> control inicial</span>
                <span><span style={{ color: GRIS }}>╌</span> cota de la bomba Q̄<sub>n</sub></span>
                {ti && to && (
                    <span style={{ marginLeft: 'auto', color: 'var(--sl-text)' }}>
                        <InlineMath math="J_m" /> {ti.J1.toFixed(3)} → {to.J1.toFixed(3)} · <InlineMath math="J_{\rm inst}" /> {ti.J2.toFixed(3)} → {to.J2.toFixed(3)} ·{' '}
                        <InlineMath math="J_{\rm op}" /> {ti.J3.toFixed(3)} → {to.J3.toFixed(3)}
                    </span>
                )}
            </div>
            <p style={{ margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--a3-pluma)' }}>
                Resultado preliminar: iterado {U[0]}, <InlineMath math={`\\chi=${sci(U[2]).replace('·', '\\cdot')}`} /> todavía sobre la meta; la corrida sigue hasta 100 iteraciones.
            </p>
            <Notas titulo="Convergencia: detalle">
                <p>
                    Iterados aceptados por trust-constr (no evaluaciones de prueba). <InlineMath math="\hat J=\gamma J_m+\alpha J_{\rm inst}+\beta J_{\rm op}" />{' '}
                    con <InlineMath math="\gamma=\alpha=\beta=1" />, cada término dividido entre su máximo posible: es adimensional. χ es la medida de criticidad
                    de la lámina anterior.
                </p>
                <p>
                    La profundidad no avanza de forma monótona: sube hasta {fmtZ(H[2][3])} m en la iteración {H[2][0]} y después baja hasta{' '}
                    {fmtZ(U[3])} m. χ tampoco: en la iteración 50 vale {sci(H.find(r => r[0] === 50)?.[2] || U[2])} y en la {U[0]},{' '}
                    {sci(U[2])}. La meta <InlineMath math="\chi<10^{-4}" /> todavía no se alcanza.
                </p>
                <p>
                    Pruebas de consistencia del mismo modelo:{' '}
                    {Object.entries(BLOQUE.consistencia).map(([k, c]) => `${k === 'zp200' ? 'arranque en −200 m' : 'reinicio desde el iterado 25'}: iterado ${c.nit}, Ĵ = ${c.J.toFixed(4)}, z_p = ${fmtZ(c.zp)} m`).join('; ')}.
                    Las tres quedan cerca (z_p entre {fmtZ(Math.max(U[3], ...Object.values(BLOQUE.consistencia).map(c => c.zp)))} y{' '}
                    {fmtZ(Math.min(U[3], ...Object.values(BLOQUE.consistencia).map(c => c.zp)))} m), pero no en el mismo punto: falta converger.
                </p>
            </Notas>
        </SlideLayout>
    );
}
