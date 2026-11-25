import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useFases, reducida, tramo, suave } from './anim.js';
import { VERIF } from './verificacion.js';
import { usePublica, Notas } from './version.jsx';

// Verificación del gradiente adjunto en las seis implementaciones (data/output/verificacion_adjunto/*_alm1.json, de
// codigo/tests/test_gradiente_modelo_nuevo.py, 11–12 nov 2026): error relativo de la derivada direccional del adjunto frente a
// diferencias centradas con pasos δ = 10⁻² y 3·10⁻³, un par de puntos por dirección d, en escala log. Si el error es de las
// diferencias finitas, baja (10/3)² ≈ 11 veces; si es redondeo, no baja (sube como 1/δ, Cap. IV de la tesis).
// Configuración de la prueba (test_gradiente_modelo_nuevo.py: BASE, MRMT, EPS_FRAC; sin r_pozo ni Q_std en el env, así que valen
// los de config/parameters.py): 3 pasos de 10 h, C inicial ≡ 1, Q_n = 10⁻³ m²/s, z_p = −700 m, N_r = 2, malla de 30 m (RBF-FD) y
// 120 m (EF), núcleos del pozo con ε = espaciado de la malla. Lo confirma J0 = 7560 = 100·700·3·(10⁻³)²·36000 en los JSON.
// Se compara solo γJ_m: el costo económico (analítico) se resta de J y de ∇J. ADR se corrió con --rapido: tres direcciones, δ = 10⁻².
const MOD = [['adr', 'ADR'], ['mrmt_semi', 'MRMT semi'], ['mrmt_block', 'MRMT bloque']];
const BK = [['bfr', 'RBF-FD', 'var(--a3-agua)'], ['fenicsx', 'Elementos finitos', 'var(--sl-text)']];
const LO = -10.5, HI = -2.5;

// e(d) por fases: 1 la pendiente que da el adjunto, 2 la diferencia centrada, 3 el cociente relativo. Lo que aún no se
// explica va en gris. KaTeX no acepta variables CSS en \textcolor: hex de --a3-agua, --a3-pluma y --a3-estrato por tema.
const eqError = (fase, oscuro) => {
    const [ag, pl, gr] = oscuro ? ['#5CC4CC', '#EE8B5E', '#95A7B6'] : ['#0F7A85', '#C4511F', '#6E7F8D'];
    const A = String.raw`\textcolor{${ag}}{\nabla\hat J(u)\cdot\mathbf d}`;
    const D = String.raw`\dfrac{\hat J(u+\delta\,\mathbf d)-\hat J(u-\delta\,\mathbf d)}{2\delta}`;
    const B = fase >= 1 ? String.raw`\textcolor{${pl}}{${D}}` : D;
    const gris = fase >= 2 ? '' : String.raw`\color{${gr}}`;
    return String.raw`${gris}e(\mathbf d)=\frac{\Big|\,${A}\;-\;${B}\,\Big|}{\big|${A}\big|}`;
};
const M = (t) => <InlineMath math={t} />;
const FASES = [
    { n: 'Pendiente por el adjunto', dur: 1.2,
      p: <>{M('\\nabla\\hat J(u)\\cdot\\mathbf d')}: cuánto cambia {M('\\hat J')} si los controles se mueven en la dirección{' '}
          {M('\\mathbf d')}, según el gradiente que da el adjunto.</>,
      d: <>{M('u')}: un punto de prueba (caudales y profundidad); {M('\\mathbf d')}: una dirección unitaria en el espacio de
          controles. Sobre la recta {M('\\varphi(t)=\\hat J(u+t\\,\\mathbf d)')}, la pendiente en {M('t=0')} es{' '}
          {M("\\varphi'(0)=\\nabla\\hat J(u)\\cdot\\mathbf d")}. El vector {M('\\nabla\\hat J(u)')} sale de una resolución directa,
          una adjunta hacia atrás y el ensamblaje de las tres láminas anteriores; con él, la pendiente en cualquier dirección es
          un producto escalar.</> },
    { n: 'Pendiente medida', dur: 1.2,
      p: <>La misma pendiente medida sin el adjunto: {M('\\hat J')} un paso {M('\\delta')} adelante y otro atrás, dos simulaciones
          directas. Por Taylor se equivoca en orden {M('\\delta^2')}.</>,
      d: <>El cociente centrado es la pendiente de la secante entre {M('t=-\\delta')} y {M('t=\\delta')}: dos simulaciones
          directas, sin el adjunto. Del desarrollo de Taylor de {M('\\varphi')},{' '}
          {M("\\tfrac{\\varphi(\\delta)-\\varphi(-\\delta)}{2\\delta}=\\varphi'(0)+\\tfrac{\\delta^2}{6}\\varphi'''(0)+O(\\delta^4)")}: se
          equivoca en orden {M('\\delta^2')}. Con {M('\\delta')} muy pequeño domina el redondeo de {M('\\hat J')}, dividido
          entre {M('2\\delta')}.</> },
    { n: 'Error relativo', dur: 1.2,
      p: <>{M('e(\\mathbf d)')}: la diferencia entre las dos pendientes, relativa. {M('e=10^{-5}')} quiere decir que coinciden en
          unas cinco cifras.</>,
      d: <>{M('e(\\mathbf d)')} compara las dos pendientes y divide entre {M('|\\nabla\\hat J\\cdot\\mathbf d|')}, que cambia de
          magnitud entre direcciones y discretizaciones: así no depende de unidades ni del peso {M('\\gamma')}, y{' '}
          {M('e=10^{-5}')} quiere decir «coinciden en unas cinco cifras». Un valor aislado no decide; decide cómo cambia{' '}
          {M('e')} al reducir {M('\\delta')}.</> },
    { n: 'Lectura', dur: 3.0,
      p: <>Si el adjunto es correcto, {M('e')} baja como {M('\\delta^2')}: 11 veces al pasar de {M('\\delta=10^{-2}')} a{' '}
          {M('3\\cdot10^{-3}')}. Si estuviera mal, no bajaría.</>,
      d: <>Tres firmas al reducir {M('\\delta')}: si solo hay truncamiento (adjunto exacto), {M('e')} baja como{' '}
          {M('\\delta^2')}, {M('(10/3)^2\\approx11')} veces; un error del adjunto no depende de {M('\\delta')} y deja{' '}
          {M('e')} fija; el redondeo la hace subir como {M('1/\\delta')}. Antes de optimizar hay que saber que el gradiente es
          correcto: con uno erróneo el optimizador baja en una dirección falsa sin dar aviso.</> },
];
const LECTURA = FASES.length - 1;

