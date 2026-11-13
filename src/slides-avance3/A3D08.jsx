import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';

// Método adjunto por el Lagrangiano (Manzoni, Quarteroni y Salsa 2021, §§ 4.1.3–4.1.4 y 7.5; tesis, Cap. III).
// Los residuos se suman al funcional, así que ψ = −p respecto de la convención del libro.
const pasos = [
    { t: 'Lagrangiano', m: String.raw`\mathcal L(\mathbf y,\mathbf u,\boldsymbol\psi)=J(\mathbf y,\mathbf u)+\langle\boldsymbol\psi,\,e(\mathbf y,\mathbf u)\rangle,\qquad \boldsymbol\psi=(\psi_h,\psi_C,\psi_{\mathrm{im},r})`,
      d: 'cada ecuación de estado entra con su multiplicador' },
    { t: 'Estado', m: String.raw`\partial_{\boldsymbol\psi}\mathcal L=0\ \Longleftrightarrow\ e(\mathbf y,\mathbf u)=0`,
      d: 'hacia adelante en el tiempo, desde las condiciones iniciales' },
    { t: 'Adjunto', m: String.raw`\partial_{\mathbf y}\mathcal L=0\ \Longleftrightarrow\ \big(\partial_{\mathbf y}e\big)^{*}\boldsymbol\psi=-\partial_{\mathbf y}J,\qquad \boldsymbol\psi(T)=0`,
      d: 'lineal, hacia atrás en el tiempo, con la fuente puesta por el funcional' },
    { t: 'Gradiente', m: String.raw`\nabla\hat J(\mathbf u)=\partial_{\mathbf u}\mathcal L=\partial_{\mathbf u}J+\big(\partial_{\mathbf u}e\big)^{*}\boldsymbol\psi`,
      d: 'el término d𝐲/d𝐮 desaparece: no hace falta ninguna sensibilidad' },
    { t: 'Optimalidad', m: String.raw`\langle\nabla\hat J(\hat{\mathbf u}),\,\mathbf v-\hat{\mathbf u}\rangle\ge0\quad\forall\,\mathbf v\in\mathcal U_{ad}`,
      d: 'condiciones KKT con los multiplicadores de las restricciones del tanque y la bomba' },
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
                Costo de un gradiente: una simulación directa y una adjunta, sin importar cuántos controles haya
                (<InlineMath math="73" /> aquí). Se discretiza primero y se optimiza después: el adjunto discreto es la transpuesta
                exacta del esquema, en las dos discretizaciones.
            </p>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                A. Manzoni, A. Quarteroni y S. Salsa, <i>Optimal Control of Partial Differential Equations</i>, Springer, 2021,
                §§ 4.1.3–4.1.4 (costo del adjunto), 6.2.4 (optimizar-discretizar) y 7.5 (problemas parabólicos).
            </p>
        </SlideLayout>
    );
}
