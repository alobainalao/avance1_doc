import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, tramo } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Demanda, disponibilidad de la bomba y tanque (funtions/water_supply.py; control óptimo ADR, γ = 1).
// Izquierda: perfiles horarios (media 1). Derecha: 30 días con el volumen bombeado V_s Δt Q_n, la demanda d_n
// y el volumen del tanque S_n en [0, S_max]; se dibujan día a día.
const AGUA = '#0F7A85', PLUMA = '#C4511F', TINTA = '#6E7F8D', VALIDO = '#2E7D4F';
const opt = OPT.modelos[0];
const vol = opt ? opt.Q.map(q => OPT.V_s * OPT.dt * q) : [];

function Perfiles({ p }) {
    const W = 420, H = 330, L = 44, B = 64, T = 10;
    const sx = h => L + h / 24 * (W - L - 10), sy = v => T + (1 - v / 2.6) * (H - T - B);
    const escalon = (a) => a.map((v, h) => `${sx(h)},${sy(v)} ${sx(h + 1)},${sy(v)}`).join(' ');
    const series = [
        { a: OPT.perfiles.domestico, c: AGUA, n: 'doméstico' },
        { a: OPT.perfiles.riego, c: VALIDO, n: 'riego' },
        { a: OPT.perfiles.bomba, c: PLUMA, n: 'bomba a(τ)', dash: '6 4' },
    ];
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            {[0, 1, 2].map(v => <line key={v} x1={L} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke={TINTA} strokeOpacity="0.2" />)}
            {[0, 1, 2].map(v => <text key={v} x={L - 8} y={sy(v) + 5} textAnchor="end" style={eje}>{v}</text>)}
            {[0, 6, 12, 18, 24].map(h => <text key={h} x={sx(h)} y={H - B + 20} textAnchor="middle" style={eje}>{h}</text>)}
            {series.map((s, i) => (
                s.dash
                    ? <polyline key={s.n} points={escalon(s.a)} fill="none" stroke={s.c} strokeWidth="2.6" strokeDasharray={s.dash} opacity={tramo(p, 0.1, 0.35)} />
                    : <polyline key={s.n} points={escalon(s.a)} fill="none" stroke={s.c} strokeWidth="2.6" pathLength="1"
                                strokeDasharray={`${tramo(p, 0.05 * i, 0.3 + 0.05 * i)} 1`} />
            ))}
            {series.map((s, i) => (
                <g key={s.n} transform={`translate(${L + i * 124}, ${H - 14})`}>
                    <line x1="0" x2="22" y1="0" y2="0" stroke={s.c} strokeWidth="3" strokeDasharray={s.dash} />
                    <text x="28" y="5" style={eje}>{s.n}</text>
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
                    <p style={tit}>Perfiles diarios por hora (media 1)</p>
                    <Perfiles p={p} />
                    <p style={nota}>
                        Doméstico con picos a las 7 h y 18 h (AWWA M32); riego por goteo de 6 a 20 h (FAO-56); la bomba
                        reduce su disponibilidad de noche.
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
