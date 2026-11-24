import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { VERIF } from './verificacion.js';

// Verificación del gradiente adjunto en las seis implementaciones (data/output/verificacion_adjunto/*_alm1.json):
// error relativo de la derivada direccional del adjunto frente a diferencias centradas con pasos η = 10⁻² y 3·10⁻³,
// un par de puntos por dirección d, en escala log. Si el error es de las diferencias finitas, baja (10/3)² ≈ 11 veces.
const MOD = [['adr', 'ADR'], ['mrmt_semi', 'MRMT semi'], ['mrmt_block', 'MRMT bloque']];
const BK = [['bfr', 'RBF-FD', '#0F7A85'], ['fenicsx', 'Elementos finitos', '#10243E']];
const LO = -10.5, HI = -2.5;

const eqError = String.raw`e(\mathbf d)=\frac{\Big|\,\nabla\hat J(\mathbf u)\cdot\mathbf d\;-\;\dfrac{\hat J(\mathbf u+\eta\,\mathbf d)-\hat J(\mathbf u-\eta\,\mathbf d)}{2\eta}\,\Big|}{\big|\nabla\hat J(\mathbf u)\cdot\mathbf d\big|}`;

// cociente medio (geométrico) entre los errores con η = 10⁻² y con η = 3·10⁻³ de un grupo
function cociente(filas) {
    const a = filas.filter(r => r.eps === 0.01), b = filas.filter(r => r.eps !== 0.01);
    if (!a.length || !b.length) return null;
    const lg = v => v.reduce((s, r) => s + Math.log10(r.err), 0) / v.length;
    return 10 ** (lg(a) - lg(b));
}

export default function A3D11({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(3000, 300);
    const W = 1240, H = 380, L = 96, B = 66, T = 14;
    const sy = e => T + (HI - Math.log10(e)) / (HI - LO) * (H - T - B);
    const grupos = BK.flatMap(([b, nb, c]) => MOD.map(([m, nm]) => ({ b, nb, c, m, nm })));
    const ancho = (W - L - 20) / grupos.length;
    return (
        <SlideLayout title="Verificación: el gradiente adjunto coincide con diferencias finitas" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 30, alignItems: 'center' }}>
                <Eq math={eqError} compacta />
                <p style={txt}>
                    Para una dirección <InlineMath math="\mathbf d" /> se compara la derivada que da el adjunto con la de diferencias
                    centradas de paso <InlineMath math="\eta" />. Si el adjunto es exacto, solo queda el error de las diferencias,
                    proporcional a <InlineMath math="\eta^2" />.
                </p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', cursor: 'pointer' }} onClick={repetir}>
                {[-10, -8, -6, -4].map(e => (
                    <g key={e}>
                        <line x1={L} x2={W - 20} y1={sy(10 ** e)} y2={sy(10 ** e)} stroke="#6E7F8D" strokeOpacity="0.2" />
                        <text x={L - 10} y={sy(10 ** e) + 5} textAnchor="end" style={eje}>10<tspan dy="-8" fontSize="11">{e}</tspan></text>
                    </g>
                ))}
                <text x={18} y={sy(10 ** -6.5)} transform={`rotate(-90 18 ${sy(10 ** -6.5)})`} textAnchor="middle" style={eje}>error relativo e(d)</text>
                {grupos.map((g, i) => {
                    const x0 = L + i * ancho;
                    const filas = VERIF.filter(r => r.backend === g.b && r.modelo === g.m);
                    const dirs = [...new Set(filas.map(r => r.direccion))];
                    const v = suave(tramo(p, 0.08 * i, 0.08 * i + 0.4));
                    const y = e => sy(10 ** HI) + v * (sy(e) - sy(10 ** HI));
                    const q = cociente(filas);
                    return (
                        <g key={`${g.b}-${g.m}`}>
                            {dirs.map((dname, k) => {
                                const a = filas.find(r => r.direccion === dname && r.eps === 0.01);
                                const b = filas.find(r => r.direccion === dname && r.eps !== 0.01);
                                const xa = x0 + 0.22 * ancho + k * 11, xb = x0 + 0.58 * ancho + k * 11;
                                return (
                                    <g key={dname}>
                                        {a && b && <line x1={xa} y1={y(a.err)} x2={xb} y2={y(b.err)} stroke={g.c} strokeOpacity="0.35" strokeWidth="1.5" />}
                                        {a && <circle cx={xa} cy={y(a.err)} r="7" fill="none" stroke={g.c} strokeWidth="2.2" />}
                                        {b && <circle cx={xb} cy={y(b.err)} r="7" fill={g.c} stroke={g.c} strokeWidth="2.2" />}
                                    </g>
                                );
                            })}
                            {g.b === 'bfr' && q && (
                                <text x={x0 + ancho / 2} y={sy(1e-3) - 4} textAnchor="middle" style={{ ...eje, fill: g.c, fontSize: 16, opacity: tramo(p, 0.6, 0.8) }}>
                                    baja {q.toFixed(0)} veces
                                </text>
                            )}
                            <text x={x0 + ancho / 2} y={H - B + 24} textAnchor="middle" style={{ ...eje, fill: 'var(--sl-text)', fontSize: 16 }}>{g.nm}</text>
                            {i % 3 === 1 && <text x={x0 + ancho / 2} y={H - B + 50} textAnchor="middle" style={{ ...eje, fill: g.c, fontSize: 17 }}>{g.nb}</text>}
                            {i === 3 && <line x1={x0} x2={x0} y1={T} y2={H - B + 48} stroke="#6E7F8D" strokeOpacity="0.4" />}
                        </g>
                    );
                })}
                <text x={L + 4.5 * ancho} y={sy(10 ** -5.1)} textAnchor="middle" style={{ ...eje, fill: '#10243E', fontSize: 16, opacity: tramo(p, 0.7, 0.9) }}>
                    nivel del redondeo: no depende de η
                </text>
            </svg>
            <div style={{ display: 'flex', gap: 34, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', margin: '2px 0 0' }}>
                <span>○ η = 10⁻²</span><span>● η = 3·10⁻³</span>
                <span>cada par unido es una dirección: Q uniforme, Q aleatoria, (Q, z<sub>p</sub>) aleatoria, −∇Ĵ (en ADR solo η = 10⁻²)</span>
            </div>
            <p style={{ ...txt, marginTop: 10 }}>
                En RBF-FD el error baja 11 veces al pasar de <InlineMath math="\eta=10^{-2}" /> a <InlineMath math="3\cdot10^{-3}" />:
                justo <InlineMath math="(10/3)^2" />, lo que predice el error de las diferencias centradas. El error es de las diferencias
                finitas, no del adjunto. En elementos finitos todo está en <InlineMath math="10^{-10}" />–<InlineMath math="10^{-7}" />, el
                redondeo de los solucionadores.
            </p>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const txt = { margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 };
