import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, suave, tramo, lerp } from './anim.js';
import { usePublica } from './version.jsx';

// Qué se corrigió del modelo anterior y su efecto en la concordancia RBF-FD ↔ elementos finitos
// (tesis, Cap. IV §Efecto de la condición de salida; malla con conos: grupo M_modelo_nuevo, 12-nov-2026).
const cambios = [
    { tema: 'Sumidero del pozo',
      antes: String.raw`\ldots-\chi(Q)\,g_\varepsilon\,C`, antesTxt: 'término W₋ explícito en el transporte',
      ahora: String.raw`fC\ \text{se cancela con}\ C\,\nabla\!\cdot\mathbf u`, ahoraTxt: 'el soluto sale con el agua, por advección' },
    { tema: 'Almacenamiento',
      antes: String.raw`\text{omitido}`, antesTxt: 'formas conservativa y no conservativa distintas',
      ahora: String.raw`-S_s\,\partial_t h\,C`, ahoraTxt: 'las dos formas son equivalentes' },
    { tema: 'Salida',
      antes: String.raw`\text{2.º orden}\ \neq\ \mathbf u\!\cdot\!\mathbf n=f_{out}`, antesTxt: 'cada método resolvía otro problema continuo',
      ahora: String.raw`\partial_n(\mathbf u\!\cdot\!\mathbf n)=0`, ahoraTxt: 'salida libre: la misma ecuación de borde en ambos' },
];

// Discrepancia relativa RBF-FD vs FEM al final (t = 30 d), en %, en el caso con fuente y pozo (Q_std = 0.3, ADR).
// Antes: A3_fuente_pozo (codigo/archivo/resultados_json/codigo/experimentos/resumen.csv); ahora: M0_adr
// (codigo/data/output/experimentos/resumen.csv).
const barras = [
    { nombre: '|u|  velocidad', antes: 13.0, ahora: 12.5 },
    { nombre: 'C  concentración', antes: 24.5, ahora: 3.0 },
    { nombre: 'masa de soluto', antes: 1.8, ahora: 0.02 },
];
const ESCALA = 25;

export default function A3D02({ theme = 'dark' }) {
    const [p] = useProgreso(3600, 500);
    const q = suave(tramo(p, 0.35, 1));
    const pub = usePublica();
    return (
        <SlideLayout title="Del modelo anterior al modelo nuevo" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: pub ? '250px 1fr 40px 1fr' : '210px 1fr 40px 1fr', rowGap: 18, columnGap: 18, alignItems: 'center' }}>
                <span />
                <span style={cab}>antes</span><span />
                <span style={{ ...cab, color: 'var(--a3-valido)' }}>ahora</span>
                {cambios.map((c, i) => {
                    const v = tramo(p, 0.05 + 0.1 * i, 0.2 + 0.1 * i);
                    return (
                        <React.Fragment key={c.tema}>
                            <span style={{ fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', fontWeight: 600 }}>{c.tema}</span>
                            <div style={{ ...celda, opacity: 0.55 }}>
                                <InlineMath math={c.antes} />
                                <span className="a3-completa" style={nota}>{c.antesTxt}</span>
                            </div>
                            <span style={{ color: 'var(--sl-muted)', fontSize: 30, textAlign: 'center', opacity: v }}>→</span>
                            <div style={{ ...celda, borderLeftColor: 'var(--a3-valido)', opacity: v }}>
                                <InlineMath math={c.ahora} />
                                <span style={nota}>{c.ahoraTxt}</span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            <div style={{ marginTop: 34 }}>
                <p style={{ margin: '0 0 12px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                    Discrepancia entre RBF-FD y elementos finitos a los 30 días
                </p>
                {barras.map(b => {
                    const v = lerp(b.antes, b.ahora, q);
                    return (
                        <div key={b.nombre} style={{ display: 'grid', gridTemplateColumns: '230px 1fr 110px', alignItems: 'center', gap: 16, margin: '8px 0' }}>
                            <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>{b.nombre}</span>
                            <div style={{ position: 'relative', height: 26 }}>
                                <div style={{ position: 'absolute', inset: 0, width: `${b.antes / ESCALA * 100}%`, border: '1px dashed var(--a3-pluma)', opacity: 0.6 }} />
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${v / ESCALA * 100}%`,
                                              background: q < 1 ? 'var(--a3-pluma)' : 'var(--a3-valido)' }} />
                            </div>
                            <span style={{ fontSize: 'var(--a3-fs-seccion)', textAlign: 'right', color: 'var(--sl-text)', fontVariantNumeric: 'tabular-nums' }}>
                                {v < 1 ? v.toFixed(2) : v.toFixed(1)} %
                            </span>
                        </div>
                    );
                })}
                <p className="a3-publica" style={{ ...nota, marginTop: 10 }}>
                    Antes y ahora difieren también en la malla; la diferencia en <InlineMath math="|\mathbf u|" /> está junto al pozo.
                </p>
                <p className="a3-completa" style={{ ...nota, marginTop: 10 }}>
                    Mismo caso, ADR con fuente y pozo. Antes: condición de salida distinta en cada método, malla común anterior
                    (15 626 nodos). Ahora: salida libre en ambos, malla con conos (20 348 nodos). La diferencia en |u| se concentra
                    junto al pozo y casi no cambia.
                </p>
            </div>
        </SlideLayout>
    );
}

const cab = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' };
const celda = { display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '3px solid var(--a3-estrato)', padding: '4px 0 4px 16px',
                fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' };
