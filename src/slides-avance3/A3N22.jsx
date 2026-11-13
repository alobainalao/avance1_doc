import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

const hechos = [
    'Modelo coherente: sin sumidero explícito (fC se cancela), con almacenamiento −S_s∂ₜh·C y salida libre en Γ_out.',
    'Seis implementaciones (ADR, MRMT semi y bloque × RBF-FD y elementos finitos) sobre la misma malla con conos: C 3 %, |u| 12.5 %, masa 0.12 %.',
    'Gradiente por el método adjunto: una simulación directa y una adjunta frente a 146 por diferencias finitas.',
    'Gradiente verificado en las seis: redondeo en elementos finitos (10⁻¹⁰–10⁻⁷); en RBF-FD el error decrece como O(ε²).',
    'Optimización ADR (γ = 1): el pozo sube de −700 a −441 m, el bombeo respeta bomba y tanque, y Ĵ baja de 0.467 a 0.459 desde un punto no admisible.',
];
const siguientes = [
    ['Nov 26', 'Optimización de MRMT semi y bloque con γ = 1 (en curso) y comparación con ADR'],
    ['Dic 26', 'Barrido de γ (frente de Pareto) y unicidad del óptimo desde varios arranques'],
    ['Dic 26', 'Optimización con BFR sobre la misma malla y comparación con elementos finitos'],
    ['Ene 27', 'Tesis y artículo con los resultados de optimización de γ = 1'],
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
