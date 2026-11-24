import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { OPT } from './optimoNitrato.js';

// Demanda real, bomba y tanque (funtions/water_supply.py con profile_step_mean; optimoNitrato.js: perfiles y demanda_real).
// Arriba: cinco días del consumo doméstico y de riego hora por hora [m³/h] (los pasos de 10 h no dividen al día: en cinco
// días se repiten), con el promedio de cada paso, que es lo que usa el modelo (d_n = volumen consumido en el paso), y la
// disponibilidad de la bomba. Abajo: 30 días de la demanda por paso, del bombeo más barato que la cubre (solución exacta
// del caso sin nitrato, experimentos/validacion_esperada.py) y del tanque S(t) en [0, S_max].
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', TINTA = 'var(--a3-estrato)', VALIDO = 'var(--a3-valido)',
      RIEGO = 'var(--a3-riego)', TEXTO = 'var(--sl-text)';
const P = OPT.perfiles, R = OPT.demanda_real;
const DT_H = OPT.dt / 3600, T0 = OPT.t0_hora, DIAS = 5, NPASOS = DIAS * 24 / DT_H;

// interpolación lineal circular de una tabla horaria (como _hour_factor de water_supply.py)
const fh = (arr, h) => { const x = ((h % 24) + 24) % 24, i = Math.floor(x), w = x - i; return arr[i] * (1 - w) + arr[(i + 1) % 24] * w; };
const dom = h => fh(P.domestico, h) * P.D_dom / 24, riego = h => fh(P.riego, h) * P.D_agri / 24;   // m³/h
const HORAS = Array.from({ length: DIAS * 24 * 4 + 1 }, (_, k) => T0 + k / 4);
const pico = HORAS.reduce((a, h) => (dom(h) + riego(h) > dom(a) + riego(a) ? h : a), T0);
const valle = HORAS.reduce((a, h) => (dom(h) + riego(h) < dom(a) + riego(a) ? h : a), T0);

function Dia({ p }) {
    const W = 1300, L = 56, Rr = 16, T = 14, H1 = 250, Y0 = 272, H2 = 46, VMAX = 80;
    const sx = h => L + (h - T0) / (DIAS * 24) * (W - L - Rr), sy = v => T + (1 - v / VMAX) * (H1 - T), sb = v => Y0 + (1 - v) * H2;
    const linea = (f, y) => HORAS.map(h => `${sx(h)},${y(f(h))}`).join(' ');
    const area = (arriba, abajo) => `${linea(arriba, sy)} ${HORAS.slice().reverse().map(h => `${sx(h)},${sy(abajo(h))}`).join(' ')}`;
    const tot = h => dom(h) + riego(h);
    const pasos = R.d.slice(0, NPASOS), aps = R.a.slice(0, NPASOS);
    const escalon = (v, y) => v.map((d, n) => `${sx(T0 + n * DT_H)},${y(d)} ${sx(T0 + (n + 1) * DT_H)},${y(d)}`).join(' ');
    const medias = [0, 1, 2, 3, 4].map(k => 24 * (k + 1));            // medianoche: 24 h después de cada 0 h
    return (
        <svg viewBox={`0 0 ${W} ${Y0 + H2 + 46}`} style={{ width: '100%' }}>
            {[0, 20, 40, 60, 80].map(v => <line key={v} x1={L} x2={W - Rr} y1={sy(v)} y2={sy(v)} stroke={TINTA} strokeOpacity="0.18" />)}
            {[0, 20, 40, 60, 80].map(v => <text key={v} x={L - 8} y={sy(v) + 5} textAnchor="end" style={eje}>{v}</text>)}
            {medias.filter(h => h < T0 + DIAS * 24).map(h => (
                <line key={h} x1={sx(h)} x2={sx(h)} y1={T} y2={Y0 + H2} stroke={TINTA} strokeOpacity="0.35" strokeDasharray="3 4" />
            ))}
            <g opacity={tramo(p, 0.02, 0.2)}>
                <polygon points={area(dom, () => 0)} fill={AGUA} fillOpacity="0.32" />
                <polyline points={linea(dom, sy)} fill="none" stroke={AGUA} strokeWidth="2" />
            </g>
            <g opacity={tramo(p, 0.15, 0.33)}>
                <polygon points={area(tot, dom)} fill={RIEGO} fillOpacity="0.32" />
                <polyline points={linea(tot, sy)} fill="none" stroke={RIEGO} strokeWidth="2" />
                <text x={sx(pico + 24)} y={sy(tot(pico)) - 8} textAnchor="middle" style={{ ...eje, ...halo, fill: TEXTO }}>{tot(pico).toFixed(0)} m³/h a las {Math.round(pico % 24)} h</text>
                <text x={sx(valle + 24)} y={sy(tot(valle)) - 8} textAnchor="middle" style={{ ...eje, ...halo, fill: TEXTO }}>{tot(valle).toFixed(0)} m³/h a las {Math.round(valle % 24)} h</text>
            </g>
            <g opacity={tramo(p, 0.35, 0.55)}>
                <polyline points={escalon(pasos.map(d => d / DT_H), sy)} fill="none" stroke={TEXTO} strokeWidth="3" />
            </g>
            <g opacity={tramo(p, 0.45, 0.65)}>
                <line x1={L} x2={W - Rr} y1={sb(0)} y2={sb(0)} stroke={TINTA} strokeOpacity="0.4" />
                <text x={L - 8} y={sb(0) + 5} textAnchor="end" style={eje}>0</text>
                <text x={L - 8} y={sb(1) + 5} textAnchor="end" style={eje}>1</text>
                <polyline points={HORAS.map(h => `${sx(h)},${sb(fh(P.bomba, h))}`).join(' ')} fill="none" stroke={PLUMA} strokeWidth="1.6" strokeDasharray="5 4" />
                <polyline points={escalon(aps, sb)} fill="none" stroke={PLUMA} strokeWidth="2.6" />
            </g>
            {Array.from({ length: DIAS * 4 + 1 }, (_, k) => T0 + 6 * k).map(h => (
                <text key={h} x={sx(h)} y={Y0 + H2 + 20} textAnchor="middle" style={eje}>{h % 24} h</text>
            ))}
            {[0, 1, 2, 3, 4].map(k => (
                <text key={k} x={sx(24 * k + 12)} y={Y0 + H2 + 42} textAnchor="middle" style={{ ...eje, fill: TEXTO }}>día {k + 1}</text>
            ))}
        </svg>
    );
}

