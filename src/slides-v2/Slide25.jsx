import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const EscalarizacionSVG = () => (
    <svg viewBox="0 0 900 750"
         style={{ width: '60%', maxHeight: '56vh', display: 'block', margin: '0 auto' }}>
        <defs>
            <marker id="arr25" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" style={{ fill: 'var(--sl-accent)' }} />
            </marker>
        </defs>

        {/* ── Ejes ── */}
        <line x1="148" y1="700" x2="760" y2="700"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <polygon points="764,700 754,695 754,705" style={{ fill: 'var(--sl-accent)' }} />
        <text x="775" y="705" style={{ fill: 'var(--sl-accent)', fontSize: '16px', fontStyle: 'italic' }}>Jₑ</text>

        <line x1="150" y1="702" x2="150" y2="92"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <polygon points="150,88 145,100 155,100" style={{ fill: 'var(--sl-accent)' }} />
        <text x="142" y="82" textAnchor="middle"
              style={{ fill: 'var(--sl-accent)', fontSize: '16px', fontStyle: 'italic' }}>Jₘ</text>

        {/* ── Región factible ── */}
        <path d="M 250,200 C 500,150 500,150 670,300 C 730,450 730,450 650,550 C 550,620 550,620 370,580 C 260,454 260,454 250,200 Z"
              style={{ fill: 'rgba(0,200,80,0.18)', stroke: 'rgba(0,200,80,0.4)', strokeWidth: 1.2 }} />
        <text x="420" y="296" textAnchor="middle"
              style={{ fill: 'rgba(0,200,80,0.9)', fontSize: '14px' }}>Región factible</text>

        {/* ── Frente de Pareto ── */}
        <path d="M 280,450 C 370,600 370,600 550,610"
              style={{ stroke: '#5599ff', strokeWidth: 3, fill: 'none' }} />
        <text x="510" y="648" textAnchor="middle"
              style={{ fill: '#5599ff', fontSize: '13px' }}>Frente de Pareto</text>

        {/* ── Rectas de nivel (rojo) ── */}
        <line x1="90" y1="380" x2="580" y2="720"
              style={{ stroke: '#ff5555', strokeWidth: 2 }} />
        <line x1="190" y1="280" x2="680" y2="620"
              style={{ stroke: '#ff5555', strokeWidth: 1.5, strokeDasharray: '6 4' }} />
        <line x1="290" y1="180" x2="780" y2="520"
              style={{ stroke: '#ff5555', strokeWidth: 1.5, strokeDasharray: '6 4' }} />
        <line x1="390" y1="80" x2="880" y2="420"
              style={{ stroke: '#ff5555', strokeWidth: 1.5, strokeDasharray: '6 4' }} />
        <text x="480" y="394" textAnchor="middle"
              style={{ fill: '#ff5555', fontSize: '13px' }}>Rectas de nivel</text>

        {/* ── Punto óptimo ── */}
        <circle cx="374" cy="580" r="5" style={{ fill: 'var(--sl-accent)' }} />
        <text x="462" y="542" textAnchor="middle"
              style={{ fill: 'var(--sl-text)', fontSize: '13px' }}>solución</text>
    </svg>
);

const Slide25 = ({ theme = 'dark' }) => (
    <SlideLayout title="Escalarización" theme={theme}>
        <p className="sl-equation" style={{ textAlign: 'center', margin: '0 0 1vh 0' }}>
            <InlineMath math={String.raw`J = J_m + \gamma J_e`} />
        </p>
        <EscalarizacionSVG />
    </SlideLayout>
);

export default Slide25;
