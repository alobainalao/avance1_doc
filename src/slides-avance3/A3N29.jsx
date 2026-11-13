import React from 'react';
import VideoCampo from './VideoCampo.jsx';

// Estados adjuntos en la malla con conos, mismo grid 3 × 3 que los campos del estado.
const NOTA_C = 'Retrógrado desde t = T; escala log común; se dibuja −ψ_C (ψ_C < 0).';
const NOTA_H = 'Retrógrado desde t = T; una sola escala para los dos códigos.';
export const A3N29 = (p) => <VideoCampo campo="adj_C" titulo="Estado adjunto −ψ_C(x,z,t) — BFR vs FEniCSx" nota={NOTA_C} {...p} />;
export const A3N30 = (p) => <VideoCampo campo="adj_H" titulo="Estado adjunto ψ_h(x,z,t) — BFR vs FEniCSx" nota={NOTA_H} {...p} />;

// Adjuntos de las tres regiones inmóviles (solo MRMT; la fila ADR queda vacía).
const NOTA_IM = 'Retrógrado desde t = T; escala log común; se dibuja −ψ_im,r.';
const tasas = ['rápida', 'intermedia', 'lenta'];
const adjIm = (r) => (p) => <VideoCampo campo={`adj_Ci${r}`} titulo={`Adjunto de la región inmóvil ${r + 1} (${tasas[r]}) −ψ_im,${r + 1}`} nota={NOTA_IM} {...p} />;
export const A3N35 = adjIm(0);
export const A3N36 = adjIm(1);
export const A3N37 = adjIm(2);
