import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Tabla, Punto, Col, Titulo } from './ui.jsx';
import { POLIGONO, X, Z } from './escena.jsx';
import { ESQ } from './esquema.js';
import { usePublica, Notas } from './version.jsx';

// Condiciones de frontera (tesis ChaptersR/CapI_ADR.tex, §Condiciones de frontera e iniciales) con un esquema del dominio
// como el de la maestría (Figures/boundary.png: entrada, salida y paredes por color), redibujado con la geometría y las
// condiciones del modelo actual. Escala real, en las coordenadas de la escena (escena.jsx): un color por parte de ∂Ω.
const AGUA = 'var(--a3-agua)', PLUMA = 'var(--a3-pluma)', PARED = 'var(--a3-estrato)', TINTA = 'var(--sl-text)';
const SANS = 'var(--a3-sans)';
const M = (t) => <InlineMath math={t} />;

// ── Geometría (CapI_ADR.tex): Γin = {10 755} × (−768.5, 250.5), Γout = {816} × (−2 690.5, 250.5), Γwall = superficie y fondo ──
const IN = { x: X(10755), z0: Z(250.5), z1: Z(-768.5) };
const OUT = { x: X(816), z0: Z(250.5), z1: Z(-2690.5) };
const SUP = [[X(816), Z(250.5)], [X(10755), Z(250.5)]];
const FONDO = [[816, -2690.5], [4354, -1757.5], [10755, -768.5]].map(([x, z]) => [X(x), Z(z)]);

// Perfil de entrada f_in(z)/A (funtions/utils.py, In_h; config/geometry.py: z_0 = 250, z_t = z_0 − 100, z_min = −760):
// coseno cuadrado por tramos, nulo en la cota superior, máximo 100 m más abajo, nulo bajo −760 m. A = 2·10⁻⁴ m/s.
const fIn = (z) => (z > 250 || z <= -760 ? 0
    : z > 150 ? Math.cos((z - 150) * Math.PI / 200) ** 2
    : Math.cos((z - 150) * Math.PI / 1820) ** 2);
const LP = 80;                                              // largo en la escena del máximo del perfil
const PERFIL = (() => {
    let d = `M${IN.x},${IN.z0}`;
    for (let z = 250.5; z >= -768.5; z -= 5) d += ` L${(IN.x + LP * fIn(z)).toFixed(1)},${Z(z).toFixed(1)}`;
    return `${d} L${IN.x},${IN.z1} Z`;
})();
const FLECHAS_IN = [150, 0, -150, -300, -450].map(z => ({ y: Z(z), l: LP * fIn(z) }));

// Punta de flecha con el vértice en (x, y) y dirección (dx, dy).
const punta = (x, y, dx, dy, s = 9) => {
    const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, bx = x - s * ux, by = y - s * uy;
    return [[x, y], [bx - 0.55 * s * uy, by + 0.55 * s * ux], [bx + 0.55 * s * uy, by - 0.55 * s * ux]]
        .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
};

// Rayado de pared impermeable: trazos cortos inclinados del lado exterior del segmento a→b (sg = ±1 elige el lado).
function rayado(a, b, sg, paso = 16, largo = 10) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const n = [-sg * d[1], sg * d[0]];
    let s = '';
    for (let t = paso / 2; t < L; t += paso) {
        const x = a[0] + d[0] * t, y = a[1] + d[1] * t;
        s += `M${x.toFixed(1)},${y.toFixed(1)}l${(largo * (n[0] - 0.6 * d[0])).toFixed(1)},${(largo * (n[1] - 0.6 * d[1])).toFixed(1)}`;
    }
    return s;
}
const RAYADO = rayado(...SUP, -1) + rayado(FONDO[0], FONDO[1], 1) + rayado(FONDO[1], FONDO[2], 1);

