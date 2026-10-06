import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const ESTADO = {
    OK:   { icon: '✅', color: '#4ade80', label: 'Completa',   pct: 100 },
    WIP:  { icon: '🔄', color: '#60a5fa', label: 'En proceso', pct: 40  },
    PEND: { icon: '⬜', color: '#94a3b8', label: 'Pendiente',  pct: 0   },
};

const secciones = [
    { num: '§1–8', titulo: 'Derivación matemática',    desc: 'Forward, adjunto, gradientes ∇Q J y ∂J/∂zp — 10 correcciones aplicadas', est: ESTADO.OK   },
    { num: '§I',   titulo: 'Introducción y literatura', desc: 'Contaminación en acuíferos, método adjunto en hidrogeología',             est: ESTADO.PEND },
    { num: '§R',   titulo: 'Resultados numéricos',      desc: 'Checkpoint ✅ · convergencia conservador 🔄 · frente de Pareto ⬜',       est: ESTADO.WIP  },
    { num: '§D',   titulo: 'Discusión',                 desc: 'Física de los óptimos, sensibilidad a γ, ADR vs MRMT',                   est: ESTADO.PEND },
    { num: '§C',   titulo: 'Conclusiones y bibliografía', desc: 'Síntesis + Bear 1979, Freeze & Cherry 1979, Vázquez González 1997',    est: ESTADO.PEND },
];

const ProgressBar = ({ pct, color }) => (
    <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginTop: 5 }}>
        <div style={{
            height: '100%', width: `${pct}%`,
            background: color,
            borderRadius: 3,
            boxShadow: pct > 0 ? `0 0 6px ${color}88` : 'none',
            transition: 'width 0.3s ease',
        }} />
    </div>
);

const A3S08 = ({ theme = 'dark' }) => (
    <SlideLayout title="Estado del artículo" theme={theme} justify="flex-start">
        <p style={{ color: 'var(--sl-muted)', fontSize: 21, margin: '0 0 14px' }}>
            <code style={{ color: 'var(--sl-accent)', fontSize: '0.9em' }}>
                articulos/optimizacion-adjunto/optimizacion+adjunto.tex
            </code>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {secciones.map(({ num, titulo, desc, est }) => (
                <div key={titulo} style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', gap: 16,
                    border: `1px solid ${est.color}33`,
                    borderLeft: `4px solid ${est.color}`,
                    borderRadius: 7, padding: '0 16px',
                    background: `${est.color}0a`,
                }}>
                    <span style={{
                        color: 'var(--sl-muted)', fontFamily: 'monospace', fontSize: 22,
                        minWidth: 44, flexShrink: 0,
                    }}>{num}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, color: 'var(--sl-text)', fontWeight: 600, fontSize: 26 }}>{titulo}</p>
                        <p style={{ margin: '2px 0 0', color: 'var(--sl-muted)', fontSize: 20, lineHeight: 1.3 }}>{desc}</p>
                        <ProgressBar pct={est.pct} color={est.color} />
                    </div>

                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        minWidth: 80, flexShrink: 0,
                    }}>
                        <span style={{ fontSize: 20 }}>{est.icon}</span>
                        <span style={{ color: est.color, fontWeight: 700, fontSize: 17 }}>{est.label}</span>
                        <span style={{ color: est.color, fontSize: 16 }}>{est.pct}%</span>
                    </div>
                </div>
            ))}
        </div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12,
                      borderTop: '1px solid rgba(0,216,255,0.18)', paddingTop: 12 }}>
            <span style={{ fontSize: 26 }}>🎯</span>
            <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 24 }}>
                Meta: artículo enviado en{' '}
                <strong style={{ color: 'var(--sl-accent)' }}>ene 2027</strong>
                {' '}— bloqueo actual: resultados de optimización y frente de Pareto.
            </p>
        </div>
    </SlideLayout>
);

export default A3S08;
