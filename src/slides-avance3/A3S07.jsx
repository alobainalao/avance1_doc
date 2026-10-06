import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const J_VALS = [4.9181, 4.9116, 4.9152, 4.9170, 4.9181, 4.9185, 4.9190, 4.9191];

const W = 460, H = 420;
const PAD = { l: 78, r: 20, t: 22, b: 50 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;

const J_TOP = 4.9205, J_BOT = 4.9100;
const J_SPAN = J_TOP - J_BOT;

const xPx = (i) => PAD.l + (i / (J_VALS.length - 1)) * PW;
const yPx = (j) => PAD.t + (J_TOP - j) / J_SPAN * PH;

const curvePts = J_VALS.map((j, i) => `${xPx(i).toFixed(1)},${yPx(j).toFixed(1)}`).join(' ');
const areaPath = `M${xPx(0)},${PAD.t + PH} ` +
    J_VALS.map((j, i) => `L${xPx(i).toFixed(1)},${yPx(j).toFixed(1)}`).join(' ') +
    ` L${xPx(J_VALS.length - 1)},${PAD.t + PH} Z`;

const yTicks = [4.912, 4.914, 4.916, 4.918, 4.920];

const ConvSVG = () => (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ flex: '0 0 56%', border: '1px solid rgba(0,216,255,0.25)', borderRadius: 8 }}>
        <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.03" />
            </linearGradient>
        </defs>

        <rect x={PAD.l} y={PAD.t} width={PW} height={PH} fill="rgba(0,0,0,0.28)" />

        {/* Grid */}
        {yTicks.map(j => (
            <g key={j}>
                <line x1={PAD.l} y1={yPx(j)} x2={PAD.l + PW} y2={yPx(j)}
                      stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                <text x={PAD.l - 5} y={yPx(j) + 4} textAnchor="end" fontSize="10" fill="#7090aa">
                    {j.toFixed(3)}
                </text>
            </g>
        ))}
        {J_VALS.map((_, i) => (
            <line key={i} x1={xPx(i)} y1={PAD.t} x2={xPx(i)} y2={PAD.t + PH}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        ))}

        {/* J₀ baseline */}
        <line x1={PAD.l} y1={yPx(J_VALS[0])} x2={PAD.l + PW} y2={yPx(J_VALS[0])}
              stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,3" />
        <text x={PAD.l + PW - 2} y={yPx(J_VALS[0]) - 5} textAnchor="end" fontSize="9.5" fill="#94a3b8">J₀</text>

        {/* Zona de mejora marginal */}
        <rect x={PAD.l} y={yPx(J_VALS[0])} width={PW}
              height={yPx(J_VALS[1]) - yPx(J_VALS[0])}
              fill="rgba(74,222,128,0.07)" />

        {/* Área bajo la curva */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Curva */}
        <polyline points={curvePts} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" />
        {J_VALS.map((j, i) => (
            <circle key={i} cx={xPx(i)} cy={yPx(j)} r="4" fill="#60a5fa"
                    stroke="#0b0f19" strokeWidth="1.5" />
        ))}

        {/* Anotación J_min */}
        <line x1={xPx(1)} y1={PAD.t + 4} x2={xPx(1)} y2={yPx(J_VALS[1]) - 6}
              stroke="#4ade80" strokeWidth="1.2" strokeDasharray="4,2" />
        <text x={xPx(1) + 5} y={PAD.t + 15} fontSize="9.5" fill="#4ade80" fontWeight="bold">J_min</text>
        <text x={xPx(1) + 5} y={PAD.t + 26} fontSize="8.5" fill="#4ade80">4.912×10⁵</text>

        {/* Ejes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH} stroke="#00d8ff" strokeWidth="1.4" />
        <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH} stroke="#00d8ff" strokeWidth="1.4" />

        {/* Ticks X */}
        {J_VALS.map((_, i) => (
            <text key={i} x={xPx(i)} y={PAD.t + PH + 16} textAnchor="middle" fontSize="10" fill="#7090aa">{i}</text>
        ))}

        {/* Labels */}
        <text x={PAD.l + PW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#7090aa">iteración</text>
        <text x="11" y={PAD.t + PH / 2} textAnchor="middle" fontSize="11" fill="#7090aa"
              transform={`rotate(-90,11,${PAD.t + PH / 2})`}>J (×10⁵)</text>
    </svg>
);

const A3S07 = ({ theme = 'dark' }) => (
    <SlideLayout title="Convergencia — escenario conservador" theme={theme} justify="flex-start">
        <div style={{ display: 'flex', gap: '3%', alignItems: 'stretch', flex: 1 }}>
            <ConvSVG />
            <div style={{ flex: 1, fontSize: 26, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--sl-accent)', fontWeight: 700, margin: 0, fontSize: 27 }}>Análisis</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 24 }}>
                    <tbody>
                        {[
                            ['J₀',        '4.918×10⁵', 'var(--sl-text)'],
                            ['J_min',     '4.912×10⁵', '#4ade80'],
                            ['J_final',   '4.919×10⁵', 'var(--sl-text)'],
                            ['ΔJ / J₀',  '−0.12 %',   '#f59e0b'],
                        ].map(([k, v, vc], i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(0,216,255,0.12)' }}>
                                <td style={{ padding: '7px 0', color: 'var(--sl-muted)', fontFamily: 'monospace' }}>{k}</td>
                                <td style={{ padding: '7px 0', color: vc, textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ padding: '12px 14px', border: '1.5px solid #f59e0b',
                              borderRadius: 7, background: 'rgba(245,158,11,0.08)' }}>
                    <p style={{ margin: 0, color: '#f59e0b', fontWeight: 700, fontSize: 22 }}>
                        ⚠️ Mínimo local — mejora marginal
                    </p>
                    <p style={{ margin: '6px 0 0', color: 'var(--sl-text)', fontWeight: 400, fontSize: 21, lineHeight: 1.4 }}>
                        El optimizador converge cerca del punto inicial.
                        Próximo paso: reescalar{' '}
                        <InlineMath math="\gamma" /> y cotas de{' '}
                        <InlineMath math="Q" />.
                    </p>
                </div>

                <p style={{ margin: 0, color: 'var(--sl-muted)', fontSize: 21, lineHeight: 1.4 }}>
                    Backend BFR &nbsp;·&nbsp;{' '}
                    <InlineMath math={String.raw`Q_{\max}=5\times10^{-3}`} /> m³/s &nbsp;·&nbsp; κ = 1
                </p>
            </div>
        </div>
    </SlideLayout>
);

export default A3S07;
