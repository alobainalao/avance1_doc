import React, { useState } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { LineChart, SelectorModelo } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

const Panel = ({ titulo, children }) => (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,216,255,0.2)', borderRadius: 8, padding: 6 }}>
        <span style={{ color: 'var(--sl-muted)', fontSize: 19, fontWeight: 700, paddingLeft: 8 }}>{titulo}</span>
        <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
);

export default function A3N25({ theme = 'dark' }) {
    const [id, setId] = useState(MODELOS[0].id);
    const m = MODELOS.find(x => x.id === id);
    const t = m.series.t_dias;
    return (
        <SlideLayout title="En el pozo: carga hidráulica; concentración máxima" theme={theme} justify="flex-start">
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
                <SelectorModelo modelos={MODELOS} valor={id} onChange={setId} />
                <span style={{ color: '#f87171', fontSize: 21, fontWeight: 700 }}>● BFR</span>
                <span style={{ color: '#60a5fa', fontSize: 21, fontWeight: 700 }}>● FEniCSx</span>
            </div>
            <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
                <Panel titulo="H en el pozo [m]">
                    <LineChart x={t} fmt={v => v.toFixed(2)} series={[{ n: 'BFR', c: '#f87171', y: m.series.Hpozo_bfr }, { n: 'FEM', c: '#60a5fa', y: m.series.Hpozo_fem, dash: '8 5' }]} />
                </Panel>
                <Panel titulo="C máxima en el dominio [kg/m³]">
                    <LineChart x={t} fmt={v => v.toExponential(1)} series={[{ n: 'BFR', c: '#f87171', y: m.series.Cmax_bfr }, { n: 'FEM', c: '#60a5fa', y: m.series.Cmax_fem, dash: '8 5' }]} />
                </Panel>
            </div>
        </SlideLayout>
    );
}
