import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import EqCard from '../layouts-v2/EqCard.jsx';
import { Punto, Col, Eq, Titulo, Cita } from './ui.jsx';
import { resalteAlm } from './A3N02.jsx';

const verde = '#2E7D4F';
const eqMRMT = String.raw`\begin{aligned}
&\phi R\,\partial_t C_m+\mathbf u\!\cdot\!\nabla C_m-\nabla\!\cdot(D\nabla C_m)\\
&\quad+\sum_{r=1}^{N_r}\lambda_r\,(C_m-C_{{\rm im},r})\;${resalteAlm('C_m')}=W_+\\[4pt]
&\phi_{{\rm im},r}R\,\partial_t C_{{\rm im},r}=\lambda_r\,(C_m-C_{{\rm im},r}),\quad r=1,\dots,N_r
\end{aligned}`;

export default function A3N07({ theme = 'dark' }) {
    return (
        <SlideLayout title="Modelo MRMT: regiones móvil e inmóviles" theme={theme} justify="flex-start">
            <Col gap={10}>
                <EqCard title={<>Sistema MRMT<span className="a3-completa"> (misma cancelación de fC sobre la ecuación móvil)</span></>}><Eq math={eqMRMT} id='mrmt' /></EqCard>
                <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>
                    Resaltado, el mismo almacenamiento de ADR, ahora con la concentración móvil{' '}
                    <InlineMath math={String.raw`\textcolor{${verde}}{C_m}`} />
                    <span className="a3-completa">: la variación temporal de la carga <InlineMath math="h" /> entra solo en la ecuación móvil; las
                    inmóviles no ven el flujo</span>.
                </p>
                <div className="a3-completa">
                    <Punto size={19}>Transferencia de masa multitasa: la región móvil intercambia soluto con varias regiones inmóviles, cada una con su
                        tasa <Cita k="haggerty1995multirate" />.</Punto>
                </div>
                <div className="a3-completa">
                    <Punto size={19}>El intercambio no contiene <InlineMath math="\mathbf u" /> ni <InlineMath math="f" />; la ecuación inmóvil es una EDO en cada punto y conserva la masa total.</Punto>
                </div>
                <div className="a3-completa">
                    <Punto color="#C4511F" size={19}>
                        Sin regiones inmóviles (<InlineMath math="N_r=0" />) se recupera ADR. El decaimiento{' '}
                        <InlineMath math="\lambda_d\phi R C" /> solo se incluye en ADR; en MRMT <InlineMath math="\lambda_d=0" />.
                        Tres variantes: ADR, MRMT semianalítico y MRMT por bloques (complemento de Schur).
                    </Punto>
                </div>
                {/* versión pública: una idea por viñeta */}
                <div className="a3-publica">
                    <Punto>Intercambio móvil–inmóvil con varias tasas <Cita k="haggerty1995multirate" />.</Punto>
                </div>
                <div className="a3-publica">
                    <Punto>Ecuación inmóvil: una EDO en cada punto; conserva la masa.</Punto>
                </div>
                <div className="a3-publica">
                    <Punto color="#C4511F">Sin regiones inmóviles (<InlineMath math="N_r=0" />) se recupera ADR.</Punto>
                </div>
                <Titulo style={{ marginTop: 6 }}>Parámetros</Titulo>
                <div className="a3-completa">
                    <Punto color="#0F7A85" size={19}>
                        <InlineMath math="\nu_r=\lambda_r/(\phi_{{\rm im},r}R)" /> [1/s]: frecuencia de relajación; tiempo de relajación{' '}
                        <InlineMath math="\tau_r=1/\nu_r" />, de 4 a 14 h en las tres regiones.
                        {' '}<InlineMath math="\eta_r=\phi_{{\rm im},r}/\phi" />: razón de capacidades, <InlineMath math="\sum_r\eta_r=0.3" />.
                    </Punto>
                </div>
                <div className="a3-completa">
                    <Punto color="#0F7A85" size={19}>
                        En cada paso de tiempo la ecuación inmóvil se integra con el trapecio (MRMT por bloques) o con la solución exacta de
                        la EDO lineal (MRMT semianalítico); detalles en el Cap. II.
                    </Punto>
                </div>
                <div className="a3-publica">
                    <Punto color="#0F7A85">Relajación: <InlineMath math="\tau_r=1/\nu_r" />, de 4 a 14 h, con <InlineMath math="\nu_r=\lambda_r/(\phi_{{\rm im},r}R)" />.</Punto>
                </div>
                <div className="a3-publica">
                    <Punto color="#0F7A85">Capacidades: <InlineMath math="\eta_r=\phi_{{\rm im},r}/\phi" />, <InlineMath math="\sum_r\eta_r=0.3" />.</Punto>
                </div>
            </Col>
        </SlideLayout>
    );
}

A3N07.ecuaciones = ['mrmt'];
