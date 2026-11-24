import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

// Conclusiones del avance (resultados preliminares) y próximos pasos con plazos tentativos por semestre.
const hechos = [
    'Modelo de flujo y transporte sin sumidero explícito, con almacenamiento y salida libre, en ADR y MRMT (semi y bloque).',
    'Dos discretizaciones, RBF-FD y elementos finitos, sobre la misma malla: en el problema directo difieren 3 % en C y 12.5 % en |u|.',
    'Gradiente por el método adjunto verificado contra diferencias finitas en las seis variantes. El adjunto RBF-FD todavía cambia con la malla (25–36 % en ψ_C); el de elementos finitos, 3–10 %.',
    'La malla cerca del pozo importa: con h ≈ 4.9 m en su eje, Ĵ(zₚ) tenía mínimos espurios; con 1 m desaparecen.',
    'Primeros óptimos con elementos finitos (γ = 1), aún sin convergencia completa (χ entre 10⁻³ y 10⁻², meta 10⁻⁴): el pozo sube de −700 m a cerca de −383 m (ADR) y −405 m (MRMT semi); MRMT bloque todavía no tiene un óptimo confiable.',
    'Con estos parámetros MRMT se comporta casi como ADR retardado: retiene el nitrato y pide un pozo unos 20 m más hondo.',
];
const siguientes = [
    ['En curso', 'Terminar las tres optimizaciones con elementos finitos hasta χ ≤ 10⁻⁴ (reanudadas con iterados admisibles)'],
    ['Semestre 4', 'Frente de Pareto (barrido de γ) y varios arranques para ver si el óptimo es único'],
    ['Semestre 4', 'Entender la dependencia del adjunto RBF-FD con la malla antes de optimizar con RBF-FD'],
    ['Semestre 4–5', 'Revisar y reescribir a fondo los capítulos; Cap. IV con los resultados convergidos'],
    ['Semestre 5', 'Artículo de optimización: enviarlo cuando los resultados estén cerrados'],
];

export default function A3N22({ theme = 'dark' }) {
    return (
        <SlideLayout title="Conclusiones y próximos pasos" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <Titulo>Lo que hay (preliminar)</Titulo>
                    {hechos.map((t, i) => <Punto key={i} color="var(--a3-valido)" size={21}>{t}</Punto>)}
                </Col>
                <Col flex={4}>
                    <Titulo>Próximos pasos (plazos tentativos)</Titulo>
                    {siguientes.map(([m, t], i) => (
                        <Punto key={i} color="var(--a3-agua)" size={20}><b style={{ color: 'var(--a3-agua)' }}>{m}</b> · {t}</Punto>
                    ))}
                </Col>
            </Cols>
        </SlideLayout>
    );
}
