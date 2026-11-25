import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';
import { AvisoPreliminar } from './preliminar.jsx';

// Mejor iterado (preliminar, serie anterior) de los tres modelos de transporte (FEniCSx, malla con conos y eje de 1 m, γ = 1),
// todos desde Q_n = 0.1, z_p = −700 m. Izquierda: los tres pozos suben de z_p⁰ a donde paró el optimizador; centro: evaluación
// cruzada (Ĵ de cada modelo en el punto de cada corrida, experimentos/evaluar_optimos.py); derecha: términos del funcional.
const COLOR = { adr: 'var(--a3-pluma)', mrmt_semi: 'var(--a3-agua)', mrmt_block: '#5B4B8A' };
const GRIS = 'var(--a3-estrato)', VALIDO = 'var(--a3-valido)';
const M = (t) => <InlineMath math={t} />;

// Bloque paró antes de su óptimo: su Ĵ es menor en el punto de semi (evaluación cruzada) y semi y bloque dan casi el mismo Ĵ
// en cualquier punto. ADR también mejora con el caudal de semi, pero su z_p lo confirma el barrido de Ĵ(z_p).
const PARO_ANTES = ['mrmt_block'];
const paroAntes = m => PARO_ANTES.includes(m.id);

// Por qué MRMT pide un pozo más hondo, con los datos de la antigua A3D19 (fuera de la secuencia): barrido de Ĵ(z_p) con el
// mismo caudal (iterado 38 de ADR) en ADR y MRMT semi, y la concentración en el pozo con z_p = −383 m (OPT.analisis).
// Vértice de la parábola por los tres puntos alrededor del mínimo muestreado.
function vertice(z, J) {
    const i = Math.min(Math.max(1, J.indexOf(Math.min(...J))), J.length - 2), h = z[i + 1] - z[i];
    const c2 = (J[i - 1] - 2 * J[i] + J[i + 1]) / (h * h), c1 = (J[i + 1] - J[i - 1]) / (2 * h);
    return z[i] - c1 / c2;
}
function porQueHondo() {
    const B = OPT.analisis && OPT.analisis.barrido, D = OPT.analisis && OPT.analisis.diag;
    if (!B || !B.adr || !B.mrmt_semi || !D || !D.adr || !D.mrmt_semi) return null;
    const r = B.adr.J1.map((v, i) => B.mrmt_semi.J1[i] / v);
    const ca = D.adr.Cpozo, cs = D.mrmt_semi.Cpozo, n = ca.length, dia = i => (i + 1) * OPT.dt / 86400;
    return {
        rmin: Math.min(...r), rmax: Math.max(...r), zA: vertice(B.adr.zp, B.adr.J), zS: vertice(B.mrmt_semi.zp, B.mrmt_semi.J),
        z0: B.adr.zp[0], z1: B.adr.zp[B.adr.zp.length - 1], zDiag: D.adr.zp,
        inicio: cs[0] / ca[0], fin: cs[n - 1] / ca[n - 1], picoA: dia(ca.indexOf(Math.max(...ca))),
        picoS: dia(cs.indexOf(Math.max(...cs))), cruce: dia(cs.findIndex((v, i) => v > ca[i])),
    };
}

const fmtZ = z => String(Math.round(z)).replace('-', '−');

// 4.04e-4 → «4.0·10⁻⁴»
const cientifico = v => {
    const [m, e] = v.toExponential(1).split('e');
    return `${m}·10${[...e.replace('+', '')].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('')}`;
};