// Líneas de corriente sin bombeo (esquema.js, las mismas de la apertura): velocidad de Darcy simulada, de Γin a Γout.
// Solo indican la dirección del flujo: puntas en x' = 640 y 280 en una de cada dos y, en Γout, prolongación de su
// última dirección hacia fuera (el perfil de salida no se prescribe: lo da la solución).
const LINEAS = ESQ.corrientes.sin;
const ruta = c => 'M' + c.p.reduce((acc, v, i) => acc + (i % 2 ? `,${v}` : `${i ? ' L' : ''}${v}`), '');
function enX(c, xa) {
    const n = c.p.length / 2;
    let k = 0;
    while (k < n - 1 && c.p[2 * k] > xa) k++;
    const a = Math.max(0, k - 2), b = Math.min(n - 1, k + 2);
    return punta(c.p[2 * k], c.p[2 * k + 1], c.p[2 * b] - c.p[2 * a], c.p[2 * b + 1] - c.p[2 * a + 1], 10);
}
const PUNTAS = LINEAS.flatMap((c, i) => (i % 2 ? [] : [enX(c, 640), enX(c, 280)]));
const SALIDAS = [0, 1, 2, 4, 6, 8].map(i => {
    const p = LINEAS[i].p, n = p.length / 2, x = p[2 * n - 2], y = p[2 * n - 1];
    const m = (y - p[2 * n - 11]) / (x - p[2 * n - 12]), x1 = OUT.x - 30;
    return { x, y, x1, y1: y + m * (x1 - x), m };
});

// Γ con subíndice dentro de un <text>; `resto` sigue en la línea base (espacio inicial duro: no se colapsa tras el tspan).
const Gt = ({ s, resto, fs }) => (
    <>Γ<tspan dy="5" fontSize={Math.round(fs * 0.68)}>{s}</tspan><tspan dy="-5">{resto.replace(/^ /, '\u00A0')}</tspan></>
);

