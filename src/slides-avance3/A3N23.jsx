import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Tabla, Punto } from './ui.jsx';
import { MODELOS } from './modeloNuevo.js';

const f = (v, d = 3) => Number(v).toPrecision(d);
const cols = [
    { k: 'm', label: 'Modelo' }, { k: 'h', label: 'ΔH rms [m]', mono: true }, { k: 'c', label: 'C  L2 rel', mono: true },
    { k: 'ci', label: 'C  L∞ rel', mono: true }, { k: 'v', label: '|u|  L2 rel', mono: true }, { k: 'vm', label: '|u| L2 máx', mono: true },
    { k: 'ma', label: 'masa BFR/FEM', mono: true },
];

export default function A3N23({ theme = 'dark' }) {
    const rows = MODELOS.map(m => ({
        m: m.label, h: f(m.resumen.H_rms_final_m), c: f(m.resumen.C_L2_rel_final), ci: f(m.resumen.C_Linf_rel_final),
        v: f(m.resumen.V_L2_rel_final), vm: f(m.resumen.V_L2_rel_max), ma: f(m.resumen.masa_ratio_final, 4),
    }));
    const r0 = MODELOS[0].resumen;
    return (
        <SlideLayout title="Directo BFR vs FEniCSx — modelo nuevo, 30 días, configuración de main" theme={theme} justify="flex-start">
            <Tabla cols={cols} rows={rows} size={22} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <Punto color="#4ade80" size={21}>
                    Misma malla (15 626 nodos), misma salida libre, misma fuente (ε_z = 30 m, 5·10⁻¹²) y mismo decaimiento (solo ADR).
                    Rango de H del FEM: {f(r0.H_rango_fem_m)} m; ΔH rms del ADR = {f(100 * r0.H_rms_final_m / r0.H_rango_fem_m, 2)} % del rango.
                </Punto>
                <Punto color="#fb923c" size={21}>
                    Quedan diferencias de discretización (RBF-FD frente a elementos finitos) y de núcleo del pozo (Wendland en BFR); no se han separado.
                </Punto>
                <Punto color="#60a5fa" size={21}>
                    Referencia: con el cierre Neumann de FEniCSx y <code>pfs</code> en BFR el error de |u| era 0.72; con ambos backends en salida libre es el de la tabla.
                </Punto>
            </div>
        </SlideLayout>
    );
}
