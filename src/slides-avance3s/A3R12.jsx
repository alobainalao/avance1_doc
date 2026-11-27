import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from '../slides-avance3/ui.jsx';
import { useFases, reducida, suave, tramo, lerp } from '../slides-avance3/anim.js';
import { usePublica, Notas } from '../slides-avance3/version.jsx';
import { TC2D } from '../slides-avance3/trustConstr2d.js';

// Versión simplificada (copia de slides-avance3/A3D16.jsx): misma figura y fases, con el texto público reescrito para que
// cada movimiento tenga su regla, y un recuadro fijo con las reglas de SciPy 1.17.1 que deciden el paso (equality_constrained_sqp.py,
// 50–56 y 192–208: ρ y el radio; tr_interior_point.py: τ = 0.995, μ ← 0.2 μ, Δ ← máx(Δ₀, 5Δ)); se resalta la que actúa en
// cada fase.
// Del punto inicial al óptimo (tesis, Cap. III: algoritmo de optimización y eq:criticidad). La figura es una
// ilustración en 2D con iterados REALES de trust-constr (codigo/scripts/exportar_trust_constr_2d.py: mismo algoritmo y
// opciones que la serie 33, sobre un cuadrático con cotas y dos restricciones acopladas); no es la corrida del acuífero.
// Del mismo exportador salen ρ y Δ de cada paso (registro del SQP interno de scipy), la región de confianza de los dos
// primeros pasos, el camino central con μ/c₁ y, por iterado, la holgura c₁ del lado activo y −∇Ĵ en componentes normal y
// tangencial a ese lado.
const AGUA = 'var(--a3-agua)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)', RIEGO = 'var(--a3-riego)';
const ITS = TC2D.iteraciones, OPT = TC2D.optimo, N = ITS.length, CC = TC2D.camino_central;
const PARO = ITS.find(r => r.chi < 1e-4);              // primera iteración con χ < 10⁻⁴
const MU = [...new Set(ITS.map(r => r.mu))];            // μ en el orden en que los usó scipy (= CC)

// Coordenadas: u ∈ [−0.06, 1.14] × [−0.06, 1.08], misma escala en los dos ejes (las elipses no se deforman).
const W = 760, H = 620, S = 500, X0 = 60, Y0 = 590;
const sx = u => X0 + (u + 0.06) * S, sy = u => Y0 - (u + 0.06) * S;
const P = q => [sx(q[0]), sy(q[1])];
const MARCO = [[-0.06, -0.06], [1.14, -0.06], [1.14, 1.08], [-0.06, 1.08]];
const camino = pts => pts.map((q, i) => `${i ? 'L' : 'M'}${sx(q[0]).toFixed(1)},${sy(q[1]).toFixed(1)}`).join(' ') + ' Z';
// Recuadros ampliados: junto al lado acoplado en el paso 5 → 6 (fase 7) y cerca de û (fases 8–9). Zona Z de la figura y
// su lugar en pantalla ZB.
const Z = { u0: 0.505, u1: 0.545, v0: 0.698, v1: 0.738 }, ZB = { x: 492, y: 8, l: 160 };
const Z6 = { u0: 0.548, u1: 0.628, v0: 0.598, v1: 0.678 }, ZB6 = { x: 488, y: 6, l: 166 };

// Curvas de nivel Ĵ = c: elipses con centro en el mínimo libre m, semiejes √(2c) y √(2c/K), eje mayor a th grados.
const NIVELES = [0.02, 0.06, 0.12, 0.2, OPT.J, 0.4, 0.56, 0.76, 1.0, 1.3, 1.65, 2.05, 2.5, 3.11, 3.8];
// lados del polígono: cotas de caja y restricciones acopladas (filas de A)
const LADOS = [
    { a: 0, b: 1, tipo: 'cota' }, { a: 1, b: 2, tipo: 'cota' },
    { a: 2, b: 3, tipo: 'acoplada', et: 'u₁ + u₂ ≤ 1.25' }, { a: 3, b: 4, tipo: 'acoplada', et: '−0.6 u₁ + u₂ ≤ 0.62' },
    { a: 4, b: 0, tipo: 'cota' },
];

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sci = v => {
    if (v >= 0.01 && v < 10) return String(Number(v.toPrecision(2)));
    const e = Math.floor(Math.log10(v));
    return `${(v / 10 ** e).toFixed(1)}·10${String(e).split('').map(ch => SUP[ch]).join('')}`;
};
const r6 = ITS[5], pp = TC2D.primer_paso, REG = TC2D.regiones, RG = TC2D.reglas;
// Junto al lado (fase 7): paso 5 → 6 (registros 4 → 5), el más pegado al lado acoplado u₁ + u₂ ≤ 1.25.
// gn, gt: componentes de −∇Ĵ normal (hacia afuera) y tangencial al lado; c1: holgura del lado (exportador).
const I5 = ITS[4], I6 = ITS[5];
const angulo = r => Math.atan2(r.gn, Math.abs(r.gt)) * 180 / Math.PI;        // −∇Ĵ con el lado [°]
const EMPUJE = I6.mu * Math.SQRT2 / I5.c1;                                   // |μ ∇c₁ / c₁| en u₅ con el μ del paso
const fmtD = v => (v < 10 ? String(Number(v.toPrecision(2))) : v < 1000 ? v.toFixed(1) : sci(v));

