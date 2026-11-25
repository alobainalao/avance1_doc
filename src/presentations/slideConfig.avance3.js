// slideConfig.avance3.js — presentación de avance semestre 3 (ene 2027)
// Pista A: dominio real, verificación del gradiente adjunto, primer resultado de optimización.
// Slides con datos reales del simulador BFR (datos: ago–oct 2026).

// ── Slides activos (línea «sin sumidero»: contenido de docs/adjunto_sin_sumidero.pdf y salidas del grupo M) ──
import A3S02 from '../slides-avance3/A3S02.jsx';
import A3S12 from '../slides-avance3/A3S12.jsx';
import A3S13 from '../slides-avance3/A3S13.jsx';
import A3N01 from '../slides-avance3/A3N01.jsx';
import A3N02 from '../slides-avance3/A3N02.jsx';
import A3N03 from '../slides-avance3/A3N03.jsx';
import A3N04 from '../slides-avance3/A3N04.jsx';
import A3N05 from '../slides-avance3/A3N05.jsx';
import A3N06 from '../slides-avance3/A3N06.jsx';
import A3N07 from '../slides-avance3/A3N07.jsx';
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
import { A3N29, A3N30, A3N35, A3N36, A3N37 } from '../slides-avance3/A3N29.jsx';
import '../slides-avance3/avance3.css';
import { enVersion } from '../slides-avance3/version.jsx';
import A3N33 from '../slides-avance3/A3N33.jsx';
import A3N34 from '../slides-avance3/A3N34.jsx';
import A3D01 from '../slides-avance3/A3D01.jsx';
import { referenciasLamina, tituloReferencias, N_LAMINAS } from '../slides-avance3/A3D21.jsx';
import A3D22 from '../slides-avance3/A3D22.jsx';
import A3D23 from '../slides-avance3/A3D23.jsx';
import A3D24 from '../slides-avance3/A3D24.jsx';
import A3D25 from '../slides-avance3/A3D25.jsx';
import A3D02 from '../slides-avance3/A3D02.jsx';
import A3D03 from '../slides-avance3/A3D03.jsx';
import A3D04 from '../slides-avance3/A3D04.jsx';
import A3D05 from '../slides-avance3/A3D05.jsx';
import A3D06 from '../slides-avance3/A3D06.jsx';
import A3D07 from '../slides-avance3/A3D07.jsx';
import A3D08 from '../slides-avance3/A3D08.jsx';
import A3D09 from '../slides-avance3/A3D09.jsx';
import A3D10 from '../slides-avance3/A3D10.jsx';
import A3D11 from '../slides-avance3/A3D11.jsx';
import A3D12 from '../slides-avance3/A3D12.jsx';
import A3D13 from '../slides-avance3/A3D13.jsx';
import A3D14 from '../slides-avance3/A3D14.jsx';
import A3D15 from '../slides-avance3/A3D15.jsx';
import A3D16 from '../slides-avance3/A3D16.jsx';
import A3D17 from '../slides-avance3/A3D17.jsx';
import A3D18 from '../slides-avance3/A3D18.jsx';
import A3D20 from '../slides-avance3/A3D20.jsx';

// ── Slides del modelo anterior (con W₋ y χ(Q)): se conservan los archivos, ya no están en la secuencia ──
// A3S03 (ecuaciones con χ), A3S04b/c (Taylor), A3S05, A3S10, A3S14, A3S15–A3S21 (resultados de optimización y videos anteriores), A3S09, A3S01
// A3D19 («¿Por qué MRMT pedía un pozo más hondo?») salió de la presentación en la revisión de la versión 03 (25-nov-2026).

