import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo, suave } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Ĵ(z_p) cada metro con el mismo caudal (óptimo ADR de la primera corrida), FEniCSx: en la malla con conos
// (h ≈ 4.9 m en el eje del pozo) Ĵ ondula y tiene mínimos locales; con la franja de 1 m en el eje es monótona
// (codigo/data/output/_logs_malla_conos/13_fino_r20.log y 15_fino_eje.log).
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', VALIDO = 'var(--a3-valido)', GRIS = 'var(--a3-estrato)';

// mínimos locales estrictos de una serie
const minimos = J => J.map((v, i) => (i > 0 && i < J.length - 1 && v < J[i - 1] && v < J[i + 1] ? i : -1)).filter(i => i >= 0);

function Barrido({ p }) {
    const { conos, eje: fina } = OPT.ondulacion;
    const W = 700, H = 400, x0 = 70, x1 = W - 20;
    const zs = conos.zp, za = Math.min(...zs), zb = Math.max(...zs);
    const todos = [...conos.J, ...fina.J], a = Math.min(...todos) - 2e-4, b = Math.max(...todos) + 2e-4;
    const sx = z => x0 + (z - za) / (zb - za) * (x1 - x0), sy = v => 20 + (b - v) / (b - a) * (H - 70);
    const fc = suave(tramo(p, 0.05, 0.45)), fe = suave(tramo(p, 0.55, 0.9));
    const linea = (s, f) => {
        const k = Math.max(1, Math.round(f * (s.zp.length - 1)));
        return s.zp.slice(0, k + 1).map((z, i) => `${sx(z)},${sy(s.J[i])}`).join(' ');
    };
    const mins = minimos(conos.J);
    const marcas = [];
    for (let v = Math.ceil(a * 1000) / 1000; v <= b; v += 0.001) marcas.push(v);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {marcas.map(v => (
                <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={GRIS} strokeOpacity="0.2" />
                    <text x={x0 - 8} y={sy(v) + 5} textAnchor="end" style={eje}>{v.toFixed(3)}</text></g>
            ))}
            {[-450, -445, -440, -435, -430].map(z => (
                <text key={z} x={sx(z)} y={H - 28} textAnchor="middle" style={eje}>{String(z).replace('-', '−')}</text>
            ))}
            <text x={(x0 + x1) / 2} y={H - 6} textAnchor="middle" style={eje}>profundidad del pozo z<tspan dy="5" fontSize="11">p</tspan><tspan dy="-5"> [m]</tspan></text>
            {fc > 0 && <polyline points={linea(conos, fc)} fill="none" stroke={PLUMA} strokeWidth="2.6" />}
            {fc >= 1 && mins.map(i => <circle key={i} cx={sx(conos.zp[i])} cy={sy(conos.J[i])} r="7" fill="none" stroke={PLUMA} strokeWidth="2.4" />)}
            {fe > 0 && <polyline points={linea(fina, fe)} fill="none" stroke={AGUA} strokeWidth="3" />}
            <text x={x1} y={36} textAnchor="end" style={{ ...eje, fontSize: 16, fill: PLUMA, opacity: fc }}>
                malla con conos (h ≈ 4.9 m en el eje): {mins.length} mínimos locales
            </text>
            <text x={x1} y={60} textAnchor="end" style={{ ...eje, fontSize: 16, fill: AGUA, opacity: fe }}>
                eje refinado a 1 m: monótona
            </text>
        </svg>
    );
}

export default function A3D18({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(7000, 400);
    if (!OPT.ondulacion || !OPT.ondulacion.conos || !OPT.ondulacion.eje)
        return <SlideLayout title="Ĵ(zₚ) y la malla" theme={theme}><p>Sin datos.</p></SlideLayout>;
    return (
        <SlideLayout title="Antes de leer el óptimo: Ĵ(zₚ) ondulaba con la malla" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir"
                 style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 36, alignItems: 'start' }}>
                <div>
                    <p style={tit}><InlineMath math="\hat J" /> con el mismo caudal, moviendo solo <InlineMath math="z_p" /> de metro en metro</p>
                    <Barrido p={p} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6 }}>
                    <div style={{ ...caja, borderColor: PLUMA, opacity: 0.3 + 0.7 * tramo(p, 0.3, 0.45) }}>
                        <p style={{ ...cab, color: PLUMA }}>Síntoma</p>
                        <p style={txt}>
                            En la malla con conos, las corridas detenidas por el tope de evaluaciones terminaron en −441 m (ADR), −436 m
                            (MRMT semi) y −469 m (MRMT bloque) con <InlineMath math="\partial\hat J/\partial z_p\approx 0" />: semi y bloque, dos
                            esquemas del mismo modelo, diferían 33 m.
                        </p>
                    </div>
                    <div style={{ ...caja, borderColor: GRIS, opacity: 0.3 + 0.7 * tramo(p, 0.4, 0.55) }}>
                        <p style={{ ...cab, color: GRIS }}>Causa</p>
                        <p style={txt}>
                            El núcleo del pozo (<InlineMath math="\varepsilon=r_{\rm pozo}/3\approx 6.7" /> m, con radio{' '}
                            <InlineMath math="r_{\rm pozo}=20" /> m) se muestrea con nodos separados <InlineMath math="h\approx 4.9" /> m (4 m
                            nominal): <InlineMath math="\hat J" /> ondula con periodo ≈ h y
                            amplitud ≈ 3·10⁻⁴, del orden de su pendiente (≈ 2·10⁻⁴ por metro). Cada valle es un mínimo local
                            espurio.
                        </p>
                    </div>
                    <div style={{ ...caja, borderColor: VALIDO, opacity: 0.3 + 0.7 * tramo(p, 0.6, 0.8) }}>
                        <p style={{ ...cab, color: VALIDO }}>Remedio</p>
                        <p style={txt}>
                            Franja con <InlineMath math="h=1" /> m a ±5 m del eje del pozo: 25 871 nodos (+27 %). La curva queda
                            monótona y la optimización se repite con esta malla.
                        </p>
                    </div>
                </div>
            </div>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const caja = { borderLeft: '4px solid', paddingLeft: 14 };
const cab = { margin: 0, fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', fontWeight: 600 };
const txt = { margin: '2px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 };
