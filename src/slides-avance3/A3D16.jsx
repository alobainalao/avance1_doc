import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from './ui.jsx';
import { useFases, reducida, suave, tramo, lerp } from './anim.js';
import { usePublica, Notas } from './version.jsx';
import { TC2D } from './trustConstr2d.js';

// Del punto inicial al óptimo (tesis, Cap. III: algoritmo de optimización y eq:criticidad). La figura es una
// ilustración en 2D con iterados REALES de trust-constr (codigo/scripts/exportar_trust_constr_2d.py: mismo algoritmo y
// opciones que la serie 33, sobre un cuadrático con cotas y dos restricciones acopladas); no es la corrida del acuífero.
const AGUA = 'var(--a3-agua)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)', RIEGO = 'var(--a3-riego)';
const ITS = TC2D.iteraciones, OPT = TC2D.optimo, N = ITS.length;
const PARO = ITS.find(r => r.chi < 1e-4);              // primera iteración con χ < 10⁻⁴

// Coordenadas: u ∈ [−0.06, 1.14] × [−0.06, 1.08], misma escala en los dos ejes (las elipses no se deforman).
const W = 760, H = 620, S = 500, X0 = 60, Y0 = 590;
const sx = u => X0 + (u + 0.06) * S, sy = u => Y0 - (u + 0.06) * S;
const P = q => [sx(q[0]), sy(q[1])];
const MARCO = [[-0.06, -0.06], [1.14, -0.06], [1.14, 1.08], [-0.06, 1.08]];
const camino = pts => pts.map((q, i) => `${i ? 'L' : 'M'}${sx(q[0]).toFixed(1)},${sy(q[1]).toFixed(1)}`).join(' ') + ' Z';

// Curvas de nivel Ĵ = c: elipses con centro en el mínimo libre m, semiejes √(2c) y √(2c/K), eje mayor a th grados.
const NIVELES = [0.02, 0.06, 0.12, 0.2, OPT.J, 0.4, 0.56, 0.76, 1.0, 1.3, 1.65, 2.05, 2.5, 3.11, 3.8];
// lados del polígono: cotas de caja y restricciones acopladas (filas de A)
const LADOS = [
    { a: 0, b: 1, tipo: 'cota' }, { a: 1, b: 2, tipo: 'cota' },
    { a: 2, b: 3, tipo: 'acoplada', et: 'u₁ + u₂ ≤ 1.25' }, { a: 3, b: 4, tipo: 'acoplada', et: '−0.6 u₁ + u₂ ≤ 0.62' },
    { a: 4, b: 0, tipo: 'cota' },
];

