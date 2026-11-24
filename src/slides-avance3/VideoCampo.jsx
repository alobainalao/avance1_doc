import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

// Grid 3 × 3 del campo en la malla con conos (codigo/scripts/animate_grid_3col.py sobre MC_malla_conos):
// filas ADR / MRMT semi / MRMT bloque; columnas BFR, FEniCSx y su diferencia.
export default function VideoCampo({ campo, titulo, nota, theme = 'dark' }) {
    return (
        <SlideLayout title={titulo} theme={theme} justify="flex-start" className="slide-layout--wide">
            <video key={campo} autoPlay loop muted playsInline src={`${B}/videos/sin-sumidero/conos/grid3_${campo}.mp4`}
                   style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
            <p style={{ margin: 0, color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)' }}>
                Malla con conos, caudal de referencia 0.3 m²/s, z<sub>p</sub> = −700 m, Δt = 5 h. Filas: ADR, MRMT semi, MRMT bloque; columnas: RBF-FD,
                elementos finitos, diferencia.{nota ? ` ${nota}` : ''}
            </p>
        </SlideLayout>
    );
}
export const A3N26 = (p) => <VideoCampo campo="H" titulo="Carga hidráulica h(x,z,t) [m] — RBF-FD frente a elementos finitos"
    nota="La carga no depende del modelo de transporte: las tres filas coinciden." {...p} />;
export const A3N27 = (p) => <VideoCampo campo="V" titulo="Velocidad de Darcy |u|(x,z,t) — RBF-FD frente a elementos finitos"
    nota="Como la carga, no depende del modelo de transporte." {...p} />;
export const A3N28 = (p) => <VideoCampo campo="C" titulo="Concentración C(x,z,t) — RBF-FD frente a elementos finitos"
    nota="C en unidades del modelo (es lineal en C); las láminas de optimización la expresan en mg/L de nitrato." {...p} />;
