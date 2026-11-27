import React from 'react';
import { POLIGONO, POZO, FUENTE, X, Z } from '../slides-avance3/escena.jsx';

// Campos del modelo por bloques dibujados en SVG nativo: bandas de nivel ya calculadas (camposBloque.js,
// codigo/scripts/exportar_simplificada_js.py) en las coordenadas de escena.jsx (dominio en [0, 1000] × [0, 296]), con su
// barra de colores. Paletas fijas en hex (iguales en los dos temas); la banda central de los adjuntos (|ψ| < 1 % del
// máximo) queda transparente.
const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mezcla = (a, b, t) => {
    const [p, q] = [hex(a), hex(b)];
    return '#' + p.map((v, i) => Math.round(v + (q[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const escala = (cs, t) => {
    const k = Math.min(cs.length - 2, Math.floor(t * (cs.length - 1)));
    return mezcla(cs[k], cs[k + 1], t * (cs.length - 1) - k);
};
export const PALETAS = {
    H: ['#EAF4F7', '#9CCFDB', '#3C93AE', '#0B4F6C'],
    U: ['#FFF6C9', '#A9DDB7', '#41B6C4', '#225EA8', '#1A2A6C'],
    C: ['#FDEBDD', '#F9B98F', '#E8743B', '#B4400F', '#6B1F04'],
};
const DIV_NEG = ['#2166AC', '#D1E5F0'], DIV_POS = ['#FDDBC7', '#B2182B'];

// color de la banda k de n (sequencial) o de la banda k con niveles simétricos (divergente)
export function colores(paleta, niveles) {
    const n = niveles.length - 1;
    if (paleta !== 'adj') return Array.from({ length: n }, (_, k) => escala(PALETAS[paleta], n > 1 ? k / (n - 1) : 0));
    const c = niveles.findIndex((v, k) => v < 0 && niveles[k + 1] > 0);   // banda central; c negativas y n − c − 1 positivas
    return Array.from({ length: n }, (_, k) => {
        if (k === c) return null;
        return k < c ? mezcla(DIV_NEG[0], DIV_NEG[1], k / Math.max(1, c - 1)) : mezcla(DIV_POS[0], DIV_POS[1], (k - c - 1) / Math.max(1, n - c - 2));
    });
}

export function Campo({ bandas, niveles, paleta, id, pozo = true, zp, alto }) {
    const cs = colores(paleta, niveles);
    return (
        <svg viewBox="-4 -4 1008 304" style={{ width: '100%', height: alto, display: 'block' }} preserveAspectRatio="xMidYMid meet">
            <defs><clipPath id={`cb-${id}`}><polygon points={POLIGONO} /></clipPath></defs>
            <polygon points={POLIGONO} fill="var(--sl-bg)" />
            <g clipPath={`url(#cb-${id})`}>
                {bandas.map((d, k) => cs[k] && <path key={k} d={d} fill={cs[k]} fillRule="evenodd" />)}
            </g>
            <polygon points={POLIGONO} fill="none" stroke="var(--sl-text)" strokeWidth="1.4" />
            {pozo && zp !== undefined && (
                <g>
                    <line x1={X(POZO.x)} y1={0} x2={X(POZO.x)} y2={Z(zp)} stroke="var(--sl-text)" strokeWidth="2.2" />
                    <circle cx={X(POZO.x)} cy={Z(zp)} r="5" fill="var(--sl-text)" />
                </g>
            )}
            <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r="4" fill="none" stroke="var(--sl-text)" strokeWidth="1.5" />
        </svg>
    );
}

// Barra de colores horizontal con los niveles en sus bordes (fmt da el rótulo de cada nivel).
export function Barra({ niveles, paleta, unidad, fmt = (v) => v, ancho = 360, cada = 1 }) {
    const cs = colores(paleta, niveles), n = cs.length, w = ancho / n;
    const eje = { fontFamily: 'var(--a3-sans)', fontSize: 13, fill: 'var(--sl-muted)' };
    return (
        <svg viewBox={`-20 0 ${ancho + 90} 36`} style={{ width: ancho + 110, display: 'block' }}>
            {cs.map((c, k) => <rect key={k} x={k * w} y={2} width={w} height={12} fill={c || 'var(--sl-bg)'} stroke="var(--a3-filete)" strokeWidth="0.4" />)}
            {niveles.map((v, k) => (k % cada === 0 || k === niveles.length - 1) && (
                <text key={k} x={k * w} y={30} textAnchor="middle" style={eje}>{fmt(v, k)}</text>
            ))}
            <text x={ancho + 14} y={13} style={{ ...eje, fill: 'var(--sl-text)' }}>{unidad}</text>
        </svg>
    );
}

// Número compacto para las barras: 0.001 → 10⁻³, 120 → 120.
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const potencia = (v) => {
    const e = Math.round(Math.log10(v));
    if (Math.abs(Math.log10(v) - e) > 0.01) return v >= 1 ? v.toFixed(0) : v.toPrecision(1);
    return e >= 0 && e <= 2 ? String(10 ** e) : `10${e < 0 ? '⁻' : ''}${String(Math.abs(e)).split('').map(c => SUP[c]).join('')}`;
};

// Serie temporal con ejes y unidades (tokens del tema). series: [{ y, c, n, dash }]; x en días; marca opcional en t.
export function Serie({ x, series, ylabel, xlabel = 't [días]', W = 520, H = 230, t, ymin, ymax, marcas = [0, 10, 20, 30] }) {
    const L = 58, R = 12, T = 22, B = 38;
    const vals = series.flatMap(s => s.y).filter(Number.isFinite);
    const y0 = ymin ?? Math.min(0, ...vals), y1 = ymax ?? Math.max(...vals) * 1.08;
    const sx = v => L + (v - x[0]) / (x[x.length - 1] - x[0]) * (W - L - R);
    const sy = v => T + (y1 - v) / (y1 - y0) * (H - T - B);
    const paso = (() => { const r = (y1 - y0) / 4, p = 10 ** Math.floor(Math.log10(r)); return [1, 2, 5, 10].map(m => m * p).find(m => m >= r); })();
    const ticks = []; for (let v = Math.ceil(y0 / paso) * paso; v <= y1 + 1e-12; v += paso) ticks.push(v);
    const eje = { fontFamily: 'var(--a3-sans)', fontSize: 13, fill: 'var(--sl-muted)' };
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
            {ticks.map(v => (
                <g key={v}>
                    <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="var(--a3-filete)" strokeWidth="0.7" />
                    <text x={L - 6} y={sy(v) + 4} textAnchor="end" style={eje}>{+v.toPrecision(3)}</text>
                </g>
            ))}
            <line x1={L} x2={L} y1={T - 4} y2={H - B} stroke="var(--sl-text)" />
            <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="var(--sl-text)" />
            {marcas.map(d => <text key={d} x={sx(d)} y={H - B + 17} textAnchor="middle" style={eje}>{d}</text>)}
            <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={eje}>{xlabel}</text>
            <text x={L + 4} y={T - 9} style={{ ...eje, fill: 'var(--sl-text)' }}>{ylabel}</text>
            {series.map(s => (
                <polyline key={s.n} fill="none" stroke={s.c} strokeWidth="2.4" strokeDasharray={s.dash}
                          points={s.y.map((v, i) => `${sx(x[i]).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')} />
            ))}
            {t !== undefined && <line x1={sx(t)} x2={sx(t)} y1={T - 4} y2={H - B} stroke="var(--sl-accent)" strokeWidth="1.5" strokeDasharray="4 3" />}
        </svg>
    );
}
