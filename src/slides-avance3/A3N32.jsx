import React, { useMemo } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { InlineMath } from 'react-katex';
import { Punto, Cols, Col, Titulo, Tabla } from './ui.jsx';
import { NODOS, ZOOM, POZO, VENTANA } from './mallaCompartida.js';

// Malla compartida BFR + FEniCSx (codigo/preprocessing/malla_compartida.py; meta de malla.pkl, 2026-10-24).
const XMIN = 816, XMAX = 10755, ZMIN = -2690.5, ZMAX = 250.5;
const VERT = [[816, -2690.5], [4354, -1757.5], [10755, -768.5], [10755, 250.5], [816, 250.5]];

const cols = [{ k: 'a', label: 'Dato' }, { k: 'b', label: 'Valor', mono: true }];
const rows = [
    { a: 'Nodos del dominio / fantasmas', b: '15 626 / 862' },
    { a: 'Triángulos (CDT)', b: '30 388' },
    { a: 'Ángulo mínimo / máximo', b: '28.0° / 121°' },
    { a: 'h junto al pozo (r < 50 m)', b: '4.9 m' },
    { a: 'h en el cono (r < 500 m)', b: '12 m' },
    { a: 'h medio en todo el dominio', b: '29 m' },
];

function Panorama() {
    const W = 1000, H = Math.round(W * (ZMAX - ZMIN) / (XMAX - XMIN));
    const sx = x => (x - XMIN) / (XMAX - XMIN) * W, sz = z => (ZMAX - z) / (ZMAX - ZMIN) * H;
    const puntos = useMemo(() => {
        let d = '';
        for (let i = 0; i < NODOS.length; i += 2) d += `M${sx(NODOS[i]).toFixed(1)} ${sz(NODOS[i + 1]).toFixed(1)}h0.8`;
        return d;
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps
    const poly = VERT.map(([x, z]) => `${sx(x)},${sz(z)}`).join(' ');
    const w = VENTANA;
    return (
        <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} style={{ width: '100%', height: 'auto' }}>
            <polygon points={poly} fill="rgba(0,216,255,0.04)" stroke="rgba(0,216,255,0.6)" strokeWidth={1.5} />
            <path d={puntos} stroke="#94a3b8" strokeWidth={1.1} strokeLinecap="round" />
            <rect x={sx(POZO[0] - w)} y={sz(POZO[1] + w)} width={sx(POZO[0] + w) - sx(POZO[0] - w)} height={sz(POZO[1] - w) - sz(POZO[1] + w)}
                  fill="none" stroke="#fb923c" strokeWidth={2} />
            <circle cx={sx(POZO[0])} cy={sz(POZO[1])} r={4} fill="#f87171" />
        </svg>
    );
}

function Zoom() {
    const S = 400, w = VENTANA;
    const sx = x => (x - (POZO[0] - w)) / (2 * w) * S, sz = z => ((POZO[1] + w) - z) / (2 * w) * S;
    const d = useMemo(() => {
        let s = '';
        for (let i = 0; i < ZOOM.length; i += 4) s += `M${sx(ZOOM[i]).toFixed(1)} ${sz(ZOOM[i + 1]).toFixed(1)}L${sx(ZOOM[i + 2]).toFixed(1)} ${sz(ZOOM[i + 3]).toFixed(1)}`;
        return s;
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <svg viewBox={`0 0 ${S} ${S}`} style={{ width: '100%', height: '100%', maxHeight: '100%' }}>
            <defs><clipPath id="zoomClip"><rect x={0} y={0} width={S} height={S} /></clipPath></defs>
            <g clipPath="url(#zoomClip)">
                <path d={d} stroke="#94a3b8" strokeWidth={0.6} fill="none" />
                <circle cx={sx(POZO[0])} cy={sz(POZO[1])} r={20 / (2 * w) * S} fill="none" stroke="#f87171" strokeWidth={1.5} strokeDasharray="4 3" />
                <circle cx={sx(POZO[0])} cy={sz(POZO[1])} r={3} fill="#f87171" />
            </g>
            <rect x={0.5} y={0.5} width={S - 1} height={S - 1} fill="none" stroke="#fb923c" strokeWidth={2} />
        </svg>
    );
}

export default function A3N32({ theme = 'dark' }) {
    return (
        <SlideLayout title="Malla compartida y refinada (BFR y FEniCSx)" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6} gap={10}>
                    <Panorama />
                    <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
                        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'var(--sl-muted)', fontSize: 18, fontWeight: 700 }}>
                                Zoom ±{VENTANA} m alrededor del pozo (círculo: <InlineMath math="r_{\rm pozo}=20\,\mathrm{m}" />)
                            </span>
                            <div style={{ flex: 1, minHeight: 0 }}><Zoom /></div>
                        </div>
                    </div>
                </Col>
                <Col flex={4} gap={10}>
                    <Titulo>Cómo se construye</Titulo>
                    <Punto size={19}>Espaciado en 4 niveles: 4 m en el pozo, 16 m en el cono (r ≤ 500 m), 30 m en la frontera y 60 m lejos.</Punto>
                    <Punto size={19}>Refinamiento extra donde <InlineMath math="\log_{10}K" /> cambia más de 0.3 décadas por espaciado (h ≥ 15 m).</Punto>
                    <Punto size={19}>Saneada: nodo exacto en el pozo y en cada esquina, sin nodos pegados al borde, triangulación restringida con ángulo ≥ 28°.</Punto>
                    <Punto color="#4ade80" size={19}>BFR usa estos nodos (más 862 fantasmas) y FEniCSx los mismos triángulos sin retriangular: comparación nodo a nodo, sin interpolar.</Punto>
                    <Tabla cols={cols} rows={rows} size={18} />
                </Col>
            </Cols>
        </SlideLayout>
    );
}
