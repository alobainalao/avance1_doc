import React from 'react';
import SlideLayout from './SlideLayout.jsx';
import './ScientificLayout.css';

/**
 * ScientificLayout — slide para contenido matemático/científico.
 *
 * Props:
 *   title    — título de la slide (string)
 *   theme    — 'dark' | 'light'
 *   children — ecuaciones, figuras, texto científico
 *   align    — 'center' | 'left' | 'top-center'
 *              · 'center'      → centrado vertical y horizontal
 *              · 'left'        → alineado a la izquierda, centrado vertical
 *              · 'top-center'  → centrado horizontal, pegado arriba
 */
const ScientificLayout = ({ title, theme = 'dark', children, align = 'center' }) => (
    <SlideLayout title={title} theme={theme} className={`scientific-layout scientific-layout--${align}`}>
        <div className="scientific-layout__body">
            {children}
        </div>
    </SlideLayout>
);

export default ScientificLayout;
