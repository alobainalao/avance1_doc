import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col } from './ui.jsx';

const eqQ = String.raw`\nabla_Q\hat J(t)=2\beta\,d_p\,Q(t)+\int_\Omega\varrho\,\psi_h\,d\mathbf x`;
const eqZ = String.raw`\frac{\partial\hat J}{\partial z_p}=\gamma\!\int_0^T\!\!\!\int_\Omega\dot g_\varepsilon C^2+2\alpha\kappa_p(z_p-z_0)-\beta\!\int_0^T\!Q^2dt+\int_0^T\!\!Q(t)\!\int_\Omega\dot\varrho\,\psi_h\,d\mathbf x\,dt`;

export default function A3N13({ theme = 'dark' }) {
    return (
        <SlideLayout title="Gradientes del funcional reducido" theme={theme} justify="flex-start">
            <EqCard title="Derivada respecto del caudal"><BlockMath math={eqQ} /></EqCard>
            <EqCard title="Derivada respecto de la profundidad del pozo"><BlockMath math={eqZ} /></EqCard>
            <Cols>
                <Col>
                    <Punto color="#0F7A85" size={21}><InlineMath math="Q" /> aparece en 2 lugares (<InlineMath math="\ell_h" /> y <InlineMath math="J_{\rm op}" />); <InlineMath math="z_p" /> en 4 (<InlineMath math="g_\varepsilon" />, <InlineMath math="\varrho" />, <InlineMath math="J_{\rm inst}" />, <InlineMath math="d_p" />).</Punto>
                    <Punto color="#2E7D4F" size={21}>Ningún control entra en el transporte: no hay <InlineMath math="\chi'(Q)" /> ni término de soluto.</Punto>
                </Col>
                <Col>
                    <Punto color="#C4511F" size={21}>Exactos solo si estado y gradiente usan los mismos núcleos <InlineMath math="\varrho" /> y <InlineMath math="g_\varepsilon" /> y los mismos datos de frontera.</Punto>
                    <Punto color="#0F7A85" size={21}>Vale en los cierres (A), (B) y (D): los datos de frontera no dependen de los controles.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
