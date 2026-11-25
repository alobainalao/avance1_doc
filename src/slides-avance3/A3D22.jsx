import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Cita } from './ui.jsx';
import { usePublica, Notas } from './version.jsx';
import { ESTADOS, Marca } from './estado.jsx';

// Configuración de las tres familias de corridas que aparecen en el avance: comparación directa (experimentos/catalogo.py,
// grupo MC_malla_conos con experimentos/base.json), verificación del gradiente (tests/test_gradiente_modelo_nuevo.py) y
// optimización. Optimización = serie 33 (24-nov-2026: experimentos/optimizar_nitrato.py con
// config/nitrato_vscale_malla_eje_g1_prom.json, cola data/output/_logs_malla_conos/cola_33.py). Las láminas de resultados
// que siguen muestran todavía la serie anterior (nitrato_vscale_malla_eje_g1): hay que reexportarlas al terminar la 33.
const M = (t) => <InlineMath math={t} />;
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)';
const COLS = ['Comparación directa', 'Verificación del gradiente', 'Optimización (serie 33)'];
const filas = [
    ['Discretización', 'RBF-FD y elementos finitos', 'RBF-FD y elementos finitos', 'solo elementos finitos'],
    ['Malla', 'con conos, 20 348 nodos (común)', 'de prueba: 30 m (RBF-FD), 120 m (EF)', 'con eje de 1 m, 25 871 nodos'],
    ['Tiempo', <>{M('\\Delta t=5')} h, 30 días</>, <>{M('\\Delta t=10')} h, 3 pasos</>, <>{M('\\Delta t=10')} h, 72 pasos (30 días)</>],
    ['Modelos', 'ADR, MRMT semi y bloque (3 regiones)', 'ADR, MRMT semi y bloque (2 regiones)', 'ADR, MRMT semi y bloque (3 regiones)'],
    ['Controles', <>caudal de referencia 0.3 m²/s, {M('z_p=-700')} m</>, <>{M('Q')} y {M('z_p')}<span className="a3-completa"> de la config; {M('C')} inicial ≡ 1</span></>,
        <>72 caudales {M('Q_n')} + {M('z_p')}</>],
    ['Funcional', '—', 'sin normalizar', <>normalizado, {M('\\gamma=\\alpha=\\beta=1')}</>],
    ['Concentración', 'unidades del modelo', 'unidades del modelo', <>nitrato [mg/L]; pico sin bombeo 186; {M('C_{\\rm ref}')} = 50 (OMS)</>],
];
// filas que la versión pública omite
const SOLO_COMPLETA = ['Modelos', 'Funcional', 'Concentración'];

// Serie 33: lo que cambia respecto de la serie anterior (completa: con el «antes»; pública: solo lo nuevo)
const serie33 = [
    ['Arranque', <>{M('Q_n=0.1')} proyectado a {M('\\mathcal U_{ad}')}, {M('z_p^0=-600')} m<span className="a3-completa"> (antes {M('-700')} m, no admisible)</span></>],
    ['Demanda', <><span className="a3-completa">volumen de cada paso = promedio exacto del perfil horario: 166–590 m³ (antes, el valor a mitad del paso: 58–765 m³)</span>
        <span className="a3-publica">promedio exacto en cada paso: 166–590 m³</span></>],
    ['Iterados', <>todos admisibles<span className="a3-completa">: trust-constr <Cita k="virtanen2020scipy" /> (barrera, BFGS) exige las restricciones en cada paso</span></>],
    ['Paro', <>{M('\\chi<10^{-4}')} (KKT) o {M('\\chi\\le 3\\cdot10^{-3}')} tras ≥ 50 it.<span className="a3-completa"> (parada práctica, sin certificado KKT); máximo 100</span></>],
];

// estado de cada serie con el vocabulario común (estado.jsx): preliminar, en desarrollo, pendiente
const estado = [
    { e: 'pre', t: 'Serie anterior',
      d: <><span className="a3-completa">{M('z_p^0=-700')} m, demanda a mitad de paso, {M('\\chi')} entre 2.7 y 5.5·10⁻³: </span>es la que muestran las láminas siguientes; no es definitiva.</> },
    { e: 'des', t: 'Serie 33', d: <>ADR, MRMT semi, MRMT bloque y validación sin nitrato<span className="a3-completa">, desde el 24-nov</span>.</> },
    { e: 'pen', t: 'Consistencia',
      d: <>arranque en {M('z_p^0=-200')} m; reinicio desde el iterado 25; cada modelo desde el óptimo del otro<span className="a3-completa"> (ADR ↔ semi)</span>.</> },
];

