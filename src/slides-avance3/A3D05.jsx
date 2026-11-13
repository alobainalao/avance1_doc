import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';

// Conjunto admisible (tesis, Cap. III: eq:cota_Q, eq:cota_zp, eq:demanda_variable, eq:balance_tanque,
// eq:cota_tanque, eq:duty_cycle, eq:Uad). Valores de config/nitrato_vscale_malla_g1.json.
const bloques = [
    { t: 'Caudal: disponibilidad horaria de la bomba', m: String.raw`0\le Q_n\le \overline Q_n:=Q_{\max}\,a(\tau_n),\qquad Q(t)=Q_n\ \text{en}\ (t_n,t_{n+1}]`, id: 'cota-Q' },
    { t: 'Profundidad del pozo', m: String.raw`z_{\min}\le z_p\le z_{\max}<z_0`, id: 'cota-zp' },
    { t: 'Tanque: balance y capacidad', m: String.raw`S_n=S_0+V_s\,\Delta t\sum_{k=0}^{n}Q_k-\sum_{k=0}^{n}d_k,\qquad 0\le S_n\le S_{\max}`, id: 'tanque' },
    { t: 'Ciclo de la bomba (ventana deslizante)', m: String.raw`\sum_{k=n}^{n+W-1}Q_k\le f_d\,Q_{\max}\,W,\qquad f_d=\frac{T_{\rm on}}{T_{\rm on}+T_{\rm off}}`, id: 'ciclo' },
];

const valores = [
    [String.raw`Q_{\max}`, '0.2 m²/s'], [String.raw`[z_{\min},z_{\max}]`, '[−1400, −200] m'], [String.raw`z_0`, '220 m'],
    [String.raw`S_0,\ S_{\max}`, '500, 2 000 m³'], [String.raw`D_{\rm dom}+D_{\rm agri}`, '750 + 250 m³/día'],
    [String.raw`T_{\rm on},T_{\rm off}`, '20 h, 4 h'], [String.raw`\Delta t,\ N_t`, '10 h, 72'],
];

export default function A3D05({ theme = 'dark' }) {
    return (
        <SlideLayout title="Conjunto admisible: bomba, pozo y tanque" theme={theme} justify="flex-start">
            {bloques.map(b => (
                <div key={b.id} style={{ borderLeft: '3px solid var(--a3-agua)', padding: '2px 0 2px 18px', margin: '4px 0' }}>
                    <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>{b.t}</p>
                    <Eq math={b.m} id={b.id} compacta />
                </div>
            ))}
            <p style={{ margin: '10px 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Todas las restricciones son lineales en <InlineMath math="(Q_1,\dots,Q_{72},z_p)" />: <InlineMath math="\mathcal U_{ad}" /> es un
                poliedro convexo y compacto. El tanque acopla todos los pasos de tiempo: cada <InlineMath math="S_n" /> depende de{' '}
                <InlineMath math="Q_0,\dots,Q_n" />.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 30px', borderTop: '1px solid var(--a3-filete)', paddingTop: 10 }}>
                {valores.map(([k, v]) => (
                    <span key={k} style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>
                        <InlineMath math={k} /> <span style={{ color: 'var(--sl-muted)' }}>= {v}</span>
                    </span>
                ))}
            </div>
        </SlideLayout>
    );
}

A3D05.ecuaciones = ['cota-Q', 'cota-zp', 'tanque', 'ciclo'];
