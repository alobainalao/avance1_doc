import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from '../slides-avance3/ui.jsx';
import { useFases, reducida, suave } from '../slides-avance3/anim.js';
import { usePublica, Notas } from '../slides-avance3/version.jsx';

// Versión simplificada (copia de slides-avance3/A3D13.jsx, resumida a cuatro fases: proyectar, solo cotas, con el tanque y
// barrera; las de «cerca del borde» y «el algoritmo» pasan a la lámina siguiente). Mensaje: el número de restricciones y la
// necesidad de no salir de U_ad motivan la región de confianza con barrera (Byrd, Hribar y Nocedal, 1999: el método
// tr_interior_point de trust-constr). Tiempo de la proyección medido el 26-nov-2026 sobre la serie 33 (SLSQP, 73
// variables): 0.01–12 s, media 2.1 s por iteración.
// Por qué la optimización usa región de confianza con puntos interiores (tesis, Cap. III §algoritmo de optimización;
// Nocedal y Wright 2006, caps. 4 y 19): la proyección sobre U_ad no es explícita cuando el tanque acopla los pasos.
// Restricciones de codigo/fenicsx/adjoint.py:optimize_fenicsx (Bounds y dos LinearConstraint de
// funtions/water_supply.py: supply_constraint y pump_duty_constraint). La proyección se escribe P(ũ) con ũ el punto de
// prueba y u la incógnita (antes 𝐯 y 𝐰, que se confundían con W₊ y V_s). Mecanismos de SciPy 1.17.1 que mantienen los
// iterados dentro (scipy/optimize/_trustregion_constr): fracción a la frontera τ = 0.995 en tr_interior_point.py:301 y
// 329–330; holgura = c(x) con keep_feasible y barrera +∞ si se viola, tr_interior_point.py:106–109; paso rechazado si la
// razón de reducción < 1e-8, equality_constrained_sqp.py:52, 168, 211 y 229; μ ← 0.2 μ, tr_interior_point.py:304 y 351.
const M = (t) => <InlineMath math={t} />;
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';

const eqProy = String.raw`P_{\mathcal U_{ad}}(\tilde u)=\arg\min_{u\in\mathcal U_{ad}}\ \tfrac12\,\|u-\tilde u\|^2,\qquad
\tilde u=u_k-\rho_k\nabla\hat J(u_k)`;
const eqCaja = String.raw`\begin{aligned}P(\tilde u)_n&=\underbrace{\min\{\overline Q_n,\ \overbrace{\max\{0,\ \tilde Q_n\}}^{\text{lo negativo sube a }0}\}}_{\text{lo que pasa de }\overline Q_n\text{ baja a }\overline Q_n},\qquad n=1,\dots,72\\[2pt]
P(\tilde u)_{73}&=\min\{z_{\max},\ \max\{z_{\min},\ \tilde z_p\}\}\end{aligned}`;
// gris de las etiquetas dentro de KaTeX (no acepta variables CSS): el de --a3-estrato en cada tema
const eqTanque = g => String.raw`\begin{aligned}P_{\mathcal U_{ad}}(\tilde u)=\arg\min_{u}\ &\tfrac12\|u-\tilde u\|^2\\
\text{s.a.}\ \ &0\le Q_n\le\overline Q_n,\ \ z_{\min}\le z_p\le z_{\max}&&\textcolor{${g}}{\text{cotas: }146}\\
&0\le S_n(u)\le S_{\max},\ \ n=1,\dots,72&&\textcolor{${g}}{\text{tanque: }144}\\
&\textstyle\sum_{k=n}^{n+N_w-1}Q_k\le f_d\,Q_{\max}N_w&&\textcolor{${g}}{\text{ciclo: }70}\end{aligned}`;
const eqBarrera = String.raw`\min_{u,\ \mathbf s>0}\ \hat J(u)-\mu\sum_i\log s_i\quad\text{s.a.}\quad \mathbf c(u)-\mathbf s=0`;

