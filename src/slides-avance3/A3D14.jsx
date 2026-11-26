import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';
import { AvisoPreliminar } from './preliminar.jsx';

// Resultado parcial de la optimización (FEniCSx, malla con conos y eje de 1 m, γ = 1): serie 33 (z_p⁰ = −600 m, demanda
// promediada por paso, iterados admisibles) en su iterado 50, el tope de la serie; χ aún sobre la meta. J y z_p por
// evaluación, tal como las registró el optimizador (incluye pasos de prueba rechazados); las barras de Q pasan del control
// inicial al iterado 50 (no son iteraciones intermedias). La cota de la bomba es la de la demanda promediada.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', GRIS = 'var(--a3-estrato)';
const M = (t) => <InlineMath math={t} />;

const fmtZ = z => String(Math.round(z)).replace('-', '−');

// 5.3e-3 → «5.3·10⁻³»
const cientifico = v => {
    const [m, e] = v.toExponential(1).split('e');
    return `${m}·10${[...e.replace('+', '')].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('')}`;
};

function Serie({ y, f, color, W = 400, H = 220, etiqueta, fmt, lo, hi }) {
    const n = y.length, k = Math.max(1, Math.round(f * (n - 1)));
    const a = lo ?? Math.min(...y), b = hi ?? Math.max(...y);
    const pub = usePublica(), ej = pub ? { ...eje, fontSize: 19 } : { ...eje, fontSize: 16 };
    const x0 = pub ? 66 : 54;       // en la pública, letra más grande: más margen para que «0.491» no se corte
    const sx = i => x0 + i / (n - 1) * (W - x0 - 10), sy = v => 14 + (b - v) / (b - a || 1) * (H - 46);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[a, (a + b) / 2, b].map(v => (
                <g key={v}><line x1={x0} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 6} y={sy(v) + 6} textAnchor="end" style={ej}>{fmt(v)}</text></g>
            ))}
            <polyline points={y.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="2.6" />
            <circle cx={sx(k)} cy={sy(y[k])} r="5" fill={color} />
            <text x={x0} y={H - 6} style={ej}>evaluación {k + 1} de {n}</text>
            <text x={W - 10} y={H - 6} textAnchor="end" style={{ ...ej, fill: color }}>{etiqueta}: {fmt(y[k])}</text>
        </svg>
    );
}

// Barrido de Ĵ(z_p) con el caudal fijo (OPT.pareto: el iterado exportado de ADR, solo el modelo directo),
// de lo somero (izquierda) a lo hondo, hasta −650 m: γJ_m baja al profundizar y el costo αJ_inst + βJ_op sube; Ĵ es su
// suma y su mínimo es el z_p de ese iterado. Las flechas en el mínimo: hacia dónde empuja cada término.
function balanceZp(P) {
    const orden = P.zp.map((z, i) => i).filter(i => P.zp[i] >= -650).sort((a, b) => P.zp[b] - P.zp[a]);
    const z = orden.map(i => P.zp[i]), J1 = orden.map(i => P.J1[i]), costo = orden.map(i => P.J2[i] + P.J3[i]);
    const J = J1.map((v, i) => v + costo[i]);
    const k = Math.min(Math.max(1, J.indexOf(Math.min(...J))), J.length - 2);
    const dz = z[k - 1] - z[k + 1];          // > 0: de lo somero a lo hondo
    // cambio por metro más hondo en el mínimo (diferencia centrada con los vecinos del barrido)
    const dJ1 = (J1[k + 1] - J1[k - 1]) / dz, dCosto = (costo[k + 1] - costo[k - 1]) / dz;
    // cuánto cambia Ĵ con los vecinos del mínimo (≈ ±20 m), relativo
    const plano = (Math.max(J[k - 1], J[k + 1]) - J[k]) / J[k];
    return { z, J1, costo, J, k, dJ1, dCosto, plano, dzVecinos: Math.max(z[k - 1] - z[k], z[k] - z[k + 1]) };
}

