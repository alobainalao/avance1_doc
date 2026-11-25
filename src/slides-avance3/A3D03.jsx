import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { MODELOS } from './modeloNuevo.js';
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
// Sensibilidad del directo a la malla (auditoría del 24-nov-2026): C_L2_rel_final, |1 − masa_ratio_final| (∫C dΩ, sin
// porosidad), V_L2_rel_final y H_rms_final_m de codigo/data/output/experimentos/resumen.csv (grupos M_modelo_nuevo,
// MJ_malla_eje, ME_malla_eje05) y, para la nube anterior, de codigo/archivo/resultados_json/codigo/experimentos/resumen.csv
// (grupo M_modelo_nuevo con 15 626 nodos, solo métricas). Misma configuración en todas salvo mesh_pkl. En %, salvo Δh en cm.
const SENS = [
    { malla: 'nube anterior (archivada)', n: '15 626', C: ['5.4', '5.5', '5.5'], I: ['0.12', '0.015', '0.034'], u: '15.5', h: '2.4' },
    { malla: 'con conos (esta lámina)', n: '20 348', C: ['3.0', '3.0', '3.1'], I: ['0.017', '0.12', '0.12'], u: '12.5', h: '1.7' },
    { malla: 'con eje de 1 m (optimización)', n: '25 871', C: ['2.4', '2.5', '2.5'], I: ['0.079', '0.052', '0.054'], u: '10.9', h: '1.3' },
    { malla: 'con eje de 0.5 m', n: '39 613', C: ['2.4', '2.4', '2.4'], I: ['0.29', '0.029', '0.026'], u: '12.0', h: '1.1' },
];
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
                    <p style={nota}>RBF-FD vs EF a 30 días</p>
                </div>
                {filas.map((f, i) => {
                    const m = MODELOS.find(x => x.id === f.mid)?.resumen;
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
                                    <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>C: {(100 * m.C_L2_rel_final).toFixed(1)} %</span>
                                    <span style={nota}><InlineMath math="\textstyle\int C" />: {(100 * Math.abs(1 - m.masa_ratio_final)).toFixed(2)} %</span>
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
                Columna derecha (directo, 30 días): los mismos 20 348 nodos de la malla con conos, la misma configuración y la misma salida
                libre; C en norma L² relativa y ∫C dΩ sin porosidad (no es la masa; ver notas). Celdas (gradiente): mallas de prueba propias
                (30 m en RBF-FD, 120 m en EF), 2 regiones inmóviles, 3 pasos de 10 h, C inicial ≡ 1; error máximo relativo frente a
                diferencias finitas centradas con δ = 10⁻², en 3–4 direcciones. En elementos finitos es redondeo; en RBF-FD decrece como O(δ²).
            </p>
            <Notas titulo="Malla y resultados: procedencia y sensibilidad">
                <h4>De dónde salen las cifras</h4>
                <p>La columna derecha viene de las corridas del grupo M_modelo_nuevo en la malla con conos (20 348 nodos,{' '}
                    <InlineMath math="\Delta t=5" /> h, 30 días), exportadas a <code>modeloNuevo.js</code>. Son las mismas corridas que las
                    del grupo MC_malla_conos: mismas métricas en todas las cifras, y los videos de las tres láminas siguientes son, byte a
                    byte, los generados con esas corridas. La lámina de la malla, esta tabla y los videos son coherentes entre sí. En las
                    tres filas, <InlineMath math="\Delta h_{\rm rms}=1.7" /> cm y <InlineMath math="e(|\mathbf u|)=12.5" /> % coinciden, como debe
                    ser: el flujo no depende del modelo de transporte.</p>
                <h4>Sensibilidad a la malla</h4>
                <p>Misma configuración en todas, salvo la malla. En %, ADR / MRMT semi / MRMT bloque; <InlineMath math="\Delta h" /> en cm.</p>
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
                    <li><b>Carga y concentración</b> se acercan al refinar: <InlineMath math="\Delta h" /> de 2.4 a 1.1 cm y{' '}
                        <InlineMath math="e(C)" /> de 5.4 a 3.0 % y a 2.4 %, donde se estanca; las dos mallas con eje refinan solo la columna
                        del pozo, no la pluma.</li>
                    <li><b><InlineMath math="\int C" /></b> fluctúa entre 0.015 y 0.29 % sin tendencia: es una integral con signo y las diferencias
                        se cancelan (notas de la lámina anterior). Ninguna malla pasa del 0.3 %.</li>
                    <li><b><InlineMath math="|\mathbf u|" /></b> no converge de forma monótona: la discrepancia está en la franja permeable y en cómo
                        EF obtiene la velocidad nodal (lámina anterior).</li>
                    <li>La optimización usa la malla con eje de 1 m: allí el directo concuerda en C al 2.4–2.5 % y en{' '}
                        <InlineMath math="\int C" /> al 0.08 % o menos.</li>
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
