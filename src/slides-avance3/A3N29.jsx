import React from 'react';
import VideoCampo from './VideoCampo.jsx';

// Estados adjuntos en la malla con conos, mismo grid 3 × 3 que los campos del estado.
const NOTA_C = 'Se resuelve hacia atrás desde t = T; escala log común; se dibuja −ψ_C (ψ_C < 0). −ψ_C marca de dónde llega al pozo, '
    + 'antes de T, el nitrato que cuenta en J_m: la zona de captura. RBF-FD es más ruidoso y su ψ_C cambia 25–36 % al cambiar la malla; '
    + 'el de elementos finitos, 3–10 %.';
const NOTA_H = 'Se resuelve hacia atrás desde t = T; una sola escala para los dos códigos. ψ_h da el gradiente respecto al caudal '
    + '(∫ g_ε ψ_h dΩ, lámina 21); el ruido de RBF-FD cerca de la superficie viene de la colocación en forma fuerte.';
export const A3N29 = (p) => <VideoCampo campo="adj_C" titulo="Estado adjunto −ψ_C(x,z,t) — RBF-FD frente a elementos finitos" nota={NOTA_C} {...p} />;
export const A3N30 = (p) => <VideoCampo campo="adj_H" titulo="Estado adjunto ψ_h(x,z,t) — RBF-FD frente a elementos finitos" nota={NOTA_H} {...p} />;

// Adjuntos de las tres regiones inmóviles (solo MRMT; la fila ADR queda vacía).
const NOTA_IM = 'Se resuelve hacia atrás desde t = T; escala log común; se dibuja −ψ_im,r. Las tres regiones dan campos casi iguales '
    + 'a −ψ_C porque el intercambio es rápido (τ_r ≤ 14 h); las regiones 2 y 3 quedan en respaldo.';
const tasas = ['rápida', 'intermedia', 'lenta'];
const adjIm = (r) => (p) => <VideoCampo campo={`adj_Ci${r}`} titulo={`Adjunto de la región inmóvil ${r + 1} (${tasas[r]}) −ψ_im,${r + 1}`} nota={NOTA_IM} {...p} />;
export const A3N35 = adjIm(0);
export const A3N36 = adjIm(1);
export const A3N37 = adjIm(2);
