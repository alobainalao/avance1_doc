import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Titulo, Eq } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

// Implementación de la salida libre en FEniCSx (codigo/fenicsx/salida_libre.py, clase BordeLibre).
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
                    <EqCard title="Acople con el interior y con el adjunto"><Eq math={eqDir} s={0.8} /></EqCard>
                    <Punto size={20}>
                        <InlineMath math="h_\Gamma" /> se calcula con la ecuación de borde de 3 puntos y el esquema θ de la diapositiva
                        anterior (clase <code>BordeLibre</code>); FEniCSx solo la usa como dato de Dirichlet.
                    </Punto>
                </Col>
                <div style={{ width: 1, background: 'var(--a3-filete, #C9D3DB)', flexShrink: 0 }} />
                <Col flex={5} gap={8}>
                    <Titulo>Algoritmo por paso de tiempo</Titulo>
                    {PASOS.map(([n, t]) => (
                        <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <span style={{ minWidth: 34, height: 34, borderRadius: 17, background: 'rgba(0,216,255,0.18)', color: 'var(--sl-accent)',
                                           fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
                            <span style={{ color: 'var(--sl-text)', fontSize: 21, lineHeight: 1.35 }}>{t}</span>
                        </div>
                    ))}
                    <Punto color="#2E7D4F" size={20}>
                        Es la misma discretización que BFR (<code>bc_outlet_mode="libre"</code>): los dos códigos resuelven ahora
                        el mismo problema en Γout. Los extremos del tramo quedan con <InlineMath math="\partial_t h=0" />.
                    </Punto>
                    {v !== null && (
                        <Punto color="#0F7A85" size={20}>
                            Con la salida libre en los dos códigos, error L2 de <InlineMath math="|\mathbf u|" /> BFR↔FEniCSx = {v.toFixed(3)} (ADR, 30 d).
                        </Punto>
                    )}
                </Col>
            </Cols>
        </SlideLayout>
    );
}
