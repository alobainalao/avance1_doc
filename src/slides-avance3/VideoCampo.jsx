import React, { useState } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { SelectorModelo } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

const B = process.env.PUBLIC_URL;

// Video de comparación BFR | FEniCSx | diferencia del campo elegido, para cada modelo (grupo M_modelo_nuevo).
export default function VideoCampo({ campo, titulo, theme = 'dark' }) {
    const [id, setId] = useState(MODELOS[0].id);
    return (
        <SlideLayout title={titulo} theme={theme} justify="flex-start" className="slide-layout--wide">
            <SelectorModelo modelos={MODELOS} valor={id} onChange={setId} />
            <video key={id + campo} autoPlay loop muted playsInline
                   src={`${B}/videos/sin-sumidero/${id}/${campo}.mp4`}
                   style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
        </SlideLayout>
    );
}
export const A3N26 = (p) => <VideoCampo campo="H" titulo="Carga hidráulica H(x,z,t) [m] — BFR vs FEniCSx, modelo nuevo" {...p} />;
export const A3N27 = (p) => <VideoCampo campo="V" titulo="Velocidad de Darcy |u|(x,z,t) — BFR vs FEniCSx, modelo nuevo" {...p} />;
export const A3N28 = (p) => <VideoCampo campo="C" titulo="Concentración C(x,z,t) — BFR vs FEniCSx, modelo nuevo" {...p} />;
