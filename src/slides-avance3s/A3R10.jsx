import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Notas } from '../slides-avance3/version.jsx';
import { useFases, reducida } from '../slides-avance3/anim.js';
import { CAMPOS } from './camposBloque.js';
import { Campo, Barra } from './campos.jsx';

// Los cinco adjuntos del modelo MRMT por bloques (versión simplificada; sustituye a las láminas 23–25 de slides-avance3,
// que comparaban discretizaciones): ψ_h, −ψ_C y −ψ_im,r (r = 1, 2, 3) en el control inicial de la optimización, en
// t = 5, 15 y 25 días (fases; el adjunto se resuelve hacia atrás desde T = 30 días). Cada campo, entre su máximo |ψ| en
// esos instantes (adimensional): la forma, no la magnitud. Datos: CAMPOS.inicial (exportar_simplificada.py campos inicial
// … --adjunto; ψ_C y ψ_im en P2 interpolados a P1, ψ_im del vector dual con _campo_desde_dual).
const D = CAMPOS.inicial;
const TA = D && D.t_adj_h ? D.t_adj_h.map(t => t / 24) : [];
const FASES = TA.map(d => ({ n: `t = ${d} días`, dur: 1.2 }));
const TAU = ['4.2 h', '5.6 h', '13.9 h'];

const Panel = ({ titulo, campo, k, id, zp }) => (
    <div style={{ minWidth: 0 }}>
        <p style={{ margin: '0 0 1px', fontSize: 'var(--a3-fs-etiqueta)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-text)', fontWeight: 600 }}>{titulo}</p>
        <Campo id={id} bandas={campo.bandas[k]} niveles={campo.niveles} paleta="adj" zp={zp} />
    </div>
);

export default function A3R10({ theme = 'dark', entrada = 1 }) {
    const { fase, ir } = useFases(FASES.length ? FASES.map(f => f.dur) : [1], entrada < 0);
    if (!D || !D.psiH) {
        return (
            <SlideLayout title="Los cinco adjuntos del modelo MRMT por bloques" theme={theme} justify="flex-start">
                <p style={{ color: 'var(--a3-pluma)', fontFamily: 'var(--a3-sans)' }}>Pendiente: adjuntos del control inicial (exportar_simplificada.py … --adjunto).</p>
            </SlideLayout>
        );
    }
    const zp = D.x[D.x.length - 1];
    return (
        <SlideLayout title="Los cinco adjuntos del modelo MRMT por bloques" theme={theme} justify="flex-start">
            <p style={{ margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 }}>
                Un adjunto por variable de estado. Se resuelven hacia atrás desde <InlineMath math="T" />: muestran dónde y cuándo un cambio del
                estado afectaría al nitrato que capta el pozo.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 30px' }}>
                <Panel id="r10-h" titulo={<>Flujo, <InlineMath math="\psi_h" /></>} campo={D.psiH} k={fase} zp={zp} />
                <Panel id="r10-c" titulo={<>Región móvil, <InlineMath math="-\psi_C" /></>} campo={D.psiC} k={fase} zp={zp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px 22px', marginTop: 4 }}>
                {D.psiIm.map((c, r) => (
                    <Panel key={r} id={`r10-im${r}`} titulo={<>Inmóvil {r + 1}, <InlineMath math={`-\\psi_{{\\rm im},${r + 1}}`} /> <span style={{ fontWeight: 400, color: 'var(--sl-muted)' }}>(τ = {TAU[r]})</span></>}
                           campo={c} k={fase} zp={zp} />
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 6 }}>
                <Barra niveles={D.psiH.niveles} paleta="adj" unidad="ψ / máx |ψ|" fmt={v => (Math.abs(v) > 1 ? (v > 0 ? '1' : '−1') : String(v).replace('-', '−'))} ancho={420} />
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                    {FASES.map((f, i) => (
                        <button key={f.n} onClick={() => ir(i, reducida())} title={`ir a: ${f.n}`}
                                style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)',
                                         color: i === fase ? 'var(--sl-accent)' : 'var(--sl-muted)', fontWeight: i === fase ? 600 : 400,
                                         borderTop: `3px solid ${i === fase ? 'var(--sl-accent)' : 'var(--a3-filete)'}`, paddingTop: 3, minWidth: 110 }}>
                            {f.n}
                        </button>
                    ))}
                </div>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--a3-fs-nota)', fontFamily: 'var(--a3-sans)', color: 'var(--sl-muted)' }}>
                Control inicial de la optimización; cada campo normalizado por su máximo en los tres instantes (escala logarítmica simétrica).
            </p>
            <Notas titulo="Cómo leer los adjuntos">
                <p>
                    <InlineMath math="\psi_C" /> es el multiplicador de la ecuación móvil: su valor en un punto y un instante mide cuánto cambiaría el término de
                    calidad <InlineMath math="J_m" /> si se añadiera nitrato allí y entonces. Es negativo con la convención{' '}
                    <InlineMath math="L=J+\langle R,\psi\rangle" />; se dibuja <InlineMath math="-\psi_C" />. Nace en el pozo (fuente{' '}
                    <InlineMath math="\partial J_m/\partial C_m" />) y viaja hacia atrás en el tiempo y aguas arriba.
                </p>
                <p>
                    Los tres <InlineMath math="\psi_{{\rm im},r}" /> solo se alimentan de <InlineMath math="\psi_C" /> por el intercambio: el nitrato guardado en
                    una región inmóvil llega al pozo con retraso. <InlineMath math="\psi_h" /> recoge el efecto de la carga sobre el transporte (por{' '}
                    <InlineMath math="\mathbf u" /> y por el almacenamiento) y da la sensibilidad a <InlineMath math="Q" /> y a <InlineMath math="z_p" />.
                </p>
                <p>
                    Cada panel está normalizado por su propio máximo: comparan formas, no magnitudes. Los adjuntos se calcularon con la misma resolución que da
                    el gradiente de la optimización en el control inicial.
                </p>
            </Notas>
        </SlideLayout>
    );
}
