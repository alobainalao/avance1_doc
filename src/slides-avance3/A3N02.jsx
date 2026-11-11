import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

// Modelo sin sumidero explícito (docs/adjunto_sin_sumidero.pdf, §2). Código de colores del documento.
const rojo = '#C4511F', azul = '#0F7A85', verde = '#2E7D4F';

const eqFlujo = String.raw`S_s\,\partial_t h-\nabla\!\cdot(K\nabla h)=f=-Q\,\varrho
\;\;\Longrightarrow\;\;
\textcolor{${azul}}{\nabla\!\cdot\mathbf u}=\textcolor{${rojo}}{f}-\textcolor{${verde}}{S_s\,\partial_t h}`;

const eqCons = String.raw`\phi R\,\partial_t C+\nabla\!\cdot(\mathbf u C-D\nabla C)+\lambda_d\phi R\,C=W_++\textcolor{${rojo}}{f\,C}`;

const eqDesarr = String.raw`\begin{aligned}
&\phi R\,\partial_t C+\mathbf u\!\cdot\!\nabla C-\nabla\!\cdot(D\nabla C)+\lambda_d\phi R\,C+\textcolor{${azul}}{C\,\nabla\!\cdot\mathbf u}=W_++\textcolor{${rojo}}{f\,C}\\
&\text{con }\nabla\!\cdot\mathbf u=f-S_s\partial_t h:\quad\textcolor{${rojo}}{fC}\ \text{aparece en ambos miembros y se cancela}
\end{aligned}`;

const eqADR = String.raw`\boxed{\;\phi R\,\partial_t C+\mathbf u\!\cdot\!\nabla C-\nabla\!\cdot(D\nabla C)+\lambda_d\phi R\,C\;\textcolor{${verde}}{-\,S_s\,\partial_t h\,C}=W_+\;}`;

export default function A3N02({ theme = 'dark' }) {
    return (
        <SlideLayout title="Modelo sin sumidero explícito: se cancela fC" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1, minHeight: 0 }}>
                <EqCard title="1 · Balance de agua  →  divergencia de la velocidad">
                    <BlockMath math={eqFlujo} />
                </EqCard>
                <EqCard title="2 · Balance de soluto conservativo (el pozo extrae soluto con el agua)">
                    <BlockMath math={eqCons} />
                </EqCard>
                <EqCard title="3 · Regla del producto y sustitución">
                    <BlockMath math={eqDesarr} />
                </EqCard>
                <EqCard title="4 · Resultado (ADR); MRMT añade el intercambio con las regiones inmóviles">
                    <BlockMath math={eqADR} />
                </EqCard>
                <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 22, lineHeight: 1.4 }}>
                    El pozo no es un sumidero en la ecuación de <InlineMath math="C" />: el soluto sale porque{' '}
                    <InlineMath math="\mathbf u" /> converge hacia él. Solo queda el almacenamiento{' '}
                    <span style={{ color: verde }}><InlineMath math="-S_s\partial_t h\,C" /></span>
                    {' '}(con <InlineMath math="\phi" /> constante y <InlineMath math="S_s=\phi" /> numérico).
                </p>
            </div>
        </SlideLayout>
    );
}
