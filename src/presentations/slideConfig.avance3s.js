// slideConfig.avance3s.js — avance 3, versión simplificada (26-nov-2026).
// Una sola metodología: modelo MRMT con elementos finitos, resuelto por bloques (reducción por complemento de Schur), y su
// optimización con el método adjunto. No sustituye al avance 3 (slideConfig.avance3.js, intacto; etiqueta git
// avance3-v03-antes-simplificada): las láminas que cambian son copias en slides-avance3s/ (A3Rnn); las que se conservan
// tal cual se importan de slides-avance3/.
import A3D04 from '../slides-avance3/A3D04.jsx';
import A3D05 from '../slides-avance3/A3D05.jsx';
import A3D06 from '../slides-avance3/A3D06.jsx';
import A3D08 from '../slides-avance3/A3D08.jsx';
import A3D09 from '../slides-avance3/A3D09.jsx';
import A3D10 from '../slides-avance3/A3D10.jsx';
import A3N09 from '../slides-avance3/A3N09.jsx';
import '../slides-avance3/avance3.css';
import '../slides-avance3s/avance3s.css';
import { enVersion } from '../slides-avance3/version.jsx';
import A3R01 from '../slides-avance3s/A3R01.jsx';
import A3R02 from '../slides-avance3s/A3R02.jsx';
import A3R03 from '../slides-avance3s/A3R03.jsx';
import A3R04 from '../slides-avance3s/A3R04.jsx';
import A3R05 from '../slides-avance3s/A3R05.jsx';
import A3R06 from '../slides-avance3s/A3R06.jsx';
import A3R07 from '../slides-avance3s/A3R07.jsx';
import A3R08 from '../slides-avance3s/A3R08.jsx';
import A3R09 from '../slides-avance3s/A3R09.jsx';
import A3R10 from '../slides-avance3s/A3R10.jsx';
import A3R11 from '../slides-avance3s/A3R11.jsx';
import A3R12 from '../slides-avance3s/A3R12.jsx';
import A3R13 from '../slides-avance3s/A3R13.jsx';
import A3R14 from '../slides-avance3s/A3R14.jsx';
import A3R15 from '../slides-avance3s/A3R15.jsx';
import { referenciasLaminaS, tituloReferenciasS, N_LAMINAS_S } from '../slides-avance3s/referencias.jsx';

// Narrativa: problema físico → modelo MRMT → resolución numérica → campos de estado → problema de control → método
// adjunto → algoritmo con restricciones → resultados óptimos → trabajo realizado y proyectado. Entre corchetes, la lámina
// de la versión 03 de la que sale (numeración pública con 42 láminas, la que usó la revisión del 26-nov-2026).
const avance3sSlides = [
    { id: 1, title: null, component: null, duration: 30, section: 'Portada', special: null },                                   // [1]
    { id: 2, title: 'Del acuífero de Sabinas a la pregunta', component: A3R01, duration: 50, section: 'Problema', special: null },    // [2], más rápida
    { id: 3, title: 'Objetivos y estado de avance', component: A3R02, duration: 45, section: 'Problema', special: null },             // [3]
    { id: 4, title: 'Dominio, física y discretización', component: A3R03, duration: 60, section: 'Modelo', special: null },          // [4]
    { id: 5, title: 'Modelo MRMT: el sistema que se resuelve', component: A3R04, duration: 75, section: 'Modelo', special: null },   // [5] + [6]
    { id: 6, title: 'Del modelo continuo al sistema de cada paso', component: A3R05, duration: 90, section: 'Modelo', special: null }, // nueva
    { id: 7, title: 'Condiciones de frontera', component: A3N09, duration: 45, section: 'Modelo', special: null },                  // [7]
    { id: 8, title: 'Malla de elementos finitos', component: A3R06, duration: 40, section: 'Modelo', special: null },               // [11]
    { id: 9, title: 'Campos del modelo MRMT por bloques', component: A3R07, duration: 60, section: 'Modelo', special: null },        // [12]–[14]
    { id: 10, title: 'El problema de control óptimo', component: A3D04, duration: 75, section: 'Control', special: null },          // [15]
    { id: 11, title: 'Conjunto admisible: bomba, pozo y tanque', component: A3D05, duration: 60, section: 'Control', special: null }, // [16]
    { id: 12, title: 'Demanda, bomba y tanque', component: A3D06, duration: 50, section: 'Control', special: null },                // [17]
    { id: 13, title: 'Sensibilidad: el gradiente de Ĵ y su costo', component: A3R08, duration: 60, section: 'Adjunto', special: null }, // [18]
    { id: 14, title: 'Método adjunto: el Lagrangiano en cinco pasos', component: A3D08, duration: 90, section: 'Adjunto', special: null }, // [19]
    { id: 15, title: 'El sistema adjunto se resuelve hacia atrás', component: A3D09, duration: 75, section: 'Adjunto', special: null }, // [20]
    { id: 16, title: 'Del adjunto al gradiente', component: A3D10, duration: 60, section: 'Adjunto', special: null },               // [21]
    { id: 17, title: 'Verificación del gradiente', component: A3R09, duration: 60, section: 'Adjunto', special: null },             // [22]
    { id: 18, title: 'Los cinco adjuntos', component: A3R10, duration: 50, section: 'Adjunto', special: null },                     // [23]–[25]
    { id: 19, title: 'Restricciones: por qué no proyectar', component: A3R11, duration: 60, section: 'Optimización', special: null }, // [27]
    { id: 20, title: 'Algoritmo: región de confianza con barrera', component: A3R12, duration: 90, section: 'Optimización', special: null }, // [28]
    { id: 21, title: 'Convergencia y controles', component: A3R13, duration: 75, section: 'Resultados', special: null },            // [29]–[36]
    { id: 22, title: 'La solución óptima en el acuífero', component: A3R14, duration: 75, section: 'Resultados', special: null },    // [29]–[36]
    { id: 23, title: 'Trabajo realizado y proyectado', component: A3R15, duration: 45, section: 'Cierre', special: null },          // [37] + [38]
    ...Array.from({ length: N_LAMINAS_S }, (_, i) => ({ id: 24 + i / 10, title: tituloReferenciasS(i), component: referenciasLaminaS(i), duration: 10, section: 'Cierre', special: null })),
];

export const avance3sVisibles = avance3sSlides.filter(sl => !sl.oculta).map((sl, i) => ({ ...sl, id: i + 1 }));
export const avance3sPublica = avance3sVisibles.map(sl => ({ ...sl, component: enVersion(sl.component, 'publica') }));
export const avance3sSecciones = avance3sVisibles.reduce((acc, sl) => {
    const ult = acc[acc.length - 1];
    if (ult && ult.label === sl.section) ult.end = sl.id;
    else acc.push({ label: sl.section, start: sl.id, end: sl.id });
    return acc;
}, []);

export default avance3sVisibles;
