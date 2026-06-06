import React from 'react';
import { SlideLayout, Fig } from '../layouts-v2/slide-components.jsx';

const Slide03 = ({ theme = 'dark' }) => (
    <SlideLayout title="Malla y Porosidad efectiva" theme={theme}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2.5vh' }}>
            <Fig
                src={`${process.env.PUBLIC_URL}/grid.png`}
                alt="Malla numérica del acuífero"
                caption="Malla de elementos finitos"
            />
            <Fig
                src={`${process.env.PUBLIC_URL}/porosidadd.png`}
                alt="Distribución de porosidad efectiva"
                caption="Porosidad efectiva φ"
            />
        </div>
    </SlideLayout>
);

export default Slide03;
