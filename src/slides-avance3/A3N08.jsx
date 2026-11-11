import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { InlineMath } from 'react-katex';
import { Tabla, Punto } from './ui.jsx';

// Cierres posibles de Γout y qué implementa cada backend (docs/adjunto_sin_sumidero.pdf, §2.2).
const cols = [
    { k: 'c', label: 'Cierre' },
    { k: 'cond', label: 'Condición en Γout' },
    { k: 'dato', label: 'Datos' },
    { k: 'adj', label: 'Adjunto ψh en Γout' },
    { k: 'impl', label: 'Implementación' },
];
const rows = [
    { c: '(A)', cond: <>Dirichlet <InlineMath math={String.raw`h=h_{\rm out}(t,z)`} /></>, dato: <InlineMath math={String.raw`h_{\rm out}`} />, adj: <InlineMath math={String.raw`\psi_h=0`} />, impl: '—' },
    { c: '(B)', cond: <>Neumann <InlineMath math={String.raw`\mathbf u\cdot\mathbf n=f_{\rm out}\ge 0`} /></>, dato: <InlineMath math={String.raw`f_{\rm out}(z)`} />, adj: <InlineMath math={String.raw`(K\nabla\psi_h-K\mathbf b)\cdot\mathbf n=0`} />, impl: '—' },
    { c: '(C)', cond: <>Robin <InlineMath math={String.raw`\mathbf u\cdot\mathbf n=c_g(h-h_{\rm ext})`} /></>, dato: <InlineMath math={String.raw`c_g,\ h_{\rm ext}`} />, adj: 'Robin con el mismo c_g', impl: '—' },
    { c: '(D)', cond: <>componente normal de <InlineMath math={String.raw`\partial_n\mathbf u=0`} /></>, dato: <>solo <InlineMath math={String.raw`h_0|_{\Gamma_{\rm out}}`} /></>, adj: <InlineMath math={String.raw`\psi_h=0`} />, impl: 'BFR y FEniCSx',
      colors: { c: '#2E7D4F', cond: '#2E7D4F', impl: '#2E7D4F' } },
];

export default function A3N08({ theme = 'dark' }) {
    return (
        <SlideLayout title="Cierres posibles de Γout" theme={theme} justify="flex-start">
            <Tabla cols={cols} rows={rows} size={21} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <Punto color="#0F7A85">
                    (A)–(C) piden un dato en Γout (carga, flujo normal o un acuífero exterior) que el problema no tiene; (D) solo usa <InlineMath math="h_0" />.
                </Punto>
                <Punto color="#2E7D4F">
                    Adoptado: <b>(D)</b>. La componente tangencial <InlineMath math="\tau\cdot\partial_n\mathbf u=0" /> no se impone: con <InlineMath math="K" /> variable sobredetermina el problema.
                </Punto>
            </div>
        </SlideLayout>
    );
}