// ── Notas de estudio: ecuaciones y cifras (las cifras salen de VERIF, no se escriben a mano) ──
const eqPhi = String.raw`\varphi(t)=\hat J(u+t\,\mathbf d),\qquad
\varphi(\pm\delta)=\varphi(0)\pm\delta\,\varphi'(0)+\tfrac{\delta^2}{2}\,\varphi''(0)\pm\tfrac{\delta^3}{6}\,\varphi'''(0)+O(\delta^4)`;
const eqCentrada = String.raw`D_\delta(\mathbf d)=\frac{\varphi(\delta)-\varphi(-\delta)}{2\delta}=\varphi'(0)+\frac{\delta^2}{6}\,\varphi'''(0)+O(\delta^4),
\qquad \varphi'(0)=\nabla\hat J(u)\cdot\mathbf d`;
const eqTres = String.raw`e(\delta)\;\lesssim\;\underbrace{\frac{\delta^2}{6}\,\frac{|\varphi'''(0)|}{|\varphi'(0)|}}_{\text{truncamiento}}
\;+\;\underbrace{\frac{\eta\,|\hat J(u)|}{\delta\,|\varphi'(0)|}}_{\text{redondeo}}
\;+\;\underbrace{\frac{|\mathbf r\cdot\mathbf d|}{|\varphi'(0)|}}_{\text{error del adjunto}}`;
const eqRazon = String.raw`\frac{e(10^{-2})}{e(3\cdot10^{-3})}=\Big(\frac{10^{-2}}{3\cdot10^{-3}}\Big)^2=\frac{100}{9}\approx11.1`;
const eqTaylor = String.raw`\big|\hat J(u+\delta\mathbf d)-\hat J(u)-\delta\,\nabla\hat J(u)\cdot\mathbf d\big|=O(\delta^2),\qquad
\big|\hat J(u+\delta\mathbf d)-\hat J(u-\delta\mathbf d)-2\delta\,\nabla\hat J(u)\cdot\mathbf d\big|=O(\delta^3)`;

