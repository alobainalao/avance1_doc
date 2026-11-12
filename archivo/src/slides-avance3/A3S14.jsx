import React, { useState, useEffect } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// ── Datos optimización ADR BFR, 50 evals, sep 27 2026 ─────────────
// Q en m³/h (= Q_2D m²/s × Vscale=30 × 3600)
const Q0 = Array(72).fill(3.6);   // condición inicial: caudal constante Q_max

const Qf = [
    1.474,1.474,1.474,1.474,1.419,1.374,1.374,1.445,1.445,1.389,1.389,1.389,
    1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,
    1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,1.389,
    1.389,1.389,1.389,1.389,1.335,1.335,1.335,1.403,1.403,1.274,1.274,1.312,
    1.318,1.373,1.479,1.479,1.297,1.345,1.345,1.345,1.345,1.430,1.430,1.423,
    1.407,1.407,1.423,1.423,1.414,1.312,1.312,1.263,1.263,1.124,1.124,0.227,
];

const J_VALS = [
    491814.4,490294.8,490267.6,490265.0,490259.1,490244.5,490228.3,490224.3,
    490206.8,490146.8,490048.8,489935.1,489747.8,489416.6,489135.3,488175.6,
    485906.3,480328.5,471643.9,444055.2,342183.0,55362.4,40150.9,40147.6,
    40136.2,40107.6,40101.8,40095.1,40091.4,40088.7,40087.0,40085.1,40081.5,
    40080.5,40079.2,40079.0,40078.2,40077.1,40076.6,40076.2,40075.8,40075.4,
    40075.3,40075.3,40075.3,40075.2,40075.2,40075.1,40075.0,40075.0,
];

const ZP_VALS = [
    -700.0,-699.999,-699.999,-699.998,-699.995,-699.985,-699.968,-699.965,
    -699.951,-699.912,-699.819,-699.735,-699.591,-699.331,-699.120,-698.404,
    -696.778,-692.709,-686.375,-666.002,-584.594,-234.908,-200.0,-200.0,
    -200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,
    -200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,-200.0,
    -200.0,-200.0,-200.0,-200.0,-200.0,-200.0,
];

const NT = Q0.length;        // 72 pasos
const NE = J_VALS.length;   // 50 evaluaciones

const lerp = (a, b, t) => a + (b - a) * t;

// ── Geometría SVG ─────────────────────────────────────────────────
// Panel Q
const WQ = 880, HQ = 196;
const PQ = { l: 48, r: 10, t: 16, b: 32 };
const PWQ = WQ - PQ.l - PQ.r;
const PHQ = HQ - PQ.t - PQ.b;
const QMAX = 4.0;
const BW   = PWQ / NT;
const yQ   = v => PQ.t + (1 - Math.min(Math.max(v, 0), QMAX) / QMAX) * PHQ;
const xBar = i => PQ.l + i * BW;

// Panel J  (rango completo: 35K–495K)
const WJ = 380, HJ = 194;
const PJ = { l: 50, r: 10, t: 16, b: 32 };
const PWJ = WJ - PJ.l - PJ.r;
const PHJ = HJ - PJ.t - PJ.b;
const JMIN = 32000, JMAX = 495000;
const xJ  = i => PJ.l + (i / (NE - 1)) * PWJ;
const yJ  = v => PJ.t + (1 - (v - JMIN) / (JMAX - JMIN)) * PHJ;
const jPath = 'M ' + J_VALS.map((v, i) => `${xJ(i).toFixed(1)},${yJ(v).toFixed(1)}`).join(' L ');
const jArea = jPath + ` L ${xJ(NE-1).toFixed(1)},${(PJ.t+PHJ).toFixed(1)} L ${xJ(0).toFixed(1)},${(PJ.t+PHJ).toFixed(1)} Z`;

// Panel z_p (rango completo: -720 a -180)
const WZ = 290, HZ = 194;
const PZ = { l: 50, r: 10, t: 16, b: 32 };
const PWZ = WZ - PZ.l - PZ.r;
const PHZ = HZ - PZ.t - PZ.b;
const ZPMIN = -720, ZPMAX = -180;
const xZ  = i => PZ.l + (i / (NE - 1)) * PWZ;
const yZ  = v => PZ.t + (1 - (v - ZPMIN) / (ZPMAX - ZPMIN)) * PHZ;
const zpPath = 'M ' + ZP_VALS.map((v, i) => `${xZ(i).toFixed(1)},${yZ(v).toFixed(1)}`).join(' L ');
const zpArea = zpPath + ` L ${xZ(NE-1).toFixed(1)},${(PZ.t+PHZ).toFixed(1)} L ${xZ(0).toFixed(1)},${(PZ.t+PHZ).toFixed(1)} Z`;

