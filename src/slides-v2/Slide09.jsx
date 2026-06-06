import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide09 = ({ theme = 'dark' }) => (
    <SlideLayout title="Limitaciones del modelo físico" theme={theme}>
        <ol className="sl-num-list">
            <li>
                <span>
                    <strong>Hipótesis de equilibrio instantáneo:</strong>{' '}
                    no captura retardos cinéticos (sites inaccesibles).
                </span>
            </li>
            <li>
                <span>
                    <strong>Reacción multiplicada por R:</strong>{' '}
                    si la reacción ocurre sólo en fase acuosa, multiplicar por R induce
                    un sesgo en la tasa efectiva de pérdida.
                </span>
            </li>
            <li>
                <span>
                    <strong>Colas largas (tailing):</strong>{' '}
                    la ecuación no reproduce BTCs con colas pronunciadas observadas
                    experimentalmente.
                </span>
            </li>
            <li>
                <span>
                    <strong>Heterogeneidad y poros inmóviles:</strong>{' '}
                    no incorpora dominios con tiempos de residencia diferentes.
                </span>
            </li>
            <li>
                <span>
                    <strong>Biodegradación no lineal:</strong>{' '}
                    procesos microbianos pueden saturar la tasa (Monod), no representados
                    por λC.
                </span>
            </li>
        </ol>
    </SlideLayout>
);

export default Slide09;
