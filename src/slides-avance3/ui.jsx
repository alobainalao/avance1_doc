import React from 'react';
import { BlockMath } from 'react-katex';

// Piezas visuales comunes de las slides de la línea «sin sumidero».
export const Punto = ({ color = '#00d8ff', children, size = 22, style }) => (
    <div style={{ borderLeft: `4px solid ${color}`, background: `${color}10`,
                  borderRadius: '0 6px 6px 0', padding: '8px 14px', ...style }}>
        <span style={{ color: 'var(--sl-text)', fontSize: size, lineHeight: 1.4 }}>{children}</span>
    </div>
);

export const Titulo = ({ children }) => (
    <p style={{ color: 'var(--sl-accent)', fontWeight: 700, fontSize: 26, margin: 0 }}>{children}</p>
);

export const Cols = ({ children, gap = '3%' }) => (
    <div style={{ display: 'flex', gap, flex: 1, minHeight: 0 }}>{children}</div>
);

export const Col = ({ children, flex = 1, gap = 12 }) => (
    <div style={{ flex, display: 'flex', flexDirection: 'column', gap, minWidth: 0 }}>{children}</div>
);

// Tabla simple: cols = [{k, label, color?, mono?}], rows = [{...}]
export const Tabla = ({ cols, rows, size = 21 }) => (
    <div style={{ border: '1px solid rgba(0,216,255,0.22)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: 'rgba(46,45,138,0.55)' }}>
                    {cols.map(c => (
                        <th key={c.k} style={{ padding: '10px 14px', textAlign: 'left', color: '#e2e8f0',
                                               fontSize: size - 2, fontWeight: 700 }}>{c.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(0,216,255,0.10)',
                                         background: i % 2 === 0 ? 'rgba(46,45,138,0.05)' : 'transparent' }}>
                        {cols.map(c => (
                            <td key={c.k} style={{ padding: '10px 14px', fontSize: size, lineHeight: 1.3,
                                                   color: (r.colors && r.colors[c.k]) || c.color || 'var(--sl-text)',
                                                   fontFamily: c.mono ? 'monospace' : 'inherit' }}>{r[c.k]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
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

// Ecuación en bloque con escala (para fórmulas largas en tarjetas estrechas).
export const Eq = ({ math, s = 0.75 }) => (
    <div style={{ fontSize: `${s * 100}%`, overflowX: 'auto' }}><BlockMath math={math} /></div>
);