function Balance({ P, f, mostrar }) {
    const B = balanceZp(P), { z, J1, costo, J, k } = B;
    const pub = usePublica(), ej = pub ? { ...eje, fontSize: 19 } : { ...eje, fontSize: 16 };
    const W = 760, H = 172, x0 = 46, x1 = W - 14, za = z[0], zb = z[z.length - 1], top = 0.62;
    const sx = v => x0 + (za - v) / (za - zb) * (x1 - x0), sy = v => 10 + (top - v) / top * (H - 40);
    const n = Math.max(2, Math.round(f * z.length));
    const linea = s => z.slice(0, n).map((v, i) => `${sx(v)},${sy(s[i])}`).join(' ');
    // rótulo de una curva sobre la muestra más cercana a zr (dy: arriba < 0, abajo > 0)
    const rotulo = (s, zr, dy, c, t) => {
        const i = z.reduce((m, v, j) => (Math.abs(v - zr) < Math.abs(z[m] - zr) ? j : m), 0);
        return <text x={sx(z[i])} y={sy(s[i]) + dy} textAnchor="middle" style={{ ...ej, fill: c }}>{t}</text>;
    };
    const yF = sy(0.56), xm = sx(z[k]);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <defs>
                {[['costo', GRIS], ['calidad', PLUMA]].map(([id, c]) => (
                    <marker key={id} id={`a3d14-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10 z" fill={c} />
                    </marker>
                ))}
            </defs>
            {[0, 0.3, 0.6].map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 6} y={sy(v) + 6} textAnchor="end" style={ej}>{v.toFixed(1)}</text></g>
            ))}
            <polyline points={linea(costo)} fill="none" stroke={GRIS} strokeWidth="2.4" />
            <polyline points={linea(J1)} fill="none" stroke={PLUMA} strokeWidth="2.4" />
            <polyline points={linea(J)} fill="none" stroke="var(--sl-text)" strokeWidth="3" />
            <g opacity={tramo(f, 0.6, 1)}>
                {rotulo(J, -300, 24, 'var(--sl-text)', 'Ĵ')}
                {rotulo(J1, -500, -10, PLUMA, 'γJₘ')}
                {rotulo(costo, -560, 24, GRIS, 'costo')}
            </g>
            <g opacity={mostrar}>
                <line x1={xm} x2={xm} y1={sy(J[k])} y2={H - 28} stroke="var(--sl-text)" strokeDasharray="4 4" strokeWidth="1.4" />
                <circle cx={xm} cy={sy(J[k])} r="6" fill="var(--sl-text)" />
                {/* hacia dónde empuja cada término: el costo, a lo somero (izquierda); la calidad, a lo hondo (derecha) */}
                <line x1={xm - 8} x2={xm - 70} y1={yF} y2={yF} stroke={GRIS} strokeWidth="2.6" markerEnd="url(#a3d14-costo)" />
                <text x={xm - 76} y={yF + 6} textAnchor="end" style={{ ...ej, fill: GRIS }}>el costo lo sube</text>
                <line x1={xm + 8} x2={xm + 70} y1={yF} y2={yF} stroke={PLUMA} strokeWidth="2.6" markerEnd="url(#a3d14-calidad)" />
                <text x={xm + 76} y={yF + 6} style={{ ...ej, fill: PLUMA }}>la calidad lo baja</text>
            </g>
            <text x={x0} y={H - 6} style={ej}>somero · {fmtZ(za)} m</text>
            <text x={xm} y={H - 6} textAnchor="middle" style={{ ...ej, fill: 'var(--sl-text)', opacity: mostrar }}>{fmtZ(z[k])}</text>
            <text x={x1} y={H - 6} textAnchor="end" style={ej}>{fmtZ(zb)} · hondo</text>
        </svg>
    );
}

export default function A3D14({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6000, 400);
    const pub = usePublica();
    const ej = pub ? { ...eje, fontSize: 21 } : { ...eje, fontSize: 17 };
    const o = OPT.modelos[0];
    if (!o || !o.historia) return <SlideLayout title="Resultado de la optimización" theme={theme}><p>Sin resultados.</p></SlideLayout>;
    const f = suave(tramo(p, 0, 0.85));
    const W = 1260, H = 190, n = o.Q.length, bw = (W - 70) / n;
    const sy = q => 12 + (1 - q / 0.22) * (H - 40);
    const J0 = o.J0, Jf = o.J;
    const ult = o.historia.zp.slice(-20), mov = Math.max(...ult) - Math.min(...ult);
    const zfuera = Math.max(...o.historia.zp), Jmin = Math.min(...o.historia.J);
    const Z200 = (OPT.consistencia || []).find(c => c.modelo === 'adr' && c.prueba === 'zp200');
    const etIt = `iterado ${o.nit}`;
    const filas = [['calidad del agua', String.raw`\gamma J_m`, 'J1'], ['instalación', String.raw`\alpha J_{\rm inst}`, 'J2'], ['bombeo', String.raw`\beta J_{\rm op}`, 'J3'], ['total', String.raw`\hat J`, 'J']];
    const escalon = c => c.map((v, k) => `${60 + k * bw},${sy(v)} ${60 + (k + 1) * bw},${sy(v)}`).join(' ');
    // balance del tanque del iterado exportado: lo bombeado es la demanda menos lo que ya tenía el tanque, más lo que queda
    const volumen = OPT.V_s * OPT.dt * o.Q.reduce((a, b) => a + b, 0), demanda = OPT.demanda.reduce((a, b) => a + b, 0);
    const Smin = Math.min(...o.S), S0 = o.S[0], ST = o.S[o.S.length - 1];
    const B = OPT.pareto ? balanceZp(OPT.pareto) : null;
    const miles = v => Math.round(v).toLocaleString('es-MX').replace(/,/g, '\u202f');      // espacio fino que no corta la cifra
    return (
        <SlideLayout title={`Resultado ADR (serie 33, iterado ${o.nit})`} theme={theme} justify="flex-start">
            <AvisoPreliminar style={{ marginBottom: 6 }}>
                <span>; χ = {o.chi ? cientifico(o.chi) : '—'}, meta 10⁻⁴</span>
            </AvisoPreliminar>
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'grid', gridTemplateColumns: pub ? '1fr 1fr 1.3fr' : '1fr 1fr 1.1fr', columnGap: 28, rowGap: 6, alignItems: 'start' }}>
                    <div>
                        <p style={tit}>Funcional {M('\\hat J')}</p>
                        <Serie y={o.historia.J} f={f} color={PLUMA} etiqueta="Ĵ" fmt={v => v.toFixed(3)} />
                    </div>
                    <div>
                        <p style={tit}>Profundidad {M('z_p')} [m]</p>
                        <Serie y={o.historia.zp} f={f} color={AGUA} etiqueta="zₚ" fmt={v => v.toFixed(0)} />
                    </div>
                    <div style={{ gridColumn: 3, gridRow: '1 / span 2' }}>
                        <p style={tit}>Términos del funcional</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                            <thead><tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                                <th style={th}></th><th style={{ ...th, textAlign: 'right' }}>inicio</th><th style={{ ...th, textAlign: 'right' }}>{etIt}</th></tr></thead>
                            <tbody>
                                {filas.map(([nm, m, k]) => (
                                    <tr key={k} style={{ fontWeight: k === 'J' ? 700 : 400, borderTop: k === 'J' ? '1px solid var(--a3-filete)' : 'none' }}>
                                        <td style={td}>{M(m)} <span style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)', fontWeight: 400 }}>{nm}</span></td>
                                        <td style={{ ...td, textAlign: 'right', color: 'var(--sl-muted)' }}>{Number(J0[k]).toFixed(3)}</td>
                                        <td style={{ ...td, textAlign: 'right', opacity: tramo(p, 0.85, 1) }}>{Number(Jf[k]).toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p style={{ ...nota, color: 'var(--sl-text)' }}>
                            Subir el pozo cambia instalación por nitrato: {M('\\alpha J_{\\rm inst}')} baja y {M('\\gamma J_m')} sube.
                        </p>
                        <p className="a3-publica" style={nota}>El caudal lo fija la demanda: el tanque baja hasta {Smin.toFixed(1)} m³.</p>
                        <p className="a3-completa" style={nota}>
                            El caudal lo fija la demanda: se bombean {miles(volumen)} m³, la demanda ({miles(demanda)} m³) menos lo que ya tenía el
                            tanque ({miles(S0)} m³) más lo que queda al final ({miles(ST)}); el tanque baja hasta {Smin.toFixed(1)} m³.
                        </p>
                    </div>
                    {B && <div style={{ gridColumn: '1 / span 2', gridRow: 2 }}>
                        <p style={tit}>¿Por qué {fmtZ(o.zp)} m? {M('\\hat J(z_p)')} con este caudal y el pozo a otras profundidades
                            {OPT.pareto.serie !== '33' && <span style={nota}> (caudal de la serie anterior)</span>}</p>
                        <Balance P={OPT.pareto} f={f} mostrar={tramo(p, 0.85, 1)} />
                        <p className="a3-completa" style={{ ...nota, marginTop: 0 }}>
                            Sin optimizar. Un metro más hondo: {M('\\gamma J_m')} {cientifico(B.dJ1).replace('-', '−')}, costo
                            +{cientifico(B.dCosto)}: casi se compensan.
                        </p>
                    </div>}
                </div>
                <p style={{ ...tit, marginTop: 12 }}>
                    Caudal {M('Q_n')} [m²/s] en los 72 intervalos: <span style={{ color: GRIS }}>inicial</span> →{' '}
                    <span style={{ color: AGUA }}>{etIt}</span>, con la cota <span style={{ color: PLUMA }}>{M('Q_{\\max}a(\\tau)')}</span>
                </p>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
                    {[0, 0.1, 0.2].map(v => <g key={v}><line x1={60} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                        <text x={52} y={sy(v) + 6} textAnchor="end" style={ej}>{v.toFixed(1)}</text></g>)}
                    {o.Q.map((q, k) => {
                        const v = lerp(OPT.Q0[k], q, f);
                        return <rect key={k} x={60 + k * bw + 1.5} width={bw - 3} y={sy(v)} height={sy(0) - sy(v)} fill={f < 1 ? GRIS : AGUA} opacity={0.35 + 0.5 * f} />;
                    })}
                    <polyline points={escalon(OPT.cota)} fill="none" stroke={PLUMA} strokeDasharray="5 4" strokeWidth="2" />
                    {[0, 10, 20, 30].map(d => <text key={d} x={60 + d / 30 * (W - 70)} y={H - 6} textAnchor={d === 30 ? 'end' : 'middle'} style={ej}>{d} d</text>)}
                </svg>
            </div>
            <Notas titulo={`Resultado ADR (${etIt}): cómo leer la lámina`}>
                <h4>Qué muestran las curvas</h4>
                <p>{M('\\hat J')} y {M('z_p')} en cada evaluación del optimizador hasta la iteración {o.nit} ({o.historia.J.length}{' '}
                    evaluaciones). Incluyen pasos de prueba que el optimizador rechazó ({M('z_p')} hasta {zfuera.toFixed(0)} m; el menor{' '}
                    {M('\\hat J')} evaluado, {Jmin.toFixed(3)}, es de uno de ellos); los iterados aceptados son todos admisibles. Las barras
                    pasan del control inicial al iterado {o.nit}; no son iteraciones intermedias.</p>
                <h4>Inicio</h4>
                <p>{M('Q_n=0.1')} con {M(`z_p=${OPT.zp0}`)} m vacía el tanque: se proyecta al conjunto admisible antes de empezar. Con el pozo
                    a {fmtZ(OPT.zp0)} m llega poco nitrato ({M('\\gamma J_m')} = {Number(J0.J1).toFixed(3)}), pero la instalación cuesta{' '}
                    {Number(J0.J2).toFixed(3)}.</p>
                <h4>Lectura de los términos</h4>
                <p>Subir el pozo de {fmtZ(OPT.zp0)} a {o.zp.toFixed(0)} m baja {M('\\alpha J_{\\rm inst}')} de {Number(J0.J2).toFixed(3)} a{' '}
                    {Number(Jf.J2).toFixed(3)} y sube {M('\\gamma J_m')} a {Number(Jf.J1).toFixed(3)}; {M('\\beta J_{\\rm op}')} sube porque el
                    caudal crece para cubrir la demanda y cumplir el tanque (aunque {M('d_p=z_0-z_p')} baja). Con {M('\\gamma=\\alpha=\\beta=1')} domina el costo; el balance
                    depende de los pesos (frente de Pareto, pendiente).</p>
                {B && <>
                    <h4>Por qué esa profundidad: el barrido de {M('\\hat J(z_p)')}</h4>
                    <p>Panel bajo las curvas: {M('\\hat J')} evaluado con el modelo directo, sin optimizar, en {B.z.length} profundidades entre{' '}
                        {fmtZ(B.z[0])} y {fmtZ(B.z[B.z.length - 1])} m, con el caudal del iterado {o.nit} fijo. Con {M('Q')} fijo,{' '}
                        {M('\\hat J(z_p)=\\gamma J_m(z_p)+\\alpha J_{\\rm inst}(z_p)+\\beta J_{\\rm op}(z_p)')}:</p>
                    <ul>
                        <li>{M('\\gamma J_m')} baja al profundizar, de {B.J1[0].toFixed(3)} a {B.J1[B.J1.length - 1].toFixed(4)}: el pozo se aleja de
                            la pluma, que entra cerca de la superficie.</li>
                        <li>El costo sube, de {B.costo[0].toFixed(3)} a {B.costo[B.costo.length - 1].toFixed(3)}:{' '}
                            {M('J_{\\rm inst}=\\kappa_p(z_p-z_0)^2')} y {M('J_{\\rm op}=d_p\\int_0^T Q^2')} con la altura de bombeo{' '}
                            {M('d_p=z_0-z_p')}.</li>
                        <li>En el mínimo, {M('\\partial\\hat J/\\partial z_p=0')}:{' '}
                            {M('\\gamma\\,\\partial_{z_p}J_m=-\\partial_{z_p}(\\alpha J_{\\rm inst}+\\beta J_{\\rm op})')}: lo que se gana en calidad al
                            bajar un metro iguala lo que cuesta. Con los vecinos del barrido, un metro más hondo cambia {M('\\gamma J_m')} en{' '}
                            {cientifico(B.dJ1).replace('-', '−')} y el costo en +{cientifico(B.dCosto)}: casi iguales y de signo opuesto (en el
                            mínimo exacto, que cae entre muestras, serían iguales).</li>
                        <li>El mínimo del barrido ({fmtZ(B.z[B.k])} m) es el {M('z_p')} del iterado {o.nit}: con su propio caudal, el optimizador
                            ya está en el mínimo de {M('\\hat J')} respecto de {M('z_p')}. Es plano: a {Math.round(B.dzVecinos)} m del mínimo,{' '}
                            {M('\\hat J')} cambia {(100 * B.plano).toFixed(2)} %. Por eso un cambio pequeño en {M('J_m')} (otro modelo de
                            transporte, otra demanda) mueve {M('z_p')} decenas de metros.</li>
                    </ul>
                </>}
                <h4>El caudal lo fija la demanda</h4>
                <p>El tanque cumple {M('S_n=S_{n-1}+V_s\\Delta t\\,Q_n-d_n\\ge0')}; sumando los 72 pasos,{' '}
                    {M('V_s\\Delta t\\sum_n Q_n=\\sum_n d_n-S_0+S_T')}: se bombean {miles(volumen)} m³ = {miles(demanda)} − {miles(S0)} +{' '}
                    {miles(ST)}. El tanque llega casi a vacío ({Smin.toFixed(1)} m³): no se bombea más de lo que pide la demanda, porque bombear
                    cuesta. Con el volumen fijo, {M('\\int_0^TQ^2\\ge\\big(\\int_0^TQ\\big)^2/T')} (Cauchy–Schwarz), con igualdad si {M('Q')} es
                    constante: {M('\\beta J_{\\rm op}')} empuja a repartir el bombeo; la cota de la bomba, el tanque y {M('J_m')}, que también
                    depende de {M('Q')}, lo apartan de ese reparto. Si la demanda crece, crece {M('\\int Q^2')} y con él el costo de bajar un
                    metro el pozo ({M('\\beta\\int Q^2')} en {M('J_{\\rm op}')}).</p>
                <h4>Convergencia</h4>
                <p>La serie se detuvo en la iteración {o.nit} con {M('\\chi')} = {o.chi ? cientifico(o.chi) : '—'}, sobre la meta 10⁻⁴: no es un
                    óptimo certificado. {M('z_p')} ya casi no se mueve ({mov.toFixed(1)} m en las últimas 20 evaluaciones); lo que falta es
                    pulir el caudal, y {M('\\hat J')} cambia muy poco de una iteración a otra.</p>
                <h4>Por qué no es definitivo</h4>
                <p>Además de {M('\\chi')}, la prueba de consistencia desde {M('z_p^0=-200')} m{Z200 ? <> va en {M(`z_p=${fmtZ(Z200.zp)}`)} m
                    con {M(`\\hat J=${Z200.J.toFixed(4)}`)} (iteración {Z200.nit}), frente a {fmtZ(o.zp)} m y {Number(Jf.J).toFixed(4)} desde{' '}
                    {fmtZ(OPT.zp0)} m: </> : ' '}no llega al mismo punto. Como {M('\\hat J')} es casi plano en {M('z_p')} cerca del mínimo, puede ser
                    convergencia lenta o un mínimo local; se revisará al terminar las pruebas.</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const th = { padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '6px 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
