import React from 'react';
import { InlineMath } from 'react-katex';
import { Eq } from './ui.jsx';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// ── Datos ─────────────────────────────────────────────────────────
const PUMP_AVAIL = [
    0.4, 0.3, 0.3, 0.3, 0.4, 0.6,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 0.8, 0.6, 0.4,
];

// Nivel del tanque S_n simulado a lo largo de 24h (normalizado 0–1)
const TANK_VALS = [
    0.50, 0.37, 0.25, 0.18, 0.12, 0.07,
    0.20, 0.33, 0.47, 0.60, 0.72, 0.82,
    0.88, 0.92, 0.96, 1.00, 1.00, 1.00,
    0.95, 0.88, 0.82, 0.72, 0.63, 0.54, 0.50,
];

// ── Geometría SVG compartida ──────────────────────────────────────
const W = 700, H = 148;
const P = { l: 34, r: 12, t: 14, b: 30 };
const PW = W - P.l - P.r, PH = H - P.t - P.b;
const xH = h => P.l + (h / 24) * PW;
const yV = v => P.t + (1 - v) * PH;

const H_TICKS = [0, 4, 8, 12, 16, 20, 24];

// ── SVG nivel del tanque ──────────────────────────────────────────
const linePts = (arr) =>
    arr.map((v, h) => `${xH(h).toFixed(1)},${yV(v).toFixed(1)}`).join(' L ');

const TankSVG = () => {
    const line = `M ${linePts(TANK_VALS)}`;
    const area = line + ` L ${xH(24).toFixed(1)},${yV(0).toFixed(1)} L ${P.l},${yV(0).toFixed(1)} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`}
             style={{ width: '100%', display: 'block', flexShrink: 0,
                      border: '1px solid rgba(96,165,250,0.25)', borderRadius: 8 }}>
            <rect x={P.l} y={P.t} width={PW} height={PH} fill="rgba(46,45,138,0.04)" />
            {/* Zona de rebose */}
            <rect x={P.l} y={P.t} width={PW} height={yV(0.9) - P.t}
                  fill="rgba(248,113,113,0.05)" />
            {/* Área bajo la curva (agua en el tanque) */}
            <path d={area} fill="rgba(96,165,250,0.13)" stroke="none" />
            {/* Línea de nivel */}
            <path d={line} fill="none" stroke="#0F7A85" strokeWidth="2.2" strokeLinejoin="round" />
            {/* Grid horizontal */}
            {[0, 0.5, 1.0].map(v => (
                <g key={v}>
                    <line x1={P.l} x2={P.l + PW} y1={yV(v)} y2={yV(v)}
                          stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" strokeDasharray="4,3" />
                    <text x={P.l - 4} y={yV(v) + 3.5} textAnchor="end" fontSize="8" fill="#7090aa">
                        {v === 0 ? '0' : v === 1 ? 'Smáx' : '½'}
                    </text>
                </g>
            ))}
            {/* Ejes */}
            <line x1={P.l} x2={P.l}      y1={P.t} y2={P.t + PH} stroke="#0F7A85" strokeWidth="1" />
            <line x1={P.l} x2={P.l + PW} y1={P.t + PH} y2={P.t + PH} stroke="#0F7A85" strokeWidth="1" />
            {/* Ticks horizontales */}
            {H_TICKS.map(h => (
                <g key={h}>
                    <line x1={xH(h)} x2={xH(h)} y1={P.t + PH} y2={P.t + PH + 3}
                          stroke="#8ab" strokeWidth="0.8" />
                    <text x={xH(h)} y={P.t + PH + 12} textAnchor="middle" fontSize="8" fill="#8ab">{h}h</text>
                </g>
            ))}
            {/* Anotaciones */}
            <text x={xH(2.5)} y={yV(0.30) - 5} textAnchor="middle" fontSize="8" fill="#C4511F">drenaje nocturno</text>
            <text x={xH(13)}  y={yV(0.88) - 5} textAnchor="middle" fontSize="8" fill="#2E7D4F">recarga diurna</text>
        </svg>
    );
};

// ── SVG disponibilidad bomba ──────────────────────────────────────
function stepPath(arr, close = false) {
    const pts = arr.map((v, h) => `${xH(h).toFixed(1)},${yV(v).toFixed(1)}`);
    pts.push(`${xH(24).toFixed(1)},${yV(arr[0]).toFixed(1)}`);
    const d = 'M ' + pts.join(' L ');
    return close ? d + ` L ${xH(24)},${yV(0)} L ${P.l},${yV(0)} Z` : d;
}

