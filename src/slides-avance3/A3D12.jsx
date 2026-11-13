import React, { useMemo } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';

// Gradiente conjugado frente a máximo descenso sobre una cuadrática mal condicionada J(x) = ½ xᵀAx − bᵀx
// (ilustrativa, dos variables). Con búsqueda lineal exacta, CG llega en n = 2 pasos; el descenso zigzaguea.
const A = [[1.0, 1.2], [1.2, 1.8]], b = [0, 0];   // κ(A) ≈ 20
const mul = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
const dot = (u, v) => u[0] * v[0] + u[1] * v[1];
const grad = x => { const Ax = mul(A, x); return [Ax[0] - b[0], Ax[1] - b[1]]; };

function trayectorias(x0) {
    const sd = [x0]; let x = x0;
    for (let k = 0; k < 60; k++) {
        const g = grad(x); if (Math.hypot(...g) < 1e-4) break;
        const a = dot(g, g) / dot(g, mul(A, g));
        x = [x[0] - a * g[0], x[1] - a * g[1]]; sd.push(x);
    }
    const cg = [x0]; x = x0; let g = grad(x), d = [-g[0], -g[1]];
    for (let k = 0; k < 2; k++) {
        const a = -dot(g, d) / dot(d, mul(A, d));
        x = [x[0] + a * d[0], x[1] + a * d[1]]; cg.push(x);
        const gn = grad(x); const beta = Math.max(0, dot(gn, [gn[0] - g[0], gn[1] - g[1]]) / dot(g, g));
        d = [-gn[0] + beta * d[0], -gn[1] + beta * d[1]]; g = gn;
    }
    return { sd, cg };
}

function Curvas({ p }) {
    const { sd, cg } = useMemo(() => trayectorias([-3.4, 2.3]), []);
    const W = 600, H = 470, R = { x0: -4.3, x1: 1.6, y0: -1.7, y1: 2.95 };
    const sx = x => (x - R.x0) / (R.x1 - R.x0) * W, sy = y => H - (y - R.y0) / (R.y1 - R.y0) * H;
    // curvas de nivel por muestreo: anillos de puntos con J = c (marcha radial desde el mínimo)
    const xs = useMemo(() => { const det = A[0][0] * A[1][1] - A[0][1] ** 2;
        return [(A[1][1] * b[0] - A[0][1] * b[1]) / det, (A[0][0] * b[1] - A[1][0] * b[0]) / det]; }, []);
    const niveles = [0.01, 0.04, 0.1, 0.2, 0.35, 0.55, 0.8, 1.16, 1.6];
    const anillos = niveles.map(c => {
        const pts = [];
        for (let i = 0; i <= 120; i++) {
            const t = 2 * Math.PI * i / 120, u = [Math.cos(t), Math.sin(t)];
            const r = Math.sqrt(2 * (c) / dot(u, mul(A, u)));
            pts.push(`${sx(xs[0] + r * u[0])},${sy(xs[1] + r * u[1])}`);
        }
        return pts.join(' ');
    });
    const parcial = (pts, f) => {
        const n = (pts.length - 1) * f, k = Math.floor(n), r = n - k;
        const out = pts.slice(0, k + 1);
        if (k < pts.length - 1) out.push([pts[k][0] + r * (pts[k + 1][0] - pts[k][0]), pts[k][1] + r * (pts[k + 1][1] - pts[k][1])]);
        return out.map(q => `${sx(q[0])},${sy(q[1])}`).join(' ');
    };
    const fsd = tramo(p, 0.05, 1), fcg = tramo(p, 0.05, 0.4);
    const nsd = Math.min(sd.length - 1, Math.floor((sd.length - 1) * fsd));
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {anillos.map((a, i) => <polyline key={i} points={a} fill="none" stroke="#6E7F8D" strokeOpacity={0.25 + 0.04 * i} strokeWidth="1.3" />)}
            <polyline points={parcial(sd, fsd)} fill="none" stroke="#C4511F" strokeWidth="2.4" />
            {sd.slice(0, nsd + 1).map((q, i) => <circle key={i} cx={sx(q[0])} cy={sy(q[1])} r="3.5" fill="#C4511F" />)}
            <polyline points={parcial(cg, fcg)} fill="none" stroke="#0F7A85" strokeWidth="3.6" />
            {cg.slice(0, 1 + Math.floor(2 * fcg)).map((q, i) => <circle key={i} cx={sx(q[0])} cy={sy(q[1])} r="6" fill="#0F7A85" />)}
            <circle cx={sx(xs[0])} cy={sy(xs[1])} r="7" fill="none" stroke="#2E7D4F" strokeWidth="3" />
            <g style={{ fontFamily: 'var(--a3-sans)', fontSize: 17 }}>
                <text x={14} y={26} style={{ fill: '#C4511F' }}>máximo descenso: {nsd} pasos{fsd >= 1 && sd.length > 60 ? ' y sigue' : ''}</text>
                <text x={14} y={50} style={{ fill: '#0F7A85' }}>gradiente conjugado: {Math.floor(2 * fcg)} pasos</text>
            </g>
        </svg>
    );
}

const eqPR = String.raw`\begin{aligned}
&\mathbf d_0=-\nabla\hat J(\mathbf u_0)\\
&\mathbf u_{k+1}=P_{\mathcal U_{ad}}\big(\mathbf u_k+\alpha_k\mathbf d_k\big),\quad \alpha_k:\ \text{Armijo}\\
&\beta_k^{\rm PR+}=\max\Big\{0,\ \frac{\nabla\hat J_{k+1}^{\top}\big(\nabla\hat J_{k+1}-\nabla\hat J_k\big)}{\|\nabla\hat J_k\|^2}\Big\}\\
&\mathbf d_{k+1}=-\nabla\hat J(\mathbf u_{k+1})+\beta_k^{\rm PR+}\,\mathbf d_k
\end{aligned}`;

export default function A3D12({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6500, 500);
    return (
        <SlideLayout title="Gradiente conjugado: usar la dirección anterior" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 36, alignItems: 'center' }}>
                <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}><Curvas p={p} /></div>
                <div>
                    <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>Polak–Ribière⁺ proyectado</p>
                    <Eq math={eqPR} id="cg" compacta />
                    <p style={txt}>
                        Cada iteración pide un gradiente, es decir, una simulación directa y una adjunta. La dirección mezcla el
                        gradiente nuevo con la anterior y evita el zigzag del máximo descenso en los valles alargados.
                    </p>
                    <p style={nota}>
                        Manzoni et al. (2021), § 6.3 y Alg. 6.1; Nocedal y Wright (2006), cap. 5. Figura: cuadrática ilustrativa
                        con búsqueda lineal exacta, donde CG termina en 2 pasos.
                    </p>
                </div>
            </div>
        </SlideLayout>
    );
}

A3D12.ecuaciones = ['cg'];

const txt = { margin: '8px 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
