import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { DISC } from './discrepanciaTiempo.js';
import { VERIF } from './verificacion.js';
import { usePublica, Notas } from './version.jsx';

// Matriz de las seis implementaciones: modelo de transporte × discretización espacial. En cada celda, el error
// máximo del gradiente adjunto frente a diferencias finitas (paso δ = 10⁻²); a la derecha, la concordancia del directo.
const filas = [
    { id: 'adr', mid: 'M0_adr', nombre: 'ADR', desc: 'advección, dispersión, reacción' },
    { id: 'mrmt_semi', mid: 'M1_mrmt_semi', nombre: 'MRMT semianalítico', desc: 'pasos fraccionados, intercambio exacto' },
    { id: 'mrmt_block', mid: 'M2_mrmt_block', nombre: 'MRMT por bloque', desc: 'sistema acoplado, complemento de Schur' },
];
const cols = [
    { id: 'bfr', nombre: 'RBF-FD', desc: <>colocación, estencil de 25 nodos, multicuádrica + grado 2, nodos fantasma <Cita k="fornberg2015primer" /></> },
    { id: 'fenicsx', nombre: 'Elementos finitos', desc: <>Galerkin, carga P1 y concentración P2 sobre la misma triangulación; FEniCSx <Cita k="baratta2023dolfinx" /></> },
];
const errMax = (b, m) => Math.max(...VERIF.filter(r => r.backend === b && r.modelo === m && r.eps === 0.01).map(r => r.err));
// Sensibilidad del directo a la malla, como la lámina anterior: MÁXIMO en los 144 instantes (30 d) de la L² relativa de C y
// de |u| y de |1 − ∫C_RBF/∫C_EF| (∫C dΩ, sin porosidad); Δh_rms máximo en el tiempo. De las series de comparacion/metricas.json
// (grupos M_modelo_nuevo, MJ_malla_eje, ME_malla_eje05 y, para la nube anterior, las corridas archivadas, que solo guardaron
// series), exportadas por codigo/scripts/metricas_tiempo.py. Misma configuración en todas salvo mesh_pkl. En %, Δh en cm.
const MALLAS = [
    { clave: 'nube', malla: 'nube anterior (archivada)', n: '15 626' },
    { clave: 'conos', malla: 'con conos (esta lámina)', n: '20 348' },
    { clave: 'eje', malla: 'con eje de 1 m (optimización)', n: '25 871' },
    { clave: 'eje05', malla: 'con eje de 0.5 m', n: '39 613' },
];
const pc = (v, d) => (100 * v).toFixed(d);
const SENS = MALLAS.map(m => {
    const r = DISC.sensibilidad[m.clave];          // ADR, MRMT semi, MRMT bloque
    return { ...m, C: r.map(x => pc(x.C_max, 1)), I: r.map(x => pc(x.I_max, x.I_max < 1e-3 ? 3 : 2)), u: pc(r[0].V_max, 1),
             h: (100 * r[0].H_max).toFixed(1) };
});
// columna derecha de la tabla principal: malla con conos, máximo en el tiempo (orden de DISC.sensibilidad)
const DERECHA = { adr: 0, mrmt_semi: 1, mrmt_block: 2 };
const exp10 = (v) => { const e = Math.floor(Math.log10(v)); return <>{(v / 10 ** e).toFixed(1)}·10<sup>{e}</sup></>; };