// número en notación científica para KaTeX: 5.8\cdot10^{-10}
function sci(v, c = 1) {
    let e = Math.floor(Math.log10(Math.abs(v)));
    let m = v / 10 ** e;
    if (Math.abs(+m.toFixed(c)) >= 10) { m /= 10; e += 1; }
    return `${m.toFixed(c)}\\cdot10^{${e}}`;
}
const fmt = v => (Math.abs(v) >= 100 ? String(Math.round(v)) : v.toPrecision(2));   // 4131, 2.4, 0.033
const rango = v => [Math.min(...v), Math.max(...v)];
const PARES = VERIF.filter(r => r.eps === 0.01).flatMap(a => {
    const b = VERIF.find(r => r.backend === a.backend && r.modelo === a.modelo && r.direccion === a.direccion && r.eps !== 0.01);
    return b ? [{ ...a, razon: a.err / b.err }] : [];
});
const [RAZ_MIN, RAZ_MAX] = rango(PARES.filter(r => r.backend === 'bfr').map(r => r.razon));
const FEM = VERIF.filter(r => r.backend === 'fenicsx');
const [FEM_MIN, FEM_MAX] = rango(FEM.map(r => r.err));
const FEM_PARES = PARES.filter(r => r.backend === 'fenicsx');
const FEM_SUBE = FEM_PARES.filter(r => r.razon < 1).length;          // pares de EF en los que e sube al reducir δ
const [, BFR_FINO_MAX] = rango(VERIF.filter(r => r.backend === 'bfr' && r.eps !== 0.01).map(r => r.err));
const [ADR_MIN, ADR_MAX] = rango(VERIF.filter(r => r.backend === 'bfr' && r.modelo === 'adr').map(r => r.err));
const [ADJ_BFR_MIN, ADJ_BFR_MAX] = rango(VERIF.filter(r => r.backend === 'bfr').map(r => Math.abs(r.adjunto)));
const [ADJ_FEM_MIN, ADJ_FEM_MAX] = rango(FEM.map(r => Math.abs(r.adjunto)));
// dirección de EF con la derivada más pequeña: su error relativo es el mayor (mismo ruido absoluto entre un número pequeño)
const DER_MIN = FEM.reduce((m, r) => (Math.abs(r.adjunto) < Math.abs(m.adjunto) ? r : m));
const DER_MIN_MOD = MOD.find(([k]) => k === DER_MIN.modelo)[1];
const DER_MIN_ES_MAX = FEM.filter(r => r.modelo === DER_MIN.modelo && r.direccion === DER_MIN.direccion).some(r => r.err === FEM_MAX);
// Fuera de la figura: EF con C modulada (∇C ≠ 0) y h en P2, 16-nov (fenicsx_*_alm1_mod_h2.json): mínimo y máximo de e.
const MOD_H2 = ['3\\cdot10^{-9}', '9\\cdot10^{-6}'];

// cociente medio (geométrico) entre los errores con δ = 10⁻² y con δ = 3·10⁻³ de un grupo
function cociente(filas) {
    const a = filas.filter(r => r.eps === 0.01), b = filas.filter(r => r.eps !== 0.01);
    if (!a.length || !b.length) return null;
    const lg = v => v.reduce((s, r) => s + Math.log10(r.err), 0) / v.length;
    return 10 ** (lg(a) - lg(b));
}

