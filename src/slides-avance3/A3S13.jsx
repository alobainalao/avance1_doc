import React from 'react';
import { BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const eqJ   = String.raw`\min_{Q(\cdot),\,z_p}\;\mathcal{J} = \gamma\,J_m + J_e`;
const eqJm  = String.raw`J_m = \int_0^T C_{\!w}(t)^2\,\mathrm{d}t`;
const eqJe  = String.raw`J_e = \kappa\,|z_p-z_0|^2 + \Bigl(\int_0^T\!Q(t)^2\,\mathrm{d}t\Bigr)|z_p-z_0|`;
const eqX   = String.raw`Q \in L^2([0,T]),\quad z_p \in \mathbb{R}`;
const eqBQ  = String.raw`0 \le Q(t) \le Q_{\max}\cdot\mathrm{avail}(t)\quad\text{c.p.d.}`;
const eqBzp = String.raw`z_{p,\min} \le z_p \le z_{p,\max}`;
const eqSup = String.raw`0 \le S_0 + V_s\!\int_0^t\!Q(\tau)\,\mathrm{d}\tau - \int_0^t\!d(\tau)\,\mathrm{d}\tau \le S_{\max}\quad\forall\,t\in[0,T]`;

const A3S13 = ({ theme = 'dark' }) => (
    <SlideLayout title="Problema de optimización — formulación completa" theme={theme} justify="flex-start">

        {/* Funcional */}
        <div style={{ textAlign: 'center', flexShrink: 0, padding: '2px 0 4px',
                      borderBottom: '1.5px solid rgba(0,216,255,0.22)' }}>
            <BlockMath math={eqJ} />
        </div>

        {/* Términos Jm / Je */}
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
            {[
                { name: 'Jm', label: 'calidad — contaminación en el pozo', color: '#f87171', eq: eqJm },
                { name: 'Je', label: 'costo — profundidad y bombeo',       color: '#fbbf24', eq: eqJe },
            ].map(({ name, label, color, eq }) => (
                <div key={name} style={{
                    flex: 1, padding: '10px 18px',
                    border: `1.5px solid ${color}44`, borderRadius: 10,
                    background: `${color}08`,
                    display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                    <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color }}>
                        <span style={{ fontFamily: 'monospace' }}>{name}</span>
                        <span style={{ color: 'var(--sl-muted)', fontWeight: 400, marginLeft: 10, fontSize: 17 }}>{label}</span>
                    </p>
                    <BlockMath math={eq} />
                </div>
            ))}
        </div>

        {/* Controles + cotas */}
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            {[
                { head: 'Espacio de control', color: '#00d8ff', eq: eqX },
                { head: 'Cotas Q(t) — ciclo bomba', color: '#fbbf24', eq: eqBQ },
                { head: 'Cotas z_p',              color: '#a78bfa', eq: eqBzp },
            ].map(({ head, color, eq }) => (
                <div key={head} style={{
                    flex: 1, padding: '10px 16px',
                    border: `1px solid ${color}44`, borderRadius: 10,
                    background: `${color}08`,
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
            borderLeft: '3px solid #60a5fa',
        }}>
            <p style={{ margin: '0 0 2px', fontSize: 17, fontWeight: 700, color: '#60a5fa' }}>
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
            overflow: 'hidden', background: 'rgba(0,0,0,0.18)',
        }}>
            <div style={{ padding: '12px 22px', borderRight: '1px solid rgba(0,216,255,0.15)',
                          background: 'rgba(74,222,128,0.07)' }}>
                <p style={{ margin: '0 0 2px', fontSize: 17, color: 'var(--sl-muted)' }}>Optimizador</p>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 22,
                            fontWeight: 700, color: '#4ade80' }}>SLSQP <span style={{fontSize:14,color:'#94a3b8',fontWeight:400}}>(BFR)</span></p>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 15,
                            fontWeight: 500, color: '#94a3b8' }}>trust-constr (FEniCS)</p>
            </div>
            {[
                ['γ',        '2×10¹⁷',  '#f87171'],
                ['κ',        '1.0',      '#fbbf24'],
                ['z₀',       '220 m',    '#a78bfa'],
                ['Q_max',    '10⁻² m²/s','#00d8ff'],
                ['Vscale',   '30 m',     '#4ade80'],
                ['S_max',    '2000 m³',  '#60a5fa'],
            ].map(([k, v, color]) => (
                <div key={k} style={{ flex: 1, padding: '12px 16px',
                                      borderRight: '1px solid rgba(0,216,255,0.10)',
                                      textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px', fontFamily: 'monospace', fontSize: 17,
                                color: 'var(--sl-muted)' }}>{k}</p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 22,
                                fontWeight: 700, color }}>{v}</p>
                </div>
            ))}
        </div>

    </SlideLayout>
);

export default A3S13;
