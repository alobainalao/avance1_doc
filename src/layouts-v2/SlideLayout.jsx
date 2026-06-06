import React from 'react';
import './SlideLayout.css';

const SlideLayout = ({ title, theme = 'dark', children, className = '' }) => (
    <div className={`slide-layout slide-layout--${theme} ${className}`}>
        {title && (
            <div className="slide-layout__titlebar">
                <h2 className="slide-layout__title">{title}</h2>
            </div>
        )}
        <div className="slide-layout__content">
            {children}
        </div>
    </div>
);

export default SlideLayout;
