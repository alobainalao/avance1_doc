import React, { useState, useEffect } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// ── Datos optimización ADR, 2026-09-15 ────────────────────────────
// Q [m³/h], 72 pasos de 10 h = 30 días
const Q0 = [
    56.88,34.01,76.47,59.46,5.78,51.78,13.61,64.03,62.04,13.61,53.83,6.8,
    56.88,34.01,76.47,59.46,5.78,51.78,13.61,64.03,62.04,13.61,53.83,6.8,
    56.88,34.01,76.47,59.46,5.78,51.78,13.61,64.03,62.04,13.61,53.83,6.8,
    56.88,34.01,76.47,59.46,5.78,51.78,13.61,64.03,62.04,13.61,53.83,6.8,
    56.88,34.01,76.47,59.46,5.78,51.78,13.61,64.03,62.04,13.61,53.83,6.8,
    56.88,34.01,76.47,59.46,5.78,51.78,13.61,64.03,62.04,13.61,53.83,6.8,
];
const Qf = [
    206.88,0,0,146.47,0,42.05,0,16.54,34.78,0,7.37,80.38,
    0,100.79,0,45.66,0,65.38,0,146.52,179.56,0,0,0,
    0,41.6,0,99.18,0,35.24,0,144.65,177.64,13.61,0,1.07,
    0,26.92,0,99.18,0,35.24,0,144.65,177.64,13.61,0,1.07,
    0,26.92,0,99.18,0,35.24,0,144.65,177.64,13.61,0,9.54,
    0,27.26,0,50.65,18.04,53.12,0,67.92,108.04,0,217.55,2.49,
];
const J_VALS = [
    490359.8,490329.3,490305.3,490304.4,490274.4,490270.0,490267.6,
    490262.1,490256.2,490251.0,490254.1,490247.6,490243.9,490236.3,
    490222.1,490198.7,490183.7,490167.4,490149.1,490111.4,490013.1,
    489673.0,489363.6,488923.6,487608.9,483681.7,473716.2,
];
const ZP_VALS = [
    -700.0,-699.999,-699.997,-699.994,-699.995,-699.995,-699.994,
    -699.992,-699.989,-699.987,-699.985,-699.986,-699.984,-699.978,
    -699.963,-699.933,-699.914,-699.901,-699.881,-699.839,-699.75,
    -699.429,-699.109,-698.698,-697.696,-694.875,-687.64,
];

const NT = Q0.length;      // 72 pasos de tiempo
const NE = J_VALS.length;  // 27 evaluaciones

const lerp = (a, b, t) => a + (b - a) * t;

// ── Geometría SVG ─────────────────────────────────────────────────
// Panel Q (barras)
const WQ = 880, HQ = 204;
const PQ = { l: 48, r: 10, t: 18, b: 34 };
const PWQ = WQ - PQ.l - PQ.r;
const PHQ = HQ - PQ.t - PQ.b;
const QMAX = 230;
const BW   = PWQ / NT;             // ≈ 11.4 px por barra
const yQ   = v => PQ.t + (1 - Math.min(Math.max(v, 0), QMAX) / QMAX) * PHQ;
const xBar = i => PQ.l + i * BW;

// Panel J
const WJ = 360, HJ = 194;
const PJ = { l: 46, r: 10, t: 18, b: 34 };
const PWJ = WJ - PJ.l - PJ.r;
const PHJ = HJ - PJ.t - PJ.b;
const JMIN = 472000, JMAX = 491500;
const xJ   = i => PJ.l + (i / (NE - 1)) * PWJ;
const yJ   = v => PJ.t + (1 - (v - JMIN) / (JMAX - JMIN)) * PHJ;
const jPath = 'M ' + J_VALS.map((v, i) => `${xJ(i).toFixed(1)},${yJ(v).toFixed(1)}`).join(' L ');
const jArea = jPath + ` L ${xJ(NE-1).toFixed(1)},${(PJ.t+PHJ).toFixed(1)} L ${xJ(0).toFixed(1)},${(PJ.t+PHJ).toFixed(1)} Z`;

