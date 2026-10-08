import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import DomainSVG from './DomainSVG.jsx';

// Campo φ — matplotlib tricontourf coolwarm, mismo extent que dominio real
const PHI_IMG = process.env.PUBLIC_URL + '/phi_field.png';

const geoParams = [
    ['Vértices',             '5 (pentágono irregular)'],
    ['Ancho  Lx',            '9 939 m  ≈ 10 km'],
    ['Profundidad  Ly',      '2 941 m  ≈ 2.9 km'],
    ['Fondo',                'diagonal (inclinado)'],
    ['Pozo  (x_p, z_p)',     '(3 700, −700) m'],
    ['Fuente  (x_s, z_s)',   '(9 116, 109) m'],
];

const physParams = [
    ['φ — porosidad',        '[0.05, 0.95]  (4 pozos, capas A–E)'],
    ['K — Kozeny-Carman',    'Kᵧ(φ, dz=1 mm, ν) · Kₓ=4Kᵧ'],
    ['αₗ / αₜ',              '10 / 1 m'],
    ['ν — viscosidad',       '1.055×10⁻⁶ m²/s'],
    ['Nodos RBF-FD',         '16 552  (h ≈ 30 m)'],
    ['dt / T',               '10 h / 30 días'],
];

const ParamTable = ({ title, color, rows }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
            color, fontWeight: 700, fontSize: 24, margin: '0 0 6px',
            borderBottom: `1.5px solid ${color}55`, paddingBottom: 4,
        }}>{title}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
                {rows.map(([name, val]) => (
                    <tr key={name} style={{ borderBottom: '1px solid rgba(0,216,255,0.10)' }}>
                        <td style={{ padding: '9px 0', color: 'var(--sl-muted)', fontSize: 22 }}>{name}</td>
                        <td style={{ padding: '9px 0', color: 'var(--sl-text)', textAlign: 'right',
                                     fontFamily: 'monospace', fontSize: 21 }}>{val}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const A3S02 = ({ theme = 'dark' }) => (
    <SlideLayout title="Dominio físico y parámetros" theme={theme} justify="flex-start">
        <DomainSVG uid="s02">
            <image href={PHI_IMG}
                   x="55" y="22" width="563" height="168"
                   clipPath="url(#clip-s02)"
                   preserveAspectRatio="none" opacity="0.90" />
            <defs>
                <linearGradient id="phiCbar-s02" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#044EBF" />
                    <stop offset="25%"  stopColor="#80A3EF" />
                    <stop offset="50%"  stopColor="#DBDBDB" />
                    <stop offset="75%"  stopColor="#E38F68" />
                    <stop offset="100%" stopColor="#980326" />
                </linearGradient>
            </defs>
            <text x="465" y="138" fontSize="8" fill="#a78bfa" textAnchor="middle" fontWeight="700">φ efectiva</text>
            <rect x="330" y="142" width="270" height="12" fill="url(#phiCbar-s02)" rx="2" />
            <text x="330" y="157" fontSize="8" fill="#a78bfa" textAnchor="start">0.05</text>
            <text x="465" y="157" fontSize="8" fill="#a78bfa" textAnchor="middle">0.50</text>
            <text x="600" y="157" fontSize="8" fill="#a78bfa" textAnchor="end">0.95</text>
        </DomainSVG>

        <div style={{ display: 'flex', gap: '3%', flex: 1, alignItems: 'flex-start' }}>
            <ParamTable title="Geometría del dominio" color="#00d8ff" rows={geoParams} />
            <div style={{ width: 1, background: 'rgba(0,216,255,0.18)', alignSelf: 'stretch' }} />
            <ParamTable title="Física y discretización" color="#a78bfa" rows={physParams} />
        </div>
        <p style={{ color: 'var(--sl-muted)', fontSize: 20, fontStyle: 'italic', margin: 0 }}>
            φ interpolada de datos de campo (4 pozos reales, capas A–E). K calculada via Kozeny-Carman.
        </p>
    </SlideLayout>
);

export default A3S02;
