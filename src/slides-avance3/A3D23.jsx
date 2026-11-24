import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

// Supuestos del modelo y limitaciones de los resultados actuales (lo que el comité debe leer junto con los óptimos).
const M = (t) => <InlineMath math={t} />;
const supuestos = [
    <>Corte vertical 2D: propiedades homogéneas en la dirección transversal; el caudal es por metro de ancho (m²/s).</>,
    <>Porosidad interpolada de 4 sondeos (16 capas); conductividad por Kozeny–Carman con un solo tamaño de grano.</>,
    <>{M('S_s=\\phi')}: elección numérica provisional, mucho mayor que los valores típicos de campo.</>,
    <>Pesos {M('\\gamma=\\alpha=\\beta=1')} tras normalizar: el óptimo depende de ellos (frente de Pareto pendiente).</>,
    <>Con los parámetros MRMT usados (3 regiones, {M('\\tau_r')} de 4 a 14 h) MRMT se parece a ADR retardado.</>,
];
const limitaciones = [
    <>Optimización solo con elementos finitos: el adjunto RBF-FD todavía cambia 25–36 % con la malla ({M('\\psi_C')}).</>,
    <>Óptimos preliminares: {M('\\chi')} entre 10⁻³ y 10⁻² frente a la meta 10⁻⁴; las corridas siguen.</>,
    <>{M('\\Delta t=10')} h en la optimización es mayor que el tiempo de intercambio más rápido de MRMT (≈ 4 h); su efecto no se ha medido.</>,
    <>El gradiente se verificó en un horizonte corto (3 pasos) y mallas de prueba, no en el problema completo.</>,
    <>trust-constr evalúa puntos fuera de {M('\\mathcal U_{ad}')} mientras busca; solo el resultado final es admisible.</>,
];
// versión pública: una línea por viñeta (null = solo en la completa)
const supuestosPub = [
    <>Corte vertical 2D; caudal por metro de ancho (m²/s).</>,
    <>Porosidad de 4 sondeos; conductividad por Kozeny–Carman.</>,
    <>{M('S_s=\\phi')}: provisional, mucho mayor que en campo.</>,
    <>Pesos {M('\\gamma=\\alpha=\\beta=1')}: el óptimo depende de ellos.</>,
    <>MRMT ({M('\\tau_r')} de 4 a 14 h) ≈ ADR retardado.</>,
];
const limitacionesPub = [
    <>Solo elementos finitos: el adjunto RBF-FD cambia con la malla.</>,
    <>Óptimos preliminares: {M('\\chi')} entre 10⁻³ y 10⁻² (meta 10⁻⁴).</>,
    <>{M('\\Delta t=10')} h, mayor que el intercambio MRMT más rápido (≈ 4 h).</>,
    <>Gradiente verificado solo en horizonte corto y mallas de prueba.</>,
    null,
];

export default function A3D23({ theme = 'dark' }) {
    return (
        <SlideLayout title="Supuestos y limitaciones" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={1}>
                    <Titulo>Supuestos del modelo</Titulo>
                    {supuestos.map((t, i) => (
                        <Punto key={i} color="var(--a3-agua)" size={20}>
                            <span className="a3-completa">{t}</span><span className="a3-publica">{supuestosPub[i]}</span>
                        </Punto>
                    ))}
                </Col>
                <Col flex={1}>
                    <Titulo>Limitaciones de los resultados actuales</Titulo>
                    {limitaciones.map((t, i) => (limitacionesPub[i]
                        ? <Punto key={i} color="var(--a3-pluma)" size={20}>
                              <span className="a3-completa">{t}</span><span className="a3-publica">{limitacionesPub[i]}</span>
                          </Punto>
                        : <div key={i} className="a3-completa"><Punto color="var(--a3-pluma)" size={20}>{t}</Punto></div>))}
                </Col>
            </Cols>
        </SlideLayout>
    );
}
