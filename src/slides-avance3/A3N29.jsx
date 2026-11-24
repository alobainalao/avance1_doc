import React from 'react';
import VideoCampo from './VideoCampo.jsx';
import { usePublica } from './version.jsx';

// Estados adjuntos en la malla con conos, mismo grid 3 × 3 que los campos del estado.
// Cada nota tiene su versión corta (_PUB) para la versión pública.
const NOTA_C = 'Se resuelve hacia atrás desde t = T; escala log común; se dibuja −ψ_C (ψ_C < 0). −ψ_C marca de dónde llega al pozo, '
    + 'antes de T, el nitrato que cuenta en J_m: la zona de captura. RBF-FD es más ruidoso y su ψ_C cambia 25–36 % al cambiar la malla; '
    + 'el de elementos finitos, 3–10 %.';
const NOTA_C_PUB = 'Escala log común. −ψ_C marca la zona de captura del pozo. Al cambiar la malla, ψ_C cambia 25–36 % en RBF-FD '
    + 'y 3–10 % en elementos finitos.';
const NOTA_H = 'Se resuelve hacia atrás desde t = T; una sola escala para los dos códigos. ψ_h da el gradiente respecto al caudal '
    + '(∫ g_ε ψ_h dΩ, lámina 21); el ruido de RBF-FD cerca de la superficie viene de la colocación en forma fuerte.';
const NOTA_H_PUB = 'Una sola escala para los dos códigos. ψ_h da el gradiente respecto al caudal (lámina 21).';
export const A3N29 = (p) => <VideoCampo campo="adj_C" titulo="Estado adjunto −ψ_C(x,z,t) — RBF-FD frente a elementos finitos"
    nota={usePublica() ? NOTA_C_PUB : NOTA_C} {...p} />;
export const A3N30 = (p) => <VideoCampo campo="adj_H" titulo="Estado adjunto ψ_h(x,z,t) — RBF-FD frente a elementos finitos"
    nota={usePublica() ? NOTA_H_PUB : NOTA_H} {...p} />;

// Adjuntos de las tres regiones inmóviles (solo MRMT; la fila ADR queda vacía).
const NOTA_IM = 'Se resuelve hacia atrás desde t = T; escala log común; se dibuja −ψ_im,r. Las tres regiones dan campos casi iguales '
    + 'a −ψ_C porque el intercambio es rápido (τ_r ≤ 14 h); las regiones 2 y 3 quedan en respaldo.';
const NOTA_IM_PUB = 'Escala log común. Las tres regiones dan campos casi iguales a −ψ_C: el intercambio es rápido (τ_r ≤ 14 h).';
const tasas = ['rápida', 'intermedia', 'lenta'];
const adjIm = (r) => function AdjuntoInmovil(p) {
    return <VideoCampo campo={`adj_Ci${r}`} titulo={`Adjunto de la región inmóvil ${r + 1} (${tasas[r]}) −ψ_im,${r + 1}`}
        nota={usePublica() ? NOTA_IM_PUB : NOTA_IM} {...p} />;
};
export const A3N35 = adjIm(0);
export const A3N36 = adjIm(1);
export const A3N37 = adjIm(2);
