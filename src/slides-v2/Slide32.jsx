import React from 'react';
import { BlockMath } from 'react-katex';
import ScientificLayout from '../layouts-v2/ScientificLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide32.css';

const eq24 = String.raw`-S_s\partial_t\psi_h + \nabla\cdot(K\nabla\psi_h) = -\nabla\cdot(K\psi_C\nabla C)`;
const eq25 = String.raw`\begin{aligned}
-\phi R\,\partial_t\psi_C &+ (K\nabla h)\cdot\nabla\psi_C + \psi_C\nabla\cdot(K\nabla h) \\
&+ \nabla\cdot(\mathbf{D}\nabla\psi_C) + \bigl(\lambda\phi R + \chi(Q)g(z_p)\bigr)\psi_C = 2\gamma C\delta_p
\end{aligned}`;

const bcLeft  = [
    String.raw`\psi_C(T) = 0`,
    String.raw`(\mathbf{D}\nabla\psi_C)\cdot n = 0 \;\text{en}\; \Gamma_\text{wall}`,
    String.raw`\psi_C = 0 \;\text{en}\; \Gamma_\text{in}\cup\Gamma_\text{out}`,
];
const bcRight = [
    String.raw`\psi_h(T) = 0`,
    String.raw`(K\nabla\psi_h)\cdot n = 0 \;\text{en}\; \Gamma_\text{wall}`,
    String.raw`\psi_h = 0 \;\text{en}\; \Gamma_\text{in}\cup\Gamma_\text{out}`,
];

const Slide32 = ({ theme = 'dark' }) => (
    <ScientificLayout title="Modelo adjunto" theme={theme} align="top-center">
        <EqCard title="Adjunto hidráulico" num={24} className="sl-math-sm">
            <BlockMath math={eq24} />
        </EqCard>
        <EqCard title="Adjunto transporte" num={25} className="sl-math-sm">
            <BlockMath math={eq25} />
        </EqCard>
        <EqCard title="Condiciones adjuntas" num="26 – 31" className="sl-math-xs">
            <div className="s32-bc-grid">
                {bcLeft.map((left, i) => (
                    <React.Fragment key={i}>
                        <div className="s32-bc-cell"><BlockMath math={left} /></div>
                        <div className="s32-bc-cell"><BlockMath math={bcRight[i]} /></div>
                    </React.Fragment>
                ))}
            </div>
        </EqCard>
    </ScientificLayout>
);

export default Slide32;
