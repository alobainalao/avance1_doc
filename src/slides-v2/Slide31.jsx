import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import './Slide31.css';

const Slide31 = ({ theme = 'dark' }) => (
    <SlideLayout title="Ventaja computacional del método adjunto" theme={theme}>

        <p className="sl-body">
            El método adjunto reduce significativamente el costo computacional{' '}
            <span className="sl-cite">[Shanbhag and Ghattas, 2020]</span>.
        </p>

        <table className="s31-table">
            <thead>
                <tr>
                    <th className="s31-th-aspect">Aspecto</th>
                    <th>Sensibilidades</th>
                    <th>Adjunto</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="s31-aspect">Costo computacional</td>
                    <td><InlineMath math="N_c \times \mathrm{solve(PDE)}" /></td>
                    <td><InlineMath math="2 \times \mathrm{solve(PDE)}" /></td>
                </tr>
                <tr>
                    <td className="s31-aspect">PDEs resueltas</td>
                    <td>1 por parámetro de control</td>
                    <td>1 forward + 1 adjunto</td>
                </tr>
                <tr>
                    <td className="s31-aspect">Escalabilidad</td>
                    <td>Limitada — crece con <InlineMath math="N_c" /></td>
                    <td>Independiente de <InlineMath math="N_c" /></td>
                </tr>
                <tr>
                    <td className="s31-aspect">Costo global</td>
                    <td className="s31-bad">Alto</td>
                    <td className="s31-good">Bajo</td>
                </tr>
            </tbody>
        </table>

        <div className="s31-pipeline">
            <div className="s31-box s31-start">
                Forward (<em>h</em>, <em>C</em>)
            </div>
            <div className="s31-arrow">→</div>
            <div className="s31-box">
                Adjunto (ψ<sub>h</sub>, ψ<sub>C</sub>)
            </div>
            <div className="s31-arrow">→</div>
            <div className="s31-box s31-end">
                Gradiente <InlineMath math="\nabla_u J" />
            </div>
        </div>

    </SlideLayout>
);

export default Slide31;
