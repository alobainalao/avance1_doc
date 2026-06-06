import React from 'react';
import SlideLayout from './SlideLayout.jsx';
import './HeroLayout.css';

/**
 * HeroLayout — slide con imagen o visual grande como contenido principal.
 *
 * Props:
 *   title     — título de la slide (string, opcional)
 *   theme     — 'dark' | 'light'
 *   children  — imagen, figura, mapa, etc.
 *   caption   — texto breve debajo de la imagen (string, opcional)
 *   padding   — padding interno del área visual en CSS (default '2% 3%')
 */
const HeroLayout = ({ title, theme = 'dark', children, caption, padding = '2% 3%' }) => (
    <SlideLayout title={title} theme={theme} className="hero-layout">
        <div className="hero-layout__hero" style={{ padding }}>
            {children}
        </div>
        {caption && (
            <p className="hero-layout__caption">{caption}</p>
        )}
    </SlideLayout>
);

export default HeroLayout;
