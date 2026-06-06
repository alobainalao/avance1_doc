import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import './Slide23.css';

const Slide23 = ({ theme = 'dark' }) => (
    <SlideLayout title="Optimización multiobjetivo" theme={theme}>
        <div className="s23-table-wrap">
            <table className="s23-table">
                <thead>
                    <tr>
                        <th>Variable</th>
                        <th><InlineMath math={String.raw`J_m`} /></th>
                        <th><InlineMath math={String.raw`J_e`} /></th>
                        <th>Interpretación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><InlineMath math={String.raw`z_p`} /></td>
                        <td>+</td>
                        <td>−</td>
                        <td>Conflicto directo</td>
                    </tr>
                    <tr>
                        <td><InlineMath math={String.raw`Q(t)`} /></td>
                        <td>+</td>
                        <td>+</td>
                        <td>Sin conflicto (penalización común)</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ul className="sl-bullet-list">
            <li>
                <InlineMath math={String.raw`J_m`} />: contaminación en el pozo
            </li>
            <li>
                <InlineMath math={String.raw`J_e`} />: costo económico total
            </li>
            <li>
                El conflicto principal ocurre en la profundidad{' '}
                <InlineMath math={String.raw`z_p`} />
            </li>
        </ul>
        <div className="sl-spacer" />
        <p className="sl-body">
            <strong style={{ color: 'var(--sl-accent)' }}>Conclusión:</strong>{' '}
            No existe un mínimo simultáneo ⇒ problema multiobjetivo.
        </p>
    </SlideLayout>
);

export default Slide23;
