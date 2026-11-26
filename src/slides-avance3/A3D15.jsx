import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';
import { AvisoPreliminar } from './preliminar.jsx';

// Resultado parcial (serie 33, iterado 50) de los tres modelos de transporte (FEniCSx, malla con conos y eje de 1 m, γ = 1),
// todos desde Q_n = 0.1 proyectado, z_p = −600 m. Izquierda: los tres pozos suben de z_p⁰ a donde paró el optimizador; centro: evaluación
// cruzada (Ĵ de cada modelo en el punto de cada corrida, experimentos/evaluar_optimos.py); derecha: términos del funcional.
const COLOR = { adr: 'var(--a3-pluma)', mrmt_semi: 'var(--a3-agua)', mrmt_block: '#5B4B8A' };
const GRIS = 'var(--a3-estrato)', VALIDO = 'var(--a3-valido)';
const M = (t) => <InlineMath math={t} />;

// Una corrida «paró antes» de su óptimo si su modelo da menor Ĵ en el punto de otra corrida (evaluación cruzada, OPT.cruce):
// la columna del menor de su fila no es la propia.
const mejorDe = fila => OPT.modelos.map(x => x.id).reduce((b, x) => (Jcruce(fila, x) < Jcruce(fila, b) ? x : b), fila);
// la evaluación cruzada solo se usa si es de la misma serie que los iterados (si no, mezclaría puntos de dos series)
const CRUCE_OK = OPT.cruce_serie === '33' && (OPT.cruce || []).length === 6;
const paroAntes = m => CRUCE_OK && mejorDe(m.id) !== m.id;

