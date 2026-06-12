// slideConfig.js — configuración central de la presentación
// Edita el campo `duration` (segundos) de cada slide antes de la presentación.

import Slide02 from './slides-v2/Slide02.jsx';
import Slide03 from './slides-v2/Slide03.jsx';
import Slide04 from './slides-v2/Slide04.jsx';
import Slide05 from './slides-v2/Slide05.jsx';
import Slide06 from './slides-v2/Slide06.jsx';
import Slide20 from './slides-v2/Slide20.jsx';
import Slide21 from './slides-v2/Slide21.jsx';
import Slide22 from './slides-v2/Slide22.jsx';
import Slide26 from './slides-v2/Slide26.jsx';
import Slide28 from './slides-v2/Slide28.jsx';
import Slide34 from './slides-v2/Slide34.jsx';
import Slide07 from './slides-v2/Slide07.jsx';
import Slide08 from './slides-v2/Slide08.jsx';
import Slide09 from './slides-v2/Slide09.jsx';
import Slide10 from './slides-v2/Slide10.jsx';
import Slide11 from './slides-v2/Slide11.jsx';
import Slide12 from './slides-v2/Slide12.jsx';
import Slide13 from './slides-v2/Slide13.jsx';
import Slide14 from './slides-v2/Slide14.jsx';
import Slide15 from './slides-v2/Slide15.jsx';
import Slide16 from './slides-v2/Slide16.jsx';
import Slide17 from './slides-v2/Slide17.jsx';
import Slide18 from './slides-v2/Slide18.jsx';
import Slide19 from './slides-v2/Slide19.jsx';
import Slide23 from './slides-v2/Slide23.jsx';
import Slide24 from './slides-v2/Slide24.jsx';
import Slide25 from './slides-v2/Slide25.jsx';
import Slide27 from './slides-v2/Slide27.jsx';
import Slide27b from './slides-v2/Slide27b.jsx';
import Slide29 from './slides-v2/Slide29.jsx';
import Slide30 from './slides-v2/Slide30.jsx';
import Slide31 from './slides-v2/Slide31.jsx';
import Slide32 from './slides-v2/Slide32.jsx';
import Slide33 from './slides-v2/Slide33.jsx';
import Slide35 from './slides-v2/Slide35.jsx';
import Slide36 from './slides-v2/Slide36.jsx';
import Slide37 from './slides-v2/Slide37.jsx';

const slideConfig = [
  { id: 1,  title: null,                                                   component: null,    duration: 36,  section: 'Portada',        special: null },
  { id: 2,  title: 'Ubicación',                                            component: Slide02, duration: 30,  section: 'Precedente',     special: null },
  { id: 3,  title: 'Malla y Porosidad efectiva',                           component: Slide03, duration: 60,  section: 'Precedente',     special: null },
  { id: 4,  title: 'Modelo Matemático',                                    component: Slide04, duration: 105, section: 'Precedente',     special: null },
  { id: 5,  title: 'Áreas de oportunidad de la implementación MEF-FeniCS', component: Slide05, duration: 45,  section: 'Precedente',     special: null },
  { id: 6,  title: 'Radial Basis Functions (RBF)',                          component: Slide06, duration: 75,  section: 'Precedente',     special: null },
  { id: 7,  title: 'Resultados numéricos RBF',                             component: Slide07, duration: 90,  section: 'Precedente',     special: null },
  { id: 8,  title: 'Conclusiones computacionales',                         component: Slide08, duration: 23,  section: 'Precedente',     special: null },
  { id: 9,  title: 'Limitaciones del modelo físico',                       component: Slide09, duration: 23,  section: 'Precedente',     special: null },
  { id: 10, title: 'Transferencia de Masa Multirate (MRMT)',               component: Slide10, duration: 45,  section: 'Precedente',     special: null },

  { id: 11, title: 'Objetivos del semestre',                               component: Slide11, duration: 60,  section: 'Objetivos',      special: null },
  { id: 12, title: 'Discretización Temporal',                              component: Slide12, duration: 45,  section: 'MRMT',           special: null },
  { id: 13, title: 'Discretización espacial (RBF-FD)',                     component: Slide13, duration: 45,  section: 'MRMT',           special: null },
  { id: 14, title: 'Matriz bloque global',                                 component: Slide14, duration: 75,  section: 'MRMT',           special: null },
  { id: 15, title: 'Reducción de Schur',                                   component: Slide15, duration: 45,  section: 'MRMT',           special: null },
  { id: 16, title: 'Resultados numéricos',                                 component: Slide16, duration: 90,  section: 'MRMT',           special: null },
  { id: 17, title: 'Método desacoplado',                                   component: Slide17, duration: 45,  section: 'MRMT',           special: null },
  { id: 18, title: 'Resultados numéricos',                                 component: Slide18, duration: 90,  section: 'MRMT',           special: null },

  { id: 19, title: 'Simulación interactiva',                               component: Slide19, duration: 90,  section: 'MRMT',           special: null },

  { id: 20, title: 'Motivación',                                           component: Slide20, duration: 45,  section: 'Optimización',   special: null },
  { id: 21, title: 'Definición del problema',                              component: Slide21, duration: 53,  section: 'Optimización',   special: null },
  { id: 22, title: 'Restricción',                                          component: Slide22, duration: 38,  section: 'Optimización',   special: null },
  { id: 23, title: 'Optimización multiobjetivo',                           component: Slide23, duration: 60,  section: 'Optimización',   special: null },
  { id: 24, title: 'Óptimos de Pareto',                                    component: Slide24, duration: 45,  section: 'Optimización',   special: null },
  { id: 25, title: 'Escalarización',                                       component: Slide25, duration: 45,  section: 'Optimización',   special: null },
  { id: 26, title: 'Restricciones',                                        component: Slide26, duration: 45,  section: 'Optimización',   special: null },

  { id: 27,   title: 'Problema de optimización',                            component: Slide27,  duration: 60,  section: 'Optimización',   special: null },
  { id: '27b', title: 'Método de optimización seleccionado',               component: Slide27b, duration: 90,  section: 'Optimización',   special: null },
  { id: 28,   title: 'Método del gradiente conjugado (NCG)',                component: Slide28,  duration: 90,  section: 'Optimización',   special: null },
  { id: 29,  title: 'Motivación del método adjunto',                       component: Slide29,  duration: 90,  section: 'Optimización',   special: null },
  { id: 30,  title: 'Idea fundamental del método adjunto',                 component: Slide30,  duration: 45,  section: 'Optimización',   special: null },
  { id: 31,  title: 'Ventaja computacional del método adjunto',            component: Slide31,  duration: 60,  section: 'Optimización',   special: null },

  { id: 32, title: 'Modelo adjunto',                                       component: Slide32, duration: 60,  section: 'Estado Adjunto', special: null },
  { id: 33, title: 'Gradientes respecto a los controles',                  component: Slide33, duration: 45,  section: 'Estado Adjunto', special: null },
  { id: 34, title: 'Esquema iterativo de optimización',                    component: Slide34, duration: 23,  section: 'Estado Adjunto', special: null },
  { id: 35, title: 'Conclusiones',                                         component: Slide35, duration: 23,  section: 'Estado Adjunto', special: null },
  { id: 36, title: 'Referencias bibliográficas I',                         component: Slide36, duration: 8,   section: 'Estado Adjunto', special: null },
  { id: 37, title: 'Referencias bibliográficas II',                        component: Slide37, duration: 8,   section: 'Estado Adjunto', special: null },
];

export default slideConfig;
