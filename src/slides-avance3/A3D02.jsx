import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useProgreso, suave, tramo } from './anim.js';
import { usePublica, Notas } from './version.jsx';

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

// Discrepancia relativa RBF-FD vs EF en t = T = 30 d (paso 144 de Δt = 5 h), ADR con fuente y pozo (Q_std = 0.3), en %.
// Métricas de experimentos/comparar.py sobre los nodos comunes, con pesos de área nodal (P1 concentrada) de la
// triangulación: C_L2_rel_final, V_L2_rel_final y |1 − masa_ratio_final|, donde «masa» es ∫C dΩ, SIN porosidad.
//   1.ª A_terminos/A3_fuente_pozo y 2.ª M_modelo_nuevo/M0_adr, ambas en la nube común anterior (15 626 nodos): solo quedan
//       las métricas (codigo/archivo/resultados_json/codigo/experimentos/resumen.csv), no los campos: no se pueden recalcular.
//   3.ª M_modelo_nuevo/M0_adr en la malla con conos (codigo/data/output/experimentos/resumen.csv); recalculada en la
//       auditoría del 24-nov-2026 desde los simulation_results.npz de ambos backends: 12.545 %, 2.990 %, 0.0168 %.
// De la 1.ª a la 2.ª cambian el modelo, la fuente (ε_z 60 → 30 m, pico 1e-11 → 5e-12) y el estencil (35 → 25 nodos); de la
// 2.ª a la 3.ª solo la malla (config.json idénticas salvo mesh_pkl). No es «el mismo caso» de principio a fin.
const ETAPAS = [
    { titulo: 'modelo anterior', sub: 'nube de 15 626 nodos', origen: 'archivada', color: 'var(--a3-pluma)' },
    { titulo: 'modelo nuevo', sub: 'misma nube', origen: 'archivada', color: 'var(--a3-agua)' },
    { titulo: 'modelo nuevo', sub: 'malla con conos, 20 348', origen: 'recalculada', color: 'var(--a3-valido)' },
];
// J_m (fila 4): |J_m^RBF/J_m^EF − 1| con J_m = ∫∫ g_ε C² dΩ dt (ε = r_pozo/3), y las métricas alternativas de las notas:
// codigo/scripts/metricas_discrepancia.py → data/output/experimentos/M_modelo_nuevo/M0_adr/metricas_alternativas.json.
// Las corridas archivadas (columnas 1 y 2) no guardaron campos: J_m no se puede calcular para ellas.
const barras = [
    { nombre: <><InlineMath math="|\mathbf u|" /> velocidad</>, v: [13.0, 15.5, 12.5], dec: 1 },
    { nombre: <><InlineMath math="C" /> concentración</>, v: [24.5, 5.4, 3.0], dec: 1 },
    { nombre: <InlineMath math="\textstyle\int_\Omega C\,d\Omega" />, sub: 'sin φ: no es la masa', v: [1.80, 0.12, 0.02], dec: 2 },
    { nombre: <><InlineMath math="J_m" /> en el pozo</>, sub: 'lo que se optimiza', v: [null, null, 8.952], dec: 1 },
];
const ESCALA = 25;

// Ecuaciones de las notas (tesis, Cap. I §forma conservativa y Cap. II, Proposición de conservación de masa).
const eqNorma = String.raw`e(v)=\frac{\|v_{\rm RBF}-v_{\rm EF}\|_h}{\|v_{\rm EF}\|_h},\qquad \|v\|_h^2=\sum_i w_i\,v_i^2,\qquad
e_{\int}=\Bigl|1-\frac{\sum_i w_i C_i^{\rm RBF}}{\sum_i w_i C_i^{\rm EF}}\Bigr|`;
const eqMasa = String.raw`M_m(t)=V_s\!\int_\Omega \phi\,R\,C_m\,d\Omega\quad[\mathrm{kg}],\qquad
M(t)=V_s\!\int_\Omega\Bigl(\phi R\,C_m+\sum_{r=1}^{N_r}\eta_r\phi R\,C_{{\rm im},r}\Bigr)d\Omega`;
const eqDelta = String.raw`|M_{\rm RBF}-M_{\rm EF}|=V_s\Bigl|\int_\Omega \phi R\,(C_{\rm RBF}-C_{\rm EF})\,d\Omega\Bigr|
\le V_s R\,\|\phi\|_{L^2}\,\|C_{\rm RBF}-C_{\rm EF}\|_{L^2}`;

