import React, { useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from '../slides-avance3/ui.jsx';
import { usePublica } from '../slides-avance3/version.jsx';
import { POLIGONO, POZO, FUENTE, X, Z } from '../slides-avance3/escena.jsx';
import { useFases, reducida, suave, tramo, lerp } from '../slides-avance3/anim.js';
import { OPT } from '../slides-avance3/optimoNitrato.js';
import { ESQ as ESQ_A3 } from '../slides-avance3/esquema.js';
import { ESQ as ESQ_BLOQUE } from './esquemaBloque.js';
import { BLOQUE } from './optimoBloque.js';
import { CAMPOS } from './camposBloque.js';
import { tanque } from './bloque.js';

// Versión simplificada (26-nov-2026): copia de slides-avance3/A3D01.jsx con las mismas diez fases y la misma estética, pero
// más rápidas (RITMO): cada fase dura el 40 % de la original, para que sea una introducción breve al problema. Pluma y
// líneas de corriente del modelo MRMT por bloques en su último iterado (esquemaBloque.js: exportar_esquema_presentacion.py
// --modelo=mrmt_block); mapa, zona, capas y porosidad, los de esquema.js. Tanque y nitrato en el pozo del mismo iterado
// (optimoBloque.js, camposBloque.js). Mientras falte esquemaBloque.js se usa el de ADR de slides-avance3.
// Apertura: del mapa al problema de control, en diez fases que avanza el expositor (flechas o control remoto; clic en la
// figura = siguiente fase; clic en una etiqueta de abajo = ir a esa fase). Datos: estados de México y zona de Sabinas
// digitalizada de tesis/Figures/ubicacion.png (sondeos, traza del corte, poblados); capas y porosidad de los sondeos
// (funtions/get_phi.py); líneas de corriente y pluma de nitrato del simulador (FEniCSx, malla con eje de 1 m, ADR) sin
// bombeo y con el óptimo ADR; tanque y demanda de optimoNitrato.js (codigo/scripts/exportar_esquema_presentacion.py).
// Cada fase: d = texto de la versión completa, p = el corto de la pública.
const ESQ = ESQ_BLOQUE ? { ...ESQ_A3, corrientes: ESQ_BLOQUE.corrientes, pluma: ESQ_BLOQUE.pluma, fuente: ESQ_BLOQUE.fuente } : ESQ_A3;
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', GRIS = 'var(--a3-estrato)';

const RITMO = 0.4;
const FASES = [
    { n: 'Ubicación', dur: 2.4, p: <>acuífero de Sabinas, noreste de Coahuila</>,  d: <>el acuífero de estudio está en Sabinas, en el noreste de Coahuila</> },
    { n: 'Sondeos', dur: 3.2, p: <>seis sondeos eléctricos dan la porosidad de cada capa <Cita k="DanielRivas" /></>,  d: <>seis sondeos eléctricos midieron la conductividad del subsuelo a varias profundidades; de ella se estimó la porosidad efectiva de cada capa <Cita k="DanielRivas" /></> },
    { n: 'Traza del corte', dur: 3.2, p: <>cuatro sondeos casi alineados definen el corte</>,  d: <>cuatro sondeos están casi alineados: se proyectan sobre la recta roja, que será la traza del corte</> },
    { n: 'Corte vertical', dur: 4, p: <>corte vertical de 9.9 km con las capas medidas</>,  d: <>si las propiedades no cambian en la dirección transversal, basta un corte vertical de 9.9 km entre los sondeos extremos, con las capas que midió cada sondeo</> },
    { n: 'Porosidad', dur: 2.6, p: <>porosidad <InlineMath math="\phi" /> interpolada; de ella, la conductividad <InlineMath math="\mathbf K" /></>,  d: <>la porosidad <InlineMath math="\phi" /> de las capas se interpola a todo el corte; de ella sale la conductividad <InlineMath math="\mathbf K" /> <Cita k="Kozeny-Carman" /></> },
    { n: 'Flujo', dur: 2.6, p: <>el agua entra por el noreste y sale libre por el suroeste</>,  d: <>el agua entra por el noreste y sale libre por el suroeste; corre más rápido donde <InlineMath math="\phi" /> y <InlineMath math="\mathbf K" /> son altas</> },
    { n: 'Derrame', dur: 8.5, p: <>la pluma de nitrato avanza 30 días; guía: 50 mg/L <Cita k="oms2022" /></>,  d: <>una fuente de nitrato dejó una pluma (estado inicial del modelo); en 30 días el agua la arrastra, la dispersa y se degrada; el valor guía es 50 mg/L <Cita k="oms2022" /></> },
    { n: 'Pozo', dur: 8.5, p: <>el pozo bombea <InlineMath math="Q(t)" /> a la profundidad <InlineMath math="z_p" /> y capta nitrato</>,  d: <>el pozo bombea <InlineMath math="Q(t)" /> a la profundidad <InlineMath math="z_p" />: desvía el flujo y capta parte del nitrato</> },
    { n: 'Abastecimiento', dur: 8.5, p: <>el tanque entrega 1 000 m³ diarios a la población y al riego</>,  d: <>lo bombeado entra a un tanque de 2 000 m³ que entrega 1 000 m³ al día a la población y al riego</> },
    { n: 'La pregunta', dur: 1.6, d: <>¿cómo operar el pozo?</> },
].map(f => ({ ...f, dur: f.dur * RITMO }));
const [UBI, SON, TRAZA, CORTE, PHI, FLUJO, DERRAME, POZOF, TANQUE, PREG] = FASES.map((_, i) => i);

// Entrada con rebote (sale un poco de más y regresa): sondeos que «brotan» en el mapa. x en [0, 1].
const rebote = x => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2));

