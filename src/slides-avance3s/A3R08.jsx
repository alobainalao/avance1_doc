import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from '../slides-avance3/ui.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { OPT } from '../slides-avance3/optimoNitrato.js';
import { BLOQUE } from './optimoBloque.js';

// Sensibilidad y costo del gradiente (versión simplificada; sustituye a slides-avance3/A3D07.jsx sin la curva del paso δ ni
// la animación de cuadros). Arriba, el gradiente real en el control inicial de la optimización por bloques
// (BLOQUE.grad0: scripts/exportar_simplificada.py campos inicial … --adjunto). Conteo de resoluciones de EDP por gradiente
// según fenicsx/adjoint.py: diferencias hacia adelante 1 + 73 (no están en el optimizador, solo en las pruebas); adjunto,
// estado + adjunto = 2 en teoría; la implementación hace 3 (jac vuelve a resolver el estado: adjoint.py:854-856).
const DIAS = OPT.dt / 86400;
const NQ = BLOQUE.Q.length;
const eqFD = String.raw`\frac{\partial\hat J}{\partial u_i}\approx\frac{\hat J(u+\delta\,e_i)-\hat J(u)}{\delta},\qquad i=1,\dots,73`;
const eqAdj = String.raw`\nabla\hat J(u)=\frac{\partial J}{\partial u}+\Big(\frac{\partial R}{\partial u}\Big)^{\!\top}\psi,\qquad \Big(\frac{\partial R}{\partial y}\Big)^{\!\top}\psi=-\frac{\partial J}{\partial y}`;

// Barras ∂Ĵ/∂Q_n en el control inicial [1/(m²/s)], una por paso de 10 h; eje con marcas redondas.
function Barras({ g }) {
    const W = 560, H = 240, L = 70, B = 40, T = 30;
    const v = g.slice(0, NQ), lo = Math.min(0, ...v), hi = Math.max(0, ...v);
    const paso = (() => { const r = (hi - lo) / 3, p = 10 ** Math.floor(Math.log10(r)); return [1, 2, 5, 10].map(m => m * p).find(m => m >= r); })();
    const y0 = Math.floor(lo / paso) * paso, y1 = Math.ceil(hi / paso) * paso;
    const sy = (y) => T + (H - T - B) * (y1 - y) / (y1 - y0);
    const sx = (k) => L + (W - L - 10) * k / NQ;
    const cero = sy(0), eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
    const marcas = []; for (let y = y0; y <= y1 + paso / 2; y += paso) marcas.push(y);
    const dec = Math.max(0, -Math.floor(Math.log10(paso) + 1e-9));
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
            {marcas.map(y => (
                <g key={y}>
                    <line x1={L} x2={W - 10} y1={sy(y)} y2={sy(y)} stroke="var(--a3-filete)" strokeWidth="0.7" />
                    <text x={L - 7} y={sy(y) + 5} textAnchor="end" style={eje}>{y.toFixed(dec)}</text>
                </g>
            ))}
            {v.map((y, k) => (
                <rect key={k} x={sx(k) + 0.6} width={(W - L - 10) / NQ - 1.2} y={Math.min(sy(y), cero)} height={Math.abs(sy(y) - cero)}
                      fill={y >= 0 ? 'var(--a3-pluma)' : 'var(--a3-agua)'} />
            ))}
            <line x1={L} x2={W - 10} y1={cero} y2={cero} stroke="var(--sl-text)" strokeWidth="1" />
            <line x1={L} x2={L} y1={T} y2={H - B} stroke="var(--sl-text)" strokeWidth="1" />
            {[0, 10, 20, 30].map(d => (
                <g key={d}>
                    <line x1={sx(d / DIAS)} x2={sx(d / DIAS)} y1={H - B} y2={H - B + 4} stroke="var(--sl-text)" />
                    <text x={sx(d / DIAS)} y={H - B + 19} textAnchor="middle" style={eje}>{d}</text>
                </g>
            ))}
            <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={eje}>t [días]</text>
            <text x={L} y={T - 12} style={{ ...eje, fill: 'var(--sl-text)' }}>∂Ĵ/∂Q<tspan dy="4" fontSize="10">n</tspan><tspan dy="-4"> [1/(m²/s)]</tspan></text>
        </svg>
    );
}

