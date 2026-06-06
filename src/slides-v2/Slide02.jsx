import React from 'react';
import { SlideLayout, Fig } from '../layouts-v2/slide-components.jsx';

const Slide02 = ({ theme = 'dark' }) => (
    <SlideLayout title="Ubicación" theme={theme}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Fig
                src={`${process.env.PUBLIC_URL}/ubicacion.png`}
                alt="Mapa de ubicación del acuífero"
                style={{
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 0 32px rgba(0,216,255,0.10)',
                }}
            />
        </div>
    </SlideLayout>
);

export default Slide02;
