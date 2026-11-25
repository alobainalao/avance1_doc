import React, { useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { usePublica, Notas } from './version.jsx';

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
    const pub = usePublica();
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {anillos.map((a, i) => <polyline key={i} points={a} fill="none" stroke="var(--a3-estrato)" strokeOpacity={0.25 + 0.04 * i} strokeWidth="1.3" />)}
            <polyline points={parcial(sd, fsd)} fill="none" stroke="var(--a3-pluma)" strokeWidth="2.4" />
            {sd.slice(0, nsd + 1).map((q, i) => <circle key={i} cx={sx(q[0])} cy={sy(q[1])} r="3.5" fill="var(--a3-pluma)" />)}
            <polyline points={parcial(cg, fcg)} fill="none" stroke="var(--a3-agua)" strokeWidth="3.6" />
            {cg.slice(0, 1 + Math.floor(2 * fcg)).map((q, i) => <circle key={i} cx={sx(q[0])} cy={sy(q[1])} r="6" fill="var(--a3-agua)" />)}
            <circle cx={sx(xs[0])} cy={sy(xs[1])} r="7" fill="none" stroke="var(--a3-valido)" strokeWidth="3" />
            <g style={{ fontFamily: 'var(--a3-sans)', fontSize: pub ? 20 : 17 }}>
                <text x={14} y={26} style={{ fill: 'var(--a3-pluma)' }}>máximo descenso: {nsd} pasos{fsd >= 1 && sd.length > 60 ? ' y sigue' : ''}</text>
                <text x={14} y={50} style={{ fill: 'var(--a3-agua)' }}>gradiente conjugado: {Math.floor(2 * fcg)} pasos</text>
            </g>
        </svg>
    );
}

const eqPR = String.raw`\begin{aligned}
&\mathbf d_0=-\nabla\hat J(u_0)\\
&u_{k+1}=P_{\mathcal U_{ad}}\big(u_k+\rho_k\mathbf d_k\big),\quad \rho_k:\ \text{búsqueda lineal (Wolfe)}\\
&\vartheta_k=\max\Big\{0,\ \frac{\nabla\hat J_{k+1}^{\top}\big(\nabla\hat J_{k+1}-\nabla\hat J_k\big)}{\|\nabla\hat J_k\|^2}\Big\}\\
&\mathbf d_{k+1}=-\nabla\hat J(u_{k+1})+\vartheta_k\,\mathbf d_k
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
                        <span className="a3-completa">Cada iteración pide un gradiente, es decir, una simulación directa y una adjunta. </span>La dirección mezcla el
                        gradiente nuevo con la anterior y evita el zigzag del máximo descenso<span className="a3-completa"> en los valles alargados</span>.
                    </p>
                    <p style={txt}>
                        Direcciones conjugadas, <InlineMath math="\mathbf d_i^{\top}A\,\mathbf d_j=0" /> (<InlineMath math="i\ne j" />): en una
                        cuadrática de <InlineMath math="n" /> variables, CG llega en a lo más <InlineMath math="n" /> pasos<span className="a3-completa">;{' '}
                        <InlineMath math="\vartheta_k" /> lleva la idea a un <InlineMath math="\hat J" /> no cuadrático</span>.
                    </p>
                    <p style={txt}>
                        <span className="a3-completa">Todo descansa en la proyección <InlineMath math="P_{\mathcal U_{ad}}" />: con solo cotas es
                        recortar, pero con el tanque deja de ser explícita (siguiente lámina). Por eso en el acuífero no se usa PR⁺: CG
                        trabaja dentro de trust-constr, sobre su modelo cuadrático.</span>
                        <span className="a3-publica">Con el tanque, proyectar deja de ser explícito: en el acuífero, CG trabaja dentro del
                        optimizador de la siguiente lámina.</span>
                    </p>
                    <p style={nota}>
                        <span className="a3-completa"><Cita k="manzoni2021optimal" p="§ 6.3 y Alg. 6.1" />; <Cita k="Nocedal2006" p="cap. 5" />. </span>Figura: cuadrática
                        ilustrativa<span className="a3-completa"> con búsqueda lineal exacta, donde CG termina en 2 pasos</span>.
                    </p>
                </div>
            </div>
            <Notas titulo="Gradiente conjugado: qué es y dónde está en nuestro cálculo">
                <h4>Dirección de descenso</h4>
                <p><InlineMath math="\mathbf d" /> es de descenso si <InlineMath math="\nabla\hat J(u)^\top\mathbf d<0" />: para un paso
                    pequeño, <InlineMath math="\hat J(u+\rho\mathbf d)<\hat J(u)" />. La más simple es{' '}
                    <InlineMath math="\mathbf d=-\nabla\hat J" /> (máximo descenso). En un valle alargado (Hessiana con número de condición{' '}
                    <InlineMath math="\kappa" /> grande) zigzaguea: cada paso con búsqueda lineal exacta es ortogonal al anterior, y el
                    error baja por un factor <InlineMath math="\tfrac{\kappa-1}{\kappa+1}" /> por iteración.</p>
                <h4>Direcciones conjugadas (caso cuadrático)</h4>
                <p>Para <InlineMath math="J(x)=\tfrac12x^\top Ax-b^\top x" /> con <InlineMath math="A" /> simétrica definida positiva, dos
                    direcciones son conjugadas si <InlineMath math="\mathbf d_i^\top A\mathbf d_j=0" />. Minimizar exactamente a lo largo de{' '}
                    <InlineMath math="n" /> direcciones conjugadas da el mínimo en <InlineMath math="n" /> pasos: cada paso no deshace lo
                    ganado en los anteriores. CG las construye sobre la marcha con el residuo <InlineMath math="\mathbf r_k=\nabla J(x_k)" />:</p>
                <BlockMath math={String.raw`\alpha_k=\frac{\mathbf r_k^\top\mathbf r_k}{\mathbf d_k^\top A\mathbf d_k},\quad x_{k+1}=x_k+\alpha_k\mathbf d_k,\quad
