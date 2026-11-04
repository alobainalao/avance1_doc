import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col, Titulo } from './ui.jsx';

const hechos = [
    'Modelo sin sumidero explícito: fC se cancela y queda −S_s∂ₜh·C; adjunto y gradientes re-deducidos del Lagrangiano.',
    'Salida libre (componente normal de ∂ₙu = 0) implementada en BFR y FEniCSx; el vector completo no cierra el problema.',
    'Gradiente adjunto verificado: FEniCSx (3 modelos, 10⁻¹⁰–10⁻⁷) y BFR exacto (10⁻⁵–10⁻⁷, cierre libre).',
    'Mismo modelo, malla, fuente y decaimiento en los dos backends; el directo BFR–FEniCSx se compara en los 3 modelos.',
    'Banco 1D independiente: el adjunto continuo, con su fuente de almacenamiento, converge O(h).',
];
const siguientes = [
    ['Dic 26', 'Verificar el gradiente en configuración tipo main (pluma en el pozo) y BFR con otros cierres'],
    ['Dic 26', 'Decidir D2, D4, D5, D6, D7 (almacenamiento, C_in, núcleos, funcional, fila pfs)'],
    ['Ene 27', 'Optimización con el modelo nuevo (nitrato, J normalizado) en ambos backends'],
    ['Ene 27', 'Tesis y artículo con el modelo sin sumidero (rama sin-sumidero)'],
];

export default function A3N22({ theme = 'dark' }) {
    return (
        <SlideLayout title="Conclusiones y próximos pasos" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <Titulo>Conclusiones</Titulo>
                    {hechos.map((t, i) => <Punto key={i} color="#4ade80" size={21}>✅ {t}</Punto>)}
                </Col>
                <Col flex={4}>
                    <Titulo>Próximos pasos</Titulo>
                    {siguientes.map(([m, t], i) => (
                        <Punto key={i} color="#60a5fa" size={20}><b style={{ color: '#60a5fa' }}>{m}</b> · {t}</Punto>
                    ))}
                </Col>
            </Cols>
        </SlideLayout>
    );
}
