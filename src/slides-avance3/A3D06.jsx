import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Demanda, disponibilidad de la bomba y tanque (funtions/water_supply.py; control óptimo ADR, γ = 1).
// Izquierda: consumo doméstico y de riego por hora del día y disponibilidad de la bomba. Derecha: 30 días con el volumen bombeado V_s Δt Q_n, la demanda d_n
// y el volumen del tanque S_n en [0, S_max]; se dibujan día a día.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', TINTA = 'var(--a3-estrato)', VALIDO = 'var(--a3-valido)',
      RIEGO = 'var(--a3-riego)';
const opt = OPT.modelos[0];
const vol = opt ? opt.Q.map(q => OPT.V_s * OPT.dt * q) : [];

// Consumo por hora del día [m³/h] = consumo diario × perfil horario / 24, apilado (doméstico abajo, riego encima: el borde
// superior es la demanda total); debajo, la disponibilidad de la bomba a(τ) ∈ [0, 1].
function Perfiles({ p }) {
    const P = OPT.perfiles, W = 420, H = 352, L = 44, R = 20, T = 12, H1 = 232, Y0 = 250, H2 = 50, VMAX = 80;
    const sx = h => L + h / 24 * (W - L - R), sy = v => T + (1 - v / VMAX) * (H1 - T), sb = v => Y0 + (1 - v) * H2;
    const dom = P.domestico.map(v => v * P.D_dom / 24), tot = dom.map((v, h) => v + P.riego[h] * P.D_agri / 24);
    const borde = (a, y) => a.map((v, h) => `${sx(h)},${y(v)} ${sx(h + 1)},${y(v)}`).join(' ');
    const area = (arriba, abajo) => `${borde(arriba, sy)} ${borde(abajo, sy).split(' ').reverse().join(' ')}`;
    const capas = [
        { arriba: dom, abajo: dom.map(() => 0), c: AGUA, n: `doméstico ${P.D_dom} m³/día`, o: tramo(p, 0.05, 0.3) },
        { arriba: tot, abajo: dom, c: RIEGO, n: `riego ${P.D_agri} m³/día`, o: tramo(p, 0.2, 0.45) },
    ];
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[0, 20, 40, 60, 80].map(v => <line key={v} x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke={TINTA} strokeOpacity="0.2" />)}
            {[0, 20, 40, 60, 80].map(v => <text key={v} x={L - 8} y={sy(v) + 5} textAnchor="end" style={eje}>{v}</text>)}
            {capas.map(k => (
                <g key={k.n} opacity={k.o}>
                    <polygon points={area(k.arriba, k.abajo)} fill={k.c} fillOpacity="0.35" />
                    <polyline points={borde(k.arriba, sy)} fill="none" stroke={k.c} strokeWidth="2.4" />
                </g>
            ))}
            <g opacity={tramo(p, 0.35, 0.6)}>
                <line x1={L} x2={W - R} y1={sb(0)} y2={sb(0)} stroke={TINTA} strokeOpacity="0.4" />
                <line x1={L} x2={W - R} y1={sb(1)} y2={sb(1)} stroke={TINTA} strokeOpacity="0.2" />
                <text x={L - 8} y={sb(0) + 5} textAnchor="end" style={eje}>0</text>
                <text x={L - 8} y={sb(1) + 5} textAnchor="end" style={eje}>1</text>
                <polyline points={borde(P.bomba, sb)} fill="none" stroke={PLUMA} strokeWidth="2.4" strokeDasharray="6 4" />
                <text x={sx(0.3)} y={sb(1) + 5} style={{ ...eje, fill: PLUMA }}>bomba a(τ)</text>
            </g>
            {[0, 6, 12, 18, 24].map(h => <text key={h} x={sx(h)} y={Y0 + H2 + 18} textAnchor="middle" style={eje}>{h} h</text>)}
            {capas.map((k, i) => (
                <g key={k.n} transform={`translate(${L + i * 190}, ${H - 8})`}>
                    <line x1="0" x2="20" y1="0" y2="0" stroke={k.c} strokeWidth="4" />
                    <text x="26" y="5" style={eje}>{k.n}</text>
                </g>
            ))}
        </svg>
    );
}

