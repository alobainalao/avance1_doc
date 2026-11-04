import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Agenda y estado de la línea «sin sumidero» (nov 2026). Referencia: docs/adjunto_sin_sumidero.pdf y su informe de auditoría.
const items = [
    { fecha: 'Nov 2026', tarea: 'Modelo sin sumidero explícito: se cancela fC, queda −S_s∂ₜh·C (ADR y MRMT)', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Salida libre ∂ₙu = 0 (componente normal) implementada en BFR y FEniCSx', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Adjunto continuo y discreto re-deducidos; gradiente verificado en FEniCSx (3 modelos) y BFR exacto', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Directo BFR vs FEniCSx con la configuración de main (3 modelos, 30 días)', tipo: 'ok' },
    { fecha: 'Nov–Dic 2026', tarea: 'Verificación en configuración tipo main (pluma en el pozo) y adjunto BFR con otros cierres', tipo: 'wip' },
    { fecha: 'Dic 2026', tarea: 'Optimización con el modelo nuevo (nitrato, J normalizado, fuente común) en los dos backends', tipo: 'pen' },
    { fecha: 'Ene 2027', tarea: 'Capítulos de la tesis y artículo con el modelo sin sumidero', tipo: 'meta' },
];
const cfg = {
    ok:   { color: '#4ade80', label: '✓ Hecho',       bg: 'rgba(74,222,128,0.12)'  },
    wip:  { color: '#60a5fa', label: '↻ En progreso', bg: 'rgba(96,165,250,0.12)'  },
    pen:  { color: '#94a3b8', label: '○ Pendiente',   bg: 'rgba(148,163,184,0.08)' },
    meta: { color: '#00d8ff', label: '◎ Meta',        bg: 'rgba(0,216,255,0.10)'   },
};

export default function A3N01({ theme = 'dark' }) {
    return (
        <SlideLayout title="Semestre 3 — agenda y estado (modelo sin sumidero)" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {items.map((it, i) => {
                    const c = cfg[it.tipo];
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14,
                                              background: c.bg, border: `1px solid ${c.color}44`,
                                              borderLeft: `4px solid ${c.color}`, borderRadius: 7, padding: '0 14px' }}>
                            <span style={{ color: 'var(--sl-muted)', fontSize: 19, minWidth: 118, flexShrink: 0 }}>{it.fecha}</span>
                            <span style={{ color: 'var(--sl-text)', fontSize: 23, flex: 1, lineHeight: 1.35 }}>{it.tarea}</span>
                            <span style={{ color: c.color, fontSize: 18, fontWeight: 700, minWidth: 118, textAlign: 'right' }}>{c.label}</span>
                        </div>
                    );
                })}
            </div>
        </SlideLayout>
    );
}
