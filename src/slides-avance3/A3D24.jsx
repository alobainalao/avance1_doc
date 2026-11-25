import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useFases, reducida, suave, tramo } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica, Notas } from './version.jsx';

// Qué es un frente de Pareto, en seis fases que avanza el expositor: dos objetivos en conflicto, diseños posibles,
// dominancia, frente, pesos (suma ponderada con γ) y el caso del pozo. Las fases 1–5 son un esquema (curva y nube
// inventadas, rotuladas como tales). En la 6 el esquema se va y su lugar lo ocupa, entero, el barrido real de ADR con
// caudal fijo (OPT.pareto, experimentos/barrido_zp.py), preliminar: nunca se ven las dos gráficas a la vez. Sobre los
// datos reales el frente son los diseños no dominados unidos por segmentos rectos, no un ajuste.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';

// Lienzo común a las dos gráficas (mismos ejes: J_m a la derecha, costo hacia arriba). Arriba queda una franja para el
// rótulo que dice qué se está viendo (esquema o barrido real).
const W = 720, H = 490, L = 70, Bm = 60, T = 44, R = 20;

const domina = (p, q) => p[0] <= q[0] && p[1] <= q[1] && (p[0] < q[0] || p[1] < q[1]);
const fz = z => String(Math.round(z)).replace('-', '−');
// Entrada con rebote (sale un poco de más y regresa): cada diseño del barrido «brota» al aparecer. x en [0, 1].
const rebote = x => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2));

// ── Barrido real (ADR, caudal del iterado OPT.pareto.nit de la serie anterior fijo, solo cambia z_p): objetivos J_m = J1
// (calidad) y costo J_inst + J_op = J2 + J3, normalizados como en la optimización (γ = 1).
const BR = OPT.pareto && OPT.pareto.zp.length >= 12 ? OPT.pareto : null;
const TOL = 1e-6;              // resolución de los valores exportados (6 decimales): diferencias menores no distinguen
const dominaR = (p, q) => p.m <= q.m + TOL && p.c <= q.c + TOL && (p.m < q.m - TOL || p.c < q.c - TOL);
const REAL = BR ? BR.zp.map((z, i) => ({ z, m: BR.J1[i], c: BR.J2[i] + BR.J3[i], J: BR.J1[i] + BR.J2[i] + BR.J3[i] }))
    .sort((a, b) => a.z - b.z) : [];                       // de hondo a somero
REAL.forEach(o => { o.por = REAL.find(p => dominaR(p, o)) || null; o.dom = !!o.por; });
const NO_DOM = REAL.filter(o => !o.dom).sort((a, b) => a.m - b.m);
const MIN1 = REAL.length ? REAL.reduce((a, o) => (o.J < a.J ? o : a), REAL[0]) : null;   // mínimo de J_m + J_inst + J_op
// Escalas: J_m = 0 un poco a la derecha del eje (los diseños hondos no quedan encima de él); marcas redondas.
const RM1 = BR ? Math.ceil(Math.max(...REAL.map(o => o.m)) * 1.08 / 0.05) * 0.05 : 1, RM0 = -0.04 * RM1;
const RC1 = BR ? Math.ceil(Math.max(...REAL.map(o => o.c)) * 1.06 / 0.1) * 0.1 : 1;
const rx = m => L + (m - RM0) / (RM1 - RM0) * (W - L - R), ry = c => T + (RC1 - c) / RC1 * (H - Bm - T);
const pasoEje = v => [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5].find(s => v / s <= 4) || 10;
const marcas = v => Array.from({ length: Math.floor(v / pasoEje(v) + 1e-9) + 1 }, (_, i) => i * pasoEje(v));
const num = v => String(Math.round(v * 100) / 100);
// Región dominada por los diseños calculados (unión de los cuadrantes hacia arriba y a la derecha): borde en escalera
// que pasa por todos los no dominados.
const ESCALERA = NO_DOM.length ? NO_DOM.reduce((d, o, k) => d + (k ? ` L${rx(o.m)},${ry(NO_DOM[k - 1].c)}` : `M${rx(o.m)},${T}`)
    + ` L${rx(o.m)},${ry(o.c)}`, '') + ` L${W - R},${ry(NO_DOM[NO_DOM.length - 1].c)} L${W - R},${T} Z` : '';
