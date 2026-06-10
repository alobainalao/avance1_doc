import React from 'react';
import { SlideLayout } from '../layouts-v2/slide-components.jsx';

const IFRAME_URL = 'https://doctorado-3.onrender.com';

const Slide19 = ({ theme = 'dark' }) => (
    <SlideLayout title="Simulación interactiva" theme={theme}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 0 32px rgba(0,216,255,0.10)',
                border: '1px solid var(--sl-accent)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    padding: '5px 2%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1%',
                    borderBottom: '1px solid rgba(0,216,255,0.25)',
                    flexShrink: 0,
                }}>
                    <span style={{ color: 'var(--sl-muted)', fontSize: '19px', fontFamily: 'monospace', userSelect: 'none' }}>🌐</span>
                    <span style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        padding: '2px 1.5%',
                        color: 'var(--sl-muted)',
                        fontSize: '19px',
                        fontFamily: 'monospace',
                    }}>
                        {IFRAME_URL}
                    </span>
                </div>
                <iframe
                    src={`${IFRAME_URL}?theme=${theme}`}
                    title="Simulación interactiva"
                    style={{
                        width: '100%',
                        height: '614px',
                        border: 'none',
                        display: 'block',
                    }}
                    allow="fullscreen"
                />
            </div>
        </div>
    </SlideLayout>
);

export default Slide19;
