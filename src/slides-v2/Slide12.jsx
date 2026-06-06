import React from 'react';
import { BlockMath } from 'react-katex';
import ScientificLayout from '../layouts-v2/ScientificLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eq13 = String.raw`
\begin{aligned}
\left(\frac{2\phi R}{\Delta t} + \sum_r \beta_r - \mathcal{L}^{n+1}\right)C^{n+1} &- \sum_r \beta_r S_r^{n+1} \\
&= \left(\frac{2\phi R}{\Delta t} + \sum_r \beta_r + \mathcal{L}^{n}\right)C^{n} + \sum_r \beta_r S_r^{n} + f^n + f^{n+1}
\end{aligned}`;

const eq14 = String.raw`
-\beta_r C^{n+1} + \left(\frac{2\phi_{im,r}R}{\Delta t} + \beta_r\right) S_r^{n+1}
= \beta_r C^n + \left(\frac{2\phi_{im,r}R}{\Delta t} - \beta_r\right) S_r^n`;

const eqL = String.raw`\mathcal{L}^n = D^n\nabla^2 + (\nabla D^n - \mathbf{v}^n) \cdot \nabla`;

const Slide12 = ({ theme = 'dark' }) => (
    <ScientificLayout title="Discretización Temporal" theme={theme} align="center">
        <EqCard title="Transporte" num={13} className="sl-math-sm">
            <BlockMath math={eq13} />
        </EqCard>
        <EqCard title="Reservorios" num={14} className="sl-math-sm">
            <BlockMath math={eq14} />
        </EqCard>
        <EqCard title="Operador diferencial">
            <BlockMath math={eqL} />
        </EqCard>
    </ScientificLayout>
);

export default Slide12;
