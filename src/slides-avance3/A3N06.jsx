import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Configuración de las corridas del grupo M_modelo_nuevo (experimentos/catalogo.py, MAIN_FUENTE).
const FILAS = [
    ['Modelo',              'sin W₋ (factor_sumidero_C = 0), con −S_s∂ₜh·C (S_s = φ)', 'nuevo'],
    ['Salida del flujo',    'libre: componente normal de ∂ₙu = 0 (BFR "libre" y FEniCSx)', 'nuevo'],
    ['Decaimiento λ_d',     'solo en ADR (MRMT sin decaimiento en ambos backends)', 'nuevo'],
    ['Fuente de soluto',    'ε_z = 30 m e intensidad 5·10⁻¹² (main: 60 m y 10⁻¹¹), igual en las 3 variantes', 'cambio'],
    ['Malla',               'compartida BFR+FEniCSx: 15 626 nodos + 862 fantasmas (main genera la suya)', 'cambio'],
    ['Paso y horizonte',    'Δt = 5 h, T = 30 d (144 pasos)', 'main'],
    ['Caudal',              'Q_std = 10⁻³ m²/s (orden de main; Q_max = 10⁻²)', 'main'],
    ['Esquema',             'θ = θ_C = 1, n_stencil = 25, r_pozo = 20 m', 'main'],
    ['MRMT',                'N_r = 3 (D_eff, β, φ_im de default.json)', 'main'],
];
const COL = { nuevo: '#4ade80', cambio: '#fb923c', main: '#60a5fa' };
const ETQ = { nuevo: 'modelo nuevo', cambio: 'cambio acordado', main: 'como main' };

export default function A3N06({ theme = 'dark' }) {
    return (
        <SlideLayout title="Configuración de las corridas — modelo nuevo, valores de main" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
                {FILAS.map(([k, v, t]) => (
                    <div key={k} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16,
                                          borderLeft: `4px solid ${COL[t]}`, background: `${COL[t]}10`,
                                          borderRadius: '0 6px 6px 0', padding: '0 14px' }}>
                        <span style={{ color: 'var(--sl-muted)', fontSize: 21, fontWeight: 700, minWidth: 190 }}>{k}</span>
                        <span style={{ color: 'var(--sl-text)', fontSize: 22, flex: 1, lineHeight: 1.3 }}>{v}</span>
                        <span style={{ color: COL[t], fontSize: 17, fontWeight: 700, minWidth: 130, textAlign: 'right' }}>{ETQ[t]}</span>
                    </div>
                ))}
            </div>
        </SlideLayout>
    );
}
