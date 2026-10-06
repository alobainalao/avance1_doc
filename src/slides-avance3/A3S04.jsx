import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// ── SVG compacto en ancho completo ───────────────────────────
const W = 900, H = 240;
const PAD = { l: 70, r: 20, t: 16, b: 44 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;

const xPx = (ld) => PAD.l + (ld + 6) / 5 * PW;
const yPx = (le) => PAD.t + (-3 - le) / 12 * PH;

const gradQ4 = [[-6,-7],[-5,-7.5],[-4,-8.05],[-3,-9.5],[-2,-10.3],[-1,-12]]
    .map(([d,e]) => [xPx(d), yPx(e)]);
const gradZp = [[-6,-9.5],[-5,-10],[-4,-11.5],[-3,-13],[-2,-15],[-1,-15]]
    .map(([d,e]) => [xPx(d), yPx(e)]);
const pts = (arr) => arr.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const xTicks = [-6,-5,-4,-3,-2,-1];
const yTicks = [-4,-7,-10,-13];
const supMap = {'-1':'⁻¹','-2':'⁻²','-3':'⁻³','-4':'⁻⁴','-5':'⁻⁵','-6':'⁻⁶',
                '-7':'⁻⁷','-8':'⁻⁸','-10':'⁻¹⁰','-12':'⁻¹²','-13':'⁻¹³','-14':'⁻¹⁴','-15':'⁻¹⁵'};
const sup = (n) => supMap[String(n)] ?? String(n);

const CheckpointSVG = () => (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', flexShrink: 0,
         border: '1px solid rgba(0,216,255,0.22)', borderRadius: 8 }}>
        <defs>
            <linearGradient id="validGrad04" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0.02" />
            </linearGradient>
        </defs>
        <rect x={PAD.l} y={PAD.t} width={PW} height={PH} fill="rgba(0,0,0,0.25)" />
        {/* Zona válida completa */}
        <rect x={PAD.l} y={yPx(-3)} width={PW} height={PAD.t + PH - yPx(-3)}
              fill="url(#validGrad04)" />
        {/* Grid */}
        {yTicks.map(le => (
            <g key={le}>
                <line x1={PAD.l} y1={yPx(le)} x2={PAD.l + PW} y2={yPx(le)}
                      stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                <text x={PAD.l - 4} y={yPx(le) + 3.5} textAnchor="end" fontSize="9" fill="#7090aa">
                    10{sup(le)}
                </text>
            </g>
        ))}
        {xTicks.map(ld => (
            <g key={ld}>
                <line x1={xPx(ld)} y1={PAD.t} x2={xPx(ld)} y2={PAD.t + PH}
                      stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                <text x={xPx(ld)} y={PAD.t + PH + 13} textAnchor="middle" fontSize="9" fill="#7090aa">
                    10{sup(ld)}
                </text>
            </g>
        ))}
        {/* Tolerancia */}
        <line x1={PAD.l} y1={yPx(-3)} x2={PAD.l + PW} y2={yPx(-3)}
              stroke="#ffffff" strokeWidth="1.3" strokeDasharray="6,3" />
        <text x={PAD.l + 6} y={yPx(-3) - 4} fontSize="9" fill="white" fontWeight="bold">tol 10⁻³</text>
        {/* Ejes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH} stroke="#00d8ff" strokeWidth="1.2" />
        <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH} stroke="#00d8ff" strokeWidth="1.2" />
        {/* Curvas */}
        <polyline points={pts(gradQ4)} fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinejoin="round" />
        <polyline points={pts(gradZp)} fill="none" stroke="#f87171" strokeWidth="2.2" strokeLinejoin="round" />
        {gradQ4.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3.5" fill="#4ade80" stroke="#0b0f19" strokeWidth="1.2" />)}
        {gradZp.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3.5" fill="#f87171" stroke="#0b0f19" strokeWidth="1.2" />)}
        {/* Leyenda */}
        <rect x={PAD.l + PW - 100} y={PAD.t + 5} width={96} height={38} rx="4"
              fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.1)" />
        <line x1={PAD.l+PW-93} y1={PAD.t+16} x2={PAD.l+PW-78} y2={PAD.t+16} stroke="#4ade80" strokeWidth="1.8" />
        <circle cx={PAD.l+PW-85} cy={PAD.t+16} r="3" fill="#4ade80" />
        <text x={PAD.l+PW-75} y={PAD.t+20} fontSize="8.5" fill="#4ade80">∇_Q J [t₄]</text>
        <line x1={PAD.l+PW-93} y1={PAD.t+30} x2={PAD.l+PW-78} y2={PAD.t+30} stroke="#f87171" strokeWidth="1.8" />
        <circle cx={PAD.l+PW-85} cy={PAD.t+30} r="3" fill="#f87171" />
        <text x={PAD.l+PW-75} y={PAD.t+34} fontSize="8.5" fill="#f87171">∂J/∂z_p</text>
        {/* Etiquetas */}
        <text x={PAD.l + PW/2} y={H - 4} textAnchor="middle" fontSize="9.5" fill="#7090aa">
            δ relativo (δ / |xᵢ|)
        </text>
        <text x="11" y={PAD.t + PH/2} textAnchor="middle" fontSize="9.5" fill="#7090aa"
              transform={`rotate(-90,11,${PAD.t + PH/2})`}>error relativo</text>
    </svg>
);

