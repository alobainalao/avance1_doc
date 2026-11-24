import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';

// Configuración de las tres familias de corridas que aparecen en el avance: comparación directa (experimentos/catalogo.py,
// grupo MC_malla_conos con experimentos/base.json), verificación del gradiente (tests/test_gradiente_modelo_nuevo.py) y
// optimización (experimentos/optimizar_nitrato.py con config/nitrato_vscale_malla_eje_g1.json).
const M = (t) => <InlineMath math={t} />;
const COLS = ['Comparación directa', 'Verificación del gradiente', 'Optimización'];
const filas = [
    ['Discretización', 'RBF-FD y elementos finitos', 'RBF-FD y elementos finitos', 'solo elementos finitos'],
    ['Malla', 'con conos, 20 348 nodos (común)', 'de prueba: 30 m (RBF-FD), 120 m (EF)', 'con eje de 1 m, 25 871 nodos'],
    ['Tiempo', <>{M('\\Delta t=5')} h, 30 días</>, <>{M('\\Delta t=10')} h, 3 pasos</>, <>{M('\\Delta t=10')} h, 72 pasos (30 días)</>],
    ['Modelos', 'ADR, MRMT semi y bloque (3 regiones)', 'ADR, MRMT semi y bloque (2 regiones)', 'ADR, MRMT semi y bloque (3 regiones)'],
    ['Controles', <>caudal de referencia 0.3 m²/s, {M('z_p=-700')} m</>, <>{M('Q')} y {M('z_p')} de la config; {M('C')} inicial ≡ 1</>,
        <>72 caudales + {M('z_p')}; arranque {M('Q_n=0.1')}, {M('z_p=-700')} m</>],
    ['Funcional', '—', 'sin normalizar', <>normalizado, {M('\\gamma=\\alpha=\\beta=1')}</>],
    ['Concentración', 'unidades del modelo', 'unidades del modelo', <>nitrato en mg/L: pico sin bombeo 186 mg/L; {M('C_{\\rm ref}')} = 50 mg/L (OMS)</>],
    ['Optimizador', '—', '—', <>trust-constr de SciPy <Cita k="virtanen2020scipy" /> (barrera, BFGS), paro {M('\\chi<10^{-4}')} (aún no alcanzado)</>],
];

export default function A3D22({ theme = 'dark' }) {
    return (
        <SlideLayout title="Configuración de las corridas" theme={theme} justify="flex-start">
            <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                        <th style={th}></th>
                        {COLS.map(c => <th key={c} style={{ ...th, color: 'var(--sl-accent)' }}>{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filas.map(([n, ...v], i) => (
                        <tr key={n} style={{ borderTop: i ? '1px solid var(--a3-filete)' : 'none' }}>
                            <td style={{ ...td, color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', whiteSpace: 'nowrap' }}>{n}</td>
                            {v.map((x, k) => <td key={k} style={td}>{x}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p style={{ margin: '12px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Las tres usan el mismo dominio, la misma porosidad y la salida libre. El modelo es lineal en <InlineMath math="C" />, así que
                la fuente se escala para expresar <InlineMath math="C" /> como nitrato (la misma escala en los tres modelos).
            </p>
        </SlideLayout>
    );
}

const th = { padding: '7px 10px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', fontWeight: 600 };
const td = { padding: '7px 10px', fontSize: 19, color: 'var(--sl-text)', lineHeight: 1.3, verticalAlign: 'top' };
