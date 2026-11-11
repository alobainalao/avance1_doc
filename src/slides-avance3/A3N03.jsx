import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Eq } from './ui.jsx';

// Condición de salida libre (docs/adjunto_sin_sumidero.pdf, §2.2): componente normal de ∂ₙu = 0.
const eqCond = String.raw`\partial_{\mathbf n}\mathbf u=(\nabla\mathbf u)\,\mathbf n=\mathbf 0,\qquad \mathbf u=-K(\mathbf x)\nabla h`;
const eqBorde = String.raw`\partial_n(\mathbf u\!\cdot\!\mathbf n)=0\;\Longleftrightarrow\;
S_s\,\partial_t h-\partial_\tau\!\bigl(K_{\tau\tau}\,\partial_\tau h\bigr)=0\ \text{ en }\Gamma_{\rm out}`;

const Punto = ({ color = '#00d8ff', children }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
                  borderLeft: `4px solid ${color}`, background: `${color}10`,
                  borderRadius: '0 6px 6px 0', padding: '8px 14px' }}>
        <span style={{ color: 'var(--sl-text)', fontSize: 22, lineHeight: 1.4 }}>{children}</span>
    </div>
);

export default function A3N03({ theme = 'dark' }) {
    return (
        <SlideLayout title="Salida libre: derivada normal de u nula" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: '3%', flex: 1, minHeight: 0 }}>
                <div style={{ flex: 5, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <EqCard title="Condición en Γout (K variable)"><BlockMath math={eqCond} /></EqCard>
                    <Punto color="#f87171">
                        Vectorial, son 2 ecuaciones de orden 2 sobre un escalar de orden 2: <b>no cierra</b> el problema de flujo.
                    </Punto>
                    <EqCard title="Componente normal — cierre adoptado">
                        <Eq math={eqBorde} s={0.85} />
                    </EqCard>
                    <Punto color="#4ade80">
                        La componente tangencial <b>no se impone</b> (decisión del autor).
                    </Punto>
                </div>
                <div style={{ width: 1, background: 'rgba(0,216,255,0.20)', flexShrink: 0 }} />
                <div style={{ flex: 5, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ color: 'var(--sl-accent)', fontWeight: 700, fontSize: 26, margin: 0 }}>Consecuencias</p>
                    <Punto>
                        <InlineMath math="h|_{\Gamma_{\rm out}}" /> evoluciona <b>solo</b> (condición de Wentzell sin término normal): el flujo es un
                        problema de Dirichlet con ese dato.
                    </Punto>
                    <Punto>
                        En régimen estacionario <InlineMath math="h" /> es constante a lo largo de Γout; el flujo normal es una salida, no un dato.
                    </Punto>
                    <Punto color="#a78bfa">
                        Adjunto del flujo: <InlineMath math="\psi_h=0" /> en Γout (dato independiente de los controles).
                    </Punto>
                    <Punto color="#fb923c">
                        Implementación: BFR <code>bc_outlet_mode="libre"</code>; FEniCSx por Dirichlet con el dato calculado por la
                        misma ecuación de borde (diferencias de 3 puntos, θ del flujo).
                    </Punto>
                </div>
            </div>
        </SlideLayout>
    );
}
