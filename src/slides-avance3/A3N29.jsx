import React from 'react';
import VideoCampo from './VideoCampo.jsx';

// Estados adjuntos en la malla con conos, mismo grid 3 × 3 que los campos del estado.
const NOTA = 'Barrido retrógrado desde t = T.';
export const A3N29 = (p) => <VideoCampo campo="adj_C" titulo="Estado adjunto ψ_C(x,z,t) — BFR vs FEniCSx" nota={NOTA} {...p} />;
export const A3N30 = (p) => <VideoCampo campo="adj_H" titulo="Estado adjunto ψ_h(x,z,t) — BFR vs FEniCSx" nota={NOTA} {...p} />;