function Tanque({ p }) {
    const W = 860, H1 = 230, H2 = 250, L = 70, R = 14, gap = 26;
    const n = vol.length, sx = k => L + k / n * (W - L - R);
    const vmax = Math.max(...vol, ...OPT.demanda) * 1.1;
    const y1 = v => 30 + (1 - v / vmax) * (H1 - 48);
    const top2 = H1 + gap, y2 = s => top2 + (1 - s / (OPT.S_max * 1.08)) * (H2 - 30);
    const corte = tramo(p, 0.15, 0.95);
    const xc = L + corte * (W - L - R);
    const S = opt.S;
    return (
        <svg viewBox={`0 0 ${W} ${H1 + gap + H2}`} style={{ width: '100%' }}>
            <defs><clipPath id="a3d06-c"><rect x="0" y="0" width={xc} height={H1 + gap + H2} /></clipPath></defs>
            {/* panel 1: volumen por paso */}
            {[0, 250, 500, 750].filter(v => v < vmax).map(f => <line key={f} x1={L} x2={W - R} y1={y1(f)} y2={y1(f)} stroke={TINTA} strokeOpacity="0.2" />)}
            {[0, 250, 500, 750].filter(v => v < vmax).map(v => <text key={v} x={L - 8} y={y1(v) + 5} textAnchor="end" style={eje}>{v}</text>)}
            <text x={L} y={16} style={eje}>m³ por intervalo de 10 h</text>
            <g clipPath="url(#a3d06-c)">
                {vol.map((v, k) => <rect key={k} x={sx(k) + 1} width={(W - L - R) / n - 2} y={y1(v)} height={y1(0) - y1(v)} fill={AGUA} opacity="0.75" />)}
                <polyline points={OPT.demanda.map((d, k) => `${sx(k)},${y1(d)} ${sx(k + 1)},${y1(d)}`).join(' ')} fill="none" stroke={PLUMA} strokeWidth="2.6" />
            </g>
            {/* panel 2: tanque */}
            <rect x={L} width={W - L - R} y={y2(OPT.S_max)} height={y2(0) - y2(OPT.S_max)} fill={VALIDO} opacity="0.08" />
            <line x1={L} x2={W - R} y1={y2(OPT.S_max)} y2={y2(OPT.S_max)} stroke={VALIDO} strokeDasharray="6 4" />
            <line x1={L} x2={W - R} y1={y2(0)} y2={y2(0)} stroke={VALIDO} strokeDasharray="6 4" />
            {[0, 1000, 2000].map(v => <text key={v} x={L - 8} y={y2(v) + 5} textAnchor="end" style={eje}>{v}</text>)}
            <text x={L} y={top2 - 4} style={eje}>tanque S [m³]</text>
            <polyline clipPath="url(#a3d06-c)" points={S.map((s, k) => `${sx(k)},${y2(s)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="3" />
            {[0, 10, 20, 30].map(d => <text key={d} x={L + d / 30 * (W - L - R)} y={H1 + gap + H2 - 4} textAnchor="middle" style={eje}>{d} d</text>)}
            <line x1={xc} x2={xc} y1={0} y2={H1 + gap + H2 - 20} stroke={TINTA} strokeOpacity={corte < 1 ? 0.5 : 0} />
        </svg>
    );
}

export default function A3D06({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6000, 300);
    if (!opt) return <SlideLayout title="Demanda, bomba y tanque" theme={theme}><p>Sin resultados de optimización.</p></SlideLayout>;
    return (
        <SlideLayout title="Demanda, bomba y tanque" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 34, alignItems: 'start' }}>
                <div>
                    <p style={tit}>Consumo de agua a lo largo del día [m³/h]</p>
                    <Perfiles p={p} />
                    <p style={nota}>
                        Doméstico con picos a las 7 h y 18 h <Cita k={['mays2011water', 'hernandez2023demanda']} />; riego por goteo de 6 a
                        20 h <Cita k="allen1998crop" />; la bomba reduce su disponibilidad de noche <Cita k="grundfos2019motor" />.
                    </p>
                </div>
                <div>
                    <p style={tit}>
                        <span style={{ color: AGUA }}>■</span> bombeado <InlineMath math="V_s\Delta t\,Q_n" />{'   '}
                        <span style={{ color: PLUMA }}>━</span> demanda <InlineMath math="d_n" />{'   '}
                        <span style={{ color: AGUA }}>━</span> tanque <InlineMath math="S_n" />
                    </p>
                    <Tanque p={p} />
                </div>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' }}>
                Control óptimo (ADR): el tanque oscila entre {Math.min(...opt.S).toFixed(0)} y {Math.max(...opt.S).toFixed(0)} m³, cerca de su
                mínimo: bombear cuesta, así que el óptimo extrae casi justo lo que se consume. El punto de partida{' '}
                <InlineMath math="Q_n=0.1" /> vaciaba el tanque (no era admisible).
            </p>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 14, fill: 'var(--sl-muted)' };
const tit = { margin: '0 0 6px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { margin: '6px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