const Bloque = ({ color, titulo, children }) => (
    <div style={{ flex: 1, borderLeft: `5px solid ${color}`, padding: '6px 0 6px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ margin: 0, fontSize: 'var(--a3-fs-seccion)', color }}>{titulo}</p>
        {children}
    </div>
);
const Cifra = ({ n, texto, color }) => (
    <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: 12, color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)' }}>
        <span style={{ fontSize: 46, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</span>{texto}
    </p>
);

export default function A3R08({ theme = 'dark' }) {
    const g = BLOQUE.grad0;
    return (
        <SlideLayout title="Sensibilidad: el gradiente de Ĵ y su costo" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 8px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                Optimizar exige <InlineMath math="\nabla\hat J" />: cuánto cambia <InlineMath math="\hat J" /> al mover cada uno de los 73 controles{' '}
                <InlineMath math="(Q_1,\dots,Q_{72},z_p)" />, a través del estado <InlineMath math="y=(h,C_m,C_{{\rm im},r})" />.
            </p>
            <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>
                        Sensibilidad en el control inicial (MRMT por bloques)
                    </p>
                    {g ? <Barras g={g} /> : <p style={{ color: 'var(--a3-pluma)', fontFamily: 'var(--a3-sans)' }}>pendiente: gradiente en el control inicial</p>}
                    {g && (
                        <p style={{ margin: '2px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-text)' }}>
                            y una más para la profundidad: <InlineMath math={`\\partial\\hat J/\\partial z_p=${g[NQ].toExponential(2).replace(/e([+-]\d+)/, (a, e) => `\\cdot10^{${Number(e)}}`)}`} /> [1/m]
                        </p>
                    )}
                </div>
                <div style={{ flex: 1.15, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Bloque color="var(--a3-pluma)" titulo="Diferencias finitas">
                        <Eq math={eqFD} id="fd" compacta />
                        <Cifra n="73" color="var(--a3-pluma)" texto={<>resoluciones del estado extra, una por control<span className="a3-completa"> (146 centradas)</span></>} />
                    </Bloque>
                    <Bloque color="var(--a3-valido)" titulo="Método adjunto">
                        <Eq math={eqAdj} compacta />
                        <Cifra n="2" color="var(--a3-valido)" texto={<>resoluciones por gradiente: estado (adelante) y adjunto (atrás), con 73 o con más controles</>} />
                    </Bloque>
                </div>
            </div>
            <p style={{ margin: '12px 0 0', padding: '8px 14px', borderLeft: '5px solid var(--a3-valido)', background: 'var(--sl-surface, transparent)',
                        fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>
                El adjunto evita resolver un problema adicional por cada componente del control.
                <span className="a3-completa"> En la implementación actual cada punto cuesta 3 (el estado se resuelve otra vez al pedir el gradiente); guardarlo lo deja en 2.</span>
            </p>
            <Notas titulo="Conteo de resoluciones y costos que no entran">
                <p>
                    Por gradiente, con <InlineMath math="\hat J(u)" /> ya calculado: diferencias hacia adelante, 73 resoluciones del estado (una por{' '}
                    <InlineMath math="u+\delta e_i" />); centradas, 146. El optimizador no usa diferencias finitas: solo aparecen en las pruebas del gradiente.
                    El adjunto resuelve una vez el estado hacia adelante y una vez el sistema adjunto hacia atrás <Cita k="manzoni2021optimal" />.
                </p>
                <p>
                    En el código, la función objetivo y el gradiente se piden por separado y el gradiente vuelve a resolver el estado: cada punto evaluado
                    cuesta 2 directas y 1 adjunta. En la corrida por bloques de la serie 33 hubo 42 evaluaciones de Ĵ y 42 de ∇Ĵ en 51 iteraciones
                    (6 en pasos rechazados) más 6 directas fuera del bucle: 132 resoluciones.
                </p>
                <p>
                    Costos que no entran en la comparación: los pasos rechazados (se evalúan igual), la proyección para la medida de criticidad χ (un
                    problema cuadrático de 73 variables, unos 2 s por iteración), el subproblema de la región de confianza y la matriz BFGS de 73 × 73 (sin
                    EDP), la memoria del estado completo para el adjunto (unos 75 MB) y que un paso del adjunto ensambla más matrices que uno del estado.
                </p>
            </Notas>
        </SlideLayout>
    );
}

A3R08.ecuaciones = ['fd'];
