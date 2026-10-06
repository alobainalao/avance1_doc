import React from 'react';

/* Geometría REAL del dominio — vértices de p.vert (config/parameters.py, dominio "real"):
     (816, −2690.5) → (4354, −1757.5) → (10755, −768.5) → (10755, 250.5) → (816, 250.5)
   Fondo diagonal: más profundo en el borde izquierdo (z≈−2690 m) que en el derecho (z≈−769 m).
   Pozo  (sumidero): x=3700 m, z=−700 m
   Fuente (contaminante): x=9116 m, z=109 m                                        */

export const X_MIN = 816, X_RANGE = 9939;
export const Z_MAX = 250.5, Z_RANGE = 2941;

export const VW = 640, VH = 230;
export const PAD = { l: 55, r: 22, t: 22, b: 40 };
const PW = VW - PAD.l - PAD.r;
const PH = VH - PAD.t - PAD.b;

export const xPx = (x) => PAD.l + (x - X_MIN) / X_RANGE * PW;
export const zPx = (z) => PAD.t + (Z_MAX - z) / Z_RANGE * PH;

const VERTS_REAL = [
    [816,   -2690.5],
    [4354,  -1757.5],
    [10755,  -768.5],
    [10755,   250.5],
    [816,     250.5],
];
const polyPts = VERTS_REAL.map(([x,z]) => `${xPx(x).toFixed(1)},${zPx(z).toFixed(1)}`).join(' ');

const WX = xPx(3700), WZ = zPx(-700);
const FX = xPx(9116), FZ = zPx(109);
const SURF_X = xPx(3700);

const DomainSVG = ({ children, uid = 'dom' }) => {
    const gradId  = `aqFill-${uid}`;
    const clipId  = `clip-${uid}`;
    return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', display: 'block', flexShrink: 0 }}>
        <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00a8d8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#003880" stopOpacity="0.55" />
            </linearGradient>
            <clipPath id={clipId}>
                <polygon points={polyPts} />
            </clipPath>
        </defs>

        {/* fill only — overlay content renders on top before the stroke border */}
        <polygon points={polyPts} fill={`url(#${gradId})`} stroke="none" />
        {children}
        <polygon points={polyPts} fill="none" stroke="#00d8ff" strokeWidth="1.8" />

        <text x={xPx(6000)} y={zPx(-1500)} textAnchor="middle"
              fill="#00d8ff" fontSize="32" fontStyle="italic" opacity="0.22">Ω</text>

        <line x1={PAD.l} y1={zPx(0)} x2={PAD.l + PW} y2={zPx(0)}
              stroke="rgba(200,232,255,0.30)" strokeWidth="1" strokeDasharray="6,4" />
        <text x={PAD.l + PW + 2} y={zPx(0) + 4} fontSize="8" fill="rgba(200,232,255,0.50)">z=0</text>

        <line x1={SURF_X} y1={PAD.t} x2={WX} y2={WZ}
              stroke="#ff4466" strokeWidth="1.5" strokeDasharray="4,3" clipPath={`url(#${clipId})`} />
        <circle cx={SURF_X} cy={PAD.t} r="4" fill="white" />
        <circle cx={WX} cy={WZ} r="5.5" fill="#ff4466" />
        <text x={WX - 8} y={WZ - 9} textAnchor="end" fontSize="10" fill="#ff4466" fontStyle="italic">(x_p, z_p)</text>
        <text x={WX - 8} y={WZ + 14} textAnchor="end" fontSize="11" fill="#ff4466" fontWeight="bold">Pozo</text>

        <circle cx={FX} cy={FZ} r="5.5" fill="#22c55e" />
        <text x={FX + 8} y={FZ - 5} textAnchor="start" fontSize="10" fill="#22c55e" fontStyle="italic">(x_s, z_s)</text>
        <text x={FX + 8} y={FZ + 10} textAnchor="start" fontSize="11" fill="#22c55e" fontWeight="bold">Fuente</text>

        <text x={xPx(3500)} y={zPx(-2000)} textAnchor="middle"
              fontSize="9" fill="rgba(0,216,255,0.45)" fontStyle="italic"
              transform={`rotate(-16, ${xPx(3500)}, ${zPx(-2000)})`}>
            fondo impermeable (inclinado)
        </text>

        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={VH - PAD.b} stroke="#00d8ff" strokeWidth="1" />
        <line x1={PAD.l} y1={VH - PAD.b} x2={VW - PAD.r} y2={VH - PAD.b} stroke="#00d8ff" strokeWidth="1" />

        {[0, 2500, 5000, 7500, 10000].map(xv => (
            <g key={xv}>
                <line x1={xPx(xv + 816)} y1={VH - PAD.b} x2={xPx(xv + 816)} y2={VH - PAD.b + 3}
                      stroke="#8ab" strokeWidth="0.8" />
                <text x={xPx(xv + 816)} y={VH - PAD.b + 11} textAnchor="middle" fontSize="7.5" fill="#8ab">
                    {xv / 1000} km
                </text>
            </g>
        ))}
        {[200, -500, -1500, -2600].map(zv => (
            <g key={zv}>
                <line x1={PAD.l - 3} y1={zPx(zv)} x2={PAD.l} y2={zPx(zv)} stroke="#8ab" strokeWidth="0.8" />
                <text x={PAD.l - 4} y={zPx(zv) + 3} textAnchor="end" fontSize="7" fill="#8ab">
                    {zv >= 0 ? `+${zv}` : zv}
                </text>
            </g>
        ))}
        <text x={PAD.l + PW / 2} y={VH - 3} textAnchor="middle" fontSize="8.5" fill="#8ab">x (m)</text>
        <text x="10" y={PAD.t + PH / 2} textAnchor="middle" fontSize="8.5" fill="#8ab"
              transform={`rotate(-90,10,${PAD.t + PH / 2})`}>z (m)</text>
    </svg>
    );
};

export default DomainSVG;
