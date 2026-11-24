import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useFases, reducida, suave, tramo } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { usePublica } from './version.jsx';

// Qué es un frente de Pareto, en seis fases que avanza el expositor: dos objetivos en conflicto, diseños posibles,
// dominancia, frente, pesos (suma ponderada con γ) y el caso del pozo. Las fases 1–5 son un esquema (curva y nube
// inventadas); la 6 usa el barrido real de ADR con caudal fijo si ya existe (OPT.pareto, experimentos/barrido_zp.py).
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';

const FASES = [
    { n: 'Dos objetivos', dur: 2.5, d: <><span className="a3-completa">Queremos poco nitrato en el agua extraída y poco costo a la vez. El punto ideal (los dos en su mínimo) no es alcanzable.</span>
        <span className="a3-publica">Poco nitrato y poco costo a la vez: el ideal no es alcanzable.</span></> },
    { n: 'Diseños posibles', dur: 2.5, d: <><span className="a3-completa">Cada elección de caudal y profundidad <InlineMath math="u=(Q,z_p)" /> da un punto: cuánto nitrato y cuánto cuesta.</span>
        <span className="a3-publica">Cada diseño <InlineMath math="u=(Q,z_p)" /> es un punto: nitrato y costo.</span></> },
    { n: 'Dominancia', dur: 3, d: <><span className="a3-completa">Un diseño domina a otro si es mejor o igual en los dos objetivos y estrictamente mejor en uno. Los dominados se descartan.</span>
        <span className="a3-publica">Domina el que es mejor o igual en ambos y mejor en uno; los dominados se descartan.</span></> },
    { n: 'Frente de Pareto', dur: 3, d: <><span className="a3-completa">Los no dominados forman el frente: sobre él, mejorar la calidad obliga a pagar más. No hay un único óptimo, sino un compromiso.</span>
        <span className="a3-publica">Los no dominados forman el frente: más calidad cuesta más.</span></> },
    { n: 'Un peso elige un punto', dur: 7, d: <><span className="a3-completa">Minimizar <InlineMath math="\gamma J_m+J_{\rm inst}+J_{\rm op}" /> es buscar la recta de pendiente <InlineMath math="-\gamma" /> que toca el frente. Al variar <InlineMath math="\gamma" /> se recorre el frente; las corridas actuales usan <InlineMath math="\gamma=1" />.</span>
        <span className="a3-publica">Cada <InlineMath math="\gamma" /> elige el punto donde la recta de pendiente <InlineMath math="-\gamma" /> toca el frente; hoy, <InlineMath math="\gamma=1" />.</span></> },
    { n: 'En el pozo', dur: 3, d: <><span className="a3-completa">Pozo hondo: menos nitrato, más caro. Pozo somero: barato, más nitrato. El frente completo (reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />) es el siguiente paso.</span>
        <span className="a3-publica">Siguiente paso: el frente completo, reoptimizando <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />.</span></> },
];
const [DOS, NUBE, DOM, FRENTE, PESO, POZO] = FASES.map((_, i) => i);

// Esquema en [0, 1]²: frente f(x) = a/(x + b) + c (convexo, decreciente) y una nube de diseños por encima.
const A = 0.06, Bf = 0.06, Cf = 0.02;
const f = x => A / (x + Bf) + Cf;
const xf = Array.from({ length: 61 }, (_, i) => 0.04 + 0.9 * i / 60);
const NUBE_PTS = (() => {
    let s = 7;
    const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const pts = [];
    while (pts.length < 46) {
        const x = 0.06 + 0.88 * r(), y = f(x) + 0.04 + 0.55 * r() * r();
        if (y < 0.97) pts.push([x, y]);
    }
    return pts;
})();
const FRENTE_PTS = [0.07, 0.12, 0.19, 0.28, 0.4, 0.55, 0.72, 0.9].map(x => [x, f(x)]);
const PA = [0.58, 0.62];                                   // diseño de ejemplo (dominado)
const domina = (p, q) => p[0] <= q[0] && p[1] <= q[1] && (p[0] < q[0] || p[1] < q[1]);
const G0 = 0.12, G1 = 6;
const xTangente = g => Math.min(0.94, Math.max(0.04, Math.sqrt(A / g) - Bf));   // f'(x) = −γ