export default function A3D11({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const saltar = k => ir(k, reducida());
    // los puntos de la figura caen en la última fase (y se repiten con un clic en ella)
    const p = fase < LECTURA ? 0 : l / FASES[LECTURA].dur;
    const repetir = () => saltar(LECTURA);
    const W = 1240, H = 380, L = 96, B = 66, T = 14;
    const sy = e => T + (HI - Math.log10(e)) / (HI - LO) * (H - T - B);
    const grupos = BK.flatMap(([b, nb, c]) => MOD.map(([m, nm]) => ({ b, nb, c, m, nm })));
    const ancho = (W - L - 20) / grupos.length;
    // en la pública, letra de la gráfica 20 % más grande
    const pub = usePublica();
    const fs = n => (pub ? Math.round(n * 1.2) : n);
    const ej = { ...eje, fontSize: fs(eje.fontSize) };
    return (
        <SlideLayout title="Verificación: el gradiente adjunto coincide con diferencias finitas" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 30, alignItems: 'center' }}>
                <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase" style={{ cursor: 'pointer' }}>
                    <Eq math={eqError(fase, theme === 'dark')} compacta />
                </div>
                <div style={{ minHeight: pub ? 150 : 190 }}>
                    <p style={{ margin: '0 0 4px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-accent)', fontWeight: 600 }}>
                        {fase + 1} · {FASES[fase].n}
                    </p>
                    <p style={{ ...txt, lineHeight: 1.38 }}>{pub ? FASES[fase].p : FASES[fase].d}</p>
                </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', cursor: 'pointer' }} onClick={repetir}>
                {[-10, -8, -6, -4].map(e => (
                    <g key={e}>
                        <line x1={L} x2={W - 20} y1={sy(10 ** e)} y2={sy(10 ** e)} stroke="var(--a3-estrato)" strokeOpacity="0.2" />
                        <text x={L - 10} y={sy(10 ** e) + 5} textAnchor="end" style={ej}>10<tspan dy="-8" fontSize={fs(11)}>{e}</tspan></text>
                    </g>
                ))}
                <text x={18} y={sy(10 ** -6.5)} transform={`rotate(-90 18 ${sy(10 ** -6.5)})`} textAnchor="middle" style={ej}>error relativo e(d)</text>
                {grupos.map((g, i) => {
                    const x0 = L + i * ancho;
                    const filas = VERIF.filter(r => r.backend === g.b && r.modelo === g.m);
                    const dirs = [...new Set(filas.map(r => r.direccion))];
                    const v = suave(tramo(p, 0.08 * i, 0.08 * i + 0.4));
                    const y = e => sy(10 ** HI) + v * (sy(e) - sy(10 ** HI));
                    const q = cociente(filas);
                    return (
                        <g key={`${g.b}-${g.m}`}>
                            {v > 0 && dirs.map((dname, k) => {
                                const a = filas.find(r => r.direccion === dname && r.eps === 0.01);
                                const b = filas.find(r => r.direccion === dname && r.eps !== 0.01);
                                const xa = x0 + 0.22 * ancho + k * 11, xb = x0 + 0.58 * ancho + k * 11;
                                return (
                                    <g key={dname}>
                                        {a && b && <line x1={xa} y1={y(a.err)} x2={xb} y2={y(b.err)} stroke={g.c} strokeOpacity="0.35" strokeWidth="1.5" />}
                                        {a && <circle cx={xa} cy={y(a.err)} r="7" fill="none" stroke={g.c} strokeWidth="2.2" />}
                                        {b && <circle cx={xb} cy={y(b.err)} r="7" fill={g.c} stroke={g.c} strokeWidth="2.2" />}
                                    </g>
                                );
                            })}
                            {g.b === 'bfr' && q && (
                                <text x={x0 + ancho / 2} y={sy(1e-3) - 4} textAnchor="middle" style={{ ...eje, fill: g.c, fontSize: fs(16), opacity: tramo(p, 0.6, 0.8) }}>
                                    baja {q.toFixed(0)} veces
                                </text>
                            )}
                            <text x={x0 + ancho / 2} y={H - B + 24} textAnchor="middle" style={{ ...eje, fill: 'var(--sl-text)', fontSize: fs(16) }}>{g.nm}</text>
                            {i % 3 === 1 && <text x={x0 + ancho / 2} y={H - B + 50} textAnchor="middle" style={{ ...eje, fill: g.c, fontSize: fs(17) }}>{g.nb}</text>}
                            {i === 3 && <line x1={x0} x2={x0} y1={T} y2={H - B + 48} stroke="var(--a3-estrato)" strokeOpacity="0.4" />}
                        </g>
                    );
                })}
                <text x={L + 4.5 * ancho} y={sy(10 ** -5.1)} textAnchor="middle" style={{ ...eje, fill: 'var(--sl-text)', fontSize: fs(16), opacity: tramo(p, 0.7, 0.9) }}>
                    piso de redondeo: no baja con δ
                </text>
            </svg>
            <div style={{ display: 'flex', gap: 34, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', margin: '2px 0 0' }}>
                <span>○ δ = 10⁻²</span><span>● δ = 3·10⁻³</span>
                <span>cada par unido es una dirección<span className="a3-completa">: Q uniforme, Q aleatoria, (Q, z<sub>p</sub>) aleatoria, −∇Ĵ (ADR: sin −∇Ĵ, solo δ = 10⁻²)</span></span>
            </div>
            <p style={{ ...txt, marginTop: 10, opacity: fase === LECTURA ? 1 : 0, transition: 'opacity 0.4s' }}>
                En RBF-FD el error baja 11 veces<span className="a3-completa"> al pasar de <InlineMath math="\delta=10^{-2}" /> a <InlineMath math="3\cdot10^{-3}" /></span>:
                justo <InlineMath math="(10/3)^2" /><span className="a3-completa">, lo que predice el error de las diferencias centradas</span>. El error es de las diferencias
                finitas, no del adjunto.<span className="a3-completa"> En elementos finitos todo está en <InlineMath math="10^{-10}" />–<InlineMath math="10^{-7}" />, el
                redondeo de los solucionadores.</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, 1fr)`, gap: 12, marginTop: 'auto', paddingTop: 8 }}>
                {FASES.map((x, k) => (
                    <button key={x.n} onClick={() => saltar(k)} title={`ir a: ${x.n}`}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 17 : 15, lineHeight: 1.2,
                                     whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                     color: k === fase ? 'var(--sl-accent)' : 'var(--sl-muted)', fontWeight: k === fase ? 600 : 400 }}>
                        <span style={{ display: 'block', height: 3, background: 'var(--a3-filete, #C9D3DB)', marginBottom: 5 }}>
                            <span style={{ display: 'block', height: 3, width: `${k < fase ? 100 : k > fase ? 0 : 100 * l / x.dur}%`, background: 'var(--sl-accent)' }} />
                        </span>
                        {k + 1} {x.n}
                    </button>
                ))}
            </div>
            <Notas titulo="Verificación del gradiente: procedimiento y lectura">
                <h4>0. Dónde encaja</h4>
                <p>Viene de las láminas del gradiente: el Lagrangiano da <InlineMath math="\nabla\hat J=\partial_uJ+(\partial_ue)^*\psi" />, el
                    adjunto <InlineMath math="\psi" /> se resuelve hacia atrás y se ensambla. Va al optimizador: el modelo cuadrático, la
                    Hessiana BFGS y la medida de criticidad χ usan ese vector en cada iteración. Esta lámina es el control de calidad
                    entre las dos: si el vector no fuera la derivada del <InlineMath math="\hat J" /> que se evalúa, el optimizador se
                    pararía o bajaría en una dirección falsa, sin ningún aviso.</p>
                <h4>1. Qué pregunta responde</h4>
                <p>El optimizador recibe dos cosas de cada simulación: el número <InlineMath math="\hat J(u)" /> y el
                    vector <InlineMath math="\nabla\hat J(u)" /> (73 componentes en las corridas). <InlineMath math="\hat J" /> se calcula
                    directamente; <InlineMath math="\nabla\hat J" /> sale del sistema adjunto y del ensamblaje de las láminas anteriores, una
                    cadena de transposiciones, condiciones de borde y acoplamientos en la que un signo o un término olvidado da un vector
                    plausible pero falso: el optimizador bajaría en una dirección equivocada sin ningún aviso. La pregunta es: <b>¿el vector
                    que entrega el adjunto es la derivada del mismo <InlineMath math="\hat J" /> que evalúa el código?</b> Se responde
                    comparándolo con algo que no usa el adjunto: diferencias finitas de <InlineMath math="\hat J" />.</p>

                <h4>2. Qué significa cada símbolo</h4>
                <ul>
                    <li><InlineMath math="u=(Q_1,\dots,Q_{N_t},z_p)" />: los controles. La prueba se hace en un punto fijo{' '}
                        <InlineMath math="u^0" />.</li>
                    <li><InlineMath math="\mathbf d" />: dirección de prueba, un vector unitario del espacio de controles. En la fórmula ya
                        lleva las escalas: cada caudal se mueve en unidades de <InlineMath math="s_Q=\max_nQ_n^0" /> y la profundidad en metros,
                        porque <InlineMath math="Q\approx10^{-3}" /> m²/s y <InlineMath math="z_p\approx-700" /> m: con un mismo paso en unidades
                        físicas, o el pozo no se movería o los caudales saltarían fuera de escala.</li>
                    <li><InlineMath math="\delta" />: el paso, adimensional. Con <InlineMath math="\delta=10^{-2}" /> cada caudal cambia como
                        mucho un 1 % de <InlineMath math="s_Q" /> y el pozo como mucho 1 cm.</li>
                    <li><InlineMath math="\varphi(t)=\hat J(u+t\,\mathbf d)" />: <InlineMath math="\hat J" /> restringido a la recta que pasa
                        por <InlineMath math="u" /> con dirección <InlineMath math="\mathbf d" />. Toda la prueba es unidimensional sobre esa
                        recta.</li>
                    <li><InlineMath math="\nabla\hat J(u)\cdot\mathbf d" />: la pendiente <InlineMath math="\varphi'(0)" /> según el adjunto.
                        Una simulación directa y una adjunta dan el vector entero; el producto con cualquier <InlineMath math="\mathbf d" /> no
                        cuesta más.</li>
                    <li><InlineMath math="D_\delta(\mathbf d)=\dfrac{\hat J(u+\delta\mathbf d)-\hat J(u-\delta\mathbf d)}{2\delta}" />: la
                        pendiente de la secante entre <InlineMath math="t=-\delta" /> y <InlineMath math="t=\delta" />. Cuesta dos simulaciones
                        directas por cada par <InlineMath math="(\mathbf d,\delta)" /> y no usa el adjunto.</li>
                    <li><InlineMath math="e(\mathbf d)" />: la discrepancia entre las dos pendientes, relativa. Se divide entre{' '}
                        <InlineMath math="|\nabla\hat J\cdot\mathbf d|" /> porque esa derivada va de {fmt(ADJ_BFR_MIN)} a{' '}
                        {fmt(ADJ_BFR_MAX)} en RBF-FD y de {fmt(ADJ_FEM_MIN)} a {fmt(ADJ_FEM_MAX)} en elementos
                        finitos. <InlineMath math="e=10^{-5}" /> quiere decir «coinciden en unas cinco cifras», sin importar unidades ni el
                        peso <InlineMath math="\gamma" />. (El código divide entre <InlineMath math="|D_\delta|" />; la diferencia es del
                        orden de <InlineMath math="e^2" />, invisible.)</li>
                </ul>

                <h4>3. El procedimiento, paso a paso</h4>
                <ol>
                    <li><b>Configuración barata.</b> Tres pasos de 10 h en el dominio real, <InlineMath math="Q_n=10^{-3}" /> m²/s,{' '}
                        <InlineMath math="z_p=-700" /> m, <InlineMath math="N_r=2" /> en MRMT, nube RBF-FD de 30 m y triangulación de 120 m.
                        Resultado: <InlineMath math="u^0\in\mathbb R^4" /> (tres caudales y la profundidad). Por qué: cada{' '}
                        <InlineMath math="\hat J" /> es una simulación completa y la prueba necesita muchas; el código que recorre los pasos
                        hacia atrás es el mismo con 3 que con 72 pasos.</li>
                    <li><b>Hacer trabajar al adjunto: <InlineMath math="C(\cdot,0)\equiv1" />.</b> La fuente del adjunto del transporte
                        es <InlineMath math="-2\gamma\,g_\varepsilon C_m" />. Con la pluma real el soluto no llega al pozo en 30 h:{' '}
                        <InlineMath math="C_m=0" /> allí, <InlineMath math="\psi_C\equiv0" /> y, como la fuente de <InlineMath math="\psi_h" />{' '}
                        contiene <InlineMath math="\psi_C" />, también <InlineMath math="\psi_h\equiv0" />. El gradiente sería solo el de los
                        costos y la prueba no vería el adjunto. Con <InlineMath math="C\equiv1" /> el pozo extrae soluto desde el primer paso y
                        entran los adjuntos del transporte, de las regiones inmóviles y del flujo, y la fuente de almacenamiento{' '}
                        <InlineMath math="-S_s\partial_t(C_m\psi_C)" />.</li>
                    <li><b>Aislar la parte que pasa por el adjunto.</b> <InlineMath math="J_{\rm inst}" /> y <InlineMath math="J_{\rm op}" />{' '}
                        son fórmulas explícitas en <InlineMath math="u" /> con gradiente analítico: se restan de <InlineMath math="\hat J" /> y
                        de <InlineMath math="\nabla\hat J" />, después de comprobar que el código con <InlineMath math="\gamma=0" /> da
                        exactamente esa fórmula. Lo que se compara es <InlineMath math="\gamma J_m" />. El peso <InlineMath math="\gamma" /> se
                        fija para que <InlineMath math="\gamma J_m" /> sea 100 veces el costo económico: <InlineMath math="e" /> no depende de{' '}
                        <InlineMath math="\gamma" />, pero así la resta no se come cifras.</li>
                    <li><b>Gradiente por el adjunto, una sola vez.</b> Una simulación directa que guarda el estado de cada paso, una adjunta
                        de <InlineMath math="T" /> a 0 (<InlineMath math="\psi_C" /> y <InlineMath math="\psi_{\mathrm{im},r}" />, luego{' '}
                        <InlineMath math="\psi_h" />) y el ensamblaje de la lámina anterior. Problema que resuelve: la derivada en todas las
                        direcciones a la vez, al costo de unas dos simulaciones. Resultado: el vector <InlineMath math="\nabla\hat J(u^0)" />.</li>
                    <li><b>Direcciones.</b> Cuatro, normalizadas: <InlineMath math="-\nabla\hat J" /> (la que seguiría un método de descenso,
                        la que más importa), caudal uniforme (todos los <InlineMath math="Q_n" /> suben igual: prueba la suma de las
                        componentes), caudal aleatorio (mezcla las componentes de <InlineMath math="Q" /> con signos distintos) y{' '}
                        <InlineMath math="(Q,z_p)" /> aleatoria (incluye la profundidad). Una componente errónea puede pasar inadvertida en una
                        dirección donde pesa poco o se compensa; por eso se usan varias. Con 4 variables y 4 direcciones independientes, en MRMT
                        las cuatro derivadas direccionales fijan el gradiente entero; en ADR se corrieron solo las tres últimas.</li>
                    <li><b>Diferencias centradas.</b> Para cada <InlineMath math="\mathbf d" /> y cada{' '}
                        <InlineMath math="\delta\in\{10^{-2},\,3\cdot10^{-3}\}" />: dos simulaciones directas en{' '}
                        <InlineMath math="u^0\pm\delta\mathbf d" /> y el cociente <InlineMath math="D_\delta" />. Problema que resuelve: estimar{' '}
                        <InlineMath math="\varphi'(0)" /> sin el adjunto. Resultado: un número por par <InlineMath math="(\mathbf d,\delta)" />.</li>
                    <li><b>Comparar y diagnosticar.</b> Se calcula <InlineMath math="e" /> con los dos pasos. Un valor aislado no decide
                        (¿<InlineMath math="10^{-4}" /> es poco o mucho?); decide cómo cambia <InlineMath math="e" /> al reducir{' '}
                        <InlineMath math="\delta" />, que es lo que dibuja la figura.</li>
                </ol>

                <h4>4. La ecuación: por qué el error debe bajar como δ²</h4>
                <p>Desarrollo de Taylor de <InlineMath math="\varphi" /> alrededor de 0 (<InlineMath math="\hat J" /> de clase{' '}
                    <InlineMath math="C^3" /> en la recta):</p>
                <BlockMath math={eqPhi} />
                <p>Al restar <InlineMath math="\varphi(\delta)-\varphi(-\delta)" /> se cancelan los términos pares (el valor y la
                    curvatura <InlineMath math="\varphi''" />):</p>
                <BlockMath math={eqCentrada} />
                <p>El cociente centrado se equivoca en orden <InlineMath math="\delta^2" />; el cociente hacia adelante{' '}
                    <InlineMath math="(\hat J(u+\delta\mathbf d)-\hat J(u))/\delta" />, en orden <InlineMath math="\delta" />. Con el mismo
                    paso es más preciso, y permite pasos más grandes, lejos del redondeo. En la práctica <InlineMath math="e" /> reúne tres
                    contribuciones:</p>
                <BlockMath math={eqTres} />
                <p>con <InlineMath math="\eta" /> la precisión relativa con que se evalúa cada <InlineMath math="\hat J" /> (aritmética de
                    doble precisión, solucionadores) y <InlineMath math="\mathbf r" /> el error del vector que entrega el adjunto. Cada una
                    tiene una firma distinta al reducir <InlineMath math="\delta" />:</p>
                <ul>
                    <li><b>Truncamiento</b> (adjunto exacto): baja como <InlineMath math="\delta^2" />. Al pasar de{' '}
                        <InlineMath math="10^{-2}" /> a <InlineMath math="3\cdot10^{-3}" />, <BlockMath math={eqRazon} />
                        en log–log, un segmento de pendiente 2.</li>
                    <li><b>Error del adjunto</b>: no depende de <InlineMath math="\delta" />. Si el adjunto estuviera mal, los dos puntos de
                        cada par quedarían a la misma altura, en <InlineMath math="|\mathbf r\cdot\mathbf d|/|\varphi'(0)|" />.</li>
                    <li><b>Redondeo</b>: crece como <InlineMath math="1/\delta" />, porque el ruido de <InlineMath math="\hat J" /> se divide
                        entre <InlineMath math="2\delta" />. Al reducir <InlineMath math="\delta" />, <InlineMath math="e" /> deja de bajar y
                        sube: es el piso.</li>
                </ul>
                <p>La curva completa <InlineMath math="e(\delta)" /> en log–log tiene forma de V: baja con pendiente 2 mientras domina el
                    truncamiento y sube con pendiente −1 cuando domina el redondeo. Por eso <InlineMath math="\delta" /> no se puede reducir
                    sin límite, y por eso se usan dos pasos moderados cuya razón 10/3 da un factor esperado de 11, imposible de confundir con
                    1 (adjunto erróneo) o con 0.3 (redondeo).</p>
                <p>Es la idea del test de Taylor (Farrell et al., 2013, citado en la tesis), que mira el residuo de primer orden:</p>
                <BlockMath math={eqTaylor} />
                <p>El de la izquierda es <InlineMath math="O(\delta^2)" /> si el gradiente es correcto y solo <InlineMath math="O(\delta)" />{' '}
                    si no (pendiente 2 frente a 1). La versión centrada de la lámina es la misma idea un orden más arriba: dividida entre{' '}
                    <InlineMath math="2\delta|\nabla\hat J\cdot\mathbf d|" /> da <InlineMath math="e=O(\delta^2)" />. Lo que certifica no es
                    el tamaño del error sino su orden.</p>

                <h4>5. Cómo leer la figura</h4>
                <ul>
                    <li>Seis columnas: tres modelos por dos discretizaciones. Eje vertical: <InlineMath math="e" /> en escala logarítmica
                        (entre líneas guía, un factor 100).</li>
                    <li>○ <InlineMath math="\delta=10^{-2}" />, ● <InlineMath math="\delta=3\cdot10^{-3}" />; el segmento une los dos pasos de
                        una misma dirección (los pares se desplazan un poco en horizontal para no taparse).</li>
                    <li><b>RBF-FD</b>: segmentos paralelos que bajan una década. La razón por dirección va de {RAZ_MIN.toFixed(2)} a{' '}
                        {RAZ_MAX.toFixed(2)}, frente a 11.11; «baja 11 veces» es su media geométrica en la columna. Toda la discrepancia es
                        truncamiento de las diferencias: el adjunto coincide al menos hasta <InlineMath math={sci(BFR_FINO_MAX)} />, el mayor
                        error con <InlineMath math="\delta=3\cdot10^{-3}" />. El truncamiento se ve porque el <InlineMath math="\hat J" /> de
                        RBF-FD no es cuadrático a lo largo de <InlineMath math="\mathbf d" /> (<InlineMath math="\varphi'''" /> apreciable); la
                        tesis lo atribuye a la no linealidad en el caudal a través de la velocidad y la dispersión.</li>
                    <li><b>Elementos finitos</b>: todo entre <InlineMath math={sci(FEM_MIN)} /> y <InlineMath math={sci(FEM_MAX)} />, y en{' '}
                        {FEM_SUBE} de {FEM_PARES.length} pares el error sube al reducir <InlineMath math="\delta" />: es el piso de redondeo. No
                        hay truncamiento visible porque <InlineMath math="\hat J" /> es casi cuadrático en el entorno probado, y las diferencias
                        centradas son exactas para cuadráticas (<InlineMath math="\varphi'''=0" />).{' '}
                        {DER_MIN_ES_MAX && <>La dirección con la derivada más pequeña ({DER_MIN.direccion} en {DER_MIN_MOD},{' '}
                        <InlineMath math={`\\nabla\\hat J\\cdot\\mathbf d\\approx${Math.abs(DER_MIN.adjunto).toPrecision(2)}`} />) tiene el
                        mayor error relativo: el mismo ruido absoluto dividido entre un número pequeño.</>}</li>
                    <li><b>ADR</b>: un solo paso y tres direcciones; sin pares, se lee por el nivel. En RBF-FD,{' '}
                        <InlineMath math={sci(ADR_MIN)} />–<InlineMath math={sci(ADR_MAX)} />, el mismo de los modelos MRMT con ese paso; en
                        elementos finitos, el redondeo.</li>
                    <li>Los niveles de las dos discretizaciones no se comparan entre sí: las mallas, los núcleos del pozo y los valores de{' '}
                        <InlineMath math="\nabla\hat J\cdot\mathbf d" /> son distintos. Cada columna se juzga por su propia firma.</li>
                </ul>

                <h4>6. Qué significa «OK»</h4>
                <p>No hay un umbral automático en el código: el veredicto es el orden observado (RBF-FD: razón ≈ 11 en todas las
                    direcciones) o el nivel de redondeo (elementos finitos: <InlineMath math="e<10^{-6}" /> con los dos pasos). Queda probado
                    que, en las seis implementaciones, el gradiente que produce el código (directo, adjunto hacia atrás y ensamblaje) es la
                    derivada del mismo <InlineMath math="\hat J" /> discreto que evalúa, incluidos los adjuntos del transporte, de las
                    regiones inmóviles y del flujo y la fuente de almacenamiento, hasta donde las diferencias finitas pueden resolver.</p>
                <p>Historia: la verificación de octubre de 2026 («6/6 OK») era un test de Taylor con la pluma real; como{' '}
                    <InlineMath math="J_m\approx0" /> en el horizonte corto, solo comprobaba los costos (la derivada direccional salía igual
                    en los seis casos). Esta prueba, de noviembre y con el modelo sin sumidero, la sustituye.</p>

                <h4>7. Qué no prueba</h4>
                <ul>
                    <li><b>Que el adjunto discreto se parezca al continuo.</b> Es la derivada exacta del problema ya discretizado (primero se
                        discretiza, después se deriva). Si ese <InlineMath math="\hat J" /> discreto converge con la malla es otra pregunta: en
                        el estudio de malla del 11-nov (ADR, de 15 626 a 20 348 nodos) los campos adjuntos de elementos finitos cambiaron
                        3–10 % y los de RBF-FD 25–36 %. Un gradiente exacto de un funcional poco resuelto es exacto, pero de otro problema.</li>
                    <li><b>La configuración de las corridas.</b> La prueba usa 4 variables, 3 pasos, <InlineMath math="Q=10^{-3}" /> m²/s y
                        núcleos del pozo del ancho de la malla de prueba (30 y 120 m); las corridas, 73 variables,{' '}
                        <InlineMath math="\varepsilon\approx6.7" /> m, la malla con eje refinado, la pluma de la fuente y{' '}
                        <InlineMath math="J" /> normalizado. Es el mismo código con otros parámetros. Falta una verificación con la pluma,{' '}
                        <InlineMath math="J_m" /> dominante y <InlineMath math="T" /> suficiente (pendiente anotado en el Cap. IV).</li>
                    <li><b>Todo el acoplamiento por la velocidad.</b> Con <InlineMath math="C\equiv1" />, <InlineMath math="\nabla C_m\approx0" />{' '}
                        lejos del pozo y de los bordes, así que el término <InlineMath math="\mathbf b=\psi_C\nabla C_m+\mathbf d" /> del adjunto
                        del flujo trabaja poco. Lo cubre otra corrida, solo en elementos finitos y fuera de la figura: <InlineMath math="C" />{' '}
                        modulada (<InlineMath math="\nabla C\neq0" />) y <InlineMath math="h" /> en P2 (16-nov), con{' '}
                        <InlineMath math="e" /> entre <InlineMath math={MOD_H2[0]} /> y <InlineMath math={MOD_H2[1]} />.</li>
                    <li><b>Lo que pasa lejos de <InlineMath math="u^0" />.</b> Se prueba un punto y pocas direcciones. En RBF-FD el recorte{' '}
                        <InlineMath math="C\ge0" /> hace a <InlineMath math="\hat J" /> no diferenciable donde se activa (con{' '}
                        <InlineMath math="C\equiv1" /> no se activa).</li>
                    <li><b>Nada sobre el optimizador ni sobre el óptimo.</b> Solo que la información de descenso que recibe es correcta. El
                        escalamiento <InlineMath math="\xi=x/s" /> del optimizador multiplica cada componente del gradiente por{' '}
                        <InlineMath math="s_i" /> (regla de la cadena) y no forma parte de la prueba.</li>
                </ul>

                <h4>8. Para explicarla en voz alta</h4>
                <ol>
                    <li>El optimizador solo sabe hacia dónde bajar por el gradiente; si el gradiente está mal, baja hacia donde no es.</li>
                    <li>Comparo la pendiente que da el adjunto con la que mido directamente: dos simulaciones, un paso adelante y otro
                        atrás.</li>
                    <li>Si el adjunto es exacto, la diferencia es solo el error de la secante, que cae como <InlineMath math="\delta^2" />:
                        al reducir el paso 3.3 veces, cae 11.</li>
                    <li>En RBF-FD cae 11 veces; en elementos finitos ya está en el redondeo, entre <InlineMath math="10^{-10}" /> y{' '}
                        <InlineMath math="10^{-7}" />.</li>
                    <li>Conclusión: el gradiente es la derivada exacta del funcional discreto. No dice que la malla haya convergido.</li>
                </ol>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const txt = { margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 };