function Esquema() {
    const pub = usePublica();
    const fs = pub ? 21 : 17, fs2 = 15;                      // etiqueta y renglón secundario (solo en la completa)
    const etq = (color, peso = 600) => ({ fontFamily: SANS, fontSize: fs, fontWeight: peso, fill: color });
    const sec = { fontFamily: SANS, fontSize: fs2, fill: 'var(--sl-muted)' };
    // fondo: etiqueta paralela al segundo tramo, por fuera
    const [a, b] = [FONDO[1], FONDO[2]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
    const fx = a[0] + 0.4 * (b[0] - a[0]) - 34 * uy, fy = a[1] + 0.4 * (b[1] - a[1]) + 34 * ux;
    return (
        <svg viewBox="-44 -44 1140 352" style={{ width: '100%', display: 'block' }}>
            <polygon points={POLIGONO} fill={AGUA} fillOpacity="0.07" stroke={TINTA} strokeWidth="1.2" />
            <text x={118} y={242} style={{ fontFamily: 'var(--a3-serif)', fontStyle: 'italic', fontSize: 46, fill: TINTA, opacity: 0.3 }}>Ω</text>
            {/* dirección del flujo: líneas de corriente simuladas */}
            <g>
                {LINEAS.map((c, i) => <path key={i} d={ruta(c)} fill="none" stroke={TINTA} strokeOpacity="0.32" strokeWidth="1.4" />)}
                {PUNTAS.map((p, i) => <polygon key={i} points={p} fill={TINTA} fillOpacity="0.75" />)}
            </g>
            {/* Γwall: superficie y fondo, impermeables (rayado por fuera) */}
            <path d={RAYADO} fill="none" stroke={PARED} strokeWidth="1.6" />
            <polyline points={SUP.map(q => q.join(',')).join(' ')} fill="none" stroke={PARED} strokeWidth="5" />
            <polyline points={FONDO.map(q => q.join(',')).join(' ')} fill="none" stroke={PARED} strokeWidth="5" strokeLinejoin="round" />
            {/* Γin: flujo prescrito con el perfil f_in(z) */}
            <path d={PERFIL} fill={AGUA} fillOpacity="0.16" stroke={AGUA} strokeWidth="1.6" />
            {FLECHAS_IN.map(({ y, l }, i) => (
                <g key={i}>
                    <line x1={IN.x + l} y1={y} x2={IN.x + 12} y2={y} stroke={AGUA} strokeWidth="2.4" />
                    <polygon points={punta(IN.x + 4, y, -1, 0, 11)} fill={AGUA} />
                </g>
            ))}
            <line x1={IN.x} y1={IN.z0} x2={IN.x} y2={IN.z1} stroke={AGUA} strokeWidth="6" />
            {/* Γout: salida libre; el agua sale con el perfil que da la solución */}
            <line x1={OUT.x} y1={OUT.z0} x2={OUT.x} y2={OUT.z1} stroke={PLUMA} strokeWidth="6" />
            {SALIDAS.map(({ x, y, x1, y1, m }, i) => (
                <g key={i}>
                    <line x1={x} y1={y} x2={x1 + 6} y2={y1 + 6 * m} stroke={PLUMA} strokeWidth="2.4" />
                    <polygon points={punta(x1, y1, -1, -m, 11)} fill={PLUMA} />
                </g>
            ))}
            {/* flecha grande y etiqueta de la dirección del flujo */}
            <line x1={760} y1={98} x2={572} y2={98} stroke={TINTA} strokeWidth="3.5" />
            <polygon points={punta(558, 98, -1, 0, 18)} fill={TINTA} />
            <text x={660} y={126} textAnchor="middle" style={etq(TINTA)}>dirección del flujo</text>
            {/* etiquetas de las fronteras */}
            <text x={500} y={-19} textAnchor="middle" style={etq(PARED)}><Gt s="wall" fs={fs} resto=" · superficie: sin flujo" /></text>
            <text x={fx} y={fy} textAnchor="middle" transform={`rotate(${ang.toFixed(2)} ${fx.toFixed(1)} ${fy.toFixed(1)})`}
                  style={etq(PARED)}><Gt s="wall" fs={fs} resto=" · fondo: sin flujo" /></text>
            <text x={1090} y={144} textAnchor="end" style={etq(AGUA)}><Gt s="in" fs={fs} resto=" · entrada" /></text>
            <text x={1090} y={pub ? 170 : 164} textAnchor="end" style={pub ? etq(AGUA, 400) : sec}>
                {pub ? <>flujo prescrito f<tspan dy="5" fontSize="14">in</tspan><tspan dy="-5">(z)</tspan></>
                     : <>flujo prescrito (K∇h)·n = f<tspan dy="4" fontSize="11">in</tspan><tspan dy="-4">(z) ≥ 0</tspan></>}
            </text>
            <text className="a3-completa" x={1090} y={184} textAnchor="end" style={sec}>x = 10 755 m · máx. 2×10⁻⁴ m/s</text>
            <text x={16} y={164} style={etq(PLUMA)}><Gt s="out" fs={fs} resto=" · salida libre" /></text>
            <text className="a3-completa" x={16} y={184} style={sec}>∂ₙ(u·n) = 0: perfil de salida no prescrito</text>
            <text className="a3-completa" x={16} y={204} style={sec}>x = 816 m</text>
            {/* orientación (lámina 4: sondeos de SO a NE) */}
            <text x={OUT.x} y={-19} style={{ ...sec, fontSize: pub ? 18 : 15 }}>SO</text>
            <text x={IN.x} y={-19} textAnchor="end" style={{ ...sec, fontSize: pub ? 18 : 15 }}>NE</text>
        </svg>
    );
}

// Γ de la tabla con el color de su trazo en el esquema.
const Lado = ({ g, t, c }) => (
    <span style={{ color: c }}>
        <span style={{ whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-block', width: 22, height: 6, background: c, marginRight: 10, verticalAlign: 'middle' }} />
            {M(g)}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 'var(--a3-fs-etiqueta)', marginLeft: 10 }}>{t}</span>
    </span>
);

const cols = [
    { k: 'g', label: '' }, { k: 'flujo', label: 'Flujo h' }, { k: 'tr', label: 'Transporte C' },
];
const rows = [
    { g: <Lado g={String.raw`\Gamma_{\rm in}`} t="entrada" c={AGUA} />, flujo: M(String.raw`(K\nabla h)\cdot\mathbf n=f_{\rm in}\ge0\quad(\mathbf u\cdot\mathbf n=-f_{\rm in})`), tr: M(String.raw`(D\nabla C)\cdot\mathbf n=0`) },
    { g: <Lado g={String.raw`\Gamma_{\rm wall}`} t="superficie y fondo" c={PARED} />, flujo: M(String.raw`(K\nabla h)\cdot\mathbf n=0`), tr: M(String.raw`(D\nabla C)\cdot\mathbf n=0`) },
    { g: <Lado g={String.raw`\Gamma_{\rm out}`} t="salida" c={PLUMA} />, flujo: <>salida libre: {M(String.raw`\partial_n(\mathbf u\cdot\mathbf n)=0`)}</>, tr: M(String.raw`(D\nabla C)\cdot\mathbf n=0`) },
];

export default function A3N09({ theme = 'dark' }) {
    return (
        <SlideLayout title="Condiciones de frontera" theme={theme} justify="flex-start">
            <Esquema />
            <p className="a3-completa" style={{ margin: '-4px 0 6px', fontFamily: SANS, fontSize: 'var(--a3-fs-nota)', color: 'var(--sl-muted)' }}>
                Escala real, sin exageración vertical. Flechas en Γin: perfil prescrito f<sub>in</sub>(z); líneas grises: corrientes
                de la velocidad de Darcy simulada sin bombeo.
            </p>
            <div style={{ height: 10 }} />
            <Tabla cols={cols} rows={rows} size={22} />
            {false && ( /* hipótesis y decisiones: ocultas por ahora */
            <Col gap={10}>
                    <Titulo>Hipótesis del análisis</Titulo>
                    <Punto size={19}>H1–H2: dominio lipschitziano; <InlineMath math="K" /> simétrica definida positiva <b>variable</b>; coeficientes constantes en <InlineMath math="t" />.</Punto>
                    <Punto size={19}>H3: <InlineMath math="D=\mathrm{diag}(D_x(\mathbf u),D_z(\mathbf u))" />, de clase <InlineMath math="C^1" /> en <InlineMath math="\mathbf u\neq0" />.</Punto>
                    <Punto size={19}>H4–H5: regla del producto casi en todo punto; <InlineMath math="\partial_t h\in L^\infty" /> (Gårding con reacción de signo indefinido).</Punto>
                    <Punto size={19}>H6–H7: datos independientes de los controles, <InlineMath math="z_p<z_0" />, núcleos lejos de Γout; <InlineMath math="\mathbf b\in L^2" /> para la forma fuerte del adjunto.</Punto>

                    <div style={{ height: 6 }} />
                    <Titulo>Decisiones y límites del modelo</Titulo>
                    <Punto color="var(--a3-pluma)" size={19}>En Γin entra agua que arrastra la concentración local; no se prescribe <InlineMath math="C_{\rm in}" /> (decisión pendiente).</Punto>
                    <Punto color="var(--a3-pluma)" size={19}><InlineMath math="\phi" /> constante con almacenamiento elástico y <InlineMath math="S_s=\phi" /> numérico (0.03–0.95 m⁻¹): pendiente confirmar.</Punto>
                    <Punto color="var(--a3-valido)" size={19}>Balance global de soluto: el soluto solo cruza <InlineMath math="\partial\Omega" /> por advección y sale por <InlineMath math="fC" />.</Punto>
            </Col>
            )}
            <Notas titulo="Condiciones de frontera del modelo">
                <p>
                    Tesis, Cap. I, «Condiciones de frontera e iniciales». El esquema retoma la figura de condiciones de frontera
                    de la maestría (Cap. 2: entrada, salida y paredes por color) con la geometría y las condiciones del modelo actual.
                </p>
                <h4>Partición de la frontera</h4>
                <p>
                    {M(String.raw`\partial\Omega=\overline{\Gamma_{\rm in}}\cup\overline{\Gamma_{\rm out}}\cup\overline{\Gamma_{\rm wall}}`)}:{' '}
                    {M(String.raw`\Gamma_{\rm in}=\{10\,755\}\times(-768.5,\,250.5)`)} es la cara derecha (NE), por la que entra el flujo
                    subterráneo natural; {M(String.raw`\Gamma_{\rm out}=\{816\}\times(-2\,690.5,\,250.5)`)} es la cara izquierda (SO),
                    por la que sale; {M(String.raw`\Gamma_{\rm wall}`)} son la superficie y los dos tramos del fondo, impermeables.{' '}
                    {M(String.raw`\mathbf n`)}: normal unitaria exterior.
                </p>
                <h4>Γwall: Neumann homogénea (impermeable)</h4>
                <BlockMath math={String.raw`(\mathbf K\nabla h)\cdot\mathbf n=0\;\Longleftrightarrow\;\mathbf u\cdot\mathbf n=0`} />
                <h4>Γin: Neumann no homogénea (flujo prescrito)</h4>
                <BlockMath math={String.raw`(\mathbf K\nabla h)\cdot\mathbf n=f_{\rm in}(z),\qquad \mathbf u\cdot\mathbf n=-f_{\rm in}\le0`} />
                <p>
                    {M(String.raw`f_{\rm in}\ge0`)}: perfil coseno-cuadrado por tramos, independiente del tiempo, que aproxima el flujo
                    subterráneo natural; se anula en la cota superior, alcanza su máximo, {M(String.raw`2\times10^{-4}`)} m/s, unos 100 m
                    más abajo y se anula bajo {M('z=-760')} m (In_h en funtions/utils.py; config/geometry.py). Es el perfil de las
                    flechas del esquema:
                </p>
                <BlockMath math={String.raw`f_{\rm in}(z)=A\begin{cases}\cos^2\frac{\pi(z-150)}{200}, & 150<z\le250,\\[2pt] \cos^2\frac{\pi(z-150)}{1820}, & -760<z\le150,\\[2pt] 0 & \text{en otro caso},\end{cases}\quad A=2\times10^{-4}\ \tfrac{\rm m}{\rm s}`} />
                <h4>Γout: salida libre</h4>
                <p>
                    No se prescribe ni la carga ni el flujo: el agua sale con el perfil que impone la solución interior. De
                    {' '}{M(String.raw`\partial_{\mathbf n}\mathbf u=\mathbf 0`)} (dos condiciones por punto) se adopta la componente
                    normal, que equivale a una difusión unidimensional sobre la cara:
                </p>
                <BlockMath math={String.raw`\partial_n(\mathbf u\cdot\mathbf n)=0\;\Longleftrightarrow\;S_s\,\partial_t h-\partial_\tau\bigl(K_{\tau\tau}\,\partial_\tau h\bigr)=0\ \text{ en }\Gamma_{\rm out}`} />
                <p>
                    con {M(String.raw`\mathbf n=(-1,0)`)}, {M(String.raw`\boldsymbol\tau=(0,1)`)} y {M(String.raw`K_{\tau\tau}=K_z`)}. La
                    traza {M(String.raw`h|_{\Gamma_{\rm out}}`)} evoluciona sola desde {M('h_0')}, sin depender del interior ni de los
                    controles: el flujo es un problema mixto, Dirichlet dinámico en Γout y Neumann en el resto, y el flujo saliente{' '}
                    {M(String.raw`\mathbf u\cdot\mathbf n`)} es resultado, no dato. En los extremos, que tocan Γwall,{' '}
                    {M(String.raw`K_{\tau\tau}\partial_\tau h=0`)}. Discretización en la lámina siguiente.
                </p>
                <h4>Transporte: flujo dispersivo nulo en toda la frontera</h4>
                <BlockMath math={String.raw`(\mathbf D\nabla C_m)\cdot\mathbf n=0\ \text{ en }\partial\Omega`} />
                <p>
                    En Γwall, donde {M(String.raw`\mathbf u\cdot\mathbf n=0`)}, anula el flujo total de soluto. En Γin y Γout el flujo
                    total, {M(String.raw`(\mathbf uC_m-\mathbf D\nabla C_m)\cdot\mathbf n=(\mathbf u\cdot\mathbf n)\,C_m`)}, es puramente
                    advectivo: en la salida el contaminante sale arrastrado sin reflexión dispersiva; en la entrada el agua trae la
                    concentración que el dominio tiene en esa cara (agua limpia mientras la pluma no llegue a Γin).
                </p>
                <h4>Respecto a la maestría</h4>
                <p>
                    En la maestría la salida tenía flujo prescrito, {M(String.raw`(\mathbf K\nabla h)\cdot\mathbf n=U_{\rm out}`)} (Neumann
                    no homogénea, con la amplitud que equilibra la entrada). Ahora es libre y solo necesita {M('h_0')}; la entrada y las
                    paredes se conservan.
                </p>
                <h4>Líneas de corriente del esquema</h4>
                <p>
                    Trazadas desde Γin con la velocidad de Darcy simulada sin bombeo (codigo/scripts/exportar_esquema_presentacion.py,
                    las mismas de la apertura). Solo indican la dirección del flujo.
                </p>
            </Notas>
        </SlideLayout>
    );
}
