import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Datos extraídos de presentaciones/tracker-semestral/src/data/metas.js
const COLS = [
    { key: 'fwdBFR',  label: 'Forward\nBFR'    },
    { key: 'fwdFEM',  label: 'Forward\nFEniCS'  },
    { key: 'adjBFR',  label: 'Adjunto\nBFR'     },
    { key: 'adjFEM',  label: 'Adjunto\nFEniCS'  },
];

const ROWS = [
    { model: 'ADR',          fwdBFR: 'ok',  fwdFEM: 'ok',  adjBFR: 'ok',  adjFEM: 'wip' },
    { model: 'MRMT Semi',    fwdBFR: 'ok',  fwdFEM: 'pen', adjBFR: 'ok',  adjFEM: 'pen' },
    { model: 'MRMT Bloque',  fwdBFR: 'ok',  fwdFEM: 'pen', adjBFR: 'ok',  adjFEM: 'pen' },
];

const CFG = {
    ok:  { color: '#4ade80', bg: 'rgba(74,222,128,0.13)',  icon: '✓', label: 'Completo'     },
    wip: { color: '#60a5fa', bg: 'rgba(96,165,250,0.13)',  icon: '◑', label: 'En progreso'  },
    pen: { color: '#475569', bg: 'rgba(71,85,105,0.18)',   icon: '○', label: 'Pendiente'    },
};

const A3S10 = ({ theme = 'dark' }) => (
    <SlideLayout title="Estado de implementación — modelos y backends" theme={theme} justify="flex-start">

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 32, flexShrink: 0 }}>
            {Object.values(CFG).map(({ color, icon, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 8,
                                           color, fontSize: 22, fontWeight: 600 }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>{label}
                </span>
            ))}
        </div>

        {/* Tabla */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                      border: '1px solid rgba(0,216,255,0.22)', borderRadius: 10, overflow: 'hidden' }}>

            {/* Cabecera */}
            <div style={{ display: 'flex', flexShrink: 0,
                          background: 'rgba(46,45,138,0.55)',
                          borderBottom: '1px solid rgba(0,216,255,0.25)' }}>
                <div style={{ flex: 3, padding: '14px 24px', color: 'var(--sl-muted)', fontSize: 22, fontWeight: 700 }}>
                    Modelo
                </div>
                {COLS.map(({ key, label }) => (
                    <div key={key} style={{
                        flex: 2, padding: '10px 8px', textAlign: 'center',
                        color: 'var(--sl-title-text)', fontSize: 20, fontWeight: 700,
                        whiteSpace: 'pre-line', lineHeight: 1.3,
                        borderLeft: '1px solid rgba(0,216,255,0.15)',
                    }}>{label}</div>
                ))}
            </div>

            {/* Filas */}
            {ROWS.map(({ model, ...vals }, ri) => (
                <div key={model} style={{
                    flex: 1, display: 'flex', alignItems: 'stretch',
                    borderBottom: ri < ROWS.length - 1 ? '1px solid rgba(0,216,255,0.12)' : 'none',
                }}>
                    <div style={{
                        flex: 3, display: 'flex', alignItems: 'center',
                        padding: '0 24px',
                        fontWeight: 700, fontSize: 28, color: 'var(--sl-text)',
                        fontFamily: 'monospace',
                        borderRight: '1px solid rgba(0,216,255,0.15)',
                    }}>{model}</div>

                    {COLS.map(({ key }) => {
                        const s = vals[key];
                        const { color, bg, icon, label } = CFG[s];
                        return (
                            <div key={key} style={{
                                flex: 2, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: 6,
                                background: bg,
                                borderLeft: `3px solid ${color}44`,
                            }}>
                                <span style={{ fontSize: 34, color }}>{icon}</span>
                                <span style={{ fontSize: 18, color, fontWeight: 600 }}>{label}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>

        {/* Nota */}
        <p style={{ color: 'var(--sl-muted)', fontSize: 20, fontStyle: 'italic',
                    margin: 0, flexShrink: 0 }}>
            ADR + MRMT adj. BFR completos (checkpoint FD &lt; 1e-9). Forward + adj. MRMT en FEniCS pendientes.
        </p>
    </SlideLayout>
);

export default A3S10;
