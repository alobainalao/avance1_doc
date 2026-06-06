import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide05 = ({ theme = 'dark' }) => (
    <SlideLayout title="Áreas de oportunidad de la implementación MEF-FeniCS" theme={theme}>
        <p className="sl-body">
            A pesar de su robustez, la implementación MEF presenta:
        </p>
        <ul className="sl-bullet-list">
            <li>Alto costo computacional en mallas finas</li>
            <li>Re-mallado costoso en dominios variables</li>
            <li>Dificultad para paralelización eficiente</li>
            <li>Escalabilidad limitada en simulaciones transitorias largas</li>
        </ul>
        <div className="sl-spacer" />
        <p className="sl-body">
            <strong style={{ color: 'var(--sl-accent)' }}>Motivación:</strong>{' '}
            buscar un método más eficiente y flexible.
        </p>
    </SlideLayout>
);

export default Slide05;
