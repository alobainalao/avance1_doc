import React, { useState, useEffect } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// ── ADR BFR 50 evals (sep 27 2026) ────────────────────────────────
const J_ADR = [491814,490295,490268,490265,490259,490245,490228,490224,490207,490147,490049,489935,489748,489417,489135,488176,485906,480329,471644,444055,342183,55362,40151,40148,40136,40108,40102,40095,40091,40089,40087,40085,40082,40081,40079,40079,40078,40077,40077,40076,40076,40075,40075,40075,40075,40075,40075,40075,40075,40075];
const ZP_ADR= [-700,-700,-700,-700,-700,-700,-700,-700,-700,-699.91,-699.82,-699.73,-699.59,-699.33,-699.12,-698.4,-696.78,-692.71,-686.37,-666,-584.59,-234.91,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200,-200];

// ── mrmt_semi BFR 14 evals (sep 28 2026) ──────────────────────────
const J_SEM = [633785852,159897372,145617477,145635262,145619115,145617640,145617494,145617479,145617478,145617477,145617477,145617477,145617477,145617477];
// Normalizado a 1 para comparar descenso relativo
const J_ADR_REL = J_ADR.map(v => v / J_ADR[0]);
const J_SEM_REL = J_SEM.map(v => v / J_SEM[0]);

const NE_A = J_ADR.length;  // 50
const NE_S = J_SEM.length;  // 14

// ── Geometría ─────────────────────────────────────────────────────
const WJ = 560, HJ = 320;
const PJ = { l: 54, r: 14, t: 22, b: 44 };
const PWJ = WJ - PJ.l - PJ.r;
const PHJ = HJ - PJ.t - PJ.b;

const xJ = (i, n) => PJ.l + (i / (n - 1)) * PWJ;
const yJ = v => PJ.t + (1 - v) * PHJ;   // v ∈ [0,1] relativo

const pathOf = (arr, n) =>
    'M ' + arr.map((v, i) => `${xJ(i, n).toFixed(1)},${yJ(v).toFixed(1)}`).join(' L ');

const jPathA = pathOf(J_ADR_REL, NE_A);
const jPathS = pathOf(J_SEM_REL, NE_S);
const areaA  = jPathA + ` L ${xJ(NE_A-1,NE_A).toFixed(1)},${(PJ.t+PHJ).toFixed(1)} L ${PJ.l.toFixed(1)},${(PJ.t+PHJ).toFixed(1)} Z`;

// ── zp ADR ────────────────────────────────────────────────────────
const WZ = 340, HZ = 320;
const PZ = { l: 54, r: 14, t: 22, b: 44 };
const PWZ = WZ - PZ.l - PZ.r;
const PHZ = HZ - PZ.t - PZ.b;
const ZPMIN = -720, ZPMAX = -170;
const xZ = i => PZ.l + (i / (NE_A - 1)) * PWZ;
const yZ = v => PZ.t + (1 - (v - ZPMIN) / (ZPMAX - ZPMIN)) * PHZ;
const zpPath = 'M ' + ZP_ADR.map((v, i) => `${xZ(i).toFixed(1)},${yZ(v).toFixed(1)}`).join(' L ');
const zpArea = zpPath + ` L ${xZ(NE_A-1).toFixed(1)},${(PZ.t+PHZ).toFixed(1)} L ${PZ.l.toFixed(1)},${(PZ.t+PHZ).toFixed(1)} Z`;

const ANIM_DELAY = 500;
const ANIM_DUR   = 4000;