// Rótulos de z_p: arriba a la derecha de cada punto (lado convexo, fuera de la curva); se omiten los que chocarían con
// otro rótulo o con otro punto. El mínimo con γ = 1 lleva su propio rótulo.
const ETQ = (() => {
    const cajas = [], out = {};
    const choca = (a, b, s) => a[0] < b[2] + s && b[0] < a[2] + s && a[1] < b[3] + s && b[1] < a[3] + s;
    for (const o of REAL) {
        if (o === MIN1) continue;
        const largo = (o.dom ? `${fz(o.z)} · dominado` : fz(o.z)).length;
        const x = rx(o.m) + 9, y = ry(o.c) - 9, caja = [x, y - 13, x + 7.2 * largo, y + 3];
        if (cajas.some(b => choca(caja, b, 12))) continue;
        if (REAL.some(p => p !== o && choca(caja, [rx(p.m) - 6, ry(p.c) - 6, rx(p.m) + 6, ry(p.c) + 6], 0))) continue;
        cajas.push(caja);
        out[o.z] = true;
    }
    return out;
})();
// Puntos no soportados: no dominados que quedan por encima de la envolvente convexa inferior (ningún γ los elige).
const NO_SOPORTADOS = (() => {
    const env = [];
    for (const p of NO_DOM) {
        while (env.length >= 2) {
            const [o, a] = env.slice(-2);
            if ((a.m - o.m) * (p.c - o.c) - (a.c - o.c) * (p.m - o.m) <= 0) env.pop(); else break;
        }
        env.push(p);
    }
    return NO_DOM.filter(p => !env.includes(p)).map(p => {
        const k = env.findIndex(e => e.m > p.m), a = env[k - 1], b = env[k];
        return { ...p, sobre: p.c - (a.c + (b.c - a.c) * (p.m - a.m) / (b.m - a.m)) };
    });
})();
const ZP_ITERADO = (OPT.modelos.find(m => m.id === 'adr') || {}).zp;

const FASES = [
    { n: 'Dos objetivos', dur: 2.5, d: <><span className="a3-completa">Queremos poco nitrato en el agua extraída y poco costo a la vez. El punto ideal (los dos en su mínimo) no es alcanzable.</span>
        <span className="a3-publica">Poco nitrato y poco costo a la vez: el ideal no es alcanzable.</span></> },
    { n: 'Diseños posibles', dur: 2.5, d: <><span className="a3-completa">Cada elección de caudal y profundidad <InlineMath math="u=(Q,z_p)" /> da un punto: cuánto nitrato y cuánto cuesta.</span>
        <span className="a3-publica">Cada diseño <InlineMath math="u=(Q,z_p)" /> es un punto: nitrato y costo.</span></> },
    { n: 'Dominancia', dur: 3, d: <><span className="a3-completa">Un diseño domina a otro si es mejor o igual en los dos objetivos y estrictamente mejor en uno. Los dominados se descartan.</span>
        <span className="a3-publica">Domina el que es mejor o igual en ambos y mejor en uno; los dominados se descartan.</span></> },
    { n: 'Frente de Pareto', dur: 3, d: <><span className="a3-completa">Los no dominados forman el frente: sobre él, mejorar la calidad obliga a pagar más. No hay un único óptimo, sino un compromiso.</span>
        <span className="a3-publica">Los no dominados forman el frente: más calidad cuesta más.</span></> },
    { n: 'Suma ponderada', dur: 7, d: <><span className="a3-completa">Minimizar <InlineMath math="\gamma J_m+J_{\rm inst}+J_{\rm op}" /> es buscar la recta de pendiente <InlineMath math="-\gamma" /> que toca el frente. Al variar <InlineMath math="\gamma" /> se recorre el frente; las corridas actuales usan <InlineMath math="\gamma=1" />.</span>
        <span className="a3-publica">Cada <InlineMath math="\gamma" /> elige el punto donde la recta de pendiente <InlineMath math="-\gamma" /> toca el frente; hoy, <InlineMath math="\gamma=1" />.</span></> },
    BR ? { n: 'En el pozo', dur: 6, d: <><span className="a3-completa">Barrido real con ADR: el bombeo de un iterado de la serie anterior queda fijo y solo se mueve <InlineMath math="z_p" />. Hondo: casi sin nitrato, pero más caro; somero: barato, con más nitrato. Con <InlineMath math="\gamma=1" />, el mínimo del barrido está en <InlineMath math={`z_p=${Math.round(MIN1.z)}`} />&nbsp;m. Todavía no es el frente: falta reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />.</span>
        <span className="a3-publica">Barrido real ADR, preliminar: hondo, menos nitrato y más caro. Falta el frente completo: reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />.</span></> }
       : { n: 'En el pozo', dur: 3, d: <><span className="a3-completa">Pozo hondo: menos nitrato, más caro. Pozo somero: barato, más nitrato. El frente completo (reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />) es el siguiente paso.</span>
        <span className="a3-publica">Siguiente paso: el frente completo, reoptimizando <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />.</span></> },
];
const [DOS, NUBE, DOM, FRENTE, PESO, POZO] = FASES.map((_, i) => i);

