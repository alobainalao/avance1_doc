import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

// Banco 1D independiente del simulador (tests/banco1d/runp1.py, runp1_extra.py; reejecutado el 4 nov 2026).
const N = [100, 200, 400];
const SERIES = [
    { n: 'ADR, S_s=1',        c: '#2E7D4F', v: [2.61e-3, 1.30e-3, 6.47e-4] },
    { n: 'ADR, S_s=4',        c: '#0F7A85', v: [9.31e-3, 4.62e-3, 2.31e-3] },
    { n: 'MRMT N_r=2',        c: '#C4511F', v: [3.07e-3, 1.55e-3, 7.70e-4] },
    { n: 'sin fuente −S_s∂ₜ(Cψ)', c: '#C4511F', v: [8.19e-1, 8.33e-1, 8.33e-1] },
];
const W = 560, H = 360, PX = 70, PY = 30;
const ex = (n) => PX + (Math.log(n) - Math.log(100)) / (Math.log(400) - Math.log(100)) * (W - PX - 30);
const ey = (v) => PY + (Math.log10(1) - Math.log10(v)) / (Math.log10(1) - Math.log10(3e-4)) * (H - PY - 50);

export default function A3N18({ theme = 'dark' }) {
    return (
        <SlideLayout title="Banco 1D independiente: adjunto continuo vs diferencias finitas" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '100%' }}>
                        {[1, 1e-1, 1e-2, 1e-3].map(t => (
                            <g key={t}>
                                <line x1={PX} x2={W - 30} y1={ey(t)} y2={ey(t)} stroke="rgba(0,216,255,0.15)" />
                                <text x={PX - 8} y={ey(t) + 5} textAnchor="end" fill="#94a3b8" fontSize="14">{t.toExponential(0)}</text>
                            </g>
                        ))}
                        {N.map(n => (
                            <text key={n} x={ex(n)} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="14">n={n}</text>
                        ))}
                        {SERIES.map(s => (
                            <g key={s.n}>
                                <polyline fill="none" stroke={s.c} strokeWidth="3" points={N.map((n, i) => `${ex(n)},${ey(s.v[i])}`).join(' ')} />
                                {N.map((n, i) => <circle key={n} cx={ex(n)} cy={ey(s.v[i])} r="5" fill={s.c} />)}
                            </g>
                        ))}
                        <text x={W / 2} y={H - 2} textAnchor="middle" fill="#94a3b8" fontSize="13">error relativo del gradiente en Q (escala log)</text>
                    </svg>
                    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                        {SERIES.map(s => <span key={s.n} style={{ color: s.c, fontSize: 19, fontWeight: 700 }}>● {s.n}</span>)}
                    </div>
                </Col>
                <Col flex={4}>
                    <Titulo>Lectura</Titulo>
                    <Punto color="#2E7D4F" size={20}>El error decrece como O(h) con la malla; con ∂ₜh = 0 coincide a 10⁻⁹.</Punto>
                    <Punto color="#C4511F" size={20}>Sin la fuente del almacenamiento el error es 0.8–1.6: la prueba discrimina.</Punto>
                    <Punto color="#0F7A85" size={20}>Gradiente en x_p (análogo de z_p): 5·10⁻⁴–1·10⁻³ y <b>no decrece</b> con n; muy sensible al paso de diferencias finitas.</Punto>
                    <Punto color="#0F7A85" size={20}>Forma conservativa vs no conservativa (P1): coinciden a 10⁻¹²–10⁻¹³; confirma el signo de −S_s∂ₜh·C.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
