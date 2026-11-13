import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';

// Sistema adjunto del modelo MRMT (tesis, Cap. III: eq:adjunto_transporte, eq:adjunto_inmovil, eq:adjunto_flujo,
// eq:bcs_psiC, eq:bcs_psih, eq:condicion_terminal). ADR: sin las regiones inmóviles y con λ_d φR ψ_C.
const eqC = String.raw`-\phi R\,\partial_t\psi_C-\nabla\!\cdot(\mathbf D\nabla\psi_C)-\nabla\!\cdot(\mathbf u\,\psi_C)-S_s\partial_t h\,\psi_C
+\sum_r\lambda_r(\psi_C-\psi_{\mathrm{im},r})=-2\gamma\,g_\varepsilon\,C_m`;
const eqIm = String.raw`\phi_{\mathrm{im},r}R\,\partial_t\psi_{\mathrm{im},r}=\lambda_r\,(\psi_{\mathrm{im},r}-\psi_C),\qquad r=1,2,3`;
const eqH = String.raw`-S_s\,\partial_t\psi_h-\nabla\!\cdot(\mathbf K\nabla\psi_h)=-\nabla\!\cdot(\mathbf K\,\mathbf b)-S_s\,\partial_t(C_m\psi_C),
\qquad \mathbf b=\psi_C\nabla C_m+\mathbf d`;
const eqBC = String.raw`\begin{aligned}&\boldsymbol\psi(\cdot,T)=0,\qquad (\mathbf D\nabla\psi_C+\mathbf u\,\psi_C)\cdot\mathbf n=0\ \text{en}\ \partial\Omega,\\
&\psi_h=0\ \text{en}\ \Gamma_{\rm out},\qquad (\mathbf K\nabla\psi_h-\mathbf K\mathbf b)\cdot\mathbf n=0\ \text{en}\ \Gamma_{\rm in}\cup\Gamma_{\rm wall}\end{aligned}`;

const bloques = [
    { t: 'Transporte: advección invertida, fuente en el pozo', m: eqC, id: 'adj-C' },
    { t: 'Regiones inmóviles: una EDO por nodo y región', m: eqIm, id: 'adj-im' },
    { t: 'Flujo: forzado por el transporte a través de la velocidad', m: eqH, id: 'adj-h' },
    { t: 'Condiciones terminales y de frontera', m: eqBC, id: 'adj-bc' },
];

export default function A3D09({ theme = 'dark' }) {
    return (
        <SlideLayout title="El sistema adjunto se resuelve hacia atrás" theme={theme} justify="flex-start">
            {bloques.map(b => (
                <div key={b.id} style={{ borderLeft: '3px solid var(--a3-agua)', padding: '2px 0 2px 18px', margin: '5px 0' }}>
                    <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>{b.t}</p>
                    <Eq math={b.m} id={b.id} compacta />
                </div>
            ))}
            <p style={{ margin: '10px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                El orden se invierte: <InlineMath math="\psi_C" /> y <InlineMath math="\psi_{\mathrm{im},r}" /> primero (necesitan{' '}
                <InlineMath math="C_m" />), después <InlineMath math="\psi_h" />. El término <InlineMath math="\mathbf d" /> viene de la
                dependencia de la dispersión <InlineMath math="\mathbf D(\mathbf u)" /> en la velocidad. Con la salida libre,{' '}
                <InlineMath math="h|_{\Gamma_{\rm out}}" /> no depende del control y el adjunto del flujo recibe una sola condición.
            </p>
        </SlideLayout>
    );
}

A3D09.ecuaciones = ['adj-C', 'adj-im', 'adj-h', 'adj-bc'];
