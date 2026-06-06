import React from 'react';
import { BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide30.css';

const eqLag = String.raw`\mathcal{L} = J + \langle\psi_h,E_h\rangle + \langle\psi_C,E_C\rangle`;
const eq23  = String.raw`\begin{aligned}
\frac{d\mathcal{L}}{dQ} &= \frac{\partial J}{\partial Q} + \psi_C\frac{\partial E_C}{\partial Q} + \psi_h\frac{\partial E_h}{\partial Q} \\
&\quad + \left[\frac{\partial J}{\partial C} + \psi_C\frac{\partial E_C}{\partial C}\right]\frac{\partial C}{\partial Q}
+ \left[\psi_C\frac{\partial E_C}{\partial h} + \psi_h\frac{\partial E_h}{\partial h}\right]\frac{\partial h}{\partial Q}
\end{aligned}`;
const eqRes = String.raw`\frac{dJ}{dQ} = \frac{\partial J}{\partial Q} + \psi_C\frac{\partial E_C}{\partial Q} + \psi_h\frac{\partial E_h}{\partial Q}`;

const Slide30 = ({ theme = 'dark' }) => (
    <SlideLayout title="Idea fundamental del método adjunto" theme={theme}>
        <p className="sl-body">Se introduce el Lagrangiano:</p>
        <EqCard title="Lagrangiano">
            <BlockMath math={eqLag} />
        </EqCard>
        <p className="sl-body">Derivando respecto a <em>Q</em>:</p>
        <EqCard title="Derivada total" num={23} className="sl-math-sm">
            <BlockMath math={eq23} />
        </EqCard>
        <EqCard title="Gradiente reducido">
            <BlockMath math={eqRes} />
        </EqCard>
    </SlideLayout>
);

export default Slide30;
