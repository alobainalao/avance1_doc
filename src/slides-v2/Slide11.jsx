import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide11 = ({ theme = 'dark' }) => (
    <SlideLayout title="Objetivos del semestre" theme={theme}>
        <p className="sl-heading">Objetivo general:</p>
        <p className="sl-body">
            Desarrollar e implementar un modelo acoplado de flujo y transporte con
            transferencia de masa multitasa, y formular un problema de optimización
            asociado al modelo de la maestría.
        </p>
        <p className="sl-heading">Objetivos específicos:</p>
        <ul className="sl-bullet-list">
            <li>
                Implementar el modelo MRMT acoplado en diferencias finitas con funciones
                de bases radiales (DF-RBF)
            </li>
            <li>Validar el modelo frente al caso base (modelo de maestría)</li>
            <li>
                Analizar el impacto de los términos de transferencia β<sub>i</sub>
            </li>
            <li>Definir una primera formulación del problema de optimización</li>
        </ul>
    </SlideLayout>
);

export default Slide11;
