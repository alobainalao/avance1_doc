import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import Escena, { POZO } from './escena.jsx';
import { useProgreso, suave, tramo, lerp } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Apertura: la pregunta de la tesis sobre el dominio real. La pluma avanza desde la fuente y el pozo sube de su
// profundidad inicial a la óptima (ADR, γ = 1, malla con conos).
const ZP_OPT = OPT.modelos.length ? OPT.modelos[0].zp : POZO.z;

const pasos = [
    ['Un modelo coherente', 'flujo + transporte ADR / MRMT, dos discretizaciones que coinciden'],
    ['Un problema de control', 'caudal y profundidad del pozo, sujetos a las EDP y al tanque'],
    ['Un gradiente exacto y barato', 'método adjunto: una simulación directa y una hacia atrás'],
    ['Una decisión de operación', 'cuánto bombear cada 10 h y a qué profundidad'],
];

export default function A3D01({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(5200, 400);
    const zp = lerp(POZO.z, ZP_OPT, suave(tramo(p, 0.55, 1)));
    return (
        <SlideLayout title="¿Cuánto y a qué profundidad bombear sin captar el nitrato?" theme={theme} justify="flex-start">
            <div onClick={repetir} style={{ cursor: 'pointer' }} title="clic para repetir">
                <Escena pluma={suave(tramo(p, 0, 0.6))} zp={zp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 6 }}>
                {pasos.map(([t, d], i) => {
                    const v = tramo(p, 0.15 + 0.18 * i, 0.3 + 0.18 * i);
                    return (
                        <div key={t} style={{ opacity: 0.25 + 0.75 * v, borderTop: '2px solid var(--a3-agua)', paddingTop: 10 }}>
                            <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>{i + 1}</p>
                            <p style={{ margin: '2px 0 4px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', fontWeight: 600, lineHeight: 1.15 }}>{t}</p>
                            <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>{d}</p>
                        </div>
                    );
                })}
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>
                Controles: <InlineMath math="Q(t)" /> constante a trozos en 72 intervalos de 10 h y la profundidad{' '}
                <InlineMath math="z_p\in[-1400,-200]" /> m. La demanda (1 000 m³/día) pasa por un tanque de 2 000 m³.
            </p>
        </SlideLayout>
    );
}
