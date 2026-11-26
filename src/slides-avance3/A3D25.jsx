import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';
import { AvisoPreliminar } from './preliminar.jsx';

// Validación con casos triviales (ADR): lo que la intuición predice y lo que da el optimizador con EDP y adjunto
// (OPT.validaciones: experimentos/validacion_esperada.py y optimizacion_<variante>_<caso>/), más el pozo muy hondo del
// barrido de z_p (OPT.pareto). Los tres casos con la misma estructura: qué cambia, qué se espera, indicadores (esperado vs
// obtenido), gráfica y veredicto. Sin nitrato: serie 33 (demanda promediada, tope de 50 iteraciones; exacto en
// optimizacion_nitrato_vscale_malla_eje_g1_prom_sin_nitrato/esperado.json). Sin demanda: corrida anterior (sin consumo el
// promedio por paso no la cambia), detenida por la parada práctica. Pozo muy hondo: barrido de la serie indicada en OPT.pareto.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';
const M = (t) => <InlineMath math={t} />;
const V = OPT.validaciones || {};
const J_EXACTO_MITAD = 0.1990;  // Ĵ exacto sin nitrato con la demanda tomada a mitad de paso (serie anterior)

// 2.74e-3 → «2.7·10⁻³» (cifras: 2 → «2.7», 1 → «3»)
const sup = e => [...String(e)].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('');
const pot = (v, cifras = 2) => {
    let e = Math.floor(Math.log10(v)), m = v / 10 ** e;
    if (Number(m.toFixed(cifras - 1)) >= 10) { m /= 10; e += 1; }
    return `${m.toFixed(cifras - 1)}·10${sup(e)}`;
};
const fmtZ = z => `${String(Math.round(z)).replace('-', '−')}`;
// iterado que ya se puede comparar: el final, o uno en curso que cumple las restricciones
const admisible = o => o && (o.estado === 'final' || (o.violacion ?? 1) < 1e-6);

function Veredicto({ ok, texto, detalle }) {
    const c = ok === true ? VALIDO : ok === false ? PLUMA : GRIS;
    return (
        <p style={{ ...nota, color: 'var(--sl-text)' }}>
            <span style={{ fontWeight: 600, color: c, border: `1.5px solid ${c}`, borderRadius: 4, padding: '0 8px', marginRight: 8, whiteSpace: 'nowrap' }}>{texto}</span>
            <span style={{ color: 'var(--sl-muted)' }}>{detalle}</span>
        </p>
    );
}

