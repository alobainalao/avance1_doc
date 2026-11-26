import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from './version.jsx';
import { ESTADOS, Marca } from './estado.jsx';
import { OPT } from './optimoNitrato.js';

// Objetivos del semestre 3 (ROADMAP.md, pista A: gradiente → optimización → Pareto → artículo) y su estado al
// 24 de noviembre de 2026. PROVISIONAL: la optimización con elementos finitos se relanzó desde el inicio el 24-nov
// (serie 33, termina hacia el 26–27-nov) y luego vienen las pruebas de consistencia; al tenerlas, revisar las filas 4 y 6
// y poner PROVISIONAL = false.
// SINCRONIZAR con la tesis corregida (revisión de la versión 03, 25-nov-2026: el modelo y el documento se están corrigiendo;
// esta lámina no debe adelantarse a ellos). Al cerrar la corrección, revisar fila por fila contra docR.tex:
//   1 modelo coherente        → Cap. I–II (ecuaciones finales; S_s = φ sigue siendo provisional)
//   2 dos discretizaciones    → Cap. IV, comparación directa (la lámina 9 informa ahora el máximo en el tiempo, no t = T)
//   3 gradiente verificado    → Cap. IV, verificación del gradiente (horizonte corto, mallas de prueba)
//   4 optimización EF         → Cap. IV, resultados de la serie 33 y pruebas de consistencia
//   6 Pareto                  → Cap. IV, barrido de γ cuando exista
//   7 artículo                → estado real del borrador
// y el objetivo general (ROADMAP.md).
const PROVISIONAL = true;
const general = 'Resolver el problema de control óptimo del pozo (caudal y profundidad) con el gradiente adjunto, en los modelos ADR y MRMT, y verificarlo con dos discretizaciones independientes.';
const generalPub = 'Optimizar caudal y profundidad del pozo con el gradiente adjunto, en ADR y MRMT.';

// t: texto de la versión completa; p: el corto de la pública (si falta, se usa t); nota: solo en la completa.
const objetivos = [
    { t: 'Modelo de flujo y transporte coherente (ADR y MRMT): sin sumidero explícito, con almacenamiento y salida libre', p: 'Modelo coherente de flujo y transporte (ADR y MRMT)', e: 'ok' },
    { t: 'Dos discretizaciones (RBF-FD y elementos finitos) sobre la misma malla y su comparación cuantitativa', p: 'Dos discretizaciones sobre la misma malla, comparadas', e: 'ok' },
    { t: 'Sistema adjunto continuo y discreto; gradiente verificado contra diferencias finitas en las seis variantes', p: 'Gradiente adjunto verificado en las seis variantes (horizonte corto)', e: 'ok', nota: 'en horizonte corto; el adjunto RBF-FD depende de la malla' },
    { t: 'Optimización con bomba y tanque en los tres modelos con elementos finitos', p: 'Optimización con elementos finitos: resultados preliminares', e: 'adv', nota: 'resultados parciales (50 iteraciones); consistencia en curso' },
    { t: 'Optimización con RBF-FD sobre la misma malla y comparación de óptimos', p: 'Optimización con RBF-FD y comparación de óptimos', e: 'pen', nota: 'su adjunto aún depende de la malla' },
    { t: 'Frente de Pareto (barrido de γ)', p: 'Frente de Pareto: por ahora, un barrido preliminar', e: 'wip', nota: <>solo un barrido preliminar de <InlineMath math="z_p" /> (ADR); falta el de γ</> },
    { t: 'Artículo de optimización', p: 'Artículo de optimización (borrador)', e: 'wip', nota: 'borrador; faltan resultados definitivos y revisión a fondo' },
];
// Marca y color comunes con la lámina de estado (estado.jsx): hecho = completo, avanzado = con resultados preliminares,
// en curso = en desarrollo.
const cfg = {
    ok:  { m: 'com', label: 'hecho' },
    adv: { m: 'pre', label: 'avanzado' },
    wip: { m: 'des', label: 'en curso' },
    pen: { m: 'pen', label: 'pendiente' },
};

