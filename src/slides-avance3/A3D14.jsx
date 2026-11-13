import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Resultado de la optimización (FEniCSx, malla con conos, γ = 1). J y z_p por evaluación, tal como las registró el
// optimizador; las barras de Q pasan del control inicial al óptimo (no son iteraciones intermedias).
const AGUA = '#0F7A85', PLUMA = '#C4511F', GRIS = '#6E7F8D';

function Serie({ y, f, color, W = 400, H = 210, etiqueta, fmt, lo, hi }) {
    const n = y.length, k = Math.max(1, Math.round(f * (n - 1)));
    const a = lo ?? Math.min(...y), b = hi ?? Math.max(...y);
    const sx = i => 50 + i / (n - 1) * (W - 60), sy = v => 14 + (b - v) / (b - a || 1) * (H - 44);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[a, (a + b) / 2, b].map(v => (
                <g key={v}><line x1={50} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={44} y={sy(v) + 5} textAnchor="end" style={eje}>{fmt(v)}</text></g>
            ))}
            <polyline points={y.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="2.6" />
            <circle cx={sx(k)} cy={sy(y[k])} r="5" fill={color} />
            <text x={50} y={H - 8} style={eje}>evaluación {k + 1} de {n}</text>
            <text x={W - 10} y={H - 8} textAnchor="end" style={{ ...eje, fill: color }}>{etiqueta}: {fmt(y[k])}</text>
        </svg>
    );
}

export default function A3D14({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6000, 400);
    const o = OPT.modelos[0];
    if (!o || !o.historia) return <SlideLayout title="Resultado de la optimización" theme={theme}><p>Sin resultados.</p></SlideLayout>;
    const f = suave(tramo(p, 0, 0.85));
    const W = 1260, H = 210, n = o.Q.length, bw = (W - 70) / n;
    const sy = q => 12 + (1 - q / 0.22) * (H - 40);
    const J0 = o.J0, Jf = o.J;
    const filas = [['nitrato captado', String.raw`\gamma J_m`, 'J1'], ['instalación', String.raw`\alpha J_{\rm inst}`, 'J2'], ['bombeo', String.raw`\beta J_{\rm op}`, 'J3'], ['total', String.raw`\hat J`, 'J']];
    return (
        <SlideLayout title={`Óptimo: el pozo sube a ${o.zp.toFixed(0)} m y el bombeo sigue la demanda`} theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.05fr', gap: 28, alignItems: 'start' }}>
                    <div>
                        <p style={tit}>Funcional <InlineMath math="\hat J" /></p>
                        <Serie y={o.historia.J} f={f} color={PLUMA} etiqueta="Ĵ" fmt={v => v.toFixed(3)} />
                    </div>
                    <div>
                        <p style={tit}>Profundidad <InlineMath math="z_p" /> [m]</p>
                        <Serie y={o.historia.zp} f={f} color={AGUA} etiqueta="z_p" fmt={v => v.toFixed(0)} />
                    </div>
                    <div>
                        <p style={tit}>Términos del funcional</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                            <thead><tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                                <th style={th}></th><th style={{ ...th, textAlign: 'right' }}>inicio</th><th style={{ ...th, textAlign: 'right' }}>óptimo</th></tr></thead>
                            <tbody>
                                {filas.map(([nm, m, k]) => (
                                    <tr key={k} style={{ fontWeight: k === 'J' ? 700 : 400 }}>
                                        <td style={td}><InlineMath math={m} /> <span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-etiqueta)' }}>{nm}</span></td>
                                        <td style={{ ...td, textAlign: 'right', color: 'var(--sl-muted)' }}>{Number(J0[k]).toFixed(3)}</td>
                                        <td style={{ ...td, textAlign: 'right', opacity: tramo(p, 0.85, 1) }}>{Number(Jf[k]).toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p style={nota}>Inicio: <InlineMath math="Q_n=0.1" />, <InlineMath math="z_p=-700" /> m, que no es admisible (vacía el tanque): el óptimo baja Ĵ y además cumple todas las restricciones.</p>
                    </div>
                </div>
                <p style={{ ...tit, marginTop: 14 }}>
                    Caudal <InlineMath math="Q_n" /> [m²/s] en los 72 intervalos: <span style={{ color: GRIS }}>inicial</span> →{' '}
                    <span style={{ color: AGUA }}>óptimo</span>, con la cota <span style={{ color: PLUMA }}><InlineMath math="Q_{\max}a(\tau)" /></span>
                </p>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
                    {[0, 0.1, 0.2].map(v => <g key={v}><line x1={60} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                        <text x={52} y={sy(v) + 5} textAnchor="end" style={eje}>{v.toFixed(1)}</text></g>)}
                    <polyline points={OPT.cota.map((c, k) => `${60 + k * bw},${sy(c)} ${60 + (k + 1) * bw},${sy(c)}`).join(' ')} fill="none" stroke={PLUMA} strokeDasharray="5 4" strokeWidth="1.8" />
                    {o.Q.map((q, k) => {
                        const v = lerp(OPT.Q0[k], q, f);
                        return <rect key={k} x={60 + k * bw + 1.5} width={bw - 3} y={sy(v)} height={sy(0) - sy(v)} fill={f < 1 ? GRIS : AGUA} opacity={0.35 + 0.5 * f} />;
                    })}
                    {[0, 10, 20, 30].map(d => <text key={d} x={60 + d / 30 * (W - 70)} y={H - 6} textAnchor="middle" style={eje}>{d} d</text>)}
                </svg>
            </div>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const th = { padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '6px 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
