// registry.js — catálogo de todas las presentaciones del doctorado.
// Para añadir un avance nuevo: importar su slideConfig y agregar una entrada con available: true.

import avance2Slides from '../slideConfig';
import avance3Slides, { avance3Secciones, avance3Publica } from './slideConfig.avance3';
import { avance3sVisibles, avance3sSecciones, avance3sPublica } from './slideConfig.avance3s';
import { numerarEcuaciones } from '../layouts-v2/EcNum.js';

const avance2Sections = [
    { label: 'Portada',        start: 1,  end: 1  },
    { label: 'Precedente',     start: 2,  end: 10 },
    { label: 'Objetivos',      start: 11, end: 11 },
    { label: 'MRMT',           start: 12, end: 20 },
    { label: 'Optimización',   start: 21, end: 31 },
    { label: 'Estado Adjunto', start: 32, end: 37 },
];

const registry = [
    {
        id: 'avance1',
        label: 'Avance 1',
        subtitle: 'Sem 1 · Ene 2026',
        date: 'Enero 2026',
        slides: null,
        sections: null,
        available: true,
        type: 'v1',
    },
    {
        id: 'avance2',
        label: 'Avance 2',
        subtitle: 'Sem 2 · May 2026',
        date: '30 de mayo de 2026',
        slides: avance2Slides,
        sections: avance2Sections,
        available: true,
    },
    // Avance 3 en dos versiones con las mismas láminas (slides-avance3/version.jsx): la pública, para exponer, y la
    // completa, con toda la explicación; esta no aparece en el selector (oculta), solo por su enlace.
    {
        id: 'avance3',
        label: 'Avance 3',
        subtitle: 'Sem 3 · Ene 2027',
        date: 'Enero 2027',
        slides: avance3Publica,
        deckClass: 'deck-a3 deck-a3-publica',
        canvasW: 1408,      // 10 % más ancho que el lienzo por defecto (1280)
        ecuaciones: numerarEcuaciones(avance3Publica),   // numeración dinámica (layouts-v2/EcNum.js)
        sections: avance3Secciones,
        available: true,
    },
    {
        id: 'avance3-completa',
        label: 'Avance 3 · completa',
        subtitle: 'Sem 3 · versión con toda la explicación',
        date: 'Enero 2027',
        slides: avance3Slides,
        deckClass: 'deck-a3',
        canvasW: 1408,
        ecuaciones: numerarEcuaciones(avance3Slides),
        sections: avance3Secciones,
        available: true,
        oculta: true,
    },
    // Avance 3, versión simplificada (slideConfig.avance3s.js): solo MRMT por bloques con elementos finitos y su
    // optimización; también en dos versiones, la completa solo por su enlace.
    {
        id: 'avance3s',
        label: 'Avance 3 · simplificada',
        subtitle: 'Sem 3 · MRMT por bloques y control adjunto',
        date: 'Enero 2027',
        slides: avance3sPublica,
        deckClass: 'deck-a3 deck-a3-publica deck-a3s',
        canvasW: 1408,
        ecuaciones: numerarEcuaciones(avance3sPublica),
        sections: avance3sSecciones,
        available: true,
    },
    {
        id: 'avance3s-completa',
        label: 'Avance 3 · simplificada · completa',
        subtitle: 'Sem 3 · simplificada, con toda la explicación',
        date: 'Enero 2027',
        slides: avance3sVisibles,
        deckClass: 'deck-a3 deck-a3s',
        canvasW: 1408,
        ecuaciones: numerarEcuaciones(avance3sVisibles),
        sections: avance3sSecciones,
        available: true,
        oculta: true,
    },
    {
        id: 'avance4',
        label: 'Avance 4',
        subtitle: 'Sem 4 · Jul 2027',
        date: 'Julio 2027',
        slides: null,
        sections: null,
        available: false,
    },
    {
        id: 'avance5',
        label: 'Avance 5',
        subtitle: 'Sem 5 · Ene 2028',
        date: 'Enero 2028',
        slides: null,
        sections: null,
        available: false,
    },
    {
        id: 'avance6',
        label: 'Avance 6',
        subtitle: 'Sem 6 · Jul 2028',
        date: 'Julio 2028',
        slides: null,
        sections: null,
        available: false,
    },
    {
        id: 'avance7',
        label: 'Avance 7',
        subtitle: 'Sem 7 · Ene 2029',
        date: 'Enero 2029',
        slides: null,
        sections: null,
        available: false,
    },
    {
        id: 'final',
        label: 'Final',
        subtitle: 'Defensa · Jul 2029',
        date: 'Julio 2029',
        slides: null,
        sections: null,
        available: false,
    },
];

export default registry;
