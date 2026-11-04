import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Cols, Col, Eq } from './ui.jsx';

const eqADR = String.raw`(\mathcal P^n)^{\!\top}\psi_C^n=M^n\Bigl[(\mathcal R^n)^{\!\top}\psi_C^{n+1}-\nabla j_n(\mathbf C^n)\Bigr],\quad \psi_C^{N_t+1}=0`;
const eqBlk = String.raw`\begin{aligned}\psi_r^n&=(1-2\kappa_r)\psi_r^{n+1}+\mathcal Q_r\psi_C^{n+1}\\
(\mathcal P^n)^{\!\top}\psi_C^n&=M^n\Bigl[(\mathcal R^n)^{\!\top}\psi_C^{n+1}+\textstyle\sum_r\kappa_r(\psi_r^n+\psi_r^{n+1})-\nabla j_n\Bigr]\end{aligned}`;
const eqSemi = String.raw`\begin{aligned}\mu_{N_r}&=M^{n+1}[(\mathcal R_A^{n+1})^{\!\top}\psi_C^{n+2}-\nabla j_{n+1}],\quad \mu_{r-1}=(1-a_r)\mu_r+(1-e_r)\psi_r^{n+1}\\
(\mathcal P_A^{n+1})^{\!\top}\psi_C^{n+1}&=\mu_0,\qquad \psi_r^n=e_r\psi_r^{n+1}+a_r\mu_r\end{aligned}`;

export default function A3N15({ theme = 'dark' }) {
    return (
        <SlideLayout title="Adjunto discreto exacto por variante (transporte)" theme={theme} justify="flex-start">
            <EqCard title="ADR"><BlockMath math={eqADR} /></EqCard>
            <EqCard title="MRMT por bloque (Schur)"><Eq math={eqBlk} s={0.8} /></EqCard>
            <EqCard title="MRMT semi-analítico (splitting al revés)"><Eq math={eqSemi} s={0.8} /></EqCard>
            <Punto color="#a78bfa" size={20}>
                <InlineMath math="M^n" />: máscara del recorte <InlineMath math="C\ge0" /> (la ecuación se evalúa sin recortar; <InlineMath math="j_n" /> y el paso siguiente usan la solución recortada).
                Derivado del Lagrangiano discreto <InlineMath math="\mathcal L_h=J_h+\sum(\psi^{n+1})^{\!\top}r^{n+1}" />, no de las ecuaciones continuas.
            </Punto>
        </SlideLayout>
    );
}
