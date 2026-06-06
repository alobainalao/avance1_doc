import React from 'react';
import './SlideHeader.css';

const SECTIONS = [
    { label: 'Portada',        start: 1,  end: 1  },
    { label: 'Precedente',     start: 2,  end: 10 },
    { label: 'Objetivos',      start: 11, end: 11 },
    { label: 'MRMT',           start: 12, end: 20 },
    { label: 'Optimización',   start: 21, end: 31 },
    { label: 'Estado Adjunto', start: 32, end: 38 },
    { label: 'Conclusiones',   start: 39, end: 39 },
    { label: 'Referencias',    start: 40, end: 40 },
];

const SlideHeader = ({ index, title }) => {
    const slide = index + 1;
    return (
        <div className="slide-header">
            <div className="slide-header__tabs">
                {SECTIONS.map((section) => {
                    const isActive = slide >= section.start && slide <= section.end;
                    return (
                        <span
                            key={section.label}
                            className={`slide-header__tab${isActive ? ' active' : ''}`}
                        >
                            {section.label}
                        </span>
                    );
                })}
            </div>
            {title && (
                <div className="slide-header__title">{title}</div>
            )}
        </div>
    );
};

export default SlideHeader;
