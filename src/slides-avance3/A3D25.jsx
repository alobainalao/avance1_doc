import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { OPT } from './optimoNitrato.js';

// Validación con casos triviales (ADR): lo que la intuición predice y lo que da el optimizador con EDP y adjunto
// (OPT.validaciones: experimentos/validacion_esperada.py y optimizacion_<variante>_<caso>/), más el pozo muy hondo del
// barrido de z_p (OPT.pareto). Mientras una corrida no termina se muestra su último iterado aceptado.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';
const M = (t) => <InlineMath math={t} />;
const V = OPT.validaciones || {};

function Estado({ ok, texto }) {
    const c = ok === true ? VALIDO : ok === false ? PLUMA : GRIS;
    return <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', fontWeight: 600, color: c, border: `1.5px solid ${c}`,
                          borderRadius: 4, padding: '1px 8px' }}>{texto}</span>;
}

// barras de Q_n (0 … Q_max) de una o dos series
function Barras({ series }) {
    const W = 380, H = 110, n = 72, bw = (W - 10) / n;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <line x1={5} x2={W - 5} y1={H - 14} y2={H - 14} stroke={GRIS} strokeOpacity="0.5" />
            {series.map((s, j) => s.Q && s.Q.map((q, k) => (
                <rect key={`${j}-${k}`} x={5 + k * bw + (j ? bw / 2 : 0)} width={series.length > 1 ? bw / 2 - 0.5 : bw - 1}
                      y={H - 14 - q / 0.2 * (H - 24)} height={q / 0.2 * (H - 24)} fill={s.c} opacity="0.8" />
            )))}
            <text x={5} y={H - 2} style={eje}>0 d</text>
            <text x={W - 5} y={H - 2} textAnchor="end" style={eje}>30 d</text>
        </svg>
    );
}

function Tarjeta({ titulo, caso, intuicion, children, estado }) {
    return (
        <div style={{ borderTop: '3px solid var(--sl-accent)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)' }}>{titulo}</p>
            <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>{caso}</p>
            <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                <span style={{ color: 'var(--sl-accent)' }}>Intuición: </span>{intuicion}
            </p>
            {children}
            <div>{estado}</div>
        </div>
    );
}

const fmtZ = z => `${String(Math.round(z)).replace('-', '−')} m`;

export default function A3D25({ theme = 'dark' }) {
    const sn = V.sin_nitrato || {}, sd = V.sin_demanda || {};
    const e1 = sn.esperado, o1 = sn.optimizador, o2 = sd.optimizador;
    const ok1 = e1 && o1 && o1.estado === 'final' ? Math.abs(o1.zp - e1.zp) < 5 && Math.abs(o1.J - e1.J) / e1.J < 0.01 : null;
    const qmax2 = o2 ? Math.max(...o2.Q) : null;
    const ok2 = o2 && o2.estado === 'final' ? qmax2 < 1e-3 : null;
    const P = OPT.pareto;
    const hondo = P ? P.zp.map((z, i) => ({ z, q: P.J1[i] })) : null;
    return (
        <SlideLayout title="Validación con casos triviales" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 12px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Antes de creer el óptimo, casos cuya respuesta se conoce sin resolver nada: el optimizador completo (EDP, adjunto y
                restricciones) tiene que reproducirla.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, alignItems: 'start' }}>
                <Tarjeta titulo="Sin nitrato" caso="Fuente apagada y concentración inicial cero (ADR)"
                         intuicion={<>{M('J_m\\equiv0')}: solo cuestan instalación y bombeo, que crecen con la profundidad. El pozo va a lo más somero
                             ({M('z_p=z_{\\max}=-200')} m) y bombea lo mínimo que cubre la demanda.</>}
                         estado={<Estado ok={ok1} texto={ok1 === true ? 'coincide' : ok1 === false ? 'no coincide' : 'corrida en curso'} />}>
                    {e1 && <p style={txt}>Exacto (problema cuadrático, sin EDP): {M(`z_p=${e1.zp.toFixed(0)}`)} m, {M(`\\hat J=${e1.J.toFixed(3)}`)}</p>}
                    {o1 && <p style={txt}>Optimizador (it. {o1.nit}): {M(`z_p=${o1.zp.toFixed(0)}`)} m, {M(`\\hat J=${o1.J.toFixed(3)}`)}</p>}
                    <Barras series={[{ Q: e1 && e1.Q, c: GRIS }, { Q: o1 && o1.Q, c: AGUA }]} />
                    <p style={nota}><span style={{ color: GRIS }}>■</span> exacto <span style={{ color: AGUA }}>■</span> optimizador; {M('Q_n')} en 30 días</p>
                </Tarjeta>
                <Tarjeta titulo="Sin demanda" caso="Demanda doméstica y de riego en cero (ADR)"
                         intuicion={<>No hace falta agua: bombear solo cuesta, así que {M('Q_n=0')} y el tanque se queda en{' '}
                             {M('S_0=500')} m³. La profundidad equilibra instalación y calidad.</>}
                         estado={<Estado ok={ok2} texto={ok2 === true ? 'coincide' : ok2 === false ? 'no coincide' : 'corrida en curso'} />}>
                    {o2 && <p style={txt}>Optimizador (it. {o2.nit}): {M(`\\max_n Q_n=${qmax2.toFixed(4)}`)}, {M(`z_p=`)} {fmtZ(o2.zp)}</p>}
                    {o2 && <p style={txt}>Tanque entre {Math.min(...o2.S).toFixed(0)} y {Math.max(...o2.S).toFixed(0)} m³</p>}
                    <Barras series={[{ Q: o2 && o2.Q, c: AGUA }]} />
                </Tarjeta>
                <Tarjeta titulo="Pozo muy hondo" caso="Mismo caudal, z_p cada vez más profundo (barrido)"
                         intuicion={<>La pluma está cerca de la superficie: un pozo muy hondo no la ve y{' '}
                             {M('J_m\\to0')}, mientras el costo sigue subiendo.</>}
                         estado={<Estado ok={hondo ? hondo.filter(o => o.z <= -1000).every(o => o.q < 1e-4) : null}
                                         texto={hondo ? (hondo.filter(o => o.z <= -1000).every(o => o.q < 1e-4) ? 'coincide' : 'no coincide') : 'barrido en curso'} />}>
                    {hondo && (
                        <table style={{ borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
                            <tbody>
                                {hondo.filter((o, i) => i % 2 === 0 || o.z <= -1000).map(o => (
                                    <tr key={o.z}><td style={{ ...td, color: 'var(--sl-muted)' }}>{fmtZ(o.z)}</td>
                                        <td style={{ ...td, textAlign: 'right' }}>{M(`J_m=${o.q < 1e-4 ? '0' : o.q.toFixed(3)}`)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Tarjeta>
            </div>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 12, fill: 'var(--sl-muted)' };
const txt = { margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 };
const nota = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' };
const td = { padding: '2px 12px 2px 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