function Pozos({ f }) {
    const W = 380, H = 460, z0 = -150, z1 = -760;
    const pub = usePublica(), ej = { ...eje, fontSize: pub ? 22 : 18 };
    const sy = z => 30 + (z0 - z) / (z0 - z1) * (H - 90);
    const ms = OPT.modelos;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <rect x={0} y={sy(z0)} width={W} height={sy(z1) - sy(z0)} fill="var(--a3-agua)" opacity="0.06" />
            {[-200, -300, -400, -500, -600, -700].map(z => (
                <g key={z}><line x1={62} x2={W - 6} y1={sy(z)} y2={sy(z)} stroke={GRIS} strokeOpacity="0.18" />
                    <text x={54} y={sy(z) + 6} textAnchor="end" style={ej}>{String(z).replace('-', '−')}</text></g>
            ))}
            <line x1={62} x2={W - 6} y1={sy(OPT.zp0)} y2={sy(OPT.zp0)} stroke={GRIS} strokeDasharray="5 4" strokeWidth="1.5" />
            <text x={W - 8} y={sy(OPT.zp0) + 24} textAnchor="end" style={ej}>inicio</text>
            {ms.map((m, i) => {
                const x = 112 + i * 92, z = lerp(OPT.zp0, m.zp, f), [l1, ...l2] = m.nombre.split(' ');
                return (
                    <g key={m.id}>
                        <line x1={x} x2={x} y1={sy(z0)} y2={sy(z)} stroke={COLOR[m.id]} strokeWidth="5" />
                        <circle cx={x} cy={sy(z)} r="8" fill={paroAntes(m) ? 'var(--sl-bg, #fff)' : COLOR[m.id]} stroke={COLOR[m.id]} strokeWidth="3" />
                        <text x={x + 13} y={sy(z) + 6} style={{ ...eje, fontSize: pub ? 23 : 19, fill: COLOR[m.id], opacity: tramo(f, 0.9, 1) }}>
                            {Math.round(m.zp).toString().replace('-', '−')}
                        </text>
                        {paroAntes(m) && <text x={x} y={sy(z) + 34} textAnchor="middle" style={{ ...eje, fontSize: pub ? 19 : 16, fill: COLOR[m.id], opacity: tramo(f, 0.9, 1) }}>paró antes</text>}
                        <text x={x} y={H - 34} textAnchor="middle" style={{ ...eje, fontSize: pub ? 22 : 18, fill: COLOR[m.id] }}>{l1}</text>
                        {l2.length > 0 && <text x={x} y={H - 10} textAnchor="middle" style={{ ...eje, fontSize: pub ? 22 : 18, fill: COLOR[m.id] }}>{l2.join(' ')}</text>}
                    </g>
                );
            })}
        </svg>
    );
}

// Ĵ del modelo de la fila en el punto donde paró la corrida de la columna; en verde el menor de cada fila
const Jcruce = (fila, x) => (fila === x ? OPT.modelos.find(m => m.id === fila).J.J : (OPT.cruce.find(c => c.modelo === fila && c.x_de === x) || {}).J);

