import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Col, Eq, Titulo } from './ui.jsx';

const verde = '#2E7D4F';
const eqMRMT = String.raw`\begin{aligned}
&\phi R\,\partial_t C_m+\mathbf u\!\cdot\!\nabla C_m-\nabla\!\cdot(D\nabla C_m)\\
&\quad+\sum_{r=1}^{N_r}\lambda_r\,(C_m-C_{{\rm im},r})\;\textcolor{${verde}}{-\,S_s\partial_t h\,C_m}=W_+\\[4pt]
&\phi_{{\rm im},r}R\,\partial_t C_{{\rm im},r}=\lambda_r\,(C_m-C_{{\rm im},r}),\quad r=1,\dots,N_r
\end{aligned}`;

export default function A3N07({ theme = 'dark' }) {
    return (
        <SlideLayout title="Modelo MRMT: regiones móvil e inmóviles" theme={theme} justify="flex-start">
            <Col gap={10}>
                <EqCard title="Sistema MRMT (misma cancelación de fC sobre la ecuación móvil)"><Eq math={eqMRMT} id='mrmt' /></EqCard>
                <Punto size={19}>El intercambio no contiene <InlineMath math="\mathbf u" /> ni <InlineMath math="f" />; la ecuación inmóvil es una EDO en cada punto y conserva la masa total.</Punto>
                <Punto color="#C4511F" size={19}>
                    Con <InlineMath math="N_r=0" /> se recupera ADR <b>con <InlineMath math="\lambda_d=0" /></b>: el decaimiento{' '}
                    <InlineMath math="\lambda_d\phi R C" /> pertenece solo al ADR (decisión tomada; en ambos backends).
                    Tres variantes: ADR, MRMT semi-analítico y MRMT por bloque (Schur).
                </Punto>
                <Titulo style={{ marginTop: 6 }}>Parámetros</Titulo>
                <Punto color="#0F7A85" size={19}>
                    <InlineMath math="\nu_r=\lambda_r/(\phi_{{\rm im},r}R)" /> [1/s]: frecuencia de relajación; código: <InlineMath math="D_{{\rm eff},r}/(R\,\eta_r L^2)" />.
                    {' '}<InlineMath math="\eta_r=\phi_{{\rm im},r}/\phi" />: razón de capacidades (<code>beta</code>).
                </Punto>
                <Punto color="#0F7A85" size={19}>
                    Trapezoidal: <InlineMath math="\kappa_r=\tfrac{\Delta t\,\nu_r}{2+\Delta t\,\nu_r}" />, <InlineMath math="\omega_r=\tfrac{\eta_r\nu_r}{2+\Delta t\,\nu_r}" />.
                    {' '}Semi-analítico: <InlineMath math="e_r=e^{-\nu_r\Delta t}" />, <InlineMath math="a_r=\eta_r(1-e_r)" />.
                </Punto>
            </Col>
        </SlideLayout>
    );
}

A3N07.ecuaciones = ['mrmt'];
