import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq, Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { usePublica } from './version.jsx';

// Método adjunto por el Lagrangiano (Manzoni, Quarteroni y Salsa 2021, §§ 4.1.3–4.1.4, 6.2 y 7.4.3; tesis, Cap. III,
// Prop. de representación adjunta y Teo. KKT). Notación de la tesis: L = J + ⟨ψ, e⟩, ψ = (ψ_h, ψ_C, ψ_im,r), û minimizador
// local. El libro usa L = J + (p, g) con g = −e, así que ψ = −p respecto de su convención.
const pasos = [
    { t: 'Lagrangiano', m: String.raw`\mathcal L(y,u,\psi)=J(y,u)+\langle\psi,\,e(y,u)\rangle,\qquad \psi=(\psi_h,\psi_C,\psi_{\mathrm{im},r})`,
      d: <>un multiplicador por ecuación de estado<span className="a3-completa">: <InlineMath math="\psi_h" /> del flujo (<InlineMath math="h" />),{' '}
          <InlineMath math="\psi_C" /> del transporte (<InlineMath math="C_m" />), <InlineMath math="\psi_{\mathrm{im},r}" /> de las
          regiones inmóviles (<InlineMath math="C_{\mathrm{im},r}" />, <InlineMath math="r=1,2,3" />)</span></> },
    { t: 'Estado', m: String.raw`\partial_{\psi}\mathcal L=0\ \Longleftrightarrow\ e(y,u)=0`,
      d: <>hacia adelante en el tiempo<span className="a3-completa">, desde las condiciones iniciales</span></> },
    { t: 'Adjunto', m: String.raw`\partial_{y}\mathcal L=0\ \Longleftrightarrow\ \big(\partial_{y}e\big)^{*}\psi=-\partial_{y}J,\qquad \psi(\cdot,T)=0`,
      d: <>lineal, hacia atrás en el tiempo<span className="a3-completa">, con la fuente puesta por el funcional</span></> },
    { t: 'Gradiente', m: String.raw`\nabla\hat J(u)=\partial_{u}\mathcal L\big(y(u),u,\psi(u)\big)=\partial_{u}J+\big(\partial_{u}e\big)^{*}\psi`,
      d: <>la sensibilidad <InlineMath math="dy/du" /> no aparece<span className="a3-completa">: no hay que resolver una EDP por cada control</span></> },
    { t: 'Optimalidad', m: String.raw`\nabla\hat J(\hat u)\cdot(u-\hat u)\ge0\qquad\forall\,u\in\mathcal U_{ad}`,
      d: <>
          <span style={{ display: 'block' }}><InlineMath math="u" />: cualquier control admisible{' '}
              <span style={{ whiteSpace: 'nowrap' }}>(<InlineMath math="Q_1,\dots,Q_{72},z_p" />)</span>; es lo que se optimiza</span>
          <span style={{ display: 'block' }}><InlineMath math="\hat u" />: el control óptimo que se busca (minimizador local;{' '}
              <InlineMath math="u^\star" /> en otros textos)<span className="a3-completa">, no una solución de referencia</span></span>
          <span style={{ display: 'block' }}>desde <InlineMath math="\hat u" />, ninguna dirección admisible <InlineMath math="u-\hat u" /> hace
              bajar <InlineMath math="\hat J" /></span>
          <span className="a3-completa" style={{ display: 'block' }}><InlineMath math="\nabla\hat J(\hat u)\cdot(u-\hat u)" /> es la derivada
              de <InlineMath math="\hat J" /> en <InlineMath math="\hat u" /> hacia <InlineMath math="u" />: si fuera negativa para algún{' '}
              <InlineMath math="u" />, moverse hacia él bajaría <InlineMath math="\hat J" />. Condición necesaria de primer orden (suficiente
              si <InlineMath math="\hat J" /> fuera convexa). Con restricciones lineales equivale a las KKT, con multiplicadores para
              las cotas de <InlineMath math="Q_n" /> y <InlineMath math="z_p" />, el tanque y el ciclo de la bomba</span>
      </>, esquema: true },
];