const FASES = [
    { n: 'Proyectar', dur: 2.0, eq: () => eqProy,
      p: <>Un paso de descenso da el punto de prueba {M('\\tilde u')}, que puede salir de {M('\\mathcal U_{ad}')}. Proyectar es
          devolverlo al punto admisible más cercano.</>,
      d: <>{M('u=(Q_1,\\dots,Q_{72},z_p)\\in\\mathbb R^{73}')} es el control. El paso de descenso da el punto de
          prueba {M('\\tilde u')}, que puede violar las restricciones (en la figura, un caudal negativo). La proyección elige, entre
          todos los {M('u\\in\\mathcal U_{ad}')}, el más cercano a {M('\\tilde u')}: {M('\\tilde u')} es el dato y {M('u')} la
          incógnita. Los dos son vectores de {M('\\mathbb R^{73}')}, no espacios de funciones. El gradiente proyectado avanza
          con {M('u_{k+1}=P_{\\mathcal U_{ad}}(\\tilde u)')}.</> },
    { n: 'Solo cotas', dur: 1.6, eq: () => eqCaja,
      p: <>Con solo cotas, cada componente se recorta por separado: {M('\\max')} sube a 0 lo negativo y {M('\\min')} baja
          a {M('\\overline Q_n')} lo que lo pasa.</>,
      d: <>{M('\\max\\{0,\\tilde Q_n\\}')} sube a 0 un caudal negativo; {M('\\min\\{\\overline Q_n,\\cdot\\}')} baja a{' '}
          {M('\\overline Q_n')} uno que supera la disponibilidad de la bomba; si {M('0\\le\\tilde Q_n\\le\\overline Q_n')}, no
          cambia. Igual con {M('z_p')} en {M('[z_{\\min},z_{\\max}]')}. Como {M('\\tfrac12\\|u-\\tilde u\\|^2')} es una suma de
          términos de una sola componente y cada cota toca una sola, el problema se separa en 73 problemas de una variable:
          recortar es la proyección exacta y cuesta 73 comparaciones.</> },
    { n: 'Con el tanque', dur: 2.4, eq: g => eqTanque(g),
      p: <>El nivel {M('S_n')} suma todos los caudales anteriores: recortar un {M('Q_n')} puede vaciar el tanque después.
          Proyectar es un problema cuadrático con 360 desigualdades (144 del tanque) en cada paso.</>,
      d: <>{M('S_n(u)=S_0+V_s\\Delta t\\sum_{k\\le n}Q_k-\\sum_{k\\le n}d_k')}. {M('S_n\\ge0')}: el tanque no se vacía y la
          demanda queda cubierta; {M('S_n\\le S_{\\max}')}: no se desborda; ciclo: en cada ventana de {M('N_w=3')} pasos la bomba
          trabaja a lo más la fracción {M('f_d')}. Cada {M('S_n')} contiene {M('Q_1,\\dots,Q_n')}: en la figura, recortar deja el
          tanque vacío y la proyección verdadera mueve los dos caudales. Sigue siendo convexo, con solución única, pero se
          resuelve de forma iterativa, y el gradiente proyectado lo necesitaría en cada iteración.</> },
    { n: 'Barrera', dur: 2.4, eq: () => null,
      p: <>{M('s_i=c_i(u)')} es el margen hasta el borde {M('i')}. {M('-\\mu\\log s_i')} crece sin cota cuando el margen se
          anula: el iterado no cruza el borde. El mínimo con barrera (◇) queda a {M('\\mu/\\lambda')} del borde; al
          bajar {M('\\mu')}, llega a él.</>,
      d: <>Cada desigualdad {M('c_i(u)\\ge0')} de {M('\\mathcal U_{ad}')} (cotas, tanque y ciclo) se escribe{' '}
          {M('c_i(u)=s_i')} con una holgura {M('s_i>0')}: el margen hasta el borde, en las unidades de esa restricción (por
          ejemplo, el volumen que aún cabe en el tanque). {M('\\mu>0')} no es un margen: es el peso de la barrera. Se usa{' '}
          {M('-\\log')} porque tiende a {M('+\\infty')} cuando {M('s_i\\to0^+')}, es suave y convexa, y la optimalidad de cada
          subproblema da las KKT perturbadas {M('\\lambda_is_i=\\mu')}: en la figura, el mínimo con barrera queda a distancia{' '}
          {M('\\mu/\\lambda')} del borde, y con {M('\\mu\\leftarrow\\mu/5')} llega a él.</> },
];
const BARRERA = 3;       // primera fase con la ecuación de la barrera y la tira del algoritmo

const pasos = [
    ['Barrera', <><InlineMath math="-\mu\log s_i" /> mantiene positivas las 360 holguras: el iterado no sale de{' '}
        <InlineMath math="\mathcal U_{ad}" /><span className="a3-completa">, y <InlineMath math="\mu\to0" /> lleva al óptimo</span></>],
    ['Región de confianza', <>cada paso minimiza un modelo cuadrático de <InlineMath math="\hat J" /> (gradiente adjunto y BFGS) en{' '}
        <InlineMath math="\|\mathbf p\|\le\Delta" /><span className="a3-completa">; sin proyectar</span></>],
    ['Proyección', <>solo para medir la criticidad <InlineMath math="\chi" />: un cuadrático pequeño, sin simulaciones<span className="a3-completa">
        {' '}(≈ 2 s por iteración frente a ≈ 10 min de una resolución de EDP)</span></>],
];