// Panel z_p
const WZ = 304, HZ = 194;
const PZ = { l: 52, r: 10, t: 18, b: 34 };
const PWZ = WZ - PZ.l - PZ.r;
const PHZ = HZ - PZ.t - PZ.b;
const ZPMIN = -701.5, ZPMAX = -686.5;
const xZ   = i => PZ.l + (i / (NE - 1)) * PWZ;
const yZ   = v => PZ.t + (1 - (v - ZPMIN) / (ZPMAX - ZPMIN)) * PHZ;
const zpPath = 'M ' + ZP_VALS.map((v, i) => `${xZ(i).toFixed(1)},${yZ(v).toFixed(1)}`).join(' L ');
const zpArea = zpPath + ` L ${xZ(NE-1).toFixed(1)},${(PZ.t+PHZ).toFixed(1)} L ${xZ(0).toFixed(1)},${(PZ.t+PHZ).toFixed(1)} Z`;

// Color de barras: azul (Q inicial) → verde (Q óptimo)
const barRGB = t => {
    const r = Math.round(lerp(96,  74, t));
    const g = Math.round(lerp(165, 222, t));
    const b = Math.round(lerp(250, 128, t));
    return `rgb(${r},${g},${b})`;
};

// ── Constantes de animación ───────────────────────────────────────
const ANIM_DELAY_MS = 700;
const ANIM_DUR_MS   = 3800;