function Mes({ p }) {
    const W = 1300, L = 56, Rr = 16, gap = 60, w = (W - L - Rr - gap - L) / 2, H = 196, T = 26;
    const n = R.d.length, x1 = k => L + k / n * w, x2 = k => 2 * L + gap + w + k / n * w;
    const vol = R.Q_costo.map(q => OPT.V_s * OPT.dt * q), vmax = 700;
    const y1 = v => T + (1 - v / vmax) * (H - T - 22), y2 = s => T + (1 - s / OPT.S_max) * (H - T - 22);
    const corte = tramo(p, 0.6, 0.98);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
            <defs><clipPath id="a3d06-mes"><rect x="0" y="0" width={L + corte * w + 1} height={H} /><rect x={2 * L + gap + w} y="0" width={corte * w + 1} height={H} /></clipPath></defs>
            <text x={L} y={14} style={{ ...eje, fill: TEXTO }}>volumen por paso de 10 h [m³]</text>
            {[0, 300, 600].map(v => <g key={v}><line x1={L} x2={L + w} y1={y1(v)} y2={y1(v)} stroke={TINTA} strokeOpacity="0.18" />
                <text x={L - 8} y={y1(v) + 5} textAnchor="end" style={eje}>{v}</text></g>)}
            <text x={2 * L + gap + w} y={14} style={{ ...eje, fill: TEXTO }}>tanque <tspan fontStyle="italic">S</tspan>(t) [m³]</text>
            <rect x={x2(0)} width={w} y={y2(OPT.S_max)} height={y2(0) - y2(OPT.S_max)} fill={VALIDO} opacity="0.07" />
            {[0, 1000, 2000].map(v => <g key={v}><line x1={x2(0)} x2={x2(n)} y1={y2(v)} y2={y2(v)} stroke={v % 2000 ? TINTA : VALIDO}
                strokeOpacity={v % 2000 ? 0.18 : 0.8} strokeDasharray={v % 2000 ? undefined : '6 4'} />
                <text x={x2(0) - 8} y={y2(v) + 5} textAnchor="end" style={eje}>{v}</text></g>)}
            <g clipPath="url(#a3d06-mes)">
                {vol.map((v, k) => <rect key={k} x={x1(k) + 0.8} width={w / n - 1.6} y={y1(v)} height={y1(0) - y1(v)} fill={AGUA} opacity="0.7" />)}
                <polyline points={R.d.map((d, k) => `${x1(k)},${y1(d)} ${x1(k + 1)},${y1(d)}`).join(' ')} fill="none" stroke={PLUMA} strokeWidth="2.4" />
                <polyline points={R.S_costo.map((s, k) => `${x2(k)},${y2(s)}`).join(' ')} fill="none" stroke={AGUA} strokeWidth="3" />
            </g>
            {[0, 10, 20, 30].map(d => <g key={d}>
                <text x={x1(d / 30 * n)} y={H - 2} textAnchor="middle" style={eje}>{d} d</text>
                <text x={x2(d / 30 * n)} y={H - 2} textAnchor="middle" style={eje}>{d} d</text></g>)}
        </svg>
    );
}

