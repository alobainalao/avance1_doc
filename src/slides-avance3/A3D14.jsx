import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';
import { AvisoPreliminar } from './preliminar.jsx';

// Resultado preliminar de la optimización (FEniCSx, malla con conos y eje de 1 m, γ = 1; χ aún sobre la meta), serie anterior
// (z_p⁰ = −700 m, demanda tomada a mitad de cada paso). J y z_p por evaluación, tal como las registró el optimizador (incluye
// pasos de prueba rechazados, algunos fuera de U_ad); las barras de Q pasan del control inicial al mejor iterado (no son
// iteraciones intermedias). En la completa, la cota de la bomba con la demanda promediada (serie 33, OPT.demanda_real.a).
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', GRIS = 'var(--a3-estrato)';
const M = (t) => <InlineMath math={t} />;

// 5.3e-3 → «5.3·10⁻³»
const cientifico = v => {
    const [m, e] = v.toExponential(1).split('e');
    return `${m}·10${[...e.replace('+', '')].map(c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('')}`;
};

function Serie({ y, f, color, W = 400, H = 220, etiqueta, fmt, lo, hi }) {
    const n = y.length, k = Math.max(1, Math.round(f * (n - 1)));
    const a = lo ?? Math.min(...y), b = hi ?? Math.max(...y);
    const ej = usePublica() ? { ...eje, fontSize: 19 } : { ...eje, fontSize: 16 };
    const sx = i => 54 + i / (n - 1) * (W - 64), sy = v => 14 + (b - v) / (b - a || 1) * (H - 46);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[a, (a + b) / 2, b].map(v => (
                <g key={v}><line x1={54} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={48} y={sy(v) + 6} textAnchor="end" style={ej}>{fmt(v)}</text></g>
            ))}
            <polyline points={y.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="2.6" />
            <circle cx={sx(k)} cy={sy(y[k])} r="5" fill={color} />
            <text x={54} y={H - 6} style={ej}>evaluación {k + 1} de {n}</text>
            <text x={W - 10} y={H - 6} textAnchor="end" style={{ ...ej, fill: color }}>{etiqueta}: {fmt(y[k])}</text>
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
    const W = 1260, H = 220, n = o.Q.length, bw = (W - 70) / n;
    const sy = q => 12 + (1 - q / 0.22) * (H - 40);
    const J0 = o.J0, Jf = o.J;
    const ult = o.historia.zp.slice(-20), mov = Math.max(...ult) - Math.min(...ult);
    const zfuera = Math.max(...o.historia.zp), Jmin = Math.min(...o.historia.J);
    const cota33 = OPT.demanda_real && OPT.demanda_real.a ? OPT.demanda_real.a.map(a => OPT.Q_max * a) : null;
    // pasos en que el caudal del mejor iterado toca la cota muestreada a mitad de paso por debajo de la cota corregida
    const pegados = cota33 ? o.Q.filter((q, k) => OPT.cota[k] < cota33[k] - 1e-3 && q > 0.95 * OPT.cota[k]).length : 0;
    const filas = [['calidad del agua', String.raw`\gamma J_m`, 'J1'], ['instalación', String.raw`\alpha J_{\rm inst}`, 'J2'], ['bombeo', String.raw`\beta J_{\rm op}`, 'J3'], ['total', String.raw`\hat J`, 'J']];
    const escalon = c => c.map((v, k) => `${60 + k * bw},${sy(v)} ${60 + (k + 1) * bw},${sy(v)}`).join(' ');
    return (
        <SlideLayout title="Mejor iterado ADR (preliminar, serie anterior)" theme={theme} justify="flex-start">
            <AvisoPreliminar style={{ marginBottom: 6 }}>
                <span className="a3-completa">; χ = {o.chi ? cientifico(o.chi) : '—'}, meta 10⁻⁴</span>
            </AvisoPreliminar>
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'grid', gridTemplateColumns: pub ? '1fr 1fr 1.3fr' : '1fr 1fr 1.1fr', gap: 28, alignItems: 'start' }}>
                    <div>
                        <p style={tit}>Funcional {M('\\hat J')}</p>
                        <Serie y={o.historia.J} f={f} color={PLUMA} etiqueta="Ĵ" fmt={v => v.toFixed(3)} />
                    </div>
                    <div>
                        <p style={tit}>Profundidad {M('z_p')} [m]</p>
                        <Serie y={o.historia.zp} f={f} color={AGUA} etiqueta="zₚ" fmt={v => v.toFixed(0)} />
                    </div>
                    <div>
                        <p style={tit}>Términos del funcional</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                            <thead><tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                                <th style={th}></th><th style={{ ...th, textAlign: 'right' }}>inicio</th><th style={{ ...th, textAlign: 'right' }}>mejor iterado</th></tr></thead>
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
                        <p className="a3-completa" style={nota}>
                            El inicio no es admisible (vacía el tanque); el mejor iterado cumple todas las restricciones. En las últimas 20
                            evaluaciones {M('z_p')} varía {mov.toFixed(1)} m; el caudal aún se afina.
                        </p>
                        <p className="a3-publica" style={nota}>{M('\\chi')} = {o.chi ? cientifico(o.chi) : '—'} (meta 10⁻⁴).</p>
                    </div>
                </div>
                <p style={{ ...tit, marginTop: 14 }}>
                    Caudal {M('Q_n')} [m²/s] en los 72 intervalos: <span style={{ color: GRIS }}>inicial</span> →{' '}
                    <span style={{ color: AGUA }}>mejor iterado</span>, con la cota <span style={{ color: PLUMA }}>{M('Q_{\\max}a(\\tau)')}</span>
                    <span className="a3-completa"> de esta serie y, punteada en gris, la cota con la demanda corregida (serie 33)</span>
                </p>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
                    {[0, 0.1, 0.2].map(v => <g key={v}><line x1={60} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                        <text x={52} y={sy(v) + 6} textAnchor="end" style={ej}>{v.toFixed(1)}</text></g>)}
                    {o.Q.map((q, k) => {
                        const v = lerp(OPT.Q0[k], q, f);
                        return <rect key={k} x={60 + k * bw + 1.5} width={bw - 3} y={sy(v)} height={sy(0) - sy(v)} fill={f < 1 ? GRIS : AGUA} opacity={0.35 + 0.5 * f} />;
                    })}
                    <polyline points={escalon(OPT.cota)} fill="none" stroke={PLUMA} strokeDasharray="5 4" strokeWidth="2" />
                    {cota33 && !pub && <polyline points={escalon(cota33)} fill="none" stroke={GRIS} strokeDasharray="2 4" strokeWidth="2.2" opacity={tramo(p, 0.85, 1)} />}
                    {[0, 10, 20, 30].map(d => <text key={d} x={60 + d / 30 * (W - 70)} y={H - 6} textAnchor={d === 30 ? 'end' : 'middle'} style={ej}>{d} d</text>)}
                </svg>
            </div>
            <Notas titulo="Mejor iterado ADR: cómo leer la lámina">
                <h4>Qué muestran las curvas</h4>
                <p>{M('\\hat J')} y {M('z_p')} en cada evaluación del optimizador ({o.historia.J.length} evaluaciones, iteración {o.nit}). Incluyen
                    pasos de prueba rechazados, algunos fuera de {M('\\mathcal U_{ad}')} ({M('z_p')} hasta {zfuera.toFixed(0)} m,{' '}
                    {M('\\hat J')} = {Jmin.toFixed(3)}, menor que el mejor iterado porque viola las restricciones): en esta serie trust-constr
                    solo exigía las restricciones al converger. La serie 33 usa iterados admisibles en todo momento. Las barras pasan del
                    control inicial al mejor iterado; no son iteraciones intermedias.</p>
                <h4>Inicio</h4>
                <p>{M('Q_n=0.1')} y {M('z_p=-700')} m: no es admisible, porque el tanque se vacía. Con el pozo a −700 m casi no llega nitrato
                    ({M('\\gamma J_m')} = {Number(J0.J1).toFixed(3)}), pero la instalación cuesta {Number(J0.J2).toFixed(3)}.</p>
                <h4>Lectura de los términos</h4>
                <p>Subir el pozo de −700 a {o.zp.toFixed(0)} m baja {M('\\alpha J_{\\rm inst}')} de {Number(J0.J2).toFixed(3)} a{' '}
                    {Number(Jf.J2).toFixed(3)} y sube {M('\\gamma J_m')} a {Number(Jf.J1).toFixed(3)}; {M('\\beta J_{\\rm op}')} sube porque el
                    caudal crece para cubrir la demanda y cumplir el tanque (aunque {M('d_p=z_0-z_p')} baja). Con {M('\\gamma=\\alpha=\\beta=1')} domina el costo; el balance
                    depende de los pesos (frente de Pareto, pendiente).</p>
                <h4>Convergencia</h4>
                <p>{M('\\chi')} = {o.chi ? cientifico(o.chi) : '—'}, lejos de la meta 10⁻⁴. {M('z_p')} ya casi no se mueve ({mov.toFixed(1)} m en las
                    últimas 20 evaluaciones); lo que falta es el caudal. Por eso es un «mejor iterado», no un óptimo.</p>
                <h4>Por qué no es definitivo</h4>
                <p>La cota de la bomba {M('Q_{\\max}a(\\tau)')} se tomó del perfil horario a mitad de cada paso: baja hasta{' '}
                    {Math.min(...OPT.cota).toFixed(2)}, mientras que con el promedio exacto no baja de{' '}
                    {cota33 ? Math.min(...cota33).toFixed(2) : '—'} (línea gris punteada). En {pegados} de los 72 pasos el caudal del mejor
                    iterado está pegado a esas caídas falsas: el perfil de bombeo sigue en parte al error de muestreo. Observación preliminar
                    con la demanda corregida: el optimizador aplana el bombeo ({M('\\sum Q_n^2')} −5.6 %) y {M('\\hat J')} cambia del orden de
                    10⁻², más que las diferencias entre modelos. Hay que reemplazar {M('z_p')}, los términos y el perfil por los de la serie 33.</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const th = { padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', fontWeight: 500 };
const td = { padding: '6px 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
