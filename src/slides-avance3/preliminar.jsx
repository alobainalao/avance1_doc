import React from 'react';
import { ESTADOS, Marca } from './estado.jsx';

// Aviso común de las láminas de resultados de optimización (A3D14, A3D15, A3D19, A3D25): todas muestran la serie anterior
// (malla con eje de 1 m, γ = 1, z_p⁰ = −700 m, demanda tomada a mitad de cada paso) mientras corre la serie 33. Al reexportar
// optimoNitrato.js desde la serie 33 basta con cambiar SERIE (o quitar el aviso si ya hay óptimos con χ < 10⁻⁴).
export const SERIE = {
    etiqueta: 'serie anterior',
    detalle: 'z_p⁰ = −700 m, demanda tomada a mitad de cada paso',
    reemplazo: 'se reemplaza con la serie 33',
};

// `children`: precisión propia de la lámina (solo en la completa si se marca con a3-completa)
export function AvisoPreliminar({ children, style }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)',
                      color: 'var(--sl-muted)', lineHeight: 1.3, ...style }}>
            <Marca e="pre" size={16} />
            <span>
                <b style={{ color: ESTADOS.pre.c, fontWeight: 600 }}>Preliminar · {SERIE.etiqueta}</b>
                <span className="a3-completa"> ({SERIE.detalle})</span>
                {children}
                <span> · {SERIE.reemplazo}</span>
            </span>
        </div>
    );
}
