import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica } from './version.jsx';

// Mejor iterado (preliminar) de los tres modelos de transporte (FEniCSx, malla con conos y eje de 1 m, γ = 1), todos desde Q_n = 0.1,
// z_p = −700 m. Izquierda: los tres pozos suben de z_p⁰ a donde paró el optimizador; centro: evaluación cruzada (Ĵ de
// cada modelo en el punto de cada corrida, experimentos/evaluar_optimos.py); derecha: términos del funcional.
const COLOR = { adr: 'var(--a3-pluma)', mrmt_semi: 'var(--a3-agua)', mrmt_block: '#5B4B8A' };
const GRIS = 'var(--a3-estrato)', VALIDO = 'var(--a3-valido)';

// Bloque paró antes de su óptimo: su Ĵ es menor en el punto de semi (evaluación cruzada) y semi y bloque dan el mismo Ĵ
// a 4·10⁻⁴ en cualquier punto. ADR también mejora con el caudal de semi, pero su z_p lo confirma el barrido de Ĵ(z_p).
const PARO_ANTES = ['mrmt_block'];
const paroAntes = m => PARO_ANTES.includes(m.id);

function Pozos({ f }) {
    const W = 380, H = 430, z0 = -150, z1 = -760;
    const pub = usePublica(), ej = pub ? { ...eje, fontSize: 16 } : eje;
    const sy = z => 30 + (z0 - z) / (z0 - z1) * (H - 60);
    const ms = OPT.modelos;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <rect x={0} y={sy(z0)} width={W} height={sy(z1) - sy(z0)} fill="var(--a3-agua)" opacity="0.06" />
            {[-200, -300, -400, -500, -600, -700].map(z => (
                <g key={z}><line x1={58} x2={W - 6} y1={sy(z)} y2={sy(z)} stroke={GRIS} strokeOpacity="0.18" />
                    <text x={50} y={sy(z) + 5} textAnchor="end" style={ej}>{String(z).replace('-', '−')}</text></g>
            ))}
            <line x1={58} x2={W - 6} y1={sy(OPT.zp0)} y2={sy(OPT.zp0)} stroke={GRIS} strokeDasharray="5 4" strokeWidth="1.5" />
            <text x={W - 8} y={sy(OPT.zp0) + 20} textAnchor="end" style={ej}>inicio</text>
            {ms.map((m, i) => {
                const x = 115 + i * 95, z = lerp(OPT.zp0, m.zp, f);
                return (
                    <g key={m.id}>
                        <line x1={x} x2={x} y1={sy(z0)} y2={sy(z)} stroke={COLOR[m.id]} strokeWidth="5" />
                        <circle cx={x} cy={sy(z)} r="8" fill={paroAntes(m) ? 'var(--sl-bg, #fff)' : COLOR[m.id]} stroke={COLOR[m.id]} strokeWidth="3" />
                        <text x={x + 13} y={sy(z) + 5} style={{ ...eje, fontSize: pub ? 18 : 16, fill: COLOR[m.id], opacity: tramo(f, 0.9, 1) }}>
                            {Math.round(m.zp).toString().replace('-', '−')}
                        </text>
                        {paroAntes(m) && <text x={x + 13} y={sy(z) + 24} style={{ ...eje, fontSize: 13, fill: COLOR[m.id], opacity: tramo(f, 0.9, 1) }}>paró antes</text>}
                        <text x={x} y={H - 6} textAnchor="middle" style={{ ...eje, fontSize: 15, fill: COLOR[m.id] }}>{m.nombre}</text>
                    </g>
                );
            })}
        </svg>
    );
}