// ── Mapa de México (unidades de 1/10 de grado) y zona de Sabinas (unidades de escena, 9.939 m, origen en el pie del
// sondeo 6 sobre la recta, y hacia abajo). La zona se gira THETA para que la recta quede horizontal: es la superficie
// del corte, con el sondeo 6 (suroeste) a la izquierda y el 2 (noreste) a la derecha.
const MAPA = ESQ.mapa, ZONA = ESQ.zona, M_UNI = 9.939;
const zl = (e, nn) => [e / M_UNI, -nn / M_UNI];
const PIE6 = zl(...ZONA.sondeos.find(s => s.n === 6).pie);
const rel = ([x, y]) => [x - PIE6[0], y - PIE6[1]];
const [R0, R1] = ZONA.recta.map(p => rel(zl(p[0], p[1])));
const THETA = -Math.atan2(R0[1] - R1[1], R0[0] - R1[0]) * 180 / Math.PI;
const SONDEOS = ZONA.sondeos.map(s => ({ ...s, p: rel(zl(s.e, s.nn)), pie: s.pie ? rel(zl(...s.pie)) : null }));
const POBLADOS = ZONA.poblados.map(p => ({ ...p, p: rel(zl(p.e, p.nn)) }));
const BB = (() => {
    const pts = [...SONDEOS.map(s => s.p), ...POBLADOS.map(p => p.p), R0, R1];
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    return { x0: Math.min(...xs) - 60, x1: Math.max(...xs) + 60, y0: Math.min(...ys) - 60, y1: Math.max(...ys) + 60 };
})();
const S0 = Math.min(660 / (BB.x1 - BB.x0), 400 / (BB.y1 - BB.y0));
const T0 = [670 - S0 * (BB.x0 + BB.x1) / 2, 100 - S0 * (BB.y0 + BB.y1) / 2];
const MX_GRANDE = { x: 520 - 2.1 * MAPA.ancho / 2, y: -104, s: 2.1 }, MX_CHICO = { x: -12, y: -100, s: 1.0 };
const COAHUILA = MAPA.estados.find(e => e.id === 'MX-COA');
const POZOS_X = [...new Set(ESQ.capas.map(c => c.x))];

const opt = { Q: BLOQUE.Q, S: tanque(BLOQUE.Q) };
const ZP = ESQ.fuente.zp;
const NT = opt.Q.length;                                       // 72 intervalos de 10 h
const DT_H = OPT.dt / 3600;
const C_POZO = CAMPOS.optimo ? CAMPOS.optimo.Cpozo : BLOQUE.Q.map(() => 0);   // mg/L, ∫δ_p C_m con el mismo Q y z_p
const Q_MAX = Math.max(...opt.Q);
const CUADROS = ESQ.pluma.sin.length;

// Partículas sobre una línea de corriente: la posición sigue el tiempo de viaje real (rápidas donde v es grande);
// el periodo de cada línea se comprime con una potencia para que todas se vean moverse.
const T_REF = (() => {
    const T = ESQ.corrientes.sin.map(c => c.t[c.t.length - 1]).sort((a, b) => a - b);
    return T[Math.floor(T.length / 2)];
})();
function particulas(c, tau, n = 3) {
    const T = c.t[c.t.length - 1], per = Math.min(14, Math.max(3, 6 * Math.pow(T / T_REF, 0.35)));
    const out = [];
    for (let k = 0; k < n; k++) {
        const f = ((tau / per + k / n) % 1 + 1) % 1, objetivo = f * T;
        let a = 0, b = c.t.length - 1;
        while (b - a > 1) { const m = (a + b) >> 1; if (c.t[m] <= objetivo) a = m; else b = m; }
        const w = c.t[b] > c.t[a] ? (objetivo - c.t[a]) / (c.t[b] - c.t[a]) : 0;
        out.push([lerp(c.p[2 * a], c.p[2 * b], w), lerp(c.p[2 * a + 1], c.p[2 * b + 1], w), f]);
    }
    return out;
}
const ruta = c => 'M' + c.p.reduce((acc, v, i) => acc + (i % 2 ? `,${v}` : `${i ? ' L' : ''}${v}`), '');
const RUTAS = { sin: ESQ.corrientes.sin.map(ruta), con: ESQ.corrientes.con.map(ruta) };

