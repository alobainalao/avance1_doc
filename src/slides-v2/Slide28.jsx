import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide28.css';

const eqMain  = String.raw`u_{k+1} = u_k + \alpha_k d_k`;
const eqAlpha = String.raw`\alpha_k = \arg\min_\alpha J(u_k + \alpha d_k)`;
const eqD     = String.raw`d_k = -\nabla J(y_k(u_k)) + \beta_{k-1}d_{k-1}`;
const eqBeta  = String.raw`\beta_k = \dfrac{\nabla J(u_k)^T\!\bigl(\nabla J(u_k)-\nabla J(u_{k-1})\bigr)}{\nabla J(u_{k-1})^T\!\nabla J(u_{k-1})}`;

const NCGChart = () => (
    <div className="s28-chart sl-math-xs">
        <div className="s28-fbox s28-start">
            <InlineMath math={String.raw`u_0,\; J_0,\; \nabla J_0,\; d_0`} />
        </div>
        <div className="s28-farrow">↓</div>
        <div className="s28-loop">
            <div className="s28-fbox">
                <InlineMath math={String.raw`y_k(u_k),\; J_k`} />
            </div>
            <div className="s28-farrow">↓</div>
            <div className="s28-fbox">
                <InlineMath math={String.raw`\nabla J_k,\;\beta_k,\;\alpha_k,\; d_k`} />
            </div>
            <div className="s28-farrow">↓</div>
            <div className="s28-fbox">
                <InlineMath math={String.raw`u_{k+1} = u_k + \alpha_k d_k`} />
            </div>
        </div>
        <div className="s28-exit-row">
            <span className="s28-farrow">↓</span>
            <span className="s28-cond">
                <InlineMath math={String.raw`\|\nabla J(u_k)\|<\varepsilon`} />
            </span>
        </div>
        <div className="s28-fbox s28-end">
            <InlineMath math={String.raw`u^*,\; J^*`} />
        </div>
    </div>
);

const Slide28 = ({ theme = 'dark' }) => (
    <SlideLayout title="Método del gradiente conjugado (NCG)" theme={theme}>
        <p className="sl-body">
            Sea <InlineMath math={String.raw`\mathbf{y}=(h,C)`} />,{' '}
            <InlineMath math={String.raw`\mathbf{u}=(Q_1,\ldots,Q_{N_t},z_p)`} />{' '}
            se actualiza iterativamente mediante <span className="sl-cite">[Nocedal and Wright, 2006]</span>:
        </p>
        <EqCard title="Actualización NCG" className="sl-math-sm">
            <BlockMath math={eqMain} />
        </EqCard>
        <div className="s28-cols">
            <div className="s28-left">
                <EqCard title="Definiciones" className="sl-math-xs">
                    <div className="s28-donde">
                        <span className="s28-donde-lbl">■ <InlineMath math="\alpha_k" /> es el paso</span>
                        <div><BlockMath math={eqAlpha} /></div>
                        <span className="s28-donde-lbl">■ <InlineMath math="d_k" /> es la dirección conjugada</span>
                        <div><BlockMath math={eqD} /></div>
                        <span className="s28-donde-lbl">■ <InlineMath math="\beta_k" /> (Polak–Ribière)</span>
                        <div><BlockMath math={eqBeta} /></div>
                    </div>
                </EqCard>
                <p className="sl-heading" style={{ marginTop: '0.6vh' }}>Ventajas</p>
                <ul className="sl-bullet-list">
                    <li>No requiere Hessiano</li>
                    <li>Bajo costo de memoria</li>
                    <li>Adecuado para controles funcionales</li>
                </ul>
            </div>
            <div className="s28-right">
                <NCGChart />
            </div>
        </div>
    </SlideLayout>
);

export default Slide28;
