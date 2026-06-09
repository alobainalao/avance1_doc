import React from 'react';
import { BlockMath } from 'react-katex';
import { SlideLayout, EqCard } from '../layouts-v2/slide-components.jsx';

const eq1  = String.raw`S_s \frac{\partial h}{\partial t} - \nabla \cdot (\mathbf{K}\nabla h) = f`;
const eq10 = String.raw`\mathbf{v} = -\mathbf{K}\nabla h`;
const eq11 = String.raw`\phi \frac{\partial C}{\partial t} + \mathbf{v} \cdot \nabla C - \nabla \cdot (\mathbf{D}\nabla C) = \sum_r \beta_r(S_r - C) + W`;
const eq12 = String.raw`\phi_r \frac{\partial S_r}{\partial t} = \beta_r(C - S_r)`;

const Slide10 = ({ theme = 'dark' }) => (
    <SlideLayout title="Transferencia de Masa Multirate (MRMT)" theme={theme}>
        <p className="sl-body">
            Modelo para medios heterogéneos <span className="sl-cite">[Benson et al., 2000]</span>:
        </p>
        <EqCard title="Flujo" num={1}>
            <BlockMath math={eq1} />
        </EqCard>
        <EqCard title="Velocidad de Darcy" num={10}>
            <BlockMath math={eq10} />
        </EqCard>
        <EqCard title="Transporte MRMT" num={11} >
            <BlockMath math={eq11} />
        </EqCard>
        <EqCard title="Reservorios de capacidad lenta" num={12}>
            <BlockMath math={eq12} />
        </EqCard>
        <p className="sl-body">Describe dominios lentos y rápidos de transporte.</p>
    </SlideLayout>
);

export default Slide10;
