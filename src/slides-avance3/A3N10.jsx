import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const eqJ = String.raw`J=\gamma J_m+J_e,\qquad J_m=\!\int_0^T\!\!\!\int_\Omega g_\varepsilon C^2,\qquad
J_e=\alpha\,\kappa_p(z_p-z_0)^2+\beta\,d_p\!\int_0^T\!Q^2\,dt`;
const eqNorm = String.raw`w_1=\frac1{C_{\rm ref}^2T},\quad w_2=\frac1{\max|z_p-z_0|^2},\quad w_3=\frac1{Q_{\max}^2\,T\,\max|z_p-z_0|}`;

export default function A3N10({ theme = 'dark' }) {
    return (
        <SlideLayout title="Funcional, controles admisibles y normalización" theme={theme} justify="flex-start">
            <EqCard title="Funcional: calidad J_m y costo J_e (instalación + operación; d_p = z₀ − z_p > 0)"><Eq math={eqJ} s={0.82} /></EqCard>
            <Cols>
                <Col flex={5}>
                    <Punto color="#0F7A85"><b>Controles:</b> <InlineMath math="Q(t)\in[0,Q_{\max}]" />, <InlineMath math="z_p\in[z_{\min},z_{\max}]" /> y restricción de suministro del tanque (<code>trust-constr</code>).</Punto>
                    <Punto color="#C4511F">
                        <InlineMath math="J_m" /> es un <b>índice</b> cuadrático de la concentración en el pozo, no la masa extraída
                        <InlineMath math="\int Q\!\int\varrho C" />; es positivo aunque <InlineMath math="Q=0" />. Cambiarlo modificaría objetivo y adjunto (decisión pendiente).
                    </Punto>
                </Col>
                <Col flex={5}>
                    <EqCard title="Normalización (solo FEniCSx por ahora): w₁ en J_m, w₂ y w₃ en los dos términos de J_e"><Eq math={eqNorm} s={0.66} /></EqCard>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
