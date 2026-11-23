import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

const hechos = [
    'Modelo coherente: sin sumidero explícito (fC se cancela), con almacenamiento −S_s∂ₜh·C y salida libre en Γ_out.',
    'Seis implementaciones (ADR, MRMT semi y bloque × RBF-FD y elementos finitos) sobre la misma malla con conos: C 3 %, |u| 12.5 %, masa 0.12 %.',
    'Gradiente por el método adjunto (una simulación directa y una adjunta frente a 146 por diferencias finitas), verificado en las seis: redondeo en elementos finitos, O(ε²) en RBF-FD.',
    'Ĵ(zₚ) tenía mínimos espurios por la malla del eje del pozo (h ≈ 4.9 m frente a un núcleo de 6.7 m); con el eje a 1 m la respuesta es monótona.',
    'Optimización con γ = 1 (elementos finitos): el pozo sube de −700 m a −383 (ADR) y −405 m (MRMT semi), con el mismo caudal medio y respetando bomba y tanque; MRMT bloque paró en −394 m, antes de su óptimo.',
    'MRMT pide un pozo unos 20 m más hondo: retiene el nitrato y Jₘ es 6 % mayor a cualquier profundidad.',
    'Los cinco estados adjuntos (ψ_h, ψ_C y ψ_im de tres regiones) tienen la misma escala y forma en RBF-FD y en elementos finitos.',
];
const siguientes = [
    ['Dic 26', 'Reanudar las optimizaciones hasta χ ≤ 10⁻⁴ (bloque desde el punto de semi)'],
    ['Dic 26', 'Optimización RBF-FD en la malla con eje (su adjunto aún depende de la malla) y comparación con elementos finitos'],
    ['Ene 27', 'Frente de Pareto (barrido de γ) y unicidad del óptimo desde varios arranques'],
    ['Ene 27', 'Cap. IV y artículo con los resultados de γ = 1; envío del artículo'],
];

export default function A3N22({ theme = 'dark' }) {
    return (
        <SlideLayout title="Conclusiones y próximos pasos" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <Titulo>Conclusiones</Titulo>
                    {hechos.map((t, i) => <Punto key={i} color="#2E7D4F" size={21}>{t}</Punto>)}
                </Col>
                <Col flex={4}>
                    <Titulo>Próximos pasos</Titulo>
                    {siguientes.map(([m, t], i) => (
                        <Punto key={i} color="#0F7A85" size={20}><b style={{ color: '#0F7A85' }}>{m}</b> · {t}</Punto>
                    ))}
                </Col>
            </Cols>
        </SlideLayout>
    );
}
