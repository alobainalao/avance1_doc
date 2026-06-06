import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide08 = ({ theme = 'dark' }) => (
    <SlideLayout title="Conclusiones computacionales" theme={theme}>
        <div className="sl-spacer" />
        <ul className="sl-bullet-list">
            <li>
                El método RBF reproduce adecuadamente los resultados obtenidos con MEF.
            </li>
            <li>
                La reducción significativa del tiempo de cómputo permite ejecutar el modelo
                de forma repetida.
            </li>
            <li>
                RBF hace viable la búsqueda del régimen óptimo de extracción mediante
                exploración iterativa del espacio de parámetros.
            </li>
        </ul>
        <div className="sl-spacer" />
    </SlideLayout>
);

export default Slide08;
