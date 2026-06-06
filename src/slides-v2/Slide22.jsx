import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide22.css';

const eqE = String.raw`e(\mathbf{y},\mathbf{u}) = \begin{pmatrix}
S_s\dfrac{\partial h}{\partial t} - \nabla\!\cdot\!(K\nabla h) - f(u) \\[6pt]
\dfrac{\partial}{\partial t}(\phi CR) - (\mathbf{K}\nabla h)\!\cdot\!\nabla C
  - \nabla\!\cdot\!(\mathbf{D}\nabla C) + \lambda\phi CR - W(u,y)
\end{pmatrix}`;

const Slide22 = ({ theme = 'dark' }) => (
    <SlideLayout title="Restricción" theme={theme}>
        <p className="sl-body">
            El objetivo consiste en determinar{' '}
            <InlineMath math={String.raw`u`} /> que{' '}
            <InlineMath math={String.raw`\min_{u\in\mathcal{U}_{ad}} J(\mathbf{y},\mathbf{u})`} />{' '}
            sujeto a{' '}
            <InlineMath math={String.raw`e(\mathbf{y},\mathbf{u}) = 0`} />{' '}
            en{' '}
            <InlineMath math={String.raw`\Omega\times(0,T)`} />,
            donde el operador <InlineMath math="e" /> se define como:
        </p>
        <EqCard title="Restricción PDE" className="sl-math-sm s22-eq">
            <BlockMath math={eqE} />
        </EqCard>
        <div className="s22-flow">
            <div className="s22-flow-row">
                <div className="s22-box s22-start">
                    <div className="s22-box-label">Controles</div>
                    <div className="s22-box-body">
                        <InlineMath math={String.raw`Q(t),\;(x_p,z_p)`} />
                    </div>
                </div>
                <span className="s22-arrow">→</span>
                <div className="s22-box">
                    <div className="s22-box-label">Modelo PDE</div>
                    <div className="s22-box-body">Flujo + Transporte</div>
                </div>
                <span className="s22-arrow">→</span>
                <div className="s22-flow-col">
                    <div className="s22-box">
                        <div className="s22-box-label">Estados</div>
                        <div className="s22-box-body">
                            <InlineMath math={String.raw`h(x,z,t),\; C(x,z,t)`} />
                        </div>
                    </div>
                    <span className="s22-arrow">↓</span>
                    <div className="s22-box s22-end">
                        <div className="s22-box-label">Funcionales</div>
                        <div className="s22-box-body">
                            <InlineMath math={String.raw`J_e,\; J_m`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SlideLayout>
);

export default Slide22;
