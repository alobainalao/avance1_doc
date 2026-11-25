import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useFases, reducida, suave, tramo } from './anim.js';
import { usePublica, Notas } from './version.jsx';
import { ESTADOS, Marca } from './estado.jsx';

// Estado actual de la investigación y próximos pasos, en cinco fases que avanza el expositor (flechas o control remoto;
// clic en la lámina = siguiente fase; clic en una etiqueta de abajo = ir a esa fase): los cuatro estados se llenan uno a
// uno, de lo completo a lo pendiente, y al final aparecen los próximos pasos con plazos tentativos. Las cifras de los
// óptimos son las de los mejores iterados del 23-nov (optimoNitrato.js). PENDIENTE: actualizarlas con la serie
// definitiva (serie 33, relanzada desde el inicio el 24-nov) cuando termine.
const AGUA = 'var(--a3-agua)';
const M = (t) => <InlineMath math={t} />;

// Por estado: d = qué significa (p: el corto de la pública, si hace falta); items: t = texto de las dos versiones,
// x = precisión que solo va en la completa, completa = el punto entero solo va en la completa.
const GRUPOS = [
    { e: 'com', d: 'Implementado y verificado; las corridas nuevas no lo modifican.', items: [
        { t: 'Modelo ADR y MRMT en seis implementaciones' },
        { t: <>Problema directo: RBF-FD y elementos finitos difieren 3 % en {M('C')} y 12.5 % en {M('|\\mathbf u|')}</> },
        { t: 'Gradiente adjunto verificado en horizonte corto' },
        { t: <>Eje del pozo a 1 m: sin mínimos espurios en {M('\\hat J(z_p)')}</>, completa: true },
    ] },
    { e: 'pre', d: <>Hay resultados, pero sin convergencia completa ({M('\\chi>10^{-4}')}): las cifras pueden cambiar con las corridas definitivas.</>,
      p: 'Hay resultados, aún no definitivos: las cifras pueden cambiar.', items: [
        { t: 'Óptimos con elementos finitos: pozo a ≈ −383 m (ADR) y −405 m (MRMT semi)', x: <>{M('\\chi\\sim10^{-3}')}; bloque aún sin óptimo confiable</> },
        { t: 'MRMT ≈ ADR retardado: pozo ≈ 20 m más hondo', x: 'con estos parámetros' },
    ] },
    { e: 'des', d: 'Trabajo en marcha, todavía sin resultados definitivos.', items: [
        { t: 'Corridas definitivas con elementos finitos', x: 'tres modelos y pruebas de consistencia' },
        { t: <>Frente de Pareto: barrido preliminar de {M('z_p')}</>, x: <>falta el de {M('\\gamma')}</> },
        { t: 'Artículo y capítulos de la tesis: borradores', x: 'por revisar a fondo' },
    ] },
    { e: 'pen', d: 'Sin empezar, o detenido por un problema abierto.', items: [
        { t: 'Optimización con RBF-FD: su adjunto aún cambia con la malla', x: <>{M('\\psi_C')}: 25–36 %; elementos finitos: 3–10 %</> },
        { t: 'Comparar los óptimos de las dos discretizaciones' },
    ] },
];

// Próximos pasos por plazo tentativo: [plazo, [[texto de la completa, corto de la pública], ...]].
const PASOS = [
    ['En curso', [
        [<>Terminar las optimizaciones con elementos finitos en los tres modelos ({M('\\chi<10^{-4}')} o parada práctica) y sus pruebas de consistencia</>,
            <>Terminar las optimizaciones con elementos finitos y sus pruebas de consistencia</>],
    ]],
    ['Semestre 4', [
        [<>Frente de Pareto (barrido de {M('\\gamma')}); varios arranques y evaluación cruzada para ver si el óptimo es único</>,
            'Frente de Pareto; varios arranques y evaluación cruzada'],
        ['Entender la dependencia del adjunto RBF-FD con la malla antes de optimizar con RBF-FD',
            'Entender la dependencia del adjunto RBF-FD con la malla'],
    ]],
    ['Semestre 4–5', [
        ['Enriquecer la parte numérica: revisar y ampliar los análisis numéricos (p. ej., convergencia del óptimo con la malla y con el paso de tiempo)',
            'Enriquecer la parte numérica: revisar y ampliar los análisis numéricos'],
        ['Revisar y reescribir a fondo los capítulos; Cap. IV con los resultados convergidos',
            'Reescribir los capítulos; Cap. IV con resultados convergidos'],
    ]],
    ['Semestre 5', [
        ['Artículo de optimización: enviarlo cuando los resultados estén cerrados',
            'Artículo: enviarlo con los resultados cerrados'],
    ]],
];

