import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from './ui.jsx';

// Por qué la optimización usa región de confianza con puntos interiores (tesis, Cap. III §algoritmo de optimización;
// Nocedal y Wright 2006, caps. 4 y 19): la proyección sobre U_ad no es explícita cuando el tanque acopla los pasos.
const eqCaja = String.raw`P(\mathbf v)_n=\min\{\overline Q_n,\ \max\{0,\ v_n\}\}`;
const eqTanque = String.raw`\begin{aligned}P_{\mathcal U_{ad}}(\mathbf v)&=\arg\min_{\mathbf w}\ \|\mathbf w-\mathbf v\|^2\\
\text{s.a.}\quad 0&\le S_n(\mathbf w)\le S_{\max},\quad n=1,\dots,72\end{aligned}`;
const eqBarrera = String.raw`\min_{u,\ \mathbf s>0}\ \hat J(u)-\mu\sum_i\log s_i\quad\text{s.a.}\quad \mathbf c(u)-\mathbf s=0`;

const pasos = [
    ['Barrera', <>cada desigualdad <InlineMath math="c_i(u)\ge0" /> se escribe <InlineMath math="c_i(u)=s_i" /> con
        holgura <InlineMath math="s_i>0" />; <InlineMath math="-\mu\log s_i" /> mantiene positivas las holguras y{' '}
        <InlineMath math="\mu\to0" /> lleva al óptimo. Los iterados pueden violar las restricciones mientras no converge</>],
    ['Modelo cuadrático', <>cerca del iterado, <InlineMath math="\hat J" /> se aproxima con el gradiente adjunto y una Hessiana BFGS
        armada con los gradientes de las iteraciones anteriores</>],
    ['Región de confianza', <>el paso <InlineMath math="\mathbf p" /> se busca solo donde el modelo es fiable,{' '}
        <InlineMath math="\|\mathbf p\|\le\Delta" />: si <InlineMath math="\hat J" /> baja lo previsto, <InlineMath math="\Delta" /> crece;
        si no, el paso se rechaza y <InlineMath math="\Delta" /> se reduce</>],
    ['Paro', <>cuando la medida de criticidad <InlineMath math="\chi<10^{-4}" /> (siguiente lámina)</>],
];

export default function A3D13({ theme = 'dark' }) {
    return (
        <SlideLayout title="Con el tanque, proyectar deja de ser trivial" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: 36, alignItems: 'start' }}>
                <div style={{ ...blq, borderLeftColor: 'var(--a3-valido)' }}>
                    <p style={eti}>Solo cotas <InlineMath math="0\le Q_n\le\overline Q_n" />: proyectar es recortar cada componente por separado</p>
                    <Eq math={eqCaja} compacta />
                </div>
                <div style={{ ...blq, borderLeftColor: 'var(--a3-pluma)' }}>
                    <p style={eti}>
                        Con el tanque, el nivel <InlineMath math="S_n(\mathbf w)=S_0+V_s\Delta t\sum_{k\le n}w_k-\sum_{k\le n}d_k" /> depende
                        de todos los caudales anteriores: recortar un <InlineMath math="Q_n" /> mueve el tanque en los pasos siguientes, y
                        proyectar es un problema cuadrático con 144 restricciones acopladas
                    </p>
                    <Eq math={eqTanque} compacta />
                </div>
            </div>
            <p style={{ margin: '14px 0 2px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                Por eso: región de confianza con puntos interiores (trust-constr), sin proyectar
            </p>
            <p style={{ ...eti, margin: '0 0 2px' }}>
                Implementación: <code>scipy.optimize.minimize(method="trust-constr")</code> de SciPy 1.17 <Cita k="virtanen2020scipy" />,
                que sigue el algoritmo de <Cita k="byrd1999interior" />; véase también <Cita k="Nocedal2006" p="caps. 4 y 19" />.
            </p>
            <Eq math={eqBarrera} id="barrera" compacta />
            <p style={{ ...eti, margin: '-4px 0 0', textAlign: 'center' }}>
                <InlineMath math="\mathbf c(u)\ge0" />: todas las restricciones del conjunto admisible (cotas de{' '}
                <InlineMath math="Q_n" /> y <InlineMath math="z_p" />, tanque y ciclo de la bomba), que entran en cada subproblema
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 12 }}>
                {pasos.map(([t, d], i) => (
                    <div key={t} style={{ borderTop: '2px solid var(--a3-agua)', paddingTop: 8 }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', fontWeight: 600 }}>{i + 1}. {t}</p>
                        <p style={{ margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>{d}</p>
                    </div>
                ))}
            </div>
            <p style={{ margin: '16px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Cada iteración cuesta lo mismo que con gradiente conjugado: una resolución directa (<InlineMath math="\hat J" />) y una
                adjunta (<InlineMath math="\nabla\hat J" />), más una directa por cada paso rechazado. El cuasi-Newton además aprovecha la
                curvatura: en los casos de prueba del libro (Graetz, pozos transitorios), L-BFGS-B resultó entre 1.8 y 7 veces más barato que PR⁺.
            </p>
        </SlideLayout>
    );
}

A3D13.ecuaciones = ['barrera'];

const blq = { borderLeft: '3px solid var(--a3-agua)', padding: '2px 0 2px 18px' };
const eti = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)', lineHeight: 1.4 };
