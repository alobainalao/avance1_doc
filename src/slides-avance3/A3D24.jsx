import React, { useMemo } from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Compromiso calidad–costo y su frente (aproximado): ADR con el caudal fijo del mejor iterado, J_m y J_inst + J_op en cada
// z_p del barrido (experimentos/barrido_zp.py → OPT.pareto). Para cada peso γ, el mínimo de γ J_m + J_inst + J_op sobre la
// curva interpolada cada metro; al subir γ (más peso a la calidad) el pozo baja. El frente de Pareto completo reoptimiza
// también el caudal para cada γ: está pendiente.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';
const G0 = 0.25, G1 = 4;

function curva() {
    const P = OPT.pareto;
    const pts = P.zp.map((z, i) => ({ z, q: P.J1[i], c: P.J2[i] + P.J3[i] }));
    const fino = [];                                   // interpolación lineal en z_p, cada metro
    for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], n = Math.max(1, Math.round(b.z - a.z));
        for (let k = 0; k < n; k++) {
            const w = k / n;
            fino.push({ z: a.z + w * (b.z - a.z), q: a.q + w * (b.q - a.q), c: a.c + w * (b.c - a.c) });
        }
    }
    fino.push(pts[pts.length - 1]);
    const mejor = g => fino.reduce((m, p) => (g * p.q + p.c < g * m.q + m.c ? p : m), fino[0]);
    // puntos no dominados (frente) entre los muestreados
    const frente = pts.filter(p => !pts.some(o => o !== p && o.q <= p.q && o.c <= p.c && (o.q < p.q || o.c < p.c)));
    return { pts, mejor, frente };
}

