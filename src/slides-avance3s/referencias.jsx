import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { REFS } from '../slides-avance3/referencias.js';

// Referencias de la versión simplificada: solo las que citan sus láminas (las copias A3Rnn y las que se importan tal cual
// de slides-avance3: A3N09, A3D04–A3D06, A3D08–A3D10), con el formato de slides-avance3/A3D21.jsx. Si una lámina añade
// una cita, añadir su clave aquí.
const CITADAS = ['allen1998crop', 'bear1972dynamics', 'byrd1999interior', 'conn2000trust', 'DanielRivas', 'grundfos2019motor',
    'haggerty1995multirate', 'hernandez2023demanda', 'Kozeny-Carman', 'manzoni2021optimal', 'mays2011water', 'Nocedal2006', 'oms2022',
    'tzatchkov2016variacion'];
const LISTA = CITADAS.map(k => REFS[k]).filter(Boolean).sort((a, b) => a.autores.localeCompare(b.autores, 'es'));
const POR_LAMINA = 7;
export const N_LAMINAS_S = Math.ceil(LISTA.length / POR_LAMINA);
const ROMANOS = ['I', 'II', 'III'];
export const tituloReferenciasS = (i) => `Referencias bibliográficas ${ROMANOS[i]}`;

export const referenciasLaminaS = (i) => function A3RReferencias({ theme = 'dark' }) {
    return (
        <SlideLayout title={tituloReferenciasS(i)} theme={theme} justify="flex-start">
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
