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
    { label: 'Contaminante sorbido 1', video: 'C_im_r0.mp4' },
    { label: 'Contaminante sorbido 2', video: 'C_im_r1.mp4' },
    { label: 'Contaminante sorbido 3', video: 'C_im_r2.mp4' },
];

const Slide18 = ({ theme = 'dark' }) => (
    <SlideLayout title="Resultados numéricos BLK-MRMT" theme={theme}>
        <div className="sl-spacer" />
        <ul className="sl-video-list">
            {items.map(({ label, video }) => (
                <li key={label}>
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
