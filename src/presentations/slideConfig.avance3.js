// slideConfig.avance3.js — presentación de avance semestre 3 (ene 2027)
// Pista A: dominio real, verificación del gradiente adjunto, primer resultado de optimización.
// Slides con datos reales del simulador BFR (datos: ago–oct 2026).

// ── Slides activos (línea «sin sumidero»: contenido de docs/adjunto_sin_sumidero.pdf y salidas del grupo M) ──
import A3S02 from '../slides-avance3/A3S02.jsx';
import A3S11 from '../slides-avance3/A3S11.jsx';
import A3S12 from '../slides-avance3/A3S12.jsx';
import A3S13 from '../slides-avance3/A3S13.jsx';
import A3N01 from '../slides-avance3/A3N01.jsx';
import A3N02 from '../slides-avance3/A3N02.jsx';
import A3N03 from '../slides-avance3/A3N03.jsx';
import A3N04 from '../slides-avance3/A3N04.jsx';
import A3N05 from '../slides-avance3/A3N05.jsx';
import A3N06 from '../slides-avance3/A3N06.jsx';
import A3N07 from '../slides-avance3/A3N07.jsx';
import A3N08 from '../slides-avance3/A3N08.jsx';
import A3N09 from '../slides-avance3/A3N09.jsx';
import A3N10 from '../slides-avance3/A3N10.jsx';
import A3N11 from '../slides-avance3/A3N11.jsx';
import A3N12 from '../slides-avance3/A3N12.jsx';
import A3N13 from '../slides-avance3/A3N13.jsx';
import A3N14 from '../slides-avance3/A3N14.jsx';
import A3N15 from '../slides-avance3/A3N15.jsx';
import A3N16 from '../slides-avance3/A3N16.jsx';
import A3N17 from '../slides-avance3/A3N17.jsx';
import A3N18 from '../slides-avance3/A3N18.jsx';
import A3N19 from '../slides-avance3/A3N19.jsx';
import A3N21 from '../slides-avance3/A3N21.jsx';
import A3N22 from '../slides-avance3/A3N22.jsx';
import A3N23 from '../slides-avance3/A3N23.jsx';
import A3N24 from '../slides-avance3/A3N24.jsx';
import A3N25 from '../slides-avance3/A3N25.jsx';
import { A3N26, A3N27, A3N28 } from '../slides-avance3/VideoCampo.jsx';
import { A3N29, A3N30 } from '../slides-avance3/A3N29.jsx';
import A3N31 from '../slides-avance3/A3N31.jsx';
import '../slides-avance3/avance3.css';
import A3N32 from '../slides-avance3/A3N32.jsx';
import A3N33 from '../slides-avance3/A3N33.jsx';
import A3N34 from '../slides-avance3/A3N34.jsx';

// ── Slides del modelo anterior (con W₋ y χ(Q)): se conservan los archivos, ya no están en la secuencia ──
// A3S03 (ecuaciones con χ), A3S04b/c (Taylor), A3S05, A3S10, A3S14, A3S15–A3S21 (resultados de optimización y videos anteriores), A3S09, A3S01

