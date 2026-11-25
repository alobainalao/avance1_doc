import React from 'react';

// Vocabulario común del estado de la investigación (láminas «Objetivos del semestre y su estado», A3D17, «Avance del
// documento», A3D20, y «Estado actual y próximos pasos», A3N22): mismo color y misma marca en las tres. La marca se
// llena según el estado: completo (llena), preliminar (media, hay resultados pero no definitivos), en desarrollo (punto,
// en marcha sin resultados definitivos) y pendiente (vacía).
export const ESTADOS = {
    com: { l: 'Completo', c: 'var(--a3-valido)' },
    pre: { l: 'Preliminar', c: 'var(--a3-agua)' },
    des: { l: 'En desarrollo', c: 'var(--a3-riego)' },
    pen: { l: 'Pendiente', c: 'var(--a3-estrato)' },
};

export function Marca({ e, size = 16, style }) {
    const c = ESTADOS[e].c;
    return (
        <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0, display: 'block', ...style }}>
            {e === 'pre' && <path d="M2,9 A7,7 0 0 0 16,9 Z" fill={c} />}
            {e === 'des' && <circle cx="9" cy="9" r="2.6" fill={c} />}
            <circle cx="9" cy="9" r="7" fill={e === 'com' ? c : 'none'} stroke={c} strokeWidth="2.2" />
        </svg>
    );
}
