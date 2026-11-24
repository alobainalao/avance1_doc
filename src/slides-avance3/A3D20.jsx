import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

// Estado del documento de tesis (tesis/docR.tex, páginas del índice de noviembre de 2026), del artículo de
// optimización (articulos/optimizacion-adjunto) y cronograma de hitos. Todo el texto es un primer borrador que hay que
// revisar y reescribir a fondo; el cronograma es tentativo.
const AGUA = '#0F7A85', PLUMA = '#C4511F', GRIS = '#6E7F8D';

const capitulos = [
    { n: '', t: 'Introducción', p: [1, 6], e: 'bor' },
    { n: 'I', t: 'Flujo subterráneo y transporte ADR', p: [7, 33], e: 'bor' },
    { n: 'II', t: 'Transferencia de masa multitasa', p: [34, 60], e: 'bor' },
    { n: 'III', t: 'Control óptimo y método adjunto', p: [61, 94], e: 'bor' },
    { n: 'IV', t: 'Resultados numéricos', p: [95, 110], e: 'inc', nota: 'resultados anteriores; faltan los convergidos' },
    { n: 'A–E', t: 'Anexos: buena postura, esquemas, adjunto, verificación', p: [111, 133], e: 'bor' },
];
const ESTADO = { bor: { c: AGUA, l: 'borrador' }, inc: { c: PLUMA, l: 'incompleto' } };

const hitos = [
    { s: 3, f: 'ene 2027', t: 'Modelo, gradiente verificado y primeros óptimos (este avance)' },
    { s: 4, f: 'jul 2027', t: 'Óptimos convergidos en los tres modelos y frente de Pareto' },
    { s: 5, f: 'ene 2028', t: 'Artículo de optimización enviado; adjunto RBF-FD estable con la malla', meta: true },
    { s: 6, f: 'jul 2028', t: 'Artículo de modelación; reescritura de los capítulos' },
    { s: 7, f: 'ene 2029', t: 'Tesis completa y revisiones', meta: true },
    { s: 8, f: 'jul 2029', t: 'Defensa', meta: true },
];

function Cronograma() {
    return (
        <div style={{ position: 'relative', paddingLeft: 26 }}>
            <div style={{ position: 'absolute', left: 8, top: 10, bottom: 10, width: 2, background: GRIS, opacity: 0.4 }} />
            {hitos.map(h => (
                <div key={h.s} style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12, padding: '4px 0' }}>
                    <span style={{ position: 'absolute', left: h.meta ? -24 : -22, top: h.meta ? 9 : 11, width: h.meta ? 14 : 10, height: h.meta ? 14 : 10,
                                   borderRadius: 8, border: `2.5px solid ${h.meta ? PLUMA : GRIS}`, background: h.s === 3 ? AGUA : 'var(--sl-bg, #fff)' }} />
                    <span style={{ ...lin, minWidth: 54, color: h.s === 3 ? AGUA : 'var(--sl-muted)', fontWeight: h.s === 3 ? 700 : 400 }}>sem {h.s}</span>
                    <span style={{ ...lin, minWidth: 74, color: 'var(--sl-muted)' }}>{h.f}</span>
                    <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: h.meta ? PLUMA : 'var(--sl-text)', lineHeight: 1.3 }}>{h.t}</span>
                </div>
            ))}
        </div>
    );
}

export default function A3D20({ theme = 'dark' }) {
    return (
        <SlideLayout title="Avance del documento de tesis y del artículo" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Tesis: primer borrador de cuatro capítulos y cinco anexos, por revisar y reescribir a fondo</p>
                    <div style={{ borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                        {capitulos.map((c, i) => {
                            const e = ESTADO[c.e], np = c.p[1] - c.p[0] + 1;
                            return (
                                <div key={i} style={{ padding: '7px 4px', borderTop: i ? '1px solid var(--a3-filete, #C9D3DB)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                                        <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)', minWidth: 34 }}>{c.n}</span>
                                        <span style={{ flex: 1, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.25 }}>{c.t}</span>
                                        <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: e.c, fontWeight: 600 }}>{e.l}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 44, marginTop: 4 }}>
                                        <div style={{ height: 8, width: `${np / 34 * 70}%`, background: e.c, opacity: 0.75, borderRadius: 2 }} />
                                        <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 13, color: 'var(--sl-muted)' }}>
                                            pp. {c.p[0]}–{c.p[1]}{c.nota ? ` · ${c.nota}` : ''}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <p style={tit}>Artículo: control óptimo de un pozo por el método adjunto</p>
                    <p style={txt}>
                        Borrador de 26 páginas con el modelo, el problema de control, las restricciones de bomba y tanque y la
                        deducción del adjunto. <span style={{ color: PLUMA }}>Falta:</span> resultados convergidos, frente de Pareto,
                        revisar a fondo la redacción y elegir revista. Todavía sin fecha de envío.
                    </p>
                    <p style={{ ...tit, marginTop: 18 }}>Cronograma tentativo</p>
                    <Cronograma />
                </div>
            </div>
        </SlideLayout>
    );
}

const lin = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)' };
const tit = { margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', fontWeight: 600 };
const txt = { margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.4 };
