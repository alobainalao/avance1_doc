import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import ScientificLayout from '../layouts-v2/ScientificLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eqDef  = String.raw`C(x,t) \to C_i(t), \qquad S_r(x,t) \to S_{r,i}(t)`;
const eqVecs = String.raw`\mathbf{C} = \begin{bmatrix}C_1\\C_2\\\vdots\\C_N\end{bmatrix}, \qquad \mathbf{S}_r = \begin{bmatrix}S_{r,1}\\S_{r,2}\\\vdots\\S_{r,N}\end{bmatrix}, \qquad \mathbf{U} = \begin{bmatrix}\mathbf{C}\\\mathbf{S}_1\\\vdots\\\mathbf{S}_R\end{bmatrix}`;

const Slide13 = ({ theme = 'dark' }) => (
    <ScientificLayout title="Discretización espacial (RBF-FD)" theme={theme} align="top-center">
        <p className="sl-body" style={{ textAlign: 'center' }}>
            Sea <InlineMath math={String.raw`\Omega \subset \mathbb{R}^2`} /> el dominio,
            aproximado mediante nodos no estructurados{' '}
            <InlineMath math={String.raw`\{x_i\}_{i=1}^N \subset \Omega`} />.
        </p>
        <p className="sl-body" style={{ textAlign: 'center' }}>
            Las variables se evalúan en los nodos:
        </p>
        <EqCard title="Evaluación nodal">
            <BlockMath math={eqDef} />
        </EqCard>
        <EqCard title="Vectores solución" className="sl-math-sm">
            <BlockMath math={eqVecs} />
        </EqCard>
        <p className="sl-heading" style={{ textAlign: 'center' }}>
            RBF-FD (Radial Basis Function Finite Differences)
        </p>
    </ScientificLayout>
);

export default Slide13;
