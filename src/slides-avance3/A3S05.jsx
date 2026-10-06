import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import DomainSVG from './DomainSVG.jsx';

// Campo H(t=0) — matplotlib tricontourf + inferno_r (30 niveles)
// Archivo en public/h_field_t0.png, extent=[816,10755,-2690.5,250.5]
const H_FIELD_IMG = process.env.PUBLIC_URL + '/h_field_t0.png';

const ColTitle = ({ children, color }) => (
    <p style={{ color, fontWeight: 700, fontSize: 22, margin: '0 0 8px',
                borderBottom: `1.5px solid ${color}44`, paddingBottom: 4 }}>
        {children}
    </p>
);

const InfoRow = ({ label, val, color = 'var(--sl-text)' }) => (
    <tr style={{ borderBottom: '1px solid rgba(0,216,255,0.10)' }}>
        <td style={{ padding: '7px 0', color: 'var(--sl-muted)', fontSize: 20 }}>{label}</td>
        <td style={{ padding: '7px 0', color, textAlign: 'right',
                     fontFamily: 'monospace', fontSize: 19 }}>{val}</td>
    </tr>
);

const A3S05 = ({ theme = 'dark' }) => (
    <SlideLayout title="Simulación forward y estado adjunto" theme={theme} justify="flex-start">
        <DomainSVG uid="s05">
            {/* Campo H(t=0) real — matplotlib tricontourf/inferno_r, clipeado al dominio */}
            <image href={H_FIELD_IMG}
                   x="55" y="22" width="563" height="168"
                   clipPath="url(#clip-s05)"
                   preserveAspectRatio="none" opacity="0.90" />
            {/* Colorbar horizontal — dentro del dominio, esquina inferior derecha */}
            <defs>
                <linearGradient id="hColorbar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#fcffa4" />
                    <stop offset="22%"  stopColor="#f5a527" />
                    <stop offset="40%"  stopColor="#e05c2e" />
                    <stop offset="58%"  stopColor="#a0316f" />
                    <stop offset="78%"  stopColor="#5d0e6d" />
                    <stop offset="100%" stopColor="#0a0723" />
                </linearGradient>
            </defs>
            <text x="465" y="138" fontSize="8" fill="#ff4466" textAnchor="middle" fontWeight="700">H (t=0) [m]</text>
            <rect x="330" y="142" width="270" height="12" fill="url(#hColorbar)" rx="2" />
            <text x="330" y="165" fontSize="8" fill="#ff4466" textAnchor="start"  fontWeight="600">307.1</text>
            <text x="465" y="165" fontSize="8" fill="#ff4466" textAnchor="middle" fontWeight="600">311.0</text>
            <text x="600" y="165" fontSize="8" fill="#ff4466" textAnchor="end"    fontWeight="600">315.0</text>
        </DomainSVG>

        {/* 2 columnas de info */}
        <div style={{ display: 'flex', gap: '3%', flex: 1, minHeight: 0 }}>

            {/* Columna izquierda: setup → resultados forward */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <ColTitle color="#a78bfa">Configuración de la simulación</ColTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
                    <tbody>
                        <InfoRow label="Nodos RBF-FD" val="16 551" />
                        <InfoRow label="Horizonte T" val="30 días" />
                        <InfoRow label="Pasos Δt" val="72  ×  10 h" />
                    </tbody>
                </table>

                <ColTitle color="#60a5fa">Resultados forward</ColTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <InfoRow label="H — carga hidráulica" val="[307.1, 315.0] m" color="#60a5fa" />
                        <InfoRow label="ΔH total" val="7.9 m" color="#60a5fa" />
                        <InfoRow label="C — concentración" val="[0, 9.8×10⁻¹¹]" color="#4ade80" />
                        <InfoRow label="|U| máx (Darcy)" val="O(10⁻⁴) m/s" color="#f59e0b" />
                    </tbody>
                </table>
            </div>

            <div style={{ width: 1, background: 'rgba(0,216,255,0.18)', flexShrink: 0 }} />

            {/* Columna derecha: adjunto → verificación */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <ColTitle color="#f87171">Estado adjunto</ColTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                    <tbody>
                        <InfoRow label="ψ_H rango" val="[−6.3×10⁻¹⁴, 5.8×10⁻¹⁴]" color="#f87171" />
                        <InfoRow label="ψ_C rango" val="[−1.1×10⁻⁸, 1.7×10⁻⁷]"   color="#f87171" />
                    </tbody>
                </table>
                <p style={{ color: 'var(--sl-muted)', fontSize: 17, fontStyle: 'italic',
                            margin: '0 0 14px', lineHeight: 1.4 }}>
                    nan → 0, inf → 0 · operador A_H corregido (sep 2026)
                </p>

                <ColTitle color="#4ade80">Verificación del gradiente</ColTitle>
                <div style={{
                    padding: '10px 16px',
                    border: '1px solid rgba(74,222,128,0.25)', borderRadius: 8,
                    background: 'rgba(74,222,128,0.05)',
                }}>
                    <p style={{ margin: '0 0 6px', color: 'var(--sl-text)', fontSize: 19, lineHeight: 1.4 }}>
                        Error relativo &lt; 10⁻¹⁰ en ∇_Q J
                    </p>
                    <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 19, lineHeight: 1.4 }}>
                        Error relativo &lt; 10⁻¹⁵ en ∂J/∂z_p
                    </p>
                </div>
            </div>
        </div>
    </SlideLayout>
);

export default A3S05;