function Esquema({ fase, P }) {
    const W = 720, H = 470, L = 70, Bm = 60, T = 16, R = 20;
    const sx = x => L + x * (W - L - R), sy = y => T + (1 - y) * (H - Bm - T);
    const p1 = P(NUBE), p2 = P(DOM), p3 = P(FRENTE), p4 = P(PESO);
    const dominados = NUBE_PTS.map(q => FRENTE_PTS.some(fp => domina(fp, q)));
    const fadeDom = fase >= FRENTE ? 0.25 : 1;
    // en la última fase la recta vuelve a γ = 1 (las corridas actuales)
    const g = fase >= POZO ? 1 : G0 * Math.pow(G1 / G0, suave(tramo(p4, 0.05, 0.95))), xt = xTangente(g), yt = f(xt);
    const verA = fase >= DOM && fase < PESO;
    const linea = [0, 1].map(x => [sx(x), sy(yt - g * (x - xt))]);
    const x1 = xTangente(1);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <defs>
                <marker id="p34-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={GRIS} /></marker>
                <clipPath id="p34-clip"><rect x={L} y={T} width={W - L - R} height={H - Bm - T} /></clipPath>
            </defs>
            {/* ejes: menos es mejor en los dos */}
            <line x1={L} x2={W - R} y1={sy(0)} y2={sy(0)} stroke={GRIS} markerEnd="url(#p34-fl)" />
            <line x1={L} x2={L} y1={sy(0)} y2={T} stroke={GRIS} markerEnd="url(#p34-fl)" />
            <text x={(L + W) / 2} y={H - 18} textAnchor="middle" style={eje}>nitrato en el agua extraída, J<tspan dy="5" fontSize="11">m</tspan><tspan dy="-5"> →</tspan></text>
            <text x={22} y={(T + H - Bm) / 2} transform={`rotate(-90 22 ${(T + H - Bm) / 2})`} textAnchor="middle" style={eje}>costo, J<tspan dy="5" fontSize="11">inst</tspan><tspan dy="-5"> + J</tspan><tspan dy="5" fontSize="11">op</tspan><tspan dy="-5"> →</tspan></text>
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
                            opacity={tramo(p1, i / 60, i / 60 + 0.3) * (dominados[i] ? fadeDom : 1) * (fase >= DOM && dominados[i] && fase < FRENTE ? 0.55 : 1)} />
                ))}
                {/* frente */}
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
            {fase >= POZO && (
                <g opacity={tramo(P(POZO), 0.1, 0.5)}>
                    <text x={sx(0.1)} y={sy(0.93)} style={{ ...eje, ...halo, fontSize: 16, fill: 'var(--sl-text)' }}>↙ pozo hondo: menos nitrato, más caro</text>
                    <text x={sx(0.97)} y={sy(f(0.9) + 0.16)} textAnchor="end" style={{ ...eje, ...halo, fontSize: 16, fill: 'var(--sl-text)' }}>pozo somero: barato, más nitrato ↘</text>
                </g>
            )}
            <text x={L + 6} y={H - 40} style={{ ...eje, fontSize: 12 }} opacity={fase < POZO ? 0.8 : 0}>esquema</text>
        </svg>
    );
}

// Curva real del barrido (ADR, caudal fijo): J_m frente a costo, con z_p en algunos puntos.
function Real() {
    const P = OPT.pareto;
    if (!P || P.zp.length < 12) return <p style={nota}>El barrido real de z_p (ADR, caudal fijo) sigue corriendo; su curva aparecerá aquí.</p>;
    const pts = P.zp.map((z, i) => ({ z, q: P.J1[i], c: P.J2[i] + P.J3[i] }));
    const W = 420, H = 260, L = 56, Bm = 40;
    const qb = Math.max(...pts.map(o => o.q)) * 1.1, ca = Math.min(...pts.map(o => o.c)) * 0.95, cb = Math.max(...pts.map(o => o.c)) * 1.03;
    const sx = v => L + v / qb * (W - L - 12), sy = v => 10 + (cb - v) / (cb - ca) * (H - Bm - 10);
    return (
        <div>
            <p style={{ ...nota, marginTop: 6 }}>Barrido real: ADR con el caudal del mejor iterado, moviendo solo <InlineMath math="z_p" /></p>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
                <line x1={L} x2={W - 8} y1={H - Bm} y2={H - Bm} stroke={GRIS} />
                <line x1={L} x2={L} y1={6} y2={H - Bm} stroke={GRIS} />
                <text x={(L + W) / 2} y={H - 10} textAnchor="middle" style={{ ...eje, fontSize: 13 }}>J<tspan dy="4" fontSize="10">m</tspan></text>
                <text x={14} y={(H - Bm) / 2} transform={`rotate(-90 14 ${(H - Bm) / 2})`} textAnchor="middle" style={{ ...eje, fontSize: 13 }}>costo</text>
                <polyline points={pts.map(o => `${sx(o.q)},${sy(o.c)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="2.4" />
                {pts.map((o, i) => (
                    <g key={i}>
                        <circle cx={sx(o.q)} cy={sy(o.c)} r="4" fill={AGUA} />
                        {i % 3 === 0 && <text x={sx(o.q) + 6} y={sy(o.c) - 6} style={{ ...eje, fontSize: 12 }}>{String(Math.round(o.z)).replace('-', '−')}</text>}
                    </g>
                ))}
            </svg>
        </div>
    );
}

export default function A3D24({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const P = k => (fase > k ? 1 : fase < k ? 0 : l / FASES[k].dur);
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    return (
        <SlideLayout title="¿Qué es un frente de Pareto?" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: pub ? '1.6fr 1fr' : '1.45fr 1fr', gap: 34, alignItems: 'start' }}>
                <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase" style={{ cursor: 'pointer' }}>
                    <Esquema fase={fase} P={P} />
                </div>
                <div>
                    <p style={{ margin: '0 0 6px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-accent)', fontWeight: 600 }}>
                        {fase + 1} · {FASES[fase].n}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.45, minHeight: 150 }}>{FASES[fase].d}</p>
                    {fase >= POZO && <Real />}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, 1fr)`, gap: 10, marginTop: 10 }}>
                {FASES.map((x, k) => (
                    <button key={x.n} onClick={() => saltar(k)} title={`ir a: ${x.n}`}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 17 : 14, lineHeight: 1.2,
                                     color: k === fase ? 'var(--sl-accent)' : 'var(--sl-muted)', fontWeight: k === fase ? 600 : 400 }}>
                        <span style={{ display: 'block', height: 3, background: 'var(--a3-filete, #C9D3DB)', marginBottom: 5 }}>
                            <span style={{ display: 'block', height: 3, width: `${k < fase ? 100 : k > fase ? 0 : 100 * l / x.dur}%`, background: 'var(--sl-accent)' }} />
                        </span>
                        {k + 1} {x.n}
                    </button>
                ))}
            </div>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 15, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 5, strokeLinejoin: 'round' };
const nota = { margin: '10px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
