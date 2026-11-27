import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Eq, Cita, RefEc } from '../slides-avance3/ui.jsx';
import { resalteAlm } from '../slides-avance3/A3N02.jsx';
import { Notas } from '../slides-avance3/version.jsx';

// Modelo MRMT que se resuelve (versión simplificada): las ecuaciones (1) de flujo y (5) MRMT de slides-avance3/A3N02 y
// A3N07, sin el camino que llevó a ellas (cancelación de fC). Tesis ChaptersR/CapI_ADR.tex (flujo, eq. de Darcy) y
// CapII_MRMT.tex (sistema MRMT, ec. 67–133); parámetros de config/nitrato_vscale_malla_eje_g1_prom.json: N_r = 3,
// η_r = beta = (0.15, 0.10, 0.05), D_eff = (10, 5, 1)·10⁻¹⁰ m²/s, L = 0.01 m, R = 1 ⇒ α_r = D_eff/(η_r R L²) =
// (6.67, 5.00, 2.00)·10⁻⁵ s⁻¹, τ_r = 1/α_r = (4.2, 5.6, 13.9) h. En MRMT el decaimiento λ_d se anula (fenicsx/forward.py).
const verde = '#2E7D4F';
const eqFlujo = String.raw`S_s\,\partial_t h-\nabla\!\cdot(\mathbf K\nabla h)=-Q(t)\,g_\varepsilon(\cdot\,;z_p),\qquad \mathbf u=-\mathbf K\nabla h`;
const eqMRMT = String.raw`\begin{aligned}
&\phi R\,\partial_t C_m+\mathbf u\!\cdot\!\nabla C_m-\nabla\!\cdot(D\nabla C_m)+\sum_{r=1}^{3}\lambda_r\,(C_m-C_{{\rm im},r})\;${resalteAlm('C_m')}=W_+\\[2pt]
&\phi_{{\rm im},r}R\,\partial_t C_{{\rm im},r}=\lambda_r\,(C_m-C_{{\rm im},r}),\qquad r=1,2,3
\end{aligned}`;

const M = (t) => <InlineMath math={t} />;
const filas = [
    [M('h,\\ \\mathbf u'), 'carga [m] y velocidad de Darcy [m/s]', 'flujo'],
    [M('C_m'), 'concentración móvil: la que transporta el agua y llega al pozo', 'transporte'],
    [M('C_{{\\rm im},r}'), 'concentración en la región inmóvil r: solo intercambia con la móvil', 'transporte'],
    [M('\\eta_r=\\phi_{{\\rm im},r}/\\phi'), '0.15, 0.10, 0.05 (capacidades; suman 0.3)', 'MRMT'],
    [M('\\tau_r=\\phi_{{\\rm im},r}R/\\lambda_r'), '4.2, 5.6 y 13.9 h (tiempos de intercambio)', 'MRMT'],
    [M('S_s,\\ R,\\ D'), <>{M('S_s=\\phi')} [1/m], {M('R=1')}; {M('D')}: dispersión con {M('\\alpha_L,\\alpha_T')}</>, 'medio'],
    [M('Q(t),\\ z_p'), <>controles: caudal [m²/s] y profundidad [m]; {M('g_\\varepsilon')}: núcleo del pozo</>, 'control'],
];

export default function A3R04({ theme = 'dark' }) {
    return (
        <SlideLayout title="Modelo MRMT: el sistema que se resuelve" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
                <EqCard title={<>Flujo: balance de agua y ley de Darcy<span className="a3-completa"> <Cita k="bear1972dynamics" /></span></>}>
                    <Eq math={eqFlujo} id="flujo" />
                </EqCard>
                <EqCard title={<>Transporte multitasa: región móvil y tres regiones inmóviles <Cita k="haggerty1995multirate" /></>}>
                    <Eq math={eqMRMT} id="mrmt" />
                </EqCard>
                <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                    <table style={{ flex: 1.45, borderCollapse: 'collapse', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                        <tbody>
                            {filas.map(([s, d], i) => (
                                <tr key={i} style={{ borderTop: i ? '1px solid var(--a3-filete)' : 'none' }}>
                                    <td style={{ padding: '3px 14px 3px 0', whiteSpace: 'nowrap', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>{s}</td>
                                    <td style={{ padding: '3px 0', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', lineHeight: 1.3 }}>{d}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                        <p style={{ margin: 0 }}>
                            El flujo da <InlineMath math="\mathbf u" /> y <InlineMath math="\partial_t h" />; con ellos, el transporte mueve el nitrato.
                        </p>
                        <p style={{ margin: 0 }}>
                            Resaltado, el almacenamiento <InlineMath math={String.raw`\textcolor{${verde}}{-S_s\partial_t h\,C_m}`} />: la variación de la carga
                            entra en la ecuación móvil.
                        </p>
                        <p style={{ margin: 0 }}>
                            Cada región inmóvil es una EDO en cada punto: retiene nitrato y lo devuelve con retraso.
                        </p>
                    </div>
                </div>
                <p style={{ margin: 0, color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', lineHeight: 1.35 }}>
                    <InlineMath math="W_+" />: fuente de nitrato; pluma inicial en <InlineMath math="C_m" />, <InlineMath math="C_{{\rm im},r}(0)=0" />.
                    Condiciones de frontera en la lámina siguiente.<span className="a3-completa"> El pozo no es un sumidero de soluto: el nitrato sale
                    porque <InlineMath math="\mathbf u" /> converge hacia él.</span>
                </p>
            </div>
            <Notas titulo="Modelo MRMT: detalle">
                <p>
                    <RefEc id="flujo" /> es el balance de agua con almacenamiento y la ley de Darcy; <InlineMath math="g_\varepsilon" /> es un núcleo
                    gaussiano de masa 1 centrado en el pozo (<InlineMath math="\varepsilon=r_{\rm pozo}/3\approx6.7" /> m), así que{' '}
                    <InlineMath math="Q(t)" /> [m²/s] es el caudal por unidad de espesor del corte.
                </p>
                <p>
                    <RefEc id="mrmt" />: el intercambio <InlineMath math="\lambda_r(C_m-C_{{\rm im},r})" /> no contiene <InlineMath math="\mathbf u" />;
                    sumando las ecuaciones se ve que conserva la masa total. Con <InlineMath math="\lambda_r=\phi D_{{\rm eff},r}/L^2" /> y{' '}
                    <InlineMath math="\phi_{{\rm im},r}=\eta_r\phi" />, la tasa <InlineMath math="\alpha_r=1/\tau_r=D_{{\rm eff},r}/(\eta_rRL^2)" /> no depende
                    de <InlineMath math="\phi" />: <InlineMath math="D_{\rm eff}=(10,5,1)\cdot10^{-10}" /> m²/s y <InlineMath math="L=0.01" /> m.
                </p>
                <p>
                    El término resaltado es lo que queda de <InlineMath math="C\,\nabla\!\cdot\mathbf u" /> al escribir el transporte en forma no
                    conservativa con <InlineMath math="\nabla\!\cdot\mathbf u=f-S_s\partial_th" />. <InlineMath math="S_s=\phi" /> es una elección
                    numérica provisional, mucho mayor que los valores típicos de campo. En el modelo MRMT el decaimiento se anula.
                </p>
            </Notas>
        </SlideLayout>
    );
}

A3R04.ecuaciones = ['flujo', 'mrmt'];
