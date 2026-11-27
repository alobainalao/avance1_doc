import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { OPT } from '../slides-avance3/optimoNitrato.js';
import { BLOQUE } from './optimoBloque.js';
import { CAMPOS } from './camposBloque.js';
import { Campo, Barra, Serie } from './campos.jsx';

// Efecto físico de la solución (versión simplificada): control inicial u⁰ frente al último iterado û del modelo MRMT por
// bloques. C_m en t = T (bandas comunes a los dos), concentración observada en el pozo ∫δ_p C_m y carga ∫δ_p h en cada
// paso (scripts/exportar_simplificada.py campos inicial|optimo). Nitrato extraído ≈ Σ_n V_s Q_n Δt · C_pozo,n (1 mg/L =
// 1 g/m³): una estimación con la concentración del núcleo del pozo, no un balance de masa del modelo.
const I = CAMPOS.inicial, O = CAMPOS.optimo;
const AGUA = 'var(--a3-agua)', GRIS = 'var(--a3-estrato)';
const fmtZ = z => String(Math.round(z)).replace('-', '−');
const suma = a => a.reduce((s, v) => s + v, 0);
const volumen = Q => suma(Q.map(q => OPT.V_s * q * OPT.dt));                          // m³
const masa = (Q, C) => suma(Q.map((q, n) => OPT.V_s * q * OPT.dt * C[n])) / 1000;   // kg de nitrato

