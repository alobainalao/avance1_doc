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
      d: <><InlineMath math="\hat u" />: minimizador local<span className="a3-completa">. Las restricciones son lineales, así que equivale a las condiciones KKT
          con multiplicadores para las cotas de <InlineMath math="Q_n" /> y <InlineMath math="z_p" />, el tanque y el ciclo de la bomba</span></> },
];

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
