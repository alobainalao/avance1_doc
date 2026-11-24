import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';

// Planteamiento del problema de control (tesis, Cap. III: eq:J_escalar, eq:Jm, eq:Jinst, eq:Jop, eq:Uad).
const eqP = String.raw`\min_{u=(Q,\,z_p)\,\in\,\mathcal U_{ad}}\ \hat J(u)=J\big(y(u),u\big)
\quad\text{s.a.}\quad e(y,u)=0,\qquad y=(h,\,C_m,\,C_{\mathrm{im},r})`;
const eqJ = String.raw`J=\gamma\underbrace{\int_0^T\!\!\int_\Omega g_\varepsilon(\mathbf x;z_p)\,C_m^2\,d\Omega\,dt}_{J_m:\ \text{calidad del agua extraída}}
+\alpha\underbrace{\kappa_p\,(z_p-z_0)^2}_{J_{\rm inst}}+\beta\underbrace{d_p\!\int_0^T\!Q(t)^2\,dt}_{J_{\rm op}}`;
const eqE = String.raw`e(y,u)=\begin{cases}
S_s\,\partial_t h-\nabla\!\cdot(\mathbf K\nabla h)+Q\,g_\varepsilon(\cdot;z_p) & \text{flujo}\\[2pt]
\phi R\,\partial_t C_m+\mathbf u\!\cdot\!\nabla C_m-\nabla\!\cdot(\mathbf D\nabla C_m)-S_s\partial_t h\,C_m+\textstyle\sum_r\lambda_r(C_m-C_{\mathrm{im},r})-W_+ & \text{transporte}\\[2pt]
\phi_{\mathrm{im},r}R\,\partial_t C_{\mathrm{im},r}-\lambda_r(C_m-C_{\mathrm{im},r}),\quad r=1,2,3 & \text{inmóviles}
\end{cases}`;

const nodos = [
    { t: 'Controles', m: String.raw`Q_1,\dots,Q_{72},\ z_p`, c: 'var(--a3-agua)' },
    { t: 'Estado', m: String.raw`h\ \to\ \mathbf u=-\mathbf K\nabla h\ \to\ C_m,\ C_{\mathrm{im},r}`, c: 'var(--sl-text)' },
    { t: 'Funcional', m: String.raw`\hat J(u)`, c: 'var(--a3-pluma)' },
];

export default function A3D04({ theme = 'dark' }) {
    const [p] = useProgreso(2600, 300);
    return (
        <SlideLayout title="El problema de control óptimo" theme={theme} justify="flex-start">
            <div
                 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, margin: '0 0 10px' }}>
                {nodos.map((n, i) => (
                    <React.Fragment key={n.t}>
                        {i > 0 && (
                            <div style={{ width: 120, height: 2, background: 'var(--sl-muted)', position: 'relative', opacity: tramo(p, 0.15 + 0.3 * (i - 1), 0.35 + 0.3 * (i - 1)) }}>
                                <span style={{ position: 'absolute', right: -4, top: -11, color: 'var(--sl-muted)', fontSize: 20 }}>▶</span>
                                <span style={{ position: 'absolute', top: -30, width: '100%', textAlign: 'center', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                                    {i === 1 ? 'EDP' : 'evaluar'}
                                </span>
                            </div>
                        )}
                        <div style={{ padding: '10px 22px', borderLeft: `3px solid ${n.c}`, opacity: tramo(p, 0.3 * i, 0.3 * i + 0.2) }}>
                            <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>{n.t}</p>
                            <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}><InlineMath math={n.m} /></span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <div style={{ opacity: tramo(p, 0.6, 0.85) }}>
                <Eq math={eqP} id="problema" />
                <Eq math={eqJ} id="funcional" compacta />
                <Eq math={eqE} id="estado" compacta />
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', opacity: tramo(p, 0.8, 1) }}>
                Problema de control con EDP parabólicas <Cita k="manzoni2021optimal" p="cap. 7" />. Control <InlineMath math="u=(Q,z_p)" />; velocidad de Darcy <InlineMath math="\mathbf u=-\mathbf K\nabla h" /><span className="a3-completa"> (en negrita).
                Condiciones de frontera e iniciales del modelo (salida libre en <InlineMath math="\Gamma_{\rm out}" />).{' '}
                <InlineMath math="d_p=z_0-z_p" />, con <InlineMath math="z_0=220" /> m la cota de referencia de la superficie; <InlineMath math="\kappa_p>0" />:
                coeficiente del costo de instalación. El mismo núcleo gaussiano <InlineMath math="g_\varepsilon" /> reparte el caudal extraído y
                pesa la concentración alrededor del pozo. Cada término se divide por su escala (<InlineMath math="J_m" /> por{' '}
                <InlineMath math="C_{\rm ref}^2T" /> con <InlineMath math="C_{\rm ref}" /> = 50 mg/L <Cita k="oms2022" />; <InlineMath math="J_{\rm inst}" /> y{' '}
                <InlineMath math="J_{\rm op}" /> por sus valores en las cotas); aquí <InlineMath math="\gamma=\alpha=\beta=1" />.</span>
                <span className="a3-publica">. Profundidad <InlineMath math="d_p=z_0-z_p" />; cada término dividido por su escala y <InlineMath math="\gamma=\alpha=\beta=1" />.</span>
            </p>
        </SlideLayout>
    );
}

A3D04.ecuaciones = ['problema', 'funcional', 'estado'];
