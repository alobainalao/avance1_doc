import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import './Slide27b.css';

const methods = [
    {
        key: 'gd',
        name: 'GD',
        full: 'Descenso del gradiente',
        tags: ['Orden 1', 'Sin Hessiano', 'O(n) memoria'],
        props: [
            { label: 'Convergencia', val: 'Lineal' },
            { label: 'Dirección',    val: 'Negativa del gradiente' },
            { label: 'Paso',         val: 'Búsqueda lineal' },
            { label: 'Costo/iter',   val: 'Bajo' },
        ],
        note: 'Lento en valles estrechos, oscila con mal condicionamiento.',
    },
    {
        key: 'newton',
        name: 'Newton',
        full: 'Método de Newton',
        tags: ['Orden 2', 'Requiere Hessiano', 'O(n²) memoria'],
        props: [
            { label: 'Convergencia', val: 'Cuadrática' },
            { label: 'Dirección',    val: 'H⁻¹ ∇J' },
            { label: 'Paso',         val: 'α = 1 (local)' },
            { label: 'Costo/iter',   val: 'Muy alto (PDE)' },
        ],
        note: 'Inviable: calcular y factorizar el Hessiano en PDE es prohibitivo.',
    },
    {
        key: 'lambert',
        name: 'Lambert',
        full: 'Método de Lambert',
        tags: ['Quasi-Newton', 'Hessiano aprox.', 'O(n·m) memoria'],
        props: [
            { label: 'Convergencia', val: 'Superlineal' },
            { label: 'Dirección',    val: 'B_k⁻¹ ∇J (BFGS)' },
            { label: 'Paso',         val: 'Búsqueda lineal' },
            { label: 'Costo/iter',   val: 'Moderado' },
        ],
        note: 'Aproxima el Hessiano; sensible a la escala del problema.',
    },
    {
        key: 'ngdc',
        name: 'NGDC',
        full: 'Gradiente conjugado no lineal',
        tags: ['Orden 1', 'Sin Hessiano', 'O(n) memoria'],
        props: [
            { label: 'Convergencia', val: 'Superlineal' },
            { label: 'Dirección',    val: 'Conjugada (Polak-Ribière)' },
            { label: 'Paso',         val: 'Búsqueda lineal' },
            { label: 'Costo/iter',   val: 'Bajo' },
        ],
        note: 'Adecuado para controles funcionales de alta dimensión.',
        selected: true,
    },
];

const Slide27b = ({ theme = 'dark' }) => (
    <SlideLayout title="Selección del método de optimización" theme={theme}>
        <p className="sl-body s27b-intro">
            Para minimizar <em>J</em>(<strong>u</strong>) sujeto al sistema PDE
            se consideraron los siguientes enfoques:
        </p>
        <div className="s27b-grid">
            {methods.map((m) => (
                <div
                    key={m.key}
                    className={`s27b-card${m.selected ? ' s27b-selected' : ''}`}
                >
                    {m.selected && (
                        <div className="s27b-badge">Método seleccionado</div>
                    )}
                    <div className="s27b-card-full">{m.full}</div>
                    <div className="s27b-tags">
                        {m.tags.map((t) => (
                            <span key={t} className="s27b-tag">{t}</span>
                        ))}
                    </div>
                    <div className="s27b-props">
                        {m.props.map((p) => (
                            <div key={p.label} className="s27b-prop">
                                <span>{p.label}: </span>{p.val}
                            </div>
                        ))}
                    </div>
                    <div className="s27b-note">{m.note}</div>
                </div>
            ))}
        </div>
    </SlideLayout>
);

export default Slide27b;