// Esquema del paso 5 (ilustrativo, no es el problema real): U_ad, el óptimo û en un lado activo, otro control admisible u, la
// dirección u − û (ángulo ≥ 90° con −∇Ĵ(û)) y la curva de nivel Ĵ = Ĵ(û), tangente al lado en û.
function Optimo() {
    const pub = usePublica(), fs = 16;
    const lado = [[150, 140], [220, 84]];
    const uh = [(lado[0][0] + lado[1][0]) / 2, (lado[0][1] + lado[1][1]) / 2];
    const tx = lado[1][0] - lado[0][0], ty = lado[1][1] - lado[0][1], l = Math.hypot(tx, ty);
    const n = [-ty / l, tx / l];                                   // normal exterior del lado activo
    const g = [uh[0] + 42 * n[0], uh[1] + 42 * n[1]];              // −∇Ĵ(û)
    const u = [95, 70];
    const R = 70, c = [uh[0] + R * n[0], uh[1] + R * n[1]], a0 = Math.atan2(-n[1], -n[0]);
    const arco = Array.from({ length: 25 }, (_, i) => a0 - 0.6 + 1.2 * i / 24)
        .map(a => `${c[0] + R * Math.cos(a)},${c[1] + R * Math.sin(a)}`).join(' ');
    const t = { fontFamily: 'var(--a3-serif)', fontStyle: 'italic', fontSize: fs + 2 };
    return (
        <svg viewBox="0 0 300 165" style={{ width: pub ? 330 : 290, flex: 'none' }}>
            <defs>
                <marker id="a3d08-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
                </marker>
            </defs>
            <polygon points="14,140 150,140 220,84 170,20 30,36" fill="var(--a3-agua)" fillOpacity="0.1" stroke="var(--a3-agua)" strokeWidth="1.5" />
            <line x1={lado[0][0]} y1={lado[0][1]} x2={lado[1][0]} y2={lado[1][1]} stroke="var(--a3-agua)" strokeWidth="4" />
            <polyline points={arco} fill="none" stroke="var(--sl-muted)" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x={c[0] + R * Math.cos(a0 + 0.6) + 5} y={c[1] + R * Math.sin(a0 + 0.6) + 4}
                  style={{ ...t, fontSize: fs, fill: 'var(--sl-muted)' }}>Ĵ = Ĵ(û)</text>
            <line x1={uh[0]} y1={uh[1]} x2={u[0]} y2={u[1]} stroke="var(--sl-text)" strokeWidth="1.8" strokeDasharray="6 4" markerEnd="url(#a3d08-flecha)" />
            <line x1={uh[0]} y1={uh[1]} x2={g[0]} y2={g[1]} stroke="var(--a3-pluma)" strokeWidth="2.6" markerEnd="url(#a3d08-flecha)" />
            <circle cx={u[0]} cy={u[1]} r="5" fill="var(--sl-bg)" stroke="var(--sl-text)" strokeWidth="2" />
            <circle cx={uh[0]} cy={uh[1]} r="6" fill="var(--a3-agua)" />
            <text x={48} y={124} style={{ ...t, fill: 'var(--a3-agua)', fontStyle: 'normal' }}>𝒰<tspan fontSize={fs - 3} dy="4">ad</tspan></text>
            <text x={u[0] - 8} y={u[1] - 10} style={{ ...t, fill: 'var(--sl-text)' }}>u</text>
            <text x={uh[0] + 4} y={uh[1] - 12} style={{ ...t, fill: 'var(--a3-agua)' }}>û</text>
            <text x={(uh[0] + u[0]) / 2 + 4} y={(uh[1] + u[1]) / 2 - 10} textAnchor="middle" style={{ ...t, fontSize: fs, fill: 'var(--sl-text)' }}>u − û</text>
            <text x={g[0] + 6} y={g[1] + 4} style={{ ...t, fontSize: fs, fill: 'var(--a3-pluma)' }}>−∇Ĵ(û)</text>
        </svg>
    );
}

export default function A3D08({ theme = 'dark' }) {
    const [p] = useProgreso(4000, 300);
    const pub = usePublica();
    return (
        <SlideLayout title="Método adjunto: el Lagrangiano en cinco pasos" theme={theme} justify="flex-start">
            <div>
                {pasos.map((s, i) => {
                    const v = tramo(p, 0.17 * i, 0.17 * i + 0.17);
                    return (
                        <div key={s.t} style={{ display: 'grid', gridTemplateColumns: pub ? '44px 200px 1fr' : '44px 170px 1fr', alignItems: 'center', columnGap: 12,
                                                opacity: 0.15 + 0.85 * v, borderTop: i ? '1px solid var(--a3-filete)' : 'none', padding: '4px 0' }}>
                            <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-seccion)', color: 'var(--a3-agua)' }}>{i + 1}</span>
                            <span style={{ fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', fontWeight: 600 }}>{s.t}</span>
                            <div style={s.esquema ? { display: 'flex', alignItems: 'center', gap: 18 } : undefined}>
                                <div style={{ flex: 1 }}>
                                    <Eq math={s.m} compacta />
                                    <p style={{ margin: '-4px 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>{s.d}</p>
                                </div>
                                {s.esquema && <Optimo />}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Costo de un gradiente: dos resoluciones del modelo, una directa y una adjunta, sin importar cuántos controles
                haya<span className="a3-completa"> (<InlineMath math="73" /> aquí). Las ecuaciones adjuntas se deducen en el continuo (siguiente lámina); para
                calcular se discretiza primero y se optimiza después: el adjunto discreto es la transpuesta exacta del esquema, en
                las dos discretizaciones</span>.
            </p>
            <p className="a3-completa" style={{ margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                Gradiente y costo frente al enfoque directo <Cita k="manzoni2021optimal" p="§§ 4.1.3–4.1.4" />; optimizar-discretizar
                frente a discretizar-optimizar <Cita k="manzoni2021optimal" p="§ 6.2" />; condiciones de optimalidad parabólicas{' '}
                <Cita k="manzoni2021optimal" p="§ 7.4.3" />.
            </p>
        </SlideLayout>
    );
}
