import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Tabla } from './ui.jsx';

// Decisiones pendientes (docs/adjunto_sin_sumidero.pdf, §9; informe de auditoría).
const cols = [{ k: 'id', label: '' }, { k: 'd', label: 'Decisión' }, { k: 'e', label: 'Estado' }];
const rows = [
    { id: 'D1', d: 'Cierre de Γout', e: 'Resuelta: componente normal de ∂ₙu = 0 (cierre D); la tangencial no se impone', colors: { e: '#4ade80' } },
    { id: 'D2', d: 'Modelo de almacenamiento: φ constante con −S_s∂ₜh·C o ∂ₜφ = S_s∂ₜh; S_s = φ numérico', e: 'Pendiente', colors: { e: '#fb923c' } },
    { id: 'D3', d: 'Decaimiento λ_d: solo ADR', e: 'Resuelta (FEniCSx ya igual que BFR)', colors: { e: '#4ade80' } },
    { id: 'D4', d: 'Concentración de entrada C_in en Γin', e: 'Pendiente', colors: { e: '#fb923c' } },
    { id: 'D5', d: 'Núcleos: ϱ = g_ε o distintos (BFR usa Wendland en el flujo, FEniCSx gaussianos)', e: 'Pendiente', colors: { e: '#fb923c' } },
    { id: 'D6', d: 'Funcional: índice J_m o masa extraída; formalizar la restricción de suministro', e: 'Pendiente', colors: { e: '#fb923c' } },
    { id: 'D7', d: 'Fila "pfs" de BFR: intención y signo del término mixto', e: 'Pendiente (ya no es el defecto)', colors: { e: '#fb923c' } },
];

export default function A3N20({ theme = 'dark' }) {
    return (
        <SlideLayout title="Decisiones pendientes del autor" theme={theme} justify="flex-start">
            <Tabla cols={cols} rows={rows} size={21} />
        </SlideLayout>
    );
}
