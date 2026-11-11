import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Eq, Punto, Cols, Col, Titulo } from './ui.jsx';

// Condición de salida libre (docs/adjunto_sin_sumidero.pdf, §2.2) y la discretización que la hace implementable:
// fila del fantasma = ∂ₙ(u·n) = 0 (make_H_bc, modo "libre"); fila del borde = ecuación de borde de 3 puntos en el
// esquema θ (ecuacion_borde_libre en funtions/operators.py; la misma en fenicsx/salida_libre.py).
const eqBorde = String.raw`\partial_n(\mathbf u\!\cdot\!\mathbf n)=0\;\Longleftrightarrow\;
S_s\,\partial_t h-\partial_\tau\!\bigl(K_{\tau\tau}\,\partial_\tau h\bigr)=0\ \text{ en }\Gamma_{\rm out}`;
const eqFantasma = String.raw`\sum_{i,j} n_i n_j\,\partial_j\!\bigl(K_i\,\partial_i h\bigr)\Big|_{\mathbf x_g}=0`;
const eqEsp = String.raw`(L h)_i=\frac{2}{s_i^++s_i^-}\Bigl[\bar K_i^+\,\frac{h_{i+1}-h_i}{s_i^+}-\bar K_i^-\,\frac{h_i-h_{i-1}}{s_i^-}\Bigr]`;
const eqTmp = String.raw`\Bigl(\frac{S_s}{\Delta t}-\theta L\Bigr)h^{n+1}_\Gamma=\Bigl(\frac{S_s}{\Delta t}+(1-\theta)L\Bigr)h^{n}_\Gamma`;

export default function A3N03({ theme = 'dark' }) {
    return (
        <SlideLayout title="Salida libre: condición y discretización" theme={theme} justify="flex-start">
            <EqCard title="Componente normal de ∂ₙu = 0 en Γout (cierre adoptado)"><Eq math={eqBorde} s={0.9} /></EqCard>
            <Cols gap="4%">
                <Col flex={1} gap={10}>
                    <Titulo>Espacial</Titulo>
                    <EqCard title="Fila del nodo fantasma (RBF-FD): la condición"><Eq math={eqFantasma} s={0.8} /></EqCard>
                    <EqCard title="Fila del nodo de borde: diferencias de 3 puntos a lo largo de Γout"><Eq math={eqEsp} s={0.72} /></EqCard>
                    <Punto size={19}>
                        <InlineMath math="s_i^\pm" />: distancias a los vecinos del mismo tramo; <InlineMath math={String.raw`\bar K_i^\pm`} />: media de <InlineMath math={String.raw`K_{\tau\tau}`} /> entre vecinos.
                        La fila del borde ya no usa el estencil 2D: el borde no recibe información espuria del interior.
                    </Punto>
                </Col>
                <Col flex={1} gap={10}>
                    <Titulo>Temporal</Titulo>
                    <EqCard title="Esquema θ, el mismo θ del flujo"><Eq math={eqTmp} s={0.78} /></EqCard>
                    <Punto size={19}>
                        Con <InlineMath math={String.raw`h^0_\Gamma=h_0|_{\Gamma_{\rm out}}`} />, <InlineMath math="h_\Gamma" /> avanza solo:
                        no depende del interior ni de <InlineMath math="Q" /> o <InlineMath math="z_p" />, así que <InlineMath math={String.raw`\psi_h=0`} /> en Γout.
                    </Punto>
                    <Punto size={19}>
                        Extremos del tramo (esquinas): sin vecino a un lado, <InlineMath math={String.raw`\partial_t h=0`} />.
                    </Punto>
                    <Punto color="#2E7D4F" size={19}>
                        La misma ecuación discreta en los dos códigos: fila del borde en BFR y dato de Dirichlet en FEniCSx.
                    </Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