// ── Esquema en [0, 1]²: frente f(x) = a/(x + b) + c (convexo, decreciente) entre el primer y el último punto del frente
// (sin extrapolar) y una nube de diseños por encima. La nube solo admite diseños dominados por algún punto del frente:
// así los no dominados del esquema son exactamente FRENTE_PTS y ningún diseño queda fuera de la curva.
const A = 0.06, Bf = 0.06, Cf = 0.02;
const f = x => A / (x + Bf) + Cf;
const FRENTE_PTS = [0.07, 0.12, 0.19, 0.28, 0.4, 0.55, 0.72, 0.9].map(x => [x, f(x)]);
const X0 = FRENTE_PTS[0][0], X1 = FRENTE_PTS[FRENTE_PTS.length - 1][0];
const xf = Array.from({ length: 61 }, (_, i) => X0 + (X1 - X0) * i / 60);
const NUBE_PTS = (() => {
    let s = 7;
    const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const pts = [];
    while (pts.length < 46) {
        const x = 0.06 + 0.88 * r(), y = f(x) + 0.04 + 0.55 * r() * r();
        if (y < 0.97 && FRENTE_PTS.some(fp => domina(fp, [x, y]))) pts.push([x, y]);
    }
    return pts;
})();
const TODOS = [...NUBE_PTS, ...FRENTE_PTS];
const DOMINADOS = NUBE_PTS.map(q => TODOS.some(p => domina(p, q)));     // todos, por construcción
const PA = [0.58, 0.62];                                   // diseño de ejemplo (dominado)
const G0 = 0.12, G1 = 6;
// punto donde la recta de pendiente −γ toca el frente: f'(x) = −γ, o el extremo si la tangencia cae fuera del frente
const xTangente = g => Math.min(X1, Math.max(X0, Math.sqrt(A / g) - Bf));
const sx = x => L + x * (W - L - R), sy = y => T + (1 - y) * (H - Bm - T);

