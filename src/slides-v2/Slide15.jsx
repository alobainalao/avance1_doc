import React from 'react';
import { BlockMath } from 'react-katex';
import { SlideLayout, EqCard } from '../layouts-v2/slide-components.jsx';

const eq16 = String.raw`S_r^{n+1} = M_r^{-1}\!\left(\beta_r C^{n+1} + \beta_r C^n + M_r^- S_r^n\right)`;

const eq17 = String.raw`\begin{aligned}
\textcolor{#60a5fa}{\left(A_m - \sum_{r=1}^{N_r}\beta_r^2 M_t^{-1}\right)}\!C^{n+1} &=
\textcolor{#fb923c}{\left(B_m + \sum_{r=1}^{N_r}\beta_r^2 M_t^{-1}\right)}\!C^n + F_m \\
&\quad + \sum_{r=1}^{N_r}\textcolor{#4ade80}{\beta_r\!\left(I + M_r^{-1}M_r^-\right)}S_r^n
\end{aligned}`;

const eq18 = String.raw`\textcolor{#60a5fa}{\mathcal{P}}\,C^{n+1} = \textcolor{#fb923c}{\mathcal{R}}\,C^n + \sum_r \textcolor{#4ade80}{\mathcal{Q}_r} S_r^n + F`;

const Slide15 = ({ theme = 'dark' }) => (
    <SlideLayout title="Reducción de Schur" theme={theme}>
        <p className="sl-heading">Eliminación de variables de reservorios</p>
        <EqCard title="Reservorios" num={16}>
            <BlockMath math={eq16} />
        </EqCard>
        <EqCard title="Sistema reducido" num={17} className="sl-math-sm">
            <BlockMath math={eq17} />
        </EqCard>
        <EqCard title="Forma compacta" num={18}>
            <BlockMath math={eq18} />
        </EqCard>
    </SlideLayout>
);

export default Slide15;
