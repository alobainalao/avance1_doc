import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from '../slides-avance3/ui.jsx';
import { POLIGONO, POZO, FUENTE, X, Z } from '../slides-avance3/escena.jsx';
import { ESQ } from '../slides-avance3/esquema.js';
import { usePublica } from '../slides-avance3/version.jsx';
import { INFO } from './mallaConosEje.js';
import { BLOQUE } from './optimoBloque.js';

// Dominio, física y discretización (versión simplificada; reorganiza slides-avance3/A3S02.jsx): toda la geometría va
// sobre la figura (cotas y recuadro arriba a la izquierda) y el resto en dos columnas, física del problema y
// discretización numérica. Valores de config/nitrato_vscale_malla_eje_g1_prom.json (la configuración de la optimización)
// y de fenicsx/adjoint.py (P1/P2, Euler implícito, LU); pozo en z_p⁰ de la serie 33.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)';
const M = (t) => <InlineMath math={t} />;
const Comp = ({ children }) => <span className="a3-completa">{children}</span>;
const miles = (n) => n.toLocaleString('en-US').replace(/,/g, '\u00A0');   // espacio que no corta la cifra
const zp0 = Math.round(BLOQUE.zp0);

const fisica = [
    ['Procesos', <>flujo transitorio con almacenamiento; advección, dispersión e intercambio con tres regiones inmóviles (MRMT)</>],
    ['Variables', <>carga {M('h')} [m], velocidad de Darcy {M('\\mathbf u')} [m/s], concentraciones {M('C_m')} y {M('C_{{\\rm im},r}')} [mg/L]</>],
    ['Medio', <>{M('\\phi\\in[0.03,\\,0.95]')} de los sondeos <Cita k="DanielRivas" />; {M('K_z(\\phi)')} de Kozeny–Carman <Cita k="Kozeny-Carman" />, {M('K_x=4K_z')}</>],
    ['Dispersión', <>{M('\\alpha_L=10')} m, {M('\\alpha_T=1')} m</>],
    ['Controles', <>caudal {M('Q(t)')} [m²/s] y profundidad {M('z_p')} [m] del pozo</>],
];
const discretizacion = [
    ['Espacio', <>elementos finitos de Galerkin: {M('h')} en P1, {M('C_m')} en P2<Comp>; sin estabilización</Comp></>],
    ['Malla', <>{miles(INFO.n_dominio)} nodos, {miles(INFO.n_triangulos)} triángulos<Comp> (conos en la pluma y el pozo; eje del pozo a 1 m)</Comp></>],
    ['Tiempo', <>Euler implícito, {M('\\Delta t=10')} h, {M('T=30')} días (72 pasos)</>],
    ['MRMT', <>esquema por bloques: las inmóviles se eliminan con el complemento de Schur</>],
    ['Álgebra', <>en cada paso, un sistema para {M('h')} y uno para {M('C_m')}<Comp> (LU directa)</Comp></>],
];

