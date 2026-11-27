import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { ESTADOS, Marca } from '../slides-avance3/estado.jsx';
import { BLOQUE } from './optimoBloque.js';

// Objetivos y estado, versión simplificada (copia de slides-avance3/A3D17.jsx con la misma estructura): solo la línea MRMT
// por bloques con elementos finitos y su optimización; sin la comparación de discretizaciones ni de modelos. Estado al
// 26-nov-2026. Términos del estado (sin «hecho»): completado = terminado y verificado; realizado = terminado, pendiente
// de la revisión del documento o de un parámetro provisional; en desarrollo = en marcha, con resultados preliminares;
// pendiente = sin empezar. Al cerrar la serie MRMT por bloques (100 iteraciones), revisar la fila 4.
const general = 'Formular, resolver numéricamente y optimizar el bombeo de un pozo (caudal y profundidad) con un modelo de transferencia de masa multitasa (MRMT), discretizado por elementos finitos, resuelto por bloques y con el gradiente adjunto.';
const generalPub = 'Optimizar caudal y profundidad del pozo con el gradiente adjunto del modelo MRMT por bloques (elementos finitos).';

const objetivos = [
    { t: 'Modelo MRMT de flujo y transporte: almacenamiento, salida libre y tres regiones inmóviles', p: 'Modelo MRMT de flujo y transporte', e: 'rea', nota: <><InlineMath math="S_s=\phi" /> es provisional; el capítulo está en revisión</> },
    { t: 'Discretización por elementos finitos y esquema por bloques (complemento de Schur)', p: 'Elementos finitos y esquema por bloques', e: 'com', nota: 'P1 para h, P2 para C; Euler implícito, Δt = 10 h' },
    { t: 'Sistema adjunto y gradiente verificado contra diferencias finitas', p: 'Sistema adjunto y gradiente verificado', e: 'com', nota: 'derivadas direccionales en una prueba corta y en la configuración de la optimización' },
    { t: 'Optimización del caudal y la profundidad con bomba y tanque', p: 'Optimización con bomba y tanque', e: 'des', nota: `resultado preliminar en el iterado ${BLOQUE.nit}; la corrida sigue hasta 100` },
    { t: 'Frente de Pareto (barrido del peso γ de la calidad)', p: 'Frente de Pareto (barrido de γ)', e: 'pen' },
    { t: 'Artículo de optimización', p: 'Artículo de optimización', e: 'des', nota: 'borrador; faltan los resultados definitivos' },
];
const cfg = {
    com: { m: 'com', label: 'Completado' },
    rea: { m: 'pre', label: 'Realizado' },
    des: { m: 'des', label: 'En desarrollo' },
    pen: { m: 'pen', label: 'Pendiente' },
};

export default function A3R02({ theme = 'dark' }) {
    return (
        <SlideLayout title="Objetivos y estado de avance" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>Objetivo general</p>
            <p className="a3-completa" style={{ margin: '0 0 16px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>{general}</p>
            <p className="a3-publica" style={{ margin: '0 0 16px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>{generalPub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                {objetivos.map((o, i) => {
                    const c = cfg[o.e], color = ESTADOS[c.m].c;
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 6px',
                                              borderTop: i ? '1px solid var(--a3-filete, #C9D3DB)' : 'none' }}>
                            <Marca e={c.m} size={18} />
                            <span className="a3-completa" style={{ color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', flex: 1, lineHeight: 1.3 }}>{o.t}</span>
                            <span className="a3-publica" style={{ color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', flex: 1, lineHeight: 1.3 }}>{o.p || o.t}</span>
                            {o.nota && <span className="a3-completa" style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', textAlign: 'right', maxWidth: 380 }}>{o.nota}</span>}
                            <span style={{ color, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', minWidth: 150, textAlign: 'right', fontWeight: 600 }}>{c.label}</span>
                        </div>
                    );
                })}
            </div>
            <p style={{ margin: '14px 0 0', padding: '2px 0 2px 12px', borderLeft: '3px solid var(--a3-pluma)', fontFamily: 'var(--a3-sans)',
                        fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>
                <span className="a3-completa">Estado al 26 de noviembre de 2026. La optimización del modelo por bloques sigue hasta 100 iteraciones;
                    sus resultados son preliminares.</span>
                <span className="a3-publica">Estado al 26 de noviembre de 2026; la optimización sigue en curso.</span>
            </p>
            <Notas titulo="Estado de los objetivos: criterio">
                <p>
                    Completado: terminado y verificado. Realizado: terminado, pero pendiente de la revisión del documento o con un
                    parámetro provisional. En desarrollo: en marcha, con resultados preliminares. Pendiente: sin empezar.
                </p>
                <h4>Modelo: realizado</h4>
                <p>
                    El modelo está implementado y documentado, pero <InlineMath math="S_s=\phi" /> [1/m] es una elección numérica provisional,
                    mucho mayor que los valores de campo (10⁻⁶–10⁻⁴ m⁻¹), y el capítulo se está corrigiendo.
                </p>
                <h4>Gradiente: completado</h4>
                <p>
                    La derivada direccional del adjunto coincide con el cociente centrado de diferencias finitas en una prueba corta y en la
                    configuración de la optimización (lámina de verificación).
                </p>
                <h4>Optimización: en desarrollo</h4>
                <p>
                    Iterado {BLOQUE.nit}: <InlineMath math={`z_p=${String(BLOQUE.zp.toFixed(1)).replace('-', '-')}`} /> m,{' '}
                    <InlineMath math={`\\hat J=${BLOQUE.J.toFixed(4)}`} />, <InlineMath math={`\\chi=${BLOQUE.chi.toExponential(1).replace('e', '\\cdot10^{') + '}'}`} />;
                    no ha llegado a <InlineMath math="\chi<10^{-4}" />. Las pruebas de consistencia (arranque en −200 m y reinicio desde el
                    iterado 25) siguen.
                </p>
            </Notas>
        </SlideLayout>
    );
}
