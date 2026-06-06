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
    <ScientificLayout title="Modelo adjunto" theme={theme} align="center">
        <EqCard title="Adjunto hidráulico" num={24}>
            <BlockMath math={eq24} />
        </EqCard>
        <EqCard title="Adjunto transporte" num={25}>
            <BlockMath math={eq25} />
        </EqCard>
        <div style={{ display: 'flex', gap: '2%', alignItems: 'stretch', width: '100%' }}>
            <EqCard title="Cond. adjunto transporte" num="26 – 28" className="s32-bc-card" style={{ flex: 1, minWidth: 0 }}>
                {bcLeft.map((eq, i) => (
                    <div key={i} className="s32-bc-cell"><BlockMath math={eq} /></div>
                ))}
            </EqCard>
            <EqCard title="Cond. adjunto hidráulico" num="29 – 31" className="s32-bc-card" style={{ flex: 1, minWidth: 0 }}>
                {bcRight.map((eq, i) => (
                    <div key={i} className="s32-bc-cell"><BlockMath math={eq} /></div>
                ))}
            </EqCard>
        </div>
    </ScientificLayout>
);

export default Slide32;