// muestra de color de la leyenda
const Mu = ({ c, linea, raya }) => (
    <span style={{ display: 'inline-block', width: 22, height: linea ? 0 : 12, borderTop: linea ? `${linea}px ${raya ? 'dashed' : 'solid'} ${c}` : undefined,
                   background: linea ? undefined : c, opacity: linea ? 1 : 0.55, margin: '0 6px 0 0', verticalAlign: 'middle' }} />
);

export default function A3D06({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(7000, 300);
    if (!R || !R.S_costo) return <SlideLayout title="Demanda, bomba y tanque" theme={theme}><p>Sin datos de demanda.</p></SlideLayout>;
    const dia = Math.round(P.D_dom + P.D_agri), smin = Math.min(...R.S_costo), smax = Math.max(...R.S_costo);
    const dmin = Math.min(...R.d), dmax = Math.max(...R.d);
    return (
        <SlideLayout title="Demanda, bomba y tanque" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                <p style={tit}>Consumo de agua hora por hora, cinco días [m³/h]</p>
                <p style={ley}>
                    <Mu c={AGUA} />doméstico {P.D_dom} m³/día{'   '}
                    <Mu c={RIEGO} />riego {P.D_agri} m³/día{'   '}
                    <Mu c={TEXTO} linea={3} />promedio de cada paso de 10 h (lo que usa el modelo){'   '}
                    <Mu c={PLUMA} linea={2} raya />bomba <InlineMath math="a(\tau)" />
                </p>
                <Dia p={p} />
                <p style={{ ...ley, marginTop: 10 }}>
                    <Mu c={PLUMA} linea={3} />demanda <InlineMath math="d_n" />{'   '}
                    <Mu c={AGUA} />bombeo más barato que la cubre{'   '}
                    <Mu c={AGUA} linea={3} />tanque, entre 0 y <InlineMath math="S_{\max}" />
                </p>
                <Mes p={p} />
            </div>
            <p className="a3-completa" style={nota}>
                Doméstico con picos a las 7 h y 18 h <Cita k={['mays2011water', 'hernandez2023demanda']} />; riego por goteo de 6 a
                20 h <Cita k="allen1998crop" />; la bomba reduce su disponibilidad de noche <Cita k="grundfos2019motor" />. Cada día
                suma {dia} m³. Con <InlineMath math="\Delta t=10" /> h cada paso cubre otras horas del día, así que <InlineMath math="d_n" />{' '}
                va de {dmin.toFixed(0)} a {dmax.toFixed(0)} m³ y se repite cada cinco días; <InlineMath math="d_n" /> es el volumen
                consumido en el paso (antes se tomaba el consumo de la hora central por 10 h, que exageraba los picos). El bombeo
                mostrado es el más barato que cubre la demanda (caso sin nitrato, solución exacta): casi constante, con el tanque
                entre {smin.toFixed(0)} y {smax.toFixed(0)} m³ absorbiendo las variaciones.
            </p>
            <p className="a3-publica" style={{ ...tit, marginTop: 6 }}>
                Cada día: {dia} m³. El tanque absorbe los picos y la bomba trabaja casi constante.
            </p>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 16, fill: 'var(--sl-muted)' };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 5, strokeLinejoin: 'round' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const ley = { margin: '0 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
