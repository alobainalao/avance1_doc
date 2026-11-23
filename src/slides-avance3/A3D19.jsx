import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Por qué el óptimo de MRMT semi queda más hondo que el de ADR (FEniCSx, malla con eje de 1 m, γ = 1). Izquierda:
// Ĵ(z_p) con el mismo caudal (óptimo ADR) en los dos modelos; derecha: C en el pozo con z_p = −383 m y ese caudal
// (codigo/data/output/optimizacion_nitrato_vscale_malla_eje_g1/analisis_zp/).
const COLOR = { adr: '#C4511F', mrmt_semi: '#0F7A85' };
const NOMBRE = { adr: 'ADR', mrmt_semi: 'MRMT semi' };
const GRIS = '#6E7F8D';

// vértice de la parábola por los tres puntos alrededor del mínimo muestreado
function vertice(z, J) {
    const i = Math.min(Math.max(1, J.indexOf(Math.min(...J))), J.length - 2), h = z[i + 1] - z[i];
    return z[i] + h * (J[i - 1] - J[i + 1]) / (2 * (J[i - 1] - 2 * J[i] + J[i + 1]));
}

function Barrido({ f }) {
    const B = OPT.analisis.barrido, ms = Object.keys(B);
    const W = 560, H = 360, x0 = 70, x1 = W - 20;
    const z = B[ms[0]].zp, za = Math.min(...z), zb = Math.max(...z);
    const todos = ms.flatMap(m => B[m].J), a = Math.min(...todos) - 0.001, b = Math.max(...todos) + 0.001;
    const sx = v => x0 + (v - za) / (zb - za) * (x1 - x0), sy = v => 20 + (b - v) / (b - a) * (H - 70);
    const marcas = [0.464, 0.468, 0.472].filter(v => v > a && v < b);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {marcas.map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 8} y={sy(v) + 5} textAnchor="end" style={eje}>{v.toFixed(3)}</text></g>
            ))}
            {z.map(v => <text key={v} x={sx(v)} y={H - 28} textAnchor="middle" style={eje}>{String(v).replace('-', '−')}</text>)}
            <text x={(x0 + x1) / 2} y={H - 6} textAnchor="middle" style={eje}>z<tspan dy="5" fontSize="11">p</tspan><tspan dy="-5"> [m]</tspan></text>
            {ms.map((m, j) => {
                const s = B[m], zv = vertice(s.zp, s.J), k = Math.max(1, Math.round(f * (s.zp.length - 1)));
                return (
                    <g key={m}>
                        <polyline points={s.zp.slice(0, k + 1).map((v, i) => `${sx(v)},${sy(s.J[i])}`).join(' ')} fill="none" stroke={COLOR[m]} strokeWidth="2.6" />
                        {s.zp.slice(0, k + 1).map((v, i) => <circle key={i} cx={sx(v)} cy={sy(s.J[i])} r="4" fill={COLOR[m]} />)}
                        <g opacity={tramo(f, 0.95, 1)}>
                            <line x1={sx(zv)} x2={sx(zv)} y1={20} y2={H - 50} stroke={COLOR[m]} strokeDasharray="4 4" strokeWidth="1.6" />
                            <text x={sx(zv) + (j ? -6 : 6)} y={34 + 22 * j} textAnchor={j ? 'end' : 'start'} style={{ ...eje, fontSize: 16, fill: COLOR[m] }}>
                                {NOMBRE[m]}: mín. ≈ {Math.round(zv).toString().replace('-', '−')} m
                            </text>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

function Pozo({ f }) {
    const D = OPT.analisis.diag, ms = Object.keys(D), esc = OPT.f * 1000;   // unidades del modelo → mg/L de nitrato
    const W = 560, H = 360, x0 = 60, x1 = W - 20, n = D[ms[0]].Cpozo.length;
    const b = Math.max(...ms.flatMap(m => D[m].Cpozo)) * esc * 1.12;
    const sx = i => x0 + (i + 1) / n * (x1 - x0), sy = v => 20 + (b - v) / b * (H - 70);
    const k = Math.max(1, Math.round(f * (n - 1)));
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[0, 5, 10, 15, 20].filter(v => v < b).map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 8} y={sy(v) + 5} textAnchor="end" style={eje}>{v}</text></g>
            ))}
            {[0, 10, 20, 30].map(d => <text key={d} x={x0 + d / 30 * (x1 - x0)} y={H - 28} textAnchor="middle" style={eje}>{d} d</text>)}
            {ms.map((m, j) => {
                const c = D[m].Cpozo.map(v => v * esc);
                return (
                    <g key={m}>
                        <polyline points={c.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')} fill="none" stroke={COLOR[m]} strokeWidth="2.6" />
                        <text x={x1} y={sy(c[k]) + (j ? -10 : 22)} textAnchor="end" style={{ ...eje, fontSize: 16, fill: COLOR[m], opacity: tramo(f, 0.9, 1) }}>
                            {NOMBRE[m]}: {c[n - 1].toFixed(1)} mg/L al final
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function A3D19({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6000, 400);
    if (!OPT.analisis || !OPT.analisis.diag.adr || !OPT.analisis.diag.mrmt_semi)
        return <SlideLayout title="¿Por qué MRMT pide un pozo más hondo?" theme={theme}><p>Sin datos.</p></SlideLayout>;
    const f = suave(tramo(p, 0, 0.8));
    const D = OPT.analisis.diag, r = D.mrmt_semi.J1 / D.adr.J1;
    return (
        <SlideLayout title="¿Por qué MRMT pide un pozo más hondo?" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' }}>
                <div>
                    <p style={tit}><InlineMath math="\hat J(z_p)" /> con el mismo caudal (el óptimo ADR)</p>
                    <Barrido f={f} />
                </div>
                <div>
                    <p style={tit}>Nitrato en el pozo [mg/L], <InlineMath math="z_p=-383" /> m y el mismo caudal</p>
                    <Pozo f={f} />
                </div>
            </div>
            <p style={{ ...nota, opacity: tramo(p, 0.8, 1) }}>
                El intercambio con las regiones inmóviles es rápido (<InlineMath math="\tau_r" /> de 4 a 14 h ≪ 30 días): MRMT se comporta
                como ADR retardado (<InlineMath math="1+\sum\beta_r=1.3" />). En ADR la concentración del pozo llega a su pico hacia el día 12
                y baja; en MRMT la masa queda retenida y la concentración sigue subiendo hasta <InlineMath math="T" />. Así{' '}
                <InlineMath math="J_m" /> es {Math.round((r - 1) * 100)} % mayor en MRMT a cualquier profundidad, con la misma pendiente, y el
                equilibrio <InlineMath math="\partial_{z_p}(\gamma J_m)=-\partial_{z_p}(\alpha J_{\rm inst}+\beta J_{\rm op})" /> se alcanza
                unos 20 m más abajo. Las diferencias no vienen ni del caudal ni del optimizador.
            </p>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.45 };
