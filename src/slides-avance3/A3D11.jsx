import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { VERIF } from './verificacion.js';

// Verificación del gradiente adjunto en las seis implementaciones (data/output/verificacion_adjunto/*_alm1.json):
// error relativo frente a diferencias finitas centradas, por dirección, con ε = 10⁻² y 3·10⁻³, en escala log.
const MOD = [['adr', 'ADR'], ['mrmt_semi', 'MRMT semi'], ['mrmt_block', 'MRMT bloque']];
const BK = [['bfr', 'RBF-FD', '#0F7A85'], ['fenicsx', 'Elementos finitos', '#10243E']];
const LO = -11, HI = -2;

export default function A3D11({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(3000, 300);
    const W = 1240, H = 430, L = 80, B = 70, T = 20;
    const sy = e => T + (HI - Math.log10(e)) / (HI - LO) * (H - T - B);
    const grupos = BK.flatMap(([b, nb, c]) => MOD.map(([m, nm]) => ({ b, nb, c, m, nm })));
    const ancho = (W - L - 20) / grupos.length;
    return (
        <SlideLayout title="Verificación: el gradiente adjunto coincide con diferencias finitas" theme={theme} justify="flex-start">
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', cursor: 'pointer' }} onClick={repetir}>
                {[-10, -8, -6, -4, -2].map(e => (
                    <g key={e}>
                        <line x1={L} x2={W - 20} y1={sy(10 ** e)} y2={sy(10 ** e)} stroke="#6E7F8D" strokeOpacity="0.2" />
                        <text x={L - 10} y={sy(10 ** e) + 5} textAnchor="end" style={eje}>10<tspan dy="-8" fontSize="11">{e}</tspan></text>
                    </g>
                ))}
                <text x={L - 10} y={H - B + 26} textAnchor="end" style={eje}>error</text>
                {grupos.map((g, i) => {
                    const x0 = L + i * ancho;
                    const filas = VERIF.filter(r => r.backend === g.b && r.modelo === g.m);
                    return (
                        <g key={`${g.b}-${g.m}`}>
                            {filas.map((r, k) => {
                                const dx = (r.eps === 0.01 ? 0.3 : 0.7) * ancho + (k % 4 - 1.5) * 9;
                                const v = suave(tramo(p, 0.08 * i, 0.08 * i + 0.4));
                                const y = sy(10 ** HI) + v * (sy(r.err) - sy(10 ** HI));
                                return <circle key={k} cx={x0 + dx} cy={y} r="7" fill={r.eps === 0.01 ? 'none' : g.c} stroke={g.c} strokeWidth="2.2" />;
                            })}
                            <text x={x0 + ancho / 2} y={H - B + 26} textAnchor="middle" style={{ ...eje, fill: 'var(--sl-text)', fontSize: 16 }}>{g.nm}</text>
                            {i % 3 === 1 && <text x={x0 + ancho / 2} y={H - B + 52} textAnchor="middle" style={{ ...eje, fill: g.c, fontSize: 17 }}>{g.nb}</text>}
                            {i === 3 && <line x1={x0} x2={x0} y1={T} y2={H - B + 50} stroke="#6E7F8D" strokeOpacity="0.4" />}
                        </g>
                    );
                })}
            </svg>
            <div style={{ display: 'flex', gap: 34, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', margin: '4px 0 0' }}>
                <span>○ ε = 10⁻²</span><span>● ε = 3·10⁻³</span><span>un punto por dirección: Q uniforme, Q aleatoria, (Q, z_p) aleatoria, …</span>
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                En RBF-FD el error baja ≈ 11 veces al pasar de <InlineMath math="\varepsilon=10^{-2}" /> a <InlineMath math="3\cdot10^{-3}" />, el
                factor <InlineMath math="(10/3)^2" /> de las diferencias centradas: el error es de diferencias finitas y el gradiente adjunto es
                exacto para el funcional discreto. En elementos finitos el error ya está en el redondeo.
            </p>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
