import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo } from './anim.js';
import { MODELOS } from './modeloNuevo.js';
import { VERIF } from './verificacion.js';

// Matriz de las seis implementaciones: modelo de transporte × discretización espacial. En cada celda, el error
// máximo del gradiente adjunto frente a diferencias finitas (ε = 10⁻²); a la derecha, la concordancia del directo.
const filas = [
    { id: 'adr', mid: 'M0_adr', nombre: 'ADR', desc: 'advección, dispersión, reacción' },
    { id: 'mrmt_semi', mid: 'M1_mrmt_semi', nombre: 'MRMT semianalítico', desc: 'pasos fraccionados, intercambio exacto' },
    { id: 'mrmt_block', mid: 'M2_mrmt_block', nombre: 'MRMT por bloque', desc: 'sistema acoplado, complemento de Schur' },
];
const cols = [
    { id: 'bfr', nombre: 'RBF-FD', desc: 'colocación, estencil de 25 nodos, multicuádrica + grado 2, nodos fantasma' },
    { id: 'fenicsx', nombre: 'Elementos finitos', desc: 'Galerkin, carga P1 y concentración P2 sobre la misma triangulación' },
];
const errMax = (b, m) => Math.max(...VERIF.filter(r => r.backend === b && r.modelo === m && r.eps === 0.01).map(r => r.err));
const exp10 = (v) => { const e = Math.floor(Math.log10(v)); return <>{(v / 10 ** e).toFixed(1)}·10<sup>{e}</sup></>; };

export default function A3D03({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(3000, 300);
    return (
        <SlideLayout title="Seis implementaciones del mismo problema" theme={theme} justify="flex-start">
            <div onClick={repetir} style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '300px 1fr 1fr 250px', columnGap: 18, rowGap: 0 }}
                 title="clic para repetir">
                <span />
                {cols.map(c => (
                    <div key={c.id} style={{ paddingBottom: 12, borderBottom: '2px solid var(--sl-text)' }}>
                        <p style={{ margin: 0, fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)', fontWeight: 600 }}>{c.nombre}</p>
                        <p style={nota}>{c.desc}</p>
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
                                <p style={nota}>{f.desc}</p>
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
                                    <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>C: {(100 * m.C_L2_rel_final).toFixed(1)} %</span>
                                    <span style={nota}>masa: {(100 * Math.abs(1 - m.masa_ratio_final)).toFixed(2)} %</span>
                                </>}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
            <p style={{ ...nota, marginTop: 18 }}>
                Mismos nodos, misma geometría, mismos parámetros y la misma salida libre. Error del gradiente: máximo
                relativo frente a diferencias finitas centradas con ε = 10⁻², en 3–4 direcciones (C ≡ 1, tres pasos de 10 h).
                En elementos finitos es redondeo; en RBF-FD decrece como O(ε²).
            </p>
        </SlideLayout>
    );
}

const nota = { margin: '4px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
const fila = { display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px 0', minHeight: 92 };
