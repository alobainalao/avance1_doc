import React, { useRef, useEffect } from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const B = process.env.PUBLIC_URL;

const VIDEOS = [
    { label: 'ADR',        src_bfr: `${B}/videos_adr/adj_c.mp4`,     src_fem: `${B}/videos_mef/adj_c.mp4`     },
    { label: 'MRMT Semi',  src_bfr: `${B}/videos_sem/adj_c.mp4`,     src_fem: `${B}/videos_mef_sem/adj_c.mp4` },
    { label: 'MRMT Block', src_bfr: `${B}/videos_blk/adj_c.mp4`,     src_fem: `${B}/videos_mef_blk/adj_c.mp4` },
];

function AutoVideo({ src }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = 0.8;
            ref.current.play().catch(() => {});
        }
    }, [src]);
    return (
        <video ref={ref} src={src} autoPlay loop muted playsInline
               style={{ width: '100%', height: '100%', objectFit: 'contain',
                        background: '#000', display: 'block' }} />
    );
}

const HDR = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '4px 0', fontWeight: 700, fontSize: 18,
    color: '#f59e0b', letterSpacing: 1,
    background: 'rgba(245,158,11,0.08)',
    borderBottom: '1px solid rgba(245,158,11,0.20)',
};

const ROW_LBL = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    writingMode: 'vertical-rl', transform: 'rotate(180deg)',
    color: '#c084fc', fontWeight: 700, fontSize: 17, letterSpacing: 1,
    padding: '0 4px', minWidth: 28,
    background: 'rgba(192,132,252,0.07)',
    borderRight: '1px solid rgba(192,132,252,0.20)',
};

const A3S16 = ({ theme = 'dark' }) => (
    <SlideLayout title="Estado adjunto — sensibilidad ψ_C(x,z,t)" theme={theme} justify="flex-start">

        <div style={{
            flex: 1, display: 'grid', minHeight: 0,
            gridTemplateColumns: '28px 1fr 1fr',
            gridTemplateRows: '32px repeat(3, 1fr)',
            gap: 0,
            border: '1px solid rgba(245,158,11,0.22)',
            borderRadius: 8, overflow: 'hidden',
        }}>
            <div style={{ background: 'rgba(0,0,0,0.30)', gridColumn: 1, gridRow: 1 }} />
            <div style={{ ...HDR, gridColumn: 2, gridRow: 1 }}>BFR — RBF-FD</div>
            <div style={{ ...HDR, gridColumn: 3, gridRow: 1 }}>FEniCS — FEM</div>

            {VIDEOS.map(({ label, src_bfr, src_fem }, ri) => (
                <React.Fragment key={label}>
                    <div style={{ ...ROW_LBL, gridColumn: 1, gridRow: ri + 2 }}>{label}</div>
                    <div style={{
                        gridColumn: 2, gridRow: ri + 2,
                        borderTop: ri > 0 ? '1px solid rgba(245,158,11,0.12)' : 'none',
                        borderRight: '1px solid rgba(245,158,11,0.12)',
                        background: '#000',
                    }}>
                        <AutoVideo src={src_bfr} />
                    </div>
                    <div style={{
                        gridColumn: 3, gridRow: ri + 2,
                        borderTop: ri > 0 ? '1px solid rgba(245,158,11,0.12)' : 'none',
                        background: '#000',
                    }}>
                        <AutoVideo src={src_fem} />
                    </div>
                </React.Fragment>
            ))}
        </div>

        <p style={{ color: 'var(--sl-muted)', fontSize: 18, margin: 0, flexShrink: 0 }}>
            Adjunto ψ_C integrado de T→0 (36 s a 20 fps). Concentrado en el pozo
            al inicio y difundido hacia atrás en el tiempo. Colormap turbo simétrico.
        </p>
    </SlideLayout>
);

export default A3S16;
