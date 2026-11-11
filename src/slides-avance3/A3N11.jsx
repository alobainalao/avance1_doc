import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Col, Eq } from './ui.jsx';

const verde = '#2E7D4F';
const eqAC = String.raw`\begin{aligned}a_C(C,v;h)=&\int_\Omega D(\mathbf u)\nabla C\!\cdot\!\nabla v+\int_\Omega(\mathbf u\!\cdot\!\nabla C)v\\&+\int_\Omega c_0Cv\;\textcolor{${verde}}{-\int_\Omega S_s\,\partial_t h\,C\,v}\end{aligned}`;
const eqAh = String.raw`\begin{aligned}a_h(h,v)&=\int_\Omega K\nabla h\!\cdot\!\nabla v\\\ell_h(v)&=-Q\!\int_\Omega\varrho\,v+\int_{\Gamma_{\rm in}}f_{\rm in}v\end{aligned}`;
const eqL = String.raw`\begin{aligned}\mathcal L=J+\int_0^T\Bigl[&(S_s\partial_th,\psi_h)+a_h(h,\psi_h)-\ell_h(\psi_h)\\&+(\phi R\partial_tC,\psi_C)+a_C(C,\psi_C;h)-(W_+,\psi_C)\Bigr]dt\end{aligned}`;

export default function A3N11({ theme = 'dark' }) {
    return (
        <SlideLayout title="Forma débil del estado y Lagrangiano" theme={theme} justify="flex-start">
            <Col gap={10}>
                <div style={{ display: 'flex', gap: '2.5%', alignItems: 'stretch' }}>
                    <div style={{ flex: 0.8, minWidth: 0 }}>
                        <EqCard title="Flujo: V_h = {v ∈ H¹ : v = 0 en Γout}, h = h_out en Γout"><Eq math={eqAh} id='debil-flujo' /></EqCard>
                    </div>
                    <div style={{ flex: 1.2, minWidth: 0 }}>
                        <EqCard title="Transporte (a_C no depende de los controles, sí de h)"><Eq math={eqAC} id='debil-transporte' /></EqCard>
                    </div>
                </div>
                <EqCard title="Lagrangiano ADR (ψ(T)=0)"><Eq math={eqL} id='lagrangiano' /></EqCard>
                <Punto color="#C4511F" size={20}>
                    El término <InlineMath math="-\!\int_{\Gamma_{\rm out}}(K\nabla h\!\cdot\!n)v" /> no está definido en <InlineMath math="H^1\times H^1" />; con{' '}
                    <InlineMath math="v|_{\Gamma_{\rm out}}=0" /> no aparece.
                </Punto>
                <Punto color="#2E7D4F" size={20}>
                    <b>Lema.</b> Si <InlineMath math="\partial_y\mathcal L=0" />, <InlineMath math="d\hat J/d\theta=\partial_\theta\mathcal L" />, <InlineMath math="\theta\in\{Q,z_p\}" />.
                    {' '}MRMT añade <InlineMath math="-\sum_r\lambda_r(C_{{\rm im},r},\psi_M)" /> y la ecuación inmóvil con su multiplicador.
                </Punto>
            </Col>
        </SlideLayout>
    );
}

A3N11.ecuaciones = ['debil-flujo', 'debil-transporte', 'lagrangiano'];
