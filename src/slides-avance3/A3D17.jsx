import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Objetivos del semestre 3 (ROADMAP.md, pista A: gradiente → optimización → Pareto → artículo) y su estado al
// cierre de noviembre de 2026.
const general = 'Resolver el problema de control óptimo del pozo (caudal y profundidad) con el gradiente adjunto, en los modelos ADR y MRMT, y verificarlo con dos discretizaciones independientes.';

const objetivos = [
    { t: 'Modelo de flujo y transporte coherente (ADR y MRMT): sin sumidero explícito, con almacenamiento y salida libre', e: 'ok' },
    { t: 'Dos discretizaciones (RBF-FD y elementos finitos) sobre la misma malla y su comparación cuantitativa', e: 'ok' },
    { t: 'Sistema adjunto continuo y discreto; gradiente verificado contra diferencias finitas en las seis variantes', e: 'ok', nota: 'en horizonte corto; el adjunto RBF-FD depende de la malla' },
    { t: 'Optimización con bomba y tanque en los tres modelos con elementos finitos', e: 'wip', nota: 'resultados preliminares; falta χ ≤ 10⁻⁴' },
    { t: 'Optimización con RBF-FD sobre la misma malla y comparación de óptimos', e: 'pen', nota: 'su adjunto aún depende de la malla' },
    { t: 'Frente de Pareto (barrido de γ)', e: 'pen' },
    { t: 'Artículo de optimización', e: 'wip', nota: 'borrador; faltan resultados y revisión a fondo' },
];
const cfg = {
    ok:  { color: 'var(--a3-valido)', label: 'hecho' },
    wip: { color: 'var(--a3-agua)', label: 'en curso' },
    pen: { color: 'var(--a3-estrato)', label: 'pendiente' },
};

export default function A3D17({ theme = 'dark' }) {
    return (
        <SlideLayout title="Objetivos del semestre y su estado" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>Objetivo general</p>
            <p style={{ margin: '0 0 16px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>{general}</p>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                {objetivos.map((o, i) => {
                    const c = cfg[o.e];
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '9px 6px',
                                              borderTop: i ? '1px solid var(--a3-filete, #C9D3DB)' : 'none' }}>
                            <span style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0,
                                           background: o.e === 'ok' ? c.color : 'transparent', border: `2px solid ${c.color}` }} />
                            <span style={{ color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', flex: 1, lineHeight: 1.3 }}>{o.t}</span>
                            {o.nota && <span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', textAlign: 'right' }}>{o.nota}</span>}
                            <span style={{ color: c.color, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', minWidth: 92, textAlign: 'right', fontWeight: 600 }}>{c.label}</span>
                        </div>
                    );
                })}
            </div>
        </SlideLayout>
    );
}
