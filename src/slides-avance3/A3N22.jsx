import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

const hechos = [
    'Modelo sin sumidero explícito: fC se cancela y queda −S_s∂ₜh·C; adjunto y gradientes re-deducidos del Lagrangiano.',
    'Salida libre (componente normal de ∂ₙu = 0) implementada en BFR y FEniCSx; el vector completo no cierra el problema.',
    'Gradiente adjunto verificado: FEniCSx (3 modelos, 10⁻¹⁰–10⁻⁷) y BFR exacto (10⁻⁵–10⁻⁷, cierre libre).',
    'Mismo modelo, malla refinada, fuente y decaimiento en los dos backends; directo BFR–FEniCSx: C 5 %, |u| 15 %, masa 0.1 % (3 modelos).',
    'Banco 1D independiente: el adjunto continuo, con su fuente de almacenamiento, converge O(h).',
    'Óptimo ADR (nitrato, malla compartida): cubre la demanda, pozo a −200 m, C captada ≈ 27 mg/L < 50 mg/L; MRMT semi da el mismo óptimo.',
];
const siguientes = [
    ['Dic 26', 'Verificar el gradiente en configuración tipo main (pluma en el pozo)'],
    ['Dic 26', 'Cerrar almacenamiento (S_s), C de entrada, núcleos del pozo y forma final del funcional'],
    ['Ene 27', 'Optimización MRMT bloque y barrido de γ (frente de Pareto) desde un punto admisible'],
    ['Ene 27', 'Revisión de la tesis y del artículo actualizados al modelo sin sumidero'],
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
