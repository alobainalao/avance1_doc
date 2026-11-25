import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, tramo } from './anim.js';
import { Notas } from './version.jsx';
import { OPT } from './optimoNitrato.js';

// Demanda, bomba y tanque (funtions/water_supply.py; optimoNitrato.js: perfiles y demanda_real).
// Arriba: los dos perfiles diarios que usa el modelo, por separado y en m³/h (factor horario × consumo diario / 24):
// doméstico (dos máximos) y riego (uno), con la disponibilidad de la bomba; detrás del doméstico, un consumo medido
// (Tzatchkov y Alcocer-Yamanaka, 2016, fig. 15) escalado al mismo volumen diario. Abajo: 30 días de la demanda por paso
// d_n (promedio del perfil en cada paso de 10 h, profile_step_mean), del bombeo más barato que la cubre (solución exacta
// del caso sin nitrato, experimentos/validacion_esperada.py) y del tanque S(t) en [0, S_max].
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', TINTA = 'var(--a3-estrato)', VALIDO = 'var(--a3-valido)',
      RIEGO = 'var(--a3-riego)', TEXTO = 'var(--sl-text)', MUDO = 'var(--sl-muted)';
const P = OPT.perfiles, R = OPT.demanda_real;
const HORAS = Array.from({ length: 25 }, (_, h) => h);          // la interpolación es lineal entre horas: bastan los nodos

// Coeficiente de variación horaria (gasto de la hora / gasto medio) medido en un sector aislado de Tijuana con servicio
// continuo y sin tinacos (123 casas, un día): Tzatchkov y Alcocer-Yamanaka (2016), fig. 15, panel izquierdo. Digitalizado
// de la imagen del PDF de Redalyc (altura de cada barra contra la rejilla, ±0.02). La barra k (k = 1…24) es el intervalo
// [k−1, k) h: el promedio por hora de la serie de 60 s del panel derecho reproduce las barras con ese desfase.
const TIJ = [0.34, 0.24, 0.18, 0.22, 0.11, 0.64, 1.55, 1.84, 1.48, 1.69, 1.39, 1.28,
             1.18, 0.87, 0.85, 1.02, 0.88, 1.11, 0.97, 1.28, 1.55, 1.09, 1.04, 0.74];
const TIJ_MEDIA = TIJ.reduce((a, b) => a + b, 0) / 24;           // 0.98 por la digitalización: se reescala a media 1
const tij = k => TIJ[k] / TIJ_MEDIA * P.D_dom / 24;              // m³/h en [k, k+1) h con el volumen diario del modelo
const tijPicos = [TIJ.indexOf(Math.max(...TIJ.slice(0, 12))), 12 + TIJ.slice(12).indexOf(Math.max(...TIJ.slice(12)))];

// interpolación lineal circular de una tabla horaria (como _hour_factor de water_supply.py)
const fh = (arr, h) => { const x = ((h % 24) + 24) % 24, i = Math.floor(x), w = x - i; return arr[i] * (1 - w) + arr[(i + 1) % 24] * w; };
const dom = h => fh(P.domestico, h) * P.D_dom / 24, riego = h => fh(P.riego, h) * P.D_agri / 24;   // m³/h
const maxLocales = arr => arr.map((v, i) => (v > arr[(i + 23) % 24] && v >= arr[(i + 1) % 24] ? i : -1)).filter(i => i >= 0);
const domPicos = maxLocales(P.domestico);                                                 // 7 h y 18 h
const domMin = P.domestico.indexOf(Math.min(...P.domestico));
const rMax = Math.max(...P.riego), rPico = P.riego.map((v, i) => (v > rMax - 1e-9 ? i : -1)).filter(i => i >= 0);
const rHoras = P.riego.map((v, i) => (v > 0 ? i : -1)).filter(i => i >= 0);
const rango = a => (a.length > 1 ? `${a[0]}–${a[a.length - 1]}` : `${a[0]}`);

