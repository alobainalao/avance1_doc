import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { REFS } from './referencias.js';

// Bibliografía del avance (referencias.js), en orden alfabético por el primer autor, a dos columnas.
const autores = r => {
    if (r.nombre) return r.nombre;
    const a = r.autores;
    if (r.etal) return `${a.join(', ')} et al.`;
    return a.length === 1 ? a[0] : `${a.slice(0, -1).join(', ')} y ${a[a.length - 1]}`;
};
const lista = Object.values(REFS).sort((x, y) => autores(x).localeCompare(autores(y), 'es') || x.anio - y.anio);

export default function A3D21({ theme = 'dark' }) {
    return (
        <SlideLayout title="Bibliografía" theme={theme} justify="flex-start">
            <div style={{ columnCount: 2, columnGap: 40, fontFamily: 'var(--a3-sans)', fontSize: 14.5, lineHeight: 1.35, color: 'var(--sl-text)' }}>
                {lista.map((r, i) => (
                    <p key={i} style={{ margin: '0 0 7px', paddingLeft: 18, textIndent: -18, breakInside: 'avoid' }}>
                        {autores(r)} ({r.anio}). <i>{r.titulo}</i>{r.fuente ? `. ${r.fuente}` : ''}.
                    </p>
                ))}
            </div>
        </SlideLayout>
    );
}
