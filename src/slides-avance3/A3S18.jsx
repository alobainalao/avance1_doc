import React, { useRef, useEffect } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

// ── Rutas placeholder — actualizar cuando se generen las 6 animaciones ──────
// Carpeta esperada: public/videos/opt/{backend}/{model}/C_opt.mp4
// Dimensiones y crop a ajustar tras ver los primeros frames generados.
const CROP_BFR = { sx: 0, sy: 0, sw: 1, sh: 1 }; // placeholder
const CROP_FEM = { sx: 0, sy: 0, sw: 1, sh: 1 }; // placeholder

const CELLS = [
    { row: 'ADR',        src: `${B}/videos/opt/bfr/adr/C_opt.mp4`,           crop: CROP_BFR, ready: false },
    { row: 'ADR',        src: `${B}/videos/opt/fenicsx/adr/C_opt.mp4`,        crop: CROP_FEM, ready: false },
    { row: 'MRMT Semi',  src: `${B}/videos/opt/bfr/mrmt_semi/C_opt.mp4`,      crop: CROP_BFR, ready: false },
    { row: 'MRMT Semi',  src: `${B}/videos/opt/fenicsx/mrmt_semi/C_opt.mp4`,  crop: CROP_FEM, ready: false },
    { row: 'MRMT Block', src: `${B}/videos/opt/bfr/mrmt_block/C_opt.mp4`,     crop: CROP_BFR, ready: false },
    { row: 'MRMT Block', src: `${B}/videos/opt/fenicsx/mrmt_block/C_opt.mp4`, crop: CROP_FEM, ready: false },
];

const INFERNO = [
    '#000004','#1c1044','#51127c','#832681',
    '#b5367a','#e35932','#fb8861','#fec287','#fcfdbf',
].join(', ');

export default function A3S18({ theme = 'dark' }) {
    const vRefs = useRef(CELLS.map(() => null));
    const cRefs = useRef(CELLS.map(() => null));

    useEffect(() => {
        const videos = vRefs.current;
        videos.forEach(v => v && (v.playbackRate = 0.8, v.play().catch(() => {})));
        const master = videos[0];
        let rafId, last = 0;
        const draw = (ts) => {
            rafId = requestAnimationFrame(draw);
            if (ts - last < 33) return;
            last = ts;
            if (!master || !master.duration) return;
            const t = master.currentTime;
            CELLS.forEach(({ crop }, i) => {
                const v = videos[i];
                const c = cRefs.current[i];
                if (!v || !c || v.readyState < 2) return;
                if (i > 0 && Math.abs(v.currentTime - t) > 0.15) v.currentTime = t;
                const { sx, sy, sw, sh } = crop;
                c.getContext('2d').drawImage(v, sx, sy, sw, sh, 0, 0, c.width, c.height);
            });
        };
        rafId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <SlideLayout title="Simulación óptima — campo de concentración C*(t)"
                     theme={theme} justify="flex-start">

            {/* Cabeceras de columna */}
            <div style={{
                flexShrink: 0, display: 'grid',
                gridTemplateColumns: '1fr 1fr', gap: 3, paddingBottom: 3,
            }}>
                {['BFR — RBF-FD', 'FEniCS — FEM'].map(h => (
                    <div key={h} style={{
                        textAlign: 'center', padding: '4px 0',
                        fontWeight: 700, fontSize: 15, color: '#00d8ff', letterSpacing: 1,
                        background: 'rgba(0,216,255,0.07)',
                        border: '1px solid rgba(0,216,255,0.20)', borderRadius: 4,
                    }}>{h}</div>
                ))}
            </div>

            {/* Grid 3×2 */}
            <div style={{
                flex: 1, minHeight: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: 3,
            }}>
                {CELLS.map(({ row, src, crop, ready }, i) => (
                    <div key={i} style={{
                        position: 'relative', overflow: 'hidden',
                        borderRadius: 4, background: '#0a0e1a',
                        border: '1px solid rgba(0,216,255,0.12)',
                    }}>
                        <span style={{
                            position: 'absolute', top: 4, left: 4, zIndex: 2,
                            fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
                            color: 'rgba(255,255,255,0.85)',
                            background: 'rgba(0,0,0,0.65)', padding: '1px 6px', borderRadius: 3,
                            pointerEvents: 'none',
                        }}>{row}</span>

                        {!ready && (
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 3,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(10,14,26,0.82)',
                                flexDirection: 'column', gap: 6,
                            }}>
                                <span style={{ fontSize: 28, opacity: 0.25 }}>▷</span>
                                <span style={{ fontSize: 11, color: '#475569' }}>pendiente</span>
                            </div>
                        )}

                        <canvas
                            ref={el => { cRefs.current[i] = el; }}
                            width={Math.max(crop.sw, 1)} height={Math.max(crop.sh, 1)}
                            style={{ display: 'block', width: '100%', height: '100%' }}
                        />
                        <video
                            ref={el => { vRefs.current[i] = el; }}
                            src={src} loop muted playsInline
                            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                        />
                    </div>
                ))}
            </div>

            {/* Barra de color global — inferno, más grande que en A3S15 */}
            <div style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
                padding: '7px 2px 0',
            }}>
                <span style={{ color: '#7090aa', fontSize: 14, fontFamily: 'monospace' }}>C* = 0</span>
                <div style={{
                    flex: 1, height: 24, borderRadius: 5,
                    background: `linear-gradient(90deg, ${INFERNO})`,
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 0 12px rgba(251,136,97,0.15)',
                }} />
                <span style={{ color: '#fcfdbf', fontSize: 14, fontFamily: 'monospace' }}>C* máx</span>
                <span style={{ color: '#475569', fontSize: 12, marginLeft: 10 }}>
                    inferno · Q*(t) óptimo · 6 combinaciones
                </span>
            </div>

        </SlideLayout>
    );
}
