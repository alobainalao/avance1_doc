import React, { useMemo } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto } from './ui.jsx';
import { COL, ETQ, segs, puntos, cruces } from './A3N32.jsx';
import { INFO as INFO_BASE } from './mallaCompartida.js';
import { INFO, PANORAMA, FRONTERA, VENTANAS, ELIPSES, FOCOS, EJE, CONO_POZO } from './mallaConos.js';

// Malla con conos (data/input/malla_conos/malla.pkl, preprocessing/malla_conos.py): cápsulas de 4 m (rectángulo +
// 2 círculos de 50 m) en el pozo (vertical, sobre la zona de la optimización) y en la fuente (horizontal), el cono horizontal de la pluma y el
// vertical del pozo como nivel de 16 m, 30 m en la frontera y 60 m lejos. Aún no se usa en las corridas.
const miles = (n) => n.toLocaleString('en-US').replace(/,/g, ' ');
const EJE_COL = '#B3261E';
const linea = (a) => a.reduce((d, v, i) => d + (i % 2 ? ` ${v}` : `${i ? 'L' : 'M'}${v}`), '');

function Panorama() {
    const d = useMemo(() => segs(PANORAMA), []);
    return (
        <svg viewBox={`-6 -6 ${INFO.W + 12} ${INFO.H + 12}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            <path d={d} stroke="#6E7F8D" strokeWidth={0.18} fill="none" />
            {Object.entries(FRONTERA).map(([k, a]) => puntos(a, 1.1, COL[k], k))}
            {ELIPSES.map((e, i) => <path key={i} d={linea(e) + 'Z'} fill="none" stroke="#10243E" strokeWidth={0.9} />)}
            {FOCOS.map(([x, z], i) => <circle key={`f${i}`} cx={x} cy={z} r={2.2} fill="#10243E" />)}
            <path d={linea(CONO_POZO) + 'Z'} fill="none" stroke="#10243E" strokeWidth={1.1} strokeDasharray="4 3" />
            <path d={linea(EJE)} fill="none" stroke={EJE_COL} strokeWidth={1.6} strokeDasharray="7 4" />
        </svg>
    );
}

function Ventana({ v }) {
    const d = useMemo(() => segs(v.aristas), [v]);
    const g = useMemo(() => cruces(v.fantasmas, 2.6), [v]);
    return (
        <div style={{ flex: v.w / v.h, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--sl-muted)', fontSize: 17, fontFamily: 'var(--a3-sans, sans-serif)', whiteSpace: 'nowrap' }}>{v.titulo}</span>
            <svg viewBox={`0 0 ${v.w} ${v.h}`} style={{ width: '100%', flex: 1, minHeight: 0 }} preserveAspectRatio="xMidYMid meet">
                <defs><clipPath id={`clipc-${v.clave}`}><rect width={v.w} height={v.h} /></clipPath></defs>
                <g clipPath={`url(#clipc-${v.clave})`}>
                    <path d={d} stroke="#6E7F8D" strokeWidth={0.5} fill="none" />
                    <path d={g} stroke="#6E7F8D" strokeWidth={1.1} />
                    {Object.entries(v.frontera).map(([k, a]) => puntos(a, 2.6, COL[k], k))}
                    {v.eje && <path d={linea(v.eje)} fill="none" stroke={EJE_COL} strokeWidth={2} strokeDasharray="7 4" />}
                    {v.pozo && <circle cx={v.pozo[0]} cy={v.pozo[1]} r={4} fill="#C4511F" />}
                </g>
                <rect x={0.5} y={0.5} width={v.w - 1} height={v.h - 1} fill="none" stroke="var(--a3-filete, #C9D3DB)" />
            </svg>
        </div>
    );
}

export default function A3N34({ theme = 'dark' }) {
    const extra = Math.round((INFO.n_dominio / INFO_BASE.n_dominio - 1) * 100);
    return (
        <SlideLayout title="Malla con conos: refinada en la pluma y sobre el pozo" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', flexShrink: 0, fontSize: 17, color: 'var(--sl-text)', whiteSpace: 'nowrap' }}>
                {Object.keys(COL).map(k => (
                    <span key={k}><span style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 6, background: COL[k], marginRight: 7 }} />{ETQ[k]}</span>
                ))}
                <span style={{ color: EJE_COL }}>– – eje de la pluma</span>
                <span style={{ color: 'var(--sl-muted)' }}>- - cono vertical del pozo</span>
                <span style={{ color: 'var(--sl-muted)' }}>○ zonas de 4 m (• centros)</span>
                <span style={{ marginLeft: 'auto', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans, sans-serif)', fontSize: 16 }}>
                    malla_conos · {INFO.fecha}
                </span>
            </div>
            <div style={{ flex: 1.15, minHeight: 0 }}><Panorama /></div>
            <div style={{ display: 'flex', gap: 22, flex: 1, minHeight: 0 }}>
                {VENTANAS.map(v => <Ventana key={v.clave} v={v} />)}
            </div>
            <Punto color="#0F7A85" size={17} style={{ flexShrink: 0 }}>
                4 m en dos zonas formadas por un rectángulo de 100 m de ancho y dos círculos de radio 50 m: la del pozo, vertical, del pozo
                a la cota z<sub>max</sub> = −200 m de la optimización (600 × 100 m, cubre lo que recorre z<sub>p</sub>), y la de la fuente,
                horizontal, con un cuadrado de 100 m entre la fuente y 100 m aguas abajo (200 × 100 m). 16 m en el cono de la pluma
                (línea de corriente de Darcy de la fuente a la salida) y en el cono vertical del pozo hasta la pluma; 30 m en la
                frontera, también en el techo bajo la pluma; 60 m lejos.{' '}{miles(INFO.n_dominio)} nodos
                ({extra > 0 ? '+' : '−'}{Math.abs(extra)} % frente a {miles(INFO_BASE.n_dominio)}), ángulo {INFO.ang_min}°–{INFO.ang_max}°.
                Los resultados de esta presentación usan todavía la malla compartida.
            </Punto>
        </SlideLayout>
    );
}
