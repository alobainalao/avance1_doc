import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo, suave, lerp } from './anim.js';

// Criterio de paro por la medida de criticidad (tesis, Cap. III, eq:criticidad). Izquierda: esquema en 2D de un paso
// de gradiente proyectado sobre un poliedro, en un punto no estacionario y en un vértice KKT. Derecha: Ĵ (modelo MRMT
// bloque) sobre el segmento entre los puntos donde el criterio por defecto de scipy (gtol) paró MRMT bloque y MRMT semi
// en la primera corrida (codigo/data/output/optimizacion_nitrato_vscale_malla_g1/cruce_optimos.json y trust_gtol/).
const AGUA = '#0F7A85', PLUMA = '#C4511F', VALIDO = '#2E7D4F', GRIS = '#6E7F8D';
const POLI = [[70, 330], [120, 110], [300, 60], [420, 170], [380, 320]];

// proyección euclídea sobre un polígono convexo (punto interior o el más cercano del borde)
function proyectar([x, y]) {
    const dentro = POLI.every((a, i) => {
        const b = POLI[(i + 1) % POLI.length];
        return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) >= 0;
    });
    if (dentro) return [x, y];
    let mejor = null, dmin = Infinity;
    POLI.forEach((a, i) => {
        const b = POLI[(i + 1) % POLI.length], dx = b[0] - a[0], dy = b[1] - a[1];
        const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
        const q = [a[0] + t * dx, a[1] + t * dy], d = Math.hypot(q[0] - x, q[1] - y);
        if (d < dmin) { dmin = d; mejor = q; }
    });
    return mejor;
}

const CASOS = [
    { x: [300, 250], g: [-170, 200], color: PLUMA, nombre: 'no es óptimo', d: 'la proyección se mueve: χ > 0' },
    { x: [420, 170], g: [-96, 28], color: VALIDO, nombre: 'óptimo (KKT)', d: 'la proyección regresa: χ = 0' },
];

// Un caso: paso de gradiente desde u_k (punteado), proyección de vuelta a U_ad (línea fina) y χ (segmento grueso).
function Caso({ c, f, i }) {
    const y = [c.x[0] - c.g[0], c.x[1] - c.g[1]], P = proyectar(y);
    const yf = [lerp(c.x[0], y[0], Math.min(1, 2 * f)), lerp(c.x[1], y[1], Math.min(1, 2 * f))];
    const Pf = f > 0.5 ? [lerp(y[0], P[0], 2 * f - 1), lerp(y[1], P[1], 2 * f - 1)] : null;
    const chi = Math.hypot(P[0] - c.x[0], P[1] - c.x[1]);
    if (f <= 0) return null;
    return (
        <g>
            <line x1={c.x[0]} y1={c.x[1]} x2={yf[0]} y2={yf[1]} stroke={GRIS} strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#cr-flecha)" />
            {f >= 0.5 && <circle cx={y[0]} cy={y[1]} r="5" fill="none" stroke={GRIS} strokeWidth="2" />}
            {f >= 0.5 && <text x={y[0] + 10} y={y[1] + (i ? -8 : 18)} style={eje}>u<tspan dy="5" fontSize="11">k</tspan><tspan dy="-5"> − ∇Ĵ</tspan></text>}
            {Pf && <line x1={y[0]} y1={y[1]} x2={Pf[0]} y2={Pf[1]} stroke={GRIS} strokeWidth="1.5" />}
            {f >= 1 && chi > 1 && <line x1={c.x[0]} y1={c.x[1]} x2={P[0]} y2={P[1]} stroke={c.color} strokeWidth="5" />}
            {f >= 1 && <circle cx={P[0]} cy={P[1]} r="6" fill={c.color} />}
            <circle cx={c.x[0]} cy={c.x[1]} r="8" fill="var(--sl-bg, #fff)" stroke={c.color} strokeWidth="3" />
            <text x={c.x[0] + (i ? 14 : -16)} y={c.x[1] + (i ? -12 : 26)} textAnchor={i ? 'start' : 'end'} style={{ ...eje, fill: c.color }}>
                u<tspan dy="5" fontSize="11">k</tspan>
            </text>
        </g>
    );
}

function Esquema({ p }) {
    const fa = suave(tramo(p, 0.05, 0.4)), fb = suave(tramo(p, 0.5, 0.85));
    return (
        <svg viewBox="0 0 640 430" style={{ width: '100%' }}>
            <defs>
                <marker id="cr-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={GRIS} />
                </marker>
            </defs>
            <polygon points={POLI.map(q => q.join(',')).join(' ')} fill={AGUA} fillOpacity="0.1" stroke={AGUA} strokeWidth="2" />
            <text x={150} y={250} style={{ ...eje, fontSize: 20, fill: AGUA, fontStyle: 'italic' }}>U<tspan dy="6" fontSize="14">ad</tspan></text>
            <Caso c={CASOS[0]} f={fa} i={0} />
            <Caso c={CASOS[1]} f={fb} i={1} />
            {CASOS.map((c, i) => (
                <text key={i} x={20} y={388 + 26 * i} style={{ ...eje, fontSize: 17, fill: c.color, opacity: tramo(i ? fb : fa, 0.95, 1) }}>
                    {c.nombre}: {c.d}
                </text>
            ))}
        </svg>
    );
}

