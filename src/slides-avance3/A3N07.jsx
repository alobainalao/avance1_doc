import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const verde = '#4ade80';
const eqMRMT = String.raw`\begin{aligned}
&\phi R\,\partial_t C_m+\mathbf u\!\cdot\!\nabla C_m-\nabla\!\cdot(D\nabla C_m)\\
&\quad+\sum_{r=1}^{N_r}\lambda_r\,(C_m-C_{{\rm im},r})\;\textcolor{${verde}}{-\,S_s\partial_t h\,C_m}=W_+\\[4pt]
&\phi_{{\rm im},r}R\,\partial_t C_{{\rm im},r}=\lambda_r\,(C_m-C_{{\rm im},r}),\quad r=1,\dots,N_r
\end{aligned}`;

export default function A3N07({ theme = 'dark' }) {
    return (
        <SlideLayout title="Modelo MRMT: regiones móvil e inmóviles" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={6}>
                    <EqCard title="Sistema MRMT (misma cancelación de fC sobre la ecuación móvil)"><Eq math={eqMRMT} s={0.8} /></EqCard>
                    <Punto>El intercambio no contiene <InlineMath math="\mathbf u" /> ni <InlineMath math="f" />; la ecuación inmóvil es una EDO en cada punto y conserva la masa total.</Punto>
                    <Punto color="#fb923c">
                        Con <InlineMath math="N_r=0" /> se recupera ADR <b>con <InlineMath math="\lambda_d=0" /></b>: el decaimiento
                        <InlineMath math="\lambda_d\phi R C" /> pertenece solo al ADR (decisión tomada; en ambos backends).
                    </Punto>
                </Col>
                <Col flex={4}>
                    <p style={{ color: 'var(--sl-accent)', fontWeight: 700, fontSize: 26, margin: 0 }}>Parámetros</p>
                    <Punto color="#60a5fa"><InlineMath math="\nu_r=\lambda_r/(\phi_{{\rm im},r}R)" /> [1/s]: frecuencia de relajación; código: <InlineMath math="D_{{\rm eff},r}/(R\,\eta_r L^2)" />.</Punto>
                    <Punto color="#60a5fa"><InlineMath math="\eta_r=\phi_{{\rm im},r}/\phi" />: razón de capacidades (<code>beta</code>).</Punto>
                    <Punto color="#a78bfa">Trapezoidal: <InlineMath math="\kappa_r=\tfrac{\Delta t\,\nu_r}{2+\Delta t\,\nu_r}" />, <InlineMath math="\omega_r=\tfrac{\eta_r\nu_r}{2+\Delta t\,\nu_r}" />. Semi-analítico: <InlineMath math="e_r=e^{-\nu_r\Delta t}" />, <InlineMath math="a_r=\eta_r(1-e_r)" />.</Punto>
                    <Punto color="#4ade80">Tres variantes: ADR, MRMT semi-analítico y MRMT por bloque (Schur).</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
