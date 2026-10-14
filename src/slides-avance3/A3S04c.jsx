import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Datos reales del test (oct 2026, fix escala Q — ver tests/test_taylor_adjoint.py)
// dm normalizado solo en dirección Q (zp fijo), scale = ‖Q₀‖ = 1.732e-3
// ratio_r0 → 2 (O(h)); ratio_r1 = 4.00 exacto (O(h²)) — 6/6 casos idénticos
const RATIOS = [
    { backend: 'BFR',    model: 'ADR',         r0: [3.58, 3.31, 2.97, 2.64], r1: [4.00, 4.00, 4.00, 4.00] },
    { backend: 'BFR',    model: 'MRMT Semi',   r0: [3.58, 3.31, 2.97, 2.64], r1: [4.00, 4.00, 4.00, 4.00] },
    { backend: 'BFR',    model: 'MRMT Bloque', r0: [3.58, 3.31, 2.97, 2.64], r1: [4.00, 4.00, 4.00, 4.00] },
    { backend: 'FEniCS', model: 'ADR',         r0: [3.58, 3.31, 2.97, 2.64], r1: [4.00, 4.00, 4.00, 4.00] },
    { backend: 'FEniCS', model: 'MRMT Semi',   r0: [3.58, 3.31, 2.97, 2.64], r1: [4.00, 4.00, 4.00, 4.00] },
    { backend: 'FEniCS', model: 'MRMT Bloque', r0: [3.58, 3.31, 2.97, 2.64], r1: [4.00, 4.00, 4.00, 4.00] },
];

const A3S04c = ({ theme = 'dark' }) => (
    <SlideLayout
        title="Test de Taylor — resultados"
        theme={theme}
        justify="flex-start"
    >
        {/* Config */}
        <div style={{
            display: 'flex', gap: 32, flexShrink: 0,
            background: 'rgba(0,0,0,0.20)',
            border: '1px solid rgba(0,216,255,0.18)',
            borderRadius: 8, padding: '12px 24px',
            flexWrap: 'wrap',
        }}>
            {[
                { label: 'Malla',     val: 'Δx = 30 m,  N = 16 552 nodos' },
                { label: 'Pasos h',   val: '1.73e-4 → 8.66e-5 → 4.33e-5 → 2.17e-5 → 1.08e-5' },
                { label: 'Criterio',  val: 'ratio r₁(h)/r₁(h/2) ≥ 3.5' },
            ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--sl-muted)', fontSize: 19, fontWeight: 700 }}>{label}:</span>
                    <span style={{ color: 'var(--sl-text)', fontSize: 19, fontFamily: 'monospace' }}>{val}</span>
                </div>
            ))}
        </div>

        {/* Tabla */}
        <div style={{
            flex: 1, minHeight: 0,
            border: '1px solid rgba(0,216,255,0.22)', borderRadius: 10, overflow: 'hidden',
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', height: '100%' }}>
                <thead>
                    <tr style={{ background: 'rgba(46,45,138,0.55)' }}>
                        <th style={{ padding: '12px 20px', textAlign: 'left',   color: 'var(--sl-muted)', fontSize: 20, fontWeight: 700 }}>Backend</th>
                        <th style={{ padding: '12px 20px', textAlign: 'left',   color: 'var(--sl-muted)', fontSize: 20, fontWeight: 700, borderLeft: '1px solid rgba(0,216,255,0.15)' }}>Modelo</th>
                        {['h→h/2', 'h/2→h/4', 'h/4→h/8', 'h/8→h/16'].map(l => (
                            <th key={l} style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--sl-muted)', fontSize: 18, fontWeight: 700, borderLeft: '1px solid rgba(0,216,255,0.15)' }}>{l}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {RATIOS.map(({ backend, model, r1 }, i) => (
                        <tr key={i} style={{
                            borderTop: '1px solid rgba(0,216,255,0.10)',
                            background: i % 2 === 0 ? 'rgba(0,0,0,0.15)' : 'transparent',
                        }}>
                            <td style={{
                                padding: '14px 20px', fontWeight: 700, fontSize: 22,
                                color: backend === 'FEniCS' ? '#60a5fa' : '#f87171',
                            }}>{backend}</td>
                            <td style={{
                                padding: '14px 20px', fontSize: 21, color: 'var(--sl-text)',
                                borderLeft: '1px solid rgba(0,216,255,0.12)',
                            }}>{model}</td>
                            {r1.map((v, j) => (
                                <td key={j} style={{
                                    textAlign: 'center', padding: '14px 14px',
                                    fontFamily: 'monospace', fontSize: 24, fontWeight: 700,
                                    color: '#4ade80',
                                    borderLeft: '1px solid rgba(0,216,255,0.12)',
                                }}>{v.toFixed(2)} ✓</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Badge resumen */}
        <div style={{
            display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0,
            padding: '14px 24px',
            border: '2px solid #4ade80', borderRadius: 8,
            background: 'rgba(74,222,128,0.08)',
        }}>
            <span style={{ fontSize: 34 }}>✅</span>
            <div>
                <p style={{ margin: 0, color: '#4ade80', fontWeight: 700, fontSize: 26 }}>
                    6 / 6 casos — 4/4 refinamientos superan criterio ≥ 3.5
                </p>
                <p style={{ margin: '4px 0 0', color: 'var(--sl-text)', fontSize: 22 }}>
                    ratio r₁ = 4.00 exacto (valor teórico <InlineMath math={"\\mathcal{O}(h^2)"} />) — idéntico en todos los casos
                </p>
            </div>
            <p style={{ margin: 0, color: 'var(--sl-muted)', fontSize: 20, marginLeft: 'auto', flexShrink: 0, textAlign: 'right' }}>
                BFR/RBF-FD + FEniCS/UFL<br />ADR · MRMT Semi · MRMT Bloque
            </p>
        </div>
    </SlideLayout>
);

export default A3S04c;