\beta_k=\frac{\mathbf r_{k+1}^\top\mathbf r_{k+1}}{\mathbf r_k^\top\mathbf r_k},\quad \mathbf d_{k+1}=-\mathbf r_{k+1}+\beta_k\mathbf d_k`} />
                <p>Solo guarda la dirección anterior y su error baja como <InlineMath math="\tfrac{\sqrt\kappa-1}{\sqrt\kappa+1}" />, mucho mejor
                    que el máximo descenso. En la figura (<InlineMath math="\kappa\approx20" />): 2 pasos frente a decenas.</p>
                <h4>CG no lineal (PR⁺) y proyección</h4>
                <p>Para <InlineMath math="\hat J" /> no cuadrático no hay <InlineMath math="A" />: el paso sale de una búsqueda lineal (Wolfe) y{' '}
                    <InlineMath math="\vartheta_k" /> (Polak–Ribière) reemplaza a <InlineMath math="\beta_k" />; el <InlineMath math="\max\{0,\cdot\}" />{' '}
                    reinicia con <InlineMath math="-\nabla\hat J" /> cuando la conjugación se pierde. Con cotas se proyecta y se anula la
                    dirección en las componentes activas; si cambia el conjunto activo se reinicia.</p>
                <h4>Dónde está CG en este trabajo</h4>
                <ul>
                    <li><b>Casos de prueba del libro</b> (Graetz, pozos transitorios; solo cotas): PR⁺ proyectado con Wolfe, comparado con
                        L-BFGS-B, que resultó entre 1.8 y 7 veces más barato.</li>
                    <li><b>Acuífero</b> (con tanque y ciclo de la bomba): no se usa PR⁺, porque la proyección ya no es explícita. El
                        optimizador es trust-constr (siguiente lámina), y en cada iteración su paso tangencial minimiza el modelo
                        cuadrático <InlineMath math="\nabla\hat J^\top p+\tfrac12p^\top Bp" /> (<InlineMath math="B" />: BFGS) con CG lineal
                        proyectado, truncado en la región de confianza. Ahí CG hace exactamente lo de la figura: resolver una
                        cuadrática.</li>
                </ul>
                <p>Referencias: <Cita k="Nocedal2006" p="cap. 5 y § 16.3" />; <Cita k="manzoni2021optimal" p="§ 6.3" />.</p>
            </Notas>
        </SlideLayout>
    );
}

A3D12.ecuaciones = ['cg'];

const txt = { margin: '8px 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
