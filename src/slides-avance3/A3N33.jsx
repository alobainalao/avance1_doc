import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Tabla } from './ui.jsx';
import { OPT } from './optimoNitrato.js';

// Control óptimo con la configuración de nitrato (data/output/optimizacion_nitrato_vscale_malla, FEniCSx,
// malla compartida): caudal y tanque del punto inicial y del óptimo de cada modelo ya optimizado.
const COL = { adr: '#0F7A85', mrmt_semi: '#C4511F', mrmt_block: '#2E7D4F' };
// Los óptimos casi coinciden: los MRMT van discontinuos para que el ADR siga visible debajo.
const TRAZO = { adr: undefined, mrmt_semi: '7 4', mrmt_block: '2 4' };
const W = 760, PX = 62, PD = 14, PY = 12, PB = 34;
const menos = v => String(v).replace('-', '\u2212');

// Panel SVG con eje de tiempo común (días) y escala vertical [y0, y1].
function Panel({ H, y0, y1, ticks, fmt, etiqueta, children }) {
    const t = OPT.t_dias, tf = t[t.length - 1];
    const sx = v => PX + v / tf * (W - PX - PD);
    const sy = v => PY + (y1 - v) / (y1 - y0) * (H - PY - PB);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            {ticks.map(v => (
                <g key={v}>
                    <line x1={PX} x2={W - PD} y1={sy(v)} y2={sy(v)} stroke="var(--a3-filete, #C9D3DB)" strokeWidth={0.8} />
                    <text x={PX - 8} y={sy(v) + 5} textAnchor="end" fill="var(--sl-muted)" fontSize={14}
                          fontFamily="var(--a3-sans, sans-serif)">{fmt(v)}</text>
                </g>
            ))}
            {[0, 10, 20, 30].map(v => (
                <text key={v} x={sx(v)} y={H - PB + 20} textAnchor="middle" fill="var(--sl-muted)" fontSize={14}
                      fontFamily="var(--a3-sans, sans-serif)">{v}</text>
            ))}
            <text x={W - PD} y={H - 4} textAnchor="end" fill="var(--sl-muted)" fontSize={14}
                  fontFamily="var(--a3-sans, sans-serif)">t [días]</text>
            <text x={PX + 6} y={PY + 14} fill="var(--sl-text)" fontSize={16} fontFamily="var(--a3-sans, sans-serif)">{etiqueta}</text>
            {children(sx, sy)}
        </svg>
    );
}

// Escalón: Q_n vale en [t_n, t_{n+1}).
const escalon = (q, sx, sy) => {
    const t = OPT.t_dias;
    let d = `M${sx(t[0])} ${sy(q[0])}`;
    q.forEach((v, i) => { d += `H${sx(t[i + 1])}`; if (i + 1 < q.length) d += `V${sy(q[i + 1])}`; });
    return d;
};
const linea = (s, sx, sy) => s.map((v, i) => `${i ? 'L' : 'M'}${sx(OPT.t_dias[i])} ${sy(v)}`).join('');

const n2 = v => v.toFixed(3);
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sci = v => {
    if (v >= 0.01) return v.toFixed(3);
    const [m, e] = v.toExponential(1).split('e');
    return `${m}·10${e.replace('+', '').replace(/-/g, '⁻').replace(/[0-9]/g, c => SUP[+c])}`;
};
const miles = n => Math.round(n).toLocaleString('en-US').replace(/,/g, '\u2009');

