import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const eqJ   = String.raw`\min_{Q(\cdot),\,z_p}\;J = \gamma\,J_m + J_e`;
const eqJm  = String.raw`J_m = \int_0^T\!\!\int_\Omega g_\varepsilon(\mathbf x;z_p)\,C(\mathbf x,t)^2\,\mathrm{d}\Omega\,\mathrm{d}t`;
const eqJe  = String.raw`J_e = \alpha\,\kappa_p\,(z_p-z_0)^2+\beta\,d_p\!\int_0^T\!Q(t)^2\,\mathrm{d}t,\quad d_p=z_0-z_p`;
const eqX   = String.raw`Q \in L^2([0,T]),\quad z_p \in \mathbb{R}`;
const eqBQ  = String.raw`0 \le Q(t) \le Q_{\max}\cdot\mathrm{avail}(t)\quad\text{c.p.d.}`;
const eqBzp = String.raw`z_{p,\min} \le z_p \le z_{p,\max}`;
const eqSup = String.raw`0 \le S_0 + V_s\!\int_0^t\!Q(\tau)\,\mathrm{d}\tau - \int_0^t\!d(\tau)\,\mathrm{d}\tau \le S_{\max}\quad\forall\,t\in[0,T]`;

const A3S13 = ({ theme = 'dark' }) => (
    <SlideLayout title="Problema de optimización — formulación completa" theme={theme} justify="flex-start">

        {/* Funcional */}
        <div style={{ textAlign: 'center', flexShrink: 0, padding: '2px 0 4px',
                      borderBottom: '1.5px solid var(--a3-filete, #C9D3DB)' }}>
            <BlockMath math={eqJ} />
        </div>

        {/* Términos Jm / Je */}
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
            {[
                { name: 'J_m', label: 'calidad — concentración alrededor del pozo', color: '#C4511F', eq: eqJm },
                { name: 'J_e', label: 'costo — instalación y bombeo', color: '#C4511F', eq: eqJe },
            ].map(({ name, label, color, eq }) => (
                <div key={name} style={{
                    flex: 1, padding: '10px 18px',
                    border: `1.5px solid ${color}44`, borderRadius: 10,
                    background: 'transparent',
                    display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                    <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color }}>
                        <InlineMath math={name} />
                        <span style={{ color: 'var(--sl-muted)', fontWeight: 400, marginLeft: 10, fontSize: 17 }}>{label}</span>
                    </p>
                    <BlockMath math={eq} />
                </div>
            ))}
        </div>

        {/* Controles + cotas */}
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            {[
                { head: 'Espacio de control', color: '#0F7A85', eq: eqX },
                { head: 'Cotas Q(t) — ciclo bomba', color: '#C4511F', eq: eqBQ },
                { head: 'Cotas de la profundidad', color: '#0F7A85', eq: eqBzp },
            ].map(({ head, color, eq }) => (
                <div key={head} style={{
                    flex: 1, padding: '10px 16px',
                    border: `1px solid ${color}44`, borderRadius: 10,
                    background: 'transparent',
                    borderLeft: `3px solid ${color}`,
                }}>
                    <p style={{ margin: '0 0 2px', fontSize: 17, fontWeight: 700, color }}>{head}</p>
                    <BlockMath math={eq} />
                </div>
            ))}
        </div>

        {/* Restricción de suministro */}
        <div style={{
            flexShrink: 0, padding: '10px 20px',
            border: '1.5px solid rgba(96,165,250,0.45)', borderRadius: 10,
            background: 'rgba(96,165,250,0.06)',
            borderLeft: '3px solid #0F7A85',
        }}>
            <p style={{ margin: '0 0 2px', fontSize: 17, fontWeight: 700, color: '#0F7A85' }}>
                Restricción lineal de suministro &nbsp;
                <span style={{ fontWeight: 400, color: 'var(--sl-muted)', fontSize: 16 }}>
                    (demanda diurna doméstica + riego, tanque de almacenamiento)
                </span>
            </p>
            <BlockMath math={eqSup} />
        </div>

        {/* Optimizador + defaults */}
        <div style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0,
            border: '1px solid rgba(0,216,255,0.18)', borderRadius: 10,
            overflow: 'hidden', background: 'rgba(46,45,138,0.05)',
        }}>
            <div style={{ padding: '12px 22px', borderRight: '1px solid rgba(0,216,255,0.15)',
                          background: 'rgba(74,222,128,0.07)' }}>
                <p style={{ margin: '0 0 2px', fontSize: 17, color: 'var(--sl-muted)' }}>Optimizador</p>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 22,
                            fontWeight: 700, color: '#2E7D4F' }}>trust-constr</p>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 15,
                            fontWeight: 500, color: '#94a3b8' }}>BFR y FEniCSx · J normalizado</p>
            </div>
            {[
                [String.raw`\gamma`, '0.12', '#C4511F'],
                [String.raw`\kappa_p`, '1.0', '#C4511F'],
                ['z_0', '220 m', '#0F7A85'],
                [String.raw`Q_{\max}`, '0.2', '#0F7A85'],
                ['V_s', '0.0836', '#2E7D4F'],
                [String.raw`C_{\rm ref}`, '50 mg/L', '#C4511F'],
                [String.raw`S_{\max}`, '2000 m³', '#0F7A85'],
            ].map(([k, v, color]) => (
                <div key={k} style={{ flex: 1, padding: '12px 8px',
                                      borderRight: '1px solid rgba(0,216,255,0.10)',
                                      textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 19, color: 'var(--sl-muted)' }}><InlineMath math={k} /></p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 19,
                                fontWeight: 700, color, whiteSpace: 'nowrap' }}>{v}</p>
                </div>
            ))}
        </div>

    </SlideLayout>
);

export default A3S13;
