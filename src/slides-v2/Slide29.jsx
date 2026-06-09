import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eqJ  = String.raw`J = J\!\left(C(h(Q,z_p),Q,z_p),\,Q,\,z_p\right)`;
const eq22 = String.raw`\frac{dJ}{dQ} = \frac{\partial J}{\partial Q} + \frac{\partial J}{\partial C}\!\left(\textcolor{#ff4466}{\frac{\partial C}{\partial Q}} + \frac{\partial C}{\partial h}\textcolor{#ff4466}{\frac{\partial h}{\partial Q}}\right)`;

const Slide29 = ({ theme = 'dark' }) => (
    <SlideLayout title="Motivación del método adjunto" theme={theme}>
        <p className="sl-body">El funcional depende implícitamente de los controles:</p>
        <EqCard title="Dependencia implícita">
            <BlockMath math={eqJ} />
        </EqCard>
        <p className="sl-body">Aplicando regla de la cadena:</p>
        <EqCard title="Regla de la cadena" num={22} >
            <BlockMath math={eq22} />
        </EqCard>
        <p className="sl-body">
            Si <InlineMath math={String.raw`Q(t)`} /> se discretiza en{' '}
            <InlineMath math={String.raw`N`} /> instantes{' '}
            <InlineMath math={String.raw`(Q_1, Q_2,\ldots,Q_N)`} />:
        </p>
        <ul className="sl-bullet-list">
            <li>
                Cada <InlineMath math={String.raw`Q_i`} /> introduce una dirección de
                sensibilidad distinta.
            </li>
            <li>Se necesita resolver N sistemas PDE acoplados.</li>
            <li>
                Si <InlineMath math={String.raw`N`} /> es grande, el método directo es
                prohibitivo.
            </li>
        </ul>
    </SlideLayout>
);

export default Slide29;
