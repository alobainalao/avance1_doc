import React, { useMemo } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { InlineMath } from 'react-katex';
import { Punto } from './ui.jsx';
import { INFO, PANORAMA, FRONTERA, VENTANAS, CONOS } from './mallaCompartida.js';

// La malla de la comparación BFR vs FEniCSx (data/input/malla_compartida/malla.pkl), dibujada como malla.png:
// triangulación completa, frontera por grupos y ventanas del pozo y de dos esquinas con los nodos fantasma.
const miles = (n) => n.toLocaleString('en-US').replace(/,/g, '\u2009');
const COL = { inlet: '#0F7A85', outlet: '#2E7D4F', wall: '#C4511F' };
const ETQ = { inlet: 'entrada', outlet: 'salida Γout', wall: 'paredes' };

const segs = (a) => {
    let d = '';
    for (let i = 0; i < a.length; i += 4) d += `M${a[i]} ${a[i + 1]}L${a[i + 2]} ${a[i + 3]}`;
    return d;
};
const puntos = (a, r, c, k) => {
    const out = [];
    for (let i = 0; i < a.length; i += 2) out.push(<circle key={`${k}${i}`} cx={a[i]} cy={a[i + 1]} r={r} fill={c} />);
    return out;
};
const cruces = (a, r) => {
    let d = '';
    for (let i = 0; i < a.length; i += 2) d += `M${a[i] - r} ${a[i + 1] - r}L${a[i] + r} ${a[i + 1] + r}M${a[i] - r} ${a[i + 1] + r}L${a[i] + r} ${a[i + 1] - r}`;
    return d;
};

function Panorama() {
    const d = useMemo(() => segs(PANORAMA), []);
    return (
        <svg viewBox={`-6 -6 ${INFO.W + 12} ${INFO.H + 12}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            <path d={d} stroke="#6E7F8D" strokeWidth={0.18} fill="none" />
            {Object.entries(FRONTERA).map(([k, a]) => puntos(a, 1.1, COL[k], k))}
            {CONOS.map(c => (
                <g key={c.nombre} fill="none" stroke="#10243E">
                    <circle cx={c.x} cy={c.z} r={c.r_circulo} strokeWidth={0.9} />
                    <circle cx={c.x} cy={c.z} r={c.r_cono} strokeWidth={0.9} strokeDasharray="4 3" />
                    <text x={c.x} y={c.z + c.r_cono + 13} fontSize={11} textAnchor="middle" fill="#10243E" stroke="none"
                          fontFamily="var(--a3-sans, sans-serif)">{c.nombre}</text>
                </g>
            ))}
        </svg>
    );
}

function Ventana({ v }) {
    const d = useMemo(() => segs(v.aristas), [v]);
    const g = useMemo(() => cruces(v.fantasmas, 2.6), [v]);
    return (
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--sl-muted)', fontSize: 17, fontFamily: 'var(--a3-sans, sans-serif)' }}>{v.titulo}</span>
            <svg viewBox={`0 0 ${v.w} ${v.h}`} style={{ width: '100%', flex: 1, minHeight: 0 }} preserveAspectRatio="xMidYMid meet">
                <defs><clipPath id={`clip-${v.clave}`}><rect width={v.w} height={v.h} /></clipPath></defs>
                <g clipPath={`url(#clip-${v.clave})`}>
                    <path d={d} stroke="#6E7F8D" strokeWidth={0.5} fill="none" />
                    <path d={g} stroke="#6E7F8D" strokeWidth={1.1} />
                    {Object.entries(v.frontera).map(([k, a]) => puntos(a, 2.6, COL[k], k))}
                    {v.pozo && <circle cx={v.pozo[0]} cy={v.pozo[1]} r={4} fill="#C4511F" />}
                </g>
                <rect x={0.5} y={0.5} width={v.w - 1} height={v.h - 1} fill="none" stroke="var(--a3-filete, #C9D3DB)" />
            </svg>
        </div>
    );
}

export default function A3N32({ theme = 'dark' }) {
    return (
        <SlideLayout title="Malla compartida y refinada (BFR y FEniCSx)" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', flexShrink: 0, fontSize: 17, color: 'var(--sl-text)', whiteSpace: 'nowrap' }}>
                {Object.keys(COL).map(k => (
                    <span key={k}><span style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 6, background: COL[k], marginRight: 7 }} />{ETQ[k]}</span>
                ))}
                <span style={{ color: 'var(--sl-muted)' }}>× nodos fantasma (BFR)</span>
                <span style={{ color: 'var(--sl-muted)' }}>círculo 100 m y cono 500 m</span>
                <span style={{ marginLeft: 'auto', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans, sans-serif)', fontSize: 16 }}>
                    malla.pkl · {INFO.fecha}
                </span>
            </div>
            <div style={{ flex: 1.15, minHeight: 0 }}><Panorama /></div>
            <div style={{ display: 'flex', gap: 22, flex: 1, minHeight: 0 }}>
                {VENTANAS.map(v => <Ventana key={v.clave} v={v} />)}
            </div>
            <Punto color="#2E7D4F" size={17} style={{ flexShrink: 0 }}>
                Espaciado en 4 niveles: 4 m dentro del círculo de 100 m y 16 m en el cono hasta 500 m, alrededor del pozo y de la fuente;
                30 m junto a la frontera y 60 m lejos (más refinamiento donde <InlineMath math={String.raw`\log_{10}K`} /> cambia rápido).
                {' '}Esquinas saneadas: nodo exacto en cada vértice (grupo pared, normal bisectriz), frontera sin nodos desplazados
                y fantasmas a una distancia de vecino, todos fuera del dominio. {miles(INFO.n_dominio)} nodos, {miles(INFO.n_triangulos)} triángulos,
                ángulo {INFO.ang_min}°–{INFO.ang_max}°; BFR usa estos nodos más {INFO.n_fantasmas} fantasmas y FEniCSx los mismos triángulos.
            </Punto>
        </SlideLayout>
    );
}