// Esquema con dos pasos de tiempo, caudales normalizados q_n = Q_n/Q̄_n: caja de cotas y, desde «Con el tanque», el
// tanque como dos cortes acoplados 0.7 ≤ q₁ + q₂ ≤ 1.6 (S₂ ≥ 0 y S₂ ≤ S_max). Desde u_k = (0.5, 0.5) el paso de descenso
// da ũ = (−0.25, 0.35): recortar da (0, 0.35), con q₁ + q₂ = 0.35 < 0.7 (tanque vacío); la proyección exacta es el pie de
// la perpendicular al corte, (0.05, 0.65): ũ − P = −0.3·(1, 1), multiplicador 0.3 ≥ 0 y la única restricción activa.
const UK = [0.5, 0.5], UT = [-0.25, 0.35], RECORTE = [0, 0.35], PROY = [0.05, 0.65];
const ADMISIBLE = [[0.7, 0], [1, 0], [1, 0.6], [0.6, 1], [0, 1], [0, 0.7]];

function Proyeccion({ fase, l, pub }) {
    const W = 560, H = 410, x0 = 120, y0 = 350, a = 280;
    const X = q => x0 + q * a, Y = q => y0 - q * a;
    const ej = { fontFamily: 'var(--a3-sans)', fontSize: pub ? 20 : 17, fill: 'var(--sl-muted)' };
    const tanque = fase >= 2, ft = fase === 2 ? suave(Math.min(1, l / 1.2)) : 1;
    const f0 = fase === 0 ? suave(Math.min(1, l / 1.4)) : 1;
    const flecha = (p, q, t, color, id) => (
        <line x1={X(p[0])} y1={Y(p[1])} x2={X(p[0] + t * (q[0] - p[0]))} y2={Y(p[1] + t * (q[1] - p[1]))}
              stroke={color} strokeWidth="2.6" markerEnd={t > 0.2 ? `url(#${id})` : undefined} />
    );
    const pie = PROY, n = [-1 / Math.SQRT2, -1 / Math.SQRT2], d = [1 / Math.SQRT2, -1 / Math.SQRT2], r = 0.035;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: pub ? 420 : 400 }}>
            <defs>
                {[['pf-g', GRIS], ['pf-v', VALIDO], ['pf-p', PLUMA]].map(([id, c]) => (
                    <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill={c} />
                    </marker>
                ))}
                <pattern id="pf-raya" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke={PLUMA} strokeWidth="1.4" strokeOpacity="0.45" />
                </pattern>
            </defs>
            {/* ejes */}
            <line x1={X(-0.36)} x2={X(1.12)} y1={Y(0)} y2={Y(0)} stroke={GRIS} strokeWidth="1.2" />
            <line x1={X(0)} x2={X(0)} y1={Y(-0.06)} y2={Y(1.12)} stroke={GRIS} strokeWidth="1.2" />
            <text x={X(1.14)} y={Y(0) + 6} style={ej}>Q₁ / Q̄₁</text>
            <text x={X(0) - 8} y={Y(1.12) + 4} textAnchor="end" style={ej}>Q₂ / Q̄₂</text>
            <text x={X(0) - 6} y={Y(0) + 22} textAnchor="end" style={ej}>0</text>
            <text x={X(1)} y={Y(0) + 22} textAnchor="middle" style={ej}>1</text>
            <text x={X(0) - 8} y={Y(1) + 6} textAnchor="end" style={ej}>1</text>
            {/* caja de cotas; con el tanque, los dos cortes acoplados */}
            <rect x={X(0)} y={Y(1)} width={a} height={a} fill={AGUA} fillOpacity={tanque ? 0.03 : 0.1} stroke="var(--sl-text)" strokeWidth="1.6" />
            {tanque && (
                <g opacity={ft}>
                    <polygon points={ADMISIBLE.map(([u, v]) => `${X(u)},${Y(v)}`).join(' ')} fill={AGUA} fillOpacity="0.12" />
                    <polygon points={`${X(0)},${Y(0)} ${X(0.7)},${Y(0)} ${X(0)},${Y(0.7)}`} fill="url(#pf-raya)" />
                    <polygon points={`${X(1)},${Y(0.6)} ${X(1)},${Y(1)} ${X(0.6)},${Y(1)}`} fill="url(#pf-raya)" />
                    <line x1={X(-0.05)} y1={Y(0.75)} x2={X(0.75)} y2={Y(-0.05)} stroke={PLUMA} strokeWidth="2" strokeDasharray="6 4" />
                    <line x1={X(0.55)} y1={Y(1.05)} x2={X(1.05)} y2={Y(0.55)} stroke={PLUMA} strokeWidth="2" strokeDasharray="6 4" />
                    <text x={X(0.06)} y={Y(0.08)} style={{ ...ej, fill: PLUMA }}>S₂ &lt; 0: tanque vacío</text>
                    <text x={X(0.9)} y={Y(0.93)} textAnchor="middle" style={{ ...ej, fill: PLUMA }}>S₂ &gt; Sₘₐₓ</text>
                </g>
            )}
            <text x={X(0.42)} y={Y(0.86)} textAnchor="middle" style={{ ...ej, fill: 'var(--sl-text)' }}>
                {tanque ? <>𝒰<tspan baselineShift="sub" fontSize="0.75em">ad</tspan></> : 'cotas'}
            </text>
            {/* paso de descenso: u_k → ũ */}
            <circle cx={X(UK[0])} cy={Y(UK[1])} r="6" fill="var(--sl-text)" />
            <text x={X(UK[0]) + 10} y={Y(UK[1]) - 8} style={{ ...ej, fill: 'var(--sl-text)' }}>uₖ</text>
            {flecha(UK, UT, f0, GRIS, 'pf-g')}
            {f0 > 0.6 && <text x={X(0.34)} y={Y(0.47) - 6} textAnchor="middle" style={ej}>−ρ∇Ĵ</text>}
            {f0 > 0.95 && (
                <g>
                    <circle cx={X(UT[0])} cy={Y(UT[1])} r="6" fill={PLUMA} />
                    <text x={X(UT[0]) - 4} y={Y(UT[1]) + 26} textAnchor="middle" style={{ ...ej, fill: PLUMA }}>ũ</text>
                </g>
            )}
            {/* recortar: proyección sobre la caja */}
            {f0 > 0.95 && (
                <g>
                    {flecha(UT, RECORTE, fase === 0 ? Math.min(1, Math.max(0, (l - 1.4) / 0.5)) : 1, tanque ? PLUMA : VALIDO, tanque ? 'pf-p' : 'pf-v')}
                    <circle cx={X(RECORTE[0])} cy={Y(RECORTE[1])} r="6" fill={tanque ? 'none' : VALIDO} stroke={tanque ? PLUMA : VALIDO} strokeWidth="2.4" />
                    <text x={X(RECORTE[0]) + 12} y={Y(RECORTE[1]) + 6} style={{ ...ej, fill: tanque ? PLUMA : VALIDO }}>
                        {tanque ? '✗ recortar' : fase === 1 ? 'recortar: Q₁ → 0, Q₂ igual' : 'P(ũ)'}
                    </text>
                </g>
            )}
            {/* con el tanque: la proyección exacta, perpendicular al corte activo */}
            {tanque && (
                <g opacity={ft}>
                    {flecha(UT, PROY, ft, VALIDO, 'pf-v')}
                    <polyline points={[[pie[0] + r * n[0], pie[1] + r * n[1]], [pie[0] + r * (n[0] + d[0]), pie[1] + r * (n[1] + d[1])],
                                       [pie[0] + r * d[0], pie[1] + r * d[1]]].map(([u, v]) => `${X(u)},${Y(v)}`).join(' ')}
                              fill="none" stroke={VALIDO} strokeWidth="1.4" />
                    <circle cx={X(PROY[0])} cy={Y(PROY[1])} r="6.5" fill={VALIDO} />
                    <text x={X(PROY[0]) - 4} y={Y(PROY[1]) - 16} style={{ ...ej, fill: VALIDO }}>✓ P(ũ): mueve Q₁ y Q₂</text>
                </g>
            )}
            <text x={W - 6} y={H - 6} textAnchor="end" style={{ ...ej, fontSize: pub ? 17 : 15 }}>esquema con dos pasos de tiempo</text>
        </svg>
    );
}

