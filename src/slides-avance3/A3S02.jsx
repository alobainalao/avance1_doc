import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { POLIGONO, POZO, FUENTE, X, Z } from './escena.jsx';
import { ESQ } from './esquema.js';

// Dominio físico y parámetros: corte vertical con la porosidad interpolada de los sondeos (bandas de esquema.js, las mismas
// de la apertura), fronteras, pozo en su profundidad inicial y fuente. Valores de config/nitrato_vscale_malla_eje_g1.json.
const AGUA = '#0F7A85', PLUMA = '#C4511F';
const M = (t) => <InlineMath math={t} />;

const geo = [
    ['Ancho', '9 939 m (sondeos 6 a 2, SO → NE)'],
    ['Superficie', M(String.raw`z = 250.5`), ' m'],
    ['Fondo', '−2 690.5 m (SO) a −768.5 m (NE)'],
    ['Pozo', <>{M('x_p = 3\\,700')} m; {M('z_p^0=-700')} m (inicial; {M('z_p')} es control)</>],
    ['Fuente de nitrato', <>{M('(x_s, z_s) = (9\\,116,\\ 109)')} m</>],
];
const fis = [
    ['Porosidad', <>{M('\\phi\\in[0.03,\\,0.95]')}: 4 sondeos, capas A–E</>],
    ['Conductividad', <>Kozeny–Carman {M('K_z(\\phi)')}, grano de 1 mm; {M('K_x=4K_z')}</>],
    ['Dispersividades', <>{M('\\alpha_L=10')} m, {M('\\alpha_T=1')} m</>],
    ['Mallas', '20 348 nodos (comparación directa); 25 871 (optimización, eje del pozo a 1 m)'],
    ['Tiempo', <>{M('T=30')} días; {M('\\Delta t=5')} h (comparación directa), 10 h (optimización)</>],
];

const Tabla = ({ titulo, filas }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>{titulo}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
            <tbody>
                {filas.map(([n, v, u], i) => (
                    <tr key={i} style={{ borderTop: i ? '1px solid var(--a3-filete)' : 'none' }}>
                        <td style={{ padding: '5px 10px 5px 0', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', whiteSpace: 'nowrap' }}>{n}</td>
                        <td style={{ padding: '5px 0', color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)' }}>{v}{u}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function A3S02({ theme = 'dark' }) {
    const etq = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
    return (
        <SlideLayout title="Dominio físico y parámetros" theme={theme} justify="flex-start">
            <svg viewBox="-20 -34 1040 362" style={{ width: '100%', display: 'block' }}>
                <defs><clipPath id="s02-clip"><polygon points={POLIGONO} /></clipPath></defs>
                <g clipPath="url(#s02-clip)">
                    {ESQ.phi.bandas.map((d, i) => <path key={i} d={d} fill={AGUA} fillOpacity={0.05 + 0.13 * i} />)}
                </g>
                <polygon points={POLIGONO} fill="none" stroke="var(--sl-text)" strokeWidth="1.6" />
                {/* fronteras */}
                <line x1={1000} y1={0} x2={1000} y2={Z(-768.5)} stroke={AGUA} strokeWidth="5" />
                <line x1={0} y1={0} x2={0} y2={Z(-2690.5)} stroke={PLUMA} strokeWidth="5" />
                <text x={992} y={Z(-768.5) + 22} textAnchor="end" style={{ ...etq, fill: AGUA }}>Γ<tspan dy="5" fontSize="12">in</tspan><tspan dy="-5">: entrada</tspan></text>
                <text x={10} y={Z(-1900)} style={{ ...etq, fill: PLUMA }}>Γ<tspan dy="5" fontSize="12">out</tspan><tspan dy="-5">: salida libre</tspan></text>
                <text x={500} y={-10} textAnchor="middle" style={etq}>Γ<tspan dy="5" fontSize="12">wall</tspan><tspan dy="-5">: superficie y fondo, sin flujo</tspan></text>
                {/* pozo inicial y fuente */}
                <line x1={X(POZO.x)} y1={0} x2={X(POZO.x)} y2={Z(POZO.z)} stroke={AGUA} strokeWidth="4" />
                <circle cx={X(POZO.x)} cy={Z(POZO.z)} r="7" fill={AGUA} />
                <text x={X(POZO.x) + 12} y={Z(POZO.z) + 6} style={{ ...etq, fill: 'var(--sl-text)' }}>pozo, z<tspan dy="5" fontSize="12">p</tspan><tspan dy="-5">⁰ = −700 m</tspan></text>
                <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r="7" fill={PLUMA} />
                <text x={X(FUENTE.x) - 12} y={Z(FUENTE.z) + 26} textAnchor="end" style={{ ...etq, fill: PLUMA }}>fuente de nitrato</text>
                {/* leyenda de φ */}
                <text x={700} y={Z(-1500)} style={etq}>porosidad φ</text>
                {[0, 1, 2, 3, 4].map(i => <rect key={i} x={700 + 40 * i} y={Z(-1500) + 8} width={40} height={14} fill={AGUA} fillOpacity={0.05 + 0.13 * i} stroke="var(--sl-muted)" strokeWidth="0.5" />)}
                {[0, 0.4, 0.8].map((v, i) => <text key={v} x={700 + 80 * i} y={Z(-1500) + 40} textAnchor="middle" style={{ ...etq, fontSize: 13 }}>{v}</text>)}
                <text x={900} y={Z(-1500) + 40} textAnchor="end" style={{ ...etq, fontSize: 13 }}>1</text>
                <text x={500} y={322} textAnchor="middle" style={{ ...etq, fontSize: 13 }}>sin exageración vertical</text>
            </svg>
            <div style={{ display: 'flex', gap: 40, marginTop: 8 }}>
                <Tabla titulo="Geometría" filas={geo} />
                <Tabla titulo="Física y discretización" filas={fis} />
            </div>
        </SlideLayout>
    );
}
