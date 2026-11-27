import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, RefEc } from '../slides-avance3/ui.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { VERIF } from '../slides-avance3/verificacion.js';
import { BLOQUE } from './optimoBloque.js';

// Verificación del gradiente adjunto (versión simplificada; explica de nuevo slides-avance3/A3D11.jsx, solo MRMT por
// bloques con elementos finitos). Qué se compara: la derivada direccional de Ĵ en u⁰ a lo largo de d, (i) con el
// gradiente adjunto, ∇Ĵ(u⁰)·(s⊙d), y (ii) con el cociente centrado de dos resoluciones del estado. Dos configuraciones:
// la prueba corta de tests/test_gradiente_modelo_nuevo.py (3 pasos de 10 h, C₀ ≡ 1, N_r = 2, malla gruesa; VERIF de
// slides-avance3/verificacion.js, backend fenicsx, mrmt_block) y la de la optimización (72 pasos, 73 controles, N_r = 3,
// pluma de nitrato, malla con eje; BLOQUE.verificacion de scripts/exportar_simplificada.py verificar).
const PRUEBA = VERIF.filter(r => r.backend === 'fenicsx' && r.modelo === 'mrmt_block');
const REAL = BLOQUE.verificacion || [];
const NOMBRE = { '-grad': '−∇Ĵ', grad: '−∇Ĵ', azar: 'al azar', 'Q uniforme': 'Q unif.', 'Q aleatoria': 'Q azar', '(Q,zp) aleatoria': '(Q, z) azar' };

const eqAdj = String.raw`\text{adjunto:}\quad \hat J'(u^0;d)=\nabla\hat J(u^0)\cdot(s\odot d)`;
const eqFD = String.raw`\text{diferencias:}\quad \frac{\hat J(u^0+\delta\,s\odot d)-\hat J(u^0-\delta\,s\odot d)}{2\delta}=\hat J'(u^0;d)+O(\delta^2)`;
const eqErr = String.raw`e(d,\delta)=\frac{|\text{adjunto}-\text{diferencias}|}{|\text{diferencias}|}`;

// e por dirección y paso en escala logarítmica: ○ δ = 10⁻², ● δ menor, unidos por dirección.
function Grafica() {
    const W = 560, H = 330, L = 66, B = 56, T = 16;
    const ly0 = -11, ly1 = -1;
    const sy = (e) => T + (H - T - B) * (ly1 - Math.log10(Math.max(e, 10 ** ly0))) / (ly1 - ly0);
    const grupos = [
        { t: 'prueba corta', sub: '3 pasos, C₀ ≡ 1', filas: PRUEBA, x0: L + 30, x1: L + 210 },
        { t: 'configuración real', sub: '72 pasos, 73 controles', filas: REAL, x0: L + 270, x1: W - 30 },
    ];
    const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
            {[-10, -8, -6, -4, -2].map(k => (
                <g key={k}>
                    <line x1={L} x2={W - 10} y1={sy(10 ** k)} y2={sy(10 ** k)} stroke="var(--a3-filete)" strokeWidth="0.7" />
                    <text x={L - 8} y={sy(10 ** k) + 5} textAnchor="end" style={eje}>10<tspan dy="-6" fontSize="10">{k}</tspan></text>
                </g>
            ))}
            <line x1={L} x2={L} y1={T} y2={H - B} stroke="var(--sl-text)" />
            <text x={L + 4} y={T - 2} style={{ ...eje, fill: 'var(--sl-text)' }}>error relativo e [–]</text>
            {grupos.map((gr, gi) => {
                const dirs = [...new Set(gr.filas.map(r => r.direccion))];
                return (
                    <g key={gi}>
                        <text x={(gr.x0 + gr.x1) / 2} y={H - B + 22} textAnchor="middle" style={{ ...eje, fill: 'var(--sl-text)' }}>{gr.t}</text>
                        <text x={(gr.x0 + gr.x1) / 2} y={H - B + 40} textAnchor="middle" style={eje}>{gr.sub}</text>
                        {!gr.filas.length && <text x={(gr.x0 + gr.x1) / 2} y={sy(1e-6)} textAnchor="middle" style={{ ...eje, fill: 'var(--a3-pluma)' }}>pendiente</text>}
                        {dirs.map((d, k) => {
                            const x = gr.x0 + (gr.x1 - gr.x0) * (dirs.length > 1 ? k / (dirs.length - 1) : 0.5);
                            const fs = gr.filas.filter(r => r.direccion === d).sort((a, b) => (b.eps ?? b.delta) - (a.eps ?? a.delta));
                            return (
                                <g key={d}>
                                    {fs.length > 1 && <line x1={x} x2={x} y1={sy(fs[0].err)} y2={sy(fs[fs.length - 1].err)} stroke="var(--a3-valido)" strokeWidth="1.5" />}
                                    {fs.map((r, i) => <circle key={i} cx={x} cy={sy(r.err)} r="5.5" fill={i ? 'var(--a3-valido)' : 'var(--sl-bg)'} stroke="var(--a3-valido)" strokeWidth="2" />)}
                                    <text x={x} y={H - B + 6} textAnchor="middle" style={{ ...eje, fontSize: 11 }}>{NOMBRE[d] || d}</text>
                                </g>
                            );
                        })}
                    </g>
                );
            })}
            <line x1={L + 240} x2={L + 240} y1={T} y2={H - B} stroke="var(--a3-filete)" strokeDasharray="3 3" />
            <g transform={`translate(${W - 190}, ${T + 4})`} style={eje}>
                <circle cx={6} cy={0} r={5} fill="var(--sl-bg)" stroke="var(--a3-valido)" strokeWidth="2" /><text x={16} y={5} style={eje}>δ = 10⁻²</text>
                <circle cx={96} cy={0} r={5} fill="var(--a3-valido)" stroke="var(--a3-valido)" strokeWidth="2" /><text x={106} y={5} style={eje}>δ = 3·10⁻³</text>
            </g>
        </svg>
    );
}

