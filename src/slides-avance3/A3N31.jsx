import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Titulo, Eq } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

// Implementación de la salida libre en FEniCSx (codigo/fenicsx/salida_libre.py, clase BordeLibre).
const eqL = String.raw`(L\,h)_i=\frac{2}{s_i^++s_i^-}\left[\bar K_i^+\frac{h_{i+1}-h_i}{s_i^+}-\bar K_i^-\frac{h_i-h_{i-1}}{s_i^-}\right],\quad
\bar K_i^\pm=\tfrac12\bigl(K_{z,i}+K_{z,i\pm1}\bigr)`;
const eqPaso = String.raw`\begin{gathered}\Bigl(\tfrac{S_s}{\Delta t}-\theta L\Bigr)\,h_\Gamma^{n+1}=\Bigl(\tfrac{S_s}{\Delta t}+(1-\theta)L\Bigr)\,h_\Gamma^{n}\\
h_\Gamma^{0}=h_0|_{\Gamma_{\rm out}}\end{gathered}`;
const eqDir = String.raw`h^{n+1}=h_\Gamma^{n+1}\ \text{en }\Gamma_{\rm out},\qquad \psi_h=0\ \text{en }\Gamma_{\rm out}`;

const PASOS = [
    ['1', <>Nodos de <InlineMath math="\Gamma_{\rm out}" /> ordenados en <InlineMath math="z" />, sin las dos esquinas (pertenecen a las paredes, como en BFR).</>],
    ['2', <>Laplaciano tangencial de 3 puntos con <InlineMath math="K_{\tau\tau}=K_z" /> (<InlineMath math="\Gamma_{\rm out}" /> vertical), promediada entre vecinos; <InlineMath math="S_s=\varphi" />.</>],
    ['3', <>Se factoriza una vez (LU); en cada paso se avanza <InlineMath math="h_\Gamma" /> sin mirar el interior ni los controles.</>],
    ['4', <>Dirichlet <InlineMath math="h=h_\Gamma" /> en los grados de libertad de <InlineMath math="\Gamma_{\rm out}" /> (lifting) y se resuelve el flujo en el interior.</>],
    ['5', <>Adjunto: como <InlineMath math="h_\Gamma" /> no depende de <InlineMath math="Q" /> ni de <InlineMath math="z_p" />, <InlineMath math="\psi_h=0" /> en <InlineMath math="\Gamma_{\rm out}" />.</>],
];

export default function A3N31({ theme = 'dark' }) {
    const v = MODELOS.length ? MODELOS[0].resumen.V_L2_rel_final : null;
    return (
        <SlideLayout title="Salida libre en FEniCSx: cómo se implementa" theme={theme} justify="flex-start">
            <Cols>
                <Col flex={5}>
                    <EqCard title="Ecuación de borde discreta en Γout"><Eq math={eqL} s={0.68} /></EqCard>
                    <EqCard title="Paso θ (el mismo θ del flujo)"><Eq math={eqPaso} s={0.68} /></EqCard>
                    <EqCard title="Acople con el interior y con el adjunto"><Eq math={eqDir} s={0.8} /></EqCard>
                </Col>
                <div style={{ width: 1, background: 'rgba(0,216,255,0.20)', flexShrink: 0 }} />
                <Col flex={5} gap={8}>
                    <Titulo>Algoritmo por paso de tiempo</Titulo>
                    {PASOS.map(([n, t]) => (
                        <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <span style={{ minWidth: 34, height: 34, borderRadius: 17, background: 'rgba(0,216,255,0.18)', color: 'var(--sl-accent)',
                                           fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
                            <span style={{ color: 'var(--sl-text)', fontSize: 21, lineHeight: 1.35 }}>{t}</span>
                        </div>
                    ))}
                    <Punto color="#4ade80" size={20}>
                        Es la misma discretización que BFR (<code>bc_outlet_mode="libre"</code>): los dos códigos resuelven ahora
                        el mismo problema en Γout. Los extremos del tramo quedan con <InlineMath math="\partial_t h=0" />.
                    </Punto>
                    {v !== null && (
                        <Punto color="#60a5fa" size={20}>
                            Efecto: error L2 de <InlineMath math="|\mathbf u|" /> BFR↔FEniCSx de 0.72 (Neumann + <code>pfs</code>)
                            a {v.toFixed(3)} (ambos con salida libre, ADR a 30 d).
                        </Punto>
                    )}
                </Col>
            </Cols>
        </SlideLayout>
    );
}
