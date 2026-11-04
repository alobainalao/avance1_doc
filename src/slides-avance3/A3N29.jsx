import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

// Estados adjuntos del modelo nuevo con la configuración final (grupo M_adjunto): rejilla modelos × BFR | FEniCSx | diferencia.
const AdjVideo = ({ campo, titulo, theme = 'dark' }) => (
    <SlideLayout title={titulo} theme={theme} justify="flex-start" className="slide-layout--wide">
        <video autoPlay loop muted playsInline src={`${B}/videos/sin-sumidero/adjunto/grid3_${campo}.mp4`}
               style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
        <p style={{ margin: 0, color: 'var(--sl-muted)', fontSize: 18 }}>
            Convención del código (L = J − ψ·R); el documento usa ψ = −ψ_código/Δt. Se muestran los modelos con corrida de adjunto terminada.
        </p>
    </SlideLayout>
);
export const A3N29 = (p) => <AdjVideo campo="adj_C" titulo="Estado adjunto ψ_C(x,z,t) — modelo nuevo, BFR vs FEniCSx" {...p} />;
export const A3N30 = (p) => <AdjVideo campo="adj_H" titulo="Estado adjunto ψ_h(x,z,t) — modelo nuevo, BFR vs FEniCSx" {...p} />;