export default function A3R14({ theme = 'dark' }) {
    if (!I || !O) {
        return (
            <SlideLayout title="La solución óptima en el acuífero" theme={theme} justify="flex-start">
                <p style={{ color: 'var(--a3-pluma)', fontFamily: 'var(--a3-sans)' }}>Pendiente: simulaciones del control inicial y del último iterado (exportar_simplificada.py).</p>
            </SlideLayout>
        );
    }
    const t = I.t_pasos_h.map(h => h / 24);
    const kT = I.t_h.length - 1;
    const zi = I.x[I.x.length - 1], zo = O.x[O.x.length - 1];
    const Qi = I.x.slice(0, -1), Qo = O.x.slice(0, -1);
    const Vi = volumen(Qi), Vo = volumen(Qo), Mi = masa(Qi, I.Cpozo), Mo = masa(Qo, O.Cpozo);
    const mediaC = c => suma(c) / c.length;
    const fila = (n, a, b, u, d = 1) => (
        <tr style={{ borderTop: '1px solid var(--a3-filete)' }}>
            <td style={{ padding: '3px 12px 3px 0', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)' }}>{n}</td>
            <td style={{ padding: '3px 10px', textAlign: 'right', color: GRIS, fontVariantNumeric: 'tabular-nums' }}>{a.toFixed(d)}</td>
            <td style={{ padding: '3px 10px', textAlign: 'right', color: 'var(--sl-text)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{b.toFixed(d)}</td>
            <td style={{ padding: '3px 0', color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)' }}>{u}</td>
        </tr>
    );
    return (
        <SlideLayout title="La solución óptima en el acuífero" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 34, flex: 1, minHeight: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>
                        <InlineMath math="C_m" /> a los 30 días [mg/L], control inicial (<InlineMath math={`z_p=${fmtZ(zi)}`} /> m)
                    </p>
                    <Campo id="r14-i" bandas={I.C.bandas[kT]} niveles={I.C.niveles} paleta="C" zp={zi} />
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>
                        último iterado (<InlineMath math={`z_p=${fmtZ(zo)}`} /> m)
                    </p>
                    <Campo id="r14-o" bandas={O.C.bandas[kT]} niveles={O.C.niveles} paleta="C" zp={zo} />
                    <Barra niveles={O.C.niveles} paleta="C" unidad="mg/L" fmt={(v, i) => (i === O.C.niveles.length - 1 ? v.toFixed(0) : v)} />
                    <table style={{ borderCollapse: 'collapse', marginTop: 4, fontSize: 'var(--a3-fs-cuerpo)' }}>
                        <thead>
                            <tr style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                                <th /><th style={{ textAlign: 'right', padding: '0 10px', fontWeight: 400 }}>inicial</th>
                                <th style={{ textAlign: 'right', padding: '0 10px', fontWeight: 400 }}>óptimo</th><th />
                            </tr>
                        </thead>
                        <tbody>
                            {fila('agua extraída', Vi, Vo, 'm³', 0)}
                            {fila('nitrato medio en el pozo', mediaC(I.Cpozo), mediaC(O.Cpozo), 'mg/L', 1)}
                            {fila('nitrato extraído (estimación)', Mi, Mo, 'kg', 1)}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>
                        Nitrato en el pozo, <InlineMath math="\int\delta_pC_m" />
                    </p>
                    <Serie x={t} ylabel="mg/L" H={180}
                           series={[{ n: 'i', y: I.Cpozo, c: GRIS }, { n: 'o', y: O.Cpozo, c: 'var(--a3-pluma)' }]} />
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>
                        Carga en el pozo, <InlineMath math="\int\delta_p h" />
                    </p>
                    <Serie x={t} ylabel="m" H={180} ymin={Math.floor(Math.min(...I.Hpozo, ...O.Hpozo))} ymax={Math.ceil(Math.max(...I.Hpozo, ...O.Hpozo))}
                           series={[{ n: 'i', y: I.Hpozo, c: GRIS }, { n: 'o', y: O.Hpozo, c: AGUA }]} />
                    <p style={{ margin: '4px 0 0', padding: '6px 12px', borderLeft: '5px solid var(--a3-pluma)', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                        Con <InlineMath math="\gamma=\alpha=\beta=1" />, el óptimo cambia calidad por costo: el pozo sube {Math.round(zo - zi)} m y bombea
                        casi el mismo volumen (lo fija la demanda), pero capta más nitrato: {mediaC(I.Cpozo).toFixed(1)} → {mediaC(O.Cpozo).toFixed(1)} mg/L
                        de media, con un máximo de {Math.max(...O.Cpozo).toFixed(0)} mg/L, bajo la guía de 50.
                    </p>
                    <p style={{ margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                        <span style={{ color: GRIS, fontWeight: 600 }}>━</span> control inicial · <span style={{ fontWeight: 600 }}>━</span> último iterado
                        (iterado {BLOQUE.nit}, preliminar)
                    </p>
                </div>
            </div>
            <Notas titulo="Cómo leer los resultados físicos">
                <p>
                    Las dos simulaciones usan la misma configuración que la optimización y difieren solo en el control: el inicial (iterado 1 de la serie 33)
                    y el último iterado aceptado del modelo por bloques. La concentración en el pozo es <InlineMath math="\int\delta_pC_m\,d\Omega" /> con el
                    núcleo gaussiano del término de calidad; la carga, <InlineMath math="\int\delta_ph\,d\Omega" />.
                </p>
                <p>
                    El nitrato extraído se estima con <InlineMath math="\sum_nV_sQ_n\Delta t\,C_{{\rm pozo},n}" />: es el producto del volumen bombeado por la
                    concentración observada en el pozo, no un balance de masa del modelo; sirve para comparar los dos controles. El valor guía es 50 mg/L
                    de nitrato.
                </p>
                <p>
                    Términos del funcional (normalizados): calidad <InlineMath math="J_m" /> {I.J1.toFixed(3)} → {O.J1.toFixed(3)}, profundidad{' '}
                    <InlineMath math="J_{\rm inst}" /> {I.J2.toFixed(3)} → {O.J2.toFixed(3)}, operación <InlineMath math="J_{\rm op}" /> {I.J3.toFixed(3)} →{' '}
                    {O.J3.toFixed(3)}. Con pesos iguales, lo que se ahorra en profundidad y operación pesa más que lo que empeora la calidad: por eso el
                    frente de Pareto (barrido de γ) es el siguiente experimento.
                </p>
            </Notas>
        </SlideLayout>
    );
}
