import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Tabla } from './ui.jsx';

const cols = [
    { k: 'v', label: '' }, { k: 'q', label: 'Qué se probó' }, { k: 's', label: 'Sustenta', color: '#2E7D4F' }, { k: 'n', label: 'No sustenta', color: '#C4511F' },
];
const rows = [
    { v: 'V1', q: 'Adjunto discreto FEniCSx, 3 modelos, con la salida libre', s: 'Adjunto discreto de FEniCSx', n: 'Adjunto continuo; BFR' },
    { v: 'V2', q: 'Ecuaciones continuas evaluadas sobre el multiplicador de FEniCSx', s: 'Es la discretización de las ecuaciones del PDF (residuo 10⁻¹⁵)', n: 'Convergencia' },
    { v: 'V3', q: 'Banco 1D (Galerkin P1), cierre esencial', s: 'Adjunto continuo, fuente de almacenamiento y signos', n: 'Γout, paredes, 2D' },
    { v: 'V4', q: 'Recursiones con matrices aleatorias', s: 'Álgebra de ADR/bloque/semi (10⁻⁹)', n: 'La implementación' },
    { v: 'V5', q: 'Adjunto exacto BFR, cuadrado, C≡1, cierre "libre"', s: 'Adjunto discreto exacto de BFR (10⁻⁵–10⁻⁷)', n: 'Recorte activo; C modulada' },
    { v: 'V6', q: 'Dominio real, Q = 0.3 (30 × Q_max)', s: 'Código con velocidad alta', n: 'Régimen admisible' },
];

export default function A3N19({ theme = 'dark' }) {
    return (
        <SlideLayout title="Verificaciones V1–V6: qué demuestra cada una" theme={theme} justify="flex-start">
            <Tabla cols={cols} rows={rows} />
        </SlideLayout>
    );
}