const FASES = [
    { n: 'Región admisible', dur: 1.4,
      p: <>Cotas de caja y dos restricciones <b style={{ color: RIEGO }}>acopladas</b>, como el tanque. Lo sombreado no es admisible.</>,
      d: <>El conjunto admisible es la intersección de las cotas <InlineMath math="0\le u_i\le1" /> (como{' '}
          <InlineMath math="0\le Q_n\le\overline Q_n" />) con dos restricciones <b style={{ color: RIEGO }}>acopladas</b>, que
          mezclan las dos variables (como el tanque, que mezcla todos los caudales anteriores). Lo sombreado no es admisible.</> },
    { n: 'Curvas de nivel', dur: 2.2,
      p: <>Curvas de nivel de <InlineMath math="\hat J" />. Su mínimo libre cae fuera: el óptimo estará en el borde.</>,
      d: <>Curvas de nivel de <InlineMath math="\hat J" />: en cada elipse <InlineMath math="\hat J" /> es constante y baja
          hacia el centro. El mínimo sin restricciones cae fuera del conjunto, así que el óptimo admisible estará en el
          borde.</> },
    { n: 'Punto inicial', dur: 1.4,
      p: <>Se parte de un punto admisible; <InlineMath math="-\nabla\hat J" /> señala hacia dónde baja <InlineMath math="\hat J" />.</>,
      d: <>Se parte de un punto admisible <InlineMath math="u_0" /> (en las corridas, el caudal estándar con{' '}
          <InlineMath math="z_p=-600" /> m, llevado al interior). La flecha gris es <InlineMath math="-\nabla\hat J(u_0)" />:
          la dirección de máximo descenso, que en el acuífero da el adjunto.</> },
    { n: 'Iteraciones', dur: 0.55 * N + 0.4,
      p: <>Cada paso combina gradiente y curvatura; la barrera <InlineMath math="\mu" /> mantiene los iterados dentro y baja cada vez.</>,
      d: <>Cada paso (azul) usa el gradiente y la curvatura estimada (BFGS), por eso no sigue la flecha gris. La barrera{' '}
          <InlineMath math="-\mu\sum\log s_i" /> mantiene los iterados dentro; al resolver cada subproblema,{' '}
          <InlineMath math="\mu\leftarrow\mu/5" /> y los iterados se acercan al borde.</> },
    { n: 'Óptimo y KKT', dur: 2.2,
      p: <>En el óptimo, <InlineMath math="-\nabla\hat J" /> es perpendicular al lado activo y la curva de nivel lo toca: <InlineMath math="\chi=0" />.</>,
      d: <>En el óptimo <InlineMath math="\hat u" /> la curva de nivel toca el lado activo y{' '}
          <InlineMath math="-\nabla\hat J(\hat u)" /> es perpendicular a él, hacia afuera: no queda dirección admisible que
          baje <InlineMath math="\hat J" />. Es la condición KKT, con multiplicador <InlineMath math={`\\lambda=${OPT.lambda_lin[0].toFixed(2)}`} />.</> },
];
const ITER = 3, FIN = 4;

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sci = v => {
    if (v >= 0.01 && v < 10) return String(Number(v.toPrecision(2)));
    const e = Math.floor(Math.log10(v));
    return `${(v / 10 ** e).toFixed(1)}·10${String(e).split('').map(ch => SUP[ch]).join('')}`;
};

// Flecha de dirección (solo dirección: largo fijo en pantalla) desde q con vector v en coordenadas u.
function Flecha({ q, v, largo = 70, color = GRIS, ancho = 2.2, trazo, id = 'tc-gris' }) {
    const n = Math.hypot(v[0], v[1]) || 1, [x, y] = P(q);
    return <line x1={x} y1={y} x2={x + largo * v[0] / n} y2={y - largo * v[1] / n} stroke={color} strokeWidth={ancho}
                 strokeDasharray={trazo} markerEnd={`url(#${id})`} />;
}

