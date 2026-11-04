import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const verde = '#4ade80';
const eqAC = String.raw`\begin{aligned}a_C(C,v;h)=&\int_\Omega D(\mathbf u)\nabla C\!\cdot\!\nabla v+\int_\Omega(\mathbf u\!\cdot\!\nabla C)v\\&+\int_\Omega c_0Cv\;\textcolor{${verde}}{-\int_\Omega S_s\,\partial_t h\,C\,v}\end{aligned}`;
const eqAh = String.raw`\begin{aligned}a_h(h,v)&=\int_\Omega K\nabla h\!\cdot\!\nabla v\\\ell_h(v)&=-Q\!\int_\Omega\varrho\,v+\int_{\Gamma_{\rm in}}f_{\rm in}v\end{aligned}`;
const eqL = String.raw`\begin{aligned}\mathcal L=J+\int_0^T\Bigl[&(S_s\partial_th,\psi_h)+a_h(h,\psi_h)-\ell_h(\psi_h)\\&+(\phi R\partial_tC,\psi_C)+a_C(C,\psi_C;h)-(W_+,\psi_C)\Bigr]dt\end{aligned}`;

export default function A3N11({ theme = 'dark' }) {
    return (
        <SlideLayout title="Forma débil del estado y Lagrangiano" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <EqCard title="Flujo (sin flujo normal desconocido en Γout)"><Eq math={eqAh} s={0.8} /></EqCard>
                    <EqCard title="Transporte (a_C no depende de los controles, sí de h)"><Eq math={eqAC} s={0.8} /></EqCard>
                    <EqCard title="Lagrangiano ADR (ψ(T)=0)"><Eq math={eqL} s={0.68} /></EqCard>
                </Col>
                <Col flex={4}>
                    <Punto color="#a78bfa">Cierres (A) y (D): <InlineMath math="V_h=\{v\in H^1:\,v|_{\Gamma_{\rm out}}=0\}" /> y dato de Dirichlet; cierre (B): <InlineMath math="V_h=H^1" /> con <InlineMath math="-\!\int f_{\rm out}v" /> en <InlineMath math="\ell_h" />.</Punto>
                    <Punto color="#f87171">El término <InlineMath math="-\!\int_{\Gamma_{\rm out}}(K\nabla h\!\cdot\!n)v" /> no está definido en <InlineMath math="H^1\times H^1" />: no se conserva.</Punto>
                    <Punto color="#4ade80"><b>Lema.</b> Si <InlineMath math="\partial_y\mathcal L=0" />, <InlineMath math="d\hat J/d\theta=\partial_\theta\mathcal L" />, <InlineMath math="\theta\in\{Q,z_p\}" />.</Punto>
                    <Punto color="#60a5fa">MRMT añade <InlineMath math="-\sum_r\lambda_r(C_{{\rm im},r},\psi_M)" /> y la ecuación inmóvil con su multiplicador.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
