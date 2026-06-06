import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide35 = ({ theme = 'dark' }) => (
    <SlideLayout title="Conclusiones" theme={theme}>
        <div className="sl-spacer" />
        <ul className="sl-bullet-list">
            <li>
                Implementamos un modelo MRMT orientado a representar heterogeneidad y
                fenómenos de tailing.
            </li>
            <li>
                La formulación matricial mediante reducción de Schur disminuye el tamaño
                efectivo del sistema acoplado.
            </li>
            <li>
                Formulamos un problema de optimización PDE-constrained para minimizar
                contaminación y costo energético.
            </li>
            <li>
                Formulamos el modelo adjunto asociado al problema de optimización.
            </li>
        </ul>
        <div className="sl-spacer" />
    </SlideLayout>
);

export default Slide35;
