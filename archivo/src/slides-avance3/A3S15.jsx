import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

export default function A3S15({ theme = 'dark' }) {
    return (
        <SlideLayout title="Concentración de contaminante  C(x,z,t)  [kg/m³]  —  BFR vs FEniCS"
                     theme={theme} justify="flex-start" className="slide-layout--wide">
            <video
                autoPlay loop muted playsInline
                src={`${B}/videos/grid/grid_C.mp4`}
                style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }}
            />
        </SlideLayout>
    );
}
