// slideConfig.avance3.js — presentación de avance semestre 3 (ene 2027)
// Pista A: dominio real, verificación del gradiente adjunto, primer resultado de optimización.
// Slides con datos reales del simulador BFR (datos: ago–oct 2026).

// ── Slides activos ─────────────────────────────────────────────────
import A3S02 from '../slides-avance3/A3S02.jsx';
import A3S10 from '../slides-avance3/A3S10.jsx';
import A3S03 from '../slides-avance3/A3S03.jsx';
import A3S05 from '../slides-avance3/A3S05.jsx';
import A3S13 from '../slides-avance3/A3S13.jsx';
import A3S11 from '../slides-avance3/A3S11.jsx';
import A3S12 from '../slides-avance3/A3S12.jsx';
import A3S14 from '../slides-avance3/A3S14.jsx';
import A3S15 from '../slides-avance3/A3S15.jsx';
import A3S16 from '../slides-avance3/A3S16.jsx';
import A3S17 from '../slides-avance3/A3S17.jsx';
import A3S09 from '../slides-avance3/A3S09.jsx';

// ── Slides inactivos (desconectados temporalmente) ─────────────────
// import A3S01 from '../slides-avance3/A3S01.jsx'; // agenda+estado — menciona envío artículo
// import A3S04 from '../slides-avance3/A3S04.jsx'; // checkpoint gradiente adjunto
// import A3S06 from '../slides-avance3/A3S06.jsx'; // escenarios de optimización
// import A3S07 from '../slides-avance3/A3S07.jsx'; // convergencia escenario conservador
// import A3S08 from '../slides-avance3/A3S08.jsx'; // estado del artículo

const avance3Slides = [
    // ── Portada ───────────────────────────────────────────────────────────
    { id: 1,  title: null,                                                    component: null,  duration: 60,  section: 'Portada',          special: null },
    // ── Contexto ─────────────────────────────────────────────────────────
    { id: 2,  title: 'Dominio físico y parámetros',                           component: A3S02, duration: 75,  section: 'Contexto',          special: null },
    { id: 3,  title: 'Estado de implementación — modelos y backends',         component: A3S10, duration: 60,  section: 'Contexto',          special: null },
    // ── Método adjunto ───────────────────────────────────────────────────
    { id: 4,  title: 'Método adjunto — ecuaciones clave',                     component: A3S03, duration: 90,  section: 'Método adjunto',    special: null },
    { id: 5,  title: 'Simulación forward y estado adjunto',                   component: A3S05, duration: 75,  section: 'Método adjunto',    special: null },
    { id: 11, title: 'Simulación forward — campo de concentración C(t)',      component: A3S15, duration: 75,  section: 'Método adjunto',    special: null },
    { id: 12, title: 'Estado adjunto — sensibilidad ψ_C(x,z,t)',             component: A3S16, duration: 75,  section: 'Método adjunto',    special: null },
    // ── Optimización ─────────────────────────────────────────────────────
    { id: 6,  title: 'Problema de optimización — formulación completa',       component: A3S13, duration: 75,  section: 'Optimización',      special: null },
    { id: 7,  title: 'Demanda variable — perfil diurno doméstico y riego',    component: A3S11, duration: 60,  section: 'Optimización',      special: null },
    { id: 8,  title: 'Ciclos de bomba y restricciones de extracción',         component: A3S12, duration: 60,  section: 'Optimización',      special: null },
    { id: 9,  title: 'Resultado ADR — evolución del perfil de bombeo',        component: A3S14, duration: 90,  section: 'Optimización',      special: null },
    { id: 13, title: 'Resultados de optimización — ADR y MRMT Semi',         component: A3S17, duration: 90,  section: 'Optimización',      special: null },
    // ── Cierre ────────────────────────────────────────────────────────────
    { id: 10, title: 'Conclusiones y próximos pasos',                         component: A3S09, duration: 75,  section: 'Cierre',            special: null },
];
// Duración total: 60+75+60+90+75+75+75+75+60+60+90+90+75 = 960 s = 16 min

export default avance3Slides;
