import React from 'react';
import { useNavigate } from 'react-router-dom';
import registry from './presentations/registry';
import './PresentationSelector.css';

const PresentationSelector = () => {
    const navigate = useNavigate();

    return (
        <div className="selector-root">
            <div className="selector-header">
                <h1>
                    Simulación y control óptimo de la dinámica de contaminación<br />
                    en aguas profundas por sobreexplotación de acuíferos
                </h1>
                <p>Avances de tesis doctoral — Alexander Lobaina La'O</p>
            </div>

            <div className="selector-grid">
                {registry.map((p) => (
                    <div
                        key={p.id}
                        className={`selector-card ${p.available ? 'available' : 'unavailable'}`}
                        onClick={() => p.available && navigate(`/${p.id}`)}
                    >
                        <div className="selector-card__label">{p.label}</div>
                        <div className="selector-card__subtitle">{p.subtitle}</div>
                        <div className={`selector-card__badge ${p.available ? 'badge--ok' : 'badge--soon'}`}>
                            {p.available ? '▶  Abrir' : 'Próximamente'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="selector-footer">
                Universidad de Guadalajara · CUCEI · Doctorado en Matemáticas
            </div>
        </div>
    );
};

export default PresentationSelector;