// Tramos de iteraciones de cada fase: registros a..b del optimizador, desde el segundo t0, dt segundos por registro.
const TRAMOS = {
    3: { a: 0, b: 1, t0: 1.1, dt: 1.5 }, 4: { a: 1, b: 2, t0: 0.7, dt: 1.5 }, 5: { a: 2, b: 4, t0: 1.4, dt: 1.1 },
    6: { a: 4, b: 5, t0: 1.3, dt: 1.4 }, 7: { a: 5, b: PARO.k - 1, t0: 0.6, dt: 0.6 },
};
const FASES = [
    { n: 'Región', dur: 1.4,
      p: <>Cotas de caja y dos restricciones <b style={{ color: RIEGO }}>acopladas</b>, como el tanque. Lo rayado no es admisible.</>,
      d: <>El conjunto admisible es la intersección de las cotas <InlineMath math="0\le u_i\le1" /> (como{' '}
          <InlineMath math="0\le Q_n\le\overline Q_n" />) con dos restricciones <b style={{ color: RIEGO }}>acopladas</b>, que
          mezclan las dos variables (como el tanque, que mezcla todos los caudales anteriores). Lo rayado no es admisible.</> },
    { n: 'Curvas de Ĵ', dur: 2.2,
      p: <>Curvas de nivel de <InlineMath math="\hat J" />. Su mínimo libre cae fuera: el óptimo estará en el borde.</>,
      d: <>Curvas de nivel de <InlineMath math="\hat J" />: en cada elipse <InlineMath math="\hat J" /> es constante y baja
          hacia el centro. El mínimo sin restricciones cae fuera del conjunto, así que el óptimo admisible estará en el
          borde.</> },
    { n: 'Inicio', dur: 2.0,
      p: <>Se parte de <InlineMath math="u_0" /> admisible. <InlineMath math="-\nabla\hat J(u_0)" /> es perpendicular a la curva de
          nivel y señala hacia donde <InlineMath math="\hat J" /> baja más rápido.</>,
      d: <>Se parte de un punto admisible <InlineMath math="u_0" /> (en las corridas, el caudal estándar con{' '}
          <InlineMath math="z_p=-600" /> m, llevado al interior). <InlineMath math="-\nabla\hat J(u_0)" /> es perpendicular a la curva
          de nivel que pasa por <InlineMath math="u_0" /> y señala hacia donde <InlineMath math="\hat J" /> baja más rápido. En el
          acuífero, <InlineMath math="\nabla\hat J=\partial_uJ+(\partial_ue)^*\psi" /> sale de una resolución adjunta{' '}
          <InlineMath math="\psi" /> (láminas del adjunto); aquí <InlineMath math="\hat J" /> es cuadrático y el gradiente es analítico. El
          adjunto no da la dirección del paso: da el gradiente con el que se arma el modelo.</> },
    { n: 'Paso corto', dur: 3.0,
      p: <>Longitud: el paso minimiza un modelo cuadrático de <InlineMath math="\hat J" /> solo dentro de la región de confianza{' '}
          <InlineMath math="\|p\|_s\le\Delta" />. La norma cuenta el cambio relativo de cada holgura: junto a las cotas la región es una
          elipse pequeña y el primer paso, que llega a su borde, mide {pp.norma.toFixed(2)}.</>,
      d: <>Cada paso minimiza un modelo cuadrático de <InlineMath math="\hat J" /> (gradiente y curvatura BFGS) con{' '}
          <InlineMath math="\|p\|\le\Delta" />: la región de confianza, donde el modelo es fiable; <InlineMath math="\Delta_0=1" />. La
          norma cuenta también el cambio relativo de cada holgura <InlineMath math="s_i=c_i(u)" />: junto a las cotas{' '}
          <InlineMath math="u\ge0" /> (holguras {pp.holguras_x0[0]} y {pp.holguras_x0[1]}) la región es una elipse pequeña (semiejes{' '}
          {REG[0].semiejes[0].toFixed(2)} y {REG[0].semiejes[1].toFixed(2)}) y el primer paso, que llega a su borde, mide{' '}
          {pp.norma.toFixed(2)}. Empezar con prudencia evita fiarse del modelo lejos de donde se construyó.</> },
    { n: 'Paso largo', dur: 2.6,
      p: <>Aceptación: <InlineMath math="\rho" /> = reducción real / reducción predicha. Fue{' '}
          <InlineMath math={`\\rho=${ITS[1].rho.toFixed(2)}\\ge0.9`} />: el paso se acepta y <InlineMath math="\Delta\leftarrow\max(7\|p\|,\Delta)" />{' '}
          = {fmtD(ITS[1].delta_nuevo)}; el segundo paso es largo. Con <InlineMath math="\rho<10^{-8}" /> se rechazaría y{' '}
          <InlineMath math="\Delta" /> bajaría a 0.1–0.5 veces.</>,
      d: <><InlineMath math="\rho" /> = reducción real / reducción predicha por el modelo. Con{' '}
          <InlineMath math={`\\rho_1=${ITS[1].rho.toFixed(2)}\\ge${RG.rho_grande}`} /> el modelo es fiable y{' '}
          <InlineMath math={`\\Delta\\leftarrow\\max(${RG.crece_grande}\\|p\\|,\\Delta)=${fmtD(ITS[1].delta_nuevo)}`} />: la región
          cubre ya toda la figura y el segundo paso lo decide el mínimo del modelo (<InlineMath math="\hat J" /> baja de{' '}
          {ITS[1].J.toFixed(2)} a {ITS[2].J.toFixed(2)}). Si <InlineMath math="\rho<10^{-8}" />, el paso se rechaza y{' '}
          <InlineMath math="\Delta" /> se reduce: así se corrige avanzar demasiado. Un <InlineMath math="\Delta" /> demasiado pequeño no
          da pasos malos, sino muchos y lentos. Aquí no se rechazó ninguno.</> },
    { n: 'Barrera μ', dur: 4.0,
      p: <>Cada μ tiene su mínimo con barrera (◇), dentro del conjunto: <InlineMath math="-\mu\log s_i" /> crece sin cota en el borde.
          Al alcanzarlo, μ ← μ/5 y <InlineMath math="\Delta\leftarrow\max(\Delta_0,5\Delta)" />: el siguiente ◇ está más cerca del borde.</>,
      d: <>Para cada μ, <InlineMath math="\hat J-\mu\sum\log s_i" /> tiene un mínimo dentro del conjunto (◇): el logaritmo crece sin
          cota cuando una holgura <InlineMath math="s_i\to0" />, así que el borde no se alcanza. Al bajar μ el ◇ se acerca al borde:
          es el <i>camino central</i>. El iterado 3 ya está junto al ◇ de μ = 0.1; en la iteración 4 no se mueve, solo baja μ a
          0.02 (y <InlineMath math="\Delta" /> se multiplica por 5), y el paso 5 persigue el nuevo ◇.</> },
    { n: 'Junto al lado', dur: 3.0,
      p: <>Por qué se curva: junto al lado, <InlineMath math="-\nabla\hat J" /> apunta casi hacia afuera ({Math.round(angulo(I5))}°). La barrera
          suma <InlineMath math="-\mu\nabla c_1/c_1" /> hacia adentro y curvatura <InlineMath math="\mu/c_1^2" /> en la normal: el modelo es muy
          empinado hacia el borde y su mínimo queda casi tangente ({Math.round(I6.angulo_lado)}° con el lado).</>,
      d: <>En <InlineMath math="u_5" />, <InlineMath math="-\nabla\hat J" /> forma {Math.round(angulo(I5))}° con el lado acoplado: casi todo
          empuja hacia afuera; su parte tangencial es {Math.abs(I5.gt).toFixed(2)} de {Math.hypot(I5.gn, I5.gt).toFixed(2)}. La barrera{' '}
          <InlineMath math="-\mu\log c_1" /> empuja hacia adentro, normal al lado, con fuerza <InlineMath math="\mu\|\nabla c_1\|/c_1" /> que
          crece al acercarse, y vuelve muy empinado el modelo en esa dirección. Queda libre la tangencial: el paso 5 → 6 forma{' '}
          {Math.round(I6.angulo_lado)}° con el lado y conserva la distancia (<InlineMath math="c_1" />: {I5.c1.toFixed(3)} →{' '}
          {I6.c1.toFixed(3)}). Lo que se vuelve tangente es el paso, no el gradiente.</> },
    { n: 'μ → 0', dur: 0.6 + 0.6 * (PARO.k - 1 - 5) + 0.6,
      p: <>Cada μ menor deja acercarse más (<InlineMath math="c_1\approx\mu/\lambda" />): los ◇ forman el camino central que termina en{' '}
          <InlineMath math="\hat u" />. Ningún paso cruza: fuera del conjunto la barrera vale +∞ y el paso se rechaza. χ &lt; 10⁻⁴ en la
          iteración {PARO.k}.</>,
      d: <>Se alternan μ ← μ/5 y un paso. La barrera deja acercarse hasta <InlineMath math="c_1\approx\mu/\lambda" /> ({sci(r6.c1)} →{' '}
          {sci(PARO.c1)}) y la componente tangencial de <InlineMath math="-\nabla\hat J" />, la única que aún baja{' '}
          <InlineMath math="\hat J" /> sin salir del conjunto, se anula ({sci(Math.abs(r6.gt))} → {sci(Math.abs(PARO.gt))}). χ baja de{' '}
          {sci(r6.chi)} a {sci(PARO.chi)}: en la iteración {PARO.k}, <InlineMath math="\chi<10^{-4}" /> y aquí se pararía (recuadro
          ampliado).</> },
    { n: 'Óptimo (KKT)', dur: 2.2,
      p: <>En el óptimo, <InlineMath math="-\nabla\hat J" /> es perpendicular al lado activo: ninguna dirección admisible baja{' '}
          <InlineMath math="\hat J" />. Es la condición KKT (<InlineMath math="\chi=0" />).</>,
      d: <>En <InlineMath math="\hat u" /> la curva de nivel toca el lado activo y <InlineMath math="-\nabla\hat J(\hat u)=\lambda a" /> es
          perpendicular a él, hacia afuera: no queda dirección admisible que baje <InlineMath math="\hat J" />. El multiplicador es el
          límite de <InlineMath math="\mu/c_1" /> en el camino central ({CC.slice(0, 4).map(c => c.mu_c1.toFixed(2)).join(', ')}, …
          → <InlineMath math={`\\lambda=${OPT.lambda_lin[0].toFixed(2)}`} />): la complementariedad perturbada{' '}
          <InlineMath math="\lambda_1s_1=\mu" /> que con μ → 0 da <InlineMath math="\lambda_1c_1=0" />.</> },
];
const FIN = FASES.length - 1;

