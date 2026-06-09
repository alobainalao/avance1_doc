import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide26.css';

const uad = String.raw`\mathcal{U}_{ad} = \left\{(Q,x_p,z_p) \;\middle|\; \begin{array}{l}
0\leq Q(t)\leq Q_\text{máx},\quad t\in(0,T),\\[2pt]
(x_p,z_p)\in\Omega,\\[2pt]
z_\text{mín}\leq z_p\leq z_\text{máx}
\end{array}\right\}`;

const QtSVG = () => (
    <svg viewBox="0 0 300 185"
         style={{ width: '100%', height: '100%', display: 'block' }}>
        {/* rectángulo más corto que el eje */}
        <rect x="30" y="55" width="190" height="107"
              style={{ fill: 'rgba(100,180,80,0.2)', stroke: 'rgba(100,180,80,0.5)', strokeWidth: 1 }} />
        {/* eje vertical */}
        <line x1="30" y1="165" x2="30" y2="18"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <polygon points="30,16 26,26 34,26"
                 style={{ fill: 'var(--sl-accent)' }} />
        {/* eje t — se extiende más allá del rectángulo */}
        <line x1="28" y1="162" x2="285" y2="162"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <polygon points="287,162 277,158 277,166"
                 style={{ fill: 'var(--sl-accent)' }} />
        {/* línea Qmáx — solo hasta el borde del rectángulo */}
        <line x1="28" y1="55" x2="220" y2="55"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1, strokeDasharray: '4 3' }} />
        {/* curva Q(t) dentro del rectángulo */}
        <path d="M 30,128 C 60,108 90,142 130,118 C 165,92 195,128 220,105"
              style={{ stroke: '#5588ff', strokeWidth: 2, fill: 'none' }} />
        <text x="292" y="166"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>t</text>
        <text x="30" y="12" textAnchor="middle"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>Q(t)</text>
        <text x="24" y="59" textAnchor="end"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>
            <tspan>Q</tspan>
            <tspan dy="3" fontSize="8">máx</tspan>
        </text>
        <text x="125" y="125" textAnchor="middle"
              style={{ fill: 'rgba(100,200,80,0.9)', fontSize: '18px' }}>Región admisible</text>
        <text x="175" y="92"
              style={{ fill: '#7799ff', fontSize: '18px', fontStyle: 'italic' }}>Q(t)</text>
    </svg>
);

const DepthSVG = () => (
    <svg viewBox="0 0 260 185"
         style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect x="30" y="25" width="220" height="148"
              style={{ fill: 'var(--sl-accent)', fillOpacity: 0.05,
                       stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <text x="145" y="20" textAnchor="middle"
              style={{ fill: 'var(--sl-secondary)', fontSize: '18px' }}>Superficie</text>
        <text x="210" y="55" textAnchor="middle"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>Ω</text>
        <line x1="30" y1="68" x2="250" y2="68"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1, strokeDasharray: '5 3' }} />
        <line x1="30" y1="145" x2="250" y2="145"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1, strokeDasharray: '5 3' }} />
        <line x1="140" y1="68" x2="140" y2="145"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 2 }} />
        <circle cx="140" cy="106" r="5" style={{ fill: '#5599ff' }} />
        <text x="25" y="72" textAnchor="end"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>
            <tspan>z</tspan>
            <tspan dy="3" fontSize="10">mín</tspan>
        </text>
        <text x="25" y="149" textAnchor="end"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>
            <tspan>z</tspan>
            <tspan dy="3" fontSize="10">máx</tspan>
        </text>
        <text x="150" y="103"
              style={{ fill: '#5599ff', fontSize: '18px', fontStyle: 'italic' }}>
            {'(xₚ, zₚ)'}
        </text>
    </svg>
);

const Slide26 = ({ theme = 'dark' }) => (
    <SlideLayout title="Restricciones" theme={theme}>
        <div className="s26-diagrams">
            <div className="s26-diagram-wrap">
                <QtSVG />
                <p className="s26-sublabel">
                    <InlineMath math={String.raw`0\leq Q(t)\leq Q_\text{máx}`} />
                </p>
            </div>
            <div className="s26-diagram-wrap">
                <DepthSVG />
                <p className="s26-sublabel">
                    <InlineMath math={String.raw`z_\text{mín}\leq z_p\leq z_\text{máx}`} />
                </p>
            </div>
        </div>
        <EqCard title="Conjunto admisible" >
            <BlockMath math={uad} />
        </EqCard>
    </SlideLayout>
);

export default Slide26;
