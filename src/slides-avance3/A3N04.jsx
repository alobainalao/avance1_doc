import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

// Adjunto del transporte (docs/adjunto_sin_sumidero.pdf, §4.1). Reemplaza la versión con χ(Q).
const verde = '#2E7D4F', rojo = '#C4511F';
const eqAdjC = String.raw`\boxed{-\phi R\,\partial_t\psi_C-\nabla\!\cdot(D\nabla\psi_C)-\nabla\!\cdot(\mathbf u\,\psi_C)+c_0\psi_C\;\textcolor{${verde}}{-\,S_s\partial_t h\,\psi_C}=-2\gamma\,g_\varepsilon\,C}`;
const eqBC = String.raw`\psi_C(T)=0,\qquad(D\nabla\psi_C+\mathbf u\,\psi_C)\cdot\mathbf n=0\ \text{ en }\partial\Omega`;
const eqNC = String.raw`-\phi R\,\partial_t\psi_C-\nabla\!\cdot(D\nabla\psi_C)-\mathbf u\!\cdot\!\nabla\psi_C+c_0\psi_C\;\textcolor{${rojo}}{+\,Q\,\varrho\,\psi_C}=-2\gamma\,g_\varepsilon\,C`;

export default function A3N04({ theme = 'dark' }) {
    return (
        <SlideLayout title="Adjunto del transporte (ADR)" theme={theme} justify="flex-start">
            <EqCard title="Variación respecto de C  →  problema retrógrado"><Eq math={eqAdjC} id='adj-C' /><Eq math={eqBC} id='adj-C-bc' /></EqCard>
            <EqCard title="Forma no conservativa: el almacenamiento se cancela y aparece el pozo"><Eq math={eqNC} id='adj-C-nc' /></EqCard>
            <Cols>
                <Col>
                    <Punto color="#0F7A85" size={20}>Por partes: <InlineMath math="\oint\eta(D\nabla\psi+\mathbf u\psi)\!\cdot\!\mathbf n" />, condición natural (sin Dirichlet en el transporte).</Punto>
                </Col>
                <Col>
                    <Punto color="#0F7A85" size={20}>Paredes: <InlineMath math="(D\nabla\psi)\!\cdot\!\mathbf n=0" />. Entrada: <InlineMath math="(D\nabla\psi)\!\cdot\!\mathbf n=f_{\rm in}\psi" />.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}

A3N04.ecuaciones = ['adj-C', 'adj-C-bc', 'adj-C-nc'];
