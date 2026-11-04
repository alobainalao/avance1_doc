import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Tabla, Eq } from './ui.jsx';

const verde = '#4ade80';
const eqH = String.raw`\boxed{-S_s\partial_t\psi_h-\nabla\!\cdot(K\nabla\psi_h)=-\nabla\!\cdot(K\mathbf b)\;\textcolor{${verde}}{-\,S_s\,\partial_t(C\,\psi_C)}},\qquad \mathbf b=\psi_C\nabla C+\mathbf d`;
const eqD = String.raw`\mathbf d=\partial_xC\,\partial_x\psi_C\,\nabla_{\mathbf u}D_x+\partial_zC\,\partial_z\psi_C\,\nabla_{\mathbf u}D_z`;
const cols = [{ k: 'c', label: 'Cierre' }, { k: 'inout', label: 'Γin ∪ Γwall' }, { k: 'out', label: 'Γout' }];
const rows = [
    { c: '(B)', inout: '(K∇ψ_h − Kb)·n = 0', out: '(K∇ψ_h − Kb)·n = 0' },
    { c: '(A), (D)', inout: '(K∇ψ_h − Kb)·n = 0', out: 'ψ_h = 0', colors: { out: '#4ade80' } },
];

export default function A3N12({ theme = 'dark' }) {
    return (
        <SlideLayout title="Adjunto del flujo (variación respecto de h)" theme={theme} justify="flex-start">
            <EqCard title="Cuatro vías de dependencia en h: flujo, advección, dispersión, almacenamiento"><Eq math={eqH} s={0.85} /><Eq math={eqD} s={0.85} /></EqCard>
            <Cols>
                <Col flex={5}>
                    <Punto color={verde} size={20}>Fuente nueva: <InlineMath math="-S_s\partial_t(C\psi_C)" /> (por parte en <InlineMath math="t" /> con <InlineMath math="\delta h(0)=0" />, <InlineMath math="\psi_C(T)=0" />); acopla el adjunto aun con <InlineMath math="\mathbf b=0" />.</Punto>
                    <Punto color="#60a5fa" size={20}><InlineMath math="K" /> variable: <InlineMath math="\delta\mathbf u=-K\nabla\delta h" />, sin suponerla constante. Requiere <InlineMath math="D" /> diagonal para <InlineMath math="\mathbf d" />.</Punto>
                </Col>
                <Col flex={5}>
                    <Tabla cols={cols} rows={rows} size={20} />
                    <Punto color="#f87171" size={20}>Imponer además la condición de flujo en Γout sobredeterminaría el adjunto.</Punto>
                </Col>
            </Cols>
        </SlideLayout>
    );
}