// Por qué MRMT pide un pozo más hondo, con los datos de la antigua A3D19 (fuera de la secuencia): barrido de Ĵ(z_p) con el
// mismo caudal (iterado 38 de ADR, serie anterior) en ADR y MRMT semi, y la concentración en el pozo con z_p = −383 m
// (OPT.analisis; se rehará con la serie 33).
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
    if (ms.length < 3) return <SlideLayout title="Resultado por modelo" theme={theme}><p>Sin resultados.</p></SlideLayout>;
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
    const nit = adr.nit, nombre = k => id(k).nombre;
    // evaluación cruzada: qué corridas no llegaron a su óptimo (su modelo da menor Ĵ en otro punto)
    const antes = ms.filter(paroAntes);
    const hondo = m => Math.round(adr.zp - m.zp);
    return (
        <SlideLayout title={`Resultado por modelo (serie 33, iterado ${nit})`} theme={theme} justify="flex-start">
            <AvisoPreliminar style={{ marginBottom: 6 }}>
                <span className="a3-completa">; el orden entre modelos queda por confirmar</span>
            </AvisoPreliminar>
            <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1fr 1.15fr', gap: 30, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Profundidad {M('z_p')} donde paró cada corrida [m]</p>
                    <Pozos f={f} />
                    {H && <p style={{ ...nota, color: 'var(--sl-text)', opacity: tramo(p, 0.85, 1) }}>
                        <b style={{ color: COLOR.mrmt_semi, fontWeight: 600 }}>¿Por qué MRMT más hondo?</b> Semi queda {hondo(semi)} m y bloque{' '}
                        {hondo(bloque)} m bajo ADR. Con el mismo caudal, MRMT retiene el nitrato y lo entrega más tarde: {M('J_m')}{' '}
                        {pct(H.rmin)}–{pct(H.rmax)} % mayor, que baja más rápido al profundizar<span className="a3-completa"> (barrido de{' '}
                        {M('\\hat J(z_p)')} de la serie anterior, notas)</span>.
                    </p>}
                </div>
                <div>
                    <p style={tit}>Evaluación cruzada de {M('\\hat J')}</p>
                    {CRUCE_OK ? <Cruce f={f} /> : <p style={nota}>En curso con los iterados de la serie 33.</p>}
                    {CRUCE_OK && <>
                    <p className="a3-completa" style={nota}>
                        Cada fila: {M('\\hat J')} de un modelo en el punto donde paró cada corrida (verde: el menor de la fila; punteado: el
                        propio). Semi y bloque difieren a lo más {cientifico(dSB)} en un mismo punto.{' '}
                        {antes.length ? <>{antes.map(m => m.nombre).join(' y ')}: su modelo da menor {M('\\hat J')} en otro punto, así que no
                        {antes.length > 1 ? 'llegaron' : 'llegó'} a su óptimo.</> : <>Cada corrida tiene el menor {M('\\hat J')} de su fila.</>}
                    </p>
                    <p className="a3-publica" style={nota}>
                        Verde: el menor de cada fila.{' '}
                        {antes.length ? <>{antes.map(m => m.nombre).join(' y ')}: mejor en otro punto, {antes.length > 1 ? 'pararon' : 'paró'} antes.</>
                            : 'Cada corrida gana en su fila.'}
                    </p>
                    </>}
                </div>
                <div>
                    <p style={tit}>Términos en el iterado {nit}</p>
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
                        Todos mejoran el arranque ({M(`\\hat J=${J0.toFixed(3)}`)}, ya proyectado a {M('\\mathcal U_{ad}')}) y bombean el mismo volumen, el que fija la
                        demanda ({miles(Math.min(...vol))}–{miles(Math.max(...vol))} m³; el tanque llega casi a vacío). Lo que cambia es{' '}
                        {M('z_p')}: más hondo, menos {M('\\gamma J_m')} y más {M('\\alpha J_{\\rm inst}')} y {M('\\beta J_{\\rm op}')}.
                        Ninguno alcanzó {M('\\chi<10^{-4}')}.
                    </p>
                    <p className="a3-publica" style={nota}>Todos mejoran el arranque ({M(`\\hat J=${J0.toFixed(3)}`)}); ninguno llegó a la meta.</p>
                </div>
            </div>
            <Notas titulo="Comparación entre modelos: qué es firme y qué no">
                <h4>Qué muestra cada panel</h4>
                <ul>
                    <li>Izquierda: dónde quedó cada corrida en la iteración {nit} (todas desde {M(`z_p=${OPT.zp0}`)} m). El círculo hueco marca
                        la que, según la evaluación cruzada, paró antes de su óptimo.</li>
                    <li>Centro: evaluación cruzada. Fila = modelo con el que se calcula {M('\\hat J')}; columna = punto {M('(Q,z_p)')} donde paró
                        cada corrida. La diagonal (punteada) es el valor propio de cada corrida. Si una corrida hubiera llegado a su óptimo,
                        su diagonal sería el menor de su fila.</li>
                    <li>Derecha: los tres términos ya ponderados ({M('\\gamma=\\alpha=\\beta=1')}) en el iterado {nit} de cada modelo.</li>
                </ul>
                <h4>Qué se puede afirmar (serie 33, iteración {nit})</h4>
                <ul>
                    <li>Semi y bloque son dos esquemas del mismo modelo continuo: en los tres puntos sus {M('\\hat J')} difieren a lo más{' '}
                        {cientifico(dSB)}.</li>
                    {ms.map(m => {
                        const b = mejorDe(m.id);
                        return b === m.id
                            ? <li key={m.id}>{m.nombre}: su propio punto da el menor {M('\\hat J')} de su fila ({m.J.J.toFixed(4)}).</li>
                            : <li key={m.id}>{m.nombre}: su {M('\\hat J')} es menor en el punto de {nombre(b)} ({Jcruce(m.id, b).toFixed(4)}) que en
                                el suyo ({m.J.J.toFixed(4)}): la corrida no llegó a su óptimo.</li>;
                    })}
                    <li>La tabla cruzada mezcla diferencias entre modelos con el estado de convergencia de cada corrida; el {M('z_p')} de ADR lo
                        confirma aparte el barrido de {M('\\hat J(z_p)')} con caudal fijo (lámina anterior).</li>
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
                            diferencia con aquel caudal; en la serie 33 las corridas quedan a {fmtZ(adr.zp)} y {fmtZ(semi.zp)} m,{' '}
                            {hondo(semi)} m de diferencia.</li>
                        <li><b>Por confirmar.</b> El mínimo es plano y la diferencia de pendientes es pequeña: con otro caudal u otra demanda
                            el desplazamiento cambia ({Math.round(H.zA - H.zS)} m con el caudal de la serie anterior, {hondo(semi)} m en la serie 33). Los arranques
                            cruzados lo dirán.</li>
                    </ul>
                </>}
                <h4>Qué no se puede afirmar todavía</h4>
                <p>Que el orden de los {M('z_p')} ({fmtZ(adr.zp)}, {fmtZ(semi.zp)}, {fmtZ(bloque.zp)} m) y el de los {M('\\hat J')} sean
                    definitivos: las diferencias de {M('\\hat J')} entre modelos son de hasta {dModelos.toFixed(4)}, ninguna corrida tiene{' '}
                    {M('\\chi<10^{-4}')} y, en ADR, el arranque desde {M('z_p^0=-200')} m aún no llega al mismo {M('z_p')}.</p>
                <h4>Cómo se resolverá</h4>
                <p>Las pruebas de consistencia en curso: desde {M('z_p^0=-200')} m, el reinicio desde el iterado 25 y cada modelo desde el
                    óptimo del otro (ADR ↔ semi). Si cada uno vuelve a su propio {M('z_p')}, la diferencia entre modelos es real; si no, es
                    del optimizador o del arranque.</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 18, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
const th = { padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '6px 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
