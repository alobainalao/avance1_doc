import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Eq, Cita } from './ui.jsx';

// Modelo sin sumidero explícito (docs/adjunto_sin_sumidero.pdf, §2). Código de colores del documento.
const rojo = '#C4511F', azul = '#0F7A85', verde = '#2E7D4F';

const eqFlujo = String.raw`S_s\,\partial_t h-\nabla\!\cdot(\mathbf K\nabla h)=f=-Q\,g_\varepsilon(\cdot;z_p)
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
                    <Eq math={eqFlujo} id='flujo' />
                </EqCard>
                <EqCard title={<>2 · Balance de soluto conservativo<span className="a3-completa"> (el pozo extrae soluto con el agua)</span></>}>
                    <Eq math={eqCons} id='soluto-cons' />
                </EqCard>
                <EqCard title="3 · Regla del producto y sustitución">
                    <Eq math={eqDesarr} id='soluto-desarrollo' />
                </EqCard>
                <EqCard title={<>4 · Resultado (ADR)<span className="a3-completa">; MRMT añade el intercambio con las regiones inmóviles</span></>}>
                    <Eq math={eqADR} id='adr' />
                </EqCard>
                <p className="a3-publica" style={{ margin: 0, color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', lineHeight: 1.4 }}>
                    El pozo no es un sumidero de <InlineMath math="C" />: el soluto sale porque{' '}
                    <InlineMath math="\mathbf u" /> converge hacia él.
                </p>
                <p className="a3-completa" style={{ margin: 0, color: 'var(--sl-text)', fontSize: 22, lineHeight: 1.4 }}>
                    Balances de agua y de soluto en un medio poroso <Cita k="bear1972dynamics" />. El pozo no es un sumidero en la
                    ecuación de <InlineMath math="C" />: el soluto sale porque la velocidad de Darcy{' '}
                    <InlineMath math="\mathbf u=-\mathbf K\nabla h" /> converge hacia él. Solo queda el almacenamiento{' '}
                    <span style={{ color: verde }}><InlineMath math="-S_s\partial_t h\,C" /></span>.
                </p>
                <p style={{ margin: 0, color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', lineHeight: 1.4 }}>
                    <InlineMath math="g_\varepsilon" />: núcleo <span className="a3-completa">gaussiano </span>del pozo<span className="a3-completa"> (masa 1)</span>; <InlineMath math="W_+" />: fuente de nitrato;{' '}
                    <InlineMath math="R" />: retardo; <InlineMath math="\lambda_d" />: decaimiento; <InlineMath math="D" />: dispersión.<span className="a3-completa">{' '}
                    <InlineMath math="\phi" /> no depende del tiempo. <InlineMath math="S_s=\phi" /> [1/m] es una elección numérica provisional,
                    mucho mayor que los valores típicos de campo (10⁻⁶–10⁻⁴ m⁻¹); su efecto está pendiente de evaluar.</span>
                </p>
            </div>
        </SlideLayout>
    );
}

A3N02.ecuaciones = ['flujo', 'soluto-cons', 'soluto-desarrollo', 'adr'];
