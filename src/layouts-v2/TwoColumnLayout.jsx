import React from 'react';
import SlideLayout from './SlideLayout.jsx';
import './TwoColumnLayout.css';

/**
 * TwoColumnLayout — divide el área de contenido en dos columnas.
 *
 * Props:
 *   title       — título de la slide (string)
 *   theme       — 'dark' | 'light'
 *   left        — nodo React para la columna izquierda
 *   right       — nodo React para la columna derecha
 *   leftRatio   — fracción del ancho para la columna izquierda (default 1, right también 1 → 50/50)
 *   rightRatio  — fracción del ancho para la columna derecha (default 1)
 *   gap         — espacio entre columnas en CSS (default '4%')
 *   align       — 'flex-start' | 'center' | 'stretch' (alineación vertical)
 */
const TwoColumnLayout = ({
    title,
    theme = 'dark',
    left,
    right,
    leftRatio = 1,
    rightRatio = 1,
    gap = '4%',
    align = 'flex-start',
}) => (
    <SlideLayout title={title} theme={theme} className="two-col-layout">
        <div className="two-col__cols" style={{ gap, alignItems: align }}>
            <div className="two-col__col" style={{ flex: leftRatio }}>
                {left}
            </div>
            <div className="two-col__col" style={{ flex: rightRatio }}>
                {right}
            </div>
        </div>
    </SlideLayout>
);

export default TwoColumnLayout;
