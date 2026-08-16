// registry.js — catálogo de todas las presentaciones del doctorado.
// Para añadir un avance nuevo: importar su slideConfig y agregar una entrada con available: true.

import avance2Slides from '../slideConfig';

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
        available: false,
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
    {
        id: 'avance3',
        label: 'Avance 3',
        subtitle: 'Sem 3 · Ene 2027',
        date: 'Enero 2027',
        slides: null,
        sections: null,
        available: false,
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