// Ĵ del modelo de la fila en el punto donde paró la corrida de la columna; en verde el menor de cada fila
function Cruce({ f }) {
    const ms = OPT.modelos;
    const J = (fila, x) => (fila === x ? ms.find(m => m.id === fila).J.J : (OPT.cruce.find(c => c.modelo === fila && c.x_de === x) || {}).J);
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
            <thead>
                <tr><th style={th}>modelo \ punto de</th>
                    {ms.map(m => <th key={m.id} style={{ ...th, textAlign: 'right', color: COLOR[m.id] }}>{m.nombre}<br />{Math.round(m.zp).toString().replace('-', '−')} m</th>)}</tr>
            </thead>
            <tbody>
                {ms.map((fila, i) => {
                    const vals = ms.map(x => J(fila.id, x.id)), min = Math.min(...vals.filter(v => v !== undefined));
                    return (
                        <tr key={fila.id} style={{ borderTop: '1px solid var(--a3-filete, #C9D3DB)', opacity: 0.25 + 0.75 * tramo(f, 0.2 + 0.2 * i, 0.4 + 0.2 * i) }}>
                            <td style={{ ...td, color: COLOR[fila.id] }}>{fila.nombre}</td>
                            {vals.map((v, k) => (
                                <td key={k} style={{ ...td, textAlign: 'right', color: v === min ? VALIDO : 'var(--sl-text)', fontWeight: v === min ? 700 : 400,
                                                     outline: k === i ? '1.5px dashed var(--sl-muted)' : 'none', outlineOffset: -4 }}>
                                    {v === undefined ? '—' : v.toFixed(4)}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

const filas = [
    ['calidad del agua', String.raw`\gamma J_m`, 'J1'],
    ['instalación', String.raw`\alpha J_{\rm inst}`, 'J2'],
    ['bombeo', String.raw`\beta J_{\rm op}`, 'J3'],
    ['total', String.raw`\hat J`, 'J'],
];

export default function A3D15({ theme = 'dark' }) {
    const [p] = useProgreso(5500, 400);
    const pub = usePublica();
    const f = suave(tramo(p, 0, 0.85));
    const ms = OPT.modelos;
    if (ms.length < 3) return <SlideLayout title="Mejor iterado por modelo (preliminar)" theme={theme}><p>Sin resultados.</p></SlideLayout>;
    return (
        <SlideLayout title="Mejor iterado por modelo (preliminar)" theme={theme} justify="flex-start">
            <div
                 style={{ display: 'grid', gridTemplateColumns: '0.85fr 1fr 1.15fr', gap: 30, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Profundidad <InlineMath math="z_p" /> donde paró cada corrida [m]</p>
                    <Pozos f={f} />
                </div>
                <div>
                    <p style={tit}>Evaluación cruzada de <InlineMath math="\hat J" /></p>
                    <Cruce f={f} />
                    <p className="a3-completa" style={nota}>
                        Cada fila evalúa un modelo en el punto donde paró cada corrida (en verde, el menor; punteado, el propio).
                        El punto de semi es el mejor en las tres filas. Semi y bloque difieren menos de 4·10⁻⁴ en los tres puntos
                        evaluados: son dos esquemas del mismo modelo continuo, así que bloque paró antes de su óptimo (≈ −405 m). En ADR el
                        caudal aún se afina.
                    </p>
                    <p className="a3-publica" style={nota}>
                        En verde, el menor de cada fila: el punto de semi gana en las tres; bloque paró antes.
                    </p>
                </div>
                <div>
                    <p style={tit}>Términos en el mejor iterado</p>
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
                            <tr className="a3-completa" style={{ borderTop: '1px solid var(--sl-muted)' }}>
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>iteraciones</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{m.nit}</td>)}
                            </tr>
                            <tr style={pub ? { borderTop: '1px solid var(--sl-muted)' } : undefined}>
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>criticidad χ (meta 10⁻⁴)</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{m.chi ? m.chi.toExponential(1).replace('e-', '·10⁻').replace(/(\d)$/, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]) : '—'}</td>)}
                            </tr>
                            <tr className="a3-completa">
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>tanque mínimo [m³]</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{Math.min(...m.S).toFixed(1)}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    <p className="a3-completa" style={nota}>
                        Mismo caudal medio (<InlineMath math="\bar Q\approx 0.136" /> m²/s); la cota inferior del tanque queda activa. MRMT pide un pozo
                        más hondo que ADR (siguiente lámina). Todos bajan Ĵ respecto al arranque (0.467), que además no es admisible.
                    </p>
                    <p className="a3-publica" style={nota}>Todos mejoran el arranque (Ĵ = 0.467, no admisible).</p>
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
