// slideConfig.avance3.js — presentación de avance semestre 3 (ene 2027)
// Pista A: dominio real, checkpoint del gradiente adjunto, primer resultado de optimización.
// Slides con datos reales del simulador BFR (datos: ago–oct 2026).

import A3S01 from '../slides-avance3/A3S01.jsx';
import A3S02 from '../slides-avance3/A3S02.jsx';
import A3S03 from '../slides-avance3/A3S03.jsx';
import A3S04 from '../slides-avance3/A3S04.jsx';
import A3S05 from '../slides-avance3/A3S05.jsx';
import A3S06 from '../slides-avance3/A3S06.jsx';
import A3S07 from '../slides-avance3/A3S07.jsx';
import A3S08 from '../slides-avance3/A3S08.jsx';
import A3S09 from '../slides-avance3/A3S09.jsx';
import A3S10 from '../slides-avance3/A3S10.jsx';
import A3S11 from '../slides-avance3/A3S11.jsx';
import A3S12 from '../slides-avance3/A3S12.jsx';
import A3S13 from '../slides-avance3/A3S13.jsx';
import A3S14 from '../slides-avance3/A3S14.jsx';

const avance3Slides = [
    // ── Contexto ─────────────────────────────────────────────────────────────
    { id: 1,  title: null,                                                    component: null,  duration: 60,  section: 'Contexto',         special: null },
    { id: 2,  title: 'Semestre 3 — agenda y estado',                          component: A3S01, duration: 60,  section: 'Contexto',         special: null },
    { id: 3,  title: 'Dominio físico y parámetros',                           component: A3S02, duration: 75,  section: 'Contexto',         special: null },
    { id: 4,  title: 'Implementación — modelos y backends',                   component: A3S10, duration: 60,  section: 'Contexto',         special: null },
    // ── Método adjunto ───────────────────────────────────────────────────────
    { id: 5,  title: 'Método adjunto — ecuaciones clave',                     component: A3S03, duration: 90,  section: 'Método adjunto',   special: null },
    { id: 6,  title: 'Checkpoint del gradiente adjunto',                      component: A3S04, duration: 90,  section: 'Método adjunto',   special: null },
    { id: 7,  title: 'Simulación forward y estado adjunto',                   component: A3S05, duration: 75,  section: 'Método adjunto',   special: null },
    // ── Optimización ─────────────────────────────────────────────────────────
    { id: 8,  title: 'Problema de optimización — formulación completa',       component: A3S13, duration: 75,  section: 'Optimización',     special: null },
    { id: 9,  title: 'Demanda variable — perfil diurno doméstico y riego',    component: A3S11, duration: 60,  section: 'Optimización',     special: null },
    { id: 10, title: 'Ciclos de bomba y restricción de suministro',           component: A3S12, duration: 60,  section: 'Optimización',     special: null },
    { id: 11, title: 'Escenarios de optimización',                            component: A3S06, duration: 75,  section: 'Optimización',     special: null },
    { id: 12, title: 'Convergencia — escenario conservador',                  component: A3S07, duration: 90,  section: 'Optimización',     special: null },
    { id: 13, title: 'Resultado ADR — Q óptimo, descenso de J y posición del pozo', component: A3S14, duration: 90,  section: 'Optimización',     special: null },
    // ── Artículo y cierre ────────────────────────────────────────────────────
    { id: 14, title: 'Estado del artículo',                                   component: A3S08, duration: 75,  section: 'Artículo',         special: null },
    { id: 15, title: 'Conclusiones y próximos pasos',                         component: A3S09, duration: 75,  section: 'Cierre',           special: null },
];
// Duración total: 60+60+75+60+90+90+75+75+60+60+75+90+90+75+75 = 1110 s = 18.5 min

export default avance3Slides;
