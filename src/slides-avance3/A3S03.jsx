import React from 'react';
import { BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';

const eqAdjH = String.raw`-S_s\,\partial_t\psi_h + \nabla\!\cdot\!(K\nabla\psi_h) = -\nabla\!\cdot\!(K\psi_C\nabla C)`;

const eqAdjC = String.raw`-\phi R\,\partial_t\psi_C + \nabla\!\cdot\!(\mathbf{D}\nabla\psi_C) +\bigl[\chi(Q)g(z_p)+\lambda\phi R\bigr]\psi_C = 2\gamma\, g_p\, C`;

const eqGradQ = String.raw`\nabla_Q\mathcal{J}(t) = 2|z_p\!-\!z_0|\,Q(t) - \int_\Omega g(z_p)\!\left[\psi_h(\chi+Q\chi') + \psi_C C\chi'\right]d\Omega`;

const eqGradzp = String.raw`
\begin{aligned}
\frac{\partial\mathcal{J}}{\partial z_p}
  &= 2\beta(z_p\!-\!z_0)
     - \int_0^T Q^2\,dt
     + \gamma\!\int_0^T\!\!\int_\Omega \frac{\partial g_p}{\partial z_p} C^2\,d\Omega\,dt \\[6pt]
  &\quad - \int_0^T\!\!\int_\Omega
       \frac{\partial g}{\partial z_p}
       \bigl[\chi Q\psi_h + \chi\psi_C C\bigr]\,d\Omega\,dt
\end{aligned}`;

const Divider = () => (
    <div style={{ borderTop: '1px solid rgba(0,216,255,0.18)', margin: '6px 0' }} />
);

const A3S03 = ({ theme = 'dark' }) => (
    <SlideLayout title="Método adjunto — ecuaciones clave" theme={theme}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <EqCard title="PDEs adjuntas — retropropagadas  t = T → 0">
            <BlockMath math={eqAdjH} />
            <Divider />
            <BlockMath math={eqAdjC} />
        </EqCard>

        <EqCard title="Gradientes del funcional  𝒥 = γ𝒥ₘ + 𝒥ₑ">
            <BlockMath math={eqGradQ} />
            <Divider />
            <BlockMath math={eqGradzp} />
        </EqCard>
        </div>
    </SlideLayout>
);

export default A3S03;
