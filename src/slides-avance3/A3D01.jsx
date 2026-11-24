import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { POLIGONO, POZO, FUENTE, X, Z } from './escena.jsx';
import { useReloj, reducida, suave, tramo, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';
import { ESQ } from './esquema.js';

// Apertura: el problema en seis fases sobre el dominio real, con datos del simulador (FEniCSx, malla con eje de 1 m,
// ADR; codigo/scripts/exportar_esquema_presentacion.py → esquema.js): porosidad de los pozos de campo, líneas de
// corriente sin y con bombeo, pluma de nitrato sin bombeo y con el óptimo ADR (Q(t), z_p), y el tanque con la demanda
// (optimoNitrato.js). Clic en la figura: siguiente fase; clic en una etiqueta de abajo: ir a esa fase.
const AGUA = '#0F7A85', PLUMA = '#C4511F', GRIS = '#6E7F8D';

const FASES = [
    { t0: 0, t1: 6, n: 'Medio poroso', d: <>porosidad <InlineMath math="\phi" /> medida en cuatro pozos de campo (capas A–E) e interpolada al dominio</> },
    { t0: 6, t1: 13, n: 'Flujo', d: <>el agua entra por la derecha y sale libre por la izquierda; más rápido donde <InlineMath math="\phi" /> y <InlineMath math="\mathbf K" /> son altas</> },
    { t0: 13, t1: 22, n: 'Derrame', d: <>la fuente dejó una pluma de nitrato (estado inicial del modelo); en 30 días el agua la arrastra, la dispersa y se degrada</> },
    { t0: 22, t1: 31, n: 'Pozo', d: <>bombea <InlineMath math="Q(t)" /> a la profundidad <InlineMath math="z_p" />: desvía el flujo y capta parte del nitrato</> },
    { t0: 31, t1: 40, n: 'Tanque y demanda', d: <>lo bombeado entra a un tanque de 2 000 m³ que entrega 1 000 m³ al día a la población y al riego</> },
    { t0: 40, t1: 44, n: 'La pregunta', d: <>¿cómo operar el pozo?</> },
];
const TOTAL = FASES[FASES.length - 1].t1;

const opt = OPT.modelos[0];
const ZP = ESQ.fuente.zp;
const NT = opt.Q.length;                                       // 72 intervalos de 10 h
const DT_H = OPT.dt / 3600;
const C_POZO = OPT.analisis.diag.adr.Cpozo.map(c => c * OPT.f * 1000);   // mg/L, mismo Q y z_p
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

// Tanque, tubería y población sobre la superficie (y < 0 en la escena), con S_n, V_s Q_n y d_n del óptimo ADR.
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

function Escena({ s }) {
    // fase 1: pozos de campo y porosidad
    const perfil = suave(tramo(s, 0.2, 1.4)), phi = tramo(s, 1.6, 3.6) * (1 - 0.55 * tramo(s, 6, 7.5));
    // fase 2: líneas de corriente y partículas (sin pozo; con pozo desde la fase 4)
    const revela = suave(tramo(s, 6.2, 8.4)), cambio = tramo(s, 23.6, 24.8);
    const corr = 1 - 0.45 * tramo(s, 13, 14.5), tau = Math.max(0, s - 8);
    // fase 3: derrame (Q = 0); fases 4 y 5: con el pozo, 30 días cada una
    // la pluma inicial se descubre desde la fuente hacia la salida (esquema) y luego corre con los cuadros reales
    const fuente = tramo(s, 13, 13.6), descubre = suave(tramo(s, 13.6, 15.4)), dia3 = tramo(s, 15.6, 21.6);
    const pozo = suave(tramo(s, 22.2, 23.6)), dia4 = tramo(s, 24.8, 30.6), dia5 = tramo(s, 32.4, 39.6);
    const enPozo = s >= 24.8, diaCon = s >= 31.5 ? dia5 : dia4;
    // al empezar la fase 5 la pluma se apaga y vuelve a correr los 30 días junto con el tanque
    const opCon = !enPozo ? 0 : s < 31 ? 1 : s < 31.5 ? 1 - tramo(s, 31, 31.5) : tramo(s, 31.5, 32.4);
    const reloj = (s >= 15.6 && s < 22.2) || (s >= 24.8 && s < 31) || (s >= 32.4 && s < 40);
    const cuadroSin = s < 13.6 ? -1 : Math.floor(dia3 * (CUADROS - 0.01));
    const cuadroCon = Math.floor(diaCon * (CUADROS - 0.01));
    const n = Math.min(NT - 1, Math.floor(diaCon * NT));
    const dias = (s < 22 ? dia3 : diaCon) * NT * DT_H / 24;
    const zp = lerp(250.5, ZP, pozo), cp = C_POZO[n], qn = enPozo ? opt.Q[n] / Q_MAX : 0;
    const sup = tramo(s, 31, 32.4);
    const bandasPhi = ESQ.phi.bandas;
    const pozosX = [...new Set(ESQ.pozos_campo.map(w => w.x))];
    return (
        <svg viewBox="-20 -112 1040 426" style={{ width: '100%', display: 'block' }}>
            <defs>
                <clipPath id="d01-clip"><polygon points={POLIGONO} /></clipPath>
                <clipPath id="d01-descubre"><rect x={lerp(X(FUENTE.x) + 25, -20, descubre)} y={-20} width={1100} height={340} /></clipPath>
            </defs>
            <polygon points={POLIGONO} fill="var(--sl-text)" fillOpacity="0.03" />
            <g clipPath="url(#d01-clip)">
                {bandasPhi.map((d, i) => <path key={i} d={d} fill={AGUA} fillOpacity={(0.05 + 0.13 * i) * phi} />)}
                <Corrientes tipo="sin" op={corr * (1 - cambio)} revela={revela} tau={tau} />
                <Corrientes tipo="con" op={corr * cambio} revela={1} tau={tau} />
                <g clipPath={descubre < 1 ? 'url(#d01-descubre)' : undefined}>
                    <Pluma cuadro={cuadroSin} tipo="sin" op={s < 22 ? 1 : 1 - tramo(s, 23.6, 24.6)} />
                </g>
                <Pluma cuadro={cuadroCon} tipo="con" op={opCon} />
            </g>
            <polygon points={POLIGONO} fill="none" stroke="var(--sl-text)" strokeWidth="1.6" />

            {/* pozos de campo: perfil vertical con la porosidad de cada capa */}
            <g opacity={perfil * (1 - 0.7 * tramo(s, 6, 7.5))}>
                {pozosX.map(x => {
                    const zs = ESQ.pozos_campo.filter(w => w.x === x).map(w => w.z);
                    const xx = Math.min(996, Math.max(4, x));
                    return <line key={x} x1={xx} x2={xx} y1={0} y2={Math.max(...zs) * perfil + 8} stroke="var(--sl-text)" strokeWidth="2" strokeDasharray="5 3" />;
                })}
                {ESQ.pozos_campo.map((w, i) => (
                    <circle key={i} cx={Math.min(996, Math.max(4, w.x))} cy={w.z} r={7} fill={AGUA} fillOpacity={0.15 + 0.85 * w.phi}
                            stroke="var(--sl-text)" strokeWidth="1" opacity={tramo(perfil, 0.5 + 0.03 * i, 0.7 + 0.03 * i)} />
                ))}
            </g>

            {/* fuente de nitrato */}
            {fuente > 0 && (
                <g opacity={fuente}>
                    <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r={7 + 10 * ((s * 0.8) % 1)} fill="none" stroke={PLUMA} strokeOpacity={1 - ((s * 0.8) % 1)} strokeWidth="2" />
                    <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r="7" fill={PLUMA} />
                    <text x={X(FUENTE.x) - 14} y={Z(FUENTE.z) + 30} textAnchor="end" style={{ ...etq, fill: PLUMA }}>derrame de nitrato</text>
                </g>
            )}

            {/* pozo de bombeo con anillos proporcionales a Q(t) y el nitrato que capta */}
            {pozo > 0 && (
                <g>
                    <line x1={X(POZO.x)} y1={0} x2={X(POZO.x)} y2={Z(zp)} stroke={AGUA} strokeWidth="4" />
                    {qn > 0.02 && [0, 0.5].map(o => {
                        const f = (s * 1.1 + o) % 1;
                        return <circle key={o} cx={X(POZO.x)} cy={Z(zp)} r={8 + 26 * qn * f} fill="none" stroke={AGUA} strokeWidth="1.6" strokeOpacity={1 - f} />;
                    })}
                    <circle cx={X(POZO.x)} cy={Z(zp)} r="7" fill={enPozo && cp > 1 ? PLUMA : AGUA} fillOpacity={enPozo ? 0.4 + 0.6 * Math.min(1, cp / 20) : 1} />
                    <text x={X(POZO.x) + 14} y={Z(zp) + 6} style={{ ...etq, ...halo }} opacity={tramo(s, 23.2, 23.8)}>
                        pozo, z<tspan dy="5" fontSize="12">p</tspan><tspan dy="-5"> = {String(Math.round(ZP)).replace('-', '−')} m</tspan>
                    </text>
                    {enPozo && (
                        <text x={X(POZO.x) + 14} y={Z(zp) + 28} style={{ ...etq, ...halo, fill: PLUMA }}>
                            nitrato en el pozo: {cp.toFixed(1)} mg/L <tspan style={{ fill: 'var(--sl-muted)' }}>(guía OMS 50)</tspan>
                        </text>
                    )}
                </g>
            )}

            <Superficie op={sup} n={n} />

            {/* leyendas y reloj, sobre la superficie */}
            <g style={etq}>
                <g opacity={phi > 0 ? Math.min(1, phi / 0.45) * (1 - tramo(s, 12, 13)) : 0}>
                    <text x={830} y={-80}>porosidad φ</text>
                    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={830 + 34 * i} y={-70} width={34} height={14} fill={AGUA} fillOpacity={0.05 + 0.13 * i} stroke="var(--sl-muted)" strokeWidth="0.5" />)}
                    {[0, 0.4, 0.8].map((v, i) => <text key={v} x={830 + 68 * i} y={-40} textAnchor="middle" fontSize="13">{v}</text>)}
                    <text x={1000} y={-40} textAnchor="end" fontSize="13">1</text>
                </g>
                <g opacity={tramo(s, 13.6, 14.4)}>
                    <rect x={830} y={-76} width={16} height={12} fill={PLUMA} fillOpacity="0.3" />
                    <text x={852} y={-66} fontSize="14">nitrato &gt; 10 mg/L</text>
                    <rect x={830} y={-56} width={16} height={12} fill={PLUMA} fillOpacity="0.85" />
                    <text x={852} y={-46} fontSize="14">&gt; 50 mg/L (guía OMS)</text>
                </g>
                {reloj && <text x={1000} y={-92} textAnchor="end" style={{ ...etq, fontSize: 17, fill: 'var(--sl-text)' }}>día {Math.round(dias)}</text>}
                <text x={998} y={Z(-300)} textAnchor="end">entrada →</text>
                <text x={6} y={Z(-1200)}>← salida libre</text>
            </g>
        </svg>
    );
}

