import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';

// Por qué la optimización usa región de confianza con puntos interiores (tesis, Cap. III §algoritmo de optimización;
// Nocedal y Wright 2006, caps. 4 y 19): la proyección sobre U_ad no es explícita cuando el tanque acopla los pasos.
const eqCaja = String.raw`P_{[a,b]}(\mathbf v)_i=\min\{b_i,\max\{a_i,v_i\}\}`;
const eqTanque = String.raw`P_{\mathcal U_{ad}}(\mathbf v)=\arg\min_{\mathbf w}\ \|\mathbf w-\mathbf v\|^2\ \ \text{s.a.}\ \ 0\le S_0+V_s\Delta t\,\mathbf T\mathbf w-\mathbf s_d\le S_{\max}`;
const eqBarrera = String.raw`\min_{\mathbf u,\ \mathbf s>0}\ \hat J(\mathbf u)-\mu\sum_i\log s_i\quad\text{s.a.}\quad \mathbf c(\mathbf u)-\mathbf s=0`;

const pasos = [
    ['Barrera', 'las desigualdades pasan a holguras s > 0 penalizadas con −μ log s; μ → 0'],
    ['Modelo cuadrático', 'gradiente adjunto + Hessiana BFGS armada con gradientes sucesivos'],
    ['Región de confianza', 'el paso se busca en ‖p‖ ≤ Δ; Δ crece o se reduce según la predicción'],
    ['Multiplicadores', 'se actualizan en cada iteración; al final cumplen KKT'],
];

export default function A3D13({ theme = 'dark' }) {
    return (
        <SlideLayout title="Con el tanque, proyectar deja de ser trivial" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
                <div style={{ ...blq, borderLeftColor: 'var(--a3-valido)' }}>
                    <p style={eti}>Solo cotas: proyectar es recortar cada componente</p>
                    <Eq math={eqCaja} compacta />
                </div>
                <div style={{ ...blq, borderLeftColor: 'var(--a3-pluma)' }}>
                    <p style={eti}>Con el tanque: la proyección es un problema cuadrático en cada paso</p>
                    <Eq math={eqTanque} compacta />
                </div>
            </div>
            <p style={{ margin: '14px 0 6px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                Región de confianza con puntos interiores (trust-constr)
            </p>
            <Eq math={eqBarrera} id="barrera" compacta />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 10 }}>
                {pasos.map(([t, d], i) => (
                    <div key={t} style={{ borderTop: '2px solid var(--a3-agua)', paddingTop: 8 }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', fontWeight: 600 }}>{i + 1}. {t}</p>
                        <p style={{ margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>{d}</p>
                    </div>
                ))}
            </div>
            <p style={{ margin: '16px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Lo que no cambia: cada iteración pide <InlineMath math="\hat J" /> y <InlineMath math="\nabla\hat J" />, es decir, una
                simulación directa y una adjunta. Gradiente conjugado y cuasi-Newton usan la misma información; el cuasi-Newton además acumula curvatura,
                y en los casos de prueba del libro (Graetz, pozos transitorios) L-BFGS-B resultó entre 1.8 y 7 veces más barato que PR⁺.
            </p>
        </SlideLayout>
    );
}

A3D13.ecuaciones = ['barrera'];

const blq = { borderLeft: '3px solid var(--a3-agua)', padding: '2px 0 2px 18px' };
const eti = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' };