export default function A3D17({ theme = 'dark' }) {
    return (
        <SlideLayout title="Objetivos del semestre y su estado" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' }}>Objetivo general</p>
            <p className="a3-completa" style={{ margin: '0 0 16px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>{general}</p>
            <p className="a3-publica" style={{ margin: '0 0 16px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 }}>{generalPub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                {objetivos.map((o, i) => {
                    const c = cfg[o.e], color = ESTADOS[c.m].c;
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '9px 6px',
                                              borderTop: i ? '1px solid var(--a3-filete, #C9D3DB)' : 'none' }}>
                            <Marca e={c.m} size={18} />
                            <span className="a3-completa" style={{ color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', flex: 1, lineHeight: 1.3 }}>{o.t}</span>
                            <span className="a3-publica" style={{ color: 'var(--sl-text)', fontSize: 'var(--a3-fs-cuerpo)', flex: 1, lineHeight: 1.3 }}>{o.p || o.t}</span>
                            {o.nota && <span className="a3-completa" style={{ color: 'var(--sl-muted)', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', textAlign: 'right', maxWidth: 380 }}>{o.nota}</span>}
                            <span style={{ color, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', minWidth: 100, textAlign: 'right', fontWeight: 600 }}>{c.label}</span>
                        </div>
                    );
                })}
            </div>
            {PROVISIONAL && (
                <p style={{ margin: '14px 0 0', padding: '2px 0 2px 12px', borderLeft: '3px solid var(--a3-pluma)', fontFamily: 'var(--a3-sans)',
                            fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 }}>
                    <span className="a3-completa">Estado provisional al 24 de noviembre de 2026: se completará cuando terminen las corridas
                        definitivas con elementos finitos (relanzadas desde el inicio) y sus pruebas de consistencia, y se sincronizará con la
                        versión corregida del modelo y de la tesis.</span>
                    <span className="a3-publica">Estado provisional: se actualizará al terminar las corridas definitivas y la revisión de la tesis.</span>
                </p>
            )}
            <Notas titulo="Estado de los objetivos: detalle">
                <p>
                    Marcas (las mismas de la lámina de estado): llena = hecho; media = avanzado, con resultados que todavía no son
                    definitivos; punto = en curso, en marcha y sin resultados definitivos; vacía = pendiente.
                </p>
                <h4>Optimización con elementos finitos: avanzado, no hecho</h4>
                <p>
                    Hay resultados parciales en los tres modelos: la serie 33 (demanda promediada por paso, <InlineMath math="z_p^0=-600" /> m,{' '}
                    <InlineMath math="\gamma=1" />) se detuvo a las {(OPT.serie && OPT.serie.nit) || 50} iteraciones, sin llegar a{' '}
                    <InlineMath math="\chi<10^{-4}" />: {(OPT.modelos || []).map(m => `${m.nombre} ${String(Math.round(m.zp)).replace('-', '−')} m`).join(', ')}.
                    Siguen las pruebas de consistencia: arranque en <InlineMath math="z_p^0=-200" /> m, reinicio desde el iterado 25 y arranques
                    cruzados entre modelos.
                </p>
                <h4>Optimización con RBF-FD: pendiente</h4>
                <p>
                    El adjunto RBF-FD no converge al refinar la malla (<InlineMath math="\psi_C" /> cambia 25–36 %; con elementos finitos,
                    3–10 %). Las corridas de prueba con RBF-FD no son válidas, así que todavía no hay óptimos que comparar.
                </p>
                <h4>Frente de Pareto: en curso</h4>
                <p>
                    Solo existe un barrido de <InlineMath math="z_p" /> (de −1300 a −220 m) con el caudal fijo de un iterado de ADR. No es aún el
                    frente: falta reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />, y rehacerlo
                    con el óptimo de la serie definitiva.
                </p>
                <h4>Artículo: en curso</h4>
                <p>Borrador de 26 páginas, sin resultados definitivos ni revista elegida; requiere revisión a fondo.</p>
                <h4>Al terminar la serie 33</h4>
                <ul>
                    <li>Revisar las filas de la optimización con elementos finitos y del frente de Pareto.</li>
                    <li>Quitar el aviso de estado provisional.</li>
                </ul>
            </Notas>
        </SlideLayout>
    );
}