// Posición en el registro del optimizador (real, con fracción) para la fase y el tiempo local.
function posicion(fase, l) {
    if (fase >= FIN) return N - 1;
    const tr = TRAMOS[fase];
    if (!tr) return 0;
    return tr.a + Math.min(tr.b - tr.a, Math.max(0, (l - tr.t0) / tr.dt));
}
// μ vigente en el registro k (índice) y su punto del camino central
const centro = k => CC[MU.indexOf(ITS[k].mu)];

// Flecha de dirección (solo dirección: largo fijo en pantalla) desde q con vector v en coordenadas u.
function Flecha({ q, v, largo = 70, color = GRIS, ancho = 2.2, trazo, id = 'tc-gris' }) {
    const n = Math.hypot(v[0], v[1]) || 1, [x, y] = P(q);
    return <line x1={x} y1={y} x2={x + largo * v[0] / n} y2={y - largo * v[1] / n} stroke={color} strokeWidth={ancho}
                 strokeDasharray={trazo} markerEnd={`url(#${id})`} />;
}

// Recuadro ampliado de la zona Z en la caja B: rayado exterior, lados, camino central, trayectoria e iterados; `extra`
// dibuja encima con las coordenadas del recuadro (zx, zy).
function Recuadro({ id, Z, B, op, traza, pasos, ccAct, conCC, rotulo, arriba, extra }) {
    const zx = u => B.x + (u - Z.u0) / (Z.u1 - Z.u0) * B.l, zy = v => B.y + (Z.v1 - v) / (Z.v1 - Z.v0) * B.l;
    const ruta = pts => pts.map((q, k) => `${k ? 'L' : 'M'}${zx(q[0]).toFixed(1)},${zy(q[1]).toFixed(1)}`).join(' ') + ' Z';
    return (
        <g opacity={op} style={{ fontFamily: 'var(--a3-sans)', fill: GRIS }}>
            <defs><clipPath id={id}><rect x={B.x} y={B.y} width={B.l} height={B.l} /></clipPath></defs>
            <rect x={sx(Z.u0)} y={sy(Z.v1)} width={sx(Z.u1) - sx(Z.u0)} height={sy(Z.v0) - sy(Z.v1)} fill="none" stroke={GRIS} strokeWidth="1.4" />
            <line x1={sx(Z.u1)} y1={sy(Z.v1)} x2={B.x} y2={B.y + B.l} stroke={GRIS} strokeWidth="1" strokeDasharray="3 3" />
            <rect x={B.x} y={B.y} width={B.l} height={B.l} fill="var(--sl-bg)" stroke={GRIS} strokeWidth="1.4" />
            <g clipPath={`url(#${id})`}>
                <path d={ruta([[-1, -1], [2, -1], [2, 2], [-1, 2]]) + ' ' + ruta(TC2D.poligono)} fillRule="evenodd" fill="url(#tc-rayas)" />
                {LADOS.map(({ a, b, tipo }, k) => {
                    const q1 = TC2D.poligono[a], q2 = TC2D.poligono[b];
                    return <line key={k} x1={zx(q1[0])} y1={zy(q1[1])} x2={zx(q2[0])} y2={zy(q2[1])}
                                 stroke={tipo === 'acoplada' ? RIEGO : AGUA} strokeWidth={tipo === 'acoplada' ? 2.6 : 2} />;
                })}
                {conCC && <polyline points={CC.map(c => `${zx(c.x[0])},${zy(c.x[1])}`).join(' ')} fill="none" stroke={GRIS} strokeWidth="1.4" strokeDasharray="3 4" />}
                {conCC && CC.map(c => {
                    const on = c === ccAct;
                    return <path key={c.mu} d={`M${zx(c.x[0])},${zy(c.x[1]) - 6} l6,6 l-6,6 l-6,-6 z`} fill={on ? RIEGO : 'var(--sl-bg)'} stroke={on ? RIEGO : GRIS} strokeWidth="1.5" />;
                })}
                <polyline points={traza.map(q => `${zx(q[0])},${zy(q[1])}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2" />
                {pasos.map(r => <circle key={r.k} cx={zx(r.x[0])} cy={zy(r.x[1])} r="3.5" fill={AGUA} />)}
                {extra && extra(zx, zy)}
            </g>
            <text x={arriba ? B.x + B.l - 6 : B.x + 6} y={arriba ? B.y + 20 : B.y + B.l - 8} textAnchor={arriba ? 'end' : 'start'}
                  style={{ ...halo, fontSize: 'inherit' }}>{rotulo}</text>
        </g>
    );
}

// Flecha en el recuadro: desde (x, y) en pantalla, vector v en coordenadas u (y hacia arriba), largo en píxeles.
function FlechaZ({ x, y, v, largo, color, id, trazo }) {
    const n = Math.hypot(v[0], v[1]) || 1;
    return <line x1={x} y1={y} x2={x + largo * v[0] / n} y2={y - largo * v[1] / n} stroke={color} strokeWidth="2.4"
                 strokeDasharray={trazo} markerEnd={`url(#${id})`} />;
}

function Figura({ fase, P: avance, l }) {
    const pub = usePublica();
    const fs = pub ? 21 : 18;
    const fN = suave(avance(1));
    const t = posicion(fase, l), i = Math.floor(t), fr = suave(t - i);
    const sig = ITS[Math.min(N - 1, i + 1)];
    const actual = [lerp(ITS[i].x[0], sig.x[0], fr), lerp(ITS[i].x[1], sig.x[1], fr)];
    const traza = [...ITS.slice(0, i + 1).map(r => r.x), actual];
    const kAct = Math.min(N - 1, Math.round(t)), barrera = fase >= 5 && fase < FIN && ITS[kAct].tipo === 'barrera' && Math.abs(t - kAct) < 0.35;
    const verCC = fase >= 5, fCC = fase === 5 ? suave(Math.min(1, l / 1.2)) : 1;
    const ccAct = centro(kAct);
    const verZ = fase >= 7, fZ = fase === 7 ? suave(Math.min(1, l / 0.6)) : 1;
    const [ox, oy] = P(OPT.x);
    // región de confianza en u₀ (fases 4–5) y curva de nivel por u₀ con el ángulo recto de −∇Ĵ (fase 3)
    const fR = fase === 3 ? suave(Math.min(1, l / 1.0)) : fase === 4 ? 0.45 : 0;
    const [x0s, y0s] = P(TC2D.x0), g0 = ITS[0].g, n0 = Math.hypot(g0[0], g0[1]);
    const vs = [-g0[0] / n0, g0[1] / n0], ts = [-vs[1], vs[0]];          // −∇Ĵ y su perpendicular, en pantalla
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
                <marker id="tc-riego" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={RIEGO} />
                </marker>
                <pattern id="tc-rayas" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="12" stroke={GRIS} strokeOpacity="0.35" strokeWidth="2" />
                </pattern>
                <clipPath id="tc-marco"><path d={camino(MARCO)} /></clipPath>
            </defs>
            {/* fuera de U_ad: rayado (marco menos polígono, regla par-impar) */}
            <path d={camino(MARCO) + ' ' + camino(TC2D.poligono)} fillRule="evenodd" fill="url(#tc-rayas)" opacity={suave(avance(0))} />
            <path d={camino(TC2D.poligono)} fill={AGUA} fillOpacity={0.09 * suave(avance(0))} />
            {/* curvas de nivel; en la fase 3, la que pasa por u₀ */}
            <g clipPath="url(#tc-marco)">
                {NIVELES.map((c, k) => {
                    const op = tramo(fN, k / NIVELES.length * 0.7, k / NIVELES.length * 0.7 + 0.3);
                    const ver = c === OPT.J && fase >= FIN;
                    return <ellipse key={c} cx={sx(TC2D.m[0])} cy={sy(TC2D.m[1])} rx={Math.sqrt(2 * c) * S} ry={Math.sqrt(2 * c / TC2D.K) * S}
                                    transform={`rotate(${-TC2D.th} ${sx(TC2D.m[0])} ${sy(TC2D.m[1])})`} fill="none"
                                    stroke={ver ? VALIDO : GRIS} strokeWidth={ver ? 2.6 : 1.3} strokeOpacity={ver ? 0.9 : 0.5 * op}
                                    strokeDasharray={ver ? undefined : '5 4'} />;
                })}
                {fase === 2 && (
                    <ellipse cx={sx(TC2D.m[0])} cy={sy(TC2D.m[1])} rx={Math.sqrt(2 * ITS[0].J) * S} ry={Math.sqrt(2 * ITS[0].J / TC2D.K) * S}
                             transform={`rotate(${-TC2D.th} ${sx(TC2D.m[0])} ${sy(TC2D.m[1])})`} fill="none" stroke={AGUA}
                             strokeWidth="2.4" strokeOpacity={0.85 * suave(Math.min(1, l / 0.8))} />
                )}
            </g>
            {/* lados del polígono */}
            {LADOS.map(({ a, b, tipo }, k) => {
                const [x1, y1] = P(TC2D.poligono[a]), [x2, y2] = P(TC2D.poligono[b]);
                const f = suave(tramo(avance(0), k / 5 * 0.6, k / 5 * 0.6 + 0.4));
                return <line key={k} x1={x1} y1={y1} x2={lerp(x1, x2, f)} y2={lerp(y1, y2, f)}
                             stroke={tipo === 'acoplada' ? RIEGO : AGUA} strokeWidth={tipo === 'acoplada' ? 3.4 : 2.4} strokeLinecap="round" />;
            })}
            <g style={{ fontFamily: 'var(--a3-sans)', fontSize: fs, ...halo }} opacity={suave(tramo(avance(0), 0.6, 1))}>
                <text x={sx(0.93)} y={sy(0.42)} transform={`rotate(45 ${sx(0.93)} ${sy(0.42)})`} textAnchor="middle" style={{ fill: RIEGO }}>{LADOS[2].et}</text>
                <text x={sx(0.17)} y={sy(0.8)} transform={`rotate(-31 ${sx(0.17)} ${sy(0.8)})`} textAnchor="middle" style={{ fill: RIEGO }}>{LADOS[3].et}</text>
                <text x={sx(0.5)} y={sy(-0.045)} textAnchor="middle" style={{ fill: AGUA }}>cotas 0 ≤ u₁, u₂ ≤ 1</text>
                <text x={sx(0.2)} y={sy(0.45)} textAnchor="middle" style={{ fill: AGUA, fontSize: fs + 8, fontStyle: 'italic' }}>U<tspan dy="7" fontSize={fs - 2}>ad</tspan></text>
                <text x={sx(0.12)} y={sy(1.0)} textAnchor="middle" style={{ fill: GRIS }}>no admisible</text>
            </g>
            {/* mínimo libre */}
            {fase >= 1 && (
                <g opacity={tramo(avance(1), 0.5, 1)} style={{ fontFamily: 'var(--a3-sans)', fontSize: fs - 1, fill: GRIS, ...halo }}>
                    <path d={`M${sx(TC2D.m[0]) - 8},${sy(TC2D.m[1]) - 8} l16,16 m0,-16 l-16,16`} stroke={GRIS} strokeWidth="2.6" />
                    <text x={sx(TC2D.m[0]) + 14} y={sy(TC2D.m[1]) + 24}>mínimo de Ĵ</text>
                    <text x={sx(TC2D.m[0]) + 14} y={sy(TC2D.m[1]) + 46}>(no admisible)</text>
                </g>
            )}
            {/* región de confianza del primer paso: ‖d‖² + Σ(∇cᵢ·d / cᵢ(u₀))² ≤ Δ₀² (exportada de las fórmulas de scipy) */}
            {fR > 0 && (
                <g opacity={fR}>
                    <path d={REG[0].borde.map((q, k) => `${k ? 'L' : 'M'}${sx(q[0]).toFixed(1)},${sy(q[1]).toFixed(1)}`).join(' ') + ' Z'}
                          fill={AGUA} fillOpacity="0.12" stroke={AGUA} strokeWidth="1.8" strokeDasharray="5 3" />
                    {fase === 3 && (
                        <text x={sx(0.25)} y={sy(0.02)} style={{ ...eje, fontSize: fs - 2, fill: AGUA, ...halo }}>
                            región de confianza, Δ₀ = {fmtD(REG[0].delta)}
                        </text>
                    )}
                </g>
            )}
            {fase === 4 && (
                <text x={sx(0.27)} y={sy(0.13)} style={{ ...eje, fontSize: fs - 2, fill: AGUA, ...halo }} opacity={suave(Math.min(1, l / 0.6))}>
                    Δ = {fmtD(REG[1].delta)}: cubre toda la figura
                </text>
            )}
            {/* camino central: mínimo de cada subproblema de barrera (◇); el del μ vigente, relleno */}
            {verCC && (
                <g style={{ fontFamily: 'var(--a3-sans)', fontSize: fs - 3, fill: GRIS, ...halo }}>
                    <polyline points={CC.slice(0, Math.max(2, Math.ceil(fCC * CC.length))).map(c => P(c.x).join(',')).join(' ')}
                              fill="none" stroke={GRIS} strokeWidth="1.8" strokeDasharray="3 4" />
                    {CC.map((c, k) => {
                        const [x, y] = P(c.x), on = c === ccAct && fase < FIN;
                        return k / CC.length <= fCC && (
                            <path key={c.mu} d={`M${x},${y - 7} l7,7 l-7,7 l-7,-7 z`} fill={on ? RIEGO : 'var(--sl-bg)'} stroke={on ? RIEGO : GRIS} strokeWidth="1.8" />
                        );
                    })}
                    {fase < FIN && fase !== 6 && (
                        <text x={sx(ccAct.x[0]) - 14} y={sy(ccAct.x[1]) + 6} textAnchor="end" style={{ fill: RIEGO }} opacity={fCC}>
                            ◇ μ = {sci(ccAct.mu)}
                        </text>
                    )}
                </g>
            )}
            {/* trayectoria real */}
            {fase >= 2 && (
                <g>
                    <path d={traza.map((q, k) => `${k ? 'L' : 'M'}${sx(q[0])},${sy(q[1])}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2.6" />
                    {ITS.slice(0, i + 1).filter(r => r.tipo !== 'barrera').map(r => <circle key={r.k} cx={sx(r.x[0])} cy={sy(r.x[1])} r="4.5" fill={AGUA} />)}
                    <circle cx={x0s} cy={y0s} r="9" fill="var(--sl-bg)" stroke={AGUA} strokeWidth="3" />
                    <text x={x0s + 14} y={y0s + 26} style={{ ...eje, fontSize: fs, fill: AGUA, ...halo }}>u₀</text>
                    {fase === 2 && <Flecha q={TC2D.x0} v={g0.map(x => -x)} largo={110 * suave(avance(2))} />}
                    {fase === 2 && avance(2) > 0.5 && (
                        <g opacity={suave(tramo(avance(2), 0.5, 0.8))}>
                            {/* ángulo recto entre −∇Ĵ(u₀) y la tangente a la curva de nivel */}
                            <path d={`M${x0s + 16 * ts[0]},${y0s + 16 * ts[1]} l${16 * vs[0]},${16 * vs[1]} l${-16 * ts[0]},${-16 * ts[1]}`}
                                  fill="none" stroke={GRIS} strokeWidth="1.8" />
                            <text x={x0s + 70} y={y0s - 70} style={{ ...eje, fontSize: fs, ...halo }}>−∇Ĵ(u₀)</text>
                        </g>
                    )}
                    {(fase === 3 || fase === 4) && (
                        <g>
                            <Flecha q={ITS[i].x} v={ITS[i].g.map(x => -x)} largo={80} trazo="6 4" />
                            {i < N - 1 && <line x1={sx(ITS[i].x[0])} y1={sy(ITS[i].x[1])} x2={sx(sig.x[0])} y2={sy(sig.x[1])} stroke={AGUA}
                                                strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#tc-agua)" />}
                            <text x={sx(ITS[i].x[0]) - 14} y={sy(ITS[i].x[1]) - 14} textAnchor="end" style={{ ...eje, fontSize: fs - 3, ...halo }}>−∇Ĵ</text>
                        </g>
                    )}
                    {fase >= 3 && fase < FIN && (
                        <circle cx={sx(actual[0])} cy={sy(actual[1])} r={barrera ? 15 : 7} fill={barrera ? 'none' : AGUA}
                                stroke={barrera ? RIEGO : 'none'} strokeWidth="3" />
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
                    <text x={ox + 66} y={oy - 112} textAnchor="end" style={{ fill: VALIDO }}>−∇Ĵ(û) = λ a</text>
                    <text x={ox + 66} y={oy - 88} textAnchor="end" style={{ fill: VALIDO }}>λ = {OPT.lambda_lin[0].toFixed(2)} ≥ 0</text>
                </g>
            )}
            {/* junto al lado acoplado (fase 7): −∇Ĵ(u₅) y el empuje de la barrera a la misma escala; el paso real 5 → 6 */}
            {fase === 6 && (
                <g style={{ fontSize: fs - 4 }}>
                <Recuadro id="tc-zoom-borde" Z={Z6} B={ZB6} op={suave(Math.min(1, l / 0.6))} traza={traza} pasos={ITS.slice(0, i + 1).filter(r => r.tipo === 'paso')}
                          conCC ccAct={ccAct} arriba rotulo={`×${Math.round(ZB6.l / (sx(Z6.u1) - sx(Z6.u0)))} junto al lado`}
                          extra={(zx, zy) => {
                              const x5 = zx(I5.x[0]), y5 = zy(I5.x[1]), x6 = zx(I6.x[0]), y6 = zy(I6.x[1]), gl = 58;
                              const f = suave(tramo(l, 0.4, 1.1)), fp = t >= 4.97 ? 1 : 0;
                              return (
                                  <g opacity={f} style={{ fontSize: fs - 4, ...halo }}>
                                      <FlechaZ x={x5} y={y5} v={I5.g.map(x => -x)} largo={gl} color={GRIS} id="tc-gris" />
                                      <FlechaZ x={x5} y={y5} v={[-1, -1]} largo={gl * EMPUJE / Math.hypot(I5.gn, I5.gt)} color={RIEGO} id="tc-riego" />
                                      <line x1={x5} y1={y5} x2={x6} y2={y6} stroke={AGUA} strokeWidth="2.6" markerEnd="url(#tc-agua)" opacity={fp} />
                                      <text x={x5 + 14} y={y5 - gl + 2} style={{ fill: GRIS }}>−∇Ĵ</text>
                                      <text x={x5 - 32} y={y5 + 46} textAnchor="end" style={{ fill: RIEGO }}>barrera</text>
                                      <text x={x6 - 8} y={y6 - 10} textAnchor="end" style={{ fill: AGUA }} opacity={fp}>paso</text>
                                  </g>
                              );
                          }} />
                </g>
            )}
            {/* recuadro ampliado cerca de û: lado activo, camino central e iterados */}
            {verZ && (
                <g style={{ fontSize: fs - 4 }}>
                    <Recuadro id="tc-zoom-opt" Z={Z} B={ZB} op={fZ} traza={traza} pasos={ITS.slice(0, i + 1).filter(r => r.tipo === 'paso')}
                              conCC ccAct={fase < FIN ? ccAct : null} rotulo={`×${Math.round(ZB.l / (sx(Z.u1) - sx(Z.u0)))} cerca de û`}
                              extra={(zx, zy) => fase >= FIN && <circle cx={zx(OPT.x[0])} cy={zy(OPT.x[1])} r="6" fill={VALIDO} />} />
                </g>
            )}
            <text x={W - 6} y={H - 4} textAnchor="end" style={{ ...eje, fontSize: pub ? 16 : 14 }}>
                ilustración 2D · iterados reales de trust-constr (SciPy {TC2D.scipy})
            </text>
        </svg>
    );
}

// Registro del optimizador en la fase: una fila por iteración, la fila en curso resaltada. Columnas según lo que explica la
// fase: radio Δ y cociente ρ en los primeros pasos, χ y μ con la barrera, holgura c₁ y ángulos con el lado junto al borde.
const QUE = r => (r.tipo === 'inicio' ? 'inicio' : r.tipo === 'barrera' ? 'μ ÷ 5' : 'paso');
const COL_PASOS = { cab: ['it', 'Ĵ', 'Δ', 'ρ', 'Δ nuevo'],
                    val: r => [r.k, r.J.toFixed(3), r.delta ? fmtD(r.delta) : '—', r.rho ? r.rho.toFixed(2) : '—', fmtD(r.delta_nuevo ?? r.tr)] };
const COL_BARRERA = { cab: ['it', 'Ĵ', 'χ', 'μ', ''], val: r => [r.k, r.J.toFixed(3), sci(r.chi), sci(r.mu), QUE(r)] };
const TABLAS = {
    3: { a: 0, b: 1, ...COL_PASOS },
    4: { a: 0, b: 2, ...COL_PASOS },
    5: { a: 2, b: 4, ...COL_BARRERA },
    6: { a: 4, b: 5, cab: ['it', 'Ĵ', 'c₁', '∠ −∇Ĵ', '∠ paso'],
         val: r => [r.k, r.J.toFixed(3), r.c1.toFixed(3), `${Math.round(angulo(r))}°`, `${Math.round(r.angulo_lado)}°`] },
    7: { a: 5, b: PARO.k - 1, soloPasos: true, cab: ['it', 'Ĵ', 'χ', 'μ', 'c₁'],
         val: r => [r.k, r.J.toFixed(3), sci(r.chi), sci(r.mu), sci(r.c1)] },
};
function Registro({ fase, l }) {
    const tb = TABLAS[fase];
    if (!tb) return null;
    const t = posicion(fase, l), kAct = Math.min(N - 1, Math.ceil(t - 0.15));
    let filas = ITS.slice(tb.a, tb.b + 1);
    if (tb.soloPasos) filas = filas.filter(r => r.tipo === 'paso');
    const celda = { padding: '1px 14px 1px 0', textAlign: 'right' };
    return (
        <table style={{ marginTop: 10, borderCollapse: 'collapse', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)',
                        fontVariantNumeric: 'tabular-nums', color: 'var(--sl-muted)' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--a3-filete)' }}>
                    {tb.cab.map((h, k) => <th key={k} style={{ ...celda, fontWeight: 400 }}>{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {filas.map(r => {
                    const ya = r.k - 1 <= kAct, on = r.k - 1 === kAct || (tb.soloPasos && r.k - 1 <= kAct && r.k - 1 > kAct - 2);
                    return (
                        <tr key={r.k} style={{ opacity: ya ? 1 : 0.28, color: on ? 'var(--sl-text)' : undefined, fontWeight: on ? 600 : 400 }}>
                            {tb.val(r).map((v, k) => (
                                <td key={k} style={{ ...celda, textAlign: k === 4 && tb === TABLAS[5] ? 'left' : 'right',
                                                     color: tb === TABLAS[7] && k === 2 && r.chi < 1e-4 ? VALIDO
                                                         : tb === TABLAS[5] && k === 4 && r.tipo === 'barrera' ? RIEGO : undefined }}>{v}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

// Reglas que deciden cada paso (SciPy 1.17.1), con las fases en que actúan.
const REGLAS = [
    { f: [3, 4], t: <>Longitud: <InlineMath math="p=\arg\min m(p)" /> con <InlineMath math="\|p\|_s\le\Delta" /></> },
    { f: [4], t: <><InlineMath math="\rho\ge0.9" />: Δ ← máx(7‖p‖, Δ); <InlineMath math="\rho\ge0.3" />: máx(2‖p‖, Δ); <InlineMath math="\rho<10^{-8}" />: rechazo, Δ ← 0.1–0.5 Δ</> },
    { f: [5, 7], t: <>Subproblema resuelto: μ ← μ/5, Δ ← máx(Δ₀, 5Δ)</> },
    { f: [6, 7], t: <>Sin salir: fuera de <InlineMath math="\mathcal U_{ad}" /> la barrera es +∞ (rechazo); cada holgura conserva ≥ 0.5 %</> },
];
function Reglas({ fase }) {
    return (
        <div style={{ marginTop: 8, borderTop: '1px solid var(--a3-filete)', paddingTop: 4 }}>
            <p style={{ margin: '0 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>Reglas del paso</p>
            {REGLAS.map((r, i) => {
                const activa = r.f.includes(fase);
                return (
                    <p key={i} style={{ margin: '1px 0', padding: '1px 0 1px 8px', borderLeft: `3px solid ${activa ? 'var(--sl-accent)' : 'transparent'}`,
                                        fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', lineHeight: 1.3,
                                        color: activa ? 'var(--sl-text)' : 'var(--sl-muted)', opacity: activa ? 1 : 0.7 }}>{r.t}</p>
                );
            })}
        </div>
    );
}

const eqChi = String.raw`\chi(u_k)=\big\|\,u_k-P_{\mathcal U_{ad}}\big(u_k-\nabla\hat J(u_k)\big)\big\|_\infty`;
const eqKKT = String.raw`\begin{aligned}&\nabla\hat J(\hat u)=\textstyle\sum_i\lambda_i\nabla c_i(\hat u)\\ &\lambda_i\ge0,\quad c_i(\hat u)\ge0,\quad \lambda_i\,c_i(\hat u)=0\end{aligned}`;

export default function A3R12({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const avance = k => (fase > k ? 1 : fase < k ? 0 : l / FASES[k].dur);
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    return (
        <SlideLayout title="Algoritmo: región de confianza con barrera" theme={theme} justify="flex-start">
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
                    <Registro fase={fase} l={l} />
                    <Reglas fase={fase} />
                    {fase === 7 && posicion(fase, l) >= PARO.k - 1 && (
                        <p style={{ ...nota, color: VALIDO }}>χ &lt; 10⁻⁴ en la iteración {PARO.k}: aquí se pararía</p>
                    )}
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
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, minmax(0, 1fr))`, gap: 10, marginTop: 'auto' }}>
                {FASES.map((x, k) => (
                    <button key={x.n} onClick={() => saltar(k)} title={`ir a: ${x.n}`}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 16 : 14, lineHeight: 1.2,
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
                    del acuífero: allí hay 73 variables y 360 desigualdades (430 tal como las recibe trust-constr; lámina anterior), y no se pueden dibujar.</p>
                <h4>El algoritmo, paso a paso</h4>
                <ol>
                    <li><b>Holguras y barrera.</b> Cada desigualdad <InlineMath math="c_i(u)\ge0" /> se escribe <InlineMath math="c_i(u)=s_i" />,{' '}
                        <InlineMath math="s_i>0" />, y se minimiza <InlineMath math="\hat J(u)-\mu\sum_i\log s_i" />. La holgura{' '}
                        <InlineMath math="s_i" /> es el margen hasta el borde <InlineMath math="i" />; el logaritmo crece sin cota cuando{' '}
                        <InlineMath math="s_i\to0" />: empuja hacia adentro <Cita k="byrd1999interior" />.</li>
                    <li><b>Subproblema con igualdades.</b> Para μ fijo se resuelve con región de confianza SQP (Byrd–Omojokun): un paso
                        normal que reduce la violación y uno tangencial que baja el modelo cuadrático{' '}
                        <InlineMath math="m(p)=\nabla\hat J^\top p+\tfrac12p^\top Bp" /> por gradiente conjugado proyectado, con{' '}
                        <InlineMath math="\|p\|\le\Delta" /> y <InlineMath math="B" /> la Hessiana BFGS armada con diferencias de gradientes. La parte de
                        las holguras no es BFGS: es exacta, <InlineMath math="\mu/s_i^2" /> (o <InlineMath math="\lambda_i/s_i" />, que vale lo mismo en
                        el camino central).</li>
                    <li><b>Qué tan largo es el paso.</b> Lo fija el subproblema <InlineMath math="\min_p m(p)" /> con{' '}
                        <InlineMath math="\|p\|\le\Delta" />: si el mínimo del modelo cae dentro de la región, ese es el paso; si no, el paso
                        llega al borde de la región. La región no es un círculo en <InlineMath math="u" />: se mide en{' '}
                        <InlineMath math="(d_u,\,S^{-1}d_s)" />, con <InlineMath math="d_s=\nabla c\,d_u" />, es decir,{' '}
                        <InlineMath math="\|d_u\|^2+\sum_i(\nabla c_i\cdot d_u/s_i)^2\le\Delta^2" />: cuenta el cambio <i>relativo</i> de cada
                        holgura. En <InlineMath math="u_0" /> las holguras de <InlineMath math="u\ge0" /> valen {pp.holguras_x0[0]} y{' '}
                        {pp.holguras_x0[1]}: la región es la elipse de la fase 4 (semiejes {REG[0].semiejes[0].toFixed(3)} y{' '}
                        {REG[0].semiejes[1].toFixed(3)}), el primer paso mide {pp.norma.toFixed(3)} en <InlineMath math="u" /> y su norma escalada es{' '}
                        {pp.norma_escalada.toFixed(2)} = Δ₀: llega al borde. Además, ninguna holgura puede perder más del{' '}
                        {(100 * RG.tau).toFixed(1)} % en un paso (<InlineMath math={`s_i+d_{s,i}\\ge${(1 - RG.tau).toFixed(3)}\\,s_i`} />, fracción a la
                        frontera, <InlineMath math={`\\tau=${RG.tau}`} />); en la figura nunca actuó: la holgura que más bajó conservó el{' '}
                        {Math.round(100 * TC2D.frac_min)} %.</li>
                    <li><b>Aceptar o rechazar, y cambiar Δ.</b> <InlineMath math="\rho" /> = reducción real / reducción predicha de la función
                        de mérito (la función con barrera más una penalización de la violación). En SciPy {TC2D.scipy}:{' '}
                        <InlineMath math={`\\rho\\ge${RG.rho_grande}\\Rightarrow\\Delta\\leftarrow\\max(${RG.crece_grande}\\|d\\|,\\Delta)`} />;{' '}
                        <InlineMath math={`${RG.rho_medio}\\le\\rho<${RG.rho_grande}\\Rightarrow\\Delta\\leftarrow\\max(${RG.crece_medio}\\|d\\|,\\Delta)`} />;{' '}
                        <InlineMath math="\rho<10^{-8}" /> ⇒ paso rechazado y Δ multiplicado por un factor entre 0.1 y 0.5; en otro caso, Δ
                        igual. En la figura: <InlineMath math={`\\rho=${ITS[1].rho.toFixed(2)}`} /> (Δ: 1 → {fmtD(ITS[1].delta_nuevo)}),{' '}
                        <InlineMath math={`${ITS[2].rho.toFixed(2)}`} /> (→ {fmtD(ITS[2].delta_nuevo)}) y después entre{' '}
                        {Math.min(...ITS.filter(r => r.k > 3 && r.rho).map(r => r.rho)).toFixed(2)} y{' '}
                        {Math.max(...ITS.filter(r => r.k > 3 && r.rho).map(r => r.rho)).toFixed(2)}: <InlineMath math="\rho>1" /> significa que la
                        función bajó más de lo que predijo el modelo. Ningún paso fue rechazado. Cada vez que baja μ,{' '}
                        <InlineMath math={`\\Delta\\leftarrow\\max(\\Delta_0,${RG.delta_barrera}\\Delta)`} /> <Cita k="Nocedal2006" p="caps. 4 y 19" />.</li>
                    <li><b>Iterados admisibles.</b> Con <code>keep_feasible</code> la holgura de cada restricción se fija en{' '}
                        <InlineMath math="s_i=c_i(u)" />; si un punto de prueba viola alguna, <InlineMath math="\log s_i" /> no existe, la
                        función con barrera vale <InlineMath math="+\infty" />, <InlineMath math="\rho=-\infty" /> y el paso se rechaza. Así ningún
                        iterado sale de <InlineMath math="\mathcal U_{ad}" />.</li>
                    <li><b>Bajar la barrera.</b> Resuelto el subproblema (aproximadamente), <InlineMath math="\mu\leftarrow\mu/5" />. Los ◇
                        de la figura son el mínimo exacto de cada subproblema, <InlineMath math="\min_u\hat J(u)-\mu\sum_i\log c_i(u)" />, calculado
                        aparte para los mismos μ: forman el <i>camino central</i>, que termina en <InlineMath math="\hat u" /> cuando{' '}
                        <InlineMath math="\mu\to0" />. Los iterados van algo detrás de él al principio (cada subproblema se resuelve con una
                        tolerancia que también baja con μ) y lo alcanzan desde μ ≈ 10⁻⁴. En la figura: 11 pasos y 9 reducciones de μ
                        (0.1 → 2.6·10⁻⁷).</li>
                    <li><b>Parar.</b> Cuando <InlineMath math="\chi<10^{-4}" /> con el iterado admisible: aquí en la iteración {PARO.k} (χ = {sci(PARO.chi)}).</li>
                </ol>
                <h4>Por qué el paso se vuelve tangente al borde</h4>
                <p>En el camino central el gradiente de la función con barrera se anula:{' '}
                    <InlineMath math="\nabla\hat J(u)=\mu\sum_i\nabla c_i(u)/c_i(u)" />. Cerca de un lado, el término de ese lado domina y es
                    normal a él, así que la parte de <InlineMath math="\nabla\hat J" /> a lo largo del lado tiene que ser pequeña, y se anula
                    cuando <InlineMath math="\mu\to0" />. Fuera del camino central, la barrera añade al modelo una curvatura{' '}
                    <InlineMath math="\approx\mu\|\nabla c_1\|^2/c_1^2" /> en la dirección normal: el modelo se vuelve muy empinado hacia el
                    borde y casi plano a lo largo de él, y su mínimo queda casi sobre una paralela al lado. En la figura, en{' '}
                    <InlineMath math="u_5" />, <InlineMath math="-\nabla\hat J" /> forma {Math.round(angulo(I5))}° con el lado y el paso 5 → 6,{' '}
                    {Math.round(I6.angulo_lado)}°; los pasos siguientes forman entre{' '}
                    {Math.round(Math.min(...ITS.filter(r => r.k > 7 && r.angulo_lado !== undefined).map(r => r.angulo_lado)))}° y{' '}
                    {Math.round(Math.max(...ITS.filter(r => r.k > 7 && r.angulo_lado !== undefined).map(r => r.angulo_lado)))}°. Lo que se vuelve
                    tangente es el <i>paso</i>; el gradiente sigue apuntando hacia afuera, y en el óptimo es normal al lado activo.</p>
                <h4>Condiciones KKT</h4>
                <p>Con restricciones <InlineMath math="c_i(u)\ge0" />, un mínimo local <InlineMath math="\hat u" /> cumple (las
                    restricciones son lineales, así que no hace falta otra hipótesis de calificación):</p>
                <BlockMath math={eqKKT} />
                <p>Cada <InlineMath math="\lambda_i" /> es un multiplicador de Lagrange: cuánto bajaría <InlineMath math="\hat J" /> por unidad
                    de holgura añadida a la restricción <InlineMath math="i" />. El punto interior lo estima con{' '}
                    <InlineMath math="\lambda_i\approx\mu/s_i" />: en el camino central de la figura, <InlineMath math="\mu/c_1" /> ={' '}
                    {CC.slice(0, 5).map(c => c.mu_c1.toFixed(3)).join(', ')}, … → {OPT.lambda_lin[0].toFixed(4)}. La complementariedad <InlineMath math="\lambda_ic_i=0" /> dice que
                    solo las restricciones activas (<InlineMath math="c_i=0" />) tienen multiplicador. En la figura la activa es{' '}
                    <InlineMath math="u_1+u_2\le1.25" />, con <InlineMath math="a=(1,1)" />: <InlineMath math={`-\\nabla\\hat J(\\hat u)=(${(-OPT.g[0]).toFixed(3)},\\,${(-OPT.g[1]).toFixed(3)})=\\lambda a`} />{' '}
                    con <InlineMath math={`\\lambda=${OPT.lambda_lin[0].toFixed(4)}`} /> (el multiplicador que devuelve scipy). Geométricamente,
                    la curva de nivel es tangente al lado activo.</p>
                <h4>¿Por qué no se resuelve KKT directamente?</h4>
                <p>KKT sí describe el óptimo; lo difícil es resolverlo tal cual. Es un sistema no suave por la complementariedad: hay que
                    adivinar qué desigualdades están activas, y en el acuífero son 360 (cotas, tanque y ciclo de la bomba). Cada
                    evaluación de <InlineMath math="\nabla\hat J" /> cuesta una simulación directa y una adjunta, y no hay Hessiana exacta. El
                    punto interior resuelve un KKT perturbado, <InlineMath math="\lambda_is_i=\mu" /> en lugar de{' '}
                    <InlineMath math="\lambda_is_i=0" />, que es suave, y lleva <InlineMath math="\mu\to0" />: no adivina el conjunto activo,
                    lo descubre.</p>
                <h4>Por qué medir con χ y no con el criterio de scipy</h4>
                <p>El <code>gtol</code> de trust-constr estima los multiplicadores por mínimos cuadrados sin exigir <InlineMath math="\lambda\ge0" />.
                    Con más filas de restricción que variables (430 tal como se le pasan, frente a 73) ese residuo puede anularse lejos del óptimo. Ocurrió en una
                    corrida anterior (malla con conos, antes de refinar el eje del pozo): MRMT por bloques se detuvo en{' '}
                    <InlineMath math="z_p=-469" /> m, y sobre un segmento admisible hacia <InlineMath math="z_p=-419" /> m
                    su <InlineMath math="\hat J" /> todavía bajaba de 0.4735 a 0.4616. La medida χ no usa multiplicadores:{' '}
                    <InlineMath math="\chi(\hat u)=0" /> si y solo si <InlineMath math="\hat u" /> cumple KKT (conjunto poliédrico), y se
                    calcula con un problema cuadrático pequeño, sin simulaciones (lámina anterior) <Cita k="conn2000trust" />.</p>
                <h4>Criterio de paro en las corridas</h4>
                <p><InlineMath math="\chi<10^{-4}" /> con el iterado admisible, o, para no gastar semanas en la cola lenta de la
                    convergencia, tras al menos 50 iteraciones con <InlineMath math="\chi\le3\cdot10^{-3}" /> (la corrida principal por bloques sigue
                    ahora hasta 100 iteraciones sin ese criterio). En una validación sin nitrato (óptimo exacto conocido), <InlineMath math="\chi\approx2.8\cdot10^{-3}" /> correspondía a <InlineMath math="\hat J" /> a
                    0.8 % del exacto y a la profundidad exacta. Lo que se reporte con ese criterio se marca «sin KKT».</p>
            </Notas>
        </SlideLayout>
    );
}

A3R12.ecuaciones = ['criticidad'];

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 15, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 5, strokeLinejoin: 'round' };
const nota = { margin: '6px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
