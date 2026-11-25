import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';

// Verificación de la discretización respecto del control z_p: Ĵ(z_p) cada metro con el mismo caudal (óptimo ADR de la
// primera corrida), FEniCSx. En la malla con conos (h ≈ 4.9 m en el eje del pozo) Ĵ ondula y tiene mínimos locales
// espurios; con la franja de 1 m en el eje es monótona (codigo/data/output/_logs_malla_conos/13_fino_r20.log y
// 15_fino_eje.log). Es una propiedad de la malla: no depende de la corrección de la demanda (serie 33).
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';
const M = (t) => <InlineMath math={t} />;
// donde pararon las corridas de la malla con conos (15-nov; bloque, en −469 m, queda fuera del barrido)
const PAROS = [{ z: -441, t: 'ADR paró aquí' }, { z: -436, t: 'semi paró aquí' }];

// mínimos locales estrictos de una serie
const minimos = J => J.map((v, i) => (i > 0 && i < J.length - 1 && v < J[i - 1] && v < J[i + 1] ? i : -1)).filter(i => i >= 0);

// ajuste por mínimos cuadrados de una parábola: pendiente media y mayor desviación (la ondulación)
function ondulacion(z, J) {
    const n = z.length, zm = z.reduce((a, b) => a + b, 0) / n, t = z.map(v => v - zm);
    const S = k => t.reduce((a, v) => a + v ** k, 0), Y = k => t.reduce((a, v, i) => a + J[i] * v ** k, 0);
    const A = [[n, S(1), S(2)], [S(1), S(2), S(3)], [S(2), S(3), S(4)]], b = [Y(0), Y(1), Y(2)];
    const det = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
        + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    const c = [0, 1, 2].map(j => det(A.map((r, i) => r.map((v, k) => (k === j ? b[i] : v)))) / det(A));
    return { pendiente: Math.abs(c[1]), amp: Math.max(...t.map((v, i) => Math.abs(J[i] - c[0] - c[1] * v - c[2] * v * v))) };
}

// 5.3e-4 → «5·10⁻⁴»
const pot = v => {
    let e = Math.floor(Math.log10(v)), m = Math.round(v / 10 ** e);
    if (m === 10) { m = 1; e += 1; }
    return `${m}·10${[...String(e)].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('')}`;
};

function Barrido({ p }) {
    const pub = usePublica();
    const fs = pub ? 20 : 17, ley = pub ? 22 : 18;
    const ej = { ...eje, fontSize: fs };
    const { conos, eje: fina } = OPT.ondulacion;
    const W = 700, H = 420, x0 = 78, x1 = W - 20;
    const zs = conos.zp, za = Math.min(...zs), zb = Math.max(...zs);
    const todos = [...conos.J, ...fina.J], a = Math.min(...todos) - 2e-4, b = Math.max(...todos) + 2e-4;
    const sx = z => x0 + (z - za) / (zb - za) * (x1 - x0), sy = v => 80 + (b - v) / (b - a) * (H - 130);
    const fc = suave(tramo(p, 0.05, 0.45)), fe = suave(tramo(p, 0.55, 0.9));
    const linea = (s, f) => {
        const k = Math.max(1, Math.round(f * (s.zp.length - 1)));
        return s.zp.slice(0, k + 1).map((z, i) => `${sx(z)},${sy(s.J[i])}`).join(' ');
    };
    const mins = minimos(conos.J);
    const marcas = [];
    for (let v = Math.ceil(a * 1000) / 1000; v <= b; v += 0.001) marcas.push(v);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {marcas.map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 8} y={sy(v) + 6} textAnchor="end" style={ej}>{v.toFixed(3)}</text></g>
            ))}
            {[-450, -445, -440, -435, -430].map(z => (
                <text key={z} x={sx(z)} y={H - 30} textAnchor="middle" style={ej}>{String(z).replace('-', '−')}</text>
            ))}
            <text x={(x0 + x1) / 2} y={H - 4} textAnchor="middle" style={ej}>profundidad del pozo z<tspan dy="5" fontSize={fs - 4}>p</tspan><tspan dy="-5"> [m]</tspan></text>
            {fc > 0 && <polyline points={linea(conos, fc)} fill="none" stroke={PLUMA} strokeWidth="2.6" />}
            {fc >= 1 && mins.map(i => <circle key={i} cx={sx(conos.zp[i])} cy={sy(conos.J[i])} r="7" fill="none" stroke={PLUMA} strokeWidth="2.4" />)}
            {fc >= 1 && PAROS.filter(q => zs.includes(q.z)).map((q, j) => {
                const y = sy(conos.J[zs.indexOf(q.z)]);
                return (
                    <g key={q.z} opacity={tramo(p, 0.45, 0.55)}>
                        <line x1={sx(q.z)} x2={sx(q.z)} y1={y + 10} y2={y + 34 + 22 * j} stroke={PLUMA} strokeWidth="1.4" />
                        <text x={sx(q.z)} y={y + 52 + 22 * j} textAnchor="middle" style={{ ...ej, fontSize: fs - 1, fill: PLUMA }}>{q.t}</text>
                    </g>
                );
            })}
            {fe > 0 && <polyline points={linea(fina, fe)} fill="none" stroke={AGUA} strokeWidth="3" />}
            <text x={x1} y={26} textAnchor="end" style={{ ...eje, fontSize: ley, fill: PLUMA, opacity: fc }}>
                malla con conos (h ≈ 4.9 m en el eje): {mins.length} mínimos falsos
            </text>
            <text x={x1} y={54} textAnchor="end" style={{ ...eje, fontSize: ley, fill: AGUA, opacity: fe }}>
                eje refinado a 1 m: monótona
            </text>
        </svg>
    );
}