// Un panel de 24 h: ejes, rejilla y el contenido que dibuja `children(sx, sy)`.
function Panel({ x0, x1, vmax, marcas, titulo, color, horas = [0, 6, 12, 18, 24], fmt = v => v, children }) {
    const T = 52, B = 252;
    const sx = h => x0 + h / 24 * (x1 - x0), sy = v => B - v / vmax * (B - T);
    return (
        <g>
            <rect x={x0} y={18} width={14} height={14} fill={color} opacity="0.7" />
            <text x={x0 + 22} y={31} style={{ ...eje, fill: TEXTO }}>{titulo}</text>
            {marcas.map(v => <g key={v}><line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={TINTA} strokeOpacity={v ? 0.18 : 0.5} />
                <text x={x0 - 8} y={sy(v) + 6} textAnchor="end" style={eje}>{fmt(v)}</text></g>)}
            {horas.map(h => <g key={h}><line x1={sx(h)} x2={sx(h)} y1={T} y2={B} stroke={TINTA} strokeOpacity="0.12" />
                <text x={sx(h)} y={B + 26} textAnchor="middle" style={eje}>{h} h</text></g>)}
            {children(sx, sy)}
        </g>
    );
}

// Los tres perfiles diarios; el doméstico con la medición detrás (barras).
function Perfiles({ p }) {
    const linea = (f, sx, sy) => HORAS.map(h => `${sx(h)},${sy(f(h))}`).join(' ');
    const area = (f, sx, sy) => `${sx(0)},${sy(0)} ${linea(f, sx, sy)} ${sx(24)},${sy(0)}`;
    return (
        <svg viewBox="0 0 1300 286" style={{ width: '100%' }}>
            <Panel x0={58} x1={612} vmax={70} marcas={[0, 20, 40, 60]} color={AGUA} titulo={`Doméstico: ${P.D_dom} m³/día [m³/h]`}>
                {(sx, sy) => <>
                    {/* medición: las dos barras de los máximos más marcadas, con su hora al pie (arriba van las del modelo) */}
                    <g opacity={tramo(p, 0.12, 0.32)}>
                        {TIJ.map((_, k) => <rect key={k} x={sx(k) + 1.5} width={sx(1) - sx(0) - 3} y={sy(tij(k))} height={sy(0) - sy(tij(k))}
                                                 fill={TEXTO} opacity={tijPicos.includes(k) ? 0.28 : 0.13} />)}
                        {tijPicos.map(k => <text key={k} x={sx(k + 0.5)} y={sy(0) - 10} textAnchor="middle"
                                                 style={{ ...eje, ...halo, fill: TEXTO, fontStyle: 'italic' }}>{k}–{k + 1} h</text>)}
                    </g>
                    <g opacity={tramo(p, 0.02, 0.22)}>
                        <polygon points={area(dom, sx, sy)} fill={AGUA} fillOpacity="0.22" />
                        <polyline points={linea(dom, sx, sy)} fill="none" stroke={AGUA} strokeWidth="3" />
                        {domPicos.map(h => <g key={h}>
                            <circle cx={sx(h)} cy={sy(dom(h))} r="5" fill={AGUA} />
                            <text x={sx(h)} y={sy(dom(h)) - 12} textAnchor="middle"
                                  style={{ ...eje, ...halo, fill: AGUA, fontWeight: 600 }}>{h} h</text></g>)}
                    </g>
                </>}
            </Panel>
            <Panel x0={712} x1={1030} vmax={25} marcas={[0, 10, 20]} color={RIEGO} titulo={`Riego: ${P.D_agri} m³/día [m³/h]`}>
                {(sx, sy) => <g opacity={tramo(p, 0.2, 0.4)}>
                    <polygon points={area(riego, sx, sy)} fill={RIEGO} fillOpacity="0.25" />
                    <polyline points={linea(riego, sx, sy)} fill="none" stroke={RIEGO} strokeWidth="3" />
                    <text x={sx((rPico[0] + rPico[rPico.length - 1]) / 2)} y={sy(rMax * P.D_agri / 24) - 10} textAnchor="middle"
                          style={{ ...eje, ...halo, fill: RIEGO, fontWeight: 600 }}>{rango(rPico)} h</text>
                </g>}
            </Panel>
            <Panel x0={1112} x1={1272} vmax={1} marcas={[0, 1]} color={PLUMA} titulo="Bomba a(τ)" horas={[0, 12, 24]}>
                {(sx, sy) => <g opacity={tramo(p, 0.3, 0.45)}>
                    <polyline points={HORAS.map(h => `${sx(h)},${sy(fh(P.bomba, h))}`).join(' ')} fill="none" stroke={PLUMA} strokeWidth="3" />
                </g>}
            </Panel>
        </svg>
    );
}