// ── 4 filas a todo ancho ──────────────────────────────────────
const rows = [
    { comp: '∇_Q J [t₀]', label: 'gradiente de J respecto a Q  —  tiempo inicial',   err: '< 10⁻¹⁰', color: '#4ade80' },
    { comp: '∇_Q J [t½]', label: 'gradiente de J respecto a Q  —  tiempo medio',     err: '< 10⁻¹⁰', color: '#4ade80' },
    { comp: '∇_Q J [t₄]', label: 'gradiente de J respecto a Q  —  tiempo final t₄',  err: '~ 10⁻⁷',  color: '#60a5fa' },
    { comp: '∂J/∂z_p',    label: 'gradiente de J respecto a la posición del pozo',   err: '~ 10⁻¹⁵', color: '#4ade80' },
];

const A3S04 = ({ theme = 'dark' }) => (
    <SlideLayout title="Checkpoint del gradiente adjunto" theme={theme} justify="flex-start">
        <CheckpointSVG />

        <div style={{
            flex: '0 0 auto',
            border: '1px solid rgba(0,216,255,0.25)', borderRadius: 10,
            background: 'rgba(0,0,0,0.18)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
            {rows.map(({ comp, label, err, color }, i) => (
                <div key={comp} style={{
                    display: 'flex', alignItems: 'center', gap: '3%',
                    borderLeft: `5px solid ${color}`,
                    borderBottom: i < rows.length - 1 ? '1px solid rgba(0,216,255,0.12)' : 'none',
                    padding: '18px 24px',
                    background: `${color}07`,
                }}>
                    <span style={{
                        fontFamily: 'monospace', fontSize: 30, fontWeight: 700,
                        color: 'var(--sl-text)', minWidth: 140, flexShrink: 0,
                    }}>{comp}</span>

                    <span style={{
                        color: 'var(--sl-muted)', fontSize: 22, flex: 1,
                        lineHeight: 1.3, fontStyle: 'italic',
                    }}>{label}</span>

                    <span style={{
                        fontFamily: 'monospace', fontSize: 30, fontWeight: 700,
                        color, minWidth: 110, textAlign: 'right', flexShrink: 0,
                    }}>{err}</span>

                    <span style={{ fontSize: 28, flexShrink: 0 }}>✅</span>
                </div>
            ))}
        </div>

        <div style={{
            padding: '14px 24px',
            border: '2px solid #4ade80', borderRadius: 8,
            background: 'rgba(74,222,128,0.09)',
            display: 'flex', alignItems: 'center', gap: 18,
        }}>
            <span style={{ fontSize: 30 }}>🎯</span>
            <p style={{ margin: 0, color: '#4ade80', fontWeight: 700, fontSize: 26 }}>
                Tolerancia <InlineMath math={"10^{-3}"} /> — SUPERADA en todos los componentes
            </p>
            <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 24, marginLeft: 'auto', flexShrink: 0 }}>
                Corridas de optimización desbloqueadas ✓
            </p>
        </div>
    </SlideLayout>
);

export default A3S04;
