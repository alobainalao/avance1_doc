import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const escenarios = [
    {
        nombre: 'Conservador',
        Qmax: 5e-3, QmaxLabel: '5×10⁻³ m³/s',
        koppa: '1.0', maxiter: '30',
        nota: 'Bombeo moderado; penalización estándar en z_p',
        color: '#60a5fa',
        resultado: '−0.12 % ΔJ',
        resColor: '#f59e0b',
    },
    {
        nombre: 'Agresivo',
        Qmax: 1e-2, QmaxLabel: '1×10⁻² m³/s',
        koppa: '1.0', maxiter: '30',
        nota: 'Mayor extracción; mismo peso energético',
        color: '#f87171',
        resultado: '⬜ pendiente',
        resColor: '#94a3b8',
    },
    {
        nombre: 'Profundo',
        Qmax: 5e-3, QmaxLabel: '5×10⁻³ m³/s',
        koppa: '2.0', maxiter: '30',
        nota: 'Mayor penalización en z_p — favorece pozo profundo',
        color: '#4ade80',
        resultado: '⬜ pendiente',
        resColor: '#94a3b8',
    },
];

const Q_MAX_SCALE = 1e-2;

const QBar = ({ value, color }) => {
    const pct = (value / Q_MAX_SCALE) * 100;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}>
            <div style={{ flex: 1, height: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4,
                              boxShadow: `0 0 6px ${color}88` }} />
            </div>
        </div>
    );
};

const A3S06 = ({ theme = 'dark' }) => (
    <SlideLayout title="Escenarios de optimización" theme={theme} justify="flex-start">
        <p style={{ color: 'var(--sl-muted)', fontSize: 24, margin: '0 0 16px' }}>
            scipy trust-constr &nbsp;|&nbsp; controles{' '}
            <InlineMath math={String.raw`\mathbf{x}=(Q_1,\ldots,Q_{N_t},\,z_p)`} />{' '}
            &nbsp;|&nbsp; funcional{' '}
            <InlineMath math={String.raw`\mathcal{J}=\gamma J_m+J_e,\;\gamma=1`} />
        </p>

        <div style={{ display: 'flex', gap: '2.5%', flex: 1 }}>
            {escenarios.map((e) => (
                <div key={e.nombre} style={{
                    flex: 1,
                    border: `1.5px solid ${e.color}55`,
                    borderTop: `3px solid ${e.color}`,
                    borderRadius: 8,
                    padding: '22px 22px',
                    background: 'rgba(0,0,0,0.22)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                    <p style={{ color: e.color, fontWeight: 700, fontSize: 36, margin: 0 }}>{e.nombre}</p>

                    <table style={{ width: '100%', fontSize: 26, borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ color: 'var(--sl-muted)', paddingBottom: 5 }}>
                                    <InlineMath math={String.raw`Q_{\max}`} />
                                </td>
                                <td style={{ color: 'var(--sl-text)', paddingBottom: 5, textAlign: 'right', fontFamily: 'monospace' }}>
                                    {e.QmaxLabel}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <QBar value={e.Qmax} color={e.color} />

                    <table style={{ width: '100%', fontSize: 26, borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ color: 'var(--sl-muted)', paddingBottom: 5 }}>
                                    <InlineMath math={String.raw`\kappa`} />
                                </td>
                                <td style={{ color: 'var(--sl-text)', paddingBottom: 5, textAlign: 'right', fontFamily: 'monospace' }}>{e.koppa}</td>
                            </tr>
                            <tr>
                                <td style={{ color: 'var(--sl-muted)' }}>maxiter</td>
                                <td style={{ color: 'var(--sl-text)', textAlign: 'right', fontFamily: 'monospace' }}>{e.maxiter}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p style={{ color: 'var(--sl-muted)', fontSize: 21, margin: 0, fontStyle: 'italic', lineHeight: 1.3 }}>
                        {e.nota}
                    </p>

                    <div style={{ padding: '12px 14px', borderRadius: 7,
                                  background: `${e.resColor}15`, border: `1px solid ${e.resColor}55` }}>
                        <span style={{ color: e.resColor, fontWeight: 700, fontSize: 26 }}>{e.resultado}</span>
                    </div>
                </div>
            ))}
        </div>

        <p style={{ marginTop: 12, color: 'var(--sl-muted)', fontSize: 22 }}>
            Dos puntos iniciales por escenario (<InlineMath math={String.raw`Q_0=Q_{\text{base}}`} /> y{' '}
            <InlineMath math={String.raw`Q_0=Q_{\max}/2`} />) · Referencia energética:{' '}
            <InlineMath math={String.raw`z_0 = 220\,\text{m}`} />
        </p>
    </SlideLayout>
);

export default A3S06;