const avance3Slides = [
    { id: 1, title: null, component: null, duration: 60, section: 'Portada', special: null },
    { id: 2, title: 'Semestre 3 — agenda y estado (modelo sin sumidero)', component: A3N01, duration: 60, section: 'Contexto', special: null },
    { id: 3, title: 'Dominio físico y parámetros', component: A3S02, duration: 75, section: 'Contexto', special: null },
    { id: 4, title: 'Modelo sin sumidero explícito: se cancela fC', component: A3N02, duration: 90, section: 'Modelo', special: null },
    { id: 5, title: 'Modelo MRMT: regiones móvil e inmóviles', component: A3N07, duration: 75, section: 'Modelo', special: null },
    { id: 6, title: 'Condiciones de frontera e hipótesis', component: A3N09, duration: 75, section: 'Modelo', special: null },
    { id: 7, title: 'Salida libre: condición y discretización', component: A3N03, duration: 90, section: 'Modelo', special: null },
    { id: 8, title: 'Cierres posibles de Γout', component: A3N08, duration: 75, section: 'Modelo', special: null },
    { id: 9, title: 'Salida libre en FEniCSx: cómo se implementa', component: A3N31, duration: 75, section: 'Modelo', special: null },
    { id: 10, title: 'Problema de optimización — formulación completa', component: A3S13, duration: 75, section: 'Control óptimo', special: null },
    { id: 11, title: 'Funcional, controles admisibles y normalización', component: A3N10, duration: 75, section: 'Control óptimo', special: null },
    { id: 12, title: 'Demanda variable — perfil diurno doméstico y riego', component: A3S11, duration: 45, section: 'Control óptimo', special: null },
    { id: 13, title: 'Ciclos de bomba y restricciones de extracción', component: A3S12, duration: 45, section: 'Control óptimo', special: null },
    { id: 14, title: 'Forma débil del estado y Lagrangiano', component: A3N11, duration: 90, section: 'Control óptimo', special: null },
    { id: 15, title: 'Adjunto del transporte (ADR)', component: A3N04, duration: 90, section: 'Adjunto', special: null },
    { id: 16, title: 'Adjunto del flujo', component: A3N12, duration: 90, section: 'Adjunto', special: null },
    { id: 17, title: 'Gradientes del funcional reducido', component: A3N13, duration: 75, section: 'Adjunto', special: null },
    { id: 18, title: 'Adjunto del modelo MRMT', component: A3N14, duration: 75, section: 'Adjunto', special: null },
    { id: 19, title: 'Malla compartida y refinada (BFR y FEniCSx)', component: A3N32, duration: 75, section: 'Discreto', special: null },
    { id: 20, title: 'Malla refinada en la pluma y sobre el pozo (oct 2026)', component: A3N34, duration: 60, section: 'Discreto', special: null },
    { id: 21, title: 'Adjunto discreto exacto por variante', component: A3N15, duration: 90, section: 'Discreto', special: null },
    { id: 22, title: 'Adjunto discreto del flujo y regla de la cadena RBF-FD', component: A3N16, duration: 90, section: 'Discreto', special: null },
    { id: 23, title: 'Algoritmos de optimización', component: A3N17, duration: 75, section: 'Discreto', special: null },
    { id: 24, title: 'Verificación del gradiente adjunto', component: A3N05, duration: 75, section: 'Verificación', special: null },
    { id: 25, title: 'Banco 1D independiente', component: A3N18, duration: 75, section: 'Verificación', special: null },
    { id: 26, title: 'Verificaciones V1–V6', component: A3N19, duration: 75, section: 'Verificación', special: null },
    { id: 27, title: 'Configuración de las corridas', component: A3N06, duration: 60, section: 'Resultados', special: null },
    { id: 28, title: 'Directo BFR vs FEniCSx — métricas', component: A3N23, duration: 75, section: 'Resultados', special: null },
    { id: 29, title: 'Evolución del error BFR vs FEniCSx', component: A3N24, duration: 60, section: 'Resultados', special: null },
    { id: 30, title: 'En el pozo: H y C', component: A3N25, duration: 60, section: 'Resultados', special: null },
    { id: 31, title: 'Carga hidráulica H(t)', component: A3N26, duration: 60, section: 'Resultados', special: null },
    { id: 32, title: 'Velocidad de Darcy |u|(t)', component: A3N27, duration: 60, section: 'Resultados', special: null },
    { id: 33, title: 'Concentración C(t)', component: A3N28, duration: 75, section: 'Resultados', special: null },
    { id: 34, title: 'Adjunto ψ_C', component: A3N29, duration: 75, section: 'Resultados', special: null },
    { id: 35, title: 'Adjunto ψ_h', component: A3N30, duration: 75, section: 'Resultados', special: null },
    { id: 36, title: 'Control óptimo con la configuración de nitrato', component: A3N33, duration: 90, section: 'Resultados', special: null },
    { id: 37, title: 'Verificaciones adicionales', component: A3N21, duration: 60, section: 'Cierre', special: null },
    { id: 38, title: 'Conclusiones y próximos pasos', component: A3N22, duration: 75, section: 'Cierre', special: null },
];

export default avance3Slides;