function Mes({ p }) {
    const W = 1300, L = 56, Rr = 16, gap = 60, w = (W - L - Rr - gap - L) / 2, H = 196, T = 26;
    const n = R.d.length, x1 = k => L + k / n * w, x2 = k => 2 * L + gap + w + k / n * w;
    const vol = R.Q_costo.map(q => OPT.V_s * OPT.dt * q), vmax = 700;
    const y1 = v => T + (1 - v / vmax) * (H - T - 22), y2 = s => T + (1 - s / OPT.S_max) * (H - T - 22);
    const corte = tramo(p, 0.5, 0.98);
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
                <text x={x1(d / 30 * n)} y={H - 2} textAnchor={d === 30 ? 'end' : 'middle'} style={eje}>{d} d</text>
                <text x={x2(d / 30 * n)} y={H - 2} textAnchor={d === 30 ? 'end' : 'middle'} style={eje}>{d} d</text></g>)}
        </svg>
    );
}

// muestra de color de la leyenda
const Mu = ({ c, linea, raya, o = 0.55 }) => (
    <span style={{ display: 'inline-block', width: 22, height: linea ? 0 : 12, borderTop: linea ? `${linea}px ${raya ? 'dashed' : 'solid'} ${c}` : undefined,
                   background: linea ? undefined : c, opacity: linea ? 1 : o, margin: '0 6px 0 0', verticalAlign: 'middle' }} />
);

const eqDn = String.raw`d_n=\frac{D_{\rm dom}}{24}\int_{\tau_n}^{\tau_n+10}\! f_{\rm dom}(\tau)\,d\tau
  +\frac{D_{\rm agri}}{24}\int_{\tau_n}^{\tau_n+10}\! f_{\rm agri}(\tau)\,d\tau\quad[\mathrm{m}^3]`;
const eqS = String.raw`S_n=S_0+\sum_{k=0}^{n}\bigl(V_s\,\Delta t\,Q_k-d_k\bigr),\qquad 0\le S_n\le S_{\max}`;