function Esquema({ fase, P }) {
    const p1 = P(NUBE), p2 = P(DOM), p3 = P(FRENTE), p4 = P(PESO);
    const fadeDom = fase >= FRENTE ? 0.25 : 1;
    // en la última fase la recta vuelve a γ = 1 (las corridas actuales)
    const g = fase >= POZO ? 1 : G0 * Math.pow(G1 / G0, suave(tramo(p4, 0.05, 0.95))), xt = xTangente(g), yt = f(xt);
    const verA = fase >= DOM && fase < PESO;
    const linea = [0, 1].map(x => [sx(x), sy(yt - g * (x - xt))]);
    const x1 = xTangente(1);
    return (
        <g>
            {/* punto ideal */}
            <g opacity={tramo(P(DOS), 0.3, 0.7)}>
                <circle cx={sx(0.02)} cy={sy(0.02)} r="8" fill="none" stroke={VALIDO} strokeWidth="2.4" strokeDasharray="3 3" />
                <text x={sx(0.05)} y={sy(0.02) - 12} style={{ ...eje, fill: VALIDO }}>ideal (inalcanzable)</text>
            </g>
            <g clipPath="url(#p34-clip)">
                {/* región dominada por el diseño de ejemplo y región que lo domina */}
                {verA && (
                    <g opacity={tramo(p2, 0.15, 0.5) * (fase >= FRENTE ? 0.4 : 1)}>
                        <rect x={sx(PA[0])} y={sy(1)} width={sx(1) - sx(PA[0])} height={sy(PA[1]) - sy(1)} fill={PLUMA} fillOpacity="0.12" />
                        <rect x={sx(0)} y={sy(PA[1])} width={sx(PA[0]) - sx(0)} height={sy(0) - sy(PA[1])} fill={VALIDO} fillOpacity="0.1" />
                    </g>
                )}
                {/* nube de diseños */}
                {NUBE_PTS.map(([x, y], i) => (
                    <circle key={i} cx={sx(x)} cy={sy(y)} r="5" fill={GRIS}
                            opacity={tramo(p1, i / 60, i / 60 + 0.3) * (DOMINADOS[i] ? fadeDom : 1) * (fase >= DOM && DOMINADOS[i] && fase < FRENTE ? 0.55 : 1)} />
                ))}
                {/* frente (concepto: curva continua por los no dominados, solo entre el primero y el último) */}
                {fase >= FRENTE && (
                    <polyline points={xf.slice(0, Math.max(2, Math.round(suave(tramo(p3, 0.1, 0.8)) * xf.length))).map(x => `${sx(x)},${sy(f(x))}`).join(' ')}
                              fill="none" stroke={AGUA} strokeWidth="3.5" />
                )}
                {FRENTE_PTS.map(([x, y], i) => (
                    <circle key={i} cx={sx(x)} cy={sy(y)} r="6" fill={fase >= FRENTE ? AGUA : GRIS} opacity={tramo(p1, 0.2, 0.6)} />
                ))}
                {/* recta de nivel de la suma ponderada */}
                {fase >= PESO && (
                    <g>
                        <line x1={linea[0][0]} y1={linea[0][1]} x2={linea[1][0]} y2={linea[1][1]} stroke={PLUMA} strokeWidth="2" strokeDasharray="7 5" />
                        <circle cx={sx(x1)} cy={sy(f(x1))} r="10" fill="none" stroke={VALIDO} strokeWidth="2.4" />
                        <circle cx={sx(xt)} cy={sy(yt)} r="8" fill={PLUMA} />
                    </g>
                )}
            </g>
            {/* diseño de ejemplo */}
            {verA && (
                <g opacity={tramo(p2, 0, 0.2) * (fase >= FRENTE ? 0.5 : 1)}>
                    <circle cx={sx(PA[0])} cy={sy(PA[1])} r="8" fill={PLUMA} />
                    <text x={sx(PA[0]) + 12} y={sy(PA[1]) - 10} style={{ ...eje, fill: PLUMA }}>A</text>
                    <text x={sx(0.8)} y={sy(0.93)} textAnchor="middle" style={{ ...eje, fill: PLUMA }} opacity={tramo(p2, 0.4, 0.6)}>peores que A</text>
                    <text x={sx(0.25)} y={sy(0.42)} textAnchor="middle" style={{ ...eje, fill: VALIDO }} opacity={tramo(p2, 0.5, 0.7)}>dominan a A</text>
                </g>
            )}
            {fase >= FRENTE && (
                <text x={sx(0.6)} y={sy(f(0.6) - 0.07)} style={{ ...eje, ...halo, fontSize: 18, fill: AGUA }} opacity={tramo(p3, 0.7, 1)}>frente de Pareto</text>
            )}
            {fase >= PESO && (
                <g>
                    <text x={sx(x1) - 14} y={sy(f(x1)) + 26} textAnchor="end" style={{ ...eje, ...halo, fill: VALIDO }}>γ = 1</text>
                    <text x={W - R} y={T + 18} textAnchor="end" style={{ ...eje, fontSize: 18, fill: PLUMA }}>γ = {g.toFixed(2)}</text>
                </g>
            )}
            {/* sin barrido real, la fase 6 se queda en el esquema */}
            {fase >= POZO && !BR && (
                <g opacity={tramo(P(POZO), 0.1, 0.5)}>
                    <text x={sx(0.1)} y={sy(0.93)} style={{ ...eje, ...halo, fontSize: 16, fill: 'var(--sl-text)' }}>↙ pozo hondo: menos nitrato, más caro</text>
                    <text x={sx(0.97)} y={sy(f(0.9) + 0.16)} textAnchor="end" style={{ ...eje, ...halo, fontSize: 16, fill: 'var(--sl-text)' }}>pozo somero: barato, más nitrato ↘</text>
                </g>
            )}
        </g>
    );
}