function Figura({ fase, P: avance, l }) {
    const pub = usePublica();
    const fs = pub ? 21 : 18;
    const fN = suave(avance(1));
    // iteración en curso: índice y fracción del movimiento hacia el siguiente iterado
    const t = fase > ITER ? N - 1 : fase < ITER ? 0 : Math.min(N - 1, l / 0.55);
    const i = Math.floor(t), fr = fase === ITER ? suave(Math.min(1, (t - i) * 1.6)) : 1;
    const sig = ITS[Math.min(N - 1, i + 1)];
    const actual = fase === ITER && i < N - 1 ? [lerp(ITS[i].x[0], sig.x[0], fr), lerp(ITS[i].x[1], sig.x[1], fr)] : ITS[i].x;
    const traza = [...ITS.slice(0, i + 1).map(r => r.x), actual];
    const reg = fase === ITER && i < N - 1 && fr < 1 ? ITS[i] : ITS[Math.min(N - 1, fase === ITER ? i + 1 : i)];
    const barrera = fase === ITER && reg.tipo === 'barrera';
    const [ox, oy] = P(OPT.x);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
            <defs>
                <marker id="tc-gris" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={GRIS} />
                </marker>
                <marker id="tc-agua" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={AGUA} />
                </marker>
                <marker id="tc-valido" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={VALIDO} />
                </marker>
                <pattern id="tc-rayas" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="12" stroke={GRIS} strokeOpacity="0.35" strokeWidth="2" />
                </pattern>
                <clipPath id="tc-marco"><path d={camino(MARCO)} /></clipPath>
            </defs>
            {/* fuera de U_ad: rayado (marco menos polígono, regla par-impar) */}
            <path d={camino(MARCO) + ' ' + camino(TC2D.poligono)} fillRule="evenodd" fill="url(#tc-rayas)" opacity={suave(avance(0))} />
            <path d={camino(TC2D.poligono)} fill={AGUA} fillOpacity={0.09 * suave(avance(0))} />
            {/* curvas de nivel */}
            <g clipPath="url(#tc-marco)">
                {NIVELES.map((c, k) => {
                    const op = tramo(fN, k / NIVELES.length * 0.7, k / NIVELES.length * 0.7 + 0.3);
                    const opt = c === OPT.J, ver = opt && fase >= FIN;
                    return <ellipse key={c} cx={sx(TC2D.m[0])} cy={sy(TC2D.m[1])} rx={Math.sqrt(2 * c) * S} ry={Math.sqrt(2 * c / TC2D.K) * S}
                                    transform={`rotate(${-TC2D.th} ${sx(TC2D.m[0])} ${sy(TC2D.m[1])})`} fill="none"
                                    stroke={ver ? VALIDO : GRIS} strokeWidth={ver ? 2.6 : 1.3} strokeOpacity={ver ? 0.9 : 0.5 * op}
                                    strokeDasharray={ver ? undefined : '5 4'} />;
                })}
            </g>
            {/* lados del polígono */}
            {LADOS.map(({ a, b, tipo }, k) => {
                const [x1, y1] = P(TC2D.poligono[a]), [x2, y2] = P(TC2D.poligono[b]);
                const f = suave(tramo(avance(0), k / 5 * 0.6, k / 5 * 0.6 + 0.4));
                return <line key={k} x1={x1} y1={y1} x2={lerp(x1, x2, f)} y2={lerp(y1, y2, f)}
                             stroke={tipo === 'acoplada' ? RIEGO : AGUA} strokeWidth={tipo === 'acoplada' ? 3.4 : 2.4} strokeLinecap="round" />;
            })}
            <g style={{ fontFamily: 'var(--a3-sans)', fontSize: fs, ...halo }} opacity={suave(tramo(avance(0), 0.6, 1))}>
                <text x={sx(0.74)} y={sy(0.6)} transform={`rotate(45 ${sx(0.74)} ${sy(0.6)})`} textAnchor="middle" style={{ fill: RIEGO }}>{LADOS[2].et}</text>
                <text x={sx(0.17)} y={sy(0.8)} transform={`rotate(-31 ${sx(0.17)} ${sy(0.8)})`} textAnchor="middle" style={{ fill: RIEGO }}>{LADOS[3].et}</text>
                <text x={sx(0.5)} y={sy(-0.045)} textAnchor="middle" style={{ fill: AGUA }}>cotas 0 ≤ u₁, u₂ ≤ 1</text>
                <text x={sx(0.3)} y={sy(0.3)} textAnchor="middle" style={{ fill: AGUA, fontSize: fs + 8, fontStyle: 'italic' }}>U<tspan dy="7" fontSize={fs - 2}>ad</tspan></text>
                <text x={sx(0.86)} y={sy(0.98)} textAnchor="middle" style={{ fill: GRIS }}>no admisible</text>
            </g>
            {/* mínimo libre */}
            {fase >= 1 && (
                <g opacity={tramo(avance(1), 0.5, 1)} style={{ fontFamily: 'var(--a3-sans)', fontSize: fs - 1, fill: GRIS, ...halo }}>
                    <path d={`M${sx(TC2D.m[0]) - 8},${sy(TC2D.m[1]) - 8} l16,16 m0,-16 l-16,16`} stroke={GRIS} strokeWidth="2.6" />
                    <text x={sx(TC2D.m[0]) + 14} y={sy(TC2D.m[1]) - 4}>mínimo de Ĵ</text>
                    <text x={sx(TC2D.m[0]) + 14} y={sy(TC2D.m[1]) + 18}>(no admisible)</text>
                </g>
            )}
            {/* trayectoria real */}
            {fase >= 2 && (
                <g>
                    <path d={traza.map((q, k) => `${k ? 'L' : 'M'}${sx(q[0])},${sy(q[1])}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2.6" />
                    {ITS.slice(0, i + 1).filter(r => r.tipo !== 'barrera').map(r => <circle key={r.k} cx={sx(r.x[0])} cy={sy(r.x[1])} r="4.5" fill={AGUA} />)}
                    <circle cx={sx(TC2D.x0[0])} cy={sy(TC2D.x0[1])} r="9" fill="var(--sl-bg)" stroke={AGUA} strokeWidth="3" />
                    <text x={sx(TC2D.x0[0]) + 14} y={sy(TC2D.x0[1]) + 26} style={{ ...eje, fontSize: fs, fill: AGUA, ...halo }}>u₀</text>
                    {fase === 2 && <Flecha q={TC2D.x0} v={ITS[0].g.map(x => -x)} largo={110 * suave(avance(2))} />}
                    {fase === 2 && avance(2) > 0.6 && (
                        <text x={sx(TC2D.x0[0]) + 70} y={sy(TC2D.x0[1]) - 70} style={{ ...eje, fontSize: fs, ...halo }}>−∇Ĵ(u₀)</text>
                    )}
                    {fase === ITER && (
                        <g>
                            <Flecha q={actual} v={reg.g.map(x => -x)} largo={80} trazo="6 4" />
                            {i < N - 1 && sig.tipo === 'paso' && fr < 1 && (
                                <line x1={sx(ITS[i].x[0])} y1={sy(ITS[i].x[1])} x2={sx(sig.x[0])} y2={sy(sig.x[1])} stroke={AGUA}
                                      strokeWidth="2" strokeOpacity="0.5" markerEnd="url(#tc-agua)" />
                            )}
                            <circle cx={sx(actual[0])} cy={sy(actual[1])} r={barrera ? 16 : 8} fill={barrera ? 'none' : AGUA}
                                    stroke={barrera ? RIEGO : 'none'} strokeWidth="3" />
                            {barrera && (
                                <text x={sx(actual[0]) + 22} y={sy(actual[1]) + 34} style={{ ...eje, fontSize: fs, fill: RIEGO, ...halo }}>μ ← μ/5</text>
                            )}
                        </g>
                    )}
                </g>
            )}
            {/* óptimo y condición KKT */}
            {fase >= FIN && (
                <g opacity={suave(avance(FIN))} style={{ fontFamily: 'var(--a3-sans)', fontSize: fs, ...halo }}>
                    <Flecha q={OPT.x} v={OPT.g.map(x => -x)} largo={105} color={VALIDO} ancho={3} id="tc-valido" />
                    {/* ángulo recto entre el lado activo (e) y la normal exterior (n), en pantalla */}
                    <path d={`M${ox - 9},${oy - 9} l9,-9 l9,9`} fill="none" stroke={VALIDO} strokeWidth="1.6" opacity="0.8" />
                    <circle cx={ox} cy={oy} r="9" fill={VALIDO} />
                    <text x={ox - 16} y={oy + 30} textAnchor="end" style={{ fill: VALIDO, fontSize: fs + 2 }}>û</text>
                    <text x={ox + 80} y={oy - 62} style={{ fill: VALIDO }}>−∇Ĵ(û) = λ a</text>
                    <text x={ox + 80} y={oy - 38} style={{ fill: VALIDO }}>λ = {OPT.lambda_lin[0].toFixed(2)} ≥ 0</text>
                </g>
            )}
            <text x={W - 6} y={H - 4} textAnchor="end" style={{ ...eje, fontSize: pub ? 16 : 14 }}>
                ilustración 2D · iterados reales de trust-constr (SciPy {TC2D.scipy})
            </text>
        </svg>
    );
}

// Lectura de la iteración en curso: k, Ĵ, χ y μ del registro de scipy.
function Lectura({ fase, l }) {
    const t = fase > ITER ? N - 1 : fase < ITER ? 0 : Math.min(N - 1, l / 0.55);
    const r = ITS[Math.min(N - 1, fase === ITER ? Math.ceil(t) : Math.floor(t))];
    const filas = [['iteración', `${r.k} / ${N}`], [<InlineMath math="\hat J" />, r.J.toFixed(3)],
                   [<InlineMath math="\chi" />, sci(r.chi)], [<>barrera <InlineMath math="\mu" /></>, sci(r.mu)]];
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 18, rowGap: 2, margin: '10px 0 0',
                      fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', fontVariantNumeric: 'tabular-nums' }}>
            {filas.map(([a, b], k) => (
                <React.Fragment key={k}>
                    <span style={{ color: 'var(--sl-muted)' }}>{a}</span>
                    <span style={{ color: k === 2 && r.chi < 1e-4 ? VALIDO : 'var(--sl-text)', fontWeight: 600 }}>{b}</span>
                </React.Fragment>
            ))}
            {r.k >= PARO.k && (
                <span style={{ gridColumn: '1 / 3', color: VALIDO, fontSize: 'var(--a3-fs-nota)' }}>
                    χ &lt; 10⁻⁴ desde la iteración {PARO.k}: aquí se pararía
                </span>
            )}
        </div>
    );
}

const eqChi = String.raw`\chi(u_k)=\big\|\,u_k-P_{\mathcal U_{ad}}\big(u_k-\nabla\hat J(u_k)\big)\big\|_\infty`;
const eqKKT = String.raw`\begin{aligned}&\nabla\hat J(\hat u)=\textstyle\sum_i\lambda_i\nabla c_i(\hat u)\\ &\lambda_i\ge0,\quad c_i(\hat u)\ge0,\quad \lambda_i\,c_i(\hat u)=0\end{aligned}`;

export default function A3D16({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const avance = k => (fase > k ? 1 : fase < k ? 0 : l / FASES[k].dur);
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    return (
        <SlideLayout title="Del punto inicial al óptimo: iteraciones y KKT" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.75fr) minmax(0, 1fr)', gap: 28, alignItems: 'start' }}>
                <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase" style={{ cursor: 'pointer' }}>
                    <Figura fase={fase} P={avance} l={l} />
                </div>
                <div>
                    <div style={{ margin: '-6px 0 4px', '--a3-fs-ec-compacta': '21px' }}><Eq math={eqChi} id="criticidad" compacta /></div>
                    <p style={{ ...nota, margin: '0 0 12px' }}>
                        Paro: <InlineMath math="\chi<10^{-4}" /><span className="a3-completa"> (KKT); en las corridas, también tras ≥ 50
                        iteraciones con <InlineMath math="\chi\le3\cdot10^{-3}" /> (criterio práctico)</span>
                    </p>
                    <p style={{ margin: '0 0 6px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-accent)', fontWeight: 600 }}>
                        {fase + 1} · {FASES[fase].n}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.42 }}>
                        {pub ? FASES[fase].p : FASES[fase].d}
                    </p>
                    {fase >= 2 && <Lectura fase={fase} l={l} />}
                    {fase >= FIN && (
                        <div className="a3-ec--compacta" style={{ marginTop: 6, '--a3-fs-ec-compacta': '21px' }}>
                            <BlockMath math={eqKKT} />
                            <p style={{ ...nota, margin: '-4px 0 0' }}>
                                Condiciones KKT con <InlineMath math="c(u)\ge0" /> <Cita k="Nocedal2006" p="cap. 12" />
                                <span className="a3-completa">; aquí <InlineMath math="c_1=1.25-u_1-u_2" /> es la única activa:{' '}
                                <InlineMath math="\chi(\hat u)=0\iff" /> KKT</span>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, 1fr)`, gap: 12, marginTop: 'auto' }}>
                {FASES.map((x, k) => (
                    <button key={x.n} onClick={() => saltar(k)} title={`ir a: ${x.n}`}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 18 : 15, lineHeight: 1.2,
                                     whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                     color: k === fase ? 'var(--sl-accent)' : 'var(--sl-muted)', fontWeight: k === fase ? 600 : 400 }}>
                        <span style={{ display: 'block', height: 3, background: 'var(--a3-filete, #C9D3DB)', marginBottom: 5 }}>
                            <span style={{ display: 'block', height: 3, width: `${k < fase ? 100 : k > fase ? 0 : 100 * l / x.dur}%`, background: 'var(--sl-accent)' }} />
                        </span>
                        {k + 1} {x.n}
                    </button>
                ))}
            </div>
            <Notas titulo="Del punto inicial al óptimo: cómo leer la lámina">
                <h4>Qué es la figura</h4>
                <p>Un problema de dos variables con la misma estructura que el nuestro: <InlineMath math="\hat J" /> cuadrático (curvas
                    de nivel elípticas), cotas de caja (como <InlineMath math="0\le Q_n\le\overline Q_n" />) y dos restricciones lineales
                    acopladas (como el tanque, cuyas 144 filas mezclan todos los caudales anteriores). Los puntos son los iterados que
                    devolvió <code>trust-constr</code> de SciPy {TC2D.scipy} con las mismas opciones que la serie 33 (barrera inicial 0.1,
                    radio 1, iterados admisibles, BFGS); χ se calculó con el mismo proyector certificado de las corridas. No es la corrida
                    del acuífero: allí hay 73 variables y 430 desigualdades, y no se pueden dibujar.</p>
                <h4>El algoritmo, paso a paso</h4>
                <ol>
                    <li><b>Holguras y barrera.</b> Cada desigualdad <InlineMath math="c_i(u)\ge0" /> se escribe <InlineMath math="c_i(u)=s_i" />,{' '}
                        <InlineMath math="s_i>0" />, y se minimiza <InlineMath math="\hat J(u)-\mu\sum_i\log s_i" />. El logaritmo crece sin
                        cota cuando <InlineMath math="s_i\to0" />: empuja hacia adentro.</li>
                    <li><b>Subproblema con igualdades.</b> Para μ fijo se resuelve con región de confianza SQP (Byrd–Omojokun): un paso
                        normal que reduce la violación y uno tangencial que baja el modelo cuadrático{' '}
                        <InlineMath math="m(p)=\nabla\hat J^\top p+\tfrac12p^\top Bp" /> por gradiente conjugado proyectado, con{' '}
                        <InlineMath math="\|p\|\le\Delta" /> y <InlineMath math="B" /> la Hessiana BFGS armada con diferencias de gradientes.</li>
                    <li><b>Aceptar o rechazar.</b> <InlineMath math="\rho=" /> reducción real / reducción predicha de la función de mérito:
                        si ρ es grande se acepta y Δ crece; si es casi nula se rechaza y Δ se reduce. Con iterados admisibles, todo paso que
                        sale de <InlineMath math="\mathcal U_{ad}" /> se rechaza.</li>
                    <li><b>Bajar la barrera.</b> Resuelto el subproblema, <InlineMath math="\mu\leftarrow\mu/5" />: los iterados siguen el
                        «camino central» hacia el borde. En la figura: 11 pasos y 9 reducciones de μ (0.1 → 2.6·10⁻⁷).</li>
                    <li><b>Parar.</b> Cuando <InlineMath math="\chi<10^{-4}" /> con el iterado admisible: aquí en la iteración {PARO.k} (χ = {sci(PARO.chi)}).</li>
                </ol>
                <h4>Condiciones KKT</h4>
                <p>Con restricciones <InlineMath math="c_i(u)\ge0" />, un mínimo local <InlineMath math="\hat u" /> cumple (las
                    restricciones son lineales, así que no hace falta otra hipótesis de calificación):</p>
                <BlockMath math={eqKKT} />
                <p>Cada <InlineMath math="\lambda_i" /> es un multiplicador de Lagrange: cuánto bajaría <InlineMath math="\hat J" /> por unidad
                    de holgura añadida a la restricción <InlineMath math="i" />. La complementariedad <InlineMath math="\lambda_ic_i=0" /> dice que
                    solo las restricciones activas (<InlineMath math="c_i=0" />) tienen multiplicador. En la figura la activa es{' '}
                    <InlineMath math="u_1+u_2\le1.25" />, con <InlineMath math="a=(1,1)" />: <InlineMath math={`-\\nabla\\hat J(\\hat u)=(${(-OPT.g[0]).toFixed(3)},\\,${(-OPT.g[1]).toFixed(3)})=\\lambda a`} />{' '}
                    con <InlineMath math={`\\lambda=${OPT.lambda_lin[0].toFixed(4)}`} /> (el multiplicador que devuelve scipy). Geométricamente,
                    la curva de nivel es tangente al lado activo.</p>
                <h4>¿Por qué no se resuelve KKT directamente?</h4>
                <p>KKT sí describe el óptimo; lo difícil es resolverlo tal cual. Es un sistema no suave por la complementariedad: hay que
                    adivinar qué desigualdades están activas, y en el acuífero son 430 (cotas, tanque y ciclo de la bomba). Cada
                    evaluación de <InlineMath math="\nabla\hat J" /> cuesta una simulación directa y una adjunta, y no hay Hessiana exacta. El
                    punto interior resuelve un KKT perturbado, <InlineMath math="\lambda_is_i=\mu" /> en lugar de{' '}
                    <InlineMath math="\lambda_is_i=0" />, que es suave, y lleva <InlineMath math="\mu\to0" />: no adivina el conjunto activo,
                    lo descubre.</p>
                <h4>Por qué medir con χ y no con el criterio de scipy</h4>
                <p>El <code>gtol</code> de trust-constr estima los multiplicadores por mínimos cuadrados sin exigir <InlineMath math="\lambda\ge0" />.
                    Con más filas de restricción que variables (430 frente a 73) ese residuo puede anularse lejos del óptimo. Ocurrió en una
                    corrida anterior (malla con conos, antes de refinar el eje del pozo): MRMT bloque se detuvo en{' '}
                    <InlineMath math="z_p=-469" /> m, y sobre el segmento admisible hasta el punto de MRMT semi (<InlineMath math="z_p=-419" /> m)
                    su <InlineMath math="\hat J" /> todavía bajaba de 0.4735 a 0.4616. La medida χ no usa multiplicadores:{' '}
                    <InlineMath math="\chi(\hat u)=0" /> si y solo si <InlineMath math="\hat u" /> cumple KKT (conjunto poliédrico), y se
                    calcula con un problema cuadrático pequeño, sin simulaciones (lámina anterior) <Cita k="conn2000trust" />.</p>
                <h4>Criterio de paro en las corridas</h4>
                <p><InlineMath math="\chi<10^{-4}" /> con el iterado admisible, o, para no gastar semanas en la cola lenta de la
                    convergencia, tras al menos 50 iteraciones con <InlineMath math="\chi\le3\cdot10^{-3}" />. En la validación sin
                    nitrato (óptimo exacto conocido), <InlineMath math="\chi\approx2.8\cdot10^{-3}" /> correspondía a <InlineMath math="\hat J" /> a
                    0.8 % del exacto y a la profundidad exacta. Lo que se reporte con ese criterio se marca «sin KKT».</p>
            </Notas>
        </SlideLayout>
    );
}

A3D16.ecuaciones = ['criticidad'];

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 15, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 5, strokeLinejoin: 'round' };
const nota = { margin: '6px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
