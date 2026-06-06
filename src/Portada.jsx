import React from 'react';
import './Portada.css';

const Portada = ({ theme }) => (
    <div className={`portada portada--${theme}`}>
        <div className="portada-title-box">
            <h1>
                Simulación y control óptimo de la dinámica de contaminación
                en aguas profundas por sobreexplotación de acuíferos.
            </h1>
        </div>

        <div className="portada-info">
            <div className="portada-row">
                <span className="portada-label">Autor:</span>
                <span className="portada-value">Mtro. Alexander Lobaina La'O</span>
            </div>
            <div className="portada-row">
                <span className="portada-label">Director:</span>
                <span className="portada-value">Dr. Néstor García Chan</span>
            </div>
            <div className="portada-row">
                <span className="portada-label">Codirector:</span>
                <span className="portada-value">Dr. Juan Antonio Licea Salazar</span>
            </div>
            <div className="portada-row">
                <span className="portada-label">Asesora:</span>
                <span className="portada-value">Dra. Emilia Fregoso Becerra</span>
            </div>
        </div>

        <div className="portada-institution">
            <p>Universidad de Guadalajara</p>
            <p>Centro Universitario de Ciencias Exactas e Ingenierías</p>
        </div>

        <div className="portada-date">30 de mayo de 2026</div>
    </div>
);

export default Portada;