// Narrativa (nov 2026): pregunta y objetivos → modelo coherente → seis implementaciones → problema de control → gradiente
// por el adjunto → solución del adjunto → optimizador → resultados (malla con eje de 1 m) → avance del documento. Las
// slides anteriores que la narrativa no usa quedan con `oculta: true` al final.
const avance3Slides = [
    { id: 1, title: null, component: null, duration: 45, section: 'Portada', special: null },
    { id: 2, title: 'Del acuífero de Sabinas a la pregunta', component: A3D01, duration: 180, section: 'Pregunta', special: null },
    { id: 3, title: 'Objetivos del semestre y su estado', component: A3D17, duration: 60, section: 'Pregunta', special: null },
    { id: 4, title: 'Dominio físico y parámetros', component: A3S02, duration: 60, section: 'Modelo', special: null },
    { id: 5, title: 'Modelo sin sumidero explícito: se cancela fC', component: A3N02, duration: 90, section: 'Modelo', special: null },
    { id: 6, title: 'Modelo MRMT: regiones móvil e inmóviles', component: A3N07, duration: 60, section: 'Modelo', special: null },
    { id: 7, title: 'Condiciones de frontera', component: A3N09, duration: 45, section: 'Modelo', special: null },
    { id: 8, title: 'Salida libre: la carga de salida avanza sola, paso a paso', component: A3N03, duration: 75, section: 'Modelo', special: null },
    { id: 9, title: 'Del modelo anterior al modelo nuevo', component: A3D02, duration: 75, section: 'Modelo', special: null },
    { id: 10, title: 'Seis implementaciones del mismo problema', component: A3D03, duration: 75, section: 'Implementación', special: null },
    { id: 11, title: 'Malla con conos: refinada en la pluma y sobre el pozo', component: A3N34, duration: 60, section: 'Implementación', special: null },
    { id: 12, title: 'Carga hidráulica h(t)', component: A3N26, duration: 45, section: 'Implementación', special: null },
    { id: 13, title: 'Velocidad de Darcy |u|(t)', component: A3N27, duration: 45, section: 'Implementación', special: null },
    { id: 14, title: 'Concentración C(t)', component: A3N28, duration: 60, section: 'Implementación', special: null },
    { id: 15, title: 'El problema de control óptimo', component: A3D04, duration: 90, section: 'Control', special: null },
    { id: 16, title: 'Conjunto admisible: bomba, pozo y tanque', component: A3D05, duration: 75, section: 'Control', special: null },
    { id: 17, title: 'Demanda, bomba y tanque', component: A3D06, duration: 75, section: 'Control', special: null },
    { id: 18, title: 'El gradiente: ¿por qué no diferencias finitas?', component: A3D07, duration: 75, section: 'Gradiente', special: null },
    { id: 19, title: 'Método adjunto: el Lagrangiano en cinco pasos', component: A3D08, duration: 90, section: 'Gradiente', special: null },
    { id: 20, title: 'El sistema adjunto se resuelve hacia atrás', component: A3D09, duration: 90, section: 'Gradiente', special: null },
    { id: 21, title: 'Del adjunto al gradiente', component: A3D10, duration: 75, section: 'Gradiente', special: null },
    { id: 22, title: 'Verificación del gradiente adjunto', component: A3D11, duration: 60, section: 'Gradiente', special: null },
    { id: 23, title: 'Adjunto del flujo ψₕ', component: A3N30, duration: 60, section: 'Adjunto', special: null },
    { id: 24, title: 'Adjunto del transporte', component: A3N29, duration: 60, section: 'Adjunto', special: null },
    { id: 25, title: 'Adjuntos de las regiones inmóviles', component: A3N35, duration: 40, section: 'Adjunto', special: null },
    { id: 26, title: 'Adjunto de la región inmóvil 2 (intermedio)', component: A3N36, duration: 40, section: 'Adjunto', oculta: true },
    { id: 27, title: 'Adjunto de la región inmóvil 3 (lento)', component: A3N37, duration: 40, section: 'Adjunto', oculta: true },
    { id: 28, title: 'Gradiente conjugado: usar la dirección anterior', component: A3D12, duration: 75, section: 'Optimización', special: null },
    { id: 29, title: 'Con el tanque, proyectar deja de ser trivial', component: A3D13, duration: 75, section: 'Optimización', special: null },
    { id: 30, title: 'Del punto inicial al óptimo: iteraciones y KKT', component: A3D16, duration: 75, section: 'Optimización', special: null },
    { id: 30.5, title: 'Configuración de las corridas', component: A3D22, duration: 60, section: 'Resultados', special: null },
    { id: 31.5, title: 'Validación con casos triviales', component: A3D25, duration: 75, section: 'Resultados', special: null },
    { id: 32, title: 'Mejor iterado ADR (preliminar, serie anterior)', component: A3D14, duration: 90, section: 'Resultados', special: null },
    { id: 33, title: 'Mejor iterado por modelo (preliminar, serie anterior)', component: A3D15, duration: 75, section: 'Resultados', special: null },
    { id: 34.2, title: '¿Qué es un frente de Pareto?', component: A3D24, duration: 75, section: 'Resultados', special: null },
    { id: 34.5, title: 'Supuestos y limitaciones', component: A3D23, duration: 60, section: 'Resultados', special: null },
    { id: 35, title: 'Avance del documento de tesis y del artículo', component: A3D20, duration: 60, section: 'Avance', special: null },
    { id: 36, title: 'Estado actual y próximos pasos', component: A3N22, duration: 75, section: 'Avance', special: null },
    ...Array.from({ length: N_LAMINAS }, (_, i) => ({ id: 37 + i / 10, title: tituloReferencias(i), component: referenciasLamina(i), duration: 10, section: 'Avance', special: null })),

    // ── Ocultas: versión anterior de la secuencia, se conservan para reactivarlas ──
    { id: 101, title: 'Semestre 3 — agenda y estado (modelo sin sumidero)', component: A3N01, section: 'Pregunta', oculta: true },
    { id: 102, title: 'Problema de optimización — formulación completa', component: A3S13, section: 'Control', oculta: true },
    { id: 103, title: 'Funcional, controles admisibles y normalización', component: A3N10, section: 'Control', oculta: true },
    { id: 104, title: 'Ciclos de bomba y restricciones de extracción', component: A3S12, section: 'Control', oculta: true },
    { id: 105, title: 'Forma débil del estado y Lagrangiano', component: A3N11, section: 'Gradiente', oculta: true },
    { id: 106, title: 'Adjunto del transporte (ADR)', component: A3N04, section: 'Gradiente', oculta: true },
    { id: 107, title: 'Adjunto del flujo', component: A3N12, section: 'Gradiente', oculta: true },
    { id: 108, title: 'Gradientes del funcional reducido', component: A3N13, section: 'Gradiente', oculta: true },
    { id: 109, title: 'Adjunto del modelo MRMT', component: A3N14, section: 'Gradiente', oculta: true },
    { id: 110, title: 'Adjunto discreto exacto por variante', component: A3N15, section: 'Gradiente', oculta: true },
    { id: 111, title: 'Adjunto discreto del flujo y regla de la cadena RBF-FD', component: A3N16, section: 'Gradiente', oculta: true },
    { id: 112, title: 'Algoritmos de optimización', component: A3N17, section: 'Optimización', oculta: true },
    { id: 113, title: 'Verificación del gradiente adjunto (tablas)', component: A3N05, section: 'Gradiente', oculta: true },
    { id: 114, title: 'Banco 1D independiente', component: A3N18, section: 'Gradiente', oculta: true },
    { id: 115, title: 'Verificaciones V1–V6', component: A3N19, section: 'Gradiente', oculta: true },
    { id: 116, title: 'Configuración de las corridas', component: A3N06, section: 'Implementación', oculta: true },
    { id: 117, title: 'Directo BFR vs FEniCSx — métricas', component: A3N23, section: 'Implementación', oculta: true },
    { id: 118, title: 'Evolución del error BFR vs FEniCSx', component: A3N24, section: 'Implementación', oculta: true },
    { id: 119, title: 'En el pozo: H y C', component: A3N25, section: 'Implementación', oculta: true },
    { id: 120, title: 'Control óptimo con la configuración de nitrato', component: A3N33, section: 'Resultados', oculta: true },
    { id: 121, title: 'Verificaciones adicionales', component: A3N21, section: 'Resultados', oculta: true },
    // Desconectada en la revisión de la versión 03 (25-nov-2026): no hace falta en la exposición; se conserva para reactivarla.
    { id: 122, title: '¿El zₚ óptimo es del modelo o de la malla?', component: A3D18, section: 'Resultados', oculta: true },
];

// Las marcadas con `oculta: true` no se muestran por ahora (se conservan para reactivarlas); el resto se
// renumera en orden.
export const avance3Visibles = avance3Slides.filter(sl => !sl.oculta).map((sl, i) => ({ ...sl, id: i + 1 }));

// Versión pública: las mismas láminas, con el texto marcado `a3-completa` oculto y letra más grande (version.jsx).
export const avance3Publica = avance3Visibles.map(sl => ({ ...sl, component: enVersion(sl.component, 'publica') }));

// Secciones de la cabecera calculadas del campo `section` de las visibles (tramos consecutivos).
export const avance3Secciones = avance3Visibles.reduce((acc, sl) => {
    const ult = acc[acc.length - 1];
    if (ult && ult.label === sl.section) ult.end = sl.id;
    else acc.push({ label: sl.section, start: sl.id, end: sl.id });
    return acc;
}, []);

export default avance3Visibles;