export default function A3D18({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(7000, 400);
    if (!OPT.ondulacion || !OPT.ondulacion.conos || !OPT.ondulacion.eje)
        return <SlideLayout title="Ĵ(zₚ) y la malla" theme={theme}><p>Sin datos.</p></SlideLayout>;
    const { conos, eje: fina } = OPT.ondulacion;
    const oc = ondulacion(conos.zp, conos.J), oe = ondulacion(fina.zp, fina.J), nmin = minimos(conos.J).length;
    return (
        <SlideLayout title="¿El zₚ óptimo es del modelo o de la malla?" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 34, alignItems: 'start' }}>
                <div>
                    <p style={tit}>{M('\\hat J')} con el mismo caudal, moviendo solo {M('z_p')} de metro en metro</p>
                    <Barrido p={p} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
                    <div style={{ ...caja, borderColor: GRIS, opacity: 0.3 + 0.7 * tramo(p, 0.0, 0.1) }}>
                        <p style={{ ...cab, color: GRIS }}>Prueba</p>
                        <p className="a3-completa" style={txt}>
                            Mismo caudal; solo se mueve {M('z_p')}, de metro en metro, en dos mallas. Si la malla resuelve el pozo,{' '}
                            {M('\\hat J(z_p)')} debe ser suave.
                        </p>
                        <p className="a3-publica" style={txt}>Mismo caudal; solo se mueve {M('z_p')}, metro a metro.</p>
                    </div>
                    <div style={{ ...caja, borderColor: PLUMA, opacity: 0.3 + 0.7 * tramo(p, 0.3, 0.45) }}>
                        <p style={{ ...cab, color: PLUMA }}>Hallazgo</p>
                        <p className="a3-completa" style={txt}>
                            Con nodos a {M('h\\approx4.9')} m en el eje del pozo, {M('\\hat J')} ondula con periodo ≈ h y amplitud
                            de hasta ±{pot(oc.amp)}; en pendiente, la ondulación supera a la tendencia ({pot(oc.pendiente)} por metro):{' '}
                            {nmin} mínimos falsos. Dos están donde pararon ADR y MRMT semi. Con {M('h=1')} m junto al eje la ondulación baja a ±{pot(oe.amp)} y no queda
                            ningún mínimo.
                        </p>
                        <p className="a3-publica" style={txt}>
                            Malla gruesa en el eje: {M('\\hat J')} ondula y tiene mínimos falsos; las corridas paraban en ellos.
                        </p>
                    </div>
                    <div style={{ ...caja, borderColor: VALIDO, opacity: 0.3 + 0.7 * tramo(p, 0.6, 0.8) }}>
                        <p style={{ ...cab, color: VALIDO }}>Qué aporta</p>
                        <p className="a3-completa" style={txt}>
                            El {M('z_p')} óptimo depende del modelo, no de la malla: sin esta prueba, una diferencia de pocas decenas de metros
                            entre modelos (unas pocas h) podría ser un valle de la malla. Por eso toda la optimización usa la malla con eje de
                            1 m (25 871 nodos, +27 %). Es una propiedad de la malla: la corrección de la demanda no la cambia.
                        </p>
                        <p className="a3-publica" style={txt}>
                            El {M('z_p')} óptimo es del modelo, no de la malla: toda la optimización usa el eje a 1 m.
                        </p>
                    </div>
                </div>
            </div>
            <Notas titulo="Ĵ(zₚ) y la malla: qué aporta esta lámina">
                <h4>Por qué la lámina es necesaria</h4>
                <p>{M('z_p')} es el único control que mueve una fuente por la malla: el núcleo del pozo {M('g_\\varepsilon(\\mathbf x;z_p)')} se
                    desplaza entre nodos. El optimizador usa {M('\\partial\\hat J/\\partial z_p')}; si {M('\\hat J(z_p)')} tiene valles cada{' '}
                    {M('h')}, el gradiente se anula en cada valle y el método se detiene ahí. La lámina muestra que eso ocurría y que la
                    malla con eje de 1 m lo corrige. Sin ella, la comparación de {M('z_p')} entre modelos de las láminas siguientes no
                    sería confiable.</p>
                <h4>Mecanismo</h4>
                <p>El núcleo tiene ancho {M('\\varepsilon=r_{\\rm pozo}/3\\approx6.7')} m ({M('r_{\\rm pozo}=20')} m). Con nodos separados{' '}
                    {M('h\\approx4.9')} m (4 m nominal) en el eje, la integral de {M('g_\\varepsilon')} contra la solución discreta cambia
                    según dónde cae el centro respecto de los nodos: un error periódico en {M('z_p')} con periodo ≈ {M('h')}. Una ondulación
                    de amplitud {M('A')} y periodo {M('h')} tiene pendiente hasta {M('2\\pi A/h')}; aquí ({M('A\\approx')} {pot(oc.amp)}) eso
                    supera la pendiente real ({pot(oc.pendiente)} por metro), así que la derivada cambia de signo: mínimos locales
                    espurios.</p>
                <h4>Evidencia</h4>
                <ul>
                    <li>Barrido cada metro entre −452 y −428 m con el mismo caudal: {nmin} mínimos locales en la malla con conos, ninguno en la
                        de eje de 1 m (amplitudes medidas respecto de una parábola ajustada: ±{pot(oc.amp)} y ±{pot(oe.amp)}).</li>
                    <li>Las corridas en la malla con conos pararon con {M('\\partial\\hat J/\\partial z_p\\approx0')} en −441 m (ADR), −436 m
                        (MRMT semi) y −469 m (MRMT bloque): semi y bloque, dos esquemas del mismo modelo, a 33 m. −441 y −436 m son valles
                        del barrido.</li>
                </ul>
                <h4>Remedio y alternativas</h4>
                <p>Franja con {M('h=1')} m a ±5 m del eje: 25 871 nodos (+27 %). Un radio de pozo mayor ({M('r_{\\rm pozo}=60')} m) también
                    alisa {M('\\hat J')}; se prefirió conservar el pozo y refinar solo el eje. En RBF-FD la ondulación persiste
                    aun con el eje a 1 m (±6·10⁻⁴): es una de las razones por las que la optimización usa solo elementos finitos.</p>
                <h4>Qué queda pendiente</h4>
                <p>El barrido se hizo con un caudal de la primera corrida. La causa es la malla, no el caudal; aun así, conviene repetir un
                    barrido corto (cada metro) alrededor del {M('z_p')} final de la serie 33. Regla que deja la lámina: antes de culpar al
                    optimizador, barrer {M('\\hat J(z_p)')} con paso menor que {M('h')}.</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 17, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const caja = { borderLeft: '4px solid', paddingLeft: 14 };
const cab = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', fontWeight: 600 };
const txt = { margin: '2px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 };
