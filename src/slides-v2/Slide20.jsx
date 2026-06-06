import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const AcuiferSVG = () => (
    <svg viewBox="0 0 640 300"
         style={{ width: '92%', maxHeight: '54vh', display: 'block', margin: '0 auto' }}>
        <defs>
            {/* Aquifer fill */}
            <linearGradient id="aqFill20" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00a8d8" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#003880" stopOpacity="0.45" />
            </linearGradient>
            {/* Contamination plume */}
            <radialGradient id="plume20" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.40" />
                <stop offset="65%"  stopColor="#22c55e" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0"    />
            </radialGradient>
            {/* Green arrow */}
            <marker id="arrG20" markerWidth="7" markerHeight="5"
                    refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 7 2.5, 0 5" fill="#22c55e" opacity="0.85" />
            </marker>
        </defs>

        {/* ── Aquifer body ── */}
        <rect x="55" y="40" width="530" height="228"
              fill="url(#aqFill20)" />

        {/* ── ΓD: top boundary (Dirichlet) — solid blue ── */}
        <line x1="55" y1="40" x2="585" y2="40"
              stroke="#60a5fa" strokeWidth="3.5" />
        <text x="320" y="28" textAnchor="middle"
              fill="#60a5fa" fontSize="14" fontStyle="italic">
            Γ_D : h = h_D
        </text>

        {/* ── Domain outline (sides + bottom) ── */}
        <line x1="55"  y1="40"  x2="55"  y2="268"
              stroke="#00d8ff" strokeWidth="1.8" />
        <line x1="585" y1="40"  x2="585" y2="268"
              stroke="#00d8ff" strokeWidth="1.8" />
        <line x1="55"  y1="268" x2="585" y2="268"
              stroke="#00d8ff" strokeWidth="1.8" />

        {/* ── ΓN: side boundary labels ── */}
        <text x="32" y="158" textAnchor="middle"
              fill="#4a7a9b" fontSize="13" fontStyle="italic"
              transform="rotate(-90 32 158)">Γ_N</text>
        <text x="607" y="158" textAnchor="middle"
              fill="#4a7a9b" fontSize="13" fontStyle="italic"
              transform="rotate(90 607 158)">Γ_N</text>
        <text x="320" y="292" textAnchor="middle"
              fill="#4a7a9b" fontSize="13" fontStyle="italic">Γ_N</text>

        {/* ── Domain label Ω ── */}
        <text x="185" y="198" fill="#00d8ff"
              fontSize="34" fontStyle="italic" opacity="0.35">Ω</text>

        {/* ── Contamination plume (radial from source) ── */}
        <ellipse cx="445" cy="132" rx="80" ry="50"
                 fill="url(#plume20)" />

        {/* ── Transport arrows source → well ── */}
        <path d="M402 133 Q345 152 300 172"
              stroke="#22c55e" strokeWidth="1.8" fill="none"
              strokeDasharray="7 4" markerEnd="url(#arrG20)" opacity="0.80" />
        <path d="M400 145 Q345 165 300 183"
              stroke="#22c55e" strokeWidth="1.2" fill="none"
              strokeDasharray="6 4" markerEnd="url(#arrG20)" opacity="0.45" />

        {/* ── Source (x_s, z_s) — green square ── */}
        <rect x="432" y="116" width="22" height="22" rx="3"
              fill="rgba(34,197,94,0.22)" stroke="#22c55e" strokeWidth="2.2" />
        <line x1="443" y1="119" x2="443" y2="135"
              stroke="#22c55e" strokeWidth="1.8" />
        <line x1="436" y1="127" x2="450" y2="127"
              stroke="#22c55e" strokeWidth="1.8" />
        <text x="460" y="122" fill="#22c55e" fontSize="12.5">(x_s, z_s)</text>
        <text x="460" y="137" fill="#22c55e" fontSize="13">Fuente  W⁺</text>

        {/* ── Well / Sink (x_p, z_p) — red cross-in-circle ── */}
        <circle cx="272" cy="175" r="14"
                fill="rgba(255,68,102,0.18)" stroke="#ff4466" strokeWidth="2.5" />
        <line x1="272" y1="163" x2="272" y2="187"
              stroke="#ff4466" strokeWidth="2.2" />
        <line x1="260" y1="175" x2="284" y2="175"
              stroke="#ff4466" strokeWidth="2.2" />
        {/* Well casing to bottom */}
        <line x1="272" y1="189" x2="272" y2="267"
              stroke="#ff4466" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65" />
        <text x="293" y="169" fill="#ff4466" fontSize="12.5">(x_p, z_p)</text>
        <text x="293" y="184" fill="#ff4466" fontSize="13">Pozo  W⁻</text>

        {/* ── Axis labels ── */}
        <text x="320" y="19" textAnchor="middle"
              fill="#c8e8ff" fontSize="14" fontStyle="italic">x →</text>
        <text x="16" y="158" textAnchor="middle"
              fill="#c8e8ff" fontSize="14" fontStyle="italic"
              transform="rotate(-90 16 158)">z ↓</text>
    </svg>
);

const Slide20 = ({ theme = 'dark' }) => (
    <SlideLayout title="Motivación" theme={theme}>
        <AcuiferSVG />
        <p className="sl-body" style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '1.5vh' }}>
            ¿Cómo ubicar y operar el pozo de extracción minimizando contaminación y costo?
        </p>
    </SlideLayout>
);

export default Slide20;
