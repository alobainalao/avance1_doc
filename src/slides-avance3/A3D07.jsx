import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo, suave } from './anim.js';

// Por qué no diferencias finitas: costo por gradiente (73 controles) y dilema del paso ε.
// Tiempos: optimización ADR γ = 1 con FEniCSx en la malla con conos, 35 evaluaciones + 30 adjuntos en ≈ 2 h 40 min,
// es decir ≈ 2.4 min por simulación (directa o adjunta).
const N = 73, MIN = 2.4;
const eqCadena = String.raw`\frac{d\hat J}{d\mathbf u}=\frac{\partial J}{\partial\mathbf u}+\frac{\partial J}{\partial\mathbf y}\,\textcolor{#C4511F}{\frac{d\mathbf y}{d\mathbf u}}`;
const eqFD = String.raw`\frac{\partial\hat J}{\partial u_i}\approx\frac{\hat J(\mathbf u+\varepsilon\mathbf e_i)-\hat J(\mathbf u-\varepsilon\mathbf e_i)}{2\varepsilon}
+\mathcal O(\varepsilon^2)+\mathcal O(\delta/\varepsilon)`;

function Bloques({ n, lleno, color, cols = 25 }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 14px)`, gap: 4 }}>
            {Array.from({ length: n }, (_, k) => (
                <span key={k} style={{ width: 14, height: 14, borderRadius: 2, border: `1.5px solid ${color}`,
                                       background: k < lleno ? color : 'transparent' }} />
            ))}
        </div>
    );
}

function Dilema() {
    // Esquema (no medido): error de truncamiento ∝ ε² y de redondeo ∝ δ/ε en escala log-log.
    const W = 380, H = 230, L = 34, B = 30;
    const xs = Array.from({ length: 60 }, (_, i) => -8 + i * 7.5 / 59);   // log10 ε
    const err = l => Math.log10(Math.pow(10, 2 * l) + 1e-12 / Math.pow(10, l));
    const sx = l => L + (l + 8) / 7.5 * (W - L - 10), sy = e => 10 + (2 - e) / 14 * (H - B - 10);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <line x1={L} x2={W - 10} y1={H - B} y2={H - B} stroke="#6E7F8D" />
            <line x1={L} x2={L} y1={10} y2={H - B} stroke="#6E7F8D" />
            <polyline points={xs.map(l => `${sx(l)},${sy(err(l))}`).join(' ')} fill="none" stroke="#C4511F" strokeWidth="3" />
            <text x={W / 2} y={H - 8} textAnchor="middle" style={eje}>log ε</text>
            <text x={L + 6} y={22} style={eje}>log error</text>
            <text x={sx(-7.2)} y={sy(err(-7.2)) - 10} style={eje}>redondeo</text>
            <text x={sx(-1.2)} y={sy(err(-1.2)) + 26} textAnchor="end" style={eje}>truncamiento</text>
        </svg>
    );
}

export default function A3D07({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(4200, 400);
    const k = Math.round(suave(tramo(p, 0.1, 1)) * 2 * N);
    return (
        <SlideLayout title="El gradiente: ¿por qué no diferencias finitas?" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 40 }}>
                <div>
                    <Eq math={eqCadena} id="cadena" compacta />
                    <p style={txt}>
                        La sensibilidad <InlineMath math="d\mathbf y/d\mathbf u" /> del estado exige una EDP linealizada por cada
                        dirección de control: 73 problemas por gradiente. Diferencias finitas hace lo mismo, sin linealizar:
                    </p>
                    <Eq math={eqFD} id="fd" compacta />
                    <p style={txt}>
                        Con <InlineMath math="\varepsilon" /> grande domina el truncamiento; con <InlineMath math="\varepsilon" /> pequeño, la
                        tolerancia <InlineMath math="\delta" /> de los solucionadores. No hay un paso que sirva para las 73 componentes a la vez.
                    </p>
                    <div style={{ width: 380 }}><Dilema /></div>
                </div>
                <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                    <p style={tit}>Simulaciones por gradiente</p>
                    <p style={sub}>Diferencias centradas: 2 × 73 = 146</p>
                    <Bloques n={2 * N} lleno={k} color="#C4511F" />
                    <p style={{ ...num, color: '#C4511F' }}>≈ {(k * MIN / 60).toFixed(1)} h</p>
                    <p style={{ ...sub, marginTop: 26 }}>Método adjunto: 1 directa + 1 adjunta</p>
                    <Bloques n={2} lleno={Math.min(2, k)} color="#2E7D4F" />
                    <p style={{ ...num, color: '#2E7D4F' }}>≈ {(Math.min(2, k) * MIN).toFixed(0)} min</p>
                    <p style={{ ...sub, marginTop: 18 }}>
                        Una optimización usa unos 30 gradientes: más de una semana con diferencias finitas, unas 2.5 h con el adjunto.
                        Tiempos de la corrida ADR (elementos finitos, 20 348 nodos).
                    </p>
                </div>
            </div>
        </SlideLayout>
    );
}

A3D07.ecuaciones = ['cadena', 'fd'];

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const txt = { margin: '6px 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 };
const tit = { margin: '0 0 6px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' };
const sub = { margin: '0 0 8px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const num = { margin: '8px 0 0', fontSize: 34, fontVariantNumeric: 'tabular-nums' };
