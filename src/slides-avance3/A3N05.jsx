import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Verificación del gradiente adjunto del modelo sin sumidero, con salida libre (4 nov 2026).
// FEniCSx: tests/test_gradiente_modelo_nuevo.py (C≡1, 3 pasos, 4 direcciones, pasos de diferencias 1e-2 y 3e-3).
// BFR: tests/test_adjunto_exacto.py (adjunto discreto exacto; cierre "libre"; columnas reejecutadas: Q aleatoria y (Q,zp)).
const FEM = [
    { m: 'ADR',         r: '1.3·10⁻¹⁰ – 1.9·10⁻⁷' },
    { m: 'MRMT Semi',   r: '1.4·10⁻⁹ – 6.5·10⁻⁷' },
    { m: 'MRMT Bloque', r: '3.5·10⁻¹⁰ – 1.9·10⁻⁷' },
];
const BFR = [
    { m: 'ADR',         q: '1.5·10⁻⁵', qz: '4.8·10⁻⁶' },
    { m: 'MRMT Semi',   q: '3.0·10⁻⁵', qz: '4.9·10⁻⁶' },
    { m: 'MRMT Bloque', q: '1.4·10⁻⁵', qz: '5.2·10⁻⁶' },
];
const th = { padding: '10px 16px', color: 'var(--sl-muted)', fontSize: 20, fontWeight: 700, textAlign: 'left' };
const td = { padding: '10px 16px', color: 'var(--sl-text)', fontSize: 22, fontFamily: 'monospace',
             borderTop: '1px solid rgba(0,216,255,0.10)' };
const box = { border: '1px solid var(--a3-filete, #C9D3DB)', borderRadius: 10, overflow: 'hidden' };

export default function A3N05({ theme = 'dark' }) {
    return (
        <SlideLayout title="Verificación del gradiente adjunto — modelo nuevo" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: '3%', flexShrink: 0 }}>
                <div style={{ flex: 1, ...box }}>
                    <p style={{ margin: 0, padding: '10px 16px', color: 'var(--sl-text)', fontWeight: 700, fontSize: 24, background: 'transparent' }}>
                        FEniCSx (UFL) — error relativo vs. diferencias finitas
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={th}>Modelo</th><th style={th}>4 direcciones</th></tr></thead>
                        <tbody>{FEM.map(({ m, r }) => <tr key={m}><td style={td}>{m}</td><td style={{ ...td, color: '#2E7D4F' }}>{r}</td></tr>)}</tbody>
                    </table>
                </div>
                <div style={{ flex: 1, ...box }}>
                    <p style={{ margin: 0, padding: '10px 16px', color: 'var(--sl-text)', fontWeight: 700, fontSize: 24, background: 'transparent' }}>
                        BFR (RBF-FD) — adjunto discreto exacto
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={th}>Modelo</th><th style={th}>Q aleatoria</th><th style={th}>(Q, z_p)</th></tr></thead>
                        <tbody>{BFR.map(({ m, q, qz }) => (
                            <tr key={m}><td style={td}>{m}</td><td style={{ ...td, color: '#2E7D4F' }}>{q}</td><td style={{ ...td, color: '#2E7D4F' }}>{qz}</td></tr>
                        ))}</tbody>
                    </table>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
                {[
                    ['#2E7D4F', 'Salida libre (∂ₙ(u·n)=0) en ambos backends; modelo sin sumidero del pozo, con −S_s∂ₜh·C y fuente −S_s∂ₜ(Cψ_C) en el adjunto del flujo.'],
                    ['#0F7A85', 'Banco 1D independiente del simulador: adjunto continuo vs. diferencias finitas, error O(h); sin la fuente de almacenamiento el error es 0.8–1.6.'],
                    ['#C4511F', 'Aún no verificado: configuración tipo main con la pluma llegando al pozo.'],
                ].map(([c, t]) => (
                    <div key={t} style={{ borderLeft: `4px solid ${c}`, background: 'transparent', borderRadius: '0 6px 6px 0', padding: '8px 14px' }}>
                        <span style={{ color: 'var(--sl-text)', fontSize: 21, lineHeight: 1.4 }}>{t}</span>
                    </div>
                ))}
            </div>
        </SlideLayout>
    );
}