// Barrido real en el lienzo completo: los diseños brotan de hondo a somero; luego el frente (segmentos rectos entre no
// dominados vecinos), el dominado se apaga, la región dominada y, al final, la recta de γ = 1 que toca el mínimo.
function Real({ p }) {
    const n = REAL.length, t = i => 0.14 + 0.36 * i / Math.max(1, n - 1);
    const ejes = tramo(p, 0.1, 0.2), desdom = tramo(p, 0.5, 0.6), traza = suave(tramo(p, 0.52, 0.75));
    const region = tramo(p, 0.6, 0.78), g1 = tramo(p, 0.78, 0.9), notas = tramo(p, 0.86, 1);
    const m0 = rx(MIN1.m), c0 = ry(MIN1.c);
    return (
        <g>
            <g opacity={ejes} style={{ ...eje, fontSize: 13 }}>
                {marcas(RM1).map(v => (
                    <g key={`m${v}`}>
                        <line x1={rx(v)} x2={rx(v)} y1={H - Bm} y2={H - Bm + 5} stroke={GRIS} />
                        <text x={rx(v)} y={H - Bm + 19} textAnchor="middle">{num(v)}</text>
                    </g>
                ))}
                {marcas(RC1).map(v => (
                    <g key={`c${v}`}>
                        <line x1={L - 5} x2={L} y1={ry(v)} y2={ry(v)} stroke={GRIS} />
                        <text x={L - 8} y={ry(v) + 4} textAnchor="end">{num(v)}</text>
                    </g>
                ))}
            </g>
            <g clipPath="url(#p34-clip)">
                <path d={ESCALERA} fill={GRIS} fillOpacity={0.1 * region} />
                <polyline points={NO_DOM.map(o => `${rx(o.m)},${ry(o.c)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2.6"
                          strokeLinejoin="round" pathLength="1" strokeDasharray={`${traza} 1`} />
                {g1 > 0 && (
                    <line x1={rx(RM0)} y1={ry(MIN1.J - RM0)} x2={rx(RM1)} y2={ry(MIN1.J - RM1)} stroke={PLUMA} strokeWidth="2"
                          strokeDasharray="7 5" opacity={g1} />
                )}
            </g>
            {REAL.map((o, i) => {
                const a = tramo(p, t(i), t(i) + 0.07);
                if (a <= 0) return null;
                const apaga = o.dom ? desdom : 0;
                return (
                    <circle key={o.z} cx={rx(o.m)} cy={ry(o.c)} r={5.5 * rebote(a)} fill={AGUA} fillOpacity={1 - apaga}
                            stroke={apaga > 0 ? GRIS : 'var(--sl-bg)'} strokeWidth={apaga > 0 ? 1.8 : 1.2} />
                );
            })}
            <g style={{ ...eje, ...halo, fontSize: 13 }}>
                {REAL.map((o, i) => ETQ[o.z] && (
                    <text key={o.z} x={rx(o.m) + 9} y={ry(o.c) - 9} opacity={tramo(p, t(i) + 0.04, t(i) + 0.1)}>
                        {fz(o.z)}{o.dom && <tspan opacity={desdom}> · dominado</tspan>}
                    </text>
                ))}
            </g>
            {g1 > 0 && (
                <g opacity={g1}>
                    <circle cx={m0} cy={c0} r="11" fill="none" stroke={VALIDO} strokeWidth="2.4" />
                    <text x={m0} y={c0 + 42} textAnchor="middle" style={{ ...eje, ...halo, fill: VALIDO }}>
                        γ = 1: mínimo del barrido en z<tspan dy="5" fontSize="11">p</tspan><tspan dy="-5"> = {fz(MIN1.z)} m</tspan>
                    </text>
                </g>
            )}
            <g opacity={notas} style={{ ...eje, ...halo, fontSize: 15, fill: 'var(--sl-text)' }}>
                <text x={L + 105} y={T + 0.33 * (H - Bm - T)}>← hondo: casi sin nitrato, más caro</text>
                <text x={W - R} y={T + 0.66 * (H - Bm - T)} textAnchor="end">somero: más barato, más nitrato ↘</text>
            </g>
        </g>
    );
}

// Las dos gráficas comparten ejes y lienzo. En la fase 6 el esquema se apaga (0–10 %) antes de que entre el barrido real
// (10–20 %): nunca hay dos gráficas en pantalla; la que está lleva su rótulo arriba.
function Figura({ fase, P }) {
    const pR = BR && fase >= POZO ? P(POZO) : 0;
    const sale = BR ? tramo(pR, 0, 0.1) : 0, entra = BR ? tramo(pR, 0.1, 0.2) : 0;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
            <defs>
                <marker id="p34-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={GRIS} /></marker>
                <clipPath id="p34-clip"><rect x={L} y={T} width={W - L - R} height={H - Bm - T} /></clipPath>
            </defs>
            {/* ejes: menos es mejor en los dos */}
            <line x1={L} x2={W - R} y1={H - Bm} y2={H - Bm} stroke={GRIS} markerEnd="url(#p34-fl)" />
            <line x1={L} x2={L} y1={H - Bm} y2={T - 6} stroke={GRIS} markerEnd="url(#p34-fl)" />
            <text x={(L + W) / 2} y={H - 18} textAnchor="middle" style={eje}>nitrato en el agua extraída, J<tspan dy="5" fontSize="11">m</tspan><tspan dy="-5"> →</tspan></text>
            <text x={22} y={(T + H - Bm) / 2} transform={`rotate(-90 22 ${(T + H - Bm) / 2})`} textAnchor="middle" style={eje}>costo, J<tspan dy="5" fontSize="11">inst</tspan><tspan dy="-5"> + J</tspan><tspan dy="5" fontSize="11">op</tspan><tspan dy="-5"> →</tspan></text>
            {/* rótulo: qué gráfica es */}
            {sale < 1 && (
                <text x={L} y={22} style={{ ...eje, fontSize: 15 }} opacity={1 - sale}>
                    <tspan style={{ fontWeight: 600, letterSpacing: '0.08em' }}>ESQUEMA</tspan> · puntos ilustrativos, no calculados
                </text>
            )}
            {entra > 0 && (
                <text x={L} y={22} style={{ ...eje, fontSize: 16 }} opacity={entra}>
                    <tspan style={{ fill: AGUA, fontWeight: 600 }}>Barrido real ADR</tspan>
                    <tspan style={{ fill: PLUMA }}> (preliminar: iterado de la serie anterior)</tspan>
                </text>
            )}
            {sale < 1 && <g opacity={1 - sale}><Esquema fase={fase} P={P} /></g>}
            {entra > 0 && <Real p={pR} />}
        </svg>
    );
}

// Leyenda del barrido real (columna derecha, fase 6); la pública conserva solo lo indispensable.
function Leyenda({ op }) {
    const dom = REAL.filter(o => o.dom);
    const item = (icono, texto, cls) => (
        <div className={cls} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="26" height="16" viewBox="0 0 26 16" style={{ flex: 'none' }}>{icono}</svg>
            <span>{texto}</span>
        </div>
    );
    return (
        <div style={{ ...nota, marginTop: 14, display: 'grid', gap: 4, opacity: op }}>
            {item(<circle cx="13" cy="8" r="5.5" fill={AGUA} />, <>no dominado; rótulo: <InlineMath math="z_p" /> en m</>)}
            {dom.length > 0 && item(<circle cx="13" cy="8" r="5" fill="none" stroke={GRIS} strokeWidth="1.8" />,
                <>dominado: {dom.map(o => `${fz(o.z)} m (por ${fz(o.por.z)} m)`).join('; ')}</>)}
            {item(<line x1="2" x2="24" y1="8" y2="8" stroke={AGUA} strokeWidth="2.6" />, <>une diseños calculados vecinos; no es un ajuste</>, 'a3-completa')}
            {item(<rect x="3" y="2" width="20" height="12" fill={GRIS} fillOpacity="0.25" />, <>región dominada por los diseños calculados</>, 'a3-completa')}
            {item(<circle cx="13" cy="8" r="6" fill="none" stroke={VALIDO} strokeWidth="2.2" />, <>mínimo con <InlineMath math="\gamma=1" /></>)}
        </div>
    );
}

// Barra de fases: cada columna mide al menos lo que su nombre (minmax(max-content, 1fr)) y el nombre va en un solo
// renglón, así todas las barras quedan a la misma altura en las dos versiones; la copia invisible en negrita reserva el
// ancho para que las columnas no se muevan al cambiar de fase.
function Progreso({ fase, l, saltar, pub }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, minmax(max-content, 1fr))`, columnGap: 10,
                      alignItems: 'start', marginTop: 10 }}>
            {FASES.map((x, k) => (
                <button key={x.n} onClick={() => saltar(k)} title={`ir a: ${x.n}`}
                        style={{ all: 'unset', display: 'block', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 17 : 14,
                                 lineHeight: 1.2, whiteSpace: 'nowrap', color: k === fase ? 'var(--sl-accent)' : 'var(--sl-muted)' }}>
                    <span style={{ display: 'block', height: 3, background: 'var(--a3-filete, #C9D3DB)', marginBottom: 5 }}>
                        <span style={{ display: 'block', height: 3, width: `${k < fase ? 100 : k > fase ? 0 : 100 * l / x.dur}%`, background: 'var(--sl-accent)' }} />
                    </span>
                    <span style={{ display: 'inline-grid' }}>
                        <span aria-hidden="true" style={{ gridArea: '1 / 1', fontWeight: 600, visibility: 'hidden' }}>{k + 1} {x.n}</span>
                        <span style={{ gridArea: '1 / 1', fontWeight: k === fase ? 600 : 400 }}>{k + 1} {x.n}</span>
                    </span>
                </button>
            ))}
        </div>
    );
}

