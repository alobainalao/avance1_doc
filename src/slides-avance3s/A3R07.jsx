import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { useFases, reducida } from '../slides-avance3/anim.js';
import { CAMPOS } from './camposBloque.js';
import { BLOQUE } from './optimoBloque.js';
import { Campo, Barra, Serie, potencia } from './campos.jsx';

// Campos del modelo MRMT por bloques (versión simplificada; sustituye a las láminas 12–14 de slides-avance3, que
// comparaban discretizaciones): carga h, |u| y concentración móvil C_m en el control inicial de la optimización
// (iterado 1 de la serie 33, z_p⁰ = −600 m), configuración nitrato_vscale_malla_eje_g1_prom, en t = 5, 10, 20 y 30 días
// (fases), y la concentración observada en el pozo, ∫δ_p C_m, en los 72 pasos. Datos: CAMPOS.inicial de
// camposBloque.js (codigo/scripts/exportar_simplificada.py campos inicial … y exportar_simplificada_js.py).
const D = CAMPOS.inicial;
const DIAS = D ? D.t_h.map(t => t / 24) : [];
const FASES = DIAS.map(d => ({ n: `t = ${d} días`, dur: 1.2 }));

const Panel = ({ titulo, children, barra }) => (
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>{titulo}</p>
        {children}
        {barra}
    </div>
);

function Contenido({ k }) {
    const zp = D.x[D.x.length - 1];
    const tdias = D.t_pasos_h.map(t => t / 24);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 34px', flex: 1, minHeight: 0 }}>
            <Panel titulo={<>Carga hidráulica <InlineMath math="h" /> [m]</>}
                   barra={<Barra niveles={D.H.niveles} paleta="H" unidad="m" cada={3} fmt={v => v.toFixed(0)} />}>
                <Campo id="r07-h" bandas={D.H.bandas[k]} niveles={D.H.niveles} paleta="H" zp={zp} />
            </Panel>
            <Panel titulo={<>Velocidad de Darcy <InlineMath math="|\mathbf u|" /> [m/día]</>}
                   barra={<Barra niveles={D.U.niveles} paleta="U" unidad="m/día" cada={2} fmt={v => potencia(v)} />}>
                <Campo id="r07-u" bandas={D.U.bandas[k]} niveles={D.U.niveles} paleta="U" zp={zp} />
            </Panel>
            <Panel titulo={<>Concentración móvil <InlineMath math="C_m" /> [mg/L de nitrato]</>}
                   barra={<Barra niveles={D.C.niveles} paleta="C" unidad="mg/L" fmt={(v, i) => (i === D.C.niveles.length - 1 ? v.toFixed(0) : v)} />}>
                <Campo id="r07-c" bandas={D.C.bandas[k]} niveles={D.C.niveles} paleta="C" zp={zp} />
            </Panel>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ margin: 0, fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>
                    En el pozo: <InlineMath math="\int\delta_p\,C_m" /> [mg/L]
                </p>
                <Serie x={tdias} series={[{ n: 'c', y: D.Cpozo, c: 'var(--a3-pluma)' }]} ylabel="mg/L" t={DIAS[k]} H={200} />
                <p style={{ margin: 0, fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                    El flujo da <InlineMath math="h" /> y <InlineMath math="\mathbf u" />; el transporte por bloques, <InlineMath math="C_m" />. El pozo
                    acelera el agua a su alrededor y la pluma llega a él arrastrada por <InlineMath math="\mathbf u" />.
                </p>
            </div>
        </div>
    );
}

export default function A3R07({ theme = 'dark', entrada = 1 }) {
    const { fase, ir } = useFases(FASES.length ? FASES.map(f => f.dur) : [1], entrada < 0);
    return (
        <SlideLayout title="Campos del modelo MRMT por bloques" theme={theme} justify="flex-start">
            {D ? (
                <>
                    <p style={{ margin: '0 0 6px', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-muted)' }}>
                        Control inicial de la optimización: <InlineMath math="Q^0(t)" /> de {Math.min(...BLOQUE.Q0).toFixed(2)} a{' '}
                        {Math.max(...BLOQUE.Q0).toFixed(2)} m²/s,{' '}
                        <InlineMath math={`z_p^0=${Math.round(D.x[D.x.length - 1])}`} /> m · ○ fuente, ● pozo
                    </p>
                    <Contenido k={fase} />
                    <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                        {FASES.map((f, i) => (
                            <button key={f.n} onClick={() => ir(i, reducida())} title={`ir a: ${f.n}`}
                                    style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)',
                                             color: i === fase ? 'var(--sl-accent)' : 'var(--sl-muted)', fontWeight: i === fase ? 600 : 400,
                                             borderTop: `3px solid ${i === fase ? 'var(--sl-accent)' : 'var(--a3-filete)'}`, paddingTop: 3, minWidth: 110 }}>
                                {f.n}
                            </button>
                        ))}
                    </div>
                </>
            ) : <p style={{ color: 'var(--a3-pluma)', fontFamily: 'var(--a3-sans)' }}>Pendiente: campos del control inicial (exportar_simplificada.py).</p>}
            <Notas titulo="Campos: de dónde salen">
                <p>
                    Una simulación del modelo MRMT por bloques con la configuración de la optimización (malla con eje, <InlineMath math="\Delta t=10" /> h,
                    72 pasos) en el control inicial de la serie 33. <InlineMath math="h" /> y <InlineMath math="C_m" /> se muestran en los nodos (P2 interpolado a
                    P1 para <InlineMath math="C_m" />); <InlineMath math="|\mathbf u|=|K_z(\alpha^2\partial_xh,\partial_zh)|" /> es constante en cada triángulo y
                    se promedia en los nodos con pesos de área. <InlineMath math="C_m" /> se pasa a mg/L de nitrato con el factor de escala de la fuente.
                </p>
                <p>
                    La concentración en el pozo es <InlineMath math="\int\delta_pC_m\,d\Omega" />, con el mismo núcleo gaussiano (masa 1) del término de calidad
                    del funcional. Las regiones inmóviles no se dibujan: su máximo en estos instantes es{' '}
                    {D ? D.Cim_max.map(v => v.toFixed(0)).join(', ') : '—'} mg/L.
                </p>
            </Notas>
        </SlideLayout>
    );
}
