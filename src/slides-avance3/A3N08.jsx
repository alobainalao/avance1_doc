import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { InlineMath } from 'react-katex';
import { Tabla, Punto } from './ui.jsx';

// Cierres posibles de Γout y qué implementa cada backend (docs/adjunto_sin_sumidero.pdf, §2.2).
const cols = [
    { k: 'c', label: 'Cierre' },
    { k: 'cond', label: 'Condición en Γout' },
    { k: 'dato', label: 'Datos' },
    { k: 'adj', label: 'ψ_h en Γout' },
    { k: 'impl', label: 'Implementación' },
];
const rows = [
    { c: '(A)', cond: 'Dirichlet h = h_out(t,z)', dato: 'h_out', adj: 'ψ_h = 0', impl: 'BFR "dirichlet" (carga constante)' },
    { c: '(B)', cond: 'Neumann u·n = f_out ≥ 0', dato: 'f_out(z)', adj: '(K∇ψ_h − Kb)·n = 0', impl: 'FEniCSx y BFR "fem" con bc_outlet_mode="fem"' },
    { c: '(C)', cond: 'Robin u·n = c_g (h − h_ext)', dato: 'c_g, h_ext', adj: 'Robin con el mismo c_g', impl: '— (no implementado)' },
    { c: '(D)', cond: 'componente normal de ∂ₙu = 0 (Wentzell sin término normal)', dato: 'solo h₀|Γout', adj: 'ψ_h = 0', impl: 'BFR "libre" y FEniCSx (por defecto en esta línea)',
      colors: { c: '#4ade80', cond: '#4ade80', impl: '#4ade80' } },
    { c: '—', cond: 'fila de 2.º orden con término mixto (no equivale a (D) ni al vector)', dato: '—', adj: '—', impl: 'BFR "pfs" (antiguo defecto)', colors: { impl: '#f87171' } },
];

export default function A3N08({ theme = 'dark' }) {
    return (
        <SlideLayout title="Cierres de Γout y qué resuelve cada código" theme={theme} justify="flex-start">
            <Tabla cols={cols} rows={rows} size={21} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <Punto color="#f87171">
                    Con <code>pfs</code> y FEniCSx (Neumann) los backends resolvían problemas distintos en Γout:
                    error relativo de <InlineMath math="|\mathbf u|" /> 0.72 con <code>pfs</code> frente a 0.10 con <code>fem</code> (caso ADR).
                </Punto>
                <Punto color="#4ade80">
                    Adoptado: <b>(D)</b>. La componente tangencial <InlineMath math="\tau\cdot\partial_n\mathbf u=0" /> no se impone: con <InlineMath math="K" /> variable sobredetermina el problema.
                </Punto>
            </div>
        </SlideLayout>
    );
}