// Color de barras: azul (inicial) → verde (óptimo)
const barRGB = t => {
    const r = Math.round(lerp(96,  74, t));
    const g = Math.round(lerp(165, 222, t));
    const b = Math.round(lerp(250, 128, t));
    return `rgb(${r},${g},${b})`;
};

const ANIM_DELAY_MS = 700;
const ANIM_DUR_MS   = 3800;

const A3S14 = ({ theme = 'dark' }) => {
    const [p, setP] = useState(0);

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

    const ei    = Math.min(Math.round(p * (NE - 1)), NE - 1);
    const jNow  = J_VALS[ei];
    const zpNow = ZP_VALS[ei];
    const dJ    = jNow  - J_VALS[0];
    const dzp   = zpNow - ZP_VALS[0];

    const qNow   = Q0.map((q0, i) => lerp(q0, Qf[i], p));
    const qMean  = qNow.reduce((a, b) => a + b, 0) / NT;
    const jClipW = PWJ * p;
    const zpClipW = PWZ * p;

    const dJcolor  = dJ  < 0 ? '#4ade80' : '#94a3b8';
    const dzpcolor = dzp > 0 ? '#4ade80' : '#94a3b8';
    const pctJ     = dJ < 0 ? `${((dJ / J_VALS[0]) * 100).toFixed(1)} %` : '+0';

    return (
        <SlideLayout title="Resultado ADR — evolución del perfil de bombeo en la optimización"
                     theme={theme} justify="flex-start">

            {/* ── Barra de estado ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#475569', fontSize: 13 }}>eval</span>
                    <span style={{ color: '#00d8ff', fontSize: 26, fontWeight: 800,
                                   fontFamily: 'monospace', minWidth: 26, textAlign: 'right' }}>{ei + 1}</span>
                    <span style={{ color: '#475569', fontSize: 13 }}>/ {NE}</span>
                </div>
                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>J =</span>
                    <span style={{ color: '#f59e0b', fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {jNow >= 100000 ? `${(jNow/1000).toFixed(0)}k` : jNow.toFixed(0)}
                    </span>
                    <span style={{ color: dJcolor, fontSize: 13, fontFamily: 'monospace' }}>
                        ({pctJ})
                    </span>
                </div>
                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>z_p =</span>
                    <span style={{ color: '#c084fc', fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {zpNow.toFixed(0)} m
                    </span>
                    <span style={{ color: dzpcolor, fontSize: 13, fontFamily: 'monospace' }}>
                        ({dzp >= 0 ? '+' : ''}{dzp.toFixed(0)})
                    </span>
                </div>
                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ color: '#7090aa', fontSize: 13 }}>Q̄ =</span>
                    <span style={{ color: barRGB(p), fontSize: 21, fontWeight: 700, fontFamily: 'monospace' }}>
                        {qMean.toFixed(2)} m³/h
                    </span>
                </div>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)',
                              borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p * 100}%`,
                                  background: 'linear-gradient(90deg,#60a5fa,#4ade80)',
                                  borderRadius: 2 }} />
                </div>
            </div>

            {/* ── Panel Q ── */}
            <svg viewBox={`0 0 ${WQ} ${HQ}`}
                 style={{ width: '100%', flexShrink: 0,
                          border: '1px solid rgba(0,216,255,0.18)', borderRadius: 8 }}>
                <rect x={PQ.l} y={PQ.t} width={PWQ} height={PHQ} fill="rgba(0,0,0,0.20)" />
                {[1.0, 2.0, 3.0].map(v => (
                    <g key={v}>
                        <line x1={PQ.l} x2={PQ.l + PWQ} y1={yQ(v)} y2={yQ(v)}
                              stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                        <text x={PQ.l - 4} y={yQ(v) + 3.5} textAnchor="end"
                              fontSize="9" fill="#7090aa">{v.toFixed(1)}</text>
                    </g>
                ))}
                {/* Referencia Q0 = 3.6 m³/h */}
                <line x1={PQ.l} x2={PQ.l + PWQ} y1={yQ(3.6)} y2={yQ(3.6)}
                      stroke="rgba(96,165,250,0.40)" strokeWidth="1.2" strokeDasharray="5,3" />
                {/* Perfil animado Q0 → Qf */}
                <polyline
                    points={qNow.map((q, i) => `${(xBar(i) + BW / 2).toFixed(1)},${yQ(q).toFixed(1)}`).join(' ')}
                    fill="none" stroke={barRGB(p)} strokeWidth="2.2" strokeLinejoin="round" />
                {qNow.map((q, i) => (
                    <circle key={i} cx={xBar(i) + BW / 2} cy={yQ(q)}
                            r="2.8" fill={barRGB(p)} fillOpacity={0.85} />
                ))}
                <line x1={PQ.l} x2={PQ.l} y1={PQ.t} y2={PQ.t + PHQ} stroke="#00d8ff" strokeWidth="1" />
                <line x1={PQ.l} x2={PQ.l + PWQ} y1={PQ.t + PHQ} y2={PQ.t + PHQ} stroke="#00d8ff" strokeWidth="1" />
                {[0,5,10,15,20,25,30].map(d => {
                    const xi = PQ.l + d * (NT / 30) * BW;
                    return (
                        <g key={d}>
                            <line x1={xi} x2={xi} y1={PQ.t + PHQ} y2={PQ.t + PHQ + 4}
                                  stroke="#8ab" strokeWidth="0.8" />
                            <text x={xi} y={PQ.t + PHQ + 13} textAnchor="middle"
                                  fontSize="8.5" fill="#8ab">{d === 0 ? '0d' : d}</text>
                        </g>
                    );
                })}
                <text x={11} y={PQ.t + PHQ / 2} textAnchor="middle" fontSize="9" fill="#8ab"
                      transform={`rotate(-90,11,${(PQ.t + PHQ / 2).toFixed(0)})`}>Q [m³/h]</text>
                {/* Leyenda */}
                <rect x={PQ.l + 8} y={PQ.t + 4} width={248} height={42} rx="3"
                      fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.07)" />
                <line x1={PQ.l + 13} y1={PQ.t + 16} x2={PQ.l + 27} y2={PQ.t + 16}
                      stroke="rgba(96,165,250,0.55)" strokeWidth="1.4" strokeDasharray="5,3" />
                <text x={PQ.l + 31} y={PQ.t + 20} fontSize="8.5" fill="#60a5fa">
                    Q inicial — caudal máximo uniforme (3.6 m³/h)
                </text>
                <line x1={PQ.l + 13} y1={PQ.t + 31} x2={PQ.l + 27} y2={PQ.t + 31}
                      stroke={barRGB(1)} strokeWidth="2.2" />
                <text x={PQ.l + 31} y={PQ.t + 35} fontSize="8.5" fill="#4ade80">
                    Q óptimo — perfil suave ≈ 1.36 m³/h (SLSQP, adjunto)
                </text>
            </svg>

            {/* ── Fila inferior: J + z_p + tarjetas ── */}
            <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0 }}>

                {/* Panel J */}
                <svg viewBox={`0 0 ${WJ} ${HJ}`}
                     style={{ width: WJ, flexShrink: 0,
                              border: '1px solid rgba(0,216,255,0.15)', borderRadius: 8 }}>
                    <rect x={PJ.l} y={PJ.t} width={PWJ} height={PHJ} fill="rgba(0,0,0,0.22)" />
                    {[490000, 400000, 300000, 200000, 100000, 50000].map(v => (
                        <g key={v}>
                            <line x1={PJ.l} x2={PJ.l + PWJ} y1={yJ(v)} y2={yJ(v)}
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                            <text x={PJ.l - 3} y={yJ(v) + 3.5} textAnchor="end"
                                  fontSize="7.5" fill="#7090aa">{v >= 100000 ? `${v/1000}k` : `${v/1000}k`}</text>
                        </g>
                    ))}
                    {/* Línea objetivo final */}
                    <line x1={PJ.l} x2={PJ.l + PWJ} y1={yJ(40075)} y2={yJ(40075)}
                          stroke="rgba(74,222,128,0.35)" strokeWidth="1" strokeDasharray="4,3" />
                    <text x={PJ.l + PWJ - 2} y={yJ(40075) - 4} textAnchor="end"
                          fontSize="7.5" fill="#4ade80">40 075</text>
                    <defs>
                        <clipPath id="a3s14-jclip">
                            <rect x={PJ.l} y={0} width={jClipW} height={HJ} />
                        </clipPath>
                    </defs>
                    <path d={jArea} fill="rgba(245,158,11,0.07)" clipPath="url(#a3s14-jclip)" />
                    <path d={jPath} fill="none" stroke="#f59e0b" strokeWidth="2.4"
                          clipPath="url(#a3s14-jclip)" />
                    {p > 0.01 && (
                        <>
                            <circle cx={xJ(ei)} cy={yJ(jNow)} r="7" fill="rgba(245,158,11,0.22)" />
                            <circle cx={xJ(ei)} cy={yJ(jNow)} r="4"
                                    fill="#f59e0b" stroke="#fff" strokeWidth="1.2" />
                        </>
                    )}
                    <line x1={PJ.l} x2={PJ.l} y1={PJ.t} y2={PJ.t + PHJ} stroke="#00d8ff" strokeWidth="1" />
                    <line x1={PJ.l} x2={PJ.l + PWJ} y1={PJ.t + PHJ} y2={PJ.t + PHJ} stroke="#00d8ff" strokeWidth="1" />
                    {[0,10,21,30,40,49].map(i => (
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

                {/* Panel z_p */}
                <svg viewBox={`0 0 ${WZ} ${HZ}`}
                     style={{ width: WZ, flexShrink: 0,
                              border: '1px solid rgba(0,216,255,0.15)', borderRadius: 8 }}>
                    <rect x={PZ.l} y={PZ.t} width={PWZ} height={PHZ} fill="rgba(0,0,0,0.22)" />
                    {[-700, -600, -500, -400, -300, -200].map(v => (
                        <g key={v}>
                            <line x1={PZ.l} x2={PZ.l + PWZ} y1={yZ(v)} y2={yZ(v)}
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                            <text x={PZ.l - 3} y={yZ(v) + 3.5} textAnchor="end"
                                  fontSize="7.5" fill="#7090aa">{v}</text>
                        </g>
                    ))}
                    {/* z_opt = -200 m */}
                    <line x1={PZ.l} x2={PZ.l + PWZ} y1={yZ(-200)} y2={yZ(-200)}
                          stroke="rgba(245,158,11,0.40)" strokeWidth="1.2" strokeDasharray="4,3" />
                    <text x={PZ.l + PWZ - 2} y={yZ(-200) - 4} textAnchor="end"
                          fontSize="7.5" fill="#f59e0b">z* = −200 m</text>
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
                            <circle cx={xZ(ei)} cy={yZ(zpNow)} r="7" fill="rgba(192,132,252,0.22)" />
                            <circle cx={xZ(ei)} cy={yZ(zpNow)} r="4"
                                    fill="#c084fc" stroke="#fff" strokeWidth="1.2" />
                        </>
                    )}
                    <line x1={PZ.l} x2={PZ.l} y1={PZ.t} y2={PZ.t + PHZ} stroke="#00d8ff" strokeWidth="1" />
                    <line x1={PZ.l} x2={PZ.l + PWZ} y1={PZ.t + PHZ} y2={PZ.t + PHZ} stroke="#00d8ff" strokeWidth="1" />
                    {[0,10,21,30,40,49].map(i => (
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

                {/* Tarjetas */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                              gap: 10, justifyContent: 'center', paddingLeft: 2 }}>

                    <div style={{ padding: '8px 14px', borderRadius: 7,
                                  background: 'rgba(245,158,11,0.07)',
                                  border: '1px solid rgba(245,158,11,0.25)' }}>
                        <div style={{ color: '#f59e0b', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                            OBJETIVO  J
                        </div>
                        <div style={{ color: '#f59e0b', fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>
                            {pctJ}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                            491 814 → 40 075 · 50 evals
                        </div>
                    </div>

                    <div style={{ padding: '8px 14px', borderRadius: 7,
                                  background: 'rgba(192,132,252,0.07)',
                                  border: '1px solid rgba(192,132,252,0.25)' }}>
                        <div style={{ color: '#c084fc', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                            CONTROL  z_p
                        </div>
                        <div style={{ color: '#c084fc', fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>
                            {dzp >= 0 ? '+' : ''}{dzp.toFixed(0)} m
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                            −700 → −200 m (ascenso 500 m)
                        </div>
                    </div>

                    <div style={{ padding: '8px 14px', borderRadius: 7,
                                  background: 'rgba(74,222,128,0.06)',
                                  border: '1px solid rgba(74,222,128,0.22)' }}>
                        <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                            CONTROL  Q(t)
                        </div>
                        <div style={{ color: '#4ade80', fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>
                            Q̄* ≈ {qMean.toFixed(2)} m³/h
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>
                            3.6 → 1.36 m³/h · −62 % · perfil suave
                        </div>
                    </div>
                </div>

            </div>
        </SlideLayout>
    );
};

export default A3S14;
