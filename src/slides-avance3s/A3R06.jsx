import React, { useMemo } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto } from '../slides-avance3/ui.jsx';
import { COL, ETQ, segs, puntos, cruces } from '../slides-avance3/A3N32.jsx';
import { INFO, PANORAMA, FRONTERA, VENTANAS, ELIPSES, FOCOS, EJE, CONO_POZO } from './mallaConosEje.js';

// Malla de la optimización (versión simplificada; copia de slides-avance3/A3N34.jsx con la malla con eje): data/input/
// malla_conos_eje/malla.pkl (preprocessing/malla_conos.py --h-eje 1), exportada con scripts/exportar_malla_presentacion.py
// --conos --malla=… a mallaConosEje.js. Cápsulas de 4 m en el pozo y en la fuente, conos de 16 m (pluma y pozo), franja de
// 1 m a menos de 5 m del eje del pozo, 30 m en la frontera y 60 m lejos. Es la de todas las corridas de la versión
// simplificada (estado, adjuntos y optimización); sin comparación con otras mallas.
const miles = (n) => n.toLocaleString('en-US').replace(/,/g, ' ');
const EJE_COL = '#B3261E';
// Título propio de la ventana del pozo: el punto de la exportación está en z = −700 m (pozo de la configuración), que no es
// la profundidad de la optimización; aquí se muestra solo la franja del eje.
const TITULOS = { pozo: 'Eje del pozo, x = 3 700 m (z de −800 a −600 m)' };
const linea = (a) => a.reduce((d, v, i) => d + (i % 2 ? ` ${v}` : `${i ? 'L' : 'M'}${v}`), '');

function Panorama() {
    const d = useMemo(() => segs(PANORAMA), []);
    return (
        <svg viewBox={`-6 -6 ${INFO.W + 12} ${INFO.H + 12}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            <path d={d} stroke="var(--a3-estrato)" strokeWidth={0.18} fill="none" />
            {Object.entries(FRONTERA).map(([k, a]) => puntos(a, 1.1, COL[k], k))}
            {ELIPSES.map((e, i) => <path key={i} d={linea(e) + 'Z'} fill="none" stroke="var(--sl-text)" strokeWidth={0.9} />)}
            {FOCOS.map(([x, z], i) => <circle key={`f${i}`} cx={x} cy={z} r={2.2} fill="var(--sl-text)" />)}
            <path d={linea(CONO_POZO) + 'Z'} fill="none" stroke="var(--sl-text)" strokeWidth={1.1} strokeDasharray="4 3" />
            <path d={linea(EJE)} fill="none" stroke={EJE_COL} strokeWidth={1.6} strokeDasharray="7 4" />
        </svg>
    );
}

function Ventana({ v }) {
    const d = useMemo(() => segs(v.aristas), [v]);
    const g = useMemo(() => cruces(v.fantasmas, 2.6), [v]);
    return (
        <div style={{ flex: v.w / v.h, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans, sans-serif)', whiteSpace: 'nowrap' }}>{TITULOS[v.clave] || v.titulo}</span>
            <svg viewBox={`0 0 ${v.w} ${v.h}`} style={{ width: '100%', flex: 1, minHeight: 0 }} preserveAspectRatio="xMidYMid meet">
                <defs><clipPath id={`clipc-${v.clave}`}><rect width={v.w} height={v.h} /></clipPath></defs>
                <g clipPath={`url(#clipc-${v.clave})`}>
                    <path d={d} stroke="var(--a3-estrato)" strokeWidth={0.5} fill="none" />
                    <path d={g} stroke="var(--a3-estrato)" strokeWidth={1.1} />
                    {Object.entries(v.frontera).map(([k, a]) => puntos(a, 2.6, COL[k], k))}
                    {v.eje && <path d={linea(v.eje)} fill="none" stroke={EJE_COL} strokeWidth={2} strokeDasharray="7 4" />}
                </g>
                <rect x={0.5} y={0.5} width={v.w - 1} height={v.h - 1} fill="none" stroke="var(--a3-filete, #C9D3DB)" />
            </svg>
        </div>
    );
}

export default function A3R06({ theme = 'dark' }) {
    return (
        <SlideLayout title="Malla de elementos finitos: la de la simulación y la optimización" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', flexShrink: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', whiteSpace: 'nowrap' }}>
                {Object.keys(COL).map(k => (
                    <span key={k}><span style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 6, background: COL[k], marginRight: 7 }} />{ETQ[k]}</span>
                ))}
                <span style={{ color: EJE_COL }}>– – eje de la pluma</span>
                <span style={{ color: 'var(--sl-muted)' }}>- - cono <span className="a3-completa">vertical </span>del pozo</span>
                <span style={{ color: 'var(--sl-muted)' }}>○ zonas de 4 m<span className="a3-completa"> (• centros)</span></span>
                <span className="a3-completa" style={{ marginLeft: 'auto', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans, sans-serif)', fontSize: 'var(--a3-fs-nota)' }}>
                    malla_conos_eje · {INFO.fecha}
                </span>
            </div>
            <div style={{ flex: 1.15, minHeight: 0 }}><Panorama /></div>
            <div style={{ display: 'flex', gap: 22, flex: 1, minHeight: 0 }}>
                {VENTANAS.map(v => <Ventana key={v.clave} v={v} />)}
            </div>
            <div className="a3-publica" style={{ flexShrink: 0 }}>
                <Punto color="var(--a3-agua)">
                    {miles(INFO.n_dominio)} nodos, {miles(INFO.n_triangulos)} triángulos: 1 m sobre el eje del pozo, 4 m en pozo y fuente,
                    16 m en los conos, 60 m lejos.
                </Punto>
            </div>
            <div className="a3-completa" style={{ flexShrink: 0 }}>
                <Punto color="var(--a3-agua)" size={17} style={{ flexShrink: 0 }}>
                    4 m en dos zonas formadas por un rectángulo de 100 m de ancho y dos círculos de radio 50 m: la del pozo, vertical, del pozo
                    a la cota z<sub>max</sub> = −200 m de la optimización (600 × 100 m, cubre lo que recorre z<sub>p</sub>), y la de la fuente,
                    horizontal, con un cuadrado de 100 m entre la fuente y 100 m aguas abajo (200 × 100 m). 16 m en el cono de la pluma
                    (línea de corriente de Darcy de la fuente a la salida) y en el cono vertical del pozo hasta la pluma; 30 m en la
                    frontera, también en el techo bajo la pluma; 60 m lejos. Sobre el eje del pozo, una franja de 1 m a menos de 5 m del eje: el
                    núcleo del pozo tiene <i>ε</i> ≈ 6.7 m y con 4 m la función objetivo ondulaba con la profundidad.{' '}{miles(INFO.n_dominio)} nodos,{' '}
                    {miles(INFO.n_triangulos)} triángulos, ángulo {INFO.ang_min}°–{INFO.ang_max}°. Es la malla de todas las corridas de esta presentación.
                </Punto>
            </div>
        </SlideLayout>
    );
}
