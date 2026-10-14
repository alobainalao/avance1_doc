import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const A3S04b = ({ theme = 'dark' }) => (
    <SlideLayout
        title="Test de Taylor — fundamento teórico"
        theme={theme}
        justify="flex-start"
    >
        {/* ── Bloque principal: expansión de Taylor ── */}
        <div style={{
            background: 'rgba(0,0,0,0.28)',
            border: '1px solid rgba(0,216,255,0.22)',
            borderRadius: 10, padding: '18px 28px',
            flexShrink: 0,
        }}>
            <p style={{ margin: '0 0 10px', color: 'var(--sl-accent)', fontWeight: 700, fontSize: 24 }}>
                Teorema de Taylor de 2.º orden para funcionales
            </p>
            <p style={{ margin: '0 0 8px', color: 'var(--sl-text)', fontSize: 22, lineHeight: 1.6 }}>
                Si <InlineMath math={"J:\\mathcal{U}\\to\\mathbb{R}"} /> es Fréchet-diferenciable en <InlineMath math={"u"} />,
                para toda dirección <InlineMath math={"\\delta u\\in\\mathcal{U}"} /> y escalar <InlineMath math={"h>0"} />:
            </p>
            <BlockMath math={"J(u + h\\,\\delta u) = J(u) + h\\,\\langle\\nabla J(u),\\,\\delta u\\rangle_{\\mathcal{U}^*,\\mathcal{U}} + \\mathcal{O}(h^2)"} />
        </div>

        {/* ── Residuos y criterio ── */}
        <div style={{ display: 'flex', gap: '3%', flexShrink: 0 }}>
            <div style={{
                flex: 1,
                background: 'rgba(0,0,0,0.20)',
                border: '1px solid rgba(0,216,255,0.18)',
                borderRadius: 8, padding: '14px 20px',
            }}>
                <p style={{ margin: '0 0 6px', color: 'var(--sl-accent)', fontWeight: 700, fontSize: 22 }}>
                    Residuos
                </p>
                <BlockMath math={"r_0(h) = |J(u{+}h\\delta u) - J(u)| = \\mathcal{O}(h)"} />
                <BlockMath math={"r_1(h) = |J(u{+}h\\delta u) - J(u) - h\\langle\\nabla J,\\delta u\\rangle| = \\mathcal{O}(h^2)"} />
            </div>
            <div style={{
                flex: 1,
                background: 'rgba(167,139,250,0.07)',
                border: '1px solid rgba(167,139,250,0.35)',
                borderRadius: 8, padding: '14px 20px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
                <p style={{ margin: '0 0 6px', color: '#a78bfa', fontWeight: 700, fontSize: 22 }}>
                    Criterio de aceptación
                </p>
                <BlockMath math={"\\frac{r_1(h)}{r_1(h/2)} \\xrightarrow{h\\to 0} 4 \\quad (\\text{ratio teórico})"} />
                <p style={{ margin: '6px 0 0', color: 'var(--sl-text)', fontSize: 20, lineHeight: 1.5 }}>
                    Si <InlineMath math={"\\nabla J"} /> es incorrecto,{' '}
                    <InlineMath math={"r_1 = \\mathcal{O}(h)"} /> y el ratio converge a <InlineMath math={"2"} />, no a <InlineMath math={"4"} />.
                </p>
            </div>
        </div>

        {/* ── Ventaja sobre FD ── */}
        <div style={{
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(96,165,250,0.28)',
            borderRadius: 8, padding: '14px 20px', flexShrink: 0,
        }}>
            <p style={{ margin: '0 0 6px', color: '#60a5fa', fontWeight: 700, fontSize: 22 }}>
                Ventaja sobre el test de diferencias finitas centradas
            </p>
            <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 21, lineHeight: 1.55 }}>
                El checkpoint FD compara <InlineMath math={"\\nabla J"} /> contra{' '}
                <InlineMath math={"\\delta_\\varepsilon J"} />, que tiene su propio error de truncamiento{' '}
                <InlineMath math={"\\mathcal{O}(\\varepsilon^2)"} /> que contamina el diagnóstico.
                El test de Taylor evalúa directamente la consistencia de <InlineMath math={"\\nabla J"} />{' '}
                con la variación del funcional — <strong>sin referencia externa</strong>.
            </p>
        </div>

        {/* ── Validez y refs ── */}
        <div style={{
            background: 'rgba(74,222,128,0.05)',
            border: '1px solid rgba(74,222,128,0.20)',
            borderRadius: 8, padding: '12px 20px', flexShrink: 0,
        }}>
            <p style={{ margin: '0 0 4px', color: '#4ade80', fontWeight: 700, fontSize: 21 }}>
                Validez para este problema
            </p>
            <p style={{ margin: 0, color: 'var(--sl-text)', fontSize: 20, lineHeight: 1.55 }}>
                El funcional <InlineMath math={"J(Q,z_p)=\\gamma J_m + J_e"} /> es Fréchet-diferenciable
                sobre <InlineMath math={"\\mathcal{U}_{ad}\\subset L^2(0,T)\\times\\mathbb{R}"} />{' '}
                bajo las hipótesis de regularidad del sistema ADR/MRMT —
                garantizando la validez del criterio de convergencia cuadrática.
            </p>
            <p style={{ margin: '6px 0 0', color: 'var(--sl-muted)', fontSize: 18, fontStyle: 'italic' }}>
                Farrell et al., SIAM J. Sci. Comput. 35 (2013) · Plessix, Geoph. J. Int. 167 (2006) · Tröltzsch (2010)
            </p>
        </div>
    </SlideLayout>
);

export default A3S04b;
