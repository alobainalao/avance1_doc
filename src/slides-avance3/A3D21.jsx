import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { REFS } from './referencias.js';

// Referencias bibliográficas del avance (referencias.js), con el formato de los avances anteriores (slides-v2/Slide36–37):
// ícono, autores y año, título en negrita y fuente en cursiva. Orden alfabético, seis entradas por lámina.
const LISTA = Object.values(REFS).sort((a, b) => a.autores.localeCompare(b.autores, 'es'));
const POR_LAMINA = 6;
export const N_LAMINAS = Math.ceil(LISTA.length / POR_LAMINA);
const ROMANOS = ['I', 'II', 'III', 'IV'];

export const tituloReferencias = (i) => `Referencias bibliográficas ${ROMANOS[i]}`;

export const referenciasLamina = (i) => function A3D21({ theme = 'dark' }) {
    return (
        <SlideLayout title={tituloReferencias(i)} theme={theme} justify="flex-start">
            <ul className="sl-ref-list">
                {LISTA.slice(i * POR_LAMINA, (i + 1) * POR_LAMINA).map(r => (
                    <li key={r.cita} className="sl-ref-entry">
                        <FaRegFileAlt className="sl-ref-icon" />
                        <div className="sl-ref-text">
                            <span className="sl-ref-authors">{r.autores}</span>
                            <span className="sl-ref-title">{r.titulo}</span>
                            <span className="sl-ref-venue">{r.fuente}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </SlideLayout>
    );
};
