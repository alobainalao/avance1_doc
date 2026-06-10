import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import TwoColumnLayout from '../layouts-v2/TwoColumnLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide34.css';

const eqUpdate = String.raw`(Q^{k+1},z_p^{k+1}) = (Q^k,z_p^k) + \alpha_k d_k`;

const Slide34Flow = () => (
    <div className="s34-flow sl-math-xs">
        <div className="s34-fbox s34-start">
            <InlineMath math={String.raw`Q^{(0)},\; z_p^{(0)}`} />
        </div>
        <div className="s34-farrow">↓</div>
        <div className="s34-loop-wrap">
            <div className="s34-loop">
                <div className="s34-fbox">
                    Resolver forward <InlineMath math={String.raw`(h,C)`} />
                </div>
                <div className="s34-farrow">↓</div>
                <div className="s34-fbox">
                    Resolver adjunto{' '}
                    <InlineMath math={String.raw`(\psi_h,\psi_C)`} />
                </div>
                <div className="s34-farrow">↓</div>
                <div className="s34-fbox">
                    Calcular gradientes <InlineMath math={String.raw`\nabla J`} />
                </div>
                <div className="s34-farrow">↓</div>
                <div className="s34-fbox">
                    Actualizar controles{' '}
                    <InlineMath math={String.raw`Q^{k+1},\; z_p^{k+1}`} />
                </div>
            </div>
        </div>
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem"
            }}
        >
            <div className="s34-farrow">↓</div>

            <div className="s34-loop-note">
                <InlineMath math={String.raw`\|\nabla J\|<\varepsilon`} />
            </div>
        </div>
        <div className="s34-fbox s34-fbox-exit">Óptimo</div>
    </div>
);

const rightContent = (
    <>
        <EqCard title="Actualización iterativa" className="sl-math-sm">
            <BlockMath math={eqUpdate} />
        </EqCard>

        <div style={{ marginTop: "96px" }}>
	     <p className="sl-heading">Interpretación:</p>
	</div>
        <ul className="sl-bullet-list">
            <li><span className="s34-emph">Forward:</span> simula el sistema físico</li>
            <li><span className="s34-emph">Adjunto:</span> propaga sensibilidad</li>
            <li><span className="s34-emph">Gradiente:</span> dirección de mejora</li>
            <li><span className="s34-emph">Actualizar:</span> paso de optimización</li>
        </ul>
    </>
);

const Slide34 = ({ theme = 'dark' }) => (
    <TwoColumnLayout
        title="Esquema iterativo de optimización"
        theme={theme}
        leftRatio={2}
        rightRatio={3}
        align="flex-start"
        left={<Slide34Flow />}
        right={rightContent}
    />
);

export default Slide34;
