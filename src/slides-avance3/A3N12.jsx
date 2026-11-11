import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const verde = '#2E7D4F';
const eqH = String.raw`\begin{aligned}&\boxed{-S_s\partial_t\psi_h-\nabla\!\cdot(K\nabla\psi_h)=-\nabla\!\cdot(K\mathbf b)\;\textcolor{${verde}}{-\,S_s\,\partial_t(C\,\psi_C)}}\\[2pt]
&\psi_h(T)=0,\qquad \mathbf b=\psi_C\nabla C+\mathbf d\end{aligned}`;
const eqD = String.raw`\mathbf d=\partial_xC\,\partial_x\psi_C\,\nabla_{\mathbf u}D_x+\partial_zC\,\partial_z\psi_C\,\nabla_{\mathbf u}D_z`;
const eqBC = String.raw`\begin{aligned}(K\nabla\psi_h-K\mathbf b)\cdot\mathbf n&=0\ \text{ en }\Gamma_{\rm in}\cup\Gamma_{\rm wall}\\ \psi_h&=0\ \text{ en }\Gamma_{\rm out}\end{aligned}`;

export default function A3N12({ theme = 'dark' }) {
    return (
        <SlideLayout title="Adjunto del flujo (variación respecto de h)" theme={theme} justify="flex-start">
            <EqCard title="Cuatro vías de dependencia en h: flujo, advección, dispersión, almacenamiento"><Eq math={eqH} s={0.8} /><Eq math={eqD} s={0.72} /></EqCard>
            <Cols>
                <Col flex={5}>
                    <Punto color={verde} size={20}>Fuente nueva: <InlineMath math="-S_s\partial_t(C\psi_C)" /> (por parte en <InlineMath math="t" /> con <InlineMath math="\delta h(0)=0" />, <InlineMath math="\psi_C(T)=0" />); acopla el adjunto aun con <InlineMath math="\mathbf b=0" />.</Punto>
                    <Punto color="#0F7A85" size={20}><InlineMath math="K" /> variable: <InlineMath math="\delta\mathbf u=-K\nabla\delta h" />, sin suponerla constante. Requiere <InlineMath math="D" /> diagonal para <InlineMath math="\mathbf d" />.</Punto>
                </Col>
                <Col flex={5}>
                    <EqCard title="Condiciones de frontera: el adjunto hereda el tipo de condición del estado"><Eq math={eqBC} s={0.76} /></EqCard>
                    <Punto color="#C4511F" size={20}>
                        En Γout el estado tiene el dato <InlineMath math={String.raw`h_{\rm out}`} />, que no depende de los controles:{' '}
                        <InlineMath math={String.raw`\delta h=0`} /> allí y el adjunto recibe una sola condición, <InlineMath math={String.raw`\psi_h=0`} />.
                        Imponer además la de flujo lo sobredeterminaría.
                    </Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
