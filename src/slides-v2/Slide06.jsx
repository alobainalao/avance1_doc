import React from 'react';
import { BlockMath } from 'react-katex';
import { SlideLayout, EqCard } from '../layouts-v2/slide-components.jsx';

const eq9 = String.raw`C(x, t) \approx \sum_{j=1}^{N} \alpha_j(t)\,\phi\!\left(\|x - x_j\|\right)`;

const Slide06 = ({ theme = 'dark' }) => (
    <SlideLayout title="Radial Basis Functions (RBF)" theme={theme}>
        <p className="sl-body">
            El método RBF es un enfoque libre de malla ampliamente utilizado en la
            resolución de EDPs <span className="sl-cite">[Fasshauer, 2007]</span>:
        </p>
        <ul className="sl-bullet-list">
            <li>Aproximación mediante funciones radiales</li>
            <li>No requiere conectividad entre nodos</li>
            <li>Alta flexibilidad geométrica</li>
        </ul>
        <div className="sl-spacer" />
        <p className="sl-body">La solución se aproxima como:</p>
        <EqCard title="Aproximación RBF" num={9}>
            <BlockMath math={eq9} />
        </EqCard>
    </SlideLayout>
);

export default Slide06;