// Barrera en una dimensión: minimizar Ĵ(s) = λ·s con s ≥ 0 (óptimo en el borde, multiplicador λ). Con barrera,
// λs − μ log s tiene su mínimo (◇) en s = μ/λ: es la KKT perturbada λs = μ. Con λ = 1 y μ = 0.1 → 0.02 (μ ← μ/5) el ◇ pasa
// de 0.1 a 0.02 y, con μ → 0, llega al borde. Lejos del borde la barrera casi no cambia Ĵ; en el borde tiende a +∞.
const MUS = [0.1, 0.02];
function Barrera({ fase, l, pub }) {
    const W = 560, H = 410, L = 100, B = 64, S1 = 0.5, B1 = 0.8;
    const sx = s => L + s / S1 * (W - L - 24), sy = b => 20 + (B1 - Math.min(b, B1)) / B1 * (H - B - 20);
    const ej = { fontFamily: 'var(--a3-sans)', fontSize: pub ? 20 : 17, fill: 'var(--sl-muted)' };
    const ss = Array.from({ length: 160 }, (_, i) => 10 ** (-7 + i * Math.log10(S1 / 1e-7) / 159));
    const t = fase === BARRERA ? Math.min(1, l / 1.8) : 1;
    const borde = fase >= BARRERA + 1;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: pub ? 420 : 400 }}>
            <defs>
                <pattern id="bf-raya" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke={PLUMA} strokeWidth="1.4" strokeOpacity="0.5" />
                </pattern>
            </defs>
            {borde && (
                <g>
                    <rect x={L - 44} y={20} width={44} height={sy(0) - 20} fill="url(#bf-raya)" />
                    <text x={L - 16} y={sy(0) - 6} transform={`rotate(-90 ${L - 16} ${sy(0) - 6})`}
                          style={{ ...ej, fill: PLUMA }}>cᵢ(u) &lt; 0: paso rechazado</text>
                </g>
            )}
            <line x1={L} x2={W - 20} y1={sy(0)} y2={sy(0)} stroke={GRIS} />
            <line x1={L} x2={L} y1={16} y2={sy(0)} stroke="var(--sl-text)" strokeWidth="2" />
            <text x={L + 8} y={34} style={{ ...ej, fill: 'var(--sl-text)' }}>borde: sᵢ = 0</text>
            {/* Ĵ sola: baja hasta el borde */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(S1)} y2={sy(S1)} stroke={GRIS} strokeWidth="2" strokeDasharray="6 4" />
            <text x={sx(0.5)} y={sy(0.5) + 56} textAnchor="end" style={ej}>Ĵ = λ·sᵢ</text>
            <circle cx={sx(0)} cy={sy(0)} r="6.5" fill={VALIDO} />
            {MUS.map((mu, k) => {
                const vis = Math.max(0, Math.min(1, t * 2 - k));
                if (vis <= 0) return null;
                const pts = ss.map(s => `${sx(s)},${sy(s - mu * Math.log(s))}`).join(' ');
                const m = mu, bm = m - mu * Math.log(m);
                return (
                    <g key={mu} opacity={vis}>
                        <polyline points={pts} fill="none" stroke={AGUA} strokeOpacity={1 - 0.35 * k} strokeWidth={2.8 - 0.6 * k} />
                        <path d={`M${sx(m)},${sy(bm) - 8} l7,8 l-7,8 l-7,-8 z`} fill={AGUA} />
                        <text x={k ? sx(0.06) : sx(0.12)} y={k ? sy(0.025) : sy(0.47)} style={{ ...ej, fill: AGUA }}>μ = {mu}: ◇ en sᵢ = {mu}</text>
                    </g>
                );
            })}
            {t > 0.9 && <text x={W - 24} y={sy(0.76)} textAnchor="end" style={{ ...ej, fill: 'var(--sl-text)' }}>Ĵ − μ log sᵢ, μ ← μ/5</text>}
            <text x={W - 24} y={sy(0.76) + 24} textAnchor="end" style={{ ...ej, fill: VALIDO }}>● óptimo, en el borde</text>
            {[0, 0.25, 0.5].map(s => <text key={s} x={sx(s)} y={sy(0) + 22} textAnchor="middle" style={ej}>{s}</text>)}
            <text x={(L + W) / 2} y={H - 18} textAnchor="middle" style={ej}>sᵢ = cᵢ(u): margen hasta el borde i (esquema, λ = 1)</text>
        </svg>
    );
}

