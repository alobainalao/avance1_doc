import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';

// Método adjunto por el Lagrangiano (Manzoni, Quarteroni y Salsa 2021, §§ 4.1.3–4.1.4, 6.2 y 7.4.3; tesis, Cap. III,
// Prop. de representación adjunta y Teo. KKT). Notación de la tesis: L = J + ⟨ψ, e⟩, ψ = (ψ_h, ψ_C, ψ_im,r), û minimizador
// local. El libro usa L = J + (p, g) con g = −e, así que ψ = −p respecto de su convención.
const pasos = [
    { t: 'Lagrangiano', m: String.raw`\mathcal L(\mathbf y,\mathbf u,\boldsymbol\psi)=J(\mathbf y,\mathbf u)+\langle\boldsymbol\psi,\,e(\mathbf y,\mathbf u)\rangle,\qquad \boldsymbol\psi=(\psi_h,\psi_C,\psi_{\mathrm{im},r})`,
      d: <>un multiplicador por ecuación de estado: <InlineMath math="\psi_h" /> del flujo (<InlineMath math="h" />),{' '}
          <InlineMath math="\psi_C" /> del transporte (<InlineMath math="C_m" />), <InlineMath math="\psi_{\mathrm{im},r}" /> de las
          regiones inmóviles (<InlineMath math="C_{\mathrm{im},r}" />, <InlineMath math="r=1,2,3" />)</> },
    { t: 'Estado', m: String.raw`\partial_{\boldsymbol\psi}\mathcal L=0\ \Longleftrightarrow\ e(\mathbf y,\mathbf u)=0`,
      d: 'hacia adelante en el tiempo, desde las condiciones iniciales' },
    { t: 'Adjunto', m: String.raw`\partial_{\mathbf y}\mathcal L=0\ \Longleftrightarrow\ \big(\partial_{\mathbf y}e\big)^{*}\boldsymbol\psi=-\partial_{\mathbf y}J,\qquad \boldsymbol\psi(\cdot,T)=0`,
      d: 'lineal, hacia atrás en el tiempo, con la fuente puesta por el funcional' },
    { t: 'Gradiente', m: String.raw`\nabla\hat J(\mathbf u)=\partial_{\mathbf u}\mathcal L\big(\mathbf y(\mathbf u),\mathbf u,\boldsymbol\psi(\mathbf u)\big)=\partial_{\mathbf u}J+\big(\partial_{\mathbf u}e\big)^{*}\boldsymbol\psi`,
      d: <>la sensibilidad <InlineMath math="d\mathbf y/d\mathbf u" /> no aparece: no hay que resolver una EDP por cada control</> },
    { t: 'Optimalidad', m: String.raw`\nabla\hat J(\hat{\mathbf u})\cdot(\mathbf u-\hat{\mathbf u})\ge0\qquad\forall\,\mathbf u\in\mathcal U_{ad}`,
      d: <><InlineMath math="\hat{\mathbf u}" />: minimizador local. Las restricciones son lineales, así que equivale a las condiciones KKT
          con multiplicadores para las cotas de <InlineMath math="Q_n" /> y <InlineMath math="z_p" />, el tanque y el ciclo de la bomba</> },
];

export default function A3D08({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(4000, 300);
    return (
        <SlideLayout title="Método adjunto: el Lagrangiano en cinco pasos" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                {pasos.map((s, i) => {
                    const v = tramo(p, 0.17 * i, 0.17 * i + 0.17);
                    return (
                        <div key={s.t} style={{ display: 'grid', gridTemplateColumns: '44px 170px 1fr', alignItems: 'center', columnGap: 12,
                                                opacity: 0.15 + 0.85 * v, borderTop: i ? '1px solid var(--a3-filete)' : 'none', padding: '4px 0' }}>
                            <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-seccion)', color: 'var(--a3-agua)' }}>{i + 1}</span>
                            <span style={{ fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', fontWeight: 600 }}>{s.t}</span>
                            <div>
                                <Eq math={s.m} compacta />
                                <p style={{ margin: '-4px 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>{s.d}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                Costo de un gradiente: dos resoluciones del modelo, una directa y una adjunta, sin importar cuántos controles
                haya (<InlineMath math="73" /> aquí). Las ecuaciones adjuntas se deducen en el continuo (siguiente lámina); para
                calcular se discretiza primero y se optimiza después: el adjunto discreto es la transpuesta exacta del esquema, en
                las dos discretizaciones.
            </p>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                A. Manzoni, A. Quarteroni y S. Salsa, <i>Optimal Control of Partial Differential Equations</i>, Springer, 2021,
                §§ 4.1.3–4.1.4 (gradiente y costo: enfoque directo frente al adjunto), 6.2 (optimizar-discretizar frente a
                discretizar-optimizar) y 7.4.3 (condiciones de optimalidad en problemas parabólicos).
            </p>
        </SlideLayout>
    );
}
