import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const openVideo = (metodo, video) => {
    window.open(
        `${process.env.PUBLIC_URL}/#/video-player?metodo=${metodo}&video=${video}`,
        '_blank',
        `width=${window.screen.availWidth},height=${window.screen.availHeight},left=0,top=0,toolbar=no,menubar=no,scrollbars=no,resizable=no`
    );
};

const items = [
    { label: 'Altura piezométrica',   video: 'h.mp4'  },
    { label: 'Flujo del agua',        video: 'v.mp4'  },
    { label: 'Contaminante móvil',    video: 'c.mp4'  },
    { label: 'Contaminante sorbido 1', video: 's1.mp4' },
    { label: 'Contaminante sorbido 2', video: 's2.mp4' },
    { label: 'Contaminante sorbido 3', video: 's3.mp4' },
];

const Slide18 = ({ theme = 'dark' }) => (
    <SlideLayout title="Resultados numéricos BLK-MRMT" theme={theme}>
        <div className="sl-spacer" />
        <ul style={{
            listStyle: 'none', padding: 0, margin: '0 auto',
            display: 'flex', flexDirection: 'column', gap: '2.2vh',
            width: '68%',
        }}>
            {items.map(({ label, video }) => (
                <li key={label} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '1.2vh',
                    fontSize: '3.2vh', color: 'var(--sl-text)',
                }}>
                    <span style={{ color: 'var(--sl-accent)', fontSize: '0.7em', flexShrink: 0 }}>■</span>
                    <span style={{ flex: 1 }}>{label}</span>
                    {video && (
                        <button className="sl-play-btn" onClick={() => openVideo('blk', video)}>
                            <FaPlayCircle />
                        </button>
                    )}
                </li>
            ))}
        </ul>
        <div className="sl-spacer" />
    </SlideLayout>
);

export default Slide18;
