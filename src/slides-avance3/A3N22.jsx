import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

const hechos = [
    'Modelo coherente: sin sumidero explícito (fC se cancela), con almacenamiento −S_s∂ₜh·C y salida libre en Γ_out.',
    'Seis implementaciones (ADR, MRMT semi y bloque × RBF-FD y elementos finitos) sobre la misma malla con conos: C 3 %, |u| 12.5 %, masa 0.12 %.',
    'Gradiente por el método adjunto: una simulación directa y una adjunta frente a 146 por diferencias finitas.',
    'Gradiente verificado en las seis: redondeo en elementos finitos (10⁻¹⁰–10⁻⁷); en RBF-FD el error decrece como O(ε²).',
    'Optimización con γ = 1 en los tres modelos: el pozo sube de −700 m a −441 (ADR), −419 (MRMT semi) y −469 m (MRMT bloque), con el mismo caudal medio y respetando bomba y tanque.',
    'Los cinco estados adjuntos (ψ_h, ψ_C y ψ_im de tres regiones) tienen la misma escala y forma en RBF-FD y en elementos finitos.',
];
const siguientes = [
    ['Dic 26', 'Barrido de γ (frente de Pareto) y unicidad del óptimo desde varios arranques'],
    ['Dic 26', 'Optimización con BFR sobre la misma malla y comparación con elementos finitos'],
    ['Dic 26', 'Tesis y artículo con los resultados de optimización de γ = 1'],
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