function Cruce({ f }) {
    const ms = OPT.modelos;
    const tdc = { ...td, fontSize: usePublica() ? 'var(--a3-fs-etiqueta)' : 'var(--a3-fs-cuerpo)', padding: '6px 6px' };
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
            <thead>
                <tr><th style={th}>modelo \ punto de</th>
                    {ms.map(m => <th key={m.id} style={{ ...th, textAlign: 'right', color: COLOR[m.id] }}>{m.nombre}<br />{Math.round(m.zp).toString().replace('-', '−')} m</th>)}</tr>
            </thead>
            <tbody>
                {ms.map((fila, i) => {
                    const vals = ms.map(x => Jcruce(fila.id, x.id)), min = Math.min(...vals.filter(v => v !== undefined));
                    return (
                        <tr key={fila.id} style={{ borderTop: '1px solid var(--a3-filete, #C9D3DB)', opacity: 0.25 + 0.75 * tramo(f, 0.2 + 0.2 * i, 0.4 + 0.2 * i) }}>
                            <td style={{ ...tdc, color: COLOR[fila.id] }}>{fila.nombre}</td>
                            {vals.map((v, k) => (
                                <td key={k} style={{ ...tdc, textAlign: 'right', color: v === min ? VALIDO : 'var(--sl-text)', fontWeight: v === min ? 700 : 400,
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
    const id = k => ms.find(m => m.id === k);
    const semi = id('mrmt_semi'), bloque = id('mrmt_block'), adr = id('adr');
    // mayor diferencia semi–bloque en los tres puntos
    const dSB = Math.max(...ms.map(x => Math.abs(Jcruce('mrmt_semi', x.id) - Jcruce('mrmt_block', x.id))));
    const J0 = Math.max(...ms.map(m => m.J0.J));
    const dModelos = Math.max(...ms.map(m => m.J.J)) - Math.min(...ms.map(m => m.J.J));
    const H = porQueHondo();
    const pct = v => Math.round((v - 1) * 100);
    // volumen bombeado en 30 días por cada modelo: lo fija la demanda (balance del tanque)
    const vol = ms.map(m => OPT.V_s * OPT.dt * m.Q.reduce((a, b) => a + b, 0));
    const miles = v => Math.round(v).toLocaleString('es-MX').replace(/,/g, '\u202f');      // espacio fino que no corta la cifra
    return (
        <SlideLayout title="Mejor iterado por modelo (preliminar, serie anterior)" theme={theme} justify="flex-start">
            <AvisoPreliminar style={{ marginBottom: 6 }}>
                <span className="a3-completa">; el orden entre modelos queda por confirmar</span>
            </AvisoPreliminar>
            <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1fr 1.15fr', gap: 30, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Profundidad {M('z_p')} donde paró cada corrida [m]</p>
                    <Pozos f={f} />
                    {H && <p style={{ ...nota, color: 'var(--sl-text)', opacity: tramo(p, 0.85, 1) }}>
                        <b style={{ color: COLOR.mrmt_semi, fontWeight: 600 }}>¿Por qué MRMT más hondo?</b> Con el mismo caudal, MRMT retiene el
                        nitrato y lo entrega más tarde: {M('J_m')} {pct(H.rmin)}–{pct(H.rmax)} % mayor, que baja más rápido al
                        profundizar ⇒ mínimo ≈ {Math.round(H.zA - H.zS)} m más hondo<span className="a3-completa"> (barrido de{' '}
                        {M('\\hat J(z_p)')}, notas)</span>.
                    </p>}
                </div>
                <div>
                    <p style={tit}>Evaluación cruzada de {M('\\hat J')}</p>
                    <Cruce f={f} />
                    <p className="a3-completa" style={nota}>
                        Cada fila: {M('\\hat J')} de un modelo en el punto donde paró cada corrida (verde: el menor de la fila; punteado: el
                        propio). En esta serie, el punto de semi fue el mejor en las tres filas: semi y bloque difieren a lo más{' '}
                        {cientifico(dSB)}, así que bloque paró antes de su óptimo.
                    </p>
                    <p className="a3-publica" style={nota}>
                        Verde: el menor de cada fila. El punto de semi gana en las tres; bloque paró antes.
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
                                <tr key={k} style={{ fontWeight: k === 'J' ? 700 : 400, borderTop: k === 'J' ? '1px solid var(--a3-filete)' : 'none' }}>
                                    <td style={td}>{M(mt)} <span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)', fontWeight: 400 }}>{nm}</span></td>
                                    {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{Number(m.J[k]).toFixed(3)}</td>)}
                                </tr>
                            ))}
                            <tr className="a3-completa" style={{ borderTop: '1px solid var(--sl-muted)' }}>
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>iteraciones</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{m.nit}</td>)}
                            </tr>
                            <tr style={pub ? { borderTop: '1px solid var(--sl-muted)' } : undefined}>
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>criticidad χ (meta 10⁻⁴)</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{m.chi ? cientifico(m.chi) : '—'}</td>)}
                            </tr>
                            <tr className="a3-completa">
                                <td style={td}><span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)' }}>tanque mínimo [m³]</span></td>
                                {ms.map(m => <td key={m.id} style={{ ...td, textAlign: 'right' }}>{Math.min(...m.S).toFixed(1)}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    <p className="a3-completa" style={nota}>
                        Todos mejoran el arranque ({M(`\\hat J=${J0.toFixed(3)}`)}, no admisible) y bombean el mismo volumen, el que fija la
                        demanda ({miles(Math.min(...vol))}–{miles(Math.max(...vol))} m³; el tanque llega casi a vacío). Lo que cambia es{' '}
                        {M('z_p')}: más hondo, menos {M('\\gamma J_m')} y más {M('\\alpha J_{\\rm inst}')} y {M('\\beta J_{\\rm op}')}.
                        Ninguno alcanzó {M('\\chi<10^{-4}')}.
                    </p>
                    <p className="a3-publica" style={nota}>Todos mejoran el arranque ({M(`\\hat J=${J0.toFixed(3)}`)}, no admisible); ninguno llegó a la meta.</p>
                </div>
            </div>
            <Notas titulo="Comparación entre modelos: qué es firme y qué no">
                <h4>Qué muestra cada panel</h4>
                <ul>
                    <li>Izquierda: dónde se detuvo cada corrida (todas desde {M('z_p=-700')} m). El círculo hueco marca la que paró antes de su
                        óptimo.</li>
                    <li>Centro: evaluación cruzada. Fila = modelo con el que se calcula {M('\\hat J')}; columna = punto {M('(Q,z_p)')} donde paró
                        cada corrida. La diagonal (punteada) es el valor propio de cada corrida. Si una corrida hubiera llegado a su óptimo,
                        su diagonal sería el menor de su fila.</li>
                    <li>Derecha: los tres términos ya ponderados ({M('\\gamma=\\alpha=\\beta=1')}) en el mejor iterado de cada modelo.</li>
                </ul>
                <h4>Qué se puede afirmar (serie anterior)</h4>
                <ul>
                    <li>Semi y bloque son dos esquemas del mismo modelo continuo: en los tres puntos sus {M('\\hat J')} difieren a lo más{' '}
                        {cientifico(dSB)}. Como el {M('\\hat J')} de bloque es menor en el punto de semi ({Jcruce('mrmt_block', 'mrmt_semi').toFixed(4)})
                        que en el suyo ({bloque.J.J.toFixed(4)}), bloque se detuvo antes de su óptimo, que probablemente está cerca del de semi.</li>
                    <li>ADR también tiene menor {M('\\hat J')} en el punto de semi ({Jcruce('adr', 'mrmt_semi').toFixed(4)} frente a{' '}
                        {adr.J.J.toFixed(4)}): su caudal no ha convergido. Su {M('z_p')} sí parece estable (el barrido de {M('\\hat J(z_p)')} con caudal
                        fijo da el mínimo de ADR cerca de su {M('z_p')}, lámina anterior). La tabla cruzada mezcla diferencias entre modelos con
                        el estado de convergencia de cada corrida.</li>
                    <li>Los tres bombean el mismo volumen ({vol.map(miles).join(', ')} m³) y dejan el tanque casi vacío en algún paso (mínimos{' '}
                        {ms.map(m => Math.min(...m.S).toFixed(1)).join(', ')} m³): el volumen lo fija la demanda,{' '}
                        {M('V_s\\Delta t\\sum_nQ_n=\\sum_nd_n-S_0+S_T')}. Las diferencias de costo vienen sobre todo de {M('z_p')}: ordenados de
                        lo somero a lo hondo, {M('\\gamma J_m')} baja y {M('\\alpha J_{\\rm inst}')}, {M('\\beta J_{\\rm op}')} suben.</li>
                </ul>
                {H && <>
                    <h4>Por qué MRMT pide un pozo más hondo (barrido, serie anterior)</h4>
                    <p>Barrido de {M('\\hat J(z_p)')} sin optimizar, cada 20 m entre {fmtZ(H.z0)} y {fmtZ(H.z1)} m, con un mismo caudal (iterado 38 de
                        ADR) en ADR y en MRMT semi. Con el caudal fijo, instalación y bombeo son idénticos en los dos modelos: la distancia
                        entre sus curvas es exactamente {M('J_m^{\\rm MRMT}-J_m^{\\rm ADR}')}.</p>
                    <ul>
                        <li><b>Retención.</b> El intercambio es rápido ({M('\\tau_r')} de 4 a 14 h ≪ 30 d), así que MRMT se comporta como un ADR
                            con capacidad {M('1+\\sum_r\\eta_r=1.3')}: el nitrato avanza más despacio. Con {M(`z_p=${Math.round(H.zDiag)}`)} m, la
                            concentración en el pozo de MRMT empieza en {H.inicio.toFixed(2)} veces la de ADR (≈ 1/1.3); ADR llega a su pico
                            hacia el día {Math.round(H.picoA)} y baja, MRMT sigue subiendo {H.picoS >= 29.9 ? 'hasta el día 30' : `hasta el día ${Math.round(H.picoS)}`},
                            la supera desde el día {Math.round(H.cruce)} y termina {H.fin.toFixed(2)} veces por encima.</li>
                        <li><b>Más {M('J_m')}.</b> {M('J_m=\\int_0^T\\!\\int_\\Omega g_\\varepsilon C_m^2')} pesa el cuadrado: el exceso tardío de MRMT
                            pesa más que su déficit inicial. En el barrido, {M('J_m')} de MRMT es {pct(H.rmin)}–{pct(H.rmax)} % mayor y la
                            diferencia se reduce al profundizar: en MRMT, {M('J_m')} cae más rápido con la profundidad.</li>
                        <li><b>Mínimo más hondo.</b> En el mínimo, {M('\\gamma\\,\\partial_{z_p}J_m=-\\partial_{z_p}(\\alpha J_{\\rm inst}+\\beta J_{\\rm op})')}.
                            El lado del costo es el mismo en los dos modelos; el de la calidad es más empinado en MRMT, así que el equilibrio
                            queda más abajo: vértices ≈ {fmtZ(H.zA)} m (ADR) y {fmtZ(H.zS)} m (semi), {Math.round(H.zA - H.zS)} m de
                            diferencia, coherente con los {M('z_p')} de las corridas ({fmtZ(adr.zp)} y {fmtZ(semi.zp)} m).</li>
                        <li><b>Por confirmar.</b> El mínimo es plano y la diferencia de pendientes es pequeña: con otro caudal u otra demanda
                            el desplazamiento puede cambiar. La serie 33 y los arranques cruzados lo dirán.</li>
                    </ul>
                </>}
                <h4>Qué no se puede afirmar todavía</h4>
                <p>El orden de los {M('z_p')} ({adr.zp.toFixed(0)}, {semi.zp.toFixed(0)}, {bloque.zp.toFixed(0)} m) y el de los {M('\\hat J')}. Las
                    diferencias de {M('\\hat J')} entre modelos son de hasta {dModelos.toFixed(4)}; con la demanda corregida (observación
                    preliminar) {M('\\hat J')} cambia del orden de 10⁻², más que esas diferencias, y el bombeo se aplana. Además, ninguna
                    corrida tiene {M('\\chi<10^{-4}')}.</p>
                <h4>Cómo se resolverá</h4>
                <p>Serie 33: las tres corridas desde el mismo arranque ({M('z_p^0=-600')} m) con iterados admisibles y la misma parada; después,
                    cada modelo desde el óptimo del otro (ADR ↔ semi). Si cada uno vuelve a su propio {M('z_p')}, la diferencia entre modelos
                    es real; si no, es del optimizador o del arranque.</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 18, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
const th = { padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '6px 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