const FASES = [...GRUPOS.map(g => ({ n: ESTADOS[g.e].l, e: g.e, dur: 1.6 })), { n: 'Próximos pasos', dur: 2.4 }];
const PASOS_F = GRUPOS.length;

// Escalera de los cuatro estados: las marcas y los nombres se ven desde el inicio (tenues); los puntos de cada estado
// entran en su fase. El espacio queda reservado para que nada salte de lugar al avanzar.
function Escalera({ fase, P, pub }) {
    const m = pub ? 26 : 22, sangria = m + 14, sep = pub ? 14 : 12;
    return (
        <div style={{ paddingLeft: sangria }}>
            {GRUPOS.map((g, k) => {
                const p = P(k), es = ESTADOS[g.e], visto = fase >= k;
                return (
                    <div key={g.e} style={{ position: 'relative', marginTop: k ? sep : 0 }}>
                        {/* tramo del riel hasta la marca del estado siguiente */}
                        {k < GRUPOS.length - 1 && (
                            <span style={{ position: 'absolute', left: -sangria + m / 2 - 1, top: m / 2, bottom: -sep, width: 2,
                                           background: 'var(--a3-filete, #C9D3DB)' }} />
                        )}
                        <span style={{ position: 'absolute', left: -sangria, top: 0, width: m, height: m, borderRadius: '50%',
                                       background: 'var(--sl-bg)', opacity: visto ? 1 : 0.3, transition: 'opacity 0.4s' }}>
                            <Marca e={g.e} size={m} />
                        </span>
                        <p style={{ margin: '0 0 3px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', lineHeight: `${m}px`,
                                    fontWeight: 600, color: es.c, opacity: visto ? 1 : 0.3, transition: 'opacity 0.4s' }}>{es.l}</p>
                        {g.items.map((it, i) => {
                            const a = tramo(p, 0.08 + 0.14 * i, 0.4 + 0.14 * i);
                            return (
                                <div key={i} className={it.completa ? 'a3-completa' : undefined}
                                     style={{ display: 'flex', gap: 10, padding: '1px 0', opacity: a, transform: `translateX(${(1 - suave(a)) * 14}px)` }}>
                                    <span style={{ color: es.c, fontSize: 'var(--a3-fs-cuerpo)', lineHeight: 1.3 }}>–</span>
                                    <span style={{ fontSize: 'var(--a3-fs-cuerpo)', lineHeight: 1.3, color: 'var(--sl-text)' }}>
                                        {it.t}{it.x && <span className="a3-completa" style={{ color: 'var(--sl-muted)' }}> · {it.x}</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

// Columna derecha: en las fases de estado, qué significa ese estado; en la última, los próximos pasos. La lista de pasos
// está siempre en el flujo (invisible hasta su fase) para que la altura no cambie entre fases.
function Derecha({ fase, P, pub }) {
    const g = GRUPOS[fase], pp = P(PASOS_F);
    return (
        <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 10px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', color: 'var(--sl-accent)', fontWeight: 600 }}>
                {fase + 1} · {fase < PASOS_F ? `Qué cuenta como «${ESTADOS[g.e].l.toLowerCase()}»` : 'Próximos pasos'}
                {fase === PASOS_F && <span style={{ fontWeight: 400, color: 'var(--sl-muted)' }}> (plazos tentativos)</span>}
            </p>
            {g && (
                <div style={{ position: 'absolute', left: 0, right: 0, top: pub ? 44 : 38, display: 'flex', gap: 14, alignItems: 'flex-start',
                              opacity: tramo(P(fase), 0, 0.3) }}>
                    <Marca e={g.e} size={pub ? 34 : 30} />
                    <p style={{ margin: 0, fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.45 }}>
                        {g.p ? <><span className="a3-completa">{g.d}</span><span className="a3-publica">{g.p}</span></> : g.d}
                    </p>
                </div>
            )}
            <div style={{ visibility: fase === PASOS_F ? 'visible' : 'hidden' }}>
                {PASOS.map(([plazo, lista], j) => {
                    const i0 = PASOS.slice(0, j).reduce((n, x) => n + x[1].length, 0);
                    return (
                        <div key={plazo} style={{ marginTop: j ? 8 : 0, opacity: tramo(pp, 0.04 + 0.1 * i0, 0.2 + 0.1 * i0) }}>
                            <span style={{ display: 'block', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: AGUA, fontWeight: 600,
                                           lineHeight: 1.2, marginBottom: 3 }}>{plazo}</span>
                            {lista.map(([t, tp], i) => {
                                const a = tramo(pp, 0.06 + 0.1 * (i0 + i), 0.3 + 0.1 * (i0 + i));
                                return (
                                    <div key={i} style={{ borderLeft: `3px solid ${AGUA}`, padding: '2px 0 2px 14px', marginBottom: 6, fontSize: 'var(--a3-fs-cuerpo)',
                                                          color: 'var(--sl-text)', lineHeight: 1.3, opacity: a, transform: `translateY(${(1 - suave(a)) * 8}px)` }}>
                                        <span className="a3-completa">{t}</span><span className="a3-publica">{tp}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function A3N22({ theme = 'dark', entrada = 1 }) {
    const { fase, l, ir } = useFases(FASES.map(x => x.dur), entrada < 0);
    const P = k => (fase > k ? 1 : fase < k ? 0 : l / FASES[k].dur);
    const saltar = k => ir(k, reducida());
    const pub = usePublica();
    return (
        <SlideLayout title="Estado actual y próximos pasos" theme={theme} justify="flex-start">
            <div onClick={() => saltar(fase + 1 < FASES.length ? fase + 1 : 0)} title="clic: siguiente fase"
                 style={{ display: 'grid', gridTemplateColumns: pub ? '1.45fr 1fr' : '1.35fr 1fr', gap: 40, alignItems: 'start', cursor: 'pointer' }}>
                <Escalera fase={fase} P={P} pub={pub} />
                <Derecha fase={fase} P={P} pub={pub} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FASES.length}, 1fr)`, gap: 10, marginTop: 10 }}>
                {FASES.map((x, k) => (
                    <button key={x.n} onClick={() => saltar(k)} title={`ir a: ${x.n}`}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--a3-sans)', fontSize: pub ? 17 : 14, lineHeight: 1.2,
                                     color: k === fase ? 'var(--sl-accent)' : 'var(--sl-muted)', fontWeight: k === fase ? 600 : 400 }}>
                        <span style={{ display: 'block', height: 3, background: 'var(--a3-filete, #C9D3DB)', marginBottom: 5 }}>
                            <span style={{ display: 'block', height: 3, width: `${k < fase ? 100 : k > fase ? 0 : 100 * l / x.dur}%`, background: 'var(--sl-accent)' }} />
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            {x.e && <Marca e={x.e} size={pub ? 14 : 12} />}{k + 1} {x.n}
                        </span>
                    </button>
                ))}
            </div>
            <Notas titulo="Estado actual: detalle y cifras">
                <p>
                    Cuatro estados: completo = implementado y verificado; preliminar = hay resultados, pero sin convergencia completa
                    (<InlineMath math="\chi>10^{-4}" />); en desarrollo = en marcha, sin resultados definitivos; pendiente = sin empezar o
                    detenido por un problema abierto. Estado al 24 de noviembre de 2026.
                </p>
                <h4>Completo</h4>
                <ul>
                    <li>Modelo sin sumidero explícito, con almacenamiento y salida libre; seis implementaciones: ADR, MRMT semi y MRMT bloque,
                        cada una con RBF-FD y con elementos finitos (FEniCSx).</li>
                    <li>Problema directo sobre la misma malla: las dos discretizaciones difieren 3 % en <InlineMath math="C" /> y 12.5 %
                        en <InlineMath math="|\mathbf u|" />.</li>
                    <li>Test de Taylor 6/6 (octubre de 2026): el gradiente adjunto coincide con diferencias finitas en las seis variantes, en
                        horizonte corto. No prueba que el adjunto RBF-FD converja con la malla.</li>
                    <li>Con <InlineMath math="h\approx4.9" /> m en el eje del pozo, <InlineMath math="\hat J(z_p)" /> ondulaba con mínimos espurios
                        cada <InlineMath math="h" />; con 1 m alrededor del eje desaparecen.</li>
                </ul>
                <h4>Preliminar (por actualizar con la serie definitiva)</h4>
                <ul>
                    <li>Mejores iterados del 23 de noviembre (<InlineMath math="\gamma=1" />, arranque <InlineMath math="z_p=-700" /> m):
                        ADR −383 m (<InlineMath math="\chi\approx5.3\cdot10^{-3}" />), MRMT semi −405 m (<InlineMath math="2.7\cdot10^{-3}" />),
                        MRMT bloque −394 m (<InlineMath math="5.5\cdot10^{-3}" />). Bloque paró antes: en la evaluación cruzada el punto de semi
                        da menor <InlineMath math="\hat J" /> en los tres modelos.</li>
                    <li>Esas corridas tomaban la demanda y la cota de la bomba a mitad de cada paso; se corrigió el 24 de noviembre (promedio
                        por paso) y se relanzó todo desde el inicio, así que las cifras cambiarán.</li>
                    <li>MRMT ≈ ADR retardado (<InlineMath math="1+\sum\beta=1.3" />, intercambio de horas frente a 30 días): con estos
                        parámetros <InlineMath math="J_m" /> de MRMT semi es 5–6 % mayor a toda profundidad, y su pozo óptimo queda más hondo.</li>
                </ul>
                <h4>En desarrollo</h4>
                <ul>
                    <li>Serie 33 (24-nov): los tres modelos con elementos finitos desde <InlineMath math="z_p^0=-600" /> m; parada en
                        <InlineMath math="\;\chi<10^{-4}" /> o tras 50 iteraciones con <InlineMath math="\chi\le3\cdot10^{-3}" /> (parada práctica,
                        sin certificar KKT). Termina hacia el 26–27 de noviembre. Después: arranque en <InlineMath math="z_p^0=-200" /> m,
                        reinicio desde el iterado 25 y arranques cruzados entre modelos. Si la parada es la práctica, los resultados siguen
                        siendo preliminares.</li>
                    <li>Pareto: solo un barrido de <InlineMath math="z_p" /> (−1300 a −220 m) con el caudal fijo de un iterado de ADR; no es aún
                        el frente (falta reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />) y hay
                        que rehacerlo con el óptimo nuevo.</li>
                    <li>Artículo: borrador de 26 páginas, sin resultados definitivos ni revista. Tesis: primer borrador de los cuatro capítulos y
                        los anexos; el Cap. IV tiene resultados anteriores.</li>
                </ul>
                <h4>Pendiente</h4>
                <ul>
                    <li>El adjunto RBF-FD no converge al refinar la malla (<InlineMath math="\psi_C" /> cambia 25–36 %; con elementos finitos,
                        3–10 %). Las corridas de prueba con RBF-FD no son válidas; sin resolver esto no hay óptimos que comparar.</li>
                </ul>
                <h4>Próximos pasos</h4>
                <ul>
                    <li>Varios arranques y evaluación cruzada: ver si los modelos llegan al mismo óptimo y qué punto da el menor
                        <InlineMath math="\;\hat J" /> en cada modelo.</li>
                    <li>Parte numérica: el error temporal solo se midió en ADR y en el problema directo; falta en MRMT y en el óptimo, igual
                        que la convergencia del óptimo con la malla.</li>
                </ul>
            </Notas>
        </SlideLayout>
    );
}
