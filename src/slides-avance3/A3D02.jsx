import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { useProgreso, suave, tramo } from './anim.js';
import { usePublica, Notas } from './version.jsx';
import { DISC } from './discrepanciaTiempo.js';

// Qué se corrigió del modelo anterior y su efecto en la concordancia RBF-FD ↔ elementos finitos
// (tesis, Cap. IV §Efecto de la condición de salida; malla con conos: grupo M_modelo_nuevo, 12-nov-2026).
const cambios = [
    { tema: 'Sumidero del pozo',
      antes: String.raw`\ldots-\chi(Q)\,g_\varepsilon\,C`, antesTxt: 'término W₋ explícito en el transporte',
      ahora: String.raw`fC\ \text{se cancela con}\ C\,\nabla\!\cdot\mathbf u`, ahoraTxt: 'el soluto sale con el agua, por advección' },
    { tema: 'Almacenamiento',
      antes: String.raw`\text{omitido}`, antesTxt: 'formas conservativa y no conservativa distintas',
      ahora: String.raw`-S_s\,\partial_t h\,C`, ahoraTxt: 'las dos formas son equivalentes' },
    { tema: 'Salida',
      antes: String.raw`\text{2.º orden}\ \neq\ \mathbf u\!\cdot\!\mathbf n=f_{out}`, antesTxt: 'cada método resolvía otro problema continuo',
      ahora: String.raw`\partial_n(\mathbf u\!\cdot\!\mathbf n)=0`, ahoraTxt: 'salida libre: la misma ecuación de borde en ambos' },
];

// Discrepancia relativa RBF-FD vs EF en TODO el horizonte (revisión de la versión 03): en cada uno de los 144 instantes
// guardados (Δt = 5 h, 30 d), L² relativa con pesos de área nodal (P1 concentrada) sobre los nodos comunes, como en
// experimentos/comparar.py; la cifra de cada celda es el MÁXIMO en el tiempo (antes se daba solo el valor en t = T).
// Series de comparacion/metricas.json, exportadas por codigo/scripts/metricas_tiempo.py a discrepanciaTiempo.js:
//   1.ª A_terminos/A3_fuente_pozo y 2.ª M_modelo_nuevo/M0_adr en la nube anterior (15 626 nodos): corridas archivadas, solo
//       quedan las series (codigo/archivo/resultados_json/...), no los campos;
//   3.ª M_modelo_nuevo/M0_adr en la malla con conos (campos guardados; también espacio-tiempo y desfase).
// De la 1.ª a la 2.ª cambian el modelo, la fuente (ε_z 60 → 30 m, pico 1e-11 → 5e-12) y el estencil (35 → 25 nodos); de la
// 2.ª a la 3.ª solo la malla (config.json idénticas salvo mesh_pkl). No es «el mismo caso» de principio a fin.
const ETAPAS = [
    { clave: 'anterior', titulo: 'modelo anterior', sub: '15 626 nodos', origen: 'archivada', color: 'var(--a3-pluma)' },
    { clave: 'nuevo_nube', titulo: 'modelo nuevo', sub: 'misma nube', origen: 'archivada', color: 'var(--a3-agua)' },
    { clave: 'nuevo_conos', titulo: 'modelo nuevo', sub: 'con conos, 20 348', origen: 'recalculada', color: 'var(--a3-valido)' },
];
// J_m (fila 4): |J_m^RBF/J_m^EF − 1| con J_m = ∫∫ g_ε C² dΩ dt (ε = r_pozo/3), ya integrada en [0, T]
// (codigo/scripts/metricas_discrepancia.py → .../M0_adr/metricas_alternativas.json); sin campos, no hay J_m de 1 y 2.
// `serie`: curva e(t_n) de DISC.curvas; `max`/`T`: claves de DISC.columnas; escala común de la fila (en %).
const filas = [
    { nombre: <><InlineMath math="|\mathbf u|" /> velocidad</>, serie: 'V', max: 'V_max', T: 'V_T', tmax: 'V_tmax', escala: 80, dec: 1 },
    { nombre: <><InlineMath math="C" /> concentración</>, serie: 'C', max: 'C_max', T: 'C_T', tmax: 'C_tmax', escala: 25, dec: 1 },
    { nombre: <InlineMath math="\textstyle\int_\Omega C\,d\Omega" />, sub: 'sin φ: no es la masa', serie: 'I', max: 'I_max', T: 'I_T', tmax: 'I_tmax', escala: 3, dec: 2 },
    { nombre: <><InlineMath math="J_m" /> en el pozo</>, sub: 'lo que se optimiza', jm: [null, null, 8.952] },
];
const COL = k => DISC.columnas[ETAPAS[k].clave];
const pc = (v, d = 1) => (100 * v).toFixed(d);