const A3S17 = ({ theme = 'dark' }) => {
    const [p, setP] = useState(0);

    useEffect(() => {
        let raf, t0 = null;
        const tid = setTimeout(() => {
            raf = requestAnimationFrame(function tick(ts) {
                if (t0 === null) t0 = ts;
                const prog = Math.min((ts - t0) / ANIM_DUR, 1);
                setP(prog);
                if (prog < 1) raf = requestAnimationFrame(tick);
            });
        }, ANIM_DELAY);
        return () => { clearTimeout(tid); if (raf) cancelAnimationFrame(raf); };
    }, []);

    const eiA  = Math.min(Math.round(p * (NE_A - 1)), NE_A - 1);
    const eiS  = Math.min(Math.round(p * (NE_S - 1)), NE_S - 1);
    const clipW = PWJ * p;
    const clipZ = PWZ * p;

    return (
        <SlideLayout title="Resultados de optimización — ADR y MRMT Semi (BFR)" theme={theme} justify="flex-start">

            {/* ── Fila de métricas ──────────────────────────────── */}
            <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
                {[
                    { label: 'ADR · J', val: `−91.9 %`, sub: `40 075 ← 491 814`,  color: '#4ade80' },
                    { label: 'ADR · z_p', val: `−200 m`, sub: `↑ 500 m desde z₀ = −700 m`, color: '#c084fc' },
                    { label: 'ADR · Q̄*', val: `3.78×10⁻⁴`, sub: `m³/s  (−62 %)`, color: '#60a5fa' },
                    { label: 'MRMT Semi · J', val: `−77.0 %`, sub: `145 M ← 634 M  (3 iters)`, color: '#f59e0b' },
                    { label: 'MRMT Semi · Q̄*', val: `3.85×10⁻⁴`, sub: `m³/s  (−61.5 %)`, color: '#60a5fa' },
                ].map(({ label, val, sub, color }) => (
                    <div key={label} style={{
                        flex: 1, padding: '7px 12px', borderRadius: 7,
                        background: `${color}0d`, border: `1px solid ${color}40`,
                    }}>
                        <div style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>{label}</div>
                        <div style={{ color, fontSize: 21, fontWeight: 800, fontFamily: 'monospace' }}>{val}</div>
                        <div style={{ color: '#7090aa', fontSize: 12, marginTop: 1 }}>{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Gráficas ─────────────────────────────────────── */}
            <div style={{ flexShrink: 0, display: 'flex', gap: 14 }}>

                {/* Panel J relativo */}
                <svg viewBox={`0 0 ${WJ} ${HJ}`}
                     style={{ flex: WJ, width: 0, minWidth: 0,
                              border: '1px solid rgba(0,216,255,0.15)', borderRadius: 8 }}>
                    <rect x={PJ.l} y={PJ.t} width={PWJ} height={PHJ} fill="rgba(0,0,0,0.22)" />
                    {[1, 0.75, 0.5, 0.25, 0.08].map(v => (
                        <g key={v}>
                            <line x1={PJ.l} x2={PJ.l+PWJ} y1={yJ(v)} y2={yJ(v)}
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                            <text x={PJ.l-3} y={yJ(v)+3.5} textAnchor="end" fontSize="8" fill="#7090aa">
                                {Math.round(v*100)}%
                            </text>
                        </g>
                    ))}
                    <defs>
                        <clipPath id="a3s17-jclip">
                            <rect x={PJ.l} y={0} width={clipW} height={HJ} />
                        </clipPath>
                    </defs>
                    {/* Área ADR */}
                    <path d={areaA} fill="rgba(74,222,128,0.07)" clipPath="url(#a3s17-jclip)" />
                    {/* Curva ADR */}
                    <path d={jPathA} fill="none" stroke="#4ade80" strokeWidth="2.2"
                          clipPath="url(#a3s17-jclip)" />
                    {/* Curva MRMT Semi */}
                    <path d={jPathS} fill="none" stroke="#f59e0b" strokeWidth="2.2"
                          strokeDasharray="6,3" clipPath="url(#a3s17-jclip)" />
                    {/* Puntos animados */}
                    {p > 0.01 && <>
                        <circle cx={xJ(eiA,NE_A)} cy={yJ(J_ADR_REL[eiA])} r="5"
                                fill="#4ade80" stroke="#fff" strokeWidth="1.2" />
                        <circle cx={xJ(Math.min(eiS,NE_S-1),NE_S)} cy={yJ(J_SEM_REL[Math.min(eiS,NE_S-1)])} r="5"
                                fill="#f59e0b" stroke="#fff" strokeWidth="1.2" />
                    </>}
                    {/* Ejes */}
                    <line x1={PJ.l} x2={PJ.l} y1={PJ.t} y2={PJ.t+PHJ} stroke="#00d8ff" strokeWidth="1" />
                    <line x1={PJ.l} x2={PJ.l+PWJ} y1={PJ.t+PHJ} y2={PJ.t+PHJ} stroke="#00d8ff" strokeWidth="1" />
                    <text x={PJ.l+PWJ/2} y={HJ-8} textAnchor="middle" fontSize="9" fill="#8ab">evaluación</text>
                    <text x={PJ.l+PWJ/2} y={PJ.t-5} textAnchor="middle" fontSize="10.5" fill="var(--sl-muted)" fontWeight="700">
                        J/J₀ — descenso relativo
                    </text>
                    {/* Leyenda */}
                    <line x1={PJ.l+6} y1={PJ.t+10} x2={PJ.l+22} y2={PJ.t+10} stroke="#4ade80" strokeWidth="2.2"/>
                    <text x={PJ.l+26} y={PJ.t+14} fontSize="8.5" fill="#4ade80">ADR (50 evals)</text>
                    <line x1={PJ.l+6} y1={PJ.t+24} x2={PJ.l+22} y2={PJ.t+24} stroke="#f59e0b" strokeWidth="2.2" strokeDasharray="6,3"/>
                    <text x={PJ.l+26} y={PJ.t+28} fontSize="8.5" fill="#f59e0b">MRMT Semi (14 evals)</text>
                </svg>

                {/* Panel z_p ADR */}
                <svg viewBox={`0 0 ${WZ} ${HZ}`}
                     style={{ flex: WZ, width: 0, minWidth: 0,
                              border: '1px solid rgba(192,132,252,0.18)', borderRadius: 8 }}>
                    <rect x={PZ.l} y={PZ.t} width={PWZ} height={PHZ} fill="rgba(0,0,0,0.22)" />
                    {[-700, -600, -500, -400, -300, -200].map(v => (
                        <g key={v}>
                            <line x1={PZ.l} x2={PZ.l+PWZ} y1={yZ(v)} y2={yZ(v)}
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
                            <text x={PZ.l-3} y={yZ(v)+3.5} textAnchor="end" fontSize="8" fill="#7090aa">{v}</text>
                        </g>
                    ))}
                    {/* línea z₀ = -200 m (objetivo) */}
                    <line x1={PZ.l} x2={PZ.l+PWZ} y1={yZ(-200)} y2={yZ(-200)}
                          stroke="rgba(245,158,11,0.40)" strokeWidth="1.2" strokeDasharray="4,3" />
                    <text x={PZ.l+PWZ-4} y={yZ(-200)-4} textAnchor="end" fontSize="8" fill="#f59e0b">z* = −200 m</text>
                    <defs>
                        <clipPath id="a3s17-zpclip">
                            <rect x={PZ.l} y={0} width={clipZ} height={HZ} />
                        </clipPath>
                    </defs>
                    <path d={zpArea} fill="rgba(192,132,252,0.07)" clipPath="url(#a3s17-zpclip)" />
                    <path d={zpPath} fill="none" stroke="#c084fc" strokeWidth="2.4"
                          clipPath="url(#a3s17-zpclip)" />
                    {p > 0.01 && <>
                        <circle cx={xZ(eiA)} cy={yZ(ZP_ADR[eiA])} r="5"
                                fill="#c084fc" stroke="#fff" strokeWidth="1.2" />
                    </>}
                    <line x1={PZ.l} x2={PZ.l} y1={PZ.t} y2={PZ.t+PHZ} stroke="#00d8ff" strokeWidth="1" />
                    <line x1={PZ.l} x2={PZ.l+PWZ} y1={PZ.t+PHZ} y2={PZ.t+PHZ} stroke="#00d8ff" strokeWidth="1" />
                    <text x={PZ.l+PWZ/2} y={HZ-8} textAnchor="middle" fontSize="9" fill="#8ab">evaluación</text>
                    <text x={PZ.l+PWZ/2} y={PZ.t-5} textAnchor="middle" fontSize="10.5"
                          fill="var(--sl-muted)" fontWeight="700">z_p ADR — profundidad del pozo</text>
                    <text x={14} y={PZ.t+PHZ/2} textAnchor="middle" fontSize="8.5" fill="#8ab"
                          transform={`rotate(-90,14,${(PZ.t+PHZ/2).toFixed(0)})`}>z_p (m)</text>
                </svg>

            </div>

            {/* ── Tarjetas interpretación ── */}
            <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
                    {[
                        {
                            color: '#4ade80',
                            title: 'ADR — pozo superficial óptimo',
                            body: 'z_p → −200 m (+500 m de ascenso). La fuente de contaminación está en la superficie (z ≈ 220 m); extraer desde profundidad superficial maximiza la captura de la pluma.',
                        },
                        {
                            color: '#f59e0b',
                            title: 'MRMT — convergencia rápida en Q',
                            body: 'Convergió en solo 3 iter (J −77 %). Las fases inmóviles amortiguan la respuesta a z_p; el ajuste óptimo se concentra en el perfil temporal Q(t).',
                        },
                        {
                            color: '#60a5fa',
                            title: 'Q(t) perfil suave — ambos modelos',
                            body: 'Q̄* ≈ 3.8×10⁻⁴ m³/s (−62 % vs Q₀ = 3.6 m³/h). El optimizador reduce el caudal de forma uniforme; la restricción del tanque S ∈ [0, 2 000] m³ se satisface en todos los pasos.',
                        },
                    ].map(({ color, title, body }) => (
                        <div key={title} style={{
                            flex: 1, padding: '8px 14px', borderRadius: 7,
                            background: `${color}0a`, border: `1px solid ${color}30`,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}>
                            <div style={{ color, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                            <div style={{ color: 'var(--sl-text)', fontSize: 18, lineHeight: 1.4 }}>{body}</div>
                        </div>
                    ))}
            </div>
        </SlideLayout>
    );
};

export default A3S17;