export default function A3D24({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const P = k => (fase > k ? 1 : fase < k ? 0 : l / FASES[k].dur);
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    const vecinos = MIN1 ? [REAL[REAL.indexOf(MIN1) - 1], REAL[REAL.indexOf(MIN1) + 1]].filter(Boolean) : [];
    return (
        <SlideLayout title="¿Qué es un frente de Pareto?" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: pub ? '1.6fr 1fr' : '1.45fr 1fr', gap: 34, alignItems: 'start' }}>
                <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase" style={{ cursor: 'pointer' }}>
                    <Figura fase={fase} P={P} />
                </div>
                <div>
                    <p style={{ margin: '0 0 6px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-accent)', fontWeight: 600 }}>
                        {fase + 1} · {FASES[fase].n}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.45, minHeight: 150 }}>{FASES[fase].d}</p>
                    {fase >= POZO && (BR ? <Leyenda op={tramo(P(POZO), 0.5, 0.8)} />
                        : <p style={nota}>El barrido real de z_p (ADR, caudal fijo) sigue corriendo; su curva ocupará el lugar del esquema.</p>)}
                </div>
            </div>
            <Progreso fase={fase} l={l} saltar={saltar} pub={pub} />
            <Notas titulo="Cómo se arma el frente a partir del barrido">
                <h4>Fases 1–5: esquema</h4>
                <p>Puntos inventados para explicar los conceptos. La curva es el frente de un problema continuo imaginario; la nube
                    se generó de modo que a cada diseño lo domine algún punto del frente, y la curva se dibuja solo entre el primer y
                    el último punto del frente (sin extrapolar). Así ningún diseño no dominado queda fuera de ella.</p>
                {BR ? (
                    <>
                        <h4>Fase 6: qué se grafica</h4>
                        <p>Cada punto es una simulación directa (flujo + transporte ADR, FEniCSx) con el mismo bombeo <InlineMath math="Q(t)" />,
                            el del iterado {BR.nit} de la serie anterior de ADR (demanda tomada a mitad de cada paso), y otra profundidad{' '}
                            <InlineMath math="z_p" />. Se evalúan los dos objetivos, normalizados como en la optimización:{' '}
                            <InlineMath math="f_1=J_m" /> (calidad del agua extraída, eje horizontal) y{' '}
                            <InlineMath math="f_2=J_{\rm inst}+J_{\rm op}" /> (costo de instalación y de bombeo, eje vertical). Los dos se minimizan.</p>
                        <h4>Dominancia y frente</h4>
                        <p><InlineMath math="u" /> domina a <InlineMath math="v" /> si <InlineMath math="f_1(u)\le f_1(v)" /> y{' '}
                            <InlineMath math="f_2(u)\le f_2(v)" />, con al menos una desigualdad estricta; el frente son los diseños que nadie
                            domina. Se compara con tolerancia <InlineMath math="10^{-6}" />, la resolución de los valores exportados.</p>
                        <ul>
                            <li>{REAL.length} diseños, {NO_DOM.length} no dominados: al subir el pozo <InlineMath math="J_m" /> crece y el costo
                                baja, un compromiso monótono.</li>
                            {REAL.filter(o => o.dom).map(o => (
                                <li key={o.z}>{fz(o.z)} m (<InlineMath math={`J_m=${o.m}`} />, costo {o.c.toFixed(3)}) queda dominado por{' '}
                                    {fz(o.por.z)} m (<InlineMath math={`J_m=${o.por.m}`} />, costo {o.por.c.toFixed(3)}): con esa resolución el
                                    nitrato es el mismo y cuesta más. Sin redondear, la diferencia de <InlineMath math="J_m" /> es menor que{' '}
                                    <InlineMath math="10^{-6}" />, por debajo de la precisión numérica.</li>
                            ))}
                        </ul>
                        <h4>Cómo se dibuja</h4>
                        <p>Los segmentos solo unen diseños calculados vecinos: no son un ajuste ni una curva supuesta, y entre dos puntos
                            no se sabe qué pasa. La región sombreada es lo que dominan los diseños calculados (unión de los cuadrantes{' '}
                            <InlineMath math="\{f\ge f(u)\}" />); su borde en escalera pasa por todos los no dominados, y ningún diseño queda
                            a su izquierda ni por debajo de los segmentos.</p>
                        <h4>Suma ponderada sobre el barrido</h4>
                        <p>Con <InlineMath math="\gamma=1" />, el mínimo de <InlineMath math="\gamma J_m+J_{\rm inst}+J_{\rm op}" /> está en{' '}
                            <InlineMath math={`z_p=${Math.round(MIN1.z)}`} /> m (<InlineMath math={`\\hat J=${MIN1.J.toFixed(4)}`} />)
                            {ZP_ITERADO !== undefined && Math.abs(ZP_ITERADO - MIN1.z) < 1 ? ', la profundidad del propio iterado' : ''}; sus
                            vecinos ({vecinos.map(o => `${fz(o.z)} m`).join(' y ')}) difieren menos de{' '}
                            {Math.max(...vecinos.map(o => (o.J - MIN1.J) / MIN1.J * 100)).toFixed(1)} %: el mínimo es plano. La suma ponderada
                            solo alcanza los puntos de la envolvente convexa (soportados).
                            {NO_SOPORTADOS.length > 0 && <> No soportados: {NO_SOPORTADOS.map(o => `${fz(o.z)} m (${o.sobre.toFixed(4)} sobre la
                                cuerda de sus vecinos)`).join('; ')}; ningún <InlineMath math="\gamma" /> los elige. Una diferencia así puede ser
                                ruido numérico: con estos datos no es concluyente.</>}</p>
                        <h4>Por qué todavía no es el frente</h4>
                        <p><InlineMath math="Q(t)" /> está fijo: no se reoptimiza para cada <InlineMath math="z_p" /> ni para cada{' '}
                            <InlineMath math="\gamma" />. Cada punto es un diseño factible (las restricciones del tanque y de la bomba dependen
                            solo de <InlineMath math="Q" />, y todas las <InlineMath math="z_p" /> están en{' '}
                            <InlineMath math="[-1400,-200]" /> m), así que el frente verdadero queda sobre esta curva o a su izquierda y abajo:
                            el barrido es una cota. El frente sale de resolver el problema completo en <InlineMath math="(Q,z_p)" /> para
                            varios <InlineMath math="\gamma" />, o con ε-restricción (<InlineMath math="J_m\le\varepsilon" />), que también
                            alcanza tramos no convexos.</p>
                        <p>Estado: preliminar. El iterado es de la serie anterior; las corridas se relanzaron (24-nov-2026) con la demanda
                            promediada por paso, y con el nuevo óptimo habrá que repetir el barrido y después construir el frente.</p>
                    </>
                ) : (
                    <p>El barrido real de <InlineMath math="z_p" /> aún no se ha exportado (OPT.pareto); la fase 6 se queda en el esquema.</p>
                )}
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 15, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 5, strokeLinejoin: 'round' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