// ─────────────────────────────────────────────────────────────────
const A3S14 = ({ theme = 'dark' }) => {
    const [p, setP] = useState(0);   // progreso 0→1

    useEffect(() => {
        let raf, t0 = null;
        const tid = setTimeout(() => {
            raf = requestAnimationFrame(function tick(ts) {
                if (t0 === null) t0 = ts;
                const prog = Math.min((ts - t0) / ANIM_DUR_MS, 1);
                setP(prog);
                if (prog < 1) raf = requestAnimationFrame(tick);
            });
        }, ANIM_DELAY_MS);
        return () => { clearTimeout(tid); if (raf) cancelAnimationFrame(raf); };
    }, []);

    // Estado derivado del progreso
    const ei    = Math.min(Math.round(p * (NE - 1)), NE - 1);
    const jNow  = J_VALS[ei];
    const zpNow = ZP_VALS[ei];
    const dJ    = jNow  - J_VALS[0];
    const dzp   = zpNow - ZP_VALS[0];

    // Q morfológico: interpola Q0 → Qf con el progreso global
    const qNow  = Q0.map((q0, i) => lerp(q0, Qf[i], p));
    const qMax  = Math.max(...qNow);
    const nZero = qNow.filter(q => q < 2).length;

    // Clip progresivo para curvas J y z_p
    const jClipW  = PWJ * p;
    const zpClipW = PWZ * p;

    const dJcolor  = dJ  < 0 ? '#4ade80' : '#94a3b8';
    const dzpcolor = dzp > 0 ? '#4ade80' : '#94a3b8';

    return (
        <SlideLayout title="Resultado ADR — evolución del perfil de bombeo en la optimización"
                     theme={theme} justify="flex-start">

            {/* ── Barra de estado: iteración + métricas en vivo ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0,
                padding: '2px 0',
            }}>
                {/* Contador de evaluación */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#475569', fontSize: 14 }}>eval</span>
                    <span style={{
                        color: '#00d8ff', fontSize: 26, fontWeight: 800,
                        fontFamily: 'monospace', minWidth: 26, textAlign: 'right',
                    }}>{ei + 1}</span>
                    <span style={{ color: '#475569', fontSize: 14 }}>/ {NE}</span>
                </div>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

                {/* J en vivo */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>J =</span>
                    <span style={{ color: '#f59e0b', fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {jNow.toFixed(0)}
                    </span>
                    <span style={{ color: dJcolor, fontSize: 13, fontFamily: 'monospace' }}>
                        ({dJ >= 0 ? '+' : ''}{dJ.toFixed(0)})
                    </span>
                </div>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

                {/* z_p en vivo */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>z_p =</span>
                    <span style={{ color: '#c084fc', fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {zpNow.toFixed(1)} m
                    </span>
                    <span style={{ color: dzpcolor, fontSize: 13, fontFamily: 'monospace' }}>
                        ({dzp >= 0 ? '+' : ''}{dzp.toFixed(1)})
                    </span>
                </div>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

                {/* Q en vivo */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>Q_max =</span>
                    <span style={{ color: barRGB(p), fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {qMax.toFixed(0)} m³/h
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>apagados =</span>
                    <span style={{ color: '#60a5fa', fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {nZero} / {NT}
                    </span>
                </div>

                {/* Barra de progreso */}
                <div style={{
                    flex: 1, height: 4, background: 'rgba(255,255,255,0.08)',
                    borderRadius: 2, overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', width: `${p * 100}%`,
                        background: 'linear-gradient(90deg, #60a5fa, #4ade80)',
                        borderRadius: 2,
                    }} />
                </div>
            </div>

            {/* ── Panel Q: barras morfológicas ── */}
            <svg viewBox={`0 0 ${WQ} ${HQ}`}
                 style={{ width: '100%', flexShrink: 0,
                          border: '1px solid rgba(0,216,255,0.18)', borderRadius: 8 }}>
                <rect x={PQ.l} y={PQ.t} width={PWQ} height={PHQ} fill="rgba(0,0,0,0.20)" />

                {/* Rejilla horizontal */}
                {[50, 100, 150, 200].map(v => (
                    <g key={v}>
                        <line x1={PQ.l} x2={PQ.l + PWQ} y1={yQ(v)} y2={yQ(v)}
                              stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                        <text x={PQ.l - 4} y={yQ(v) + 3.5} textAnchor="end" fontSize="9" fill="#7090aa">{v}</text>
                    </g>
                ))}

                {/* Barras fantasma: Q inicial fijo como referencia */}
                {Q0.map((q, i) => (
                    <rect key={`g${i}`}
                          x={xBar(i) + 0.8} y={yQ(q)}
                          width={BW - 1.6} height={Math.max(0, yQ(0) - yQ(q))}
                          fill="rgba(96,165,250,0.10)"
                          stroke="rgba(96,165,250,0.30)" strokeWidth="0.6" />
                ))}

                {/* Barras morfológicas Q0 → Qf (color azul→verde según progreso) */}
                {qNow.map((q, i) => (
                    <rect key={`b${i}`}
                          x={xBar(i) + 0.8} y={yQ(q)}
                          width={BW - 1.6} height={Math.max(0, yQ(0) - yQ(q))}
                          fill={barRGB(p)} fillOpacity={0.82} />
                ))}

                {/* Ejes */}
                <line x1={PQ.l} x2={PQ.l} y1={PQ.t} y2={PQ.t + PHQ} stroke="#00d8ff" strokeWidth="1" />
                <line x1={PQ.l} x2={PQ.l + PWQ} y1={PQ.t + PHQ} y2={PQ.t + PHQ} stroke="#00d8ff" strokeWidth="1" />

                {/* Ticks X: cada 5 días */}
                {[0, 5, 10, 15, 20, 25, 30].map(d => {
                    const xi = PQ.l + d * (NT / 30) * BW;
                    return (
                        <g key={d}>
                            <line x1={xi} x2={xi} y1={PQ.t + PHQ} y2={PQ.t + PHQ + 4}
                                  stroke="#8ab" strokeWidth="0.8" />
                            <text x={xi} y={PQ.t + PHQ + 14} textAnchor="middle" fontSize="8.5" fill="#8ab">
                                {d === 0 ? '0d' : d}
                            </text>
                        </g>
                    );
                })}

                <text x={11} y={PQ.t + PHQ / 2} textAnchor="middle" fontSize="9" fill="#8ab"
                      transform={`rotate(-90,11,${(PQ.t + PHQ / 2).toFixed(0)})`}>Q [m³/h]</text>

                {/* Leyenda */}
                <rect x={PQ.l + 8} y={PQ.t + 5} width={238} height={40} rx="3"
                      fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.07)" />
                <rect x={PQ.l + 13} y={PQ.t + 11} width={14} height={9} rx="1"
                      fill="rgba(96,165,250,0.20)" stroke="rgba(96,165,250,0.55)" strokeWidth="0.8" />
                <text x={PQ.l + 31} y={PQ.t + 20} fontSize="8.5" fill="#60a5fa">Q inicial — demanda seguida</text>
                <rect x={PQ.l + 13} y={PQ.t + 25} width={14} height={9} rx="1"
                      fill={barRGB(1)} fillOpacity="0.82" />
                <text x={PQ.l + 31} y={PQ.t + 34} fontSize="8.5" fill="#4ade80">Q óptimo — bang-bang (SLSQP adj.)</text>
            </svg>

            {/* ── Fila inferior: J + z_p + tarjetas ── */}
            <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0 }}>

                {/* ─ Panel J ─ */}
                <svg viewBox={`0 0 ${WJ} ${HJ}`}
                     style={{ width: WJ, flexShrink: 0,
                              border: '1px solid rgba(0,216,255,0.15)', borderRadius: 8 }}>
                    <rect x={PJ.l} y={PJ.t} width={PWJ} height={PHJ} fill="rgba(0,0,0,0.22)" />
                    {[490000, 488000, 484000, 478000, 474000].map(v => (
                        <g key={v}>
                            <line x1={PJ.l} x2={PJ.l + PWJ} y1={yJ(v)} y2={yJ(v)}
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                            <text x={PJ.l - 3} y={yJ(v) + 3.5} textAnchor="end" fontSize="7.5" fill="#7090aa">
                                {(v / 1000).toFixed(0)}k
                            </text>
                        </g>
                    ))}
                    <defs>
                        <clipPath id="a3s14-jclip">
                            <rect x={PJ.l} y={0} width={jClipW} height={HJ} />
                        </clipPath>
                    </defs>
                    <path d={jArea} fill="rgba(245,158,11,0.08)" clipPath="url(#a3s14-jclip)" />
                    <path d={jPath} fill="none" stroke="#f59e0b" strokeWidth="2.4"
                          clipPath="url(#a3s14-jclip)" />
                    {p > 0.01 && (
                        <>
                            <circle cx={xJ(ei)} cy={yJ(jNow)} r="7"
                                    fill="rgba(245,158,11,0.22)" />
                            <circle cx={xJ(ei)} cy={yJ(jNow)} r="4"
                                    fill="#f59e0b" stroke="#fff" strokeWidth="1.2" />
                        </>
                    )}
                    <line x1={PJ.l} x2={PJ.l} y1={PJ.t} y2={PJ.t + PHJ} stroke="#00d8ff" strokeWidth="1" />
                    <line x1={PJ.l} x2={PJ.l + PWJ} y1={PJ.t + PHJ} y2={PJ.t + PHJ} stroke="#00d8ff" strokeWidth="1" />
                    {[0, 7, 14, 21, 26].map(i => (
                        <g key={i}>
                            <line x1={xJ(i)} x2={xJ(i)} y1={PJ.t + PHJ} y2={PJ.t + PHJ + 4}
                                  stroke="#8ab" strokeWidth="0.7" />
                            <text x={xJ(i)} y={PJ.t + PHJ + 13} textAnchor="middle"
                                  fontSize="7.5" fill="#8ab">{i + 1}</text>
                        </g>
                    ))}
                    <text x={PJ.l + PWJ / 2} y={HJ - 5} textAnchor="middle" fontSize="8" fill="#8ab">
                        evaluación
                    </text>
                    <text x={PJ.l + PWJ / 2} y={PJ.t - 4} textAnchor="middle"
                          fontSize="10" fill="#f59e0b" fontWeight="700">Descenso de J</text>
                </svg>

                {/* ─ Panel z_p ─ */}
                <svg viewBox={`0 0 ${WZ} ${HZ}`}
                     style={{ width: WZ, flexShrink: 0,
                              border: '1px solid rgba(0,216,255,0.15)', borderRadius: 8 }}>
                    <rect x={PZ.l} y={PZ.t} width={PWZ} height={PHZ} fill="rgba(0,0,0,0.22)" />
                    {[-700, -696, -692, -688].map(v => (
                        <g key={v}>
                            <line x1={PZ.l} x2={PZ.l + PWZ} y1={yZ(v)} y2={yZ(v)}
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                            <text x={PZ.l - 3} y={yZ(v) + 3.5} textAnchor="end"
                                  fontSize="7.5" fill="#7090aa">{v}</text>
                        </g>
                    ))}
                    <text x={PZ.l + PWZ - 4} y={PZ.t + 9} textAnchor="end"
                          fontSize="7.5" fill="#94a3b8">↑ z₀ = 220 m</text>
                    <defs>
                        <clipPath id="a3s14-zpclip">
                            <rect x={PZ.l} y={0} width={zpClipW} height={HZ} />
                        </clipPath>
                    </defs>
                    <path d={zpArea} fill="rgba(192,132,252,0.08)" clipPath="url(#a3s14-zpclip)" />
                    <path d={zpPath} fill="none" stroke="#c084fc" strokeWidth="2.4"
                          clipPath="url(#a3s14-zpclip)" />
                    {p > 0.01 && (
                        <>
                            <circle cx={xZ(ei)} cy={yZ(zpNow)} r="7"
                                    fill="rgba(192,132,252,0.22)" />
                            <circle cx={xZ(ei)} cy={yZ(zpNow)} r="4"
                                    fill="#c084fc" stroke="#fff" strokeWidth="1.2" />
                        </>
                    )}
                    <line x1={PZ.l} x2={PZ.l} y1={PZ.t} y2={PZ.t + PHZ} stroke="#00d8ff" strokeWidth="1" />
                    <line x1={PZ.l} x2={PZ.l + PWZ} y1={PZ.t + PHZ} y2={PZ.t + PHZ} stroke="#00d8ff" strokeWidth="1" />
                    {[0, 7, 14, 21, 26].map(i => (
                        <g key={i}>
                            <line x1={xZ(i)} x2={xZ(i)} y1={PZ.t + PHZ} y2={PZ.t + PHZ + 4}
                                  stroke="#8ab" strokeWidth="0.7" />
                            <text x={xZ(i)} y={PZ.t + PHZ + 13} textAnchor="middle"
                                  fontSize="7.5" fill="#8ab">{i + 1}</text>
                        </g>
                    ))}
                    <text x={PZ.l + PWZ / 2} y={HZ - 5} textAnchor="middle" fontSize="8" fill="#8ab">
                        evaluación
                    </text>
                    <text x={PZ.l + PWZ / 2} y={PZ.t - 4} textAnchor="middle"
                          fontSize="10" fill="#c084fc" fontWeight="700">Profundidad del pozo z_p</text>
                </svg>

                {/* ─ Tarjetas de interpretación ─ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                              gap: 10, justifyContent: 'center', paddingLeft: 2 }}>

                    <div style={{
                        padding: '8px 14px', borderRadius: 7,
                        background: 'rgba(245,158,11,0.07)',
                        border: '1px solid rgba(245,158,11,0.25)',
                    }}>
                        <div style={{ color: '#f59e0b', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                            OBJETIVO
                        </div>
                        <div style={{ color: '#f59e0b', fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>
                            {dJ.toFixed(0)} <span style={{ fontSize: 13, fontWeight: 400 }}>(−3.4 %)</span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                            nit = 25 · aún descendiendo
                        </div>
                    </div>

                    <div style={{
                        padding: '8px 14px', borderRadius: 7,
                        background: 'rgba(192,132,252,0.07)',
                        border: '1px solid rgba(192,132,252,0.25)',
                    }}>
                        <div style={{ color: '#c084fc', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                            CONTROL z_p
                        </div>
                        <div style={{ color: '#c084fc', fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>
                            {dzp >= 0 ? '+' : ''}{dzp.toFixed(1)} m
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                            minimiza J_e = (z_p − z₀)²
                        </div>
                    </div>

                    <div style={{
                        padding: '8px 14px', borderRadius: 7,
                        background: 'rgba(74,222,128,0.06)',
                        border: '1px solid rgba(74,222,128,0.22)',
                    }}>
                        <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                            CONTROL Q(t)
                        </div>
                        <div style={{ color: '#4ade80', fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>
                            {nZero} / {NT} <span style={{ fontSize: 13, fontWeight: 400 }}>apagados</span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                            bang-bang · tanque como buffer
                        </div>
                    </div>
                </div>

            </div>
        </SlideLayout>
    );
};

export default A3S14;