const Paso = ({ n, children }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--a3-sans)', fontWeight: 700, color: 'var(--a3-agua)', fontSize: 'var(--a3-fs-etiqueta)' }}>{n}</span>
        <div style={{ flex: 1, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>{children}</div>
    </div>
);

export default function A3R09({ theme = 'dark' }) {
    const eReal = REAL.map(r => r.err);
    return (
        <SlideLayout title="Verificación del gradiente: ¿el adjunto da la derivada de Ĵ?" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 30, flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Paso n="1">Se elige una dirección <InlineMath math="d" /> en el espacio de los 73 controles y un paso <InlineMath math="\delta" />.</Paso>
                    <Paso n="2">Se calcula la pendiente de <InlineMath math="\hat J" /> a lo largo de <InlineMath math="d" /> de dos maneras:
                        <Eq math={eqAdj} compacta />
                        <Eq math={eqFD} id="fd-centradas" compacta />
                    </Paso>
                    <Paso n="3">Se comparan: <InlineMath math={eqErr} />.</Paso>
                    <Paso n="4">
                        Si el adjunto es correcto, <InlineMath math="e" /> baja con <InlineMath math="\delta" /> o se queda en el redondeo;
                        un término olvidado dejaría <InlineMath math="e" /> fijo, igual para los dos pasos.
                    </Paso>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}><Grafica /></div>
            </div>
            <p style={{ margin: '8px 0 0', padding: '8px 14px', borderLeft: '5px solid var(--a3-valido)', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                {eReal.length
                    ? <>En la configuración real, <InlineMath math="e\le" /> {Math.max(...eReal).toExponential(1).replace('e-', '·10⁻').replace(/⁻0?(\d)/, (a, d) => '⁻' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}: </>
                    : null}
                el gradiente adjunto es la derivada del <InlineMath math="\hat J" /> discreto respecto al control.
                <span className="a3-completa"> Verifica las derivadas, no el error de la malla ni del paso de tiempo.</span>
            </p>
            <Notas titulo="Qué se verifica exactamente">
                <p>
                    Se comparan dos números por cada dirección, no dos vectores: el producto del gradiente adjunto con la dirección (un solo gradiente sirve
                    para todas las direcciones) y el cociente centrado <RefEc id="fd-centradas" />, que cuesta dos resoluciones del estado por cada par{' '}
                    <InlineMath math="(d,\delta)" />. <InlineMath math="s" /> escala los controles: <InlineMath math="Q_{\max}" /> para los caudales y 100 m para{' '}
                    <InlineMath math="z_p" /> en la configuración real (<InlineMath math="\max Q^0" /> y 1 m en la prueba corta); <InlineMath math="d" /> es unitario y{' '}
                    <InlineMath math="\delta" /> adimensional.
                </p>
                <p>
                    El error del cociente centrado es <InlineMath math="O(\delta^2)" />: si todo el desacuerdo es de las diferencias finitas, al pasar de{' '}
                    <InlineMath math="\delta=10^{-2}" /> a <InlineMath math="3\cdot10^{-3}" /> el error baja unas 11 veces. Por debajo de ~10⁻⁸ domina el
                    redondeo de las dos resoluciones y el error ya no baja. Un error en el adjunto (un término olvidado) daría el mismo <InlineMath math="e" />{' '}
                    con los dos pasos.
                </p>
                <p>
                    Prueba corta: 3 pasos de 10 h, <InlineMath math="C_0\equiv1" />, dos regiones inmóviles y malla gruesa; cuatro direcciones (−∇Ĵ, Q
                    uniforme, Q al azar y (Q, z_p) al azar). Configuración real: la de la optimización en el control inicial, dirección −∇Ĵ escalada y una al
                    azar. En la real también se comparó solo el término de calidad <InlineMath math="J_m" /> (el resto del funcional es analítico):{' '}
                    {REAL.length ? `e(J_m) ≤ ${Math.max(...REAL.map(r => r.err_J1)).toExponential(1)}` : 'pendiente'}.
                </p>
                <p>
                    Conclusión: el código deriva exactamente el funcional discreto que optimiza (primero se discretiza y luego se deriva). No dice que{' '}
                    <InlineMath math="\hat J" /> discreto esté cerca del continuo: eso depende de la malla y del paso de tiempo.
                </p>
            </Notas>
        </SlideLayout>
    );
}

A3R09.ecuaciones = ['fd-centradas'];
