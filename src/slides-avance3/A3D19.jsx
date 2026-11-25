import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';
import { AvisoPreliminar } from './preliminar.jsx';

// Por qué el mínimo de MRMT semi queda más hondo que el de ADR con el mismo caudal (FEniCSx, malla con eje de 1 m, γ = 1,
// serie anterior). Izquierda: Ĵ(z_p) con el mismo caudal (iterado 38 de ADR) en los dos modelos; derecha: C en el pozo con
// z_p = −383 m y ese caudal (codigo/data/output/optimizacion_nitrato_vscale_malla_eje_g1/analisis_zp/). Las cifras de la
// explicación se calculan de esos datos; el orden entre modelos queda por confirmar con la serie 33.
const COLOR = { adr: 'var(--a3-pluma)', mrmt_semi: 'var(--a3-agua)' };
const NOMBRE = { adr: 'ADR', mrmt_semi: 'MRMT semi' };
const GRIS = 'var(--a3-estrato)';
const M = (t) => <InlineMath math={t} />;

// vértice de la parábola por los tres puntos alrededor del mínimo muestreado (z, Ĵ en el vértice y curvatura Ĵ'')
function parabola(z, J) {
    const i = Math.min(Math.max(1, J.indexOf(Math.min(...J))), J.length - 2), h = z[i + 1] - z[i];
    const c2 = (J[i - 1] - 2 * J[i] + J[i + 1]) / (h * h), c1 = (J[i + 1] - J[i - 1]) / (2 * h);
    const zv = z[i] - c1 / c2;
    return { zv, curv: c2, en: x => J[i] + c1 * (x - z[i]) + c2 / 2 * (x - z[i]) ** 2 };
}
const vertice = (z, J) => parabola(z, J).zv;

// pendiente de J (por metro de profundidad) en el tramo del barrido que contiene a zv
function pendiente(z, J, zv) {
    const k = Math.max(0, Math.min(z.length - 2, z.findIndex((v, i) => i < z.length - 1 && zv <= v && zv >= z[i + 1])));
    return (J[k] - J[k + 1]) / (z[k] - z[k + 1]);
}

// 5.7e-5 → «5.7·10⁻⁵»
const cientifico = (v, d = 1) => {
    const [m, e] = v.toExponential(d).split('e');
    return `${m}·10${[...e.replace('+', '')].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('')}`;
};
const zfmt = z => Math.round(z).toString().replace('-', '−');

