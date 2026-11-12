import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

/* ── utilidades visuales ─────────────────────────────── */
const Card = ({ color, title, children, style = {} }) => (
    <div style={{
        border: `1.5px solid ${color}44`,
        borderTop: `3px solid ${color}`,
        borderRadius: 8,
        padding: '16px 20px',
        background: 'rgba(0,0,0,0.22)',
        display: 'flex', flexDirection: 'column', gap: 8,
        ...style,
    }}>
        <p style={{ color, fontWeight: 700, fontSize: 22, margin: 0 }}>{title}</p>
        {children}
    </div>
);

const Muted = ({ children, size = 20 }) => (
    <p style={{ color: 'var(--sl-muted)', fontSize: size, margin: 0 }}>{children}</p>
);

/* ── tabla de tasas ──────────────────────────────────── */
const RateRow = ({ label, formula, rate, color }) => (
    <tr>
        <td style={{ color, fontWeight: 700, fontSize: 22, paddingRight: 14, paddingBottom: 6 }}>{label}</td>
        <td style={{ fontSize: 19, paddingBottom: 6 }}><InlineMath math={formula} /></td>
        <td style={{ color, fontWeight: 700, fontSize: 22, paddingLeft: 14, paddingBottom: 6 }}>
            {rate}
        </td>
    </tr>
);

/* ── componente principal ────────────────────────────── */
const A3S06 = ({ theme = 'dark' }) => (
    <SlideLayout title="Test de Taylor: verificación del gradiente adjunto" theme={theme} justify="flex-start">

        {/* contexto del problema */}
        <Muted size={21}>
            Control vectorial&nbsp;
            <InlineMath math={String.raw`\mathbf{u}=(Q_1,\ldots,Q_{N_t},z_p)\in\mathbb{R}^{N_t}\times\mathbb{R}`} />,&nbsp;
            funcional reducido&nbsp;
            <InlineMath math={String.raw`\hat{\mathcal{J}}(\mathbf{u}):=\mathcal{J}(y(\mathbf{u}),\mathbf{u})`} />,&nbsp;
            donde&nbsp;
            <InlineMath math={String.raw`y=(h,c,\bar{c})`} />&nbsp;
            satisface las EDPs en&nbsp;
            <InlineMath math={String.raw`\Omega\times T\subset\mathbb{R}^2\times\mathbb{R}`} />.
        </Muted>

        <div style={{ display: 'flex', gap: '2%', flex: 1, marginTop: 4 }}>

            {/* ── columna izquierda: definición ── */}
            <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: 10 }}>

                <Card color="#60a5fa" title="Perturbación y residuos">
                    <Muted>
                        Fijado&nbsp;<InlineMath math={String.raw`\mathbf{u}_0`} />,&nbsp;
                        dirección aleatoria&nbsp;<InlineMath math={String.raw`\delta\mathbf{u}\in\mathbb{R}^{N_t+1}`} />,&nbsp;
                        tamaño&nbsp;<InlineMath math={String.raw`h>0`} /> decreciente.
                    </Muted>
                    <BlockMath math={String.raw`
                        r_0(h) = \bigl|\hat{\mathcal{J}}(\mathbf{u}_0+h\,\delta\mathbf{u})-\hat{\mathcal{J}}(\mathbf{u}_0)\bigr|
                    `}/>
                    <BlockMath math={String.raw`
                        r_1(h) = \bigl|\hat{\mathcal{J}}(\mathbf{u}_0+h\,\delta\mathbf{u})-\hat{\mathcal{J}}(\mathbf{u}_0)
                                  -h\,\nabla\hat{\mathcal{J}}(\mathbf{u}_0)^{\!\top}\delta\mathbf{u}\bigr|
                    `}/>
                </Card>

                <Card color="#a78bfa" title="Producto interior del gradiente">
                    <Muted>
                        El término lineal se descompone en las dos partes del control:
                    </Muted>
                    <BlockMath math={String.raw`
                        \nabla\hat{\mathcal{J}}^{\!\top}\delta\mathbf{u}
                        = \sum_{k=1}^{N_t}\frac{\partial\hat{\mathcal{J}}}{\partial Q_k}\,\delta Q_k
                          \;+\;\frac{\partial\hat{\mathcal{J}}}{\partial z_p}\,\delta z_p
                    `}/>
                    <Muted>
                        Cada parcial obtenida del sistema adjunto retrogrado en&nbsp;
                        <InlineMath math={String.raw`\Omega\times T`} />.
                    </Muted>
                </Card>

            </div>

            {/* ── columna derecha: tasas + criterio ── */}
            <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: 10 }}>

                <Card color="#f87171" title="Tasas de convergencia esperadas">
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <tbody>
                            <RateRow
                                label="r₀"
                                formula={String.raw`= \mathcal{O}(h^1)`}
                                rate="tasa ≈ 1"
                                color="#f87171"
                            />
                            <RateRow
                                label="r₁"
                                formula={String.raw`= \mathcal{O}(h^2)`}
                                rate="tasa ≈ 2 ✓"
                                color="#4ade80"
                            />
                        </tbody>
                    </table>
                    <Muted>
                        Al reducir&nbsp;<InlineMath math={String.raw`h\to h/2`} />:&nbsp;
                        <InlineMath math={String.raw`r_0`} /> se reduce a la mitad;&nbsp;
                        <InlineMath math={String.raw`r_1`} /> se divide entre 4.
                    </Muted>
                </Card>

                <Card color="#4ade80" title="Criterio de validación">
                    <Muted>
                        El gradiente adjunto es <span style={{ color: '#4ade80', fontWeight: 700 }}>correcto</span> si
                        y solo si&nbsp;<InlineMath math={String.raw`r_1`} />&nbsp;converge a orden 2
                        para <em>cualquier</em> dirección&nbsp;<InlineMath math={String.raw`\delta\mathbf{u}`} />.
                    </Muted>
                    <Muted>
                        Tasa&nbsp;<InlineMath math={String.raw`\approx 1`} />&nbsp;en&nbsp;
                        <InlineMath math={String.raw`r_1`} />&nbsp;⇒ error en alguna parcial&nbsp;
                        <InlineMath math={String.raw`\partial\hat{\mathcal{J}}/\partial Q_k`} />&nbsp;
                        o&nbsp;<InlineMath math={String.raw`\partial\hat{\mathcal{J}}/\partial z_p`} />.
                    </Muted>
                    <div style={{ marginTop: 4, padding: '8px 12px', borderRadius: 6,
                                  background: 'rgba(74,222,128,0.08)', border: '1px solid #4ade8044' }}>
                        <Muted size={19}>
                            En nuestro problema: 6/6 backends pasaron&nbsp;
                            <InlineMath math={String.raw`r_1\sim h^{1.99{-}2.01}`} />&nbsp;
                            (ADR + MRMT, BFR + FEniCS).
                        </Muted>
                    </div>
                </Card>

                <Card color="#f59e0b" title="Intuición geométrica">
                    <Muted>
                        <InlineMath math={String.raw`r_1`} /> mide la diferencia entre
                        la curva real&nbsp;<InlineMath math={String.raw`\hat{\mathcal{J}}(u_0+h\,\delta u)`} />&nbsp;
                        y su tangente lineal.  La curvatura de&nbsp;
                        <InlineMath math={String.raw`\hat{\mathcal{J}}`} /> es&nbsp;
                        <InlineMath math={String.raw`\mathcal{O}(h^2)`} />&nbsp;⇒ confirmación cuadrática.
                    </Muted>
                </Card>

            </div>
        </div>

    </SlideLayout>
);

export default A3S06;
