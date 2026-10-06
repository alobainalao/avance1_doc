import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

export default function A3S21({ theme = 'dark' }) {
    return (
        <SlideLayout title="Sensibilidad adjunta  ψ_H(x,z,τ)  —  BFR vs FEniCS"
                     theme={theme} justify="flex-start" className="slide-layout--wide">
            <video
                autoPlay loop muted playsInline
                src={`${B}/videos/grid/grid_adj_H.mp4`}
                style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }}
            />
        </SlideLayout>
    );
}