export default function A3R11({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    const gris = theme === 'dark' ? '#95A7B6' : '#6E7F8D';
    const F = FASES[fase];
    const eq = F.eq(gris);
    const tira = fase >= BARRERA;
    return (
        <SlideLayout title="Restricciones: por qué no proyectar" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.12fr) minmax(0, 0.88fr)', gap: 30, alignItems: 'start' }}>
                <div>
                    <p style={{ margin: '0 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-accent)', fontWeight: 600 }}>
                        {fase + 1} · {F.n}
                    </p>
                    <div style={{ '--a3-fs-ec-compacta': pub ? (fase === 2 ? '20px' : '24px') : '22px', minHeight: fase < BARRERA && !pub ? 150 : 0 }}>
                        {eq ? <Eq math={eq} compacta /> : <Eq math={eqBarrera} id="barrera" compacta />}
                    </div>
                    {fase >= BARRERA && (
                        <p style={{ ...eti, margin: '-6px 0 8px', textAlign: 'center' }}>
                            <InlineMath math="\mathbf c(u)\ge0" />: todas las desigualdades de <InlineMath math="\mathcal U_{ad}" />
                            <span className="a3-completa"> (cotas, tanque y ciclo)</span>; <InlineMath math="s_i" />: holgura
                        </p>
                    )}
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.42 }}>{pub ? F.p : F.d}</p>
                </div>
                <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase" style={{ cursor: 'pointer' }}>
                    {fase < BARRERA ? <Proyeccion fase={fase} l={l} pub={pub} /> : <Barrera fase={fase} l={l} pub={pub} />}
                </div>
            </div>

            <div style={{ marginTop: 10, opacity: tira ? 1 : 0.32, transition: 'opacity 0.5s' }}>
                <p style={{ margin: '0 0 6px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                    Por eso: región de confianza con barrera <Cita k="byrd1999interior" />, sin proyectar
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {pasos.map(([t, d], i) => {
                        const activo = fase >= BARRERA;   // con cuatro fases la tira entera entra con la barrera
                        return (
                            <div key={t} style={{ borderTop: `2px solid ${activo ? 'var(--a3-agua)' : 'var(--a3-filete)'}`, paddingTop: 6, opacity: !tira || activo ? 1 : 0.45 }}>
                                <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', fontWeight: 600 }}>{i + 1}. {t}</p>
                                <p style={{ margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>{d}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, 1fr)`, gap: 12, marginTop: 'auto', paddingTop: 10 }}>
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
            <Notas titulo="Proyección, restricciones acopladas y barrera">
                <h4>1. Qué es proyectar y qué son ũ y u</h4>
                <p><InlineMath math="P_{\mathcal U_{ad}}(\tilde u)=\arg\min_{u\in\mathcal U_{ad}}\tfrac12\|u-\tilde u\|^2" />: el punto
                    admisible más cercano a <InlineMath math="\tilde u" />. Los dos son vectores de <InlineMath math="\mathbb R^{73}" />{' '}
                    (72 caudales y la profundidad): <InlineMath math="\tilde u" /> es el dato, por ejemplo el paso de descenso{' '}
                    <InlineMath math="u_k-\rho_k\nabla\hat J(u_k)" />, que puede estar fuera de <InlineMath math="\mathcal U_{ad}" />;{' '}
                    <InlineMath math="u" /> es la incógnita del problema de proyección. No son espacios funcionales: en el problema ya
                    discretizado el control es un vector. (Antes se escribían <InlineMath math="\mathbf v" /> y <InlineMath math="\mathbf w" />;
                    se cambiaron porque se confundían con la fuente <InlineMath math="W_+" />, el factor <InlineMath math="V_s" /> del tanque y el
                    núcleo <InlineMath math="w" /> de la tesis.) El gradiente proyectado avanza con{' '}
                    <InlineMath math="u_{k+1}=P_{\mathcal U_{ad}}(u_k-\rho_k\nabla\hat J(u_k))" /> <Cita k="manzoni2021optimal" p="§ 6.4" />.
                    Sirve si proyectar es barato y exacto.</p>
                <h4>2. Solo cotas: proyectar es recortar</h4>
                <p>Si <InlineMath math="\mathcal U_{ad}" /> es una caja, <InlineMath math="\tfrac12\sum_n(Q_n-\tilde Q_n)^2+\tfrac12(z_p-\tilde z_p)^2" /> con{' '}
                    <InlineMath math="0\le Q_n\le\overline Q_n" />, <InlineMath math="z_{\min}\le z_p\le z_{\max}" /> se separa en 73 problemas de una
                    variable. En cada uno, la parábola <InlineMath math="\tfrac12(Q-\tilde Q_n)^2" /> tiene su mínimo en{' '}
                    <InlineMath math="\tilde Q_n" />; si cae fuera de <InlineMath math="[0,\overline Q_n]" />, el mínimo restringido está en el
                    extremo más cercano. Eso es <InlineMath math="\min\{\overline Q_n,\max\{0,\tilde Q_n\}\}" />: el <InlineMath math="\max" /> resuelve
                    la cota inferior y el <InlineMath math="\min" /> la superior. Cuesta 73 comparaciones. <InlineMath math="\overline Q_n=Q_{\max}a(\tau_n)" />{' '}
                    es la disponibilidad horaria de la bomba (lámina del conjunto admisible).</p>
                <h4>3. Con el tanque: un problema cuadrático</h4>
                <BlockMath math={String.raw`\min_{u\in\mathbb R^{73}}\tfrac12\|u-\tilde u\|^2\ \ \text{s.a.}\ \ \begin{cases}0\le Q_n\le\overline Q_n,\ z_{\min}\le z_p\le z_{\max} & 146\\ 0\le S_n(u)\le S_{\max},\ n=1,\dots,72 & 144\\ \textstyle\sum_{k=n}^{n+N_w-1}Q_k\le f_dQ_{\max}N_w,\ n=1,\dots,70 & 70\end{cases}`} />
                <p>Es estrictamente convexo con restricciones lineales: tiene solución única, pero sin fórmula cerrada; se resuelve
                    iterativamente (conjunto activo / SQP). Cuentas: 73 variables con dos cotas cada una (146); dos desigualdades por paso
                    del tanque (144); una por ventana del ciclo (70 ventanas de <InlineMath math="N_w=3" /> pasos: 72 − 3 + 1). El código
                    pasa el ciclo con la cota inferior <InlineMath math="0" />, redundante con <InlineMath math="Q_n\ge0" />, y trust-constr
                    la cuenta: por eso ve 146 + 144 + 140 = 430 desigualdades.</p>
                <h4>4. Qué impone cada restricción y de dónde salen las 144</h4>
                <p>El balance del tanque por paso es <InlineMath math="S_n=S_{n-1}+V_s\Delta t\,Q_n-d_n" />, es decir</p>
                <BlockMath math={String.raw`S_n(u)=S_0+V_s\Delta t\sum_{k\le n}Q_k-\sum_{k\le n}d_k,\qquad \mathbf S=S_0\mathbf 1+V_s\Delta t\,L\mathbf Q-L\mathbf d`} />
                <p>con <InlineMath math="L" /> triangular inferior de unos (<code>supply_constraint</code>). Cada uno de los 72 pasos da dos
                    desigualdades: <InlineMath math="S_n\ge0" /> (el tanque no se vacía: lo bombeado más lo almacenado cubre la demanda) y{' '}
                    <InlineMath math="S_n\le S_{\max}" /> (no se desborda). El ciclo (<code>pump_duty_constraint</code>) limita lo bombeado en
                    cada ventana de 24 h a la fracción <InlineMath math="f_d=T_{\rm on}/(T_{\rm on}+T_{\rm off})=20/24" /> del máximo. Las cotas
                    de <InlineMath math="z_p" /> mantienen el pozo dentro del acuífero.</p>
                <h4>5. Por qué están acopladas</h4>
                <p>La fila <InlineMath math="n" /> del tanque contiene <InlineMath math="Q_1,\dots,Q_n" />: cambiar un caudal{' '}
                    <InlineMath math="Q_k" /> mueve el nivel en todos los pasos siguientes, y cada ventana del ciclo mezcla tres caudales.
                    Recortar una componente puede violar una restricción treinta pasos después, así que la proyección tiene que mover
                    varios caudales a la vez; ya no se separa por componentes. En el esquema de la lámina (dos pasos, caudales normalizados):
                    desde <InlineMath math="\tilde u=(-0.25,\,0.35)" />, recortar da <InlineMath math="(0,\,0.35)" />, con{' '}
                    <InlineMath math="q_1+q_2=0.35<0.7" />; la proyección exacta es <InlineMath math="(0.05,\,0.65)" />, el pie de la
                    perpendicular al corte <InlineMath math="q_1+q_2=0.7" />, con <InlineMath math="\tilde u-P(\tilde u)=-0.3\,(1,1)" />:
                    multiplicador 0.3 ≥ 0 y única restricción activa, así que cumple las KKT de la proyección.</p>
                <h4>6. Las dos formulaciones</h4>
                <p><b>Gradiente (conjugado) proyectado:</b> necesita <InlineMath math="P_{\mathcal U_{ad}}" /> en cada paso, es decir, un problema
                    cuadrático con 360 restricciones por iteración, resuelto con precisión suficiente para no salir del conjunto; además,
                    proyectar una dirección conjugada rompe la conjugación. <b>Punto interior (trust-constr):</b> no proyecta; las
                    restricciones entran en cada subproblema mediante holguras y la barrera.</p>
                <p><b>Cuánto cuesta proyectar.</b> La proyección que se usa para χ (SLSQP, 73 variables, las 360 desigualdades) tardó de 0.01 a
                    12 s, 2.1 s de media, en las iteraciones de la serie 33. Es poco frente a una resolución de EDP (≈ 10 min con varias corridas a
                    la vez), pero es iterativa e inexacta: un gradiente proyectado la necesitaría en cada punto de prueba de la búsqueda lineal y con la
                    precisión suficiente para no salir del conjunto, y pierde la conjugación cada vez que cambian las restricciones activas.</p>
                <h4>7. La barrera logarítmica: holgura y μ</h4>
                <p>Con <InlineMath math="\mathbf c(u)\ge0" /> todas las desigualdades, se introduce <InlineMath math="\mathbf s=\mathbf c(u)" />,{' '}
                    <InlineMath math="\mathbf s>0" />, y se minimiza <InlineMath math="\hat J(u)-\mu\sum_i\log s_i" />. <b>La holgura</b>{' '}
                    <InlineMath math="s_i" /> es el margen de seguridad: cuánto falta para que la restricción <InlineMath math="i" /> se
                    active, en sus propias unidades (caudal, volumen del tanque, metros). <b><InlineMath math="\mu" /></b> no es un margen: es
                    el peso de la barrera (0.1 al inicio, o el que fija <code>opt_barrera0</code> al reanudar), y baja a{' '}
                    <InlineMath math="\mu/5" /> cada vez que se resuelve un subproblema. <b>Por qué el logaritmo:</b>{' '}
                    <InlineMath math="-\log s\to+\infty" /> cuando <InlineMath math="s\to0^+" />, así que la barrera es una pared en el borde; es
                    suave y convexa, y su derivada <InlineMath math="-\mu/s_i" /> da en la optimalidad del subproblema las KKT perturbadas{' '}
                    <InlineMath math="\lambda_is_i=\mu" /> <Cita k="Nocedal2006" p="cap. 19" />. Lejos del borde <InlineMath math="-\mu\log s_i" /> es
                    casi plana y manda <InlineMath math="\hat J" />; cerca del borde crece y frena el paso. Con{' '}
                    <InlineMath math="\mu\to0" /> se recupera <InlineMath math="\lambda_is_i=0" />: el mínimo de cada subproblema recorre el
                    camino central hasta el óptimo con restricciones (lámina siguiente). Al final los pasos son cortos y la cola es lenta;
                    por eso χ se estanca cerca de 3·10⁻³ antes de bajar.</p>
                <h4>8. Cómo no salir del conjunto (SciPy 1.17.1)</h4>
                <ul>
                    <li><b>Fracción a la frontera.</b> El paso de las holguras, medido en relación con cada holgura, tiene cota inferior{' '}
                        <InlineMath math="-\tau" /> con <InlineMath math="\tau=0.995" /> (<code>tr_interior_point.py</code>, líneas 301 y
                        329–330; Byrd, Hribar y Nocedal 1999, ec. 3.18): <InlineMath math="s_i^{+}\ge0.005\,s_i>0" />.</li>
                    <li><b>keep_feasible.</b> En las restricciones marcadas, la holgura del punto de prueba se toma igual a{' '}
                        <InlineMath math="c_i(u)" /> y, si es ≤ 0, su logaritmo es <InlineMath math="-\infty" /> y la barrera{' '}
                        <InlineMath math="+\infty" /> (<code>tr_interior_point.py</code>, 106–109; Nocedal y Wright, p. 576). La razón entre
                        la reducción real y la predicha es <InlineMath math="-\infty" />, menor que <InlineMath math="10^{-8}" />: el paso se
                        rechaza y el radio se reduce (<code>equality_constrained_sqp.py</code>, 52, 168, 199–211 y 229). Sin{' '}
                        <code>keep_feasible</code> la holgura es una variable independiente y un iterado intermedio podía violar el tanque.</li>
                    <li><b>Barrera.</b> Tras cada subproblema, <InlineMath math="\mu\leftarrow0.2\,\mu" /> y el radio pasa a{' '}
                        <InlineMath math="\max(\Delta_0,5\Delta)" /> (<code>tr_interior_point.py</code>, 304, 307 y 345–351).</li>
                </ul>
                <h4>9. En el código</h4>
                <p><code>scipy.optimize.minimize(method="trust-constr")</code> con <code>Bounds</code> (caudales y <InlineMath math="z_p" />) y dos{' '}
                    <code>LinearConstraint</code>: el tanque (<code>supply_constraint</code>: <InlineMath math="A=V_s\Delta t\,L" />, cotas{' '}
                    <InlineMath math="-\mathbf b" /> y <InlineMath math="S_{\max}-\mathbf b" />, <InlineMath math="\mathbf b=S_0-L\mathbf d" />) y el ciclo de la bomba
                    (<code>pump_duty_constraint</code>), en variables escaladas <InlineMath math="\xi=x/s" /> (<code>fenicsx/adjoint.py</code>,{' '}
                    <code>optimize_fenicsx</code>), todas con <code>keep_feasible</code> cuando <code>opt_factible</code>. La proyección aparece
                    solo en el <i>callback</i> de cada iteración: <code>proyectar</code> (SLSQP sobre el mismo poliedro) da{' '}
                    <InlineMath math="P_{\mathcal U_{ad}}(\xi-\nabla\hat J)" /> para χ, y <code>residuo_proyeccion</code> la certifica con el
                    residuo KKT de la proyección (NNLS).</p>
            </Notas>
        </SlideLayout>
    );
}

A3R11.ecuaciones = ['barrera'];

const eti = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)', lineHeight: 1.4 };
