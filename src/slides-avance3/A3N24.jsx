import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { LineChart } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

const COL = ['#2E7D4F', '#0F7A85', '#C4511F'];
const mk = (fn) => MODELOS.map((m, i) => ({ n: m.label, c: COL[i], y: fn(m) }));
const Panel = ({ titulo, children }) => (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', border: '1px solid var(--a3-filete, #C9D3DB)', borderRadius: 8, padding: 6 }}>
        <span style={{ color: 'var(--sl-muted)', fontSize: 19, fontWeight: 700, paddingLeft: 8 }}>{titulo}</span>
        <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
);

export default function A3N24({ theme = 'dark' }) {
    const t = MODELOS[0].series.t_dias;
    return (
        <SlideLayout title="Evolución del error BFR vs FEniCSx" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                {MODELOS.map((m, i) => <span key={m.id} style={{ color: COL[i], fontSize: 21, fontWeight: 700 }}>● {m.label}</span>)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
                <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
                    <Panel titulo="C: error L2 relativo"><LineChart x={t} series={mk(m => m.series.C_L2_rel)} /></Panel>
                    <Panel titulo="|u|: error L2 relativo"><LineChart x={t} series={mk(m => m.series.V_L2_rel)} /></Panel>
                </div>
                <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
                    <Panel titulo="H: error rms [m]"><LineChart x={t} series={mk(m => m.series.H_rms_m)} /></Panel>
                    <Panel titulo="masa de soluto BFR/FEM"><LineChart x={t} series={mk(m => m.series.masa_bfr.map((v, i) => v / (m.series.masa_fem[i] || NaN)))} /></Panel>
                </div>
            </div>
        </SlideLayout>
    );
}