const PumpSVG = () => (
    <svg viewBox={`0 0 ${W} ${H}`}
         style={{ width: '100%', display: 'block', flexShrink: 0,
                  border: '1px solid rgba(251,191,36,0.25)', borderRadius: 8 }}>
        <rect x={P.l} y={P.t} width={PW} height={PH} fill="rgba(46,45,138,0.04)" />
        {/* Franja operación plena */}
        <rect x={xH(6)} y={P.t} width={xH(21) - xH(6)} height={PH}
              fill="rgba(74,222,128,0.06)" />
        <path d={stepPath(PUMP_AVAIL, true)} fill="rgba(251,191,36,0.10)" stroke="none" />
        <path d={stepPath(PUMP_AVAIL)}  fill="none" stroke="#C4511F" strokeWidth="2.2" strokeLinejoin="round" />
        {[0.5, 1.0].map(v => (
            <g key={v}>
                <line x1={P.l} x2={P.l + PW} y1={yV(v)} y2={yV(v)}
                      stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" strokeDasharray="4,3" />
                <text x={P.l - 4} y={yV(v) + 3.5} textAnchor="end" fontSize="8" fill="#7090aa">{v.toFixed(1)}</text>
            </g>
        ))}
        <line x1={P.l} x2={P.l}      y1={P.t} y2={P.t + PH} stroke="#C4511F" strokeWidth="1" />
        <line x1={P.l} x2={P.l + PW} y1={P.t + PH} y2={P.t + PH} stroke="#C4511F" strokeWidth="1" />
        {H_TICKS.map(h => (
            <g key={h}>
                <line x1={xH(h)} x2={xH(h)} y1={P.t + PH} y2={P.t + PH + 3}
                      stroke="#8ab" strokeWidth="0.8" />
                <text x={xH(h)} y={P.t + PH + 12} textAnchor="middle" fontSize="8" fill="#8ab">{h}h</text>
            </g>
        ))}
        <text x={xH(2.5)}  y={yV(0.3) - 5} textAnchor="middle" fontSize="8" fill="#C4511F">reposo nocturno</text>
        <text x={xH(13.5)} y={yV(1.0) - 5} textAnchor="middle" fontSize="8" fill="#2E7D4F">operación plena  06–21h</text>
    </svg>
);

// ── Ecuaciones ────────────────────────────────────────────────────
const eqBalance = String.raw`S_n = S_{n-1} + V_s\,\Delta t\,Q_n \;-\; d_n`;
const eqLB      = String.raw`S_n \ge 0 \;\Longleftrightarrow\; V_s\Delta t\,Q_n + S_{n-1} \ge d_n`;
const eqUB      = String.raw`S_n \le S_{\max} \;\Longleftrightarrow\; V_s\Delta t\,Q_n \le d_n + (S_{\max} - S_{n-1})`;
const eqDuty    = String.raw`\sum_{k=n}^{n+w-1} Q_k \le f_d\cdot Q_{\max}\cdot w`;
const eqFd      = String.raw`f_d = \frac{\tau_{\mathrm{on}}}{\tau_{\mathrm{on}}+\tau_{\mathrm{off}}},\quad w = \left\lceil\frac{\tau_{\mathrm{on}}+\tau_{\mathrm{off}}}{\Delta t}\right\rceil`;

// ── Slide ─────────────────────────────────────────────────────────
const A3S12 = ({ theme = 'dark' }) => (
    <SlideLayout title="Ciclos de bomba y restricciones de extracción" theme={theme} justify="flex-start">

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>

            {/* ── Fila 1: las dos gráficas ── */}
            <div style={{ flexShrink: 0, display: 'flex', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}><TankSVG /></div>
                <div style={{ flex: 1, minWidth: 0 }}><PumpSVG /></div>
            </div>

            {/* ── Fila 2: los dos bloques de texto ── */}
            <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0 }}>

                {/* Balance del tanque */}
                <div style={{
                    flex: 1, minWidth: 0,
                    border: '1px solid rgba(96,165,250,0.22)', borderRadius: 10,
                    background: 'rgba(96,165,250,0.05)', padding: '8px 14px',
                    display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                    <p style={{ margin: '0 0 2px', fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', fontWeight: 600, color: '#0F7A85' }}>
                        Balance del tanque (por paso)
                    </p>
                    <Eq math={eqBalance} id='tanque' />

                    <div style={{ borderTop: '1px solid rgba(96,165,250,0.12)', paddingTop: 3 }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', fontWeight: 600, color: '#2E7D4F' }}>
                            <InlineMath math="S_n \ge 0" /> — suministro siempre cubierto:
                        </p>
                        <Eq math={eqLB} compacta />
                    </div>
                    <div style={{ borderTop: '1px solid rgba(96,165,250,0.12)', paddingTop: 3 }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', fontWeight: 600, color: '#C4511F' }}>
                            <InlineMath math="S_n \le S_{\max}" /> — no extraer más de lo necesario:
                        </p>
                        <Eq math={eqUB} compacta />
                    </div>
                </div>

                {/* Ciclo trabajo / descanso */}
                <div style={{
                    flex: 1, minWidth: 0,
                    border: '1.5px solid rgba(251,191,36,0.35)', borderRadius: 10,
                    background: 'rgba(251,191,36,0.05)', padding: '8px 12px',
                    display: 'flex', flexDirection: 'column', gap: 5,
                }}>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', fontWeight: 600, color: '#C4511F' }}>
                        Ciclo trabajo / descanso — ventana deslizante
                    </p>
                    <Eq math={eqDuty} id='ciclo' />
                    <Eq math={eqFd} compacta />

                    <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 2 }}>
                        <tbody>
                            {[
                                ['τ_on',  '20 h',       'máx operación continua'],
                                ['τ_off',  '4 h',        'mín descanso'],
                                ['f_d',   '0.833',       '= 20/24'],
                                ['w',     '3 pasos',     '⌈24h/10h⌉ = 3'],
                                ['cota',  '0.50', 'f_d · Q_max · w  (Q_max = 0.2)'],
                            ].map(([k, v, desc]) => (
                                <tr key={k} style={{ borderBottom: '1px solid rgba(251,191,36,0.12)' }}>
                                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--a3-fs-nota)', color: '#C4511F',
                                                 padding: '3px 6px 3px 0', fontWeight: 700 }}>{k}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-text)',
                                                 padding: '3px 6px', fontWeight: 600 }}>{v}</td>
                                    <td style={{ fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', padding: '3px 0' }}>{desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontStyle: 'italic' }}>
                        Grundfos MMS (2019) · NEMA MG-1 (2021)
                    </p>
                </div>

            </div>
        </div>

    </SlideLayout>
);

export default A3S12;

A3S12.ecuaciones = ['tanque', 'ciclo'];
