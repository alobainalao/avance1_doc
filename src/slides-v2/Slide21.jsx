import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import './Slide21.css';

const jm = String.raw`\int_0^T\!\!\int_\Omega \delta_{(x_p-x,\,z_p-z)}\,C(x,z,t)^2\,d\Omega\,dt`;
const je = String.raw`\int_0^T |z_p-z_0|\,Q(t)^2\,dt + \beta\,|z_p-z_0|^2`;

const Slide21 = ({ theme = 'dark' }) => (
    <SlideLayout title="Definición del problema" theme={theme}>
        <p className="sl-body">
            Inspirado en la formulación de optimización distribuida propuesta
            en <span className="sl-cite">[García-Chan et al., 2018]</span>, se plantea:
        </p>
        <div className="s21-vars">
            <div>
                <p className="sl-heading">Variables de control</p>
                <ul className="sl-bullet-list">
                    <li>Caudal de bombeo <InlineMath math={String.raw`Q(t)`} /></li>
                    <li>Ubicación del pozo <InlineMath math={String.raw`(x_p, z_p)`} /></li>
                </ul>
            </div>
            <div>
                <p className="sl-heading">Variables de estado</p>
                <ul className="sl-bullet-list">
                    <li>Carga hidráulica <InlineMath math={String.raw`h(x,z,t)`} /></li>
                    <li>Concentración <InlineMath math={String.raw`C(x,z,t)`} /></li>
                </ul>
            </div>
        </div>
        <p className="sl-heading" style={{ marginTop: '0.5vh' }}>Funciones objetivo</p>
        <EqCard
            title={<><InlineMath math={String.raw`J_m(Q,z_p)`} /> — Calidad del agua</>}
            className="sl-math-xs"
        >
            <BlockMath math={jm} />
        </EqCard>
        <EqCard
            title={<><InlineMath math={String.raw`J_e(Q,z_p)`} /> — Costo energético</>}
            className="sl-math-xs"
        >
            <BlockMath math={je} />
        </EqCard>
    </SlideLayout>
);

export default Slide21;
