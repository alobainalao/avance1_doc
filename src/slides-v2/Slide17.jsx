import React from 'react';
import { BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eqA1 = String.raw`\left(\frac{2\phi R}{\Delta t}I - \mathcal{L}^{n+1}\right)C^* = \left(\frac{2\phi R}{\Delta t}I + \mathcal{L}^n\right)C^n + f^{n+1} + f^n`;
const eqA2 = String.raw`\mathcal{P}\,C^* = \mathcal{R}\,C^n + F`;
const eqB  = String.raw`S_r^{n+1} = C^* + (S_r^n - C^*)\,e^{-\alpha_r\Delta t}, \qquad r = 1,\ldots,N_r`;
const eqC  = String.raw`C^{n+1} = C^* + \sum_{r=1}^{N_r}\eta_r\!\left(S_r^n - S_r^{n+1}\right)`;

const Slide17 = ({ theme = 'dark' }) => (
    <SlideLayout title="Método desacoplado" theme={theme}>
        <EqCard title="Paso A: Transporte" num={19} className="sl-math-sm">
            <BlockMath math={eqA1} />
            <BlockMath math={eqA2} />
        </EqCard>
        <EqCard title="Paso B: Intercambio analítico" num={20}>
            <BlockMath math={eqB} />
        </EqCard>
        <EqCard title="Paso C: Corrección conservativa" num={21}>
            <BlockMath math={eqC} />
        </EqCard>
    </SlideLayout>
);

export default Slide17;
