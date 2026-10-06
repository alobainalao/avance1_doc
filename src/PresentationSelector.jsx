import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import Controls from './Controls';
import registry from './presentations/registry';
import './PresentationSelector.css';

const CANVAS_W = 1280;
const CANVAS_H = 960;

const Card = ({ label, subtitle, available, onClick }) => (
    <div
        className={`selector-card ${available ? 'available' : 'unavailable'}`}
        onClick={onClick}
    >
        <div className="selector-card__label">
            {label}
            {available && <FiExternalLink className="selector-card__icon" />}
        </div>
        <div className="selector-card__subtitle">{subtitle}</div>
    </div>
);

const PresentationSelector = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [theme, setTheme] = useState('light');
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setScale(Math.min(width / CANVAS_W, height / CANVAS_H));
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="slideshow-container v2" ref={containerRef}>
            <Controls
                fullscreen={fullscreen}
                handleFullscreen={setFullscreen}
                theme={theme}
                onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            />
            <div
                className="slide-canvas"
                style={{
                    width: CANVAS_W,
                    height: CANVAS_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                <div className="selector-inner">
                    <div className="selector-header">
                        <h1>
                            Simulación y control óptimo de la dinámica de contaminación en aguas profundas por sobreexplotación de acuíferos
                        </h1>
                        <p>Avances de tesis doctoral — Alexander Lobaina La'O</p>
                    </div>

                    <div className="selector-grid">
                        <Card
                            label="Maestría"
                            subtitle="Defensa · 2024"
                            available
                            onClick={() => window.open('https://alobainalao.github.io/beamer_Maestria', '_blank')}
                        />
                        {registry.map((p) => (
                            <Card
                                key={p.id}
                                label={p.label}
                                subtitle={p.subtitle}
                                available={p.available}
                                onClick={() => {
                                    if (!p.available) return;
                                    if (p.externalUrl) window.open(p.externalUrl, '_blank');
                                    else navigate(`/${p.id}`);
                                }}
                            />
                        ))}
                    </div>

                    <div className="selector-footer">
                        Universidad de Guadalajara · CUCEI · Doctorado en Matemáticas
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PresentationSelector;