// Del nodo al número: diferencia en cada nodo e instante → norma con pesos de área en cada instante → máximo en el tiempo.
const PASOS = [
    { n: 'nodo i, instante tₙ', m: String.raw`d_i^{\,n}=v_i^{\rm RBF}(t_n)-v_i^{\rm EF}(t_n)` },
    { n: 'malla: cada nodo pesa su área wᵢ', m: String.raw`e(t_n)=\|d^{\,n}\|_h\,/\,\|v^{\rm EF}(t_n)\|_h,\ \ \|v\|_h^2=\textstyle\sum_i w_i\,v_i^2` },
    { n: '144 instantes (30 d)', m: String.raw`e=\max_{n}\,e(t_n)` },
];

// Notas: de la malla y el tiempo a un número (Thomée 2006 para la norma L^∞(0,T;L²); masa concentrada para los pesos).
const eqNodo = String.raw`d_i^{\,n}=v_i^{\rm RBF}(t_n)-v_i^{\rm EF}(t_n),\qquad i=1,\dots,N,\quad n=1,\dots,144`;
const eqEspacio = String.raw`\|d^{\,n}\|_h^2=\sum_{i=1}^N w_i\,(d_i^{\,n})^2\;\approx\;\int_\Omega |d(\mathbf x,t_n)|^2\,d\Omega,\qquad
w_i=\sum_{K\ni i}\frac{|K|}{3}`;
const eqTiempo = String.raw`\begin{aligned}e(t_n)&=\frac{\|d^{\,n}\|_h}{\|v^{\rm EF}(t_n)\|_h},\\
e_\infty&=\max_{1\le n\le 144} e(t_n)\;\approx\;\sup_{t\in(0,T]}\frac{\|v^{\rm RBF}(t)-v^{\rm EF}(t)\|_{L^2(\Omega)}}{\|v^{\rm EF}(t)\|_{L^2(\Omega)}}\end{aligned}`;
const eqST = String.raw`\begin{aligned}e_{ST}&=\Bigl(\frac{\sum_n\Delta t\,\|d^{\,n}\|_h^2}{\sum_n\Delta t\,\|v^{\rm EF}(t_n)\|_h^2}\Bigr)^{1/2}\\
&\approx\frac{\|v^{\rm RBF}-v^{\rm EF}\|_{L^2(0,T;L^2(\Omega))}}{\|v^{\rm EF}\|_{L^2(0,T;L^2(\Omega))}}\end{aligned}`;
const eqDesfase = String.raw`e_{ST}(\tau)=\Bigl(\frac{\sum_{n}\|v^{\rm RBF}(t_n+\tau)-v^{\rm EF}(t_n)\|_h^2}{\sum_n\|v^{\rm EF}(t_n)\|_h^2}\Bigr)^{1/2}`;
const eqMasa = String.raw`\begin{aligned}M_m(t)&=V_s\!\int_\Omega \phi\,R\,C_m\,d\Omega\quad[\mathrm{kg}],\\
M(t)&=V_s\!\int_\Omega\Bigl(\phi R\,C_m+\sum_{r=1}^{N_r}\eta_r\phi R\,C_{{\rm im},r}\Bigr)d\Omega\end{aligned}`;
const eqDelta = String.raw`\begin{aligned}|M_{\rm RBF}-M_{\rm EF}|&=V_s\Bigl|\int_\Omega \phi R\,(C_{\rm RBF}-C_{\rm EF})\,d\Omega\Bigr|\\
&\le V_s R\,\|\phi\|_{L^2}\,\|C_{\rm RBF}-C_{\rm EF}\|_{L^2}\end{aligned}`;

