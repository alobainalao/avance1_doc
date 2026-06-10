import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const ParetoSVG = () => (
    <svg viewBox="0 0 1100 520"
         style={{ width: '88%', maxHeight: '422px', display: 'block', margin: '0 auto' }}>
        <defs>
            <marker id="arr24" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" style={{ fill: 'var(--sl-accent)' }} />
            </marker>
        </defs>

        {/* ── Espacio de decisiones (blob cian) ── */}
        <path d="M 96,360 C 120,192 240,144 300,240 C 372,312 336,420 228,408 C 156,396 156,396 96,360 Z"
              style={{ fill: 'rgba(0,216,255,0.18)', stroke: 'rgba(0,216,255,0.45)', strokeWidth: 1.2 }} />
        <text x="204" y="248" textAnchor="middle"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>Q × Ω</text>
        <circle cx="216" cy="320" r="4" style={{ fill: 'var(--sl-accent)' }} />
        <text x="216" y="340" textAnchor="middle"
              style={{ fill: 'var(--sl-text)', fontSize: '18px' }}>(Q₀, p₀)</text>

        {/* ── Flecha de transformación ── */}
        <path d="M 396,310 Q 500,328 596,266"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.8, fill: 'none',
                       markerEnd: 'url(#arr24)' }} />
        <text x="490" y="188" textAnchor="middle"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>
            𝒥 : (Q, p) ↦ (Jₑ, Jₘ)
        </text>

        {/* ── Ejes espacio de objetivos ── */}
        <line x1="650" y1="456" x2="1058" y2="456"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <polygon points="1062,456 1052,451 1052,461" style={{ fill: 'var(--sl-accent)' }} />
        <text x="1074" y="461"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>Jₑ</text>

        <line x1="660" y1="466" x2="660" y2="64"
              style={{ stroke: 'var(--sl-accent)', strokeWidth: 1.5 }} />
        <polygon points="660,60 655,72 665,72" style={{ fill: 'var(--sl-accent)' }} />
        <text x="652" y="52" textAnchor="middle"
              style={{ fill: 'var(--sl-accent)', fontSize: '18px', fontStyle: 'italic' }}>Jₘ</text>

        {/* ── Región factible (blob verde) ── */}
        <path d="M 696,396 C 756,144 756,144 864,132 C 972,156 972,156 984,252 C 972,372 972,372 888,408 C 852,420 852,420 696,396 Z"
              style={{ fill: 'rgba(0,200,80,0.2)', stroke: 'rgba(0,200,80,0.45)', strokeWidth: 1.2 }} />

        {/* ── Punto imagen ── */}
        <circle cx="852" cy="204" r="4" style={{ fill: 'var(--sl-accent)' }} />
        <text x="852" y="193" textAnchor="middle"
              style={{ fill: 'var(--sl-text)', fontSize: '18px' }}>
            (Jₑ(Q₀,p₀), Jₘ(Q₀,p₀))
        </text>

        {/* ── Líneas punteadas ── */}
        <line x1="852" y1="204" x2="852" y2="456"
              style={{ stroke: 'var(--sl-muted)', strokeWidth: 1, strokeDasharray: '5 4' }} />
        <line x1="852" y1="204" x2="660" y2="204"
              style={{ stroke: 'var(--sl-muted)', strokeWidth: 1, strokeDasharray: '5 4' }} />

        {/* ── Frente de Pareto ── */}
        <path d="M 696,396 C 744,408 744,408 792,414 C 852,418 852,418 864,418"
              style={{ stroke: '#5599ff', strokeWidth: 3, fill: 'none' }} />
        <text x="880" y="410" style={{ fill: '#5599ff', fontSize: '20px' }}>Frente de Pareto</text>
    </svg>
);

const Slide24 = ({ theme = 'dark' }) => (
    <SlideLayout title="Óptimos de Pareto" theme={theme}>
        <ParetoSVG />
        <div style={{ margin: '10px 0 0 0' }}>
            <p className="sl-body" style={{ fontSize: '25px', margin: '0 0 8px 0' }}>
                Una solución es <strong style={{ color: 'var(--sl-accent)' }}>Pareto óptima</strong> si
                no existe otra solución que mejore un objetivo sin empeorar el otro.
            </p>
            <p className="sl-body" style={{ fontSize: '25px', margin: 0 }}>
                El conjunto de dichas soluciones define el{' '}
                <strong style={{ color: 'var(--sl-accent)' }}>frente de Pareto</strong>,
                que representa los compromisos entre calidad y costo.
            </p>
        </div>
    </SlideLayout>
);

export default Slide24;