const PREGUNTA = String.raw`\min_{Q_1,\dots,Q_{72},\;z_p}\ \hat J=\gamma\,J_m+\alpha\,J_{\rm inst}+\beta\,J_{\rm op}`;
const SUJETO = String.raw`\text{s.a.}\ \ \text{flujo y transporte},\quad 0\le Q_n\le\overline Q_n,\quad z_{\min}\le z_p\le z_{\max},\quad 0\le S_n\le S_{\max}`;

export default function A3D01({ theme = 'dark' }) {
    const [s, ir] = useReloj(TOTAL, 400);
    const k = FASES.findIndex(f => s < f.t1), i = k < 0 ? FASES.length - 1 : k;
    const saltar = k => ir(reducida() ? FASES[k].t1 - 0.01 : FASES[k].t0);
    const q = suave(tramo(s, 40, 41.6));
    return (
        <SlideLayout title="Un acuífero, un derrame, un pozo y un tanque" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 2px', minHeight: 30, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', opacity: q > 0 ? 1 - q : 1 }}>
                <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: AGUA, fontWeight: 600, marginRight: 12 }}>
                    {i + 1} · {FASES[i].n}
                </span>
                {FASES[i].d}
            </p>
            <div style={{ position: 'relative' }}>
                <div onClick={() => saltar(i + 1 < FASES.length ? i + 1 : 0)} title="clic: siguiente fase"
                     style={{ cursor: 'pointer', opacity: 1 - 0.8 * q }}>
                    <Escena s={s} />
                </div>
                {q > 0 && (
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) translateY(${(1 - q) * 14}px)`,
                                  opacity: q, width: '88%', padding: '18px 28px', background: 'var(--sl-bg)', borderLeft: `5px solid ${AGUA}`,
                                  boxShadow: '0 6px 28px rgba(0,0,0,0.18)' }}>
                        <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', lineHeight: 1.3 }}>
                            ¿Cuánto bombear en cada intervalo de 10 h y a qué profundidad, para captar el menor nitrato posible
                            al menor costo, sin vaciar ni desbordar el tanque?
                        </p>
                        <BlockMath math={PREGUNTA} />
                        <div className="a3-ec--compacta"><BlockMath math={SUJETO} /></div>
                        <p style={{ margin: '2px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                            <InlineMath math="J_m" />: nitrato captado · <InlineMath math="J_{\rm inst}" />: profundidad de instalación ·{' '}
                            <InlineMath math="J_{\rm op}" />: costo de bombeo · tanque <InlineMath math="S_n=S_0+V_s\Delta t\sum Q_k-\sum d_k" />
                        </p>
                    </div>
                )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, 1fr)`, gap: 10, marginTop: 8 }}>
                {FASES.map((f, k) => (
                    <button key={f.n} onClick={() => saltar(k)} title={`ir a: ${f.n}`}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)',
                                     color: k === i ? AGUA : 'var(--sl-muted)', fontWeight: k === i ? 600 : 400 }}>
                        <span style={{ display: 'block', height: 3, background: 'var(--a3-filete, #C9D3DB)', marginBottom: 5 }}>
                            <span style={{ display: 'block', height: 3, width: `${100 * tramo(s, f.t0, f.t1)}%`, background: AGUA }} />
                        </span>
                        {k + 1} {f.n}
                    </button>
                ))}
            </div>
        </SlideLayout>
    );
}

const etq = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 4, strokeLinejoin: 'round' };
