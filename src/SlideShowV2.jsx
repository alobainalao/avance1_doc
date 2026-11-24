import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Controls from './Controls.jsx';
import ProgressIndicator from './ProgressIndicator.jsx';
import SlideHeader from './SlideHeader.jsx';
import Portada from './Portada.jsx';
import defaultSlideConfig from './slideConfig.js';
import './SlideShow.css';
import './SlideShowV2.css';
import 'katex/dist/katex.min.css';
import { EcNumContext } from './layouts-v2/EcNum.js';

const TOTAL_EXPECTED_TIME = 900000;
const CANVAS_W = 1280;
const CANVAS_H = 960;

// Forma corta de una referencia para el pie de la lámina: «Bear (1972)», «Haggerty y Gorelick (1995)», «Manzoni et al. (2021)».
const citaCorta = (r) => {
    if (!r) return '?';
    const a = r.autores, apellido = (s) => s.split(',')[0];
    const quien = a.length === 1 ? apellido(a[0]) : a.length === 2 ? `${apellido(a[0])} y ${apellido(a[1])}` : `${apellido(a[0])} et al.`;
    return `${quien} (${r.anio})`;
};

// canvasW: ancho del lienzo propio de un avance (registry.js); por defecto CANVAS_W. referencias: {clave: entrada} del
// avance; las láminas con `refs: [claves]` en su config muestran las citas cortas al pie.
const SlideshowV2 = ({ slides: slidesProp, sections, portadaDate, deckClass = '', canvasW = CANVAS_W, ecuaciones, referencias }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const slides = slidesProp ?? defaultSlideConfig;
    const totalSlides = slides.length;

    const _s0 = parseInt(new URLSearchParams(location.search).get('s') || '0', 10);
    const [index, setIndex] = useState(Math.min(Math.max(_s0, 0), totalSlides - 1));
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);
    const indexRef = useRef(0);

    // entrada: +1 si se llegó a la lámina avanzando, −1 retrocediendo (las láminas con fases empiezan en la última).
    const [entrada, setEntrada] = useState(1);
    const next = useCallback(() => { setEntrada(1); setIndex((i) => (i + 1) % totalSlides); }, [totalSlides]);
    const prev = useCallback(() => { setEntrada(-1); setIndex((i) => (i - 1 + totalSlides) % totalSlides); }, [totalSlides]);

    useEffect(() => { indexRef.current = index; }, [index]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setScale(Math.min(width / canvasW, height / CANVAS_H));
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [canvasW]);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const realProgressTime = slides
        .slice(0, index)
        .reduce((acc, s) => acc + s.duration * 1000, 0);

    useEffect(() => {
        // Pasos internos: antes de cambiar de lámina se emite 'diapo:paso' (cancelable, detail.dir = ±1); una lámina con
        // fases propias lo cancela mientras le queden fases, así el control remoto recorre sus fases y luego sigue.
        const paso = (dir) => {
            const ev = new CustomEvent('diapo:paso', { detail: { dir }, cancelable: true });
            if (window.dispatchEvent(ev)) (dir > 0 ? next : prev)();
        };
        const handleKey = (e) => {
            e.preventDefault();
            if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) paso(1);
            else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) paso(-1);
            else if (e.key === 'Tab') {
                const vm = slides[indexRef.current]?.videoMetodo;
                if (vm) window.open(
                    `${process.env.PUBLIC_URL}/#/video-player?metodo=${vm}&video=h.mp4`,
                    '_blank'
                );
            }
            else if (['f', 'Enter', 'AudioVolumeUp'].includes(e.key)) {
                const elem = document.documentElement;
                if (!document.fullscreenElement) {
                    elem.requestFullscreen();
                    setFullscreen(true);
                } else {
                    document.exitFullscreen();
                    setFullscreen(false);
                }
            }
        };

        const handleClick = (e) => {
            // Zonas con clic propio (cursor de mano: repetir una animación, pasar de fase) tampoco cambian de lámina.
            const isInteractive = e.target.closest('button, a, [role="button"], [tabindex]')
                || window.getComputedStyle(e.target).cursor === 'pointer';
            if (isInteractive) return;
            if (e.button === 0) prev();
            else if (e.button === 2) next();
        };

        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => { touchStartX = e.changedTouches[0].screenX; };
        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const delta = touchEndX - touchStartX;
            if (Math.abs(delta) < 50) return;
            paso(delta > 0 ? -1 : 1);
        };

        const blockContext = (e) => e.preventDefault();

        window.addEventListener('keydown', handleKey);
        window.addEventListener('mousedown', handleClick);
        window.addEventListener('contextmenu', blockContext);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('contextmenu', blockContext);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [next, prev, slides]);

    useEffect(() => {
        const handleVideoClosed = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.();
                setFullscreen(true);
            }
        };
        window.addEventListener('videoClosed', handleVideoClosed);
        return () => window.removeEventListener('videoClosed', handleVideoClosed);
    }, []);

    // Navegación directa desde slides: dispatchEvent(new CustomEvent('goToSlide', { detail: { index: N } }))
    useEffect(() => {
        const handler = (e) => setIndex(Math.max(0, Math.min(e.detail.index, totalSlides - 1)));
        window.addEventListener('goToSlide', handler);
        return () => window.removeEventListener('goToSlide', handler);
    }, [totalSlides]);

    const slide = slides[index];
    const SlideComponent = slide?.component;

    return (
        <div className={`slideshow-container v2 ${deckClass}`} ref={containerRef}>
            <button className="ssv2-back-btn" onClick={() => navigate('/')} title="Volver al menú">
                ← Menú
            </button>
            <Controls
                onNext={next}
                onPrev={prev}
                fullscreen={fullscreen}
                handleFullscreen={setFullscreen}
                theme={theme}
                onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            />
            <div
                className="slide-canvas"
                style={{
                    width: canvasW,
                    height: CANVAS_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                <div className="slide-counter">
                    {index + 1} / {totalSlides}
                </div>
                <div className="slide-stack">
                    <SlideHeader index={index} title={slide?.title} sections={sections} />
                    <ProgressIndicator
                        time={elapsedTime}
                        totalTime={TOTAL_EXPECTED_TIME}
                        top="40px"
                        color="cyan"
                    />
                    <ProgressIndicator
                        time={realProgressTime}
                        totalTime={TOTAL_EXPECTED_TIME}
                        top="29px"
                        color="red"
                    />
                    <div className="slide-crop-wrapper">
                        {index === 0
                            ? <Portada theme={theme} date={portadaDate} />
                            : SlideComponent && (
                                <EcNumContext.Provider value={ecuaciones || {}}>
                                    <SlideComponent theme={theme} entrada={entrada} />
                                </EcNumContext.Provider>
                            )
                        }
                    </div>
                    {slide?.refs && referencias && (
                        <div className="slide-refs">{slide.refs.map(k => citaCorta(referencias[k])).join(' · ')}</div>
                    )}
                    <div className="logo">
                        <img
                            src={`${process.env.PUBLIC_URL}/logo-udg.png`}
                            alt="UDG"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideshowV2;
