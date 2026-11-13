import React from 'react';
import { EJE } from './mallaConos.js';

// Escena del acuífero en las coordenadas de mallaConos.js (codigo/scripts/exportar_malla_presentacion.py):
// x' = (x − 816)/9.939, z' = (250.5 − z)/9.939, de modo que el dominio ocupa [0, 1000] × [0, 296].
// La entrada está a la derecha (x = 10 755 m) y la salida libre a la izquierda (x = 816 m).
export const X = (x) => (x - 816) / 9.939;
export const Z = (z) => (250.5 - z) / 9.939;

const VERT = [[816, -2690.5], [4354, -1757.5], [10755, -768.5], [10755, 250.5], [816, 250.5]];
export const POLIGONO = VERT.map(([x, z]) => `${X(x).toFixed(1)},${Z(z).toFixed(1)}`).join(' ');
export const POZO = { x: 3700, z: -700 };
export const FUENTE = { x: 9116, z: 109 };
const EJE_PTS = [];
for (let i = 0; i < EJE.length; i += 2) EJE_PTS.push(`${EJE[i]},${EJE[i + 1]}`);
export const EJE_PATH = `M${EJE_PTS.join(' L')}`;

const tinta = 'var(--sl-text)';

// pluma ∈ [0, 1]: fracción del eje de la pluma ya recorrida; zp: profundidad del pozo [m]; children: capas extra.
export default function Escena({ pluma = 1, zp = POZO.z, etiquetas = true, children, margen = 30, alto }) {
    const W = 1000 + 2 * margen, H = 296 + 2 * margen;
    return (
        <svg viewBox={`${-margen} ${-margen} ${W} ${H}`} style={{ width: '100%', height: alto, display: 'block' }}>
            <defs>
                <linearGradient id="esc-agua" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F7A85" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#10243E" stopOpacity="0.22" />
                </linearGradient>
                <linearGradient id="esc-pluma" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#C4511F" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#C4511F" stopOpacity="0.25" />
                </linearGradient>
                <clipPath id="esc-clip"><polygon points={POLIGONO} /></clipPath>
            </defs>
            <polygon points={POLIGONO} fill="url(#esc-agua)" />
            <g clipPath="url(#esc-clip)">
                {/* pluma: trazo ancho y difuso a lo largo de la línea de corriente que sale de la fuente */}
                <path d={EJE_PATH} fill="none" stroke="url(#esc-pluma)" strokeWidth="22" strokeLinecap="round"
                      pathLength="1" strokeDasharray={`${pluma} 1`} opacity="0.28" />
                <path d={EJE_PATH} fill="none" stroke="#C4511F" strokeWidth="3" strokeLinecap="round"
                      pathLength="1" strokeDasharray={`${pluma} 1`} />
                {children}
            </g>
            <polygon points={POLIGONO} fill="none" style={{ stroke: tinta }} strokeWidth="1.6" />
            {/* pozo: tubería desde la superficie hasta z_p */}
            <line x1={X(POZO.x)} y1={Z(250.5)} x2={X(POZO.x)} y2={Z(zp)} stroke="#0F7A85" strokeWidth="4" />
            <circle cx={X(POZO.x)} cy={Z(zp)} r="7" fill="#0F7A85" />
            <circle cx={X(FUENTE.x)} cy={Z(FUENTE.z)} r="7" fill="#C4511F" />
            {etiquetas && (
                <g style={{ fontFamily: 'var(--a3-sans)', fontSize: 17, fill: 'var(--sl-muted)' }}>
                    <text x={X(POZO.x) + 14} y={Z(zp) + 6}>pozo, z<tspan dy="5" fontSize="12">p</tspan><tspan dy="-5"> = {String(Math.round(zp)).replace('-', '−')} m</tspan></text>
                    <text x={X(FUENTE.x) - 14} y={Z(FUENTE.z) + 26} textAnchor="end">fuente de nitrato</text>
                    <text x={998} y={Z(-300)} textAnchor="end">entrada →</text>
                    <text x={6} y={Z(-1200)}>← salida libre</text>
                </g>
            )}
        </svg>
    );
}
