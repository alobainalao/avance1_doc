import React from 'react';
import { BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide14.css';

const eq15 = String.raw`A\mathbf{U}^{n+1} = B\mathbf{U}^n + \mathbf{F}`;

const eqA = String.raw`A = \begin{bmatrix}
A_m & -\lambda_1 I & \cdots & -\lambda_{N_r}I\\
-\lambda_1 I & M_1 & \cdots & 0\\
\vdots & \vdots & \ddots & \vdots\\
-\lambda_{N_r}I & 0 & \cdots & M_{N_r}
\end{bmatrix}`;

const eqB = String.raw`B = \begin{bmatrix}
B_m & \lambda_1 I & \cdots & \lambda_{N_r}I\\
\lambda_1 I & M_1^- & \cdots & 0\\
\vdots & \vdots & \ddots & \vdots\\
\lambda_{N_r}I & 0 & \cdots & M_{N_r}^-
\end{bmatrix}`;

const eqAm = String.raw`A_m = \begin{cases}
\frac{2\phi R}{\Delta t}I + \textstyle\sum_r \beta_r I - \mathcal{L}^{n+1}, & i \in \mathcal{R}_\Omega\\[4pt]
\mathbf{n}\cdot(D\nabla), & i \in \mathcal{R}_{\partial\Omega}
\end{cases}`;

const eqBm = String.raw`B_m = \begin{cases}
\frac{2\phi R}{\Delta t}I - \textstyle\sum_r \beta_r I + \mathcal{L}^n, & i \in \mathcal{R}_\Omega\\[4pt]
0, & i \in \mathcal{R}_{\partial\Omega}
\end{cases}`;

const eqMr = String.raw`M_r = \begin{cases}
\left(\frac{2\phi_{im,r}R}{\Delta t} + \beta_r\right)I, & i \in \mathcal{R}_\Omega\\[4pt]
I, & i \in \mathcal{R}_{\partial\Omega}
\end{cases}`;

const eqMrm = String.raw`M_r^- = \begin{cases}
\left(\frac{2\phi_{im,r}R}{\Delta t} - \beta_r\right)I, & i \in \mathcal{R}_\Omega\\[4pt]
0, & i \in \mathcal{R}_{\partial\Omega}
\end{cases}`;

const eqR = String.raw`\mathcal{R}_\Omega = \mathcal{I} \cup \mathcal{B}, \qquad \mathcal{R}_{\partial\Omega} = \mathcal{G}`;

const Slide14 = ({ theme = 'dark' }) => (
    <SlideLayout title="Matriz bloque global" theme={theme}>
        <EqCard title="Sistema bloque global" num={15}>
            <BlockMath math={eq15} />
        </EqCard>
        <EqCard title="Matrices globales" className="sl-math-sm">
            <div className="s14-matrices">
                <div className="s14-col"><BlockMath math={eqA} /></div>
                <div className="s14-col"><BlockMath math={eqB} /></div>
            </div>
        </EqCard>
        <EqCard title="Definiciones" className="sl-math-xs">
            <div className="s14-defs">
                <div className="s14-col"><BlockMath math={eqAm} /></div>
                <div className="s14-col"><BlockMath math={eqBm} /></div>
                <div className="s14-col"><BlockMath math={eqMr} /></div>
                <div className="s14-col"><BlockMath math={eqMrm} /></div>
            </div>
        </EqCard>
        <div className="s14-footer sl-math-sm">
            <BlockMath math={eqR} />
        </div>
    </SlideLayout>
);

export default Slide14;
