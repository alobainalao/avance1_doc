import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// 7 lados: 3 arriba · 1 der · 2 abajo · 1 izq
// Vértice (200,210) crea la concavidad inferior-izquierda
const PTS ="55,65.1 267,67.2 378.3,58.8 585,63 585,105 267,147 55,210";

const AcuiferSVG = () => (
    <svg viewBox="0 0 640 225"
         style={{ width: '92%', maxHeight: '499px', display: 'block', margin: '0 auto' }}>
        <defs>
            <linearGradient id="aqFill20" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00a8d8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#003880" stopOpacity="0.48" />
            </linearGradient>
            <clipPath id="domainClip20">
                <polygon points={PTS} />
            </clipPath>
        </defs>

        {/* ── Dominio ── */}
        <polygon points={PTS}
                 fill="url(#aqFill20)" stroke="#00d8ff" strokeWidth="1.8" />

        {/* ── Ω ── */}
        <text x="320" y="135" textAnchor="middle"
              fill="#00d8ff" fontSize="36" fontStyle="italic" opacity="0.30">Ω</text>

        {/* ── Ejes ── */}
        <text x="320" y="16" textAnchor="middle"
              fill="#c8e8ff" fontSize="13" fontStyle="italic">x</text>
        <text x="16" y="105" textAnchor="middle"
              fill="#c8e8ff" fontSize="13" fontStyle="italic"
              transform="rotate(-90 16 105)">z</text>
        <text x="610" y="72" fill="#c8e8ff" fontSize="13" fontStyle="italic">z</text>

        {/* ── O blanca en superficie (mismo x que sumidero, y ≈ 66) ── */}
        <text x="148" y="62" fill="white" fontSize="13" fontStyle="italic"
              textAnchor="end">O</text>
        <circle cx="155" cy="66" r="4" fill="white" />

        {/* ── Casing punteado: superficie → sumidero ── */}
        <line x1="155" y1="70" x2="155" y2="104"
              stroke="#ff4466" strokeWidth="1.3" strokeDasharray="4 3" opacity="0.50"
              clipPath="url(#domainClip20)" />

        {/* ── Sumidero: punto rojo en profundidad (mismo x que O) ── */}
        <text x="148" y="113" fill="#ff4466" fontSize="11" fontStyle="italic"
              textAnchor="end">(x_p, z_p)</text>
        <text x="148" y="127" fill="#ff4466" fontSize="11.5"
              textAnchor="end">Sumidero</text>
        <circle cx="155" cy="108" r="4" fill="#ff4466" />

        {/* ── Fuente: punto verde en profundidad (derecha, y ≈ 80) ── */}
        <text x="458" y="76" fill="#22c55e" fontSize="11" fontStyle="italic"
              textAnchor="end">(x_s, z_s)</text>
        <text x="458" y="90" fill="#22c55e" fontSize="11.5"
              textAnchor="end">Fuente</text>
        <circle cx="465" cy="81" r="4" fill="#22c55e" />
    </svg>
);

const Slide20 = ({ theme = 'dark' }) => (
    <SlideLayout title="Motivación" theme={theme}>
        <AcuiferSVG />
        <p className="sl-body" style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '14px' }}>
            ¿Cómo ubicar y operar el pozo de extracción minimizando contaminación y costo?
        </p>
    </SlideLayout>
);

export default Slide20;