function Barrido({ f }) {
    const B = OPT.analisis.barrido, ms = Object.keys(B);
    const W = 560, H = 360, x0 = 74, x1 = W - 20;
    const pub = usePublica(), ej = { ...eje, fontSize: pub ? 20 : 17 };
    const z = B[ms[0]].zp, za = Math.min(...z), zb = Math.max(...z);
    const todos = ms.flatMap(m => B[m].J), a = Math.min(...todos) - 0.001, b = Math.max(...todos) + 0.001;
    const sx = v => x0 + (v - za) / (zb - za) * (x1 - x0), sy = v => 64 + (b - v) / (b - a) * (H - 114);
    const marcas = [0.464, 0.468, 0.472].filter(v => v > a && v < b);
    const w = m => 0.55 * ej.fontSize * `${NOMBRE[m]}: mín. ≈ −000 m`.length;   // ancho aproximado del rótulo, para no salirse
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {marcas.map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 8} y={sy(v) + 6} textAnchor="end" style={ej}>{v.toFixed(3)}</text></g>
            ))}
            {z.map((v, k) => <text key={v} x={sx(v)} y={H - 28} textAnchor={k === z.length - 1 ? 'end' : k === 0 ? 'start' : 'middle'} style={ej}>{String(v).replace('-', '−')}</text>)}
            <text x={(x0 + x1) / 2} y={H - 4} textAnchor="middle" style={ej}>z<tspan dy="5" fontSize={ej.fontSize - 4}>p</tspan><tspan dy="-5"> [m]</tspan></text>
            {ms.map((m, j) => {
                const s = B[m], zv = vertice(s.zp, s.J), k = Math.max(1, Math.round(f * (s.zp.length - 1)));
                return (
                    <g key={m}>
                        <polyline points={s.zp.slice(0, k + 1).map((v, i) => `${sx(v)},${sy(s.J[i])}`).join(' ')} fill="none" stroke={COLOR[m]} strokeWidth="2.6" />
                        {s.zp.slice(0, k + 1).map((v, i) => <circle key={i} cx={sx(v)} cy={sy(s.J[i])} r="4" fill={COLOR[m]} />)}
                        <g opacity={tramo(f, 0.95, 1)}>
                            <line x1={sx(zv)} x2={sx(zv)} y1={52} y2={H - 50} stroke={COLOR[m]} strokeDasharray="4 4" strokeWidth="1.6" />
                            <text x={Math.min(Math.max(sx(zv), x0 + w(m) / 2), x1 - w(m) / 2)} y={20 + 24 * j} textAnchor="middle" style={{ ...ej, fill: COLOR[m] }}>
                                {NOMBRE[m]}: mín. ≈ {zfmt(zv)} m
                            </text>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

function Pozo({ f }) {
    const D = OPT.analisis.diag, ms = Object.keys(D), esc = OPT.f * 1000;   // unidades del modelo → mg/L de nitrato
    const W = 560, H = 360, x0 = 60, x1 = W - 20, n = D[ms[0]].Cpozo.length;
    const pub = usePublica(), ej = { ...eje, fontSize: pub ? 20 : 17 };
    const b = Math.max(...ms.flatMap(m => D[m].Cpozo)) * esc * 1.12;
    const sx = i => x0 + (i + 1) / n * (x1 - x0), sy = v => 20 + (b - v) / b * (H - 70);
    const k = Math.max(1, Math.round(f * (n - 1)));
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[0, 5, 10, 15, 20].filter(v => v < b).map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 8} y={sy(v) + 6} textAnchor="end" style={ej}>{v}</text></g>
            ))}
            {[0, 10, 20, 30].map(d => <text key={d} x={x0 + d / 30 * (x1 - x0)} y={H - 28} textAnchor="middle" style={ej}>{d} d</text>)}
            {ms.map((m, j) => {
                const c = D[m].Cpozo.map(v => v * esc);
                return (
                    <g key={m}>
                        <polyline points={c.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')} fill="none" stroke={COLOR[m]} strokeWidth="2.6" />
                        <text x={x1} y={sy(c[k]) + (j ? -12 : 26)} textAnchor="end" style={{ ...ej, fill: COLOR[m], opacity: tramo(f, 0.9, 1) }}>
                            {NOMBRE[m]}: {c[n - 1].toFixed(1)} mg/L al final
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function A3D19({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6000, 400);
    if (!OPT.analisis || !OPT.analisis.diag.adr || !OPT.analisis.diag.mrmt_semi)
        return <SlideLayout title="¿Por qué MRMT pide un pozo más hondo?" theme={theme}><p>Sin datos.</p></SlideLayout>;
    const f = suave(tramo(p, 0, 0.8));
    const B = OPT.analisis.barrido, D = OPT.analisis.diag;
    const cocientes = B.adr.J1.map((v, i) => B.mrmt_semi.J1[i] / v);
    const rmin = Math.min(...cocientes), rmax = Math.max(...cocientes);
    // cifras de la explicación (todas del barrido y del diagnóstico)
    const pa = parabola(B.adr.zp, B.adr.J), ps = parabola(B.mrmt_semi.zp, B.mrmt_semi.J);
    const desplaz = pa.zv - ps.zv;
    const mA = pendiente(B.adr.zp, B.adr.J1, pa.zv), mS = pendiente(B.mrmt_semi.zp, B.mrmt_semi.J1, pa.zv);
    const mCosto = pendiente(B.adr.zp, B.adr.J.map((v, i) => v - B.adr.J1[i]), pa.zv);
    const estim = (mS - mA) / pa.curv;
    const gap = B.adr.zp.map((z, i) => B.mrmt_semi.J1[i] - B.adr.J1[i]);
    const castigo = pa.en(ps.zv) - pa.en(pa.zv), plano10 = pa.curv / 2 * 100;
    const dias = i => (i + 1) * OPT.dt / 86400;
    const ca = D.adr.Cpozo, cs = D.mrmt_semi.Cpozo, n = ca.length;
    const picoA = ca.indexOf(Math.max(...ca)), picoS = cs.indexOf(Math.max(...cs));
    const cruce = cs.findIndex((v, i) => v > ca[i]);
    const int2 = c => c.reduce((s, v) => s + v * v, 0);
    const rC2 = int2(cs) / int2(ca), rJm = D.mrmt_semi.J1 / D.adr.J1;
    return (
        <SlideLayout title="¿Por qué MRMT pedía un pozo más hondo?" theme={theme} justify="flex-start">
            <AvisoPreliminar style={{ marginBottom: 6 }}>
                <span className="a3-completa">; barrido con el caudal del iterado 38 de ADR</span>
            </AvisoPreliminar>
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' }}>
                <div>
                    <p style={tit}>{M('\\hat J(z_p)')} con el mismo caudal en los dos modelos</p>
                    <Barrido f={f} />
                </div>
                <div>
                    <p style={tit}>Nitrato en el pozo [mg/L], {M(`z_p=${zfmt(D.adr.zp)}`)} m y el mismo caudal</p>
                    <Pozo f={f} />
                </div>
            </div>
            <div className="a3-completa" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 8, opacity: tramo(p, 0.8, 1) }}>
                <p style={paso}><b style={negr}>1 · Solo cambia {M('J_m')}.</b> Con el mismo caudal, instalación y bombeo son idénticos en los dos
                    modelos: la distancia entre las curvas es {M('J_m^{\\rm MRMT}-J_m^{\\rm ADR}')}.</p>
                <p style={paso}><b style={negr}>2 · MRMT retiene el nitrato.</b> El intercambio es rápido <Cita k="haggerty1995multirate" /> ({M('\\tau_r')} de 4 a 14 h
                    ≪ 30 d): actúa como ADR retardado ({M('1+\\sum_r\\eta_r=1.3')}). El nitrato llega después pero sigue subiendo hasta{' '}
                    {M('T')}: {M('J_m')} es {Math.round((rmin - 1) * 100)}–{Math.round((rmax - 1) * 100)} % mayor y cae más rápido con la profundidad.</p>
                <p style={paso}><b style={negr}>3 · El mínimo es plano.</b> {M('\\hat J')} cambia ≈ {cientifico(plano10)} al moverse 10 m: esa pequeña
                    diferencia de pendiente baja el mínimo ≈ {Math.round(desplaz)} m. Por eso el orden puede cambiar con la serie 33.</p>
            </div>
            <p className="a3-publica" style={{ ...nota, opacity: tramo(p, 0.8, 1) }}>
                Mismo caudal: solo cambia {M('J_m')}. MRMT retiene el nitrato hasta {M('T')}: {M('J_m')} es {Math.round((rmin - 1) * 100)}–{Math.round((rmax - 1) * 100)} %
                mayor y el mínimo, muy plano, baja ≈ {Math.round(desplaz)} m. Por confirmar con la serie 33.
            </p>
            <Notas titulo="Ĵ(zₚ) en ADR y MRMT: lectura completa">
                <h4>Qué representa</h4>
                <p>Izquierda: {M('\\hat J')} evaluado (sin optimizar) en {B.adr.zp.length} profundidades, cada 20 m entre{' '}
                    {zfmt(Math.max(...B.adr.zp))} y {zfmt(Math.min(...B.adr.zp))} m, con un mismo caudal {M('Q')} (el del iterado 38 de ADR,
                    serie anterior) en ADR y en MRMT semi. La línea punteada es el mínimo estimado con la parábola que pasa por los tres
                    puntos alrededor del menor valor: {zfmt(pa.zv)} m (ADR) y {zfmt(ps.zv)} m (semi). Derecha: concentración de nitrato en el
                    pozo (promedio con el núcleo {M('g_\\varepsilon')}) durante los 30 días, con {M(`z_p=${zfmt(D.adr.zp)}`)} m y el mismo caudal.</p>
                <h4>Variables</h4>
                <BlockMath math={String.raw`\hat J=\gamma\underbrace{\int_0^T\!\!\int_\Omega g_\varepsilon C_m^2}_{J_m}+\alpha\underbrace{\kappa_p(z_p-z_0)^2}_{J_{\rm inst}}+\beta\underbrace{(z_0-z_p)\!\int_0^T\!Q^2}_{J_{\rm op}}`} />
                <p>{M('z_p')}: profundidad del pozo (lo único que se mueve); {M('Q')}: fijo; {M('C_m')}: concentración móvil; {M('\\eta_r')}: razón de
                    capacidades inmóvil/móvil de la región {M('r')} ({M('\\sum_r\\eta_r=0.3')}); {M('\\tau_r=1/\\nu_r')}: tiempo de intercambio
                    (4 a 14 h). Con {M('Q')} fijo, {M('J_{\\rm inst}')} y {M('J_{\\rm op}')} no dependen de {M('C')}: son iguales en los dos modelos.</p>
                <h4>Cómo se interpreta</h4>
                <ul>
                    <li>La distancia vertical entre las curvas es exactamente {M('J_m^{\\rm MRMT}-J_m^{\\rm ADR}')}. Esa distancia se reduce con la
                        profundidad (de {cientifico(gap[0])} en {zfmt(B.adr.zp[0])} m a {cientifico(gap[gap.length - 1])} en{' '}
                        {zfmt(B.adr.zp[gap.length - 1])} m): en MRMT, {M('J_m')} cae más rápido al bajar el pozo ({cientifico(mS)} frente a{' '}
                        {cientifico(mA)} por metro cerca del mínimo de ADR).</li>
                    <li>La derecha explica por qué {M('J_m')} es mayor. Si el intercambio es rápido frente a 30 días, {M('C_{{\\rm im},r}\\approx C_m')} y
                        sumar las ecuaciones da un ADR con la capacidad multiplicada por {M('1+\\sum_r\\eta_r=1.3')}: el nitrato avanza más
                        despacio. Al inicio la concentración en el pozo de MRMT es {(cs[0] / ca[0]).toFixed(2)} veces la de ADR (≈ 1/1.3); ADR llega a
                        su pico hacia el día {Math.round(dias(picoA))} y baja, mientras MRMT {picoS === n - 1 ? 'sigue subiendo hasta T' : `llega a su pico el día ${Math.round(dias(picoS))}`}{' '}
                        y termina {(cs[n - 1] / ca[n - 1]).toFixed(2)} veces por encima{cruce >= 0 ? ` (la supera desde el día ${Math.round(dias(cruce))})` : ''}.</li>
                    <li>{M('J_m')} es, en esencia, {M('\\int_0^T C_{\\rm pozo}^2\\,dt')}: el exceso tardío de MRMT pesa más que su déficit inicial. El cociente
                        de {M('\\int C_{\\rm pozo}^2')} entre los dos modelos ({rC2.toFixed(3)}) coincide con el de {M('J_m')} ({rJm.toFixed(3)}).</li>
                </ul>
                <h4>Relación con la optimización</h4>
                <p>Con {M('Q')} fijo, el {M('z_p')} óptimo cumple {M('\\partial\\hat J/\\partial z_p=0')}:</p>
                <BlockMath math={String.raw`\gamma\,\frac{\partial J_m}{\partial z_p}=-\frac{\partial}{\partial z_p}\big(\alpha J_{\rm inst}+\beta J_{\rm op}\big)`} />
                <p>lo que se gana en calidad al bajar un metro iguala lo que cuesta. El lado del costo es el mismo en los dos modelos (≈{' '}
                    {cientifico(Math.abs(mCosto))} por metro); el de la calidad es más empinado en MRMT, así que el equilibrio queda más abajo. Cuánto:
                    diferencia de pendientes / curvatura de {M('\\hat J')} ≈ {cientifico(mS - mA)} / {cientifico(pa.curv)} ≈ {Math.round(estim)} m,
                    cerca de los {Math.round(desplaz)} m entre los dos mínimos.</p>
                <p>El mínimo es muy plano: moverse 10 m cambia {M('\\hat J')} en ≈ {cientifico(plano10)}, y usar en ADR la profundidad de MRMT
                    le cuesta ≈ {cientifico(castigo)} ({(castigo / pa.en(pa.zv) * 100).toFixed(2)} %).</p>
                <h4>Conclusión (provisional)</h4>
                <ul>
                    <li>En la serie anterior, con el mismo caudal y la misma malla, solo el modelo de transporte baja el mínimo ≈{' '}
                        {Math.round(desplaz)} m: no es efecto del caudal ni del optimizador.</li>
                    <li>El mecanismo es la retención: con estos parámetros MRMT se comporta como un retardo (intercambio rápido), no como un
                        efecto multitasa propiamente dicho.</li>
                    <li>Como el mínimo es plano, una diferencia pequeña en el funcional mueve {M('z_p')} decenas de metros. La corrección de la
                        demanda cambia {M('\\hat J')} del orden de 10⁻² (observación preliminar), así que el orden entre modelos puede cambiar.</li>
                    <li>Pendiente: repetir este barrido con el caudal óptimo de la serie 33 y contrastarlo con los arranques cruzados (cada
                        modelo desde el óptimo del otro).</li>
                </ul>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 17, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.45 };
const paso = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
const negr = { color: 'var(--sl-text)', fontWeight: 600 };
