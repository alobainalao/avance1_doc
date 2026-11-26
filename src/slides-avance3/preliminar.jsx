import React from 'react';
import { ESTADOS, Marca } from './estado.jsx';
import { OPT } from './optimoNitrato.js';

// Aviso común de las láminas de resultados de optimización (A3D14, A3D15, A3D25): muestran la serie 33 (malla con eje de 1 m,
// γ = 1, z_p⁰ = −600 m, demanda promediada por paso) en su iterado de corte (OPT.serie.nit, tope de 50 iteraciones del 25-nov),
// sin certificado KKT, mientras corren las pruebas de consistencia. Quitar el aviso si se llega a óptimos con χ < 10⁻⁴.
export const SERIE = {
    etiqueta: `serie 33, iterado ${(OPT.serie && OPT.serie.nit) || 50}`,
    detalle: 'z_p⁰ = −600 m, demanda promediada',
    reemplazo: 'consistencia en curso',
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
