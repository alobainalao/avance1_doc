import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Tabla, Punto, Cols, Col, Titulo } from './ui.jsx';

const cols = [
    { k: 'g', label: '' }, { k: 'flujo', label: 'Flujo h' }, { k: 'tr', label: 'Transporte C' },
];
const rows = [
    { g: 'Γin', flujo: '(K∇h)·n = f_in ≥ 0  (u·n = −f_in)', tr: '(D∇C)·n = 0' },
    { g: 'Γwall', flujo: '(K∇h)·n = 0', tr: '(D∇C)·n = 0' },
    { g: 'Γout', flujo: 'cierre (D): ∂ₙ(u·n) = 0', tr: '(D∇C)·n = 0' },
];

export default function A3N09({ theme = 'dark' }) {
    return (
        <SlideLayout title="Condiciones de frontera e hipótesis" theme={theme} justify="flex-start">
            <Tabla cols={cols} rows={rows} size={22} />
            <Cols>
                <Col flex={5}>
                    <Titulo>Hipótesis del análisis</Titulo>
                    <Punto size={20}>H1–H2: dominio lipschitziano; <InlineMath math="K" /> simétrica definida positiva <b>variable</b>; coeficientes constantes en <InlineMath math="t" />.</Punto>
                    <Punto size={20}>H3: <InlineMath math="D=\mathrm{diag}(D_x(\mathbf u),D_z(\mathbf u))" />, de clase <InlineMath math="C^1" /> en <InlineMath math="\mathbf u\neq0" />.</Punto>
                    <Punto size={20}>H4–H5: regla del producto casi en todo punto; <InlineMath math="\partial_t h\in L^\infty" /> (Gårding con reacción de signo indefinido).</Punto>
                    <Punto size={20}>H6–H7: datos independientes de los controles, <InlineMath math="z_p<z_0" />, núcleos lejos de Γout; <InlineMath math="\mathbf b\in L^2" /> para la forma fuerte del adjunto.</Punto>
                </Col>
                <Col flex={5}>
                    <Titulo>Decisiones y límites del modelo</Titulo>
                    <Punto color="#fb923c" size={20}>En Γin entra agua que arrastra la concentración local; no se prescribe <InlineMath math="C_{\rm in}" /> (decisión pendiente).</Punto>
                    <Punto color="#fb923c" size={20}><InlineMath math="\phi" /> constante con almacenamiento elástico y <InlineMath math="S_s=\phi" /> numérico (0.03–0.95 m⁻¹): pendiente confirmar.</Punto>
                    <Punto color="#4ade80" size={20}>Balance global de soluto: el soluto solo cruza <InlineMath math="\partial\Omega" /> por advección y sale por <InlineMath math="fC" />.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
