import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Eq, RefEc } from '../slides-avance3/ui.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { INFO } from './mallaConosEje.js';

// Del modelo continuo al sistema de cada paso (versión simplificada). Expresiones de la implementación que usa la
// optimización: codigo/fenicsx/adjoint.py, _flow_residual (flujo, θ = 1), _transport_residual (transporte MRMT por
// bloques, θ_C = 1) y la actualización de las inmóviles en _solve_forward; coeficientes ω_r de config/parameters.py
// (complemento de Schur con el trapecio en el intercambio). Esquema por bloques y reducción de Schur: tesis
// ChaptersR/CapII_MRMT.tex, §«Esquema por bloques: complemento de Schur» (sec:II_schur, subsec:schur_theta1) y Anexo C.
// El código no ensambla el sistema por bloques: suma 2Rω_Σ M_φ a la izquierda y 2R M_φ Σ ω_r c_im,r a la derecha.
// Grados de libertad P2 = vértices + aristas = V + (V + F − 1) para una triangulación simplemente conexa.
const miles = (n) => n.toLocaleString('en-US').replace(/,/g, '\u00A0');   // espacio que no corta la cifra
const NP2 = 2 * INFO.n_dominio + INFO.n_triangulos - 1;

const eqFlujo = String.raw`\Big(\tfrac{1}{\Delta t}M_S+K_h\Big)\mathbf h^{n+1}=\tfrac{1}{\Delta t}M_S\,\mathbf h^{n}-Q^{n+1}\,\mathbf g(z_p)+\mathbf b_{\rm in}`;
const eqBloques = String.raw`\begin{bmatrix}A_{mm}&A_{m,{\rm im}}\\A_{{\rm im},m}&A_{\rm im}\end{bmatrix}\!\begin{bmatrix}\mathbf c^{n+1}\\\mathbf c^{n+1}_{\rm im}\end{bmatrix}=\mathbf r^n
\;\xrightarrow[\;A_{\rm im}\ \text{diagonal}\;]{\text{Schur}}\;
\big(A_{mm}-A_{m,{\rm im}}A_{\rm im}^{-1}A_{{\rm im},m}\big)\,\mathbf c^{n+1}=\tilde{\mathbf r}^n`;
const eqTransporte = String.raw`\begin{aligned}
&\Big[\Big(\tfrac{R}{\Delta t}+2R\,\omega_\Sigma\Big)M_\phi+K_D^{n+1}+A_{\mathbf u}^{n+1}-S^{n+1}\Big]\mathbf c^{n+1}
=\tfrac{R}{\Delta t}M_\phi\,\mathbf c^{n}+2R\,M_\phi\sum_{r=1}^{3}\omega_r\,\mathbf c^{n}_{{\rm im},r}+\mathbf b_W^{n+1}\\[2pt]
&\mathbf c^{n+1}_{{\rm im},r}=2\kappa_r\,\mathbf c^{n+1}+(1-2\kappa_r)\,\mathbf c^{n}_{{\rm im},r},\qquad
\omega_r=\frac{\eta_rD_{{\rm eff},r}}{2\eta_rRL^2+\Delta t\,D_{{\rm eff},r}},\quad \kappa_r=\frac{\Delta t\,\omega_r}{\eta_r}
\end{aligned}`;

const pasos = [
    ['1 · Espacio', <>elementos finitos de Galerkin: <InlineMath math="h" /> en P1 ({miles(INFO.n_dominio)} nodos), <InlineMath math="C_m" /> en P2 ({miles(NP2)} incógnitas)</>],
    ['2 · Tiempo', <>Euler implícito, <InlineMath math="\Delta t=10" /> h: primero el flujo (<InlineMath math="\mathbf h^{n+1}" />, <InlineMath math="\mathbf u^{n+1}" />), luego el transporte</>],
    ['3 · Bloques', <>móvil y tres inmóviles acopladas; las inmóviles se eliminan con el complemento de Schur</>],
];