export default function A3D06({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(7000, 300);
    if (!R || !R.S_costo) return <SlideLayout title="Demanda, bomba y tanque" theme={theme}><p>Sin datos de demanda.</p></SlideLayout>;
    const dia = Math.round(P.D_dom + P.D_agri), smin = Math.min(...R.S_costo), smax = Math.max(...R.S_costo);
    const dmin = Math.min(...R.d), dmax = Math.max(...R.d);
    const vmin = Math.min(...OPT.demanda), vmax = Math.max(...OPT.demanda);      // a mitad del paso (resultados hasta el 24-nov)
    const m3h = h => dom(h).toFixed(0);
    return (
        <SlideLayout title="Demanda, bomba y tanque" theme={theme} justify="flex-start">
            <div onClick={repetir} title="clic para repetir" style={{ cursor: 'pointer' }}>
                <p style={tit}>Consumo a lo largo del día en el modelo</p>
                <Perfiles p={p} />
                <p style={ley}>
                    <Mu c={TEXTO} o={0.25} />barras: consumo medido en un sector de Tijuana (123 casas)
                    <span className="a3-completa">, un día, llevado al mismo volumen diario</span>{' '}
                    <Cita k="tzatchkov2016variacion" />.{'   '}
                    <span className="a3-completa">Riego de día, con un solo máximo, como la evapotranspiración <Cita k="allen1998crop" p="cap. 4" />.</span>
                </p>
                <p style={{ ...tit, marginTop: 12 }}>Treinta días en pasos de 10 h</p>
                <p style={ley}>
                    <Mu c={PLUMA} linea={3} />demanda del paso <InlineMath math="d_n" />{'   '}
                    <Mu c={AGUA} />bombeo más barato que la cubre{'   '}
                    <Mu c={AGUA} linea={3} />tanque, entre 0 y <InlineMath math="S_{\max}" />
                </p>
                <Mes p={p} />
            </div>
            <p className="a3-completa" style={nota}>
                Cada día suma {dia} m³. El modelo reproduce el máximo de la mañana medido; <span style={{ color: PLUMA }}>el de la tarde
                lo pone a las {domPicos[1]} h y el medido está en {tijPicos[1]}–{tijPicos[1] + 1} h, y los 24 valores de cada perfil
                no están tabulados en las fuentes que cita el código</span> (ver notas). <InlineMath math="d_n" /> es el volumen consumido
                en el paso: va de {dmin.toFixed(0)} a {dmax.toFixed(0)} m³ y se repite cada cinco días. El bombeo más barato es casi
                constante; el tanque, entre {smin.toFixed(0)} y {smax.toFixed(0)} m³, absorbe las variaciones.
            </p>
            <p className="a3-publica" style={{ ...tit, marginTop: 6 }}>
                Cada día: {dia} m³. El tanque absorbe los picos y la bomba trabaja casi constante.
            </p>
            <Notas titulo="Perfiles de demanda: qué usa el modelo y qué respaldan las fuentes">
                <h4>Qué usa el modelo</h4>
                <p>Dos tablas de 24 factores horarios, <InlineMath math="f_{\rm dom}" /> y <InlineMath math="f_{\rm agri}" />, adimensionales y de
                    media 1, con interpolación lineal entre horas (<code>water_supply.py</code>). El consumo por hora es{' '}
                    <InlineMath math="f(\tau)\,D/24" /> [m³/h], con <InlineMath math={`D_{\\rm dom}=${P.D_dom}`} /> y{' '}
                    <InlineMath math={`D_{\\rm agri}=${P.D_agri}`} /> m³/día.</p>
                <ul>
                    <li>Doméstico: dos máximos, a las {domPicos[0]} h ({m3h(domPicos[0])} m³/h) y a las {domPicos[1]} h ({m3h(domPicos[1])} m³/h);
                        mínimo a las {domMin} h ({dom(domMin).toFixed(1)} m³/h).</li>
                    <li>Riego: un solo máximo, meseta de {rango(rPico)} h ({(rMax * P.D_agri / 24).toFixed(1)} m³/h); riega de {rHoras[0]} a{' '}
                        {rHoras[rHoras.length - 1]} h y nada de noche.</li>
                    <li>Bomba: fracción disponible <InlineMath math="a(\tau)\in[0,1]" />, menor de noche; acota{' '}
                        <InlineMath math="0\le Q_n\le Q_{\max}\,a_n" />.</li>
                </ul>
                <h4>Qué respaldan las fuentes</h4>
                <ul>
                    <li><b>Doméstico con dos máximos: sí, medido.</b> En un sector aislado de Tijuana, con servicio continuo y sin tinacos
                        (123 casas, un día), el gasto horario tiene máximos en {tijPicos[0]}–{tijPicos[0] + 1} h ({TIJ[tijPicos[0]].toFixed(2)} veces
                        el medio) y en {tijPicos[1]}–{tijPicos[1] + 1} h ({TIJ[tijPicos[1]].toFixed(2)}) <Cita k="tzatchkov2016variacion" p="fig. 15" />.
                        Las barras de la lámina son esa figura digitalizada (±0.02) y reescalada a {P.D_dom} m³/día.</li>
                    <li><b>El segundo máximo depende de la agregación.</b> En el sector de 3 300 casas de la misma red (fig. 14) queda un solo
                        máximo, hacia las 10–11 h, con apenas un hombro por la tarde; la curva de diseño de Conagua (MAPAS, reproducida en la
                        fig. 1) tiene un solo máximo, hacia las 9 h. Con muchos usuarios, o con tinacos y cisternas, los picos se aplanan.</li>
                    <li><b>El modelo frente a la medición.</b> Coincide en el máximo de la mañana ({domPicos[0]} h frente a {tijPicos[0]}–{tijPicos[0] + 1} h);
                        el de la tarde lo adelanta: {domPicos[1]} h frente a {tijPicos[1]}–{tijPicos[1] + 1} h, y más alto
                        ({P.domestico[domPicos[1]].toFixed(2)} frente a {TIJ[tijPicos[1]].toFixed(2)} veces el medio).</li>
                    <li><b>Origen de los 24 valores: no verificado.</b> El código los atribuye a <Cita k="mays2011water" /> («Tabla 4-2») y a{' '}
                        <Cita k="hernandez2023demanda" /> (coeficientes horarios medidos por sector en Chihuahua). No aparecen tabulados en lo
                        que se pudo revisar: el libro no estuvo disponible y del artículo solo se leyó el resumen. Son valores redondos
                        (1.80, 1.70, …) que dan la forma, no una medición.</li>
                    <li><b>Riego con un máximo: forma razonable, valores supuestos.</b> FAO-56 calcula la evapotranspiración de referencia
                        hora por hora (cap. 4, ec. 53); en su ejemplo 19 es 0.00 mm/h entre las 2 y las 3 h y 0.63 mm/h entre las 14 y las
                        15 h <Cita k="allen1998crop" />. Pero FAO-56 no fija un horario de riego: la ventana de {rHoras[0]} a{' '}
                        {rHoras[rHoras.length - 1]} h y la meseta de {rango(rPico)} h son un supuesto del modelo (goteo diurno).</li>
                </ul>
                <h4>Del perfil horario al paso de 10 h</h4>
                <p>El modelo no usa el perfil hora por hora sino el volumen consumido en cada paso <InlineMath math="n=0,\dots,N_t-1" />, que va de{' '}
                    <InlineMath math="\tau_n=\tau_0+10\,n" /> a <InlineMath math="\tau_n+10" /> (horas, con{' '}
                    <InlineMath math={`\\tau_0=${OPT.t0_hora}`} /> h la hora del inicio):</p>
                <BlockMath math={eqDn} />
                <p>Como 10 h no divide 24 h, cada paso cubre otras horas del día y el patrón se repite cada 120 h = 5 días = 12 pasos:{' '}
                    <InlineMath math="d_n" /> va de {dmin.toFixed(0)} a {dmax.toFixed(0)} m³. Hasta el 24-nov se tomaba el factor a la mitad
                    del paso multiplicado por 10 h; eso toma una sola hora de cada paso y exagera los extremos (de {vmin.toFixed(0)} a{' '}
                    {vmax.toFixed(0)} m³). Las corridas nuevas usan el promedio exacto (<code>profile_step_mean</code>); la disponibilidad{' '}
                    <InlineMath math="a_n" /> de la bomba se promedia igual.</p>
                <h4>Cómo entra la demanda en el tanque</h4>
                <BlockMath math={eqS} />
                <p>Con <InlineMath math="Q_k" /> en m²/s (caudal por metro de ancho del corte), <InlineMath math={`V_s=${OPT.V_s}`} /> m,{' '}
                    <InlineMath math={`\\Delta t=${OPT.dt}`} /> s ({OPT.dt / 3600} h),{' '}
                    <InlineMath math={`S_0=${R.S_costo[0]}`} /> m³ y <InlineMath math={`S_{\\max}=${OPT.S_max}`} /> m³. Es lineal en{' '}
                    <InlineMath math="Q" />: <InlineMath math="S_n\ge0" /> garantiza el suministro y <InlineMath math="S_n\le S_{\max}" /> impide
                    el rebose. Lo bombeado en un paso es <InlineMath math="V_s\,\Delta t\,Q_n" />; la gráfica de abajo muestra el bombeo de
                    menor costo que cumple las dos cotas (caso sin nitrato, solución exacta).</p>
                <h4>Decisión pendiente</h4>
                <p>Reemplazar las tablas por perfiles con fuente: el doméstico por una curva medida (la de Tijuana, o la de Chihuahua si
                    el texto completo la tabula), y el riego por la evapotranspiración horaria de FAO-56 (ec. 53) con datos de una
                    estación cercana a Sabinas. Cambia la demanda y obliga a repetir las corridas.</p>
            </Notas>
        </SlideLayout>
    );
}

const eje = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', fill: MUDO };
const halo = { paintOrder: 'stroke', stroke: 'var(--sl-bg)', strokeWidth: 5, strokeLinejoin: 'round' };
const tit = { margin: '0 0 4px', fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const ley = { margin: '0 0 2px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' };
const nota = { margin: '8px 0 0', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', lineHeight: 1.35 };
