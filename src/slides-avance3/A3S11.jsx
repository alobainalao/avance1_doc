import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// ── Datos (water_supply.py) ───────────────────────────────────────
const DOMESTIC_RAW = [
    0.25, 0.20, 0.18, 0.17, 0.20, 0.40,
    1.10, 1.80, 1.60, 1.30, 1.10, 1.00,
    0.90, 0.85, 0.90, 1.00, 1.10, 1.30,
    1.70, 1.60, 1.30, 1.00, 0.70, 0.40,
];
const AGRI_RAW = [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.5, 1.0, 1.2, 1.3, 1.4, 1.5,
    1.5, 1.5, 1.4, 1.3, 1.2, 1.0,
    0.8, 0.5, 0.3, 0.0, 0.0, 0.0,
];
const domMean = DOMESTIC_RAW.reduce((a, b) => a + b, 0) / 24;
const agriMean = AGRI_RAW.reduce((a, b) => a + b, 0) / 24;
const DOMESTIC = DOMESTIC_RAW.map(v => v / domMean);
const AGRI     = AGRI_RAW.map(v => agriMean > 0 ? v / agriMean : v);

// ── SVG ───────────────────────────────────────────────────────────
const W = 880, H = 310;
const PAD = { l: 40, r: 20, t: 18, b: 36 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;
const VMAX = 2.1;

const xPx = h => PAD.l + (h / 24) * PW;
const yPx = v  => PAD.t + (1 - v / VMAX) * PH;

function stepPath(arr, close = false) {
    const pts = arr.map((v, h) => `${xPx(h).toFixed(1)},${yPx(v).toFixed(1)}`);
    pts.push(`${xPx(24).toFixed(1)},${yPx(arr[0]).toFixed(1)}`);
    const d = 'M ' + pts.join(' L ');
    return close
        ? d + ` L ${xPx(24)},${yPx(0)} L ${PAD.l},${yPx(0)} Z`
        : d;
}

const DemandSVG = () => (
    <svg viewBox={`0 0 ${W} ${H}`}
         style={{ width: '100%', display: 'block', flexShrink: 0,
                  border: '1px solid rgba(0,216,255,0.18)', borderRadius: 8 }}>
        <rect x={PAD.l} y={PAD.t} width={PW} height={PH} fill="rgba(46,45,138,0.04)" />

        {/* Área de fondo */}
        <path d={stepPath(AGRI,     true)} fill="rgba(74,222,128,0.10)"  stroke="none" />
        <path d={stepPath(DOMESTIC, true)} fill="rgba(96,165,250,0.08)"  stroke="none" />

        {/* Grid */}
        {[0.5, 1.0, 1.5, 2.0].map(v => (
            <g key={v}>
                <line x1={PAD.l} x2={PAD.l + PW} y1={yPx(v)} y2={yPx(v)}
                      stroke="rgba(255,255,255,0.11)" strokeWidth="0.8" strokeDasharray="4,3" />
                <text x={PAD.l - 5} y={yPx(v) + 3.5} textAnchor="end" fontSize="10.5" fill="#8090aa">
                    {v.toFixed(1)}
                </text>
            </g>
        ))}

        {/* Línea media */}
        <line x1={PAD.l} x2={PAD.l + PW} y1={yPx(1.0)} y2={yPx(1.0)}
              stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5,4" />

        {/* Curvas */}
        <path d={stepPath(DOMESTIC)} fill="none" stroke="#0F7A85" strokeWidth="2.4" strokeLinejoin="round" />
        <path d={stepPath(AGRI)}     fill="none" stroke="#2E7D4F" strokeWidth="2.4" strokeLinejoin="round" />

        {/* Anotaciones picos */}
        <text x={xPx(7.5)} y={yPx(1.80) - 7} textAnchor="middle" fontSize="10.5" fill="#0F7A85" fontWeight="bold">1.80</text>
        <text x={xPx(18.5)} y={yPx(1.70) - 7} textAnchor="middle" fontSize="10.5" fill="#0F7A85" fontWeight="bold">1.70</text>
        <text x={xPx(13)}   y={yPx(1.50) - 7} textAnchor="middle" fontSize="10.5" fill="#2E7D4F" fontWeight="bold">1.50</text>

        {/* Ejes */}
        <line x1={PAD.l} x2={PAD.l}       y1={PAD.t} y2={PAD.t + PH} stroke="#0F7A85" strokeWidth="1.1" />
        <line x1={PAD.l} x2={PAD.l + PW}  y1={PAD.t + PH} y2={PAD.t + PH} stroke="#0F7A85" strokeWidth="1.1" />

        {/* Ticks X */}
        {[0,2,4,6,8,10,12,14,16,18,20,22,24].map(h => (
            <g key={h}>
                <line x1={xPx(h)} x2={xPx(h)} y1={PAD.t + PH} y2={PAD.t + PH + 4}
                      stroke="#8ab" strokeWidth="0.8" />
                <text x={xPx(h)} y={PAD.t + PH + 15} textAnchor="middle" fontSize="10" fill="#8ab">
                    {h === 0 || h === 24 ? `${h}h` : h}
                </text>
            </g>
        ))}

        {/* Etiqueta eje Y */}
        <text x={10} y={PAD.t + PH / 2} textAnchor="middle" fontSize="10.5" fill="#8ab"
              transform={`rotate(-90,10,${PAD.t + PH / 2})`}>factor demanda</text>

        {/* Leyenda */}
        <rect x={PAD.l + PW - 320} y={PAD.t + 6} width={316} height={46} rx="4"
              fill="rgba(0,0,0,0.60)" stroke="rgba(255,255,255,0.10)" />
        {[
            { color: '#0F7A85', label: 'Doméstico — AWWA M32 / Alvarado-Granados et al. (2023)', y: 21 },
            { color: '#2E7D4F', label: 'Riego agrícola — FAO-56 (Allen et al. 1998)', y: 39 },
        ].map(({ color, label, y }) => (
            <g key={label}>
                <line x1={PAD.l + PW - 315} x2={PAD.l + PW - 299}
                      y1={PAD.t + y - 4} y2={PAD.t + y - 4} stroke={color} strokeWidth="2.4" />
                <text x={PAD.l + PW - 296} y={PAD.t + y} fontSize="9" fill={color}>{label}</text>
            </g>
        ))}
    </svg>
);

// ── Fichas descriptivas ───────────────────────────────────────────
const cards = [
    {
        title: 'Consumo doméstico',
        color: '#0F7A85',
        bg: 'rgba(96,165,250,0.07)',
        items: [
            'Dos picos diarios: matutino 07h (×1.80) y vespertino 18h (×1.70)',
            'Mínimo nocturno: 03h (×0.17) — 10 veces menor que el pico',
            'Parámetro: demand_day [vol/día]',
        ],
        ref: 'AWWA M32 (2004); Mays (2011) Water Resources Eng., Wiley; Alvarado-Granados et al. (2023) Water Practice & Technology 18(8)',
    },
    {
        title: 'Riego agrícola',
        color: '#2E7D4F',
        bg: 'rgba(74,222,128,0.07)',
        items: [
            'Sin riego nocturno 00–05h (evapotranspiración nula)',
            'Pico sostenido 11–15h (máxima ET₀ horaria, FAO-56)',
            'Parámetro: demand_agri [vol/día]  (default 0)',
        ],
        ref: 'Allen, Pereira, Raes, Smith (1998) FAO Irrigation and Drainage Paper No. 56, Cap. 5',
    },
];

const A3S11 = ({ theme = 'dark' }) => (
    <SlideLayout title="Demanda variable — perfil diurno doméstico y riego" theme={theme} justify="flex-start">

        <DemandSVG />

        <div style={{ flex: 1, display: 'flex', gap: 20, minHeight: 0 }}>
            {cards.map(({ title, color, bg, items, ref }) => (
                <div key={title} style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    border: `1.5px solid ${color}44`, borderRadius: 10,
                    background: bg, padding: '14px 18px', gap: 10,
                }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color }}>{title}</p>
                    <ul style={{ margin: 0, paddingLeft: 20, flex: 1, display: 'flex',
                                 flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        {items.map(it => (
                            <li key={it} style={{ color: 'var(--sl-text)', fontSize: 20,
                                                  lineHeight: 1.35 }}>{it}</li>
                        ))}
                    </ul>
                    <p style={{ margin: 0, fontSize: 16, color: 'var(--sl-muted)',
                                fontStyle: 'italic', lineHeight: 1.3 }}>{ref}</p>
                </div>
            ))}
        </div>

    </SlideLayout>
);

export default A3S11;
