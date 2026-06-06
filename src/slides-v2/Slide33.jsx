import React from 'react';
import { BlockMath } from 'react-katex';
import ScientificLayout from '../layouts-v2/ScientificLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eqNQ = String.raw`\begin{aligned}
\nabla_Q\mathcal{J}(t) &= 2|z_p - z_0|\,Q(t) \\
&\quad - \int_\Omega g(z_p)\!\left[\psi_h\!\left(\chi(Q) + Q\chi'(Q)\right) + \psi_C C\chi'(Q)\right]d\Omega
\end{aligned}`;

const eqDzp = String.raw`\begin{aligned}
\frac{\partial\mathcal{J}}{\partial z_p} &= 2\gamma\!\int_0^T\! C\,\frac{\partial C}{\partial z}\,dt - \int_0^T Q^2\,dt + 2\beta(z_p - z_0) \\
&\quad - \int_0^T\!\!\int_\Omega\frac{\partial g}{\partial z_p}\!\left[\chi(Q)Q\psi_h + \chi(Q)\psi_C C\right]\!d\Omega\,dt
\end{aligned}`;

const Slide33 = ({ theme = 'dark' }) => (
    <ScientificLayout title="Gradientes respecto a los controles" theme={theme} align="top-center">
        <EqCard title="Gradiente respecto a Q" className="sl-math-sm">
            <BlockMath math={eqNQ} />
        </EqCard>
        <EqCard title="Gradiente respecto a zₚ" className="sl-math-sm">
            <BlockMath math={eqDzp} />
        </EqCard>
    </ScientificLayout>
);

export default Slide33;