// e(t_n) de una columna, dibujada hasta la fracción q del horizonte, con un punto en el máximo de lo ya dibujado
function Traza({ y, escala, color, q, tenue }) {
    const W = 170, H = 38, n = y.length;
    const k = Math.max(1, Math.round(q * (n - 1)));
    const sx = i => 3 + i / (n - 1) * (W - 6), sy = v => H - 3 - Math.min(100 * v / escala, 1) * (H - 8);
    let im = 0;
    for (let i = 1; i <= k; i++) if (y[i] > y[im]) im = i;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
            <line x1={0} x2={W} y1={H - 3} y2={H - 3} stroke="var(--a3-filete)" strokeWidth="1.5" />
            <polyline points={y.slice(0, k + 1).map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')}
                      fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" opacity={tenue ? 0.8 : 1} />
            <circle cx={sx(im)} cy={sy(y[im])} r="3.6" fill={color} />
        </svg>
    );
}

export default function A3D02({ theme = 'dark' }) {
    const [p, repetir] = useProgreso(6500, 500);
    const pub = usePublica();
    const ant = DISC.columnas.anterior;
    return (
        <SlideLayout title="Del modelo anterior al modelo nuevo" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: pub ? '250px 1fr 40px 1fr' : '210px 1fr 40px 1fr', rowGap: pub ? 6 : 8, columnGap: 18, alignItems: 'center' }}>
                <span />
                <span style={cab}>antes</span><span />
                <span style={{ ...cab, color: 'var(--a3-valido)' }}>ahora</span>
                {cambios.map((c, i) => {
                    const v = tramo(p, 0.03 + 0.05 * i, 0.12 + 0.05 * i);
                    return (
                        <React.Fragment key={c.tema}>
                            <span style={{ fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-text)', fontWeight: 600 }}>{c.tema}</span>
                            <div style={{ ...celda, opacity: 0.55 }}>
                                <InlineMath math={c.antes} />
                                <span className="a3-completa" style={nota}>{c.antesTxt}</span>
                            </div>
                            <span style={{ color: 'var(--sl-muted)', fontSize: 30, textAlign: 'center', opacity: v }}>→</span>
                            <div style={{ ...celda, borderLeftColor: 'var(--a3-valido)', opacity: v }}>
                                <InlineMath math={c.ahora} />
                                <span style={nota}>{c.ahoraTxt}</span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            <div style={{ marginTop: pub ? 10 : 12, cursor: 'pointer' }} onClick={repetir} title="clic para repetir">
                <p style={{ margin: '0 0 6px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                    Discrepancia RBF-FD frente a elementos finitos en los 30 días<span className="a3-completa"> (ADR con fuente y pozo)</span>
                </p>
                {/* del nodo al número, en tres pasos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.85fr) 26px minmax(0, 1.8fr) 26px minmax(0, 0.65fr)', alignItems: 'end', columnGap: 8, marginBottom: pub ? 4 : 8 }}>
                    {PASOS.map((s, k) => {
                        const v = tramo(p, 0.2 + 0.07 * k, 0.28 + 0.07 * k);
                        return (
                            <React.Fragment key={k}>
                                {k > 0 && <span style={{ color: 'var(--sl-muted)', fontSize: 24, textAlign: 'center', opacity: v, paddingBottom: 4 }}>→</span>}
                                <div style={{ opacity: v, borderTop: '2px solid var(--a3-agua)', paddingTop: 3 }}>
                                    <span style={{ ...nota, display: 'block', whiteSpace: 'nowrap' }}>{k + 1}. {s.n}</span>
                                    <span style={{ fontSize: pub ? 20 : 19, color: 'var(--sl-text)', whiteSpace: 'nowrap' }}><InlineMath math={s.m} /></span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `${pub ? 250 : 220}px repeat(3, minmax(0, 1fr))`, columnGap: 22, rowGap: pub ? 0 : 2, alignItems: 'center' }}>
                    <span style={{ ...nota, alignSelf: 'end', paddingBottom: 4 }}>
                        <InlineMath math="e(t_n)" />, 0–30 d<span style={{ display: 'block' }}>cifra = máximo</span>
                    </span>
                    {ETAPAS.map((e, k) => (
                        <div key={k} style={{ alignSelf: 'end', opacity: tramo(p, 0.4 + 0.12 * k, 0.46 + 0.12 * k), borderBottom: `2px solid ${e.color}`, paddingBottom: 3 }}>
                            <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-text)', fontWeight: 600 }}>
                                {k + 1}. {e.titulo}
                            </span>
                            <span style={{ ...nota, display: 'block', whiteSpace: 'nowrap' }}>
                                {e.sub} · <span style={{ color: e.origen === 'archivada' ? 'var(--sl-muted)' : 'var(--a3-valido)', fontStyle: e.origen === 'archivada' ? 'italic' : 'normal' }}>{e.origen}</span>
                            </span>
                        </div>
                    ))}
                    {filas.map((b, i) => (
                        <React.Fragment key={i}>
                            <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.15 }}>
                                {b.nombre}
                                {b.sub && <span className="a3-completa" style={{ ...nota, display: 'block' }}>{b.sub}</span>}
                            </span>
                            {ETAPAS.map((e, k) => {
                                // cada columna dibuja su curva en el tiempo; la cifra es el máximo de lo ya dibujado
                                const q = suave(tramo(p, 0.45 + 0.12 * k, 0.75 + 0.12 * k));
                                if (b.jm) return b.jm[k] === null ? (
                                    <span key={k} style={{ ...nota, textAlign: 'center', whiteSpace: 'nowrap', opacity: q > 0 ? 1 : 0 }}>— sin campos<span className="a3-completa"> guardados</span></span>
                                ) : (
                                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 96px', alignItems: 'center', gap: 10, opacity: q > 0 ? 1 : 0 }}>
                                        <span style={{ ...nota, textAlign: 'center', whiteSpace: 'nowrap' }}>integrada en [0, T]</span>
                                        <span style={valor}>{(q * b.jm[k]).toFixed(1)} %</span>
                                    </div>
                                );
                                const y = DISC.curvas[e.clave][b.serie];
                                const n = Math.max(1, Math.round(q * (y.length - 1)));
                                const corriente = Math.max(...y.slice(0, n + 1));
                                const c = COL(k);
                                return (
                                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 96px', alignItems: 'center', gap: 10, opacity: q > 0 ? 1 : 0 }}>
                                        <Traza y={y} escala={b.escala} color={e.color} q={q} tenue={e.origen === 'archivada'} />
                                        <span style={valor}>
                                            {pc(corriente, b.dec)} %
                                            <span className="a3-completa" style={{ ...nota, display: 'block', fontSize: 13, lineHeight: 1.1 }}>
                                                en T: {pc(c[b.T], b.dec)}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
                <p className="a3-publica" style={{ ...nota, marginTop: 6 }}>
                    Cada traza es la discrepancia en los 144 instantes; la cifra, su máximo. La foto en <InlineMath math="T" /> ocultaba el{' '}
                    {pc(ant.V_max, 0)} % de la velocidad del día {Math.round(ant.V_tmax)} (en <InlineMath math="T" />, {pc(ant.V_T, 0)} %).
                    No es un desfase: retrasar una solución casi no reduce la diferencia.
                </p>
                <p className="a3-completa" style={{ ...nota, marginTop: 6 }}>
                    Cada traza: <InlineMath math="e(t_n)" /> en los 144 instantes (escala común por fila); la cifra es su máximo, que acota
                    todos los instantes (en gris, el valor en <InlineMath math="T" /> que se daba antes). <InlineMath math="\int C" />:{' '}
                    <InlineMath math={String.raw`\max_n|\textstyle\int C^{\rm RBF}/\!\int C^{\rm EF}-1|`} />. Con el modelo anterior la velocidad
                    llegó a {pc(ant.V_max)} % (día {ant.V_tmax.toFixed(1)}); en 2, el máximo es el primer paso. Desplazar en el tiempo una
                    solución baja la de <InlineMath math="C" /> solo de {pc(DISC.desfase.C.e_0, 2)} a {pc(DISC.desfase.C.e_opt, 2)} %: es
                    diferencia de forma, no un retraso. En <InlineMath math="J_m" /> la diferencia triplica la de <InlineMath math="C" />.
                </p>
            </div>

            <Notas titulo="Cómo se mide la discrepancia: de la malla y el tiempo a un número">
                <h4>1. Qué se compara</h4>
                <p>Dos aproximaciones del mismo problema discreto (RBF-FD y elementos finitos), en los mismos nodos, con la misma
                    configuración y los mismos instantes: no es un error frente a la solución exacta. Magnitudes: la concentración{' '}
                    <InlineMath math="C" /> en los vértices (en EF es P2; se compara solo en los vértices), el módulo de la velocidad de Darcy{' '}
                    <InlineMath math="|\mathbf u|" /> en los nodos y, aparte, <InlineMath math="\int_\Omega C\,d\Omega" /> y{' '}
                    <InlineMath math="J_m" />. Las cifras se dividen entre EF solo para dar un porcentaje; ninguna de las dos es la
                    referencia exacta <Cita k="oberkampf2010verification" />.</p>

                <h4>2. Del nodo al número, en tres pasos</h4>
                <p><b>En cada nodo e instante</b>, la diferencia con signo:</p>
                <BlockMath math={eqNodo} />
                <p><b>Sobre la malla</b>: la suma de cuadrados con el área <InlineMath math="w_i" /> que representa cada nodo (un tercio del área
                    de los triángulos que lo tocan: masa concentrada P1 de la triangulación común). Es la regla de cuadratura nodal de{' '}
                    <InlineMath math="\int_\Omega d^2" />, la del método de masa concentrada <Cita k="thomee2006galerkin" />. Sin los pesos, las
                    zonas refinadas (cerca del pozo y de la fuente la malla es unas 15 veces más fina) pesarían de más:</p>
                <BlockMath math={eqEspacio} />
                <p><b>En el tiempo</b>: un número por instante, <InlineMath math="e(t_n)" />, relativo a EF en ese instante; y de los 144,
                    el máximo:</p>
                <BlockMath math={eqTiempo} />
                <p>Es la versión discreta, relativa instante a instante, de la norma de <InlineMath math="L^\infty(0,T;L^2(\Omega))" />: la
                    norma en la que se enuncian las estimaciones de error de elementos finitos para problemas parabólicos, que acotan{' '}
                    <InlineMath math="\|u_h(t)-u(t)\|_{L^2}" /> en todo <InlineMath math="t\in[0,T]" /> <Cita k="thomee2006galerkin" />.</p>

                <h4>3. Qué significa el número</h4>
                <p><InlineMath math="e=3\,\%" /> en <InlineMath math="C" /> quiere decir: en el peor de los 144 instantes, la diferencia
                    cuadrática media de las dos concentraciones, ponderada por área, es el 3 % de la concentración cuadrática media de EF.
                    No dice dónde está la diferencia (la norma es global) ni si sobra o falta soluto (los cuadrados no tienen signo).</p>

                <h4>4. Por qué el máximo y no la foto en T</h4>
                <p>La lámina daba antes <InlineMath math="e(T)" />: un solo instante, elegido por conveniencia. Las curvas muestran cuándo
                    basta y cuándo no:</p>
                <ul>
                    <li><b><InlineMath math="C" /></b>: <InlineMath math="e(t_n)" /> crece en todo el horizonte en las tres columnas, así que el
                        máximo está en <InlineMath math="T" /> y las cifras no cambian ({pc(COL(0).C_max)}, {pc(COL(1).C_max)} y{' '}
                        {pc(COL(2).C_max)} %).</li>
                    <li><b><InlineMath math="|\mathbf u|" /></b>: en la columna 1 llega a {pc(COL(0).V_max)} % el día {COL(0).V_tmax.toFixed(1)} y baja
                        a {pc(COL(0).V_T)} % en <InlineMath math="T" />; la foto ocultaba lo peor. En la 2 el máximo ({pc(COL(1).V_max)} %) está en
                        el primer paso (5 h); después queda entre 13.5 y 15.5 %. En la 3, {pc(COL(2).V_max)} % el día{' '}
                        {COL(2).V_tmax.toFixed(1)} frente a {pc(COL(2).V_T)} % en <InlineMath math="T" />.</li>
                    <li><b><InlineMath math="\int C" /></b>: {pc(COL(0).I_max, 2)}, {pc(COL(1).I_max, 2)} y {pc(COL(2).I_max, 3)} % (en{' '}
                        <InlineMath math="T" />: {pc(COL(0).I_T, 2)}, {pc(COL(1).I_T, 2)} y {pc(COL(2).I_T, 3)} %).</li>
                </ul>
                <p>Alternativas, calculadas con los campos de la columna 3 (las corridas archivadas solo guardaron las series de{' '}
                    <InlineMath math="e(t_n)" />, no los campos):</p>
                <BlockMath math={eqST} />
                <table style={tabla}>
                    <thead><tr>{['métrica (columna 3)', '|u|', 'C'].map(h => <th key={h} style={thN}>{h}</th>)}</tr></thead>
                    <tbody>
                        {[['máximo en el tiempo de e(tₙ) (la de la lámina)', pc(COL(2).V_max), pc(COL(2).C_max)],
                          ['e(T): la foto que se daba antes', pc(COL(2).V_T), pc(COL(2).C_T)],
                          ['máx ‖d‖ / máx ‖v_EF‖ (L∞(0,T;L²) relativa estricta)', pc(DISC.espacio_tiempo.M0_adr.V_linf_estricta), pc(DISC.espacio_tiempo.M0_adr.C_linf_estricta)],
                          ['espacio-tiempo L²(0,T;L²), un promedio', pc(DISC.espacio_tiempo.M0_adr.V), pc(DISC.espacio_tiempo.M0_adr.C)],
                          ['L¹ en t = T', '8.9', '1.7'], ['L∞ nodal en t = T (un solo nodo)', '38.4', '12.2']].map(r => (
                            <tr key={r[0]}>{r.map((c, k) => <td key={k} style={tdN}>{k ? `${c} %` : c}</td>)}</tr>
                        ))}
                    </tbody>
                </table>
                <p>El promedio en espacio-tiempo es menor que el máximo porque la discrepancia es menor al principio (en{' '}
                    <InlineMath math="C" />, {pc(DISC.curvas.nuevo_conos.C[0], 2)} % en el primer paso, y crece hasta {pc(COL(2).C_max)} % en{' '}
                    <InlineMath math="T" />). La L∞ nodal depende de un solo nodo y no es robusta; L¹ en <InlineMath math="T" /> viene de{' '}
                    <code>metricas_discrepancia.py</code>. Se eligió el máximo porque es la norma de las estimaciones parabólicas, acota todos
                    los instantes y se puede calcular para las tres columnas.</p>

                <h4>5. ¿Y si una solución va retrasada?</h4>
                <p>Un esquema de advección puede cometer error de amplitud y error de fase: el frente puede llegar algo antes o
                    después <Cita k="durran2010numerical" />. Si fuera solo un retraso, la comparación sincronizada daría una cifra alta aunque la
                    dinámica fuera la misma (un frente desplazado se penaliza dos veces: falta donde debería estar y sobra donde no; los
                    métodos de verificación espacial «de desplazamiento» existen para separar ese efecto <Cita k="gilleland2009intercomparison" />).
                    Para comprobarlo se desplazó RBF-FD en el tiempo, con interpolación lineal entre instantes, y se buscó el mejor{' '}
                    <InlineMath math="\tau" /> en ±25 h (ventana común: días {DISC.desfase.C.ventana_dias[0].toFixed(1)}–{DISC.desfase.C.ventana_dias[1].toFixed(1)}):</p>
                <BlockMath math={eqDesfase} />
                <p><InlineMath math="\min_\tau e_{ST}(\tau)" /> <b>no es una norma de la diferencia entre las soluciones</b>: mide el parecido
                    salvo una traslación en el tiempo (vale cero para dos soluciones idénticas pero desfasadas). Responde a otra pregunta y
                    no sustituye a la cifra de la lámina. Resultado:</p>
                <ul>
                    <li><InlineMath math="C" />: el mejor desfase, {DISC.desfase.C.tau_opt_h.toFixed(1)} h, baja la discrepancia solo de{' '}
                        {pc(DISC.desfase.C.e_0, 2)} a {pc(DISC.desfase.C.e_opt, 2)} %. <InlineMath math="|\mathbf u|" />: de {pc(DISC.desfase.V.e_0, 2)} a{' '}
                        {pc(DISC.desfase.V.e_opt, 2)} % con {DISC.desfase.V.tau_opt_h.toFixed(0)} h. La diferencia es de forma (dónde está el soluto), no
                        un retraso.</li>
                    <li>En el pozo, la concentración captada <InlineMath math="c_w(t)=\int_\Omega g_\varepsilon C\,d\Omega" /> de RBF-FD está entre 4.5 y
                        6.8 % por debajo de la de EF desde el primer día. Un desfase de {DISC.desfase.cw.tau_opt_h.toFixed(0)} h la baja de{' '}
                        {pc(DISC.desfase.cw.e_0)} a {pc(DISC.desfase.cw.e_opt)} %, pero un factor de amplitud sin desfase
                        ({DISC.desfase.cw.amplitud.toFixed(3)}) la deja en {pc(DISC.desfase.cw.e_amplitud, 2)} %, y el mejor par (desfase, amplitud)
                        tiene solo {DISC.desfase.cw.tau_amp_h.toFixed(1)} h. Es una diferencia de amplitud, no de tiempo: en una curva que sube de forma
                        sostenida, un retraso y un factor se parecen, y el factor la explica mejor. Separar sesgo, variabilidad y
                        sincronía es la idea de la descomposición del error cuadrático de <Cita k="gupta2009decomposition" />.</li>
                    <li>Para curvas de llegada en forma de pulso, el retraso se mide con los momentos temporales (tiempo medio de
                        llegada) <Cita k="harvey1995temporal" />; aquí no aplica, porque <InlineMath math="c_w(t)" /> sigue subiendo a los 30 días.</li>
                </ul>
                <p>Script: <code>codigo/scripts/metricas_tiempo.py</code> → <code>data/output/experimentos/metricas_tiempo.json</code> y{' '}
                    <code>discrepanciaTiempo.js</code>.</p>

                <h4>6. Limitaciones</h4>
                <ul>
                    <li>Discrepancia no es error: para hablar de error hace falta una referencia (malla más fina y extrapolación de
                        Richardson) <Cita k="oberkampf2010verification" />.</li>
                    <li>El máximo lo decide un solo instante (en la columna 2, el primer paso); por eso se muestran las curvas.</li>
                    <li>Es global: no localiza. En <InlineMath math="|\mathbf u|" />, el 98 % de la diferencia está donde <InlineMath math="\phi\ge0.6" />.</li>
                    <li>Es relativa a EF, no simétrica; y depende de cómo cada código obtiene los valores nodales (velocidad de EF: valor de
                        un triángulo vecino; <InlineMath math="C" /> de EF: P2 evaluada en vértices).</li>
                    <li>Columnas 1 y 2: solo series de <InlineMath math="e(t_n)" />; sin campos no se pueden recalcular el espacio-tiempo, el
                        desfase ni <InlineMath math="J_m" />.</li>
                </ul>

                <h4>La cifra de |u| ({pc(COL(2).V_max)} %)</h4>
                <ul>
                    <li><b>Dónde está.</b> El 98 % de <InlineMath math="\|\Delta|\mathbf u|\|_h^2" /> (en <InlineMath math="T" />) cae donde{' '}
                        <InlineMath math="\phi\ge0.6" />; la mitad, en 73 nodos, sobre todo junto a la entrada (<InlineMath math="x>9500" /> m,{' '}
                        <InlineMath math="z>0" />). A menos de 100 m del pozo solo hay el 16 %. Como{' '}
                        <InlineMath math="K_z\propto\phi^3/(1-\phi)^2" /> llega a 25 m/s en esta malla, una diferencia pequeña de{' '}
                        <InlineMath math="\nabla h" /> se amplifica donde <InlineMath math="K" /> es grande. La carga sí coincide:{' '}
                        <InlineMath math="\Delta h_{\rm rms}=1.7" /> cm frente a un rango de 3.75 m.</li>
                    <li><b>Parte es el cálculo de la velocidad en EF.</b> Con <InlineMath math="h" /> en P1, <InlineMath math="-\mathbf K\nabla h" /> es
                        constante en cada triángulo; el valor nodal guardado es el de uno solo de los triángulos vecinos. Con el promedio
                        ponderado por área de los vecinos, la discrepancia en <InlineMath math="T" /> baja a 9.2 %; con <InlineMath math="h" /> en P2
                        en EF (<InlineMath math="\Delta t=2" /> h), a 8.8 %.</li>
                </ul>

                <h4>Concentración y masa</h4>
                <p><InlineMath math="C_m(\mathbf x,t)" /> es masa de soluto por unidad de volumen de agua móvil: intensiva y local
                    (<InlineMath math="[\mathrm{M\,L^{-3}}]" />). La masa es extensiva; con retardo lineal y anchura <InlineMath math="V_s=30" /> m:</p>
                <BlockMath math={eqMasa} />
                <p><InlineMath math="\int_\Omega C\,d\Omega" /> pesa igual cada m² de la sección, esté el agua en el 3 % o en el 95 % de ella:
                    solo sería la masa con <InlineMath math="\phi\equiv1" />. Con la porosidad (auditoría 24-nov, en <InlineMath math="T" />): ADR,{' '}
                    <InlineMath math="\int C" /> 0.017 % y masa 0.12 %; MRMT, <InlineMath math="\int C" /> 0.12 % y masa total 0.011–0.012 %.
                    La diferencia de masa es una integral con signo (las diferencias se cancelan); la norma de <InlineMath math="\Delta C" /> no:</p>
                <BlockMath math={eqDelta} />
                <p>Un <InlineMath math="e(C)" /> pequeño acota el error de masa; al revés no. La masa dice si el esquema conserva el soluto; la
                    concentración, dónde está y cuánto llega al pozo.</p>

                <h4>Antes y ahora: qué cambia entre columnas</h4>
                <ul>
                    <li><b>1</b> (A3_fuente_pozo): modelo anterior con W₋, sin almacenamiento, salida de 2.º orden en RBF-FD y{' '}
                        <InlineMath math="\mathbf u\cdot\mathbf n=f_{out}" /> en EF; fuente con <InlineMath math="\varepsilon_z=60" /> m y pico{' '}
                        <InlineMath math="10^{-11}" />; estencil de 35 nodos.</li>
                    <li><b>2</b> (M0_adr, nube anterior): modelo nuevo y salida libre en ambos; fuente con <InlineMath math="\varepsilon_z=30" /> m y
                        pico <InlineMath math="5\cdot10^{-12}" />; estencil de 25.</li>
                    <li><b>3</b>: como la 2 salvo la malla.</li>
                </ul>
                <p>Con la nube fija, el paquete modelo + fuente + estencil baja el máximo de <InlineMath math="C" /> de {pc(COL(0).C_max)} a{' '}
                    {pc(COL(1).C_max)} % y el de <InlineMath math="|\mathbf u|" /> de {pc(COL(0).V_max)} a {pc(COL(1).V_max)} %; con la foto en{' '}
                    <InlineMath math="T" /> parecía que <InlineMath math="|\mathbf u|" /> empeoraba ({pc(COL(0).V_T)} → {pc(COL(1).V_T)} %).
                    Refinar la malla baja <InlineMath math="|\mathbf u|" /> a {pc(COL(2).V_max)} % y <InlineMath math="C" /> a {pc(COL(2).C_max)} %.
                    Ninguna corrida separa el efecto del modelo del de la fuente y el estencil. Con el modelo anterior y la misma condición
                    de salida en los dos métodos (corrida B3), <InlineMath math="C" /> seguía en 23.6 %: unificar la salida no basta para
                    explicar la mejora en <InlineMath math="C" />.</p>
            </Notas>
        </SlideLayout>
    );
}

const cab = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' };
const celda = { display: 'flex', flexDirection: 'column', gap: 2, borderLeft: '3px solid var(--a3-estrato)', padding: '2px 0 2px 16px',
                fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' };
const valor = { fontSize: 'var(--a3-fs-cuerpo)', textAlign: 'right', color: 'var(--sl-text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 };
const tabla = { borderCollapse: 'collapse', fontFamily: 'var(--a3-sans)', fontSize: 15, margin: '4px 0 10px' };
const thN = { textAlign: 'left', padding: '2px 12px 2px 0', borderBottom: '1px solid var(--a3-filete)' };
const tdN = { padding: '2px 12px 2px 0' };
