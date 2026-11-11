import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Agenda y estado de la línea «sin sumidero» (nov 2026). Referencia: docs/adjunto_sin_sumidero.pdf y su informe de auditoría.
const items = [
    { fecha: 'Nov 2026', tarea: 'Modelo sin sumidero explícito: se cancela fC, queda −S_s∂ₜh·C (ADR y MRMT)', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Salida libre ∂ₙu = 0 (componente normal) implementada en BFR y FEniCSx', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Adjunto continuo y discreto re-deducidos; gradiente verificado en FEniCSx (3 modelos) y BFR exacto', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Sumidero del pozo eliminado del código y malla compartida refinada en los dos backends', tipo: 'ok' },
    { fecha: 'Nov 2026', tarea: 'Directo BFR vs FEniCSx con la configuración de main (3 modelos, 30 días)', tipo: 'ok' },
    { fecha: 'Nov–Dic 2026', tarea: 'Verificación en configuración tipo main (pluma en el pozo) y adjunto BFR con C modulada', tipo: 'wip' },
    { fecha: 'Dic 2026', tarea: 'Optimización con el modelo nuevo (nitrato, J normalizado, malla compartida) en los dos backends', tipo: 'wip' },
    { fecha: 'Ene 2027', tarea: 'Capítulos de la tesis y artículo con el modelo sin sumidero', tipo: 'meta' },
];
const cfg = {
    ok:   { color: '#2E7D4F', label: '✓ Hecho',       bg: 'rgba(74,222,128,0.12)'  },
    wip:  { color: '#0F7A85', label: '↻ En progreso', bg: 'rgba(96,165,250,0.12)'  },
    pen:  { color: '#94a3b8', label: '○ Pendiente',   bg: 'rgba(148,163,184,0.08)' },
    meta: { color: '#10243E', label: '◎ Meta',        bg: 'rgba(0,216,255,0.10)'   },
};

export default function A3N01({ theme = 'dark' }) {
    return (
        <SlideLayout title="Semestre 3 — agenda y estado (modelo sin sumidero)" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                {items.map((it, i) => {
                    const c = cfg[it.tipo];
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 22,
                                              borderTop: i ? '1px solid var(--a3-filete, #C9D3DB)' : 'none', padding: '0 6px' }}>
                            <span style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0,
                                           background: it.tipo === 'ok' ? c.color : 'transparent', border: `2px solid ${c.color}` }} />
                            <span style={{ color: 'var(--sl-muted)', fontSize: 19, minWidth: 118, flexShrink: 0 }}>{it.fecha}</span>
                            <span style={{ color: 'var(--sl-text)', fontSize: 23, flex: 1, lineHeight: 1.35 }}>{it.tarea}</span>
                            <span style={{ color: c.color, fontSize: 18, fontFamily: 'var(--a3-sans, sans-serif)', minWidth: 118, textAlign: 'right' }}>{c.label.replace(/^\S+\s/, '')}</span>
                        </div>
                    );
                })}
            </div>
        </SlideLayout>
    );
}
