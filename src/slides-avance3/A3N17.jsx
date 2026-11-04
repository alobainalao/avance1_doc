import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

const pasos = [
    'x₀ ← Π(x₀); (J₀, g₀) ← EvalJG(x₀); d₀ ← −g₀',
    'si ‖x_k − Π(x_k − g_k)‖ < ε: devolver x_k   (gradiente proyectado)',
    'Armijo sobre el punto proyectado: x⁺ = Π(x_k + αd_k), aceptar si J(x⁺) ≤ J_k + c g_kᵀ(x⁺ − x_k)',
    'x_{k+1} ← x⁺  (el mismo punto que superó el test); (J, g) ← EvalJG(x_{k+1})',
    'β_k = max{0, g_{k+1}ᵀ(g_{k+1} − g_k)/‖g_k‖²};  d_{k+1} = −g_{k+1} + β_k d_k;  reinicio si g·d ≥ 0',
];

export default function A3N17({ theme = 'dark' }) {
    return (
        <SlideLayout title="Algoritmos: gradiente conjugado proyectado y trust-constr" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <Titulo>Polak–Ribière⁺ con Armijo proyectado (esquema teórico)</Titulo>
                    {pasos.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 6, padding: '8px 12px' }}>
                            <span style={{ color: '#00d8ff', fontWeight: 700, fontSize: 22 }}>{i + 1}</span>
                            <span style={{ color: 'var(--sl-text)', fontSize: 20, fontFamily: 'monospace', lineHeight: 1.4 }}>{t}</span>
                        </div>
                    ))}
                </Col>
                <Col flex={4}>
                    <Titulo>Alcance</Titulo>
                    <Punto color="#f87171" size={20}>El test de Armijo evalúa el mismo punto que se acepta (corrige la versión que evaluaba <InlineMath math="x_k+\alpha d_k" /> y aceptaba su proyección).</Punto>
                    <Punto color="#fb923c" size={20}>PR⁺ + Armijo no tiene garantía global; la proyección rompe la conjugación; escalas de <InlineMath math="Q_n" /> y <InlineMath math="z_p" /> muy distintas.</Punto>
                    <Punto color="#4ade80" size={20}>Los experimentos usan <b>trust-constr</b> (SciPy) con el mismo gradiente adjunto, cotas y restricción de suministro; parada por <code>gtol</code> sobre <InlineMath math="\hat J/J_{\rm scale}" />.</Punto>
                    <Punto color="#60a5fa" size={20}>Costo: un barrido directo y uno adjunto por <code>EvalJG</code>, independiente del número de controles.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
