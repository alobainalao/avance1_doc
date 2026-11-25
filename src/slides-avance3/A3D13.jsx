import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from './ui.jsx';
import { Notas } from './version.jsx';

// Por qué la optimización usa región de confianza con puntos interiores (tesis, Cap. III §algoritmo de optimización;
// Nocedal y Wright 2006, caps. 4 y 19): la proyección sobre U_ad no es explícita cuando el tanque acopla los pasos.
const eqCaja = String.raw`P(\mathbf v)_n=\min\{\overline Q_n,\ \max\{0,\ v_n\}\}`;
const eqTanque = String.raw`\begin{aligned}P_{\mathcal U_{ad}}(\mathbf v)&=\arg\min_{\mathbf w}\ \|\mathbf w-\mathbf v\|^2\\
\text{s.a.}\quad 0&\le S_n(\mathbf w)\le S_{\max},\quad n=1,\dots,72\end{aligned}`;
const eqBarrera = String.raw`\min_{u,\ \mathbf s>0}\ \hat J(u)-\mu\sum_i\log s_i\quad\text{s.a.}\quad \mathbf c(u)-\mathbf s=0`;

const pasos = [
    ['Barrera', <><span className="a3-completa">cada desigualdad <InlineMath math="c_i(u)\ge0" /> se escribe <InlineMath math="c_i(u)=s_i" /> con
        holgura <InlineMath math="s_i>0" />; </span><InlineMath math="-\mu\log s_i" /> mantiene positivas las holguras y{' '}
        <InlineMath math="\mu\to0" /> lleva al óptimo<span className="a3-completa">. En las corridas actuales todo iterado es admisible: el paso que sale del conjunto se rechaza</span></>],
    ['Modelo cuadrático', <><span className="a3-completa">cerca del iterado, </span><InlineMath math="\hat J" /> se aproxima con el gradiente adjunto y una Hessiana BFGS<span className="a3-completa">
        {' '}armada con los gradientes de las iteraciones anteriores</span></>],
    ['Región de confianza', <>el paso <InlineMath math="\mathbf p" /> se busca solo donde el modelo es fiable,{' '}
        <InlineMath math="\|\mathbf p\|\le\Delta" /><span className="a3-completa">: si <InlineMath math="\hat J" /> baja lo previsto, <InlineMath math="\Delta" /> crece;
        si no, el paso se rechaza y <InlineMath math="\Delta" /> se reduce</span></>],
    ['Paro', <>cuando la medida de criticidad <InlineMath math="\chi<10^{-4}" /><span className="a3-completa"> (siguiente lámina), o tras ≥ 50 iteraciones con{' '}
        <InlineMath math="\chi\le3\cdot10^{-3}" /> (criterio práctico)</span></>],
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
                        Con el tanque,<span className="a3-completa"> el nivel <InlineMath math="S_n(\mathbf w)=S_0+V_s\Delta t\sum_{k\le n}w_k-\sum_{k\le n}d_k" /> depende
                        de todos los caudales anteriores: recortar un <InlineMath math="Q_n" /> mueve el tanque en los pasos siguientes, y</span>{' '}
                        proyectar es un problema cuadrático con 144 restricciones acopladas
                    </p>
                    <Eq math={eqTanque} compacta />
                </div>
            </div>
            <p style={{ margin: '14px 0 2px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                Por eso: región de confianza con puntos interiores<span className="a3-completa"> (trust-constr)</span>, sin proyectar
            </p>
            <p style={{ ...eti, margin: '0 0 4px' }}>
                La proyección queda solo para medir <InlineMath math="\chi" /> (siguiente lámina): un problema cuadrático pequeño, sin simulaciones
            </p>
            <p style={{ ...eti, margin: '0 0 2px' }}>
                <span className="a3-completa">Implementación: <code>scipy.optimize.minimize(method="trust-constr")</code> de SciPy 1.17 <Cita k="virtanen2020scipy" />,
                que sigue el algoritmo de </span><span className="a3-publica">Algoritmo de </span><Cita k="byrd1999interior" /><span className="a3-completa">; véase también <Cita k="Nocedal2006" p="caps. 4 y 19" /></span>.
            </p>
            <Eq math={eqBarrera} id="barrera" compacta />
            <p style={{ ...eti, margin: '-4px 0 0', textAlign: 'center' }}>
                <InlineMath math="\mathbf c(u)\ge0" />: todas las restricciones del conjunto admisible<span className="a3-completa"> (cotas de{' '}
                <InlineMath math="Q_n" /> y <InlineMath math="z_p" />, tanque y ciclo de la bomba), que entran en cada subproblema</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 12 }}>
                {pasos.map(([t, d], i) => (
                    <div key={t} style={{ borderTop: '2px solid var(--a3-agua)', paddingTop: 8 }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', fontWeight: 600 }}>{i + 1}. {t}</p>
                        <p style={{ margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>{d}</p>
                    </div>
                ))}
            </div>
            <p className="a3-completa" style={{ margin: '16px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Cada iteración cuesta lo mismo que con gradiente conjugado: una resolución directa (<InlineMath math="\hat J" />) y,
                para <InlineMath math="\nabla\hat J" />, otra directa y una adjunta (hoy el gradiente vuelve a resolver el estado), más una
                directa por cada paso rechazado. El cuasi-Newton además aprovecha la
                curvatura: en los casos de prueba del libro (Graetz, pozos transitorios), L-BFGS-B resultó entre 1.8 y 7 veces más barato que PR⁺.
            </p>
            <p className="a3-publica" style={{ margin: '16px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Mismo costo por iteración que gradiente conjugado. En casos de prueba, el cuasi-Newton L-BFGS-B fue 1.8–7 veces más barato que PR⁺.
            </p>
            <Notas titulo="Proyección, restricciones acopladas y barrera">
                <h4>1. Qué es proyectar</h4>
                <p><InlineMath math="P_{\mathcal U_{ad}}(\mathbf v)=\arg\min_{\mathbf w\in\mathcal U_{ad}}\tfrac12\|\mathbf w-\mathbf v\|^2" />: el punto
                    admisible más cercano a <InlineMath math="\mathbf v" />. El gradiente proyectado da un paso de descenso y regresa al conjunto:{' '}
                    <InlineMath math="u_{k+1}=P_{\mathcal U_{ad}}(u_k-\rho_k\nabla\hat J(u_k))" />. Sirve si proyectar es barato y exacto.</p>
                <h4>2. Solo cotas: proyectar es recortar</h4>
                <p>Si <InlineMath math="\mathcal U_{ad}" /> es una caja, <InlineMath math="\tfrac12\sum_n(w_n-v_n)^2" /> con <InlineMath math="0\le w_n\le\overline Q_n" /> se
                    separa en 72 problemas de una variable, cada uno con solución explícita <InlineMath math="w_n=\min\{\overline Q_n,\max\{0,v_n\}\}" />:
                    cuesta 72 comparaciones.</p>
                <h4>3. Con el tanque: un problema cuadrático</h4>
                <BlockMath math={String.raw`\min_{\mathbf w\in\mathbb R^{73}}\tfrac12\|\mathbf w-\mathbf v\|^2\ \ \text{s.a.}\ \ \begin{cases}0\le w_n\le\overline Q_n,\ z_{lo}\le z_p\le z_{hi} & 146\\ 0\le S_n(\mathbf w)\le S_{\max},\ n=1,\dots,72 & 144\\ \text{ciclo de la bomba (ventanas de 3 pasos)} & 140\end{cases}`} />
                <p>Es estrictamente convexo con restricciones lineales: tiene solución única, pero sin fórmula cerrada; se resuelve
                    iterativamente (conjunto activo / SQP). En total, 430 desigualdades para 73 variables.</p>
                <h4>4. De dónde salen las 144</h4>
                <p>El balance del tanque por paso es <InlineMath math="S_n=S_{n-1}+V_s\Delta t\,Q_n-d_n" />, es decir</p>
                <BlockMath math={String.raw`S_n(\mathbf w)=S_0+V_s\Delta t\sum_{k\le n}w_k-\sum_{k\le n}d_k,\qquad \mathbf S=S_0\mathbf 1+V_s\Delta t\,L\mathbf w-L\mathbf d`} />
                <p>con <InlineMath math="L" /> triangular inferior de unos. Cada uno de los 72 pasos da dos desigualdades: <InlineMath math="S_n\ge0" /> (la
                    demanda queda cubierta) y <InlineMath math="S_n\le S_{\max}" /> (el tanque no se desborda). 2 × 72 = 144.</p>
                <h4>5. Por qué están acopladas</h4>
                <p>La fila <InlineMath math="n" /> contiene <InlineMath math="w_1,\dots,w_n" />: cambiar un caudal <InlineMath math="Q_k" /> mueve el nivel del tanque en
                    todos los pasos siguientes. Recortar una componente puede violar una restricción treinta pasos después, así que la
                    proyección tiene que mover varios caudales a la vez; ya no se separa por componentes.</p>
                <h4>6. Las dos formulaciones</h4>
                <p><b>Gradiente (conjugado) proyectado:</b> necesita <InlineMath math="P_{\mathcal U_{ad}}" /> en cada paso, es decir, un problema
                    cuadrático con 430 restricciones por iteración, resuelto con precisión suficiente para no salir del conjunto; además,
                    proyectar una dirección conjugada rompe la conjugación. <b>Punto interior (trust-constr):</b> no proyecta; las
                    restricciones entran en cada subproblema mediante holguras y la barrera.</p>
                <h4>7. La barrera logarítmica</h4>
                <p><InlineMath math="\mathbf c(u)-\mathbf s=0" />, <InlineMath math="\mathbf s>0" />, y se minimiza <InlineMath math="\hat J(u)-\mu\sum_i\log s_i" />.
                    Como <InlineMath math="-\log s\to+\infty" /> cuando <InlineMath math="s\to0" />, la holgura nunca llega a cero: los iterados quedan
                    dentro. Las condiciones de optimalidad de cada subproblema son las KKT perturbadas <InlineMath math="\lambda_is_i=\mu" />; con{' '}
                    <InlineMath math="\mu\leftarrow\mu/5" /> se recupera <InlineMath math="\lambda_is_i=0" />. Consecuencias: (i) factibilidad: con{' '}
                    <code>keep_feasible</code> todo iterado es admisible (sin él, un iterado intermedio podía violar el tanque);
                    (ii) convergencia: los iterados siguen el camino central hacia el borde; al final los pasos son cortos y la cola
                    es lenta, por eso χ se estanca cerca de 3·10⁻³ antes de bajar.</p>
                <h4>8. En el código</h4>
                <p><code>scipy.optimize.minimize(method="trust-constr")</code> con <code>Bounds</code> (caudales y <InlineMath math="z_p" />) y dos{' '}
                    <code>LinearConstraint</code>: el tanque (<code>supply_constraint</code>: <InlineMath math="A=V_s\Delta t\,L" />, cotas{' '}
                    <InlineMath math="-\mathbf b" /> y <InlineMath math="S_{\max}-\mathbf b" />, <InlineMath math="\mathbf b=S_0-L\mathbf d" />) y el ciclo de la bomba
                    (<code>pump_duty_constraint</code>), en variables escaladas <InlineMath math="\xi=x/s" /> (<code>fenicsx/adjoint.py</code>,{' '}
                    <code>optimize_fenicsx</code>). La proyección aparece solo en el <i>callback</i> de cada iteración: <code>proyectar</code>{' '}
                    (SLSQP sobre el mismo poliedro) da <InlineMath math="P_{\mathcal U_{ad}}(\xi-\nabla\hat J)" /> para χ, y{' '}
                    <code>residuo_proyeccion</code> la certifica con el residuo KKT de la proyección (NNLS).</p>
            </Notas>
        </SlideLayout>
    );
}

A3D13.ecuaciones = ['barrera'];

const blq = { borderLeft: '3px solid var(--a3-agua)', padding: '2px 0 2px 18px' };
const eti = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)', lineHeight: 1.4 };
