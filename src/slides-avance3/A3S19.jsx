import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

export default function A3S19({ theme = 'dark' }) {
    return (
        <SlideLayout title="Carga hidráulica  H(x,z,t)  [m]  —  BFR vs FEniCS"
                     theme={theme} justify="flex-start" className="slide-layout--wide">
            <video
                autoPlay loop muted playsInline
                src={`${B}/videos/grid/grid_H.mp4`}
                style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }}
            />
        </SlideLayout>
    );
}