export default function A3D24({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(11000, 400);
    const datos = useMemo(() => (OPT.pareto ? curva() : null), []);
    if (!datos) return <SlideLayout title="Frente de Pareto" theme={theme}><p>El barrido todavía no termina.</p></SlideLayout>;
    const { pts, mejor, frente } = datos;
    const dibuja = suave(tramo(p, 0.02, 0.3));
    const sg = suave(tramo(p, 0.35, 0.95));
    const g = G0 * Math.pow(G1 / G0, sg), m = mejor(g), m1 = mejor(1);
    // eje izquierdo: J_m (x) frente a costo (y)
    const W = 640, H = 430, L = 74, B = 56;
    const qs = pts.map(o => o.q), cs = pts.map(o => o.c);
    const qa = 0, qb = Math.max(...qs) * 1.08, ca = Math.min(...cs) * 0.95, cb = Math.max(...cs) * 1.03;
    const sx = v => L + (v - qa) / (qb - qa) * (W - L - 16), sy = v => 12 + (cb - v) / (cb - ca) * (H - B - 12);
    const k = Math.max(1, Math.round(dibuja * (pts.length - 1)));
    // recta de nivel γ q + c = cte por el mínimo (pendiente −γ en los datos)
    const linea = [qa, qb].map(q => [sx(q), sy(m.c - g * (q - m.q))]);
    // derecha: z_p*(γ) en escala log de γ
    const W2 = 520, L2 = 70;
    const gs = Array.from({ length: 81 }, (_, i) => G0 * Math.pow(G1 / G0, i / 80)), zs = gs.map(x => mejor(x).z);
    const za = Math.min(...zs, -1300), zb = Math.max(...zs, -200);
    const gx = x => L2 + Math.log(x / G0) / Math.log(G1 / G0) * (W2 - L2 - 16), zy = z => 12 + (zb - z) / (zb - za) * (H - B - 12);
    const kk = Math.round(sg * 80);
    return (
        <SlideLayout title="Calidad frente a costo: hacia el frente de Pareto" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 30, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Cada punto es una profundidad <InlineMath math="z_p" /> con el mismo caudal</p>
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
                        <line x1={L} x2={W - 10} y1={H - B} y2={H - B} stroke={GRIS} />
                        <line x1={L} x2={L} y1={8} y2={H - B} stroke={GRIS} />
                        <text x={(L + W) / 2} y={H - 14} textAnchor="middle" style={eje}>J<tspan dy="5" fontSize="11">m</tspan><tspan dy="-5">  calidad del agua (menos es mejor) →</tspan></text>
                        <text x={18} y={(H - B) / 2} transform={`rotate(-90 18 ${(H - B) / 2})`} textAnchor="middle" style={eje}>costo J_inst + J_op →</text>
                        <polyline points={pts.slice(0, k + 1).map(o => `${sx(o.q)},${sy(o.c)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2.6" />
                        {pts.slice(0, k + 1).map((o, i) => (
                            <g key={i}>
                                <circle cx={sx(o.q)} cy={sy(o.c)} r="5" fill={frente.includes(o) ? AGUA : 'none'} stroke={AGUA} strokeWidth="1.8" />
                                {(i % 3 === 0 || i === pts.length - 1) && <text x={sx(o.q) + 8} y={sy(o.c) - 8} style={{ ...eje, fontSize: 13 }}>{String(Math.round(o.z)).replace('-', '−')} m</text>}
                            </g>
                        ))}
                        {sg > 0 && (
                            <g>
                                <line x1={linea[0][0]} y1={linea[0][1]} x2={linea[1][0]} y2={linea[1][1]} stroke={PLUMA} strokeDasharray="6 5" strokeWidth="1.6" />
                                <circle cx={sx(m1.q)} cy={sy(m1.c)} r="9" fill="none" stroke={VALIDO} strokeWidth="2.4" />
                                <text x={sx(m1.q) - 12} y={sy(m1.c) + 24} textAnchor="end" style={{ ...eje, fill: VALIDO, fontSize: 14 }}>γ = 1 (corridas actuales)</text>
                                <circle cx={sx(m.q)} cy={sy(m.c)} r="7" fill={PLUMA} />
                            </g>
                        )}
                    </svg>
                </div>
                <div>
                    <p style={tit}>Profundidad que minimiza <InlineMath math="\gamma J_m+J_{\rm inst}+J_{\rm op}" /></p>
                    <svg viewBox={`0 0 ${W2} ${H}`} style={{ width: '100%' }}>
                        <line x1={L2} x2={W2 - 10} y1={H - B} y2={H - B} stroke={GRIS} />
                        <line x1={L2} x2={L2} y1={8} y2={H - B} stroke={GRIS} />
                        {[-1200, -900, -600, -300].map(z => (
                            <g key={z}><line x1={L2} x2={W2 - 10} y1={zy(z)} y2={zy(z)} stroke={GRIS} strokeOpacity="0.2" />
                                <text x={L2 - 8} y={zy(z) + 5} textAnchor="end" style={eje}>{String(z).replace('-', '−')}</text></g>
                        ))}
                        {[0.25, 0.5, 1, 2, 4].map(x => <text key={x} x={gx(x)} y={H - B + 22} textAnchor="middle" style={eje}>{x}</text>)}
                        <text x={(L2 + W2) / 2} y={H - 14} textAnchor="middle" style={eje}>peso de la calidad γ (escala log)</text>
                        <line x1={gx(1)} x2={gx(1)} y1={8} y2={H - B} stroke={VALIDO} strokeDasharray="4 4" />
                        <polyline points={gs.slice(0, kk + 1).map((x, i) => `${gx(x)},${zy(zs[i])}`).join(' ')} fill="none" stroke={PLUMA} strokeWidth="2.6" />
                        {sg > 0 && <circle cx={gx(g)} cy={zy(m.z)} r="7" fill={PLUMA} />}
                        {sg > 0 && <text x={W2 - 12} y={30} textAnchor="end" style={{ ...eje, fontSize: 17, fill: PLUMA }}>
                            γ = {g.toFixed(2)} → z<tspan dy="5" fontSize="12">p</tspan><tspan dy="-5"> = {String(Math.round(m.z)).replace('-', '−')} m</tspan>
                        </text>}
                    </svg>
                </div>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Más hondo, menos nitrato pero más costo. Cada peso <InlineMath math="\gamma" /> elige un punto de la curva: el tangente a una
                recta de pendiente <InlineMath math="-\gamma" />. Con más peso a la calidad el pozo baja.
            </p>
            <p style={{ margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                Aproximación: ADR con el caudal fijo del mejor iterado (iteración {OPT.pareto.nit}); solo se mueve <InlineMath math="z_p" />.
                El frente de Pareto completo reoptimiza caudal y profundidad para cada <InlineMath math="\gamma" /> (pendiente). Puntos
                rellenos: no dominados.
            </p>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