export default function A3R05({ theme = 'dark' }) {
    return (
        <SlideLayout title="Del modelo continuo al sistema de cada paso" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
                {pasos.map(([t, d], i) => (
                    <div key={i} style={{ flex: 1, borderTop: '3px solid var(--a3-agua)', paddingTop: 6 }}>
                        <p style={{ margin: '0 0 3px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--a3-agua)', fontWeight: 600 }}>{t}</p>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', lineHeight: 1.3 }}>{d}</p>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
                <EqCard title={<>Flujo: una matriz constante, factorizada una vez por simulación<span className="a3-completa"> (salida libre: Dirichlet en Γ<sub>out</sub>)</span></>}>
                    <Eq math={eqFlujo} id="sist-flujo" compacta />
                </EqCard>
                <EqCard title={<>Transporte por bloques: las inmóviles son diagonales (una EDO por incógnita) y se eliminan</>}>
                    <Eq math={eqBloques} compacta />
                    <Eq math={eqTransporte} id="sist-transporte" compacta />
                </EqCard>
                <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                    Cada paso resuelve dos sistemas de tamaño fijo: {miles(INFO.n_dominio)} para <InlineMath math="h" /> y {miles(NP2)} para{' '}
                    <InlineMath math="C_m" />, en lugar de {miles(4 * NP2)} del sistema por bloques completo; las inmóviles se recuperan después,
                    incógnita por incógnita.
                </p>
            </div>
            <Notas titulo="Discretización: matrices y detalles">
                <p>
                    Bases <InlineMath math="\{N_i\}" /> de P1 (flujo) y P2 (transporte).{' '}
                    <InlineMath math="M_S=[(S_sN_j,N_i)]" />, <InlineMath math="K_h=[(\mathbf K\nabla N_j,\nabla N_i)]" />,{' '}
                    <InlineMath math="\mathbf g=[(g_\varepsilon,N_i)]" />; <InlineMath math="\mathbf b_{\rm in}" />: flujo prescrito en Γ<sub>in</sub>.
                    En Γ<sub>out</sub> la carga se impone con la ecuación de borde de la salida libre.
                </p>
                <p>
                    <InlineMath math="M_\phi=[(\phi N_j,N_i)]" /> (masa consistente), <InlineMath math="K_D=[(D(\mathbf u)\nabla N_j,\nabla N_i)]" />,{' '}
                    <InlineMath math="A_{\mathbf u}=[(\mathbf u\cdot\nabla N_j,N_i)]" />,{' '}
                    <InlineMath math="S=[(S_s\tfrac{h^{n+1}-h^n}{\Delta t}N_j,N_i)]" /> (almacenamiento) y{' '}
                    <InlineMath math="\mathbf b_W=[(W_+,N_i)]" />. La matriz del transporte cambia en cada paso con{' '}
                    <InlineMath math="\mathbf u^{n+1}" />: se ensambla y se factoriza (LU directa) en cada paso. Tras resolver,{' '}
                    <InlineMath math="\mathbf c^{n+1}\leftarrow\max(\mathbf c^{n+1},0)" />.
                </p>
                <p>
                    <RefEc id="sist-transporte" />: los coeficientes <InlineMath math="\omega_r" /> salen de eliminar las inmóviles con el trapecio en el
                    intercambio (Cap. II); la variante que se ejecuta usa <InlineMath math="C_m" /> implícita (<InlineMath math="\theta_C=1" />). Es de orden
                    uno, y con estos parámetros <InlineMath math="1-2\kappa_1\approx-0.09" />: en la región 1 el peso de <InlineMath math="\mathbf c^n_{{\rm im},1}" /> es negativo y su recuperación puede oscilar. La elección de
                    <InlineMath math="\;\theta_C" /> sigue abierta en la tesis.
                </p>
                <p>
                    Como <InlineMath math="\lambda_r" /> y <InlineMath math="\phi_{{\rm im},r}" /> son proporcionales a <InlineMath math="\phi" />, la ecuación
                    inmóvil proyectada con Galerkin se reduce a la actualización incógnita por incógnita: por eso <InlineMath math="A_{\rm im}" /> es diagonal y
                    eliminarla no cambia el patrón de <InlineMath math="A_{mm}" />.
                </p>
            </Notas>
        </SlideLayout>
    );
}

A3R05.ecuaciones = ['sist-flujo', 'sist-transporte'];
