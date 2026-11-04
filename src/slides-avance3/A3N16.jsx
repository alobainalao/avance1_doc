import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const verde = '#4ade80';
const eqSig = String.raw`\begin{aligned}\sigma^m=&\underbrace{-(\partial_{\mathbf h}[\mathcal L(\mathbf u(\mathbf h^m))\mathbf C^{*,m}])^{\!\top}\psi_C^m-(\partial_{\mathbf h}[\mathcal L(\mathbf u(\mathbf h^m))\mathbf C^m])^{\!\top}\psi_C^{m+1}}_{\text{velocidad}}\\
&\textcolor{${verde}}{+\tfrac{S_s}{\Delta t}\bigl[\psi_C^{m+1}\!\circ(w_A\mathbf C^{m+1}+w_B\mathbf C^m)-\psi_C^m\!\circ(w_A\mathbf C^m+w_B\mathbf C^{m-1})\bigr]}\end{aligned}`;
const eqFlujo = String.raw`A_h^{\!\top}\psi_h^m=B_h^{\!\top}\psi_h^{m+1}-\sigma^m,\qquad \frac{\partial\hat J}{\partial Q_n}=2\beta d_p\Delta t\,Q_n+\boldsymbol\delta_p^{\!\top}\psi_h^n`;

export default function A3N16({ theme = 'dark' }) {
    return (
        <SlideLayout title="Adjunto discreto del flujo y regla de la cadena RBF-FD" theme={theme} justify="flex-start">
            <EqCard title="Fuente del adjunto del flujo"><Eq math={eqSig} s={0.7} /></EqCard>
            <EqCard title="Recursión y gradiente en Q"><Eq math={eqFlujo} s={0.9} /></EqCard>
            <Cols>
                <Col>
                    <Punto color={verde} size={20}>Parte verde = derivada temporal discreta de <InlineMath math="C\psi_C" />. <InlineMath math="w_A=2\theta_C" />, <InlineMath math="w_B=2(1-\theta_C)" />; con Euler implícito (<InlineMath math="\theta_C=1"/>): 2 y 0.</Punto>
                    <Punto color="#60a5fa" size={20}>Cada fila del transporte es <InlineMath math="\sum_k c_{k,i}(O_k\mathbf C)_i" />; <InlineMath math="c_{k,i}" /> depende de <InlineMath math="\mathbf h" /> por <InlineMath math="\mathbf u,D,\nabla\!\cdot\!D,\partial_t h" />: regla de la cadena exacta.</Punto>
                </Col>
                <Col>
                    <Punto color="#a78bfa" size={20}>Las filas de Γout de <InlineMath math="A_h,B_h" /> no dependen de <InlineMath math="\mathbf h" />: la transposición da el adjunto del cierre elegido.</Punto>
                    <Punto color="#fb923c" size={20}>Multiplicadores discretos ≈ continuos × Δt (FEM, verificado); en colocación se espera además un factor de pesos nodales (no verificado).</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
