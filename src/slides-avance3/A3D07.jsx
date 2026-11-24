import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo, suave } from './anim.js';

// Por qué no diferencias finitas: resoluciones del modelo EDP por iteración (un gradiente, 73 controles) además de la
// directa que da Ĵ(u), que ambos métodos necesitan: diferencias hacia adelante, una por control; adjunto, una. Dilema
// del paso η.
const N = 73;
const eqCadena = String.raw`\frac{d\hat J}{d\mathbf u}=\frac{\partial J}{\partial\mathbf u}+\frac{\partial J}{\partial\mathbf y}\,\textcolor{#C4511F}{\frac{d\mathbf y}{d\mathbf u}}`;
const eqFD = String.raw`\frac{\partial\hat J}{\partial u_i}\approx\frac{\hat J(\mathbf u+\eta\,\mathbf e_i)-\hat J(\mathbf u)}{\eta}
+\mathcal O(\eta)+\mathcal O(\delta/\eta)`;

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
    // Esquema (no medido): error de truncamiento ∝ η y de redondeo ∝ δ/η en escala log-log.
    const W = 380, H = 230, L = 34, B = 30;
    const xs = Array.from({ length: 60 }, (_, i) => -8 + i * 7.5 / 59);   // log10 η
    const err = l => Math.log10(Math.pow(10, l) + 1e-10 / Math.pow(10, l));
    const sx = l => L + (l + 8) / 7.5 * (W - L - 10), sy = e => 10 + (0 - e) / 6 * (H - B - 10);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <line x1={L} x2={W - 10} y1={H - B} y2={H - B} stroke="#6E7F8D" />
            <line x1={L} x2={L} y1={10} y2={H - B} stroke="#6E7F8D" />
            <polyline points={xs.map(l => `${sx(l)},${sy(err(l))}`).join(' ')} fill="none" stroke="#C4511F" strokeWidth="3" />
            <text x={W / 2} y={H - 8} textAnchor="middle" style={eje}>log η</text>
            <text x={L + 6} y={22} style={eje}>log error</text>
            <text x={sx(-7.2)} y={sy(err(-7.2)) - 10} style={eje}>redondeo</text>
            <text x={sx(-1.8) - 10} y={sy(err(-1.8)) - 6} textAnchor="end" style={eje}>truncamiento</text>
        </svg>
    );
}

export default function A3D07({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(4200, 400);
    const k = Math.round(suave(tramo(p, 0.1, 1)) * N);
    return (
        <SlideLayout title="El gradiente: ¿por qué no diferencias finitas?" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 40 }}>
                <div>
                    <Eq math={eqCadena} id="cadena" compacta />
                    <p style={txt}>
                        La sensibilidad <InlineMath math="d\mathbf y/d\mathbf u" /> del estado exige una EDP linealizada por cada
                        dirección de control: 73 problemas por gradiente. Diferencias finitas hace lo mismo, sin linealizar, con una
                        resolución del modelo por control:
                    </p>
                    <Eq math={eqFD} id="fd" compacta />
                    <p style={txt}>
                        Con <InlineMath math="\eta" /> grande domina el truncamiento; con <InlineMath math="\eta" /> pequeño, la
                        tolerancia <InlineMath math="\delta" /> de los solucionadores. No hay un paso que sirva para las 73 componentes a la vez.
                    </p>
                    <div style={{ width: 380 }}><Dilema /></div>
                </div>
                <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                    <p style={tit}>Resoluciones del modelo EDP por iteración</p>
                    <p style={sub}>
                        Cada cuadro: el modelo completo (flujo + transporte en todo <InlineMath math="[0,T]" />) resuelto una vez. Las
                        dos opciones necesitan además la resolución directa que da <InlineMath math="\hat J(\mathbf u)" />.
                    </p>
                    <p style={sub}>Diferencias finitas hacia adelante: una por control</p>
                    <Bloques n={N} lleno={k} color="#C4511F" />
                    <p style={{ ...num, color: '#C4511F' }}>{k} <span style={uni}>resoluciones</span></p>
                    <p style={{ ...sub, marginTop: 26 }}>Método adjunto: una resolución adjunta, hacia atrás en el tiempo</p>
                    <Bloques n={1} lleno={Math.min(1, k)} color="#2E7D4F" />
                    <p style={{ ...num, color: '#2E7D4F' }}>{Math.min(1, k)} <span style={uni}>resolución</span></p>
                    <p style={{ ...sub, marginTop: 18 }}>
                        Por iteración: 1 + 73 = 74 frente a 1 + 1 = 2 (con diferencias centradas serían 1 + 146). Con más controles la
                        cuenta de diferencias finitas crece; la del adjunto no.
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
const uni = { fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-muted)' };