function Corrientes({ tipo, op, revela, tau }) {
    if (op <= 0) return null;
    return (
        <g opacity={op}>
            {RUTAS[tipo].map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--sl-muted)" strokeWidth="1.3" strokeOpacity="0.7"
                      pathLength="1" strokeDasharray={`${revela} 1`} />
            ))}
            {tau > 0 && ESQ.corrientes[tipo].map((c, i) => particulas(c, tau).map(([x, y, f], k) => (
                <circle key={`${i}-${k}`} cx={x} cy={y} r="3.4" fill={AGUA} opacity={Math.min(1, 6 * f, 6 * (1 - f))} />
            )))}
        </g>
    );
}

function Pluma({ cuadro, tipo, op }) {
    if (op <= 0 || cuadro < 0) return null;
    const [ligera, fuerte] = ESQ.pluma[tipo][Math.min(CUADROS - 1, cuadro)];
    return (
        <g opacity={op}>
            <path d={ligera} fill={PLUMA} fillOpacity="0.3" />
            <path d={fuerte} fill={PLUMA} fillOpacity="0.85" />
        </g>
    );
}

// Tanque, tubería y población sobre la superficie (y < 0 en la escena), con S_n, V_s Q_n y d_n del último iterado.
function Superficie({ op, n }) {
    if (op <= 0) return null;
    const S = opt.S[n], q = OPT.V_s * opt.Q[Math.min(n, NT - 1)] * 3600, d = OPT.demanda[Math.min(n, NT - 1)] / DT_H;
    const xt = 330, wt = 50, ht = 74, yb = -6, nivel = S / OPT.S_max;
    const ancho = v => 1.5 + 7 * v / 90;
    const sx = k => 640 + k / NT * 150, sy = v => -14 - v / OPT.S_max * 70;
    const casa = x => `${x},-6 ${x},-22 ${x + 9},-31 ${x + 18},-22 ${x + 18},-6`;
    const xs = 504;                                  // columna de los valores
    return (
        <g opacity={op} style={{ fontFamily: 'var(--a3-sans)', fontSize: 15, fill: 'var(--sl-muted)' }}>
            {/* tubería del pozo al tanque, más gruesa cuanto más se bombea */}
            <polyline points={`${X(POZO.x)},0 ${X(POZO.x)},-22 ${xt},-22`} fill="none" stroke={AGUA} strokeWidth={ancho(q)} />
            <rect x={xt} y={yb - ht} width={wt} height={ht} fill="none" stroke="var(--sl-text)" strokeWidth="1.6" />
            <rect x={xt + 1.5} y={yb - ht * nivel} width={wt - 3} height={ht * nivel} fill={AGUA} fillOpacity="0.55" />
            <text x={xt + wt / 2} y={yb - ht - 8} textAnchor="middle">tanque</text>
            {/* entrega a la población */}
            <line x1={xt + wt} y1={-14} x2={412} y2={-14} stroke={PLUMA} strokeWidth={ancho(d)} />
            <polygon points="412,-20 422,-14 412,-8" fill={PLUMA} />
            {[428, 450, 472].map(x => <polygon key={x} points={casa(x)} fill="none" stroke="var(--sl-text)" strokeWidth="1.4" />)}
            <text x={xs} y={-72} style={{ fill: 'var(--sl-text)' }}>S = {Math.round(S).toLocaleString('es-MX')} m³</text>
            <text x={xs} y={-50} style={{ fill: AGUA }}>bombeo {Math.round(q)} m³/h</text>
            <text x={xs} y={-28} style={{ fill: PLUMA }}>demanda {Math.round(d)} m³/h</text>
            {/* S(t) en [0, S_max] hasta el instante actual */}
            <line x1={sx(0)} x2={sx(NT)} y1={sy(0)} y2={sy(0)} stroke={GRIS} strokeDasharray="3 3" />
            <line x1={sx(0)} x2={sx(NT)} y1={sy(OPT.S_max)} y2={sy(OPT.S_max)} stroke={GRIS} strokeDasharray="3 3" />
            <text x={sx(0) - 6} y={sy(0) + 5} textAnchor="end">0</text>
            <text x={sx(0) - 6} y={sy(OPT.S_max) + 5} textAnchor="end">S<tspan dy="4" fontSize="11">max</tspan></text>
            <text x={sx(NT) + 6} y={sy(OPT.S_max / 2) + 5}>S(t)</text>
            <polyline points={opt.S.slice(0, n + 1).map((v, k) => `${sx(k)},${sy(v)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2.2" />
        </g>
    );
}

// `onda`: fase (0 → 1, cíclica) del pulso que señala Sabinas mientras se presenta; null = sin pulso.
function MapaMexico({ p1, p0, onda }) {
    const g = suave(tramo(p1, 0, 0.45));
    const m = { x: lerp(MX_GRANDE.x, MX_CHICO.x, g), y: lerp(MX_GRANDE.y, MX_CHICO.y, g), s: lerp(MX_GRANDE.s, MX_CHICO.s, g) };
    const estados = useMemo(() => MAPA.estados.filter(e => e.id !== 'MX-COA').map(e => (
        <path key={e.id} d={e.d} fill="var(--sl-text)" fillOpacity="0.06" stroke="var(--sl-muted)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
    )), []);
    const [sx, sy] = MAPA.sabinas, k = 1 / m.s;
    return (
        <g transform={`translate(${m.x},${m.y}) scale(${m.s})`}>
            {estados}
            <path d={COAHUILA.d} fill={AGUA} fillOpacity={0.08 + 0.4 * suave(tramo(p0, 0.15, 0.55))} stroke={AGUA} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            <g opacity={tramo(p0, 0.5, 0.8)}>
                {onda !== null && <circle cx={sx} cy={sy} r={(5 + 16 * onda) * k} fill="none" stroke={PLUMA} strokeWidth="1.8"
                                          vectorEffect="non-scaling-stroke" strokeOpacity={(1 - onda) * (1 - g)} />}
                <circle cx={sx} cy={sy} r={4 * k} fill={PLUMA} />
                <text x={sx + 6 * k} y={sy - 6 * k} style={{ ...etq, fontSize: 17 * k, fill: 'var(--sl-text)' }}>Sabinas</text>
                <text x={sx - 34 * k} y={sy + 30 * k} style={{ ...etq, fontSize: 15 * k, fill: AGUA }} opacity={1 - g}>Coahuila</text>
            </g>
            <g style={{ ...etq, fontSize: 14 * k }} opacity={1 - g}>
                <text x={52} y={8}>EE. UU.</text>
                <text x={212} y={108}>Golfo de México</text>
                <text x={40} y={150}>Océano Pacífico</text>
            </g>
        </g>
    );
}

// Zona de Sabinas: poblados, sondeos, traza del corte y proyección sobre ella; en la fase 4 gira y crece hasta ser la
// superficie del corte.
function Zona({ P }) {
    const p1 = P(SON), p2 = P(TRAZA), p3 = P(CORTE);
    if (p1 <= 0 || p3 >= 1) return null;
    const g = suave(tramo(p3, 0.15, 0.7)), s = lerp(S0, 1, g);
    const T = [lerp(T0[0], 0, g), lerp(T0[1], 0, g)], th = lerp(0, THETA, g), k = 1 / s;
    const aparece = tramo(p1, 0.3, 0.8), extras = 1 - tramo(p3, 0, 0.25);
    const recta = suave(tramo(p2, 0.05, 0.4)), proy = suave(tramo(p2, 0.45, 0.85));
    const marcas = 1 - tramo(p3, 0.75, 0.95);
    // cuña de acercamiento desde Sabinas en el mapa chico hasta el marco de la zona
    const sab = [MX_CHICO.x + MX_CHICO.s * MAPA.sabinas[0], MX_CHICO.y + MX_CHICO.s * MAPA.sabinas[1]];
    const esq = [[T0[0] + S0 * BB.x0, T0[1] + S0 * BB.y0], [T0[0] + S0 * BB.x0, T0[1] + S0 * BB.y1]];
    const km2 = 2000 / M_UNI;
    return (
        <g opacity={aparece}>
            <g opacity={extras}>
                {esq.map((q, i) => <line key={i} x1={sab[0]} y1={sab[1]} x2={q[0]} y2={q[1]} stroke={GRIS} strokeOpacity="0.5" strokeDasharray="4 4" />)}
            </g>
            <g transform={`translate(${T[0]},${T[1]}) rotate(${th}) scale(${s})`}>
                <g opacity={extras}>
                    <rect x={BB.x0} y={BB.y0} width={BB.x1 - BB.x0} height={BB.y1 - BB.y0} rx={12 * k} fill="var(--sl-text)" fillOpacity="0.04"
                          stroke="var(--sl-muted)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    {POBLADOS.map(q => (
                        <g key={q.n}>
                            <rect x={q.p[0] - 5 * k} y={q.p[1] - 5 * k} width={10 * k} height={10 * k} fill="var(--sl-muted)" />
                            <text x={q.p[0] + (q.n === 'Agujita' ? -9 : 9) * k} y={q.p[1] + 5 * k} textAnchor={q.n === 'Agujita' ? 'end' : 'start'}
                                  style={{ ...etq, fontSize: 16 * k }}>{q.n}</text>
                        </g>
                    ))}
                    {/* escala y norte */}
                    <line x1={BB.x0 + 40 * k} x2={BB.x0 + 40 * k + km2} y1={BB.y1 - 30 * k} y2={BB.y1 - 30 * k} stroke="var(--sl-text)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    <text x={BB.x0 + 40 * k + km2 / 2} y={BB.y1 - 40 * k} textAnchor="middle" style={{ ...etq, fontSize: 14 * k }}>2 km</text>
                    <text x={BB.x1 - 34 * k} y={BB.y1 - 64 * k} textAnchor="middle" style={{ ...etq, fontSize: 18 * k, fill: 'var(--sl-text)' }}>N</text>
                    <line x1={BB.x1 - 34 * k} x2={BB.x1 - 34 * k} y1={BB.y1 - 24 * k} y2={BB.y1 - 52 * k} stroke="var(--sl-text)" strokeWidth="2" vectorEffect="non-scaling-stroke" markerEnd="url(#d01-flecha)" />
                </g>
                {/* traza del corte */}
                <line x1={R1[0]} y1={R1[1]} x2={R0[0]} y2={R0[1]} stroke={PLUMA} strokeWidth="3.5" vectorEffect="non-scaling-stroke"
                      pathLength="1" strokeDasharray={`${recta} 1`} />
                {SONDEOS.map((q, i) => {
                    const dest = q.alineado ? q.pie : q.p, pos = [lerp(q.p[0], dest[0], proy), lerp(q.p[1], dest[1], proy)];
                    const op = (q.alineado ? 1 : 1 - 0.7 * tramo(p2, 0.05, 0.3)) * (q.alineado ? marcas : extras);
                    const brota = tramo(p1, 0.35 + 0.08 * i, 0.5 + 0.08 * i);       // cada sondeo brota con rebote, uno tras otro
                    return (
                        <g key={q.n} opacity={op * Math.min(1, 2 * brota)}>
                            {q.alineado && p2 > 0.35 && <line x1={q.p[0]} y1={q.p[1]} x2={q.pie[0]} y2={q.pie[1]} stroke={GRIS} strokeDasharray="5 4"
                                                             strokeWidth="1.4" vectorEffect="non-scaling-stroke" opacity={extras} />}
                            <circle cx={pos[0]} cy={pos[1]} r={11 * k * rebote(brota)} fill={q.alineado && p2 > 0.05 ? AGUA : 'var(--sl-muted)'} />
                            <text x={pos[0]} y={pos[1] + 5 * k} textAnchor="middle" transform={`rotate(${-th} ${pos[0]} ${pos[1]})`}
                                  style={{ fontFamily: 'var(--a3-sans)', fontSize: 14 * k, fill: '#fff', fontWeight: 600 }}>{q.n}</text>
                        </g>
                    );
                })}
            </g>
        </g>
    );
}

function Escena({ fase, l, w }) {
    const P = k => (fase > k ? 1 : fase < k ? 0 : l / FASES[k].dur);
    const p0 = P(UBI), p1 = P(SON), p3 = P(CORTE), p4 = P(PHI), p5 = P(FLUJO), p6 = P(DERRAME), p7 = P(POZOF), p8 = P(TANQUE), p9 = P(PREG);
    // Lo que pasa a segundo plano al entrar a la fase siguiente se atenúa en el primer tramo de esa fase (antes saltaba).
    const atenua = (p, hasta) => lerp(1, hasta, suave(tramo(p, 0, 0.3)));
    // corte vertical: crece desde la superficie; capas de los sondeos
    const crece = suave(tramo(p3, 0.65, 1)), seccion = fase >= CORTE ? crece : 0;
    const capas = tramo(p3, 0.75, 1) * atenua(p5, 0.35);
    // porosidad: las bandas entran escalonadas, de la menor a la mayor φ
    const phi = atenua(p5, 0.45), nb = ESQ.phi.bandas.length;
    const banda = i => tramo(p4, 0.55 * i / Math.max(1, nb - 1), 0.55 * i / Math.max(1, nb - 1) + 0.45);
    // flujo
    const revela = suave(tramo(p5, 0.05, 0.8)), tau = fase >= FLUJO ? w : 0, corr = atenua(p6, 0.55);
    // derrame (Q = 0): fuente, la pluma inicial se descubre desde la fuente y luego 30 días
    const fuente = tramo(p6, 0, 0.06), descubre = suave(tramo(p6, 0.06, 0.22)), dia3 = tramo(p6, 0.25, 1);
    // pozo y tanque: 30 días con el último iterado del modelo por bloques; al entrar a la fase del tanque se repiten junto con S(t)
    const pozo = suave(tramo(p7, 0, 0.12)), cambio = tramo(p7, 0.12, 0.22), dia4 = tramo(p7, 0.25, 1), dia5 = tramo(p8, 0.2, 1);
    const enPozo = fase > POZOF || (fase === POZOF && p7 >= 0.25);
    const diaCon = fase >= TANQUE ? dia5 : dia4;
    const opCon = !enPozo ? 0 : fase < TANQUE ? 1 : p8 < 0.1 ? 1 - tramo(p8, 0, 0.1) : tramo(p8, 0.1, 0.2);
    const cuadroSin = fase < DERRAME ? -1 : Math.floor(dia3 * (CUADROS - 0.01));
    const cuadroCon = Math.floor(diaCon * (CUADROS - 0.01));
    const n = Math.min(NT - 1, Math.floor(diaCon * NT));
    const reloj = (fase === DERRAME && p6 >= 0.25) || (fase === POZOF && p7 >= 0.25) || (fase === TANQUE && p8 >= 0.2);
    const dias = (fase === DERRAME ? dia3 : diaCon) * NT * DT_H / 24;
    const zp = lerp(250.5, ZP, pozo), cp = C_POZO[n], qn = enPozo ? opt.Q[n] / Q_MAX : 0;
    const bandasPhi = useMemo(() => ESQ.phi.bandas.map((d, i) => <path key={i} d={d} fill={AGUA} fillOpacity={0.05 + 0.13 * i} />), []);
    // pulso sobre Sabinas mientras se ubica (sin él con prefers-reduced-motion)
    const onda = fase <= SON && !reducida() ? (w * 0.9) % 1 : null;
    return (
        <svg viewBox="-20 -112 1040 438" style={{ width: '100%', display: 'block' }}>
            <defs>
                <clipPath id="d01-clip"><polygon points={POLIGONO} /></clipPath>
                <clipPath id="d01-crece"><rect x={-30} y={-5} width={1100} height={340 * seccion + 5} /></clipPath>
                <clipPath id="d01-descubre"><rect x={lerp(X(FUENTE.x) + 25, -20, descubre)} y={-20} width={1100} height={340} /></clipPath>
                <marker id="d01-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="var(--sl-text)" />
                </marker>
            </defs>

            {fase <= CORTE && <g opacity={1 - tramo(p3, 0, 0.25)}><MapaMexico p0={p0} p1={p1} onda={onda} /></g>}
            <Zona P={P} />

            {seccion > 0 && (
                <g clipPath="url(#d01-crece)">
                    <polygon points={POLIGONO} fill="var(--sl-text)" fillOpacity="0.03" />
                    <g clipPath="url(#d01-clip)">
                        <g opacity={phi}>{bandasPhi.map((b, i) => <g key={i} opacity={banda(i)}>{b}</g>)}</g>
                        <Corrientes tipo="sin" op={p5 > 0 ? corr * (1 - cambio) : 0} revela={revela} tau={tau} />
                        <Corrientes tipo="con" op={corr * cambio} revela={1} tau={tau} />
                        <g clipPath={descubre < 1 ? 'url(#d01-descubre)' : undefined}>
                            <Pluma cuadro={cuadroSin} tipo="sin" op={fase === DERRAME ? 1 : fase === POZOF ? 1 - tramo(p7, 0.12, 0.2) : 0} />
                        </g>
                        <Pluma cuadro={cuadroCon} tipo="con" op={opCon} />
                    </g>
                    <polygon points={POLIGONO} fill="none" stroke="var(--sl-text)" strokeWidth="1.6" />
                    {/* sondeos en el corte: capas A–E con su porosidad (dentro del dominio) */}
                    <g opacity={capas} clipPath="url(#d01-clip)">
                        {ESQ.capas.map((c, i) => (
                            <line key={i} x1={Math.min(995, Math.max(5, c.x))} x2={Math.min(995, Math.max(5, c.x))} y1={c.z0} y2={c.z1}
                                  stroke={AGUA} strokeOpacity={0.15 + 0.85 * c.phi} strokeWidth="10" />
                        ))}
                    </g>
                </g>
            )}
            <g opacity={seccion > 0 ? capas : 0}>
                {POZOS_X.map(x => (
                    <text key={x} x={Math.min(995, Math.max(5, x))} y={-8} textAnchor={x < 50 ? 'start' : x > 950 ? 'end' : 'middle'}
                          style={{ ...etq, fontSize: 15, fill: AGUA, fontWeight: 600 }}>
                        sondeo {[6, 4, 3, 2][[...POZOS_X].sort((a, b) => a - b).indexOf(x)]}
                    </text>
                ))}
            </g>

            {/* fuente de nitrato */}
            {fuente > 0 && (
                <g opacity={fuente}>
                    <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r={7 + 10 * ((w * 0.8) % 1)} fill="none" stroke={PLUMA} strokeOpacity={1 - ((w * 0.8) % 1)} strokeWidth="2" />
                    <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r="7" fill={PLUMA} />
                    <text x={X(FUENTE.x) - 14} y={Z(FUENTE.z) + 30} textAnchor="end" style={{ ...etq, ...halo, fill: PLUMA }}>derrame de nitrato</text>
                </g>
            )}

            {/* pozo de bombeo con anillos proporcionales a Q(t) y el nitrato que capta */}
            {fase >= POZOF && pozo > 0 && (
                <g>
                    <line x1={X(POZO.x)} y1={0} x2={X(POZO.x)} y2={Z(zp)} stroke={AGUA} strokeWidth="4" />
                    {qn > 0.02 && [0, 0.5].map(o => {
                        const f = (w * 1.1 + o) % 1;
                        return <circle key={o} cx={X(POZO.x)} cy={Z(zp)} r={8 + 26 * qn * f} fill="none" stroke={AGUA} strokeWidth="1.6" strokeOpacity={1 - f} />;
                    })}
                    <circle cx={X(POZO.x)} cy={Z(zp)} r="7" fill={enPozo && cp > 1 ? PLUMA : AGUA} fillOpacity={enPozo ? 0.4 + 0.6 * Math.min(1, cp / 20) : 1} />
                    <text x={X(POZO.x) + 14} y={Z(zp) + 6} style={{ ...etq, ...halo }} opacity={tramo(p7, 0.1, 0.16) + (fase > POZOF ? 1 : 0)}>
                        pozo, z<tspan dy="5" fontSize="12">p</tspan><tspan dy="-5"> = {String(Math.round(ZP)).replace('-', '−')} m</tspan>
                    </text>
                    {enPozo && (
                        <text x={X(POZO.x) + 14} y={Z(zp) + 28} style={{ ...etq, ...halo, fill: PLUMA }}>
                            nitrato en el pozo: {cp.toFixed(1)} mg/L <tspan style={{ fill: 'var(--sl-muted)' }}>(guía OMS 50)</tspan>
                        </text>
                    )}
                </g>
            )}

            <Superficie op={fase >= TANQUE ? tramo(p8, 0, 0.12) : 0} n={n} />

            {/* leyendas, reloj y orientación */}
            <g style={etq}>
                <g opacity={fase < CORTE ? 0 : fase <= PHI ? Math.max(capas, p4) : 1 - tramo(p5, 0, 0.25)}>
                    <text x={830} y={-80}>porosidad φ</text>
                    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={830 + 34 * i} y={-70} width={34} height={14} fill={AGUA} fillOpacity={0.05 + 0.13 * i} stroke="var(--sl-muted)" strokeWidth="0.5"
                                                    opacity={fase === PHI ? tramo(p4, 0.12 * i, 0.12 * i + 0.45) : 1} />)}
                    {[0, 0.4, 0.8].map((v, i) => <text key={v} x={830 + 68 * i} y={-40} textAnchor="middle" fontSize="13">{v}</text>)}
                    <text x={1000} y={-40} textAnchor="end" fontSize="13">1</text>
                </g>
                <g opacity={fase < DERRAME ? 0 : tramo(p6, 0, 0.1) * (1 - p9)}>
                    <rect x={830} y={-76} width={16} height={12} fill={PLUMA} fillOpacity="0.3" />
                    <text x={852} y={-66} fontSize="14">nitrato &gt; 10 mg/L</text>
                    <rect x={830} y={-56} width={16} height={12} fill={PLUMA} fillOpacity="0.85" />
                    <text x={852} y={-46} fontSize="14">&gt; 50 mg/L (guía OMS)</text>
                </g>
                {reloj && <text x={1000} y={-92} textAnchor="end" style={{ ...etq, fontSize: 17, fill: 'var(--sl-text)' }}>día {Math.round(dias)}</text>}
                <g opacity={seccion}>
                    <text x={2} y={318} style={{ ...etq, fontSize: 15, fill: 'var(--sl-text)' }}>SO</text>
                    <text x={998} y={318} textAnchor="end" style={{ ...etq, fontSize: 15, fill: 'var(--sl-text)' }}>NE</text>
                    {fase >= FLUJO && <text x={998} y={Z(-300)} textAnchor="end" opacity={tramo(p5, 0.15, 0.4)}>entrada →</text>}
                    {fase >= FLUJO && <text x={6} y={Z(-1200)} opacity={tramo(p5, 0.35, 0.6)}>← salida libre</text>}
                    <text x={500} y={318} textAnchor="middle" fontSize="13">9.9 km; sin exageración vertical</text>
                </g>
            </g>
        </svg>
    );
}

// Barra de fases. Cada columna mide al menos lo que su nombre (minmax(max-content, 1fr)) y el nombre va en un solo
// renglón: todas las barras quedan a la misma altura aunque cambie la letra (pública/completa). El nombre reserva el
// ancho de su versión en negrita (copia invisible), así las columnas no se mueven al cambiar de fase. Hechas: llenas;
// la actual se llena con una cabeza que late y se apaga al terminar; al saltar, las demás se llenan o vacían en 0.35 s.
function Progreso({ fase, l, w, saltar, pub }) {
    const late = reducida() ? 0 : 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.1 * w);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, minmax(max-content, 1fr))`, columnGap: 10,
                      alignItems: 'start', marginTop: 8 }}>
            {FASES.map((f, k) => {
                const actual = k === fase, hecho = k < fase ? 1 : k > fase ? 0 : l / f.dur;
                const cabeza = actual ? 1 - tramo(l, f.dur - 0.25, f.dur) : 0;
                return (
                    <button key={f.n} onClick={() => saltar(k)} title={`ir a: ${f.n}`}
                            style={{ all: 'unset', display: 'block', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 16 : 14,
                                     lineHeight: 1.25, whiteSpace: 'nowrap', transition: 'color 0.3s',
                                     color: actual ? AGUA : k < fase ? 'var(--sl-text)' : 'var(--sl-muted)' }}>
                        <span style={{ position: 'relative', display: 'block', height: 4, borderRadius: 2, marginBottom: 7,
                                       background: 'var(--a3-filete, #C9D3DB)' }}>
                            <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${100 * hecho}%`, borderRadius: 2,
                                           background: AGUA, transition: actual ? 'none' : 'width 0.35s ease-out' }} />
                            {cabeza > 0 && (
                                <span style={{ position: 'absolute', left: `${100 * hecho}%`, top: 2, width: 10, height: 10, margin: '-5px 0 0 -5px',
                                               borderRadius: '50%', background: AGUA, opacity: cabeza,
                                               boxShadow: `0 0 0 ${2 + 4 * late}px color-mix(in srgb, ${AGUA} ${Math.round(35 - 20 * late)}%, transparent)` }} />
                            )}
                        </span>
                        <span style={{ display: 'inline-grid' }}>
                            <span aria-hidden="true" style={{ gridArea: '1 / 1', fontWeight: 600, visibility: 'hidden' }}>{k + 1} {f.n}</span>
                            <span style={{ gridArea: '1 / 1', fontWeight: actual ? 600 : 400 }}>
                                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{k + 1}</span> {f.n}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

const PREGUNTA = String.raw`\min_{Q(t),\;z_p}\ \hat J=\gamma\,J_m+\alpha\,J_{\rm inst}+\beta\,J_{\rm op}`;
const SUJETO = String.raw`\text{s.a.}\ \ \text{flujo y transporte},\quad 0\le Q(t)\le\overline Q(t),\quad z_{\min}\le z_p\le z_{\max},\quad 0\le S(t)\le S_{\max}`;

export default function A3R01({ theme = 'dark', entrada = 1 }) {
    const { fase, l, w, ir } = useFases(FASES.map(f => f.dur), entrada < 0);
    const q = fase === PREG ? suave(l / FASES[PREG].dur) : 0;
    const entra = suave(tramo(l, 0, 0.4));
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    return (
        <SlideLayout title="Del acuífero de Sabinas a la pregunta de la tesis" theme={theme} justify="flex-start">
            {/* el texto de cada fase entra subiendo y aclarándose; alto fijo de dos renglones para que la figura no salte */}
            <p style={{ margin: '0 0 2px', minHeight: '2.7em', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35,
                        opacity: (1 - q) * lerp(0.15, 1, entra), transform: `translateY(${(1 - entra) * 8}px)` }}>
                <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: AGUA, fontWeight: 600, marginRight: 12 }}>
                    {fase + 1} · {FASES[fase].n}
                </span>
                {pub && FASES[fase].p ? FASES[fase].p : FASES[fase].d}
            </p>
            <div style={{ position: 'relative' }}>
                <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase"
                     style={{ cursor: 'pointer', opacity: 1 - 0.8 * q }}>
                    <Escena fase={fase} l={l} w={w} />
                </div>
                {q > 0 && (
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) translateY(${(1 - q) * 14}px)`,
                                  opacity: q, width: '88%', padding: '18px 28px', background: 'var(--sl-bg)', borderLeft: `5px solid ${AGUA}`,
                                  boxShadow: '0 6px 28px rgba(0,0,0,0.18)' }}>
                        <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', lineHeight: 1.3 }}>
                            ¿Cómo bombear a lo largo del tiempo y a qué profundidad, para captar el menor nitrato posible
                            al menor costo, sin vaciar ni desbordar el tanque?
                        </p>
                        <BlockMath math={PREGUNTA} />
                        <div className="a3-ec--compacta"><BlockMath math={SUJETO} /></div>
                        <p style={{ margin: '2px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                            <InlineMath math="J_m" />: calidad del agua extraída · <InlineMath math="J_{\rm inst}" />: profundidad de instalación ·{' '}
                            <InlineMath math="J_{\rm op}" />: costo de bombeo · tanque <InlineMath math="S(t)=S_0+V_s\int_0^t Q\,ds-\int_0^t d\,ds" />
                        </p>
                    </div>
                )}
            </div>
            <Progreso fase={fase} l={l} w={w} saltar={saltar} pub={pub} />
        </SlideLayout>
    );
}

const etq = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 4, strokeLinejoin: 'round' };
