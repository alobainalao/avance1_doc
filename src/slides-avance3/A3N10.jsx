import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col } from './ui.jsx';

const eqJ = String.raw`J=\gamma J_m+\alpha J_{\rm inst}+\beta J_{\rm op},\quad J_m=\!\int_0^T\!\!\!\int_\Omega g_\varepsilon C^2,\ \ J_{\rm inst}=\kappa_p(z_p-z_0)^2,\ \ J_{\rm op}=d_p\!\int_0^T\!Q^2dt`;
const eqNorm = String.raw`w_1=\frac1{C_{\rm ref}^2T},\quad w_2=\frac1{\max|z_p-z_0|^2},\quad w_3=\frac1{Q_{\max}^2\,T\,\max|z_p-z_0|}`;

export default function A3N10({ theme = 'dark' }) {
    return (
        <SlideLayout title="Funcional, controles admisibles y normalización" theme={theme} justify="flex-start">
            <EqCard title="Funcional (d_p = z₀ − z_p > 0)"><BlockMath math={eqJ} /></EqCard>
            <Cols>
                <Col flex={5}>
                    <Punto color="#60a5fa"><b>Controles:</b> <InlineMath math="Q(t)\in[0,Q_{\max}]" />, <InlineMath math="z_p\in[z_{\min},z_{\max}]" /> y restricción de suministro del tanque (<code>trust-constr</code>).</Punto>
                    <Punto color="#fb923c">
                        <InlineMath math="J_m" /> es un <b>índice</b> cuadrático de la concentración en el pozo, no la masa extraída
                        <InlineMath math="\int Q\!\int\varrho C" />; es positivo aunque <InlineMath math="Q=0" />. Cambiarlo modificaría objetivo y adjunto (decisión pendiente).
                    </Punto>
                </Col>
                <Col flex={5}>
                    <EqCard title="Normalización (solo FEniCSx por ahora)"><BlockMath math={eqNorm} /></EqCard>
                    <Punto color="#4ade80">Con <InlineMath math="C_{\rm ref}" /> del valor guía del nitrato (50 mg/L): <InlineMath math="J_{\rm scale}=1" /> y gradientes con <InlineMath math="\gamma\to\gamma w_1" />, etc.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
