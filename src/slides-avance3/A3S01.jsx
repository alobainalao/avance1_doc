import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const GITHUB = 'https://github.com/alobainalao/Doctorado/blob/main/codigo';

// Índices posicionales en slideConfig.avance3.js (0-based):
// 0:null  1:A3S01 2:A3S02 3:A3S03  4:A3S05  5:A3S19  6:A3S20
// 7:A3S15 8:A3S16 9:A3S21 10:A3S13 11:A3S11 12:A3S12 13:A3S14
// 14:A3S17 15:A3S18 16:A3S10 17:A3S09
const items = [
    {
        fecha: 'Ago–Sep 2026',
        tarea: 'Checkpoint del gradiente adjunto (error rel. < 10⁻¹⁰)',
        tipo: 'ok',
        ev: [
            { label: 'Ecuaciones', idx: 3 },
            { label: 'Resultados', idx: 4 },
        ],
    },
    {
        fecha: 'Sep 2026',
        tarea: '6 combinaciones completas: forward + adjunto (3 modelos × 2 backends)',
        tipo: 'ok',
        ev: [
            { label: 'Forward C(t)', idx: 7 },
            { label: 'Adjunto ψ_C', idx: 8 },
        ],
    },
    {
        fecha: 'Sep 2026',
        tarea: 'Optimización ADR BFR (50 evals): J −91.9 %, z_p −700 → −200 m',
        tipo: 'ok',
        ev: [
            { label: 'ADR resultado', idx: 13 },
            { label: 'Código', href: `${GITHUB}/view/animation.py` },
        ],
    },
    {
        fecha: 'Sep 2026',
        tarea: 'Optimización MRMT Semi BFR (14 evals): J −77 %, convergencia en 3 iter',
        tipo: 'ok',
        ev: [
            { label: 'ADR vs MRMT', idx: 14 },
        ],
    },
    { fecha: 'Oct–Nov 2026', tarea: 'Barrido γ ∈ [10⁻³, 10³] — frente de Pareto ADR vs MRMT Semi', tipo: 'wip' },
    { fecha: 'Nov–Dic 2026', tarea: 'Optimización MRMT Bloque + FEniCS (ADR, Semi, Bloque)',        tipo: 'pen' },
    { fecha: 'Ene 2027',     tarea: 'Análisis comparativo y envío del artículo',                    tipo: 'meta' },
];

const cfg = {
    ok:   { color: '#4ade80', label: '✓ Completado',    bg: 'rgba(74,222,128,0.12)'  },
    wip:  { color: '#60a5fa', label: '↻ En progreso',   bg: 'rgba(96,165,250,0.12)'  },
    pen:  { color: '#94a3b8', label: '○ Pendiente',     bg: 'rgba(148,163,184,0.08)' },
    meta: { color: '#00d8ff', label: '◎ Meta semestre', bg: 'rgba(0,216,255,0.10)'   },
};

const goTo = (idx) =>
    window.dispatchEvent(new CustomEvent('goToSlide', { detail: { index: idx } }));

const Chip = ({ label, idx, href }) => {
    const isExt = !!href;
    return (
        <button
            onClick={(e) => { e.stopPropagation(); isExt ? window.open(href, '_blank') : goTo(idx); }}
            style={{
                padding: '3px 9px',
                background: isExt ? 'rgba(0,216,255,0.10)' : 'rgba(74,222,128,0.13)',
                border: `1px solid ${isExt ? 'rgba(0,216,255,0.35)' : 'rgba(74,222,128,0.40)'}`,
                borderRadius: 5,
                color: isExt ? '#00d8ff' : '#4ade80',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                lineHeight: 1.4,
            }}
        >
            {label}&thinsp;{isExt ? '↗' : '→'}
        </button>
    );
};

const A3S01 = ({ theme = 'dark' }) => (
    <SlideLayout title="Semestre 3 — agenda y estado" theme={theme} justify="flex-start">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {items.map((it, i) => {
                const c = cfg[it.tipo];
                return (
                    <div key={i} style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center', gap: 14,
                        background: c.bg,
                        border: `1px solid ${c.color}44`,
                        borderLeft: `4px solid ${c.color}`,
                        borderRadius: 7,
                        padding: '0 14px',
                    }}>
                        <span style={{
                            color: 'var(--sl-muted)', fontSize: 19,
                            minWidth: 108, flexShrink: 0, lineHeight: 1.3,
                        }}>{it.fecha}</span>

                        <span style={{ color: 'var(--sl-text)', fontSize: 24, flex: 1, lineHeight: 1.35 }}>
                            {it.tarea}
                        </span>

                        {/* Chips de evidencia (solo ítems 'ok') */}
                        {it.ev && (
                            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                                {it.ev.map(e => (
                                    <Chip key={e.label} {...e} />
                                ))}
                            </div>
                        )}

                        <span style={{
                            color: c.color, fontSize: 18, fontWeight: 700,
                            minWidth: 128, textAlign: 'right', flexShrink: 0,
                        }}>{c.label}</span>
                    </div>
                );
            })}
        </div>
        <p style={{ marginTop: 10, color: 'var(--sl-muted)', fontSize: 22, fontStyle: 'italic' }}>
            Pista A: método adjunto + optimización → artículo enviado al final del semestre.
        </p>
    </SlideLayout>
);

export default A3S01;