export default function A3D22({ theme = 'dark' }) {
    const pub = usePublica();
    const tdv = pub ? { ...td, fontSize: 23 } : td;
    const opt = { background: 'color-mix(in srgb, var(--a3-agua) 9%, transparent)' };
    return (
        <SlideLayout title="Configuración de las corridas" theme={theme} justify="flex-start">
            <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '2px solid var(--sl-text)', borderBottom: '2px solid var(--sl-text)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--sl-muted)' }}>
                        <th style={th}></th>
                        {COLS.map((c, k) => <th key={c} style={{ ...th, color: 'var(--sl-accent)', ...(k === 2 ? opt : null) }}>{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filas.map(([n, ...v], i) => (
                        <tr key={n} className={SOLO_COMPLETA.includes(n) ? 'a3-completa' : undefined} style={{ borderTop: i ? '1px solid var(--a3-filete)' : 'none' }}>
                            <td style={{ ...td, color: 'var(--sl-muted)', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', whiteSpace: 'nowrap' }}>{n}</td>
                            {v.map((x, k) => <td key={k} style={k === 2 ? { ...tdv, ...opt } : tdv}>{x}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 30, marginTop: 16, alignItems: 'start' }}>
                <div style={{ borderTop: `3px solid ${AGUA}`, paddingTop: 8 }}>
                    <p style={cab}>Optimización: qué cambia en la serie 33</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 6 }}>
                        {serie33.map(([n, x]) => (
                            <React.Fragment key={n}>
                                <span style={{ ...etq, paddingTop: 3 }}>{n}</span>
                                <span style={txt}>{x}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div style={{ borderTop: `3px solid ${PLUMA}`, paddingTop: 8 }}>
                    <p style={cab}>Estado de los resultados</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {estado.map(e => (
                            <div key={e.t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <Marca e={e.e} size={pub ? 20 : 17} style={{ marginTop: pub ? 6 : 5 }} />
                                <p style={{ ...txt, margin: 0 }}>
                                    <b style={{ fontWeight: 600 }}>{e.t}</b>{' '}
                                    <span style={{ fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: ESTADOS[e.e].c }}>({ESTADOS[e.e].l.toLowerCase()})</span>: {e.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Notas titulo="Configuración: qué cambió y por qué">
                <h4>Por qué se relanzó todo (serie 33)</h4>
                <p>La demanda y la disponibilidad de la bomba se tomaban del perfil horario a la mitad de cada paso de 10 h. Como 10 h no
                    divide 24 h, eso produce un patrón falso (aliasing) que se repite cada 5 días: volúmenes por paso de 58 a 765 m³ en
                    lugar de los reales, 166 a 590 m³, y disponibilidad de la bomba de 0.3 donde el promedio es 0.55. Ahora se usa el
                    promedio exacto del perfil sobre cada paso.</p>
                <p>Las cadenas reanudadas mezclaban etapas con la demanda vieja y la nueva y esfuerzos distintos por modelo, así que la
                    serie 33 arranca todo desde cero con la misma regla: mismo punto inicial, mismos iterados admisibles, misma parada.</p>
                <h4>Arranque</h4>
                <p>{M('Q_n=0.1')} con {M('z_p=-600')} m vacía el tanque: no es admisible. Se proyecta al conjunto admisible (ligeramente
                    contraído, para empezar en su interior); el cambio máximo en el caudal es ≈ 0.05.</p>
                <h4>Parada</h4>
                <p>{M('\\chi<10^{-4}')} es la condición de primer orden (KKT) con tolerancia. La parada práctica ({M('\\chi\\le3\\cdot10^{-3}')} tras al
                    menos 50 iteraciones) sale de la validación sin nitrato: con {M('\\chi\\approx2.7\\cdot10^{-3}')} el optimizador ya tenía el
                    {M('z_p')} exacto y {M('\\hat J')} a 0.8 % del valor exacto. Un resultado detenido así es un mejor iterado, no un punto
                    KKT certificado.</p>
                <h4>Experimentos de consistencia</h4>
                <ul>
                    <li>{M('z_p^0=-200')} m (desde arriba): ¿llega al mismo {M('z_p')} que desde {M('-600')} m?</li>
                    <li>Reinicio desde el iterado 25 de la corrida principal: ¿repite el tramo restante de la trayectoria?</li>
                    <li>Cada modelo desde el óptimo del otro (ADR ↔ MRMT semi): si vuelve al suyo, la diferencia entre modelos es real y no del
                        punto de arranque.</li>
                </ul>
                <h4>Qué no cambia</h4>
                <p>Malla (eje de 1 m), {M('\\Delta t')}, parámetros físicos, escala del nitrato (la misma fuente que la serie anterior) y pesos{' '}
                    {M('\\gamma=\\alpha=\\beta=1')}. Las tres familias usan el mismo dominio, la misma porosidad y la salida libre; el modelo es
                    lineal en {M('C')}, así que la fuente se escala para expresar {M('C')} como nitrato (igual en los tres modelos).</p>
            </Notas>
        </SlideLayout>
    );
}

const th = { padding: '6px 10px', textAlign: 'left', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', fontWeight: 600 };
const td = { padding: '6px 10px', fontSize: 19, color: 'var(--sl-text)', lineHeight: 1.3, verticalAlign: 'top' };
const cab = { margin: '0 0 8px', fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-etiqueta)', fontWeight: 600, color: 'var(--sl-text)' };
const etq = { fontFamily: 'var(--a3-sans)', fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)', whiteSpace: 'nowrap' };
const txt = { fontSize: 'var(--a3-fs-cuerpo)', color: 'var(--sl-text)', lineHeight: 1.35 };