export default function A3D02({ theme = 'dark' }) {
    const [p] = useProgreso(3600, 500);
    const pub = usePublica();
    return (
        <SlideLayout title="Del modelo anterior al modelo nuevo" theme={theme} justify="flex-start">
            <div style={{ display: 'grid', gridTemplateColumns: pub ? '250px 1fr 40px 1fr' : '210px 1fr 40px 1fr', rowGap: 10, columnGap: 18, alignItems: 'center' }}>
                <span />
                <span style={cab}>antes</span><span />
                <span style={{ ...cab, color: 'var(--a3-valido)' }}>ahora</span>
                {cambios.map((c, i) => {
                    const v = tramo(p, 0.05 + 0.1 * i, 0.2 + 0.1 * i);
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

            <div style={{ marginTop: 14 }}>
                <p style={{ margin: '0 0 10px', fontSize: 'var(--a3-fs-seccion)', color: 'var(--sl-accent)' }}>
                    Discrepancia entre RBF-FD y elementos finitos a los 30 días<span className="a3-completa"> (ADR con fuente y pozo)</span>
                </p>
                <p style={{ ...nota, margin: '0 0 10px', color: 'var(--sl-text)' }}>
                    <InlineMath math={String.raw`e(v)=\|v_{\rm RBF}-v_{\rm EF}\|\,/\,\|v_{\rm EF}\|,\quad \|v\|^2=\textstyle\sum_i w_i\,v_i(T)^2`} />
                    <span className="a3-completa"> (<InlineMath math="w_i" />: área nodal; mismos nodos, <InlineMath math="T=30" /> d)</span>
                    <span>{'  ·  '}<InlineMath math="\int C" /> y <InlineMath math="J_m" />: <InlineMath math={String.raw`|X_{\rm RBF}/X_{\rm EF}-1|`} /></span>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: `${pub ? 250 : 220}px repeat(3, 1fr)`, columnGap: 22, rowGap: 8, alignItems: 'center' }}>
                    <span />
                    {ETAPAS.map((e, k) => (
                        <div key={k} style={{ alignSelf: 'end', opacity: tramo(p, 0.3 + 0.2 * k, 0.42 + 0.2 * k), borderBottom: `2px solid ${e.color}`, paddingBottom: 4 }}>
                            <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-text)', fontWeight: 600 }}>
                                {k + 1}. {e.titulo}
                            </span>
                            <span style={{ ...nota, display: 'block' }}>
                                {e.sub} · <span style={{ color: e.origen === 'archivada' ? 'var(--sl-muted)' : 'var(--a3-valido)', fontStyle: e.origen === 'archivada' ? 'italic' : 'normal' }}>{e.origen}</span>
                            </span>
                        </div>
                    ))}
                    {barras.map((b, i) => (
                        <React.Fragment key={i}>
                            <span style={{ fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.2 }}>
                                {b.nombre}
                                {b.sub && <span className="a3-completa" style={{ ...nota, display: 'block' }}>{b.sub}</span>}
                            </span>
                            {ETAPAS.map((e, k) => {
                                const q = suave(tramo(p, 0.3 + 0.2 * k, 0.5 + 0.2 * k));
                                if (b.v[k] === null) return (
                                    <span key={k} style={{ ...nota, textAlign: 'center', opacity: q > 0 ? 1 : 0 }}>— sin campos guardados</span>
                                );
                                return (
                                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 92px', alignItems: 'center', gap: 10, opacity: q > 0 ? 1 : 0 }}>
                                        <div style={{ position: 'relative', height: 22, background: 'var(--a3-filete)', opacity: 0.9 }}>
                                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${q * b.v[k] / ESCALA * 100}%`,
                                                          background: e.color, opacity: e.origen === 'archivada' ? 0.75 : 1 }} />
                                        </div>
                                        <span style={{ fontSize: 'var(--a3-fs-cuerpo)', textAlign: 'right', color: 'var(--sl-text)', fontVariantNumeric: 'tabular-nums' }}>
                                            {(q * b.v[k]).toFixed(b.dec)} %
                                        </span>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
                <p className="a3-publica" style={{ ...nota, marginTop: 8 }}>
                    De 1 a 2 cambian modelo, fuente y estencil; de 2 a 3, solo la malla. En <InlineMath math="J_m" />, lo que se optimiza, la
                    diferencia triplica la de <InlineMath math="C" />.
                </p>
                <p className="a3-completa" style={{ ...nota, marginTop: 10 }}>
                    Normas <InlineMath math="L^2" /> relativas a EF con pesos de área nodal, en los mismos nodos, misma configuración y mismo instante.
                    1 y 2: corridas archivadas, solo quedan sus métricas (no se pueden recalcular); entre ellas cambian también la fuente
                    (<InlineMath math="\varepsilon_z" /> de 60 a 30 m, intensidad a la mitad) y el estencil (35 → 25 nodos), así que la mejora en C no
                    se atribuye solo a las tres correcciones. 3: recalculada de los campos guardados. La diferencia en |u| está en la franja de
                    alta porosidad (98 % del error con φ ≥ 0.6), sobre todo junto a la entrada; a menos de 100 m del pozo, solo el 16 %.
                    En <InlineMath math="J_m" /> (C² pesada con el núcleo del pozo, en todo el horizonte) la diferencia es 9.0 %: la norma
                    global de C (3.0 %) subestima lo que importa para optimizar.
                </p>
            </div>

            <Notas titulo="Qué se compara, concentración frente a masa">
                <h4>Qué miden las barras</h4>
                <p>Son discrepancias entre dos aproximaciones del mismo problema discreto, no errores frente a la solución exacta. Se
                    evalúan en <InlineMath math="t=T=30" /> d (paso 144 de <InlineMath math="\Delta t=5" /> h), en los mismos nodos y con los
                    pesos de área nodal <InlineMath math="w_i" /> (P1 concentrada) de la triangulación común:</p>
                <BlockMath math={eqNorma} />
                <p>En la columna 3 las dos corridas tienen la misma configuración salvo el método (comprobado clave por clave en sus
                    <code> config.json</code>), la misma condición inicial (<code>funcion.h5</code> en los nodos), la misma salida libre, el
                    mismo <InlineMath math="\Delta t" /> y los mismos instantes. Las tres cifras se recalcularon de los campos guardados:
                    12.55 %, 2.99 % y 0.017 %, iguales a las del resumen. La concentración de EF es P2, pero la comparación usa solo sus
                    valores en los vértices.</p>

                <h4>La cifra de |u|: 12.5 %</h4>
                <ul>
                    <li><b>Dónde está.</b> El 98 % de <InlineMath math="\|\Delta|\mathbf u|\|_h^2" /> cae donde <InlineMath math="\phi\ge0.6" />; la
                        mitad, en 73 nodos, sobre todo junto a la entrada (<InlineMath math="x>9500" /> m, <InlineMath math="z>0" />). A menos de 100 m
                        del pozo solo hay el 16 %; sin ese disco la discrepancia sigue en 12.4 %. Como{' '}
                        <InlineMath math="K_z\propto\phi^3/(1-\phi)^2" /> llega a 25 m/s en esta malla, una diferencia pequeña de <InlineMath math="\nabla h" /> se
                        amplifica donde <InlineMath math="K" /> es grande. La carga sí coincide: <InlineMath math="\Delta h_{\rm rms}=1.7" /> cm frente
                        a un rango de 3.75 m.</li>
                    <li><b>Parte es el cálculo de la velocidad en EF.</b> Con <InlineMath math="h" /> en P1, <InlineMath math="-\mathbf K\nabla h" /> es
                        constante en cada triángulo; el valor nodal guardado es el de uno solo de los triángulos vecinos (coincide con él a
                        <InlineMath math="10^{-16}" />). Con el promedio ponderado por área de los vecinos, la discrepancia baja a 9.2 %; con ese
                        mismo operador aplicado a las dos cargas, a 8.8 %. Con <InlineMath math="h" /> en P2 en EF (<InlineMath math="\Delta t=2" /> h),
                        8.8 %.</li>
                    <li><b>Sensibilidad a la malla.</b> 15.5 % (15 626 nodos), 12.5 % (20 348), 10.9 % (eje de 1 m, 25 871) y 12.0 % (eje de
                        0.5 m, 39 613): no es monótona; las dos últimas mallas solo refinan el eje del pozo, no la franja permeable.</li>
                    <li><b>En el tiempo.</b> En la corrida actual no pasa del 12.6 % en ningún instante. En la archivada del modelo anterior llegó
                        al 78 % (día 5.4) y bajó al 13.0 % al final: la cifra final de la columna 1 no la representa.</li>
                </ul>

                <h4>Concentración: qué es</h4>
                <p><InlineMath math="C_m(\mathbf x,t)" /> es la masa de soluto disuelta por unidad de volumen de agua de la región móvil, en el
                    punto <InlineMath math="\mathbf x" />. Es una magnitud intensiva y local, de unidades <InlineMath math="[\mathrm{M\,L^{-3}}]" />{' '}
                    (kg/m³ = g/L; el nitrato se reporta en mg/L). En estas corridas va en unidades del modelo: el transporte es lineal en{' '}
                    <InlineMath math="C" /> y la escala la fijan la condición inicial y la fuente. Es lo que regula la norma (<InlineMath math="C_{\rm ref}=50" /> mg/L)
                    y lo que entra en el funcional a través de la concentración captada en el pozo.</p>

                <h4>Masa: qué es</h4>
                <p>Un volumen <InlineMath math="dV" /> de acuífero contiene <InlineMath math="\phi\,dV" /> de agua móvil y, con retardo lineal,{' '}
                    <InlineMath math="\phi R\,C_m\,dV" /> de soluto. El dominio es una sección vertical de anchura <InlineMath math="V_s=30" /> m, así que{' '}
                    <InlineMath math="dV=V_s\,d\Omega" />:</p>
                <BlockMath math={eqMasa} />
                <p>Es extensiva: cuánto soluto hay, no dónde. Por unidad de anchura tiene unidades <InlineMath math="[\mathrm{M\,L^{-1}}]" /> (kg/m).
                    En MRMT la región móvil es solo una parte: el intercambio conserva la masa total <InlineMath math="M" />, no la móvil
                    (Prop. de conservación del Cap. II), y su balance solo cambia por los flujos de borde, el pozo y la fuente.</p>

                <h4>Por qué la barra no es la masa</h4>
                <p><InlineMath math="\int_\Omega C\,d\Omega" /> tiene las mismas unidades que <InlineMath math="M/V_s" />, y por eso se confunde, pero
                    pesa igual cada m² de la sección, esté el agua en el 3 % o en el 95 % de ella (<InlineMath math="\phi\in[0.03,0.95]" />). Solo
                    sería la masa con <InlineMath math="\phi\equiv1" />. Con la porosidad, recalculado de los mismos campos (auditoría 24-nov):</p>
                <ul>
                    <li>ADR: <InlineMath math="\int C" /> difiere 0.017 %; la masa <InlineMath math="\int\phi C" />, 0.12 %.</li>
                    <li>MRMT semi y bloque: <InlineMath math="\int C" /> 0.12 %; masa móvil 0.011–0.012 %; masa total (móvil + inmóvil) 0.011–0.012 %.
                        Las regiones inmóviles guardan el 23 % de la masa total en las dos discretizaciones.</li>
                </ul>
                <p>Las dos medidas son pequeñas, pero no son la misma cosa ni ordenan igual los modelos. De las corridas archivadas solo
                    queda <InlineMath math="\int C" />.</p>

                <h4>Cómo se relacionan y por qué los porcentajes difieren</h4>
                <BlockMath math={eqDelta} />
                <p>La diferencia de masa es una integral con signo: las diferencias positivas y negativas se cancelan. La norma de{' '}
                    <InlineMath math="\Delta C" /> usa cuadrados y no cancela nada. Un <InlineMath math="e(C)" /> pequeño acota el error de masa;
                    al revés no. En ADR, <InlineMath math="\int\Delta C\,d\Omega=-7.7\cdot10^{-9}" /> mientras que{' '}
                    <InlineMath math="\int|\Delta C|\,d\Omega=7.9\cdot10^{-7}" />, cien veces más: el error relativo en <InlineMath math="L^1" /> es 1.7 %,
                    el de la integral 0.017 %. Físicamente, si un método difunde un poco más o desplaza el frente, la masa se conserva pero
                    la concentración local cambia.</p>
                <p><b>Para defenderlo:</b> la masa dice si el esquema conserva el soluto (balance); la concentración dice dónde está y cuánto
                    llega al pozo. Un acuerdo de 0.02 % en masa no valida la concentración en el pozo, y en MRMT una masa móvil menor no
                    es soluto perdido sino retenido en las regiones inmóviles.</p>

                <h4>¿Es la mejor métrica?</h4>
                <p>Para dos campos que varían en el tiempo sobre la misma nube, la norma natural es la de espacio-tiempo{' '}
                    <InlineMath math="L^2(0,T;L^2(\Omega))" />, discretizada con los mismos pesos y el mismo <InlineMath math="\Delta t" />:</p>
                <BlockMath math={String.raw`e_{ST}(v)=\Bigl(\frac{\sum_n\Delta t\sum_i w_i\,(v^{n}_{i,\rm RBF}-v^{n}_{i,\rm EF})^2}{\sum_n\Delta t\sum_i w_i\,(v^{n}_{i,\rm EF})^2}\Bigr)^{1/2}`} />
                <p>La lámina usa la <InlineMath math="L^2(\Omega)" /> en un solo instante, <InlineMath math="t=T" />: una foto. Recalculadas
                    con los mismos campos (columna 3):</p>
                <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--a3-sans)', fontSize: 16, margin: '4px 0 10px' }}>
                    <thead><tr>{['métrica', '|u|', 'C'].map(h => <th key={h} style={{ textAlign: 'left', padding: '2px 12px 2px 0', borderBottom: '1px solid var(--a3-filete)' }}>{h}</th>)}</tr></thead>
                    <tbody>
                        {[['L² en t = T (la de la lámina)', '12.5 %', '3.0 %'], ['L² máxima en el tiempo', '12.6 % (día 25)', '3.0 % (día 30)'],
                          ['L² espacio-tiempo', '11.9 %', '2.1 %'], ['L¹ en t = T', '8.9 %', '1.7 %'], ['L∞ en t = T (un nodo)', '38.4 %', '12.2 %']].map(r => (
                            <tr key={r[0]}>{r.map((c, k) => <td key={k} style={{ padding: '2px 12px 2px 0' }}>{c}</td>)}</tr>
                        ))}
                    </tbody>
                </table>
                <p>Cantidades del pozo, las que entran en la optimización (<InlineMath math="g_\varepsilon" />: núcleo del pozo,{' '}
                    <InlineMath math="\varepsilon=r_{\rm pozo}/3" />): concentración captada <InlineMath math="c_w(t)=\int_\Omega g_\varepsilon C\,d\Omega" />,
                    5.9 % en <InlineMath math="L^2(0,T)" /> y 4.9 % en <InlineMath math="t=T" />; y <InlineMath math="J_m=\int_0^T\!\int_\Omega g_\varepsilon C^2" />,{' '}
                    <b>9.0 %</b>. <InlineMath math="\int C" />: 0.017 % en <InlineMath math="T" />, 0.068 % como máximo en el tiempo.</p>
                <ul>
                    <li><b>La foto en T no engaña aquí:</b> en C la discrepancia crece con el tiempo (máxima en T) y en |u| la máxima es
                        12.6 %, así que la cifra final es una cota conservadora; la de espacio-tiempo es menor (2.1 % y 11.9 %).</li>
                    <li><b>L² es la elección estándar</b>: es la norma de las estimaciones de error de elementos finitos y, con los pesos de
                        área, aproxima la integral sobre Ω aunque la nube sea muy desigual (sin pesos, las zonas refinadas pesarían de más).
                        L∞ depende de un solo nodo (38 %) y no es robusta; L¹ se relaciona con la masa pero es menos usual.</li>
                    <li><b>Para el control, la mejor métrica es la meta:</b> lo que se optimiza es <InlineMath math="J_m" />, y ahí la diferencia
                        (9.0 %) triplica la de C en L². La comparación debería informar el error en la cantidad de interés, y también en su
                        gradiente, además de la norma global.</li>
                    <li><b>Discrepancia no es error:</b> se divide entre EF como si fuera la referencia, pero ninguno de los dos es exacto. Para
                        hablar de error hace falta una solución de referencia (malla más fina y extrapolación de Richardson).</li>
                </ul>
                <p><b>Recomendación:</b> informar la <InlineMath math="L^2" /> de espacio-tiempo junto con el error en{' '}
                    <InlineMath math="J_m" />, y conservar la foto en T solo por continuidad con los resultados anteriores.</p>

                <h4>Antes y ahora: qué cambia entre columnas</h4>
                <ul>
                    <li><b>1</b> (A3_fuente_pozo): modelo anterior con W₋, sin almacenamiento, salida de 2.º orden en RBF-FD y{' '}
                        <InlineMath math="\mathbf u\cdot\mathbf n=f_{out}" /> en EF; fuente con <InlineMath math="\varepsilon_z=60" /> m y pico{' '}
                        <InlineMath math="10^{-11}" />; estencil de 35 nodos.</li>
                    <li><b>2</b> (M0_adr, nube anterior): modelo nuevo y salida libre en ambos; fuente con <InlineMath math="\varepsilon_z=30" /> m y
                        pico <InlineMath math="5\cdot10^{-12}" />; estencil de 25.</li>
                    <li><b>3</b>: como la 2 salvo la malla.</li>
                </ul>
                <p>Lo que los datos permiten afirmar: refinar la malla baja |u| de 15.5 a 12.5 % y C de 5.4 a 3.0 %. Con la nube fija, el
                    paquete modelo + fuente + estencil baja C de 24.5 a 5.4 % y <InlineMath math="\int C" /> de 1.80 a 0.12 %, pero sube |u|
                    de 13.0 a 15.5 %. Ninguna corrida separa el efecto del modelo del de la fuente y el estencil. Con el modelo anterior y la
                    misma condición de salida en los dos métodos (corrida B3), C seguía en 23.6 % y |u| bajaba a 10.0 %: unificar la salida
                    no basta para explicar la mejora en C. W₋ no cambia la discrepancia en este caso (24.54 % con y sin él).</p>
            </Notas>
        </SlideLayout>
    );
}

const cab = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-muted)' };
const celda = { display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '3px solid var(--a3-estrato)', padding: '4px 0 4px 16px',
                fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)' };
const nota = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' };
