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

const items07 = [
    { label: 'Altura piezométrica', video: 'h.mp4' },
    { label: 'Flujo del agua',       video: 'v.mp4' },
    { label: 'Contaminante',         video: 'c.mp4' },
];

const Slide07 = ({ theme = 'dark' }) => (
    <SlideLayout title="Resultados numéricos RBF" theme={theme}>
        <div className="sl-spacer" />
        <ul className="sl-video-list">
            {items07.map(({ label, video }) => (
                <li key={label}>
                    <span style={{ color: 'var(--sl-accent)', fontSize: '0.7em', flexShrink: 0 }}>■</span>
                    <span style={{ flex: 1 }}>{label}</span>
                    <button className="sl-play-btn" onClick={() => openVideo('adr', video)}>
                        <FaPlayCircle />
                    </button>
                </li>
            ))}
        </ul>
        <div className="sl-spacer" />
    </SlideLayout>
);

export default Slide07;