export default function A3N33({ theme = 'dark' }) {
    const ms = OPT.modelos;
    const adr = ms[0];
    const qm = adr.Q.reduce((a, b) => a + b, 0) / adr.Q.length;
    const smin = Math.min(...adr.S), smax = Math.max(...adr.S);
    const semi = ms.find(m => m.id === 'mrmt_semi');
    const dqMax = semi ? Math.max(...adr.Q.map((q, i) => Math.abs(q - semi.Q[i]))) : 0;
    const filas = [
        { k: 'Inicial', zp: menos(OPT.zp0), cal: sci(adr.J0.J1), ins: n2(adr.J0.J2), op: n2(adr.J0.J3), J: n2(adr.J0.J),
          colors: { k: 'var(--sl-muted)' } },
        ...ms.map(m => ({ k: `Óptimo ${m.nombre.replace(' ', '\u00a0')}`, zp: menos(m.zp.toFixed(1)), cal: n2(m.J.J1), ins: n2(m.J.J2), op: n2(m.J.J3),
                          J: n2(m.J.J), colors: { k: COL[m.id] } })),
    ];
    return (
        <SlideLayout title="Control óptimo con la configuración de nitrato" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 28, flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1.55, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <Panel H={330} y0={0} y1={0.24} ticks={[0, 0.1, 0.2]} fmt={v => v.toFixed(1)} etiqueta="Caudal Qₙ [m²/s]">
                            {(sx, sy) => (
                                <g fill="none">
                                    <path d={escalon(OPT.cota, sx, sy)} stroke="#6E7F8D" strokeWidth={1.2} strokeDasharray="2 3" />
                                    <path d={escalon(OPT.Q0, sx, sy)} stroke="#6E7F8D" strokeWidth={2} strokeDasharray="8 5" />
                                    {ms.map(m => <path key={m.id} d={escalon(m.Q, sx, sy)} stroke={COL[m.id]} strokeWidth={m.id === 'adr' ? 3 : 2} strokeDasharray={TRAZO[m.id]} />)}
                                </g>
                            )}
                        </Panel>
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <Panel H={330} y0={-8000} y1={2600} ticks={[-7500, -5000, -2500, 0, 2000]} fmt={v => menos(miles(v))}
                               etiqueta="Volumen del tanque Sₙ [m³]">
                            {(sx, sy) => (
                                <g fill="none">
                                    <rect x={sx(0)} y={sy(OPT.S_max)} width={sx(30) - sx(0)} height={sy(0) - sy(OPT.S_max)}
                                          fill="#2E7D4F" opacity={0.10} stroke="none" />
                                    <path d={linea(OPT.S0, sx, sy)} stroke="#6E7F8D" strokeWidth={2} strokeDasharray="8 5" />
                                    {ms.map(m => <path key={m.id} d={linea(m.S, sx, sy)} stroke={COL[m.id]} strokeWidth={m.id === 'adr' ? 3 : 2} strokeDasharray={TRAZO[m.id]} />)}
                                </g>
                            )}
                        </Panel>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 20, rowGap: 2, whiteSpace: 'nowrap', fontSize: 16, color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans, sans-serif)', flexShrink: 0 }}>
                        <span>– – inicial</span>
                        <span>· · · cota de la bomba</span>
                        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'rgba(46,125,79,0.25)', marginRight: 6 }} />[0, S<sub>max</sub>]</span>
                        {ms.map(m => <span key={m.id} style={{ color: COL[m.id] }}>{m.id === 'adr' ? '—' : '– –'} óptimo {m.nombre}</span>)}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Tabla size={17} cols={[
                        { k: 'k', label: '' }, { k: 'zp', label: 'zₚ [m]', mono: true }, { k: 'cal', label: 'γJₘ', mono: true },
                        { k: 'ins', label: 'αJ_inst', mono: true }, { k: 'op', label: 'βJ_op', mono: true }, { k: 'J', label: 'Ĵ', mono: true },
                    ]} rows={filas} />
                    <Punto color="#6E7F8D" size={17}>
                        El inicial <b>no es admisible</b>: el tanque baja hasta {menos(miles(Math.min(...OPT.S0)))} m³.
                        La bajada de Ĵ no compara dos regímenes posibles.
                    </Punto>
                    <Punto color="#0F7A85" size={17}>
                        ADR, {adr.nit} iteraciones: pozo a {menos(adr.zp)} m (cota superior), Q medio {qm.toFixed(3)} m²/s,
                        tanque en [{Math.round(smin)}, {Math.round(smax)}] m³ y ≈ {Math.round(Math.sqrt(adr.J.J1 / OPT.gamma) * 50)} mg/L
                        de nitrato captado, bajo el límite de 50.
                    </Punto>
                    {semi && (
                        <Punto color="#C4511F" size={17}>
                            MRMT semi: el mismo óptimo. Caudal a menos de {dqMax.toFixed(3)} m²/s del ADR y Ĵ igual en
                            tres cifras: con γ = {OPT.gamma} el costo fija el control.
                        </Punto>
                    )}
                    {ms.length < 3 && (
                        <Punto color="#6E7F8D" size={17}>MRMT bloque: optimización en curso con la misma configuración.</Punto>
                    )}
                </div>
            </div>
        </SlideLayout>
    );
}