const Tabla = ({ titulo, filas }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>{titulo}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
            <tbody>
                {filas.map(([n, v], i) => (
                    <tr key={i} style={{ borderTop: i ? '1px solid var(--a3-filete)' : 'none' }}>
                        <td style={{ padding: '4px 10px 4px 0', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{n}</td>
                        <td style={{ padding: '4px 0', color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', lineHeight: 1.25 }}>{v}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Cota con flechas en los extremos (coordenadas de escena) y su rótulo centrado.
function Cota({ x1, y1, x2, y2, texto, etq, vertical }) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return (
        <g>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--sl-muted)" strokeWidth="1.2" markerStart="url(#r03-fl)" markerEnd="url(#r03-fl)" />
            {vertical
                ? <text x={mx - 8} y={my} textAnchor="middle" transform={`rotate(-90 ${mx - 8} ${my})`} style={{ ...etq, fill: 'var(--sl-text)' }}>{texto}</text>
                : <text x={mx} y={my - 7} textAnchor="middle" style={{ ...etq, fill: 'var(--sl-text)' }}>{texto}</text>}
        </g>
    );
}

export default function A3R03({ theme = 'dark' }) {
    const pub = usePublica();
    const etq = { fontFamily: 'var(--a3-sans)', fontSize: pub ? 18 : 15, fill: 'var(--sl-muted)' };
    const fila = pub ? 20 : 18;
    const geo = [
        <>ancho 9 939 m (SO → NE)</>,
        <>superficie <tspan fontStyle="italic">z</tspan> = 250.5 m</>,
        <>fondo SO <tspan fontStyle="italic">z</tspan> = −2 690.5 m</>,
        <>fondo NE <tspan fontStyle="italic">z</tspan> = −768.5 m</>,
        <>pozo en <tspan fontStyle="italic">x</tspan><tspan dy="4" fontSize="11">p</tspan><tspan dy="-4"> = 3 700 m</tspan></>,
        <>profundidad <tspan fontStyle="italic">z</tspan><tspan dy="4" fontSize="11">p</tspan><tspan dy="-4"> ∈ [−1 400, −200] m</tspan></>,
        <>fuente (9 116, 109) m</>,
    ];
    return (
        <SlideLayout title="Dominio, física y discretización" theme={theme} justify="flex-start">
            <svg viewBox="-58 -44 1110 360" style={{ width: pub ? '92%' : '100%', display: 'block', margin: '0 auto' }}>
                <defs>
                    <clipPath id="r03-clip"><polygon points={POLIGONO} /></clipPath>
                    <marker id="r03-fl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0,1 L9,5 L0,9" fill="none" stroke="var(--sl-muted)" strokeWidth="1.5" />
                    </marker>
                </defs>
                <g clipPath="url(#r03-clip)">
                    {ESQ.phi.bandas.map((d, i) => <path key={i} d={d} fill={AGUA} fillOpacity={0.05 + 0.13 * i} />)}
                </g>
                <polygon points={POLIGONO} fill="none" stroke="var(--sl-text)" strokeWidth="1.6" />
                {/* fronteras */}
                <line x1={1000} y1={0} x2={1000} y2={Z(-768.5)} stroke={AGUA} strokeWidth="5" />
                <line x1={0} y1={0} x2={0} y2={Z(-2690.5)} stroke={PLUMA} strokeWidth="5" />
                <text x={992} y={Z(-768.5) + 22} textAnchor="end" style={{ ...etq, fill: AGUA }}>Γ<tspan dy="5" fontSize="12">in</tspan><tspan dy="-5">: entrada</tspan></text>
                <text x={12} y={Z(-2200)} style={{ ...etq, fill: PLUMA }}>Γ<tspan dy="5" fontSize="12">out</tspan><tspan dy="-5">: salida libre</tspan></text>
                <text x={640} y={Z(-1950)} style={etq}>Γ<tspan dy="5" fontSize="12">wall</tspan><tspan dy="-5">: fondo y superficie, sin flujo</tspan></text>
                {/* cotas */}
                <Cota x1={0} y1={-16} x2={1000} y2={-16} texto="9 939 m" etq={etq} />
                <Cota x1={-24} y1={0} x2={-24} y2={Z(-2690.5)} texto="2 941 m" etq={etq} vertical />
                <Cota x1={1026} y1={0} x2={1026} y2={Z(-768.5)} texto="1 019 m" etq={etq} vertical />
                {/* recorrido de z_p, pozo en su profundidad inicial y fuente */}
                <line x1={X(POZO.x) + 14} y1={Z(-200)} x2={X(POZO.x) + 14} y2={Z(-1400)} stroke={AGUA} strokeWidth="1.4" strokeDasharray="4 3" />
                <line x1={X(POZO.x) + 9} y1={Z(-200)} x2={X(POZO.x) + 19} y2={Z(-200)} stroke={AGUA} strokeWidth="1.4" />
                <line x1={X(POZO.x) + 9} y1={Z(-1400)} x2={X(POZO.x) + 19} y2={Z(-1400)} stroke={AGUA} strokeWidth="1.4" />
                <text x={X(POZO.x) + 24} y={Z(-1400) + 5} style={{ ...etq, fill: AGUA }}>−1 400 m</text>
                <line x1={X(POZO.x)} y1={0} x2={X(POZO.x)} y2={Z(zp0)} stroke={AGUA} strokeWidth="4" />
                <circle cx={X(POZO.x)} cy={Z(zp0)} r="7" fill={AGUA} />
                <text x={X(POZO.x) + 24} y={Z(zp0) + 6} style={{ ...etq, fill: 'var(--sl-text)' }}>pozo, z<tspan dy="5" fontSize="12">p</tspan><tspan dy="-5">⁰ = {String(zp0).replace('-', '−')} m</tspan></text>
                <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r="7" fill={PLUMA} />
                <text x={X(FUENTE.x) - 12} y={Z(FUENTE.z) + 26} textAnchor="end" style={{ ...etq, fill: PLUMA }}>fuente de nitrato</text>
                {/* geometría: recuadro arriba a la izquierda, dentro del dominio */}
                <rect x={10} y={10} width={pub ? 258 : 232} height={geo.length * fila + 14} rx="4" fill="var(--sl-bg)" fillOpacity="0.88" stroke="var(--a3-filete)" />
                {geo.map((g, i) => <text key={i} x={20} y={30 + i * fila} style={{ ...etq, fontSize: pub ? 15.5 : 13.5, fill: 'var(--sl-text)' }}>{g}</text>)}
                {/* leyenda de φ */}
                <text x={700} y={Z(-1350)} style={etq}>porosidad φ</text>
                {[0, 1, 2, 3, 4].map(i => <rect key={i} x={700 + 40 * i} y={Z(-1350) + 8} width={40} height={14} fill={AGUA} fillOpacity={0.05 + 0.13 * i} stroke="var(--sl-muted)" strokeWidth="0.5" />)}
                {[0, 0.4, 0.8].map((v, i) => <text key={v} x={700 + 80 * i} y={Z(-1350) + 40} textAnchor="middle" style={{ ...etq, fontSize: pub ? 16 : 13 }}>{v}</text>)}
                <text x={900} y={Z(-1350) + 40} textAnchor="end" style={{ ...etq, fontSize: pub ? 16 : 13 }}>1</text>
                <text className="a3-completa" x={500} y={312} textAnchor="middle" style={{ ...etq, fontSize: 13 }}>sin exageración vertical</text>
            </svg>
            <div style={{ display: 'flex', gap: 40, marginTop: 6 }}>
                <Tabla titulo="Física del problema" filas={fisica} />
                <Tabla titulo="Discretización numérica" filas={discretizacion} />
            </div>
        </SlideLayout>
    );
}