// Ĵ en el modelo MRMT bloque a lo largo del segmento x_bloque → x_semi (cruce_optimos.json)
const SEG = [0.47350, 0.46916, 0.46629, 0.46338, 0.46162];

function Segmento({ p }) {
    const W = 520, H = 300, a = 0.459, b = 0.475, f = suave(tramo(p, 0.1, 0.6));
    const sx = i => 60 + i / 4 * (W - 90), sy = v => 20 + (b - v) / (b - a) * (H - 70);
    const k = Math.max(1, Math.round(f * 4));
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[0.462, 0.466, 0.470, 0.474].map(v => (
                <g key={v}><line x1={60} x2={W - 20} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={52} y={sy(v) + 5} textAnchor="end" style={eje}>{v.toFixed(3)}</text></g>
            ))}
            <polyline points={SEG.slice(0, k + 1).map((v, i) => `${sx(i)},${sy(v)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="3" />
            {SEG.slice(0, k + 1).map((v, i) => <circle key={i} cx={sx(i)} cy={sy(v)} r="5" fill={AGUA} />)}
            <circle cx={sx(0)} cy={sy(SEG[0])} r="9" fill="none" stroke={PLUMA} strokeWidth="3" />
            <text x={sx(0) + 14} y={sy(SEG[0]) + 5} style={{ ...eje, fill: PLUMA }}>scipy paró aquí (MRMT bloque)</text>
            <text x={sx(4)} y={sy(SEG[4]) + 28} textAnchor="end" style={{ ...eje, fill: VALIDO, opacity: tramo(p, 0.6, 0.7) }}>punto de MRMT semi, Ĵ menor</text>
            <text x={sx(0)} y={H - 18} style={eje}>z<tspan dy="5" fontSize="11">p</tspan><tspan dy="-5"> = −469 m</tspan></text>
            <text x={sx(4)} y={H - 18} textAnchor="end" style={eje}>z<tspan dy="5" fontSize="11">p</tspan><tspan dy="-5"> = −419 m</tspan></text>
        </svg>
    );
}

const eqChi = String.raw`\chi(\mathbf u_k)=\big\|\,\mathbf u_k-P_{\mathcal U_{ad}}\big(\mathbf u_k-\nabla\hat J(\mathbf u_k)\big)\big\|_\infty,
\qquad \text{se para cuando}\ \ \chi(\mathbf u_k)<10^{-4}`;
const eqKKT = String.raw`\chi(\hat{\mathbf u})=0\iff\nabla\hat J(\hat{\mathbf u})\cdot(\mathbf u-\hat{\mathbf u})\ge 0\quad\forall\,\mathbf u\in\mathcal U_{ad}`;

export default function A3D16({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(9000, 400);
    return (
        <SlideLayout title="¿Cuándo parar? La medida de criticidad" theme={theme} justify="flex-start">
            <p style={{ ...tit, margin: 0 }}>
                Desde el iterado <InlineMath math="\mathbf u_k" /> se da un paso de gradiente y se proyecta de vuelta al conjunto
                admisible; <InlineMath math="\chi" /> mide cuánto se movió el punto:
            </p>
            <Eq math={eqChi} id="criticidad" compacta />
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start', marginTop: 2 }}>
                <div>
                    <p style={tit}>Si ninguna dirección admisible baja <InlineMath math="\hat J" />, el punto regresa a sí mismo</p>
                    <Esquema p={p} />
                    <div className="a3-ec--compacta"><Eq math={eqKKT} compacta /></div>
                    <p style={nota}>Es la condición de optimalidad de la lámina 19. Variables escaladas a [0, 1] para que caudal y
                        profundidad pesen igual en <InlineMath math="\|\cdot\|_\infty" />.</p>
                </div>
                <div>
                    <p style={tit}>¿Por qué no el criterio por defecto de scipy? Primera corrida, modelo MRMT bloque</p>
                    <Segmento p={p} />
                    <p style={nota}>
                        Ĵ de MRMT bloque sobre el segmento entre el punto donde scipy lo detuvo y el punto de MRMT semi. El segmento es
                        admisible (<InlineMath math="\mathcal U_{ad}" /> es convexo) y Ĵ baja en todo él: donde paró no era un mínimo.
                        scipy estima los multiplicadores por mínimos cuadrados sin exigir su signo; con 73 variables y más de 200
                        restricciones, su criterio se cumple lejos del óptimo. χ no usa multiplicadores: basta un problema cuadrático
                        pequeño, sin simulaciones. (Malla con conos, antes de refinar el eje del pozo.)
                    </p>
                </div>
            </div>
        </SlideLayout>
    );
}

A3D16.ecuaciones = ['criticidad'];

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 15, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '6px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.4 };