export default function A3D03({ theme = 'dark' }) {
    const [p] = useProgreso(3000, 300);
    const pub = usePublica();
    return (
        <SlideLayout title="Seis implementaciones del mismo problema" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: pub ? '280px 1fr 1fr 220px' : '300px 1fr 1fr 250px', columnGap: 18, rowGap: 0 }}
                >
                <span />
                {cols.map(c => (
                    <div key={c.id} style={{ paddingBottom: 12, borderBottom: '2px solid var(--sl-text)' }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)', fontWeight: 600 }}>{c.nombre}</p>
                        <p className="a3-completa" style={nota}>{c.desc}</p>
                    </div>
                ))}
                <div style={{ paddingBottom: 12, borderBottom: '2px solid var(--sl-text)', display: 'flex', alignItems: 'flex-end' }}>
                    <p style={nota}>RBF-FD vs EF, máximo en 30 días</p>
                </div>
                {filas.map((f, i) => {
                    const m = DISC.sensibilidad.conos[DERECHA[f.id]];
                    return (
                        <React.Fragment key={f.id}>
                            <div style={{ ...fila, borderBottom: '1px solid var(--a3-filete)' }}>
                                <p style={{ margin: 0, fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', fontWeight: 600 }}>{f.nombre}</p>
                                <p className="a3-completa" style={nota}>{f.desc}</p>
                            </div>
                            {cols.map((c, j) => {
                                const v = tramo(p, 0.08 + 0.13 * (2 * i + j), 0.22 + 0.13 * (2 * i + j));
                                return (
                                    <div key={c.id} style={{ ...fila, borderBottom: '1px solid var(--a3-filete)', opacity: v,
                                                             transform: `translateY(${(1 - v) * 8}px)` }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>
                                            <span style={{ width: 14, height: 14, borderRadius: 7, background: 'var(--a3-valido)' }} />
                                            directo + adjunto
                                        </span>
                                        <span style={nota}>error del gradiente ≤ {exp10(errMax(c.id, f.id))}</span>
                                    </div>
                                );
                            })}
                            <div style={{ ...fila, borderBottom: '1px solid var(--a3-filete)', opacity: tramo(p, 0.85, 1) }}>
                                {m && <>
                                    <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>C: {pc(m.C_max, 1)} %</span>
                                    <span style={nota}><InlineMath math="\textstyle\int C" />: {pc(m.I_max, 2)} %</span>
                                </>}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
            <p className="a3-publica" style={{ ...nota, marginTop: 18 }}>
                Gradiente frente a diferencias finitas (δ = 10⁻²), en mallas de prueba y horizonte corto.
            </p>
            <p className="a3-completa" style={{ ...nota, marginTop: 18 }}>
                Columna derecha (directo): los mismos 20 348 nodos de la malla con conos, la misma configuración y la misma salida
                libre; máximo en los 144 instantes de la L² relativa de C y de |1 − ∫C_RBF/∫C_EF| (∫C dΩ sin porosidad, no es la masa),
                como en la lámina anterior. Celdas (gradiente): mallas de prueba propias
                (30 m en RBF-FD, 120 m en EF), 2 regiones inmóviles, 3 pasos de 10 h, C inicial ≡ 1; error máximo relativo frente a
                diferencias finitas centradas con δ = 10⁻², en 3–4 direcciones. En elementos finitos es redondeo; en RBF-FD decrece como O(δ²).
            </p>
            <Notas titulo="Malla y resultados: procedencia y sensibilidad">
                <h4>De dónde salen las cifras</h4>
                <p>La columna derecha viene de las corridas del grupo M_modelo_nuevo en la malla con conos (20 348 nodos,{' '}
                    <InlineMath math="\Delta t=5" /> h, 30 días): series de sus <code>comparacion/metricas.json</code>, exportadas a{' '}
                    <code>discrepanciaTiempo.js</code> por <code>codigo/scripts/metricas_tiempo.py</code>. Son las mismas corridas que las
                    del grupo MC_malla_conos: mismas métricas en todas las cifras, y los videos de las tres láminas siguientes son, byte a
                    byte, los generados con esas corridas. La lámina de la malla, esta tabla y los videos son coherentes entre sí. En las
                    tres filas, <InlineMath math={`\\Delta h_{\\rm rms}=${SENS[1].h}`} /> cm y <InlineMath math={`e(|\\mathbf u|)=${SENS[1].u}`} /> % coinciden,
                    como debe ser: el flujo no depende del modelo de transporte. Todas las cifras son el máximo en los 144 instantes (la
                    lámina anterior explica por qué); <InlineMath math="C" /> crece con el tiempo, así que su máximo es el valor en{' '}
                    <InlineMath math="T" /> de las versiones anteriores.</p>
                <h4>Sensibilidad a la malla</h4>
                <p>Misma configuración en todas, salvo la malla. Máximo en los 30 días; en %, ADR / MRMT semi / MRMT bloque;{' '}
                    <InlineMath math="\Delta h" /> en cm.</p>
                <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--a3-sans)', fontSize: 15, width: '100%' }}>
                    <thead>
                        <tr>{['malla', 'nodos', 'e(C)', '∫C', 'e(|u|)', 'Δh'].map(c => <th key={c} style={thN}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                        {SENS.map(r => (
                            <tr key={r.n}>
                                <td style={tdN}>{r.malla}</td><td style={tdN}>{r.n}</td>
                                <td style={tdN}>{r.C.join(' / ')}</td><td style={tdN}>{r.I.join(' / ')}</td>
                                <td style={tdN}>{r.u}</td><td style={tdN}>{r.h}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ul style={{ marginTop: 10 }}>
                    <li><b>Carga y concentración</b> se acercan al refinar: <InlineMath math="\Delta h" /> de {SENS[0].h} a {SENS[3].h} cm y{' '}
                        <InlineMath math="e(C)" /> de {SENS[0].C[0]} a {SENS[1].C[0]} % y a {SENS[2].C[0]} %, donde se estanca; las dos mallas con
                        eje refinan solo la columna del pozo, no la pluma.</li>
                    <li><b><InlineMath math="\int C" /></b> fluctúa entre 0.04 y 0.29 % sin tendencia: es una integral con signo y las diferencias
                        se cancelan (notas de la lámina anterior). Ninguna malla pasa del 0.3 % en ningún instante.</li>
                    <li><b><InlineMath math="|\mathbf u|" /></b> no converge de forma monótona: la discrepancia está en la franja permeable y en cómo
                        EF obtiene la velocidad nodal (lámina anterior). En la nube anterior el máximo ({SENS[0].u} %) es el primer paso; del
                        segundo en adelante no pasa de 15.5 %.</li>
                    <li>La optimización usa la malla con eje de 1 m: allí el directo concuerda en C al {SENS[2].C[0]}–{SENS[2].C[2]} % y en{' '}
                        <InlineMath math="\int C" /> al 0.08 % o menos, en todo el horizonte.</li>
                </ul>
                <h4>Qué no dicen estas cifras</h4>
                <ul>
                    <li>No son errores frente a la solución exacta: miden cuánto se separan dos discretizaciones del mismo problema.</li>
                    <li><InlineMath math="\int C\,d\Omega" /> no es la masa (falta <InlineMath math="\phi" />). Con la porosidad, recalculado de
                        los mismos campos: ADR 0.12 %; masa móvil MRMT 0.011–0.012 %.</li>
                    <li>El test del gradiente usa mallas de prueba, distintas en cada método y de la malla con conos, y dos regiones
                        inmóviles. Comprueba que el adjunto discreto da el gradiente del funcional discreto; no mide convergencia con la
                        malla.</li>
                </ul>
            </Notas>
        </SlideLayout>
    );
}

const nota = { margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const fila = { display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px 0', minHeight: 92 };
const thN = { textAlign: 'left', padding: '4px 6px', borderBottom: '1px solid var(--sl-muted)', color: 'var(--sl-accent)', fontWeight: 600 };
const tdN = { padding: '4px 6px', borderBottom: '1px solid var(--a3-filete)', fontVariantNumeric: 'tabular-nums' };
