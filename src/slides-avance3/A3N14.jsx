import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const eqSys = String.raw`\begin{aligned}
&-\phi R\partial_t\psi_M-\nabla\!\cdot(D\nabla\psi_M)-\mathbf u\!\cdot\!\nabla\psi_M\\&\;+\Bigl(\sum_r\lambda_r\Bigr)\psi_M+Q\varrho\,\psi_M-\sum_r\lambda_r\psi_{{\rm im},r}=-2\gamma g_\varepsilon C_m\\
&\phi_{{\rm im},r}R\,\partial_t\psi_{{\rm im},r}=\lambda_r\,(\psi_{{\rm im},r}-\psi_M),\qquad \psi_M(T)=\psi_{{\rm im},r}(T)=0
\end{aligned}`;
const eqMem = String.raw`\psi_{{\rm im},r}(t)=\nu_r\!\int_t^T e^{-\nu_r(s-t)}\,\psi_M(s)\,ds`;
const eqFl = String.raw`\begin{aligned}&-S_s\partial_t\psi_h-\nabla\!\cdot(K\nabla\psi_h)\\&\;=-\nabla\!\cdot(K\mathbf b)-S_s\partial_t(C_m\psi_M)\end{aligned}`;

export default function A3N14({ theme = 'dark' }) {
    return (
        <SlideLayout title="Adjunto del modelo MRMT" theme={theme} justify="flex-start">
            <EqCard title="Sistema adjunto del transporte (retrógrado)"><Eq math={eqSys} id='adj-mrmt' /></EqCard>
            <Cols>
                <Col flex={5}>
                    <EqCard title="Región inmóvil: memoria hacia el futuro"><Eq math={eqMem} id='adj-mrmt-im' /></EqCard>
                    {false && ( /* oculto por ahora */
                        <Punto color="#2E7D4F" size={20}>Ni la extracción ni el almacenamiento actúan sobre las regiones inmóviles.</Punto>
                    )}
                </Col>
                <Col flex={5}>
                    <EqCard title="Adjunto del flujo y gradiente"><Eq math={eqFl} id='adj-mrmt-h' /></EqCard>
                    {false && ( /* oculto por ahora */
                        <Punto color="#0F7A85" size={20}>Gradiente: las mismas fórmulas con <InlineMath math="\psi_h^{M}" /> y <InlineMath math="C_m" />.</Punto>
                    )}
                </Col>
            </Cols>
        </SlideLayout>
    );
}

A3N14.ecuaciones = ['adj-mrmt', 'adj-mrmt-im', 'adj-mrmt-h'];
