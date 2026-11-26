import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { useFases, reducida, suave, tramo } from './anim.js';
import { usePublica, Notas } from './version.jsx';
import { ESTADOS, Marca } from './estado.jsx';
import { OPT } from './optimoNitrato.js';

// Estado actual de la investigación y próximos pasos, en cinco fases que avanza el expositor (flechas o control remoto;
// clic en la lámina = siguiente fase; clic en una etiqueta de abajo = ir a esa fase): los cuatro estados se llenan uno a
// uno, de lo completo a lo pendiente, y al final aparecen los próximos pasos con plazos tentativos. Las cifras de los
// resultados salen de optimoNitrato.js: serie 33 en su iterado de corte (tope de 50 iteraciones, 25-nov), sin certificado KKT;
// las pruebas de consistencia (OPT.consistencia) siguen en curso.
const AGUA = 'var(--a3-agua)';
const M = (t) => <InlineMath math={t} />;

// Resultados de la serie 33 (iterado de corte) y prueba desde z_p⁰ = −200 m de ADR, para los textos
const MOD = Object.fromEntries((OPT.modelos || []).map(m => [m.id, m]));
const fz = z => String(Math.round(z)).replace('-', '−');
const NIT = (OPT.serie && OPT.serie.nit) || 50;
const Z200 = (OPT.consistencia || []).find(c => c.modelo === 'adr' && c.prueba === 'zp200');
const MAS_HONDO = MOD.adr && MOD.mrmt_semi && MOD.mrmt_block
    ? [MOD.mrmt_block, MOD.mrmt_semi].map(m => Math.round(MOD.adr.zp - m.zp)).sort((a, b) => a - b) : null;

// Por estado: d = qué significa (p: el corto de la pública, si hace falta); items: t = texto de las dos versiones,
// x = precisión que solo va en la completa, completa = el punto entero solo va en la completa.
const GRUPOS = [
    { e: 'com', d: 'Implementado y verificado; las corridas nuevas no lo modifican.', items: [
        { t: 'Modelo ADR y MRMT en seis implementaciones' },
        { t: <>Problema directo: RBF-FD y elementos finitos difieren 3 % en {M('C')} y 12.6 % en {M('|\\mathbf u|')} (peor instante)</> },
        { t: 'Gradiente adjunto verificado en horizonte corto' },
        { t: <>Eje del pozo a 1 m: sin mínimos espurios en {M('\\hat J(z_p)')}</>, completa: true },
    ] },
    { e: 'pre', d: <>Hay resultados, pero sin convergencia completa ({M('\\chi>10^{-4}')}): las cifras pueden cambiar con las corridas definitivas.</>,
      p: 'Hay resultados, aún no definitivos: las cifras pueden cambiar.', items: [
        { t: <>Optimización con elementos finitos (iterado {NIT}): pozo a {fz(MOD.adr.zp)} m (ADR), {fz(MOD.mrmt_semi.zp)} m (MRMT semi) y{' '}
              {fz(MOD.mrmt_block.zp)} m (bloque)</>, x: <>{M('\\chi\\sim10^{-3}')}–{M('10^{-2}')}, sin certificado KKT</> },
        { t: <>MRMT ≈ ADR retardado: pozo {MAS_HONDO[0]}–{MAS_HONDO[1]} m más hondo</>, x: 'con estos parámetros' },
    ] },
    { e: 'des', d: 'Trabajo en marcha, todavía sin resultados definitivos.', items: [
        { t: 'Pruebas de consistencia de la optimización', x: Z200 ? <>desde {M('z_p^0=-200')} m, ADR va en {fz(Z200.zp)} m, no en {fz(MOD.adr.zp)}</> : 'arranques distintos y cruce de óptimos' },
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
                    <li>Problema directo sobre la misma malla: las dos discretizaciones difieren 3 % en <InlineMath math="C" /> y 12.6 %
                        en <InlineMath math="|\mathbf u|" /> (L² relativa con pesos de área, máximo en los 30 días; lámina 9).</li>
                    <li>Test de Taylor 6/6 (octubre de 2026): el gradiente adjunto coincide con diferencias finitas en las seis variantes, en
                        horizonte corto. No prueba que el adjunto RBF-FD converja con la malla.</li>
                    <li>Con <InlineMath math="h\approx4.9" /> m en el eje del pozo, <InlineMath math="\hat J(z_p)" /> ondulaba con mínimos espurios
                        cada <InlineMath math="h" />; con 1 m alrededor del eje desaparecen.</li>
                </ul>
                <h4>Preliminar</h4>
                <ul>
                    <li>Serie 33 (<InlineMath math="\gamma=1" />, arranque <InlineMath math="z_p^0=-600" /> m, demanda promediada por paso), detenida
                        en la iteración {NIT}: ADR {fz(MOD.adr.zp)} m, MRMT semi {fz(MOD.mrmt_semi.zp)} m, MRMT bloque {fz(MOD.mrmt_block.zp)} m;{' '}
                        <InlineMath math="\hat J" /> = {MOD.adr.J.J.toFixed(4)}, {MOD.mrmt_semi.J.J.toFixed(4)} y {MOD.mrmt_block.J.J.toFixed(4)}.
                        Ninguna llegó a <InlineMath math="\chi<10^{-4}" />.</li>
                    <li>La serie anterior (demanda tomada a mitad de cada paso, arranque en −700 m) daba −383, −405 y −394 m. En la serie 33
                        los tres pozos quedan entre 9 y 21 m más hondos y se mantiene el orden: ADR el más somero, MRMT semi el más hondo. Las
                        dos series difieren en la demanda, el arranque y las iteraciones, así que el cambio no se atribuye a una sola causa.</li>
                    <li>MRMT ≈ ADR retardado (<InlineMath math="1+\sum\beta=1.3" />, intercambio de horas frente a 30 días): con estos
                        parámetros <InlineMath math="J_m" /> de MRMT semi es 5–6 % mayor a toda profundidad, y su pozo óptimo queda más hondo.</li>
                </ul>
                <h4>En desarrollo</h4>
                <ul>
                    <li>Pruebas de consistencia de la serie 33, con el mismo tope de 50 iteraciones: arranque en <InlineMath math="z_p^0=-200" /> m
                        {Z200 ? <> (ADR, iteración {Z200.nit}: {fz(Z200.zp)} m con <InlineMath math={`\\hat J=${Z200.J.toFixed(4)}`} />, frente a{' '}
                        {fz(MOD.adr.zp)} m y {MOD.adr.J.J.toFixed(4)} desde −600 m: todavía no llega al mismo punto)</> : null}, reinicio desde el
                        iterado 25 y arranques cruzados entre modelos.</li>
                    <li>Pareto: solo un barrido de <InlineMath math="z_p" /> (−1300 a −220 m) con el caudal fijo de un iterado de ADR
                        {OPT.pareto && OPT.pareto.serie === '33' ? ` (serie 33, iterado ${OPT.pareto.nit})` : ' (serie anterior)'}; no es aún el frente
                        (falta reoptimizar <InlineMath math="Q" /> y <InlineMath math="z_p" /> para cada <InlineMath math="\gamma" />).</li>
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
