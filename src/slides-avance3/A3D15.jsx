import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Óptimo de los tres modelos de transporte (FEniCSx, malla con conos, γ = 1), todos desde Q_n = 0.1, z_p = −700 m.
// Izquierda: los tres pozos suben de z_p⁰ a su óptimo; centro: Ĵ por evaluación; derecha: términos del funcional.
const COLOR = { adr: '#C4511F', mrmt_semi: '#0F7A85', mrmt_block: '#5B4B8A' };
const GRIS = '#6E7F8D';

function Pozos({ f }) {
    const W = 380, H = 430, z0 = -150, z1 = -760;
    const sy = z => 30 + (z0 - z) / (z0 - z1) * (H - 60);
    const ms = OPT.modelos;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <rect x={0} y={sy(z0)} width={W} height={sy(z1) - sy(z0)} fill="#0F7A85" opacity="0.06" />
            {[-200, -300, -400, -500, -600, -700].map(z => (
                <g key={z}><line x1={58} x2={W - 6} y1={sy(z)} y2={sy(z)} stroke={GRIS} strokeOpacity="0.18" />
                    <text x={50} y={sy(z) + 5} textAnchor="end" style={eje}>{String(z).replace('-', '−')}</text></g>
            ))}
            <line x1={58} x2={W - 6} y1={sy(OPT.zp0)} y2={sy(OPT.zp0)} stroke={GRIS} strokeDasharray="5 4" strokeWidth="1.5" />
            <text x={W - 8} y={sy(OPT.zp0) + 20} textAnchor="end" style={eje}>inicio</text>
            {ms.map((m, i) => {
                const x = 115 + i * 95, z = lerp(OPT.zp0, m.zp, f);
                return (
                    <g key={m.id}>
                        <line x1={x} x2={x} y1={sy(z0)} y2={sy(z)} stroke={COLOR[m.id]} strokeWidth="5" />
                        <circle cx={x} cy={sy(z)} r="8" fill={COLOR[m.id]} />
                        <text x={x + 13} y={sy(z) + 5} style={{ ...eje, fontSize: 16, fill: COLOR[m.id], opacity: tramo(f, 0.9, 1) }}>
                            {Math.round(m.zp).toString().replace('-', '−')}
                        </text>
                        <text x={x} y={H - 6} textAnchor="middle" style={{ ...eje, fontSize: 15, fill: COLOR[m.id] }}>{m.nombre}</text>
                    </g>
                );
            })}
        </svg>
    );
}

function Historias({ f }) {
    const W = 440, H = 430, ms = OPT.modelos;
    const nmax = Math.max(...ms.map(m => m.historia.J.length));
    const todos = ms.flatMap(m => m.historia.J);
    // escala log: las evaluaciones de prueba de la búsqueda lineal llegan a Ĵ ≈ 3.4
    const a = Math.log10(Math.min(...todos)), b = Math.log10(Math.max(...todos));
    const sx = i => 52 + i / (nmax - 1) * (W - 62), sy = v => 20 + (b - Math.log10(v)) / (b - a) * (H - 70);
    const marcas = [0.5, 1, 2, 3].filter(v => Math.log10(v) >= a - 0.01 && Math.log10(v) <= b + 0.01);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {marcas.map(v => (
                <g key={v}><line x1={52} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={46} y={sy(v) + 5} textAnchor="end" style={eje}>{v}</text></g>
            ))}
            {ms.map(m => {
                const k = Math.max(1, Math.round(f * (m.historia.J.length - 1)));
                return <polyline key={m.id} points={m.historia.J.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')}
                                 fill="none" stroke={COLOR[m.id]} strokeWidth="2.4" />;
            })}
            <text x={52} y={H - 22} style={eje}>evaluación del funcional</text>
            {ms.map((m, i) => (
                <text key={m.id} x={52 + i * 125} y={H - 2} style={{ ...eje, fill: COLOR[m.id] }}>— {m.nombre}</text>
            ))}
        </svg>
    );
}

const filas = [
    ['nitrato captado', String.raw`\gamma J_m`, 'J1'],
    ['instalación', String.raw`\alpha J_{\rm inst}`, 'J2'],
    ['bombeo', String.raw`\beta J_{\rm op}`, 'J3'],
    ['total', String.raw`\hat J`, 'J'],
];

export default function A3D15({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(5500, 400);
    const f = suave(tramo(p, 0, 0.85));
    const ms = OPT.modelos;
    if (ms.length < 3) return <SlideLayout title="Óptimo por modelo" theme={theme}><p>Sin resultados.</p></SlideLayout>;
    return (
        <SlideLayout title="Óptimo por modelo" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '0.85fr 1fr 1.15fr', gap: 30, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Profundidad óptima <InlineMath math="z_p" /> [m]</p>
                    <Pozos f={f} />
                </div>
                <div>
                    <p style={tit}>Funcional <InlineMath math="\hat J" /> (escala log)</p>
                    <Historias f={f} />
                </div>
                <div>
                    <p style={tit}>Términos en el óptimo</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                        <thead><tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                            <th style={th}></th>
                            {ms.map(m => <th key={m.id} style={{ ...th, textAlign: 'right', color: COLOR[m.id] }}>{m.nombre}</th>)}
                        </tr></thead>
                        <tbody>
                            {filas.map(([nm, mt, k]) => (
                                <tr key={k} style={{ fontWeight: k === 'J' ? 700 : 400 }}>
                                    <td style={td}><InlineMath math={mt} /> <span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>{nm}</span></td>
                                    {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{Number(m.J[k]).toFixed(3)}</td>)}
                                </tr>
                            ))}
                            <tr style={{ borderTop: '1px solid var(--sl-muted)' }}>
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>iteraciones</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{m.nit}</td>)}
                            </tr>
                            <tr>
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>tanque mínimo [m³]</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{Math.min(...m.S).toFixed(1)}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    <p style={nota}>
                        Los tres óptimos quedan entre −470 y −420 m, por encima de los 300 m pedidos, con el mismo caudal medio
                        (<InlineMath math="\bar Q\approx 0.136" /> m²/s). El pozo semi queda más arriba y extrae agua con más nitrato
                        (<InlineMath math="\gamma J_m" /> mayor); el de bloque queda más hondo. En bloque, Ĵ termina por encima del valor inicial porque el
                        arranque no es admisible.
                    </p>
                </div>
            </div>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
const th = { padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '6px 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
