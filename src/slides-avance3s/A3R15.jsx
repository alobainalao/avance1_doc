import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { BLOQUE } from './optimoBloque.js';

// Cierre de la versión simplificada: une las láminas «Avance del documento» (A3D20) y «Estado actual y próximos pasos»
// (A3N22) de slides-avance3 en dos columnas, sin la columna de borradores ni las barras de progreso. Cifras de la
// optimización de optimoBloque.js (preliminares).
const H = BLOQUE.historia, U = H[H.length - 1];
const fmtZ = z => String(Math.round(z)).replace('-', '−');

const realizado = [
    ['Modelo', <>MRMT con almacenamiento, salida libre y tres regiones inmóviles</>],
    ['Numérica', <>elementos finitos (P1/P2), Euler implícito y esquema por bloques con complemento de Schur</>],
    ['Adjunto', <>cinco adjuntos; gradiente verificado contra diferencias finitas (en la dirección de <InlineMath math="z_p" />, un residuo en revisión)</>],
    ['Optimización', <>{U[0]} iteraciones con bomba y tanque: <InlineMath math="\hat J" /> −{(100 * (1 - U[1] / H[0][1])).toFixed(1)} %,{' '}
        <InlineMath math="z_p" /> de {fmtZ(H[0][3])} a {fmtZ(U[3])} m, con más nitrato en el pozo (preliminar)</>],
];
const proyectado = [
    ['Modelo multitasa', <>almacenamiento <InlineMath math="S_s" /> realista; sensibilidad a <InlineMath math="\eta_r" /> y <InlineMath math="\tau_r" />; orden en el tiempo del esquema por bloques</>],
    ['Experimentos', <>convergencia a <InlineMath math="\chi<10^{-4}" />, arranques distintos y frente de Pareto (barrido de γ)</>],
    ['Análisis', <>efecto de la malla y de <InlineMath math="\Delta t" /> en el óptimo; balance del nitrato extraído</>],
    ['Objetivos', <>capítulo de resultados y artículo de optimización</>],
];

const Columna = ({ titulo, color, filas }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 8px', fontSize: 'var(--a3-fs-seccion)', color }}>{titulo}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filas.map(([n, t]) => (
                <div key={n} style={{ borderLeft: `5px solid ${color}`, padding: '4px 0 4px 16px' }}>
                    <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color, fontWeight: 600 }}>{n}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>{t}</p>
                </div>
            ))}
        </div>
    </div>
);

export default function A3R15({ theme = 'dark' }) {
    return (
        <SlideLayout title="Trabajo realizado y proyectado" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 48, flex: 1 }}>
                <Columna titulo="Realizado" color="var(--a3-valido)" filas={realizado} />
                <Columna titulo="Proyectado" color="var(--a3-agua)" filas={proyectado} />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', textAlign: 'center' }}>
                Un modelo, una discretización y un método: MRMT por bloques con elementos finitos, optimizado con el gradiente adjunto.
            </p>
            <Notas titulo="Pendientes concretos">
                <ul>
                    <li>La corrida principal por bloques sigue hasta 100 iteraciones; las pruebas desde −200 m y desde el iterado 25 terminan cerca, pero no
                        en el mismo punto.</li>
                    <li><InlineMath math="S_s=\phi" /> es una elección numérica provisional; su efecto en el óptimo no se ha medido.</li>
                    <li>El esquema por bloques con <InlineMath math="\theta_C=1" /> es de orden uno y el peso <InlineMath math="1-2\kappa_1" /> de la región 1 es
                        negativo con <InlineMath math="\Delta t=10" /> h: está pendiente elegir <InlineMath math="\theta_C" />.</li>
                    <li>La verificación del gradiente confirma las derivadas del funcional discreto; el error de discretización del óptimo (malla y paso de
                        tiempo) está por medir.</li>
                </ul>
            </Notas>
        </SlideLayout>
    );
}