// indicadores: magnitud | se espera | se obtiene
function Indicadores({ filas }) {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '1.5px solid var(--sl-text)', borderBottom: '1.5px solid var(--sl-text)' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--a3-filete)' }}>
                <th style={th}></th><th style={{ ...th, textAlign: 'right' }}>se espera</th><th style={{ ...th, textAlign: 'right' }}>se obtiene</th>
            </tr></thead>
            <tbody>
                {filas.map(([n, e, o], i) => (
                    <tr key={i}>
                        <td style={{ ...td, ...nota, color: 'var(--sl-muted)' }}>{n}</td>
                        <td style={{ ...td, textAlign: 'right', color: 'var(--sl-muted)' }}>{e}</td>
                        <td style={{ ...td, textAlign: 'right' }}>{o}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const W = 380, H = 130;
// barras de Q_n (0 … Q_max) de una o dos series, en 30 días
function Barras({ series }) {
    const n = 72, bw = (W - 40) / n, qm = OPT.Q_max || 0.2;
    const ej = usePublica() ? { ...eje, fontSize: 19 } : { ...eje, fontSize: 16 };
    const sy = q => H - 22 - q / qm * (H - 36);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <line x1={34} x2={W - 4} y1={sy(qm)} y2={sy(qm)} stroke={GRIS} strokeOpacity="0.3" strokeDasharray="3 3" />
            <text x={30} y={sy(qm) + 5} textAnchor="end" style={ej}>{qm}</text>
            <line x1={34} x2={W - 4} y1={sy(0)} y2={sy(0)} stroke={GRIS} strokeOpacity="0.6" />
            <text x={30} y={sy(0) + 5} textAnchor="end" style={ej}>0</text>
            {series.map((s, j) => s.Q && s.Q.map((q, k) => (
                <rect key={`${j}-${k}`} x={36 + k * bw + (j ? bw / 2 : 0)} width={series.length > 1 ? bw / 2 - 0.4 : bw - 1}
                      y={sy(q)} height={sy(0) - sy(q)} fill={s.c} opacity="0.85" />
            )))}
            <text x={36} y={H - 3} style={ej}>0 d</text>
            <text x={W - 4} y={H - 3} textAnchor="end" style={ej}>Qₙ · 30 d</text>
        </svg>
    );
}

// J_m y costo frente a z_p (barrido con caudal fijo), de lo somero (izquierda) a lo hondo
function Hondo({ P }) {
    const ej = usePublica() ? { ...eje, fontSize: 19 } : { ...eje, fontSize: 16 };
    const z = P.zp, za = Math.max(...z), zb = Math.min(...z);
    const costo = z.map((_, i) => P.J2[i] + P.J3[i]), top = Math.max(...costo);
    const sx = v => 36 + (za - v) / (za - zb) * (W - 44), sy = v => H - 22 - v / top * (H - 44);
    const orden = z.map((v, i) => i).sort((a, b) => z[b] - z[a]);
    const linea = s => orden.map(i => `${sx(z[i])},${sy(s[i])}`).join(' ');
    // rótulo del costo arriba a la izquierda de su curva (creciente), a 60 % del recorrido
    const ic = orden[Math.round(0.6 * (orden.length - 1))];
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <line x1={34} x2={W - 4} y1={sy(0)} y2={sy(0)} stroke={GRIS} strokeOpacity="0.6" />
            <text x={30} y={sy(0) + 5} textAnchor="end" style={ej}>0</text>
            <line x1={sx(-1000)} x2={sx(-1000)} y1={8} y2={sy(0)} stroke={GRIS} strokeDasharray="3 3" strokeOpacity="0.6" />
            <polyline points={linea(costo)} fill="none" stroke={GRIS} strokeWidth="2.4" />
            <polyline points={linea(P.J1)} fill="none" stroke={PLUMA} strokeWidth="2.6" />
            <text x={sx(z[ic]) - 8} y={sy(costo[ic]) - 6} textAnchor="end" style={{ ...ej, fill: GRIS }}>costo</text>
            <text x={sx(za) + 4} y={sy(Math.max(P.J1[orden[0]], costo[orden[0]])) - 8} style={{ ...ej, fill: PLUMA }}>Jₘ</text>
            <text x={36} y={H - 3} style={ej}>{fmtZ(za)} m</text>
            <text x={sx(-1000)} y={H - 3} textAnchor="middle" style={ej}>−1000</text>
            <text x={W - 4} y={H - 3} textAnchor="end" style={ej}>{fmtZ(zb)}</text>
        </svg>
    );
}

export default function A3D25({ theme = 'dark' }) {
    const pub = usePublica();
    const sn = V.sin_nitrato || {}, sd = V.sin_demanda || {};
    const e1 = sn.esperado, o1 = admisible(sn.optimizador) ? sn.optimizador : null, o2 = admisible(sd.optimizador) ? sd.optimizador : null;
    const dJ1 = e1 && o1 ? (o1.J - e1.J) / e1.J : null;
    const ok1 = e1 && o1 ? Math.abs(o1.zp - e1.zp) < 5 && Math.abs(dJ1) < 0.01 : null;
    const qmax2 = o2 ? Math.max(...o2.Q) : null;
    const ok2 = o2 ? (qmax2 < 1e-3 ? true : o2.estado === 'final' ? false : null) : null;
    // diferencia máxima entre el caudal del optimizador y el exacto (sin nitrato)
    const dQ1 = e1 && o1 && e1.Q && o1.Q ? Math.max(...o1.Q.map((q, k) => Math.abs(q - e1.Q[k]))) : null;
    const P = OPT.pareto;
    const hondos = P ? P.zp.map((z, i) => ({ z, q: P.J1[i], c: P.J2[i] + P.J3[i] })).filter(o => o.z <= -1000) : [];
    const qmaxHondo = hondos.length ? Math.max(...hondos.map(o => o.q)) : null;
    const ok3 = hondos.length ? qmaxHondo < 1e-4 : null;
    const cH = hondos.length ? [hondos.find(o => o.z === Math.max(...hondos.map(h => h.z))), hondos.find(o => o.z === Math.min(...hondos.map(h => h.z)))] : null;
    const enCurso = o => (o.estado === 'final' ? 'final' : `sin converger: it. ${o.nit}, χ = ${o.chi ? pot(o.chi) : '—'}`);
    // J_m del barrido (caudal del iterado de ADR, con demanda) a la profundidad de la corrida sin demanda: misma profundidad,
    // con y sin bombeo. Interpolación lineal entre las dos muestras del barrido que la rodean.
    const J1conBombeo = (() => {
        if (!P || !o2 || o2.J1 === undefined) return null;
        const i = P.zp.map((z, k) => k).sort((a, b) => P.zp[b] - P.zp[a]);
        const k = i.findIndex((j, n) => n < i.length - 1 && P.zp[j] >= o2.zp && P.zp[i[n + 1]] <= o2.zp);
        if (k < 0) return null;
        const [a, b] = [i[k], i[k + 1]], t = (o2.zp - P.zp[a]) / (P.zp[b] - P.zp[a]);
        return P.J1[a] + t * (P.J1[b] - P.J1[a]);
    })();
    const sMin = (OPT.modelos || []).map(m => Math.min(...m.S));

    const casos = [
        {
            titulo: 'Sin nitrato', cambia: <>fuente apagada y {M('C')} inicial 0</>,
            espera: <><span className="a3-completa">{M('J_m\\equiv0')}: solo queda el costo {M('\\alpha J_{\\rm inst}+\\beta J_{\\rm op}')}, que crece
                con la profundidad ⇒ {M('z_p')} en su cota superior ({M('-200')} m) y el bombeo mínimo que cubre la demanda.</span>
                <span className="a3-publica">{M('\\hat J=\\cancel{\\gamma J_m}+\\alpha J_{\\rm inst}+\\beta J_{\\rm op}')} ⇒ pozo arriba, bombeo
                mínimo.</span></>,
            filas: [[<>{M('z_p')} [m]</>, e1 ? fmtZ(e1.zp) : '—', o1 ? fmtZ(o1.zp) : '—'],
                [M('\\hat J'), e1 ? e1.J.toFixed(4) : '—', o1 ? o1.J.toFixed(4) : '—']],
            grafica: <Barras series={[{ Q: e1 && e1.Q, c: GRIS }, { Q: o1 && o1.Q, c: AGUA }]} />,
            leyenda: <><span style={{ color: GRIS }}>■</span> exacto <span style={{ color: AGUA }}>■</span> optimizador</>,
            veredicto: o1 ? <Veredicto ok={ok1} texto={ok1 ? 'coincide' : 'no coincide'}
                                       detalle={<>{M('\\hat J')} {dJ1 >= 0 ? '+' : '−'}{Math.abs(dJ1 * 100).toFixed(2)} %<span className="a3-completa">; {enCurso(o1)}</span></>} />
                : <Veredicto ok={null} texto="en curso" detalle={sn.optimizador ? `it. ${sn.optimizador.nit}: aún no admisible` : 'sin iterado'} />,
        },
        {
            titulo: 'Sin demanda', cambia: 'demanda doméstica y de riego en 0',
            espera: <><span className="a3-completa">Sin consumo, {M('S_n\\ge0')} ya no obliga a bombear y {M('\\beta J_{\\rm op}')} solo
                suma ⇒ {M('Q_n=0')} y el tanque se queda en {M('S_0=500')} m³; {M('z_p')} equilibra instalación y calidad.</span>
                <span className="a3-publica">{M('S_n\\ge0')} ya no obliga a bombear y bombear solo cuesta ⇒ {M('Q_n=0')}.</span></>,
            filas: [[M('\\max_n Q_n'), '0', o2 ? qmax2.toFixed(3) : '—'],
                ['tanque [m³]', '500', o2 ? `${Math.min(...o2.S).toFixed(0)}–${Math.max(...o2.S).toFixed(0)}` : '—']],
            grafica: <Barras series={[{ Q: o2 && o2.Q, c: AGUA }]} />,
            leyenda: <><span style={{ color: AGUA }}>■</span> optimizador{o2 && <span className="a3-completa">; {M('z_p')} = {fmtZ(o2.zp)} m</span>}</>,
            veredicto: <Veredicto ok={ok2} texto={ok2 === true ? 'coincide' : ok2 === false ? 'no coincide' : 'aún no'}
                                  detalle={o2 ? <>{M('Q_n')} pequeño, no nulo<span className="a3-completa">; {enCurso(o2)}</span></> : 'corrida en curso'} />,
        },
        {
            titulo: 'Pozo muy hondo', cambia: <>mismo caudal, {M('z_p')} más hondo (barrido)</>,
            espera: <><span className="a3-completa">La pluma está cerca de la superficie: un pozo muy hondo no la ve ({M('J_m\\to0')}) y lo que
                queda, el costo, sigue subiendo ⇒ el óptimo no está en el fondo.</span>
                <span className="a3-publica">{M('\\gamma J_m\\to0')} y el costo sigue subiendo ⇒ el óptimo no está en el fondo.</span></>,
            filas: [[<>{M('J_m')}, {M('z_p\\le-1000')}</>, M('\\to0'), qmaxHondo === null ? '—' : qmaxHondo === 0 ? '0' : pot(qmaxHondo, 1)],
                ['costo', 'crece', cH ? `${cH[0].c.toFixed(2)} → ${cH[1].c.toFixed(2)}` : '—']],
            grafica: P ? <Hondo P={P} /> : null,
            leyenda: <><span style={{ color: PLUMA }}>■</span> {M('\\gamma J_m')} <span style={{ color: GRIS }}>■</span> {M('\\alpha J_{\\rm inst}+\\beta J_{\\rm op}')}</>,
            veredicto: <Veredicto ok={ok3} texto={ok3 === true ? 'coincide' : ok3 === false ? 'no coincide' : 'barrido en curso'}
                                  detalle={<>sin optimizar<span className="a3-completa">: solo el modelo directo</span></>} />,
        },
    ];
    // una fila de la rejilla por elemento de la estructura común, para que los tres casos queden alineados
    const filasRejilla = [
        c => (
            <div style={{ borderTop: '3px solid var(--sl-accent)', paddingTop: 8 }}>
                <p style={{ margin: 0, fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', lineHeight: 1.15 }}>{c.titulo}</p>
                <p style={{ ...nota, margin: '2px 0 0' }}>{c.cambia}</p>
            </div>
        ),
        c => <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}><span style={{ color: 'var(--sl-accent)' }}>Se espera: </span>{c.espera}</p>,
        c => <Indicadores filas={c.filas} />,
        c => <div>{c.grafica}<p style={{ ...nota, margin: 0 }}>{c.leyenda}</p></div>,
        c => c.veredicto,
    ];
    return (
        <SlideLayout title="Validación con casos triviales" theme={theme} justify="flex-start">
            <AvisoPreliminar style={{ marginBottom: 4 }}>
                <span className="a3-completa">; sin demanda: corrida anterior</span>
            </AvisoPreliminar>
            <p className="a3-completa" style={{ margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Casos cuya respuesta se conoce sin resolver la EDP: el optimizador completo (EDP, adjunto y restricciones) debe reproducirla.
            </p>
            <p className="a3-publica" style={{ margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Casos con respuesta conocida: el optimizador completo debe reproducirla.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 32, rowGap: pub ? 12 : 10, alignItems: 'start' }}>
                {filasRejilla.flatMap((f, r) => casos.map((c, k) => <React.Fragment key={`${r}-${k}`}>{f(c)}</React.Fragment>))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                <span style={{ color: 'var(--sl-accent)' }}>Lectura: </span>el costo sube el pozo y la calidad lo baja. Sin nitrato gana
                el costo; muy hondo ya no hay calidad que ganar; con nitrato el óptimo queda en medio (siguiente lámina).
                <span className="a3-completa"> La demanda fija cuánto hay que bombear.</span>
            </p>
            <Notas titulo="Validación: qué prueba cada caso">
                <h4>Para qué sirven</h4>
                <p>Cada caso quita un ingrediente (el nitrato, la demanda o el alcance de la pluma) para que la respuesta se conozca sin
                    resolver la EDP. Si el optimizador completo (estado, adjunto, gradiente, proyección sobre las restricciones del tanque)
                    no la reproduce, hay un error en la cadena. Los tres usan ADR y la malla con eje de 1 m.</p>
                <h4>1. Sin nitrato</h4>
                <p>Con la fuente apagada y {M('C')} inicial 0, {M('J_m\\equiv0')} y el problema ya no tiene EDP:{' '}
                    {M('J_{\\rm inst}=\\kappa_p(z_p-z_0)^2')} y {M('J_{\\rm op}=d_p\\int Q^2')} con {M('d_p=z_0-z_p')} crecen con la profundidad,
                    así que {M('z_p')} va a la cota superior ({M('-200')} m) y {M('Q')} resuelve un problema cuadrático con las
                    restricciones del tanque (solución exacta, sin EDP).</p>
                <p>El optimizador (it. {o1 ? o1.nit : '—'}, {M('\\chi')} = {o1 && o1.chi ? pot(o1.chi) : '—'}) tiene el {M('z_p')} exacto y{' '}
                    {M('\\hat J')} {dJ1 !== null ? `${(dJ1 * 100).toFixed(2)} %` : '—'} por encima; el caudal difiere del exacto a lo más{' '}
                    {dQ1 !== null ? dQ1.toFixed(3) : '—'} m²/s en algún paso. Este caso fijó el umbral de la parada práctica de la serie 33
                    ({M('\\chi\\le3\\cdot10^{-3}')}).
                    Incluso con {M('\\hat J')} analítico, trust-constr necesita 107–127 iteraciones para {M('\\chi<10^{-4}')}: la meseta
                    {M('\\chi\\approx3\\cdot10^{-3}')} es convergencia lenta del método, no un error del gradiente.</p>
                <p>Con la demanda promediada por paso el exacto es {M(`\\hat J=${e1 ? e1.J.toFixed(4) : '—'}`)} (con la demanda a mitad de paso
                    era {J_EXACTO_MITAD}); la serie 33 lo reproduce desde {M('z_p^0=-600')} m.</p>
                <h4>2. Sin demanda</h4>
                <p>Sin consumo, bombear solo cuesta: se espera {M('Q_n=0')} y el tanque fijo en {M('S_0=500')} m³ (supone que bombear no
                    limpia el agua del pozo, lo razonable si el pozo atrae agua de la pluma). {M('J_m')} no se anula, así que {M('z_p')}{' '}
                    equilibra instalación y calidad: no hay valor exacto que comparar.</p>
                <p>El optimizador (it. {o2 ? o2.nit : '—'}, {M('\\chi')} = {o2 && o2.chi ? pot(o2.chi) : '—'}) deja el caudal en a lo más{' '}
                    {qmax2 !== null ? qmax2.toFixed(3) : '—'} (la cota es {OPT.Q_max}), pero no a cero: el tanque sube hasta{' '}
                    {o2 ? Math.max(...o2.S).toFixed(0) : '—'} m³ ({M('S_{\\max}')} = {OPT.S_max} m³), con {M('z_p')} ={' '}
                    {o2 ? fmtZ(o2.zp) : '—'} m. Se detuvo por la parada práctica ({M('\\chi\\le3\\cdot10^{-3}')} tras 60 iteraciones) sin llegar
                    a {M('Q_n=0')}: no coincide del todo. Esta corrida usa el código anterior; sin demanda el promedio por paso solo afecta la
                    cota de la bomba, inactiva con {M('Q_n\\approx0')}.</p>
                <h4>3. Pozo muy hondo</h4>
                <p>Barrido de {M('\\hat J(z_p)')} con el caudal fijo (iterado {P ? P.nit : '—'} de ADR, {P && P.serie === '33' ? 'serie 33' : 'serie anterior'}); solo el modelo
                    directo, sin optimizador. {M('J_m')} baja de {P ? P.J1[P.zp.indexOf(Math.max(...P.zp))].toFixed(2) : '—'} en{' '}
                    {P ? fmtZ(Math.max(...P.zp)) : '—'} m a {qmaxHondo !== null ? (qmaxHondo === 0 ? '0' : pot(qmaxHondo, 1)) : '—'} a partir de
                    −1000 m, mientras el costo crece. Confirma que la pluma no llega a −1000 m y que el óptimo no está en la cota inferior
                    ({M('z_{\\min}=-1400')} m).</p>
                <h4>Qué enseñan sobre la profundidad</h4>
                <p>Con {M('Q')} fijo, {M('\\hat J(z_p)=\\gamma J_m(z_p)+\\alpha J_{\\rm inst}(z_p)+\\beta J_{\\rm op}(z_p)')}: el costo crece al
                    profundizar ({M('J_{\\rm inst}=\\kappa_p(z_p-z_0)^2')}, {M('J_{\\rm op}=d_p\\int Q^2')}) y {M('J_m')} baja (el pozo se aleja de la
                    pluma). Los casos 1 y 3 son los dos extremos: sin nitrato no hay nada que gane al profundizar y {M('z_p')} se va a su
                    cota superior; muy hondo ya no queda nitrato que evitar y solo sube el costo. Con nitrato el óptimo es interior, donde{' '}
                    {M('\\gamma\\,\\partial_{z_p}J_m=-\\partial_{z_p}(\\alpha J_{\\rm inst}+\\beta J_{\\rm op})')} (barrido de la lámina
                    siguiente).</p>
                <h4>Qué enseñan sobre la demanda</h4>
                <ul>
                    <li>La demanda fija cuánto se bombea: en las corridas con nitrato (serie 33) el tanque llega casi a vacío (mínimos{' '}
                        {sMin.map(v => v.toFixed(1)).join(', ')} m³), así que se bombea lo que pide la demanda y nada más. Sin demanda, el
                        optimizador deja el caudal en a lo más {qmax2 !== null ? qmax2.toFixed(3) : '—'}.</li>
                    {J1conBombeo !== null && <li>También pesa en la calidad. Sin demanda (casi sin bombeo), {M('\\gamma J_m')} ={' '}
                        {o2.J1.toFixed(3)} con {M('z_p')} = {fmtZ(o2.zp)} m; con el caudal del iterado {P.nit} de ADR a esa profundidad (barrido),{' '}
                        {J1conBombeo.toFixed(3)}, unas {Math.round(J1conBombeo / o2.J1)} veces más. En el transporte, {M('Q')} solo entra por la
                        velocidad de Darcy (y el almacenamiento): el bombeo la hace converger hacia el pozo y le acerca la pluma. La corrida
                        sin demanda no ha convergido, pero {M('J_m')} es la evaluación del modelo en su punto.</li>}
                    <li>Con la demanda cambia el costo de profundizar: {M('\\partial_{z_p}J_{\\rm op}=-\\int Q^2')}, así que más agua que
                        bombear empuja el pozo hacia arriba con más fuerza.</li>
                </ul>
                <h4>Procedencia</h4>
                <p>Sin nitrato: serie 33, detenida en la iteración 50 como las demás. Sin demanda: corrida anterior, que no depende de la
                    demanda. Pozo muy hondo: barrido con el caudal de ADR ({P && P.serie === '33' ? 'serie 33' : 'serie anterior'}).</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
const nota = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const th = { padding: '3px 6px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '3px 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', whiteSpace: 'nowrap' };
