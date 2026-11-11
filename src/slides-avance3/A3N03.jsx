import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Eq, Punto, Col } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

// Salida libre en una diapositiva (docs/adjunto_sin_sumidero.pdf, §2.2): formulación, discretización espacial
// (ecuacion_borde_libre en funtions/operators.py; la misma en fenicsx/salida_libre.py, clase BordeLibre) y temporal,
// y la consecuencia: h_out^{n+1} es una función lineal de h_out^n que no depende del interior ni de los controles.
const azul = '#0F7A85';
const eqForm = String.raw`\partial_n(\mathbf u\!\cdot\!\mathbf n)=0\;\Longleftrightarrow\;
S_s\,\partial_t h-\partial_\tau\!\bigl(K_{\tau\tau}\,\partial_\tau h\bigr)=0\ \text{ en }\Gamma_{\rm out},\qquad h(0)=h_0|_{\Gamma_{\rm out}}`;
const eqEsp = String.raw`(L h)_i=\frac{2}{s_i^++s_i^-}\Bigl[\bar K_i^+\,\frac{h_{i+1}-h_i}{s_i^+}-\bar K_i^-\,\frac{h_i-h_{i-1}}{s_i^-}\Bigr]`;
const eqTmp = String.raw`\Bigl(\tfrac{S_s}{\Delta t}I-\theta L\Bigr)h^{n+1}_{\rm out}=\Bigl(\tfrac{S_s}{\Delta t}I+(1-\theta)L\Bigr)h^{n}_{\rm out}`;
const eqMapa = String.raw`\textcolor{${azul}}{h^{n+1}_{\rm out}=M\,h^{n}_{\rm out}},\qquad
M=\Bigl(\tfrac{S_s}{\Delta t}I-\theta L\Bigr)^{-1}\Bigl(\tfrac{S_s}{\Delta t}I+(1-\theta)L\Bigr)
\quad\Longrightarrow\quad h^{n}_{\rm out}=M^{n}\,h^{0}_{\rm out}`;

export default function A3N03({ theme = 'dark' }) {
    const v = MODELOS.length ? MODELOS[0].resumen.V_L2_rel_final : null;
    return (
        <SlideLayout title="Salida libre: h_out avanza solo, paso a paso" theme={theme} justify="flex-start">
            <EqCard title="Formulación: componente normal de ∂ₙu = 0 en Γout (cierre adoptado)"><Eq math={eqForm} s={0.84} /></EqCard>
            <div style={{ display: 'flex', gap: '2.5%', alignItems: 'stretch' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <EqCard title="Discretización espacial: 3 puntos a lo largo de Γout"><Eq math={eqEsp} s={0.66} /></EqCard>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <EqCard title="Discretización temporal: esquema θ (el mismo θ del flujo)"><Eq math={eqTmp} s={0.7} /></EqCard>
                </div>
            </div>
            <EqCard title="Resultado: h_out en el paso n+1 es función de h_out en el paso n"><Eq math={eqMapa} s={0.84} /></EqCard>
            <Col gap={8}>
                <Punto color={azul} size={19}>
                    <InlineMath math="M" /> solo depende de la geometría de <InlineMath math={String.raw`\Gamma_{\rm out}`} />{' '}
                    (<InlineMath math="s_i^\pm" />), de <InlineMath math={String.raw`K_{\tau\tau}`} />, <InlineMath math="S_s" />,{' '}
                    <InlineMath math={String.raw`\Delta t`} /> y <InlineMath math={String.raw`\theta`} />: no del interior ni de{' '}
                    <InlineMath math="Q" /> o <InlineMath math="z_p" />. Cada paso <InlineMath math={String.raw`h^{n+1}_{\rm out}`} /> es un
                    dato de Dirichlet ya conocido, y por eso <InlineMath math={String.raw`\psi_h=0`} /> en Γout.
                </Punto>
                <Punto size={19}>
                    Implementación: en BFR la fila del nodo fantasma impone <InlineMath math={String.raw`\partial_n(\mathbf u\cdot\mathbf n)=0`} /> y
                    la del nodo de borde es la ecuación temporal; en FEniCSx se factoriza <InlineMath math={String.raw`\tfrac{S_s}{\Delta t}I-\theta L`} /> una
                    vez y se impone <InlineMath math={String.raw`h=h^{n+1}_{\rm out}`} /> como Dirichlet. Las dos esquinas quedan con{' '}
                    <InlineMath math={String.raw`\partial_t h=0`} />.
                </Punto>
                <Punto color="#2E7D4F" size={19}>
                    La misma ecuación discreta en los dos códigos{v !== null ? <>: diferencia L2 de <InlineMath math={String.raw`|\mathbf u|`} /> BFR↔FEniCSx = {v.toFixed(3)} (ADR, 30 d)</> : null}.
                </Punto>
            </Col>
        </SlideLayout>
    );
}
