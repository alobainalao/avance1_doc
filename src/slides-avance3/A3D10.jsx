import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Eq } from './ui.jsx';

// Gradiente reducido (tesis, Cap. III: eq:gradiente_Q, eq:gradiente_Qn, eq:gradiente_zp, eq:Q_interior). Intervalos como en
// A3D05: Q(t) = Q_n en (t_{n-1}, t_n], n = 1..72 (la tesis numera I_n = (t_n, t_{n+1}], n = 0..N_t-1). El punto interior exige
// también el ciclo de la bomba inactivo: su ventana acopla pasos, como el tanque (Cap. III, interpretación de eq:Q_interior).
const eqQ = String.raw`\frac{\partial\hat J}{\partial Q_n}=\int_{t_{n-1}}^{t_n}\Big(2\beta\,d_p\,Q(t)+\int_\Omega g_\varepsilon\,\psi_h\,d\Omega\Big)dt`;
const eqZ = String.raw`\frac{\partial\hat J}{\partial z_p}=\gamma\!\int_0^T\!\!\int_\Omega\dot g_\varepsilon\,C_m^2\,d\Omega\,dt
+2\alpha\kappa_p(z_p-z_0)-\beta\!\int_0^T\!Q^2\,dt+\int_0^T\!Q\!\int_\Omega\dot g_\varepsilon\,\psi_h\,d\Omega\,dt`;
const eqInt = String.raw`\hat Q_n=-\frac{1}{2\beta\,d_p\,\Delta t}\int_{t_{n-1}}^{t_n}\!\!\int_\Omega g_\varepsilon\,\hat\psi_h\,d\Omega\,dt\qquad\text{(si }0<\hat Q_n<\overline Q_n\text{, sin tanque ni ciclo activos)}`;

export default function A3D10({ theme = 'dark' }) {
    return (
        <SlideLayout title="Del adjunto al gradiente" theme={theme} justify="flex-start">
            <div style={blq}>
                <p style={eti}>Caudal en cada intervalo<span className="a3-completa">: costo de bombeo + respuesta del adjunto del flujo en el pozo</span></p>
                <Eq math={eqQ} id="grad-Q" />
            </div>
            <div style={blq}>
                <p style={eti}>Profundidad<span className="a3-completa">: mover la observación, la instalación, el bombeo y el núcleo del pozo</span></p>
                <Eq math={eqZ} id="grad-zp" compacta />
            </div>
            <div style={{ ...blq, borderLeftColor: 'var(--a3-valido)' }}>
                <p style={eti}>Punto interior: el caudal óptimo es la lectura del adjunto en el pozo</p>
                <Eq math={eqInt} id="Q-interior" compacta />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                <InlineMath math="g_\varepsilon" />: núcleo gaussiano del pozo<span className="a3-completa"> (<InlineMath math="\varepsilon=r_{\rm pozo}/3\approx 6.7" /> m,
                masa 1), que reparte el caudal extraído y pesa <InlineMath math="J_m" /></span>;{' '}
                <InlineMath math="\dot g_\varepsilon=\partial g_\varepsilon/\partial z_p" />. Todo lo que el gradiente necesita está en{' '}
                <InlineMath math="(C_m,\psi_h)" /> sobre el pozo<span className="a3-completa">: el adjunto dice cuánto cambia la calidad del agua captada si se
                bombea un poco más en cada instante. Con <InlineMath math="J" /> normalizado (cada término entre su escala), <InlineMath math="\gamma" />,{' '}
                <InlineMath math="\alpha" /> y <InlineMath math="\beta" /> llevan dividida la escala de su término</span>.
            </p>
        </SlideLayout>
    );
}

A3D10.ecuaciones = ['grad-Q', 'grad-zp', 'Q-interior'];

const blq = { borderLeft: '3px solid var(--a3-agua)', padding: '2px 0 2px 18px', margin: '6px 0' };
const eti = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' };
