import React from 'react';
import { BlockMath } from 'react-katex';
import { useNumEc } from '../layouts-v2/EcNum.js';

// Piezas visuales comunes de las slides de la línea «sin sumidero».
// Color con significado (avance3.css): verde = verificado, naranja/rojo = límite o pendiente,
// el resto = acento agua. Los hex heredados (paleta neón) se traducen a la paleta del avance 3.
const SEM = {
    '#4ade80': 'var(--a3-valido, #2E7D4F)',
    '#fb923c': 'var(--a3-pluma, #C4511F)', '#f87171': 'var(--a3-pluma, #C4511F)', '#fbbf24': 'var(--a3-pluma, #C4511F)',
    '#60a5fa': 'var(--a3-agua, #0F7A85)', '#00d8ff': 'var(--a3-agua, #0F7A85)', '#a78bfa': 'var(--a3-agua, #0F7A85)',
};
export const sem = (c) => SEM[c] || c;

// Tipografía por jerarquía (avance3.css): el texto usa siempre --a3-fs-cuerpo; `size` se ignora y queda
// solo por compatibilidad con las slides que aún lo pasan.
export const Punto = ({ color = '#00d8ff', children, style }) => (
    <div style={{ borderLeft: `3px solid ${sem(color)}`, padding: '4px 0 4px 16px', ...style }}>
        <span style={{ color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', lineHeight: 1.42 }}>{children}</span>
    </div>
);

export const Titulo = ({ children, style }) => (
    <p style={{ color: 'var(--sl-accent)', fontWeight: 700, fontSize: 'var(--a3-fs-seccion)', margin: 0, ...style }}>{children}</p>
);

export const Cols = ({ children, gap = '3%' }) => (
    <div style={{ display: 'flex', gap, flex: 1, minHeight: 0 }}>{children}</div>
);

export const Col = ({ children, flex = 1, gap = 12 }) => (
    <div style={{ flex, display: 'flex', flexDirection: 'column', gap, minWidth: 0 }}>{children}</div>
);

// Tabla simple: cols = [{k, label, color?, mono?}], rows = [{...}]
// Tabla en estilo booktabs: filete grueso arriba y abajo, fino bajo la cabecera, sin rayado.
export const Tabla = ({ cols, rows }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '2px solid var(--sl-text)',
                    borderBottom: '2px solid var(--sl-text)', fontVariantNumeric: 'tabular-nums' }}>
        <thead>
            <tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                {cols.map(c => (
                    <th key={c.k} style={{ padding: '9px 14px', textAlign: 'left', color: 'var(--sl-muted)',
                                           fontFamily: 'var(--a3-sans, sans-serif)', fontSize: 'var(--a3-fs-etiqueta)', fontWeight: 500 }}>{c.label}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((r, i) => (
                <tr key={i}>
                    {cols.map(c => (
                        <td key={c.k} style={{ padding: '8px 14px', fontSize: 'var(--a3-fs-cuerpo)', lineHeight: 1.3,
                                               color: sem((r.colors && r.colors[c.k]) || c.color) || 'var(--sl-text)',
                                               textAlign: c.mono ? 'right' : 'left' }}>{r[c.k]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

// Gráfico de líneas SVG nativo. series: [{n, c, y:[...]}]; x: [...]; logY opcional.
export const LineChart = ({ x, series, logY = false, ylabel = '', xlabel = 'día', W = 520, H = 300, fmt }) => {
    const PX = 64, PY = 16, PB = 40;
    const vals = series.flatMap(s => s.y).filter(v => Number.isFinite(v) && (!logY || v > 0));
    const f = logY ? Math.log10 : (v => v);
    const lo = Math.min(...vals.map(f)), hi = Math.max(...vals.map(f));
    const pad = (hi - lo) * 0.08 || 1;
    const y0 = lo - pad, y1 = hi + pad;
    const sx = v => PX + (v - x[0]) / ((x[x.length - 1] - x[0]) || 1) * (W - PX - 14);
    const sy = v => PY + (y1 - f(v)) / (y1 - y0) * (H - PY - PB);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(k => y0 + k * (y1 - y0));
    const lab = t => (fmt ? fmt(logY ? Math.pow(10, t) : t) : (logY ? Math.pow(10, t).toExponential(0) : t.toPrecision(2)));
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
            {ticks.map((t, i) => (
                <g key={i}>
                    <line x1={PX} x2={W - 14} y1={PY + (y1 - t) / (y1 - y0) * (H - PY - PB)} y2={PY + (y1 - t) / (y1 - y0) * (H - PY - PB)} stroke="rgba(0,216,255,0.15)" />
                    <text x={PX - 6} y={PY + (y1 - t) / (y1 - y0) * (H - PY - PB) + 5} textAnchor="end" fill="#94a3b8" fontSize="13">{lab(t)}</text>
                </g>
            ))}
            {[0, 0.5, 1].map(k => {
                const v = x[0] + k * (x[x.length - 1] - x[0]);
                return <text key={k} x={sx(v)} y={H - PB + 18} textAnchor="middle" fill="#94a3b8" fontSize="13">{v.toFixed(0)}</text>;
            })}
            <text x={W / 2} y={H - 6} textAnchor="middle" fill="#94a3b8" fontSize="13">{xlabel}</text>
            <text x={14} y={PY + 10} fill="#94a3b8" fontSize="13">{ylabel}</text>
            {series.map(s => (
                <polyline key={s.n} fill="none" stroke={s.c} strokeWidth="2.6" strokeDasharray={s.dash || undefined}
                          points={s.y.map((v, i) => (Number.isFinite(v) && (!logY || v > 0)) ? `${sx(x[i])},${sy(v)}` : null).filter(Boolean).join(' ')} />
            ))}
        </svg>
    );
};

// Selector de modelo (botones) para slides con video o series.
export const SelectorModelo = ({ modelos, valor, onChange }) => (
    <div style={{ display: 'flex', gap: 10 }}>
        {modelos.map(m => (
            <button key={m.id} onClick={() => onChange(m.id)} style={{
                padding: '6px 16px', fontSize: 20, fontWeight: 700, cursor: 'pointer', borderRadius: 6,
                border: `2px solid ${valor === m.id ? '#00d8ff' : 'rgba(0,216,255,0.3)'}`,
                background: valor === m.id ? 'rgba(0,216,255,0.18)' : 'transparent', color: 'var(--sl-text)',
            }}>{m.label}</button>
        ))}
    </div>
);

// Ecuación en bloque. Dos tamaños (avance3.css): el normal, común a todas, y `compacta` para las que no caben
// (`s` < 0.8 de las versiones anteriores equivale a compacta). `id`: número dinámico a la derecha (\tag),
// asignado por el orden de las slides visibles (layouts-v2/EcNum.js).
export const Eq = ({ math, s, compacta, id }) => {
    const n = useNumEc(id);
    const comp = compacta || (s !== undefined && s < 0.8);
    return (
        <div className={comp ? 'a3-ec a3-ec--compacta' : 'a3-ec'} style={{ overflowX: 'auto' }}>
            <BlockMath math={n ? `${math}\\tag{${n}}` : math} />
        </div>
    );
};

// Referencia en el texto a una ecuación numerada: «(n)».
export const RefEc = ({ id }) => {
    const n = useNumEc(id);
    return <span style={{ whiteSpace: 'nowrap' }}>({n ?? '?'})</span>;
};
