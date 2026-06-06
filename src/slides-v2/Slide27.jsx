import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eqMin = String.raw`\min_{\mathbf{u}\in\mathcal{U}_{ad}} J(\mathbf{y},\mathbf{u}) \quad \text{s.t.} \quad e(\mathbf{y},\mathbf{u}) = 0`;
const eqJ   = String.raw`J(\mathbf{y},\mathbf{u}) = \int_0^T\!\!\int_\Omega \delta(x-x_p,z-z_p)\,C(x,z,t)^2\,d\Omega\,dt + \gamma\!\int_0^T |z_p - z_0|\,Q(t)^2\,dt + \beta|z_p-z_0|^2`;

const Slide27 = ({ theme = 'dark' }) => (
    <SlideLayout title="Problema de optimización" theme={theme}>
        <p className="sl-body">Sean:</p>
        <ul className="sl-bullet-list">
            <li>
                <InlineMath math={String.raw`\mathbf{y} = (h, C)`} />: vector de estado.
            </li>
            <li>
                <InlineMath math={String.raw`\mathbf{u} = (Q_1, \ldots, Q_{N_t}, z_p)`} />:
                vector de variables de control.
            </li>
        </ul>
        <p className="sl-body">
            El problema de optimización consiste en determinar el control óptimo{' '}
            <strong>u</strong>, sujeto al sistema PDE, minimizando el funcional:
        </p>
        <EqCard title="Problema de optimización">
            <BlockMath math={eqMin} />
        </EqCard>
        <EqCard title="Funcional de costo" className="sl-math-sm">
            <BlockMath math={eqJ} />
        </EqCard>
    </SlideLayout>
);

export default Slide27;
