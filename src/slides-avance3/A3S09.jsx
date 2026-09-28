import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const conclusiones = [
    { icon: '✅', color: '#4ade80', texto: 'Checkpoint del gradiente validado: error mín. < 10⁻¹⁰ (∇_Q J) y ~10⁻¹⁵ (∂J/∂z_p) — muy por debajo de la tolerancia 10⁻³.' },
    { icon: '✅', color: '#4ade80', texto: '6 combinaciones (3 modelos × 2 backends) completas — forward y adjunto estables (ψ_H nan=0, ψ_C nan=0). Sep 2026.' },
    { icon: '✅', color: '#4ade80', texto: 'Optimización ADR BFR (50 eval): J −91.9 % (491 814 → 40 075), z_p óptimo −200 m (ascenso de 500 m desde −700 m).' },
    { icon: '✅', color: '#4ade80', texto: 'Optimización MRMT Semi BFR (14 eval): J −77 % (634 M → 146 M), convergencia en 3 iteraciones; fases inmóviles atenúan la respuesta en z_p.' },
];

const proximos = [
    { mes: 'Oct–Nov 26', color: '#60a5fa', tarea: 'Barrido γ ∈ [10⁻³, 10³] — frente de Pareto ADR vs MRMT Semi' },
    { mes: 'Nov 26',     color: '#60a5fa', tarea: 'Optimización MRMT Bloque BFR + FEniCS (ADR, Semi, Bloque)' },
    { mes: 'Dic 26',     color: '#60a5fa', tarea: 'Análisis de sensibilidad: S_max, demanda y parámetros MRMT' },
    { mes: 'Ene 2027',   color: '#a78bfa', tarea: 'Análisis comparativo ADR vs MRMT — escenarios agresivo y conservador' },
    { mes: 'Feb 2027 →', color: '#94a3b8', tarea: 'Pista B: extensión al modelo completo (sem 4)' },
];

const A3S09 = ({ theme = 'dark' }) => (
    <SlideLayout title="Conclusiones y próximos pasos" theme={theme} justify="flex-start">
        <div style={{ display: 'flex', gap: '3%', flex: 1, minHeight: 0 }}>

            <div style={{ flex: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ color: 'var(--sl-accent)', fontWeight: 700, fontSize: 26, margin: 0 }}>
                    Conclusiones
                </p>
                {conclusiones.map(({ icon, color, texto }, i) => (
                    <div key={i} style={{
                        flex: 1,
                        display: 'flex', gap: 12, alignItems: 'center',
                        background: `${color}0a`,
                        borderLeft: `4px solid ${color}`,
                        borderRadius: '0 6px 6px 0',
                        padding: '0 12px',
                    }}>
                        <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.5 }}>{icon}</span>
                        <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 23, lineHeight: 1.45 }}>
                            {texto}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ width: 1, background: 'rgba(0,216,255,0.20)', flexShrink: 0 }} />

            <div style={{ flex: 4, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <p style={{ color: 'var(--sl-accent)', fontWeight: 700, fontSize: 26, margin: 0 }}>
                    Próximos pasos
                </p>
                {proximos.map(({ mes, color, tarea }, i) => (
                    <div key={i} style={{
                        flex: 1,
                        display: 'flex', gap: 10, alignItems: 'center',
                        borderBottom: '1px solid rgba(0,216,255,0.10)',
                        padding: '0 4px',
                    }}>
                        <span style={{
                            color, fontSize: 19, fontWeight: 700,
                            minWidth: 80, flexShrink: 0, lineHeight: 1.4,
                        }}>{mes}</span>
                        <span style={{ color: 'var(--sl-text)', fontSize: 21, lineHeight: 1.4 }}>{tarea}</span>
                    </div>
                ))}
            </div>
        </div>
    </SlideLayout>
);

export default A3S09;
