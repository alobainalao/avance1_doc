import React, { useState, useEffect, useCallback, useRef } from 'react';
import Controls from './Controls.jsx';
import ProgressIndicator from './ProgressIndicator.jsx';
import SlideHeader from './SlideHeader.jsx';
import Portada from './Portada.jsx';
import slideConfig from './slideConfig.js';
import './SlideShow.css';
import './SlideShowV2.css';
import 'katex/dist/katex.min.css';

const TOTAL_EXPECTED_TIME = 900000;
const CANVAS_W = 1280;
const CANVAS_H = 960;

const SlideshowV2 = () => {
    const totalSlides = slideConfig.length;

    const [index, setIndex] = useState(0);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);

    const next = useCallback(() => setIndex((i) => (i + 1) % totalSlides), [totalSlides]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + totalSlides) % totalSlides), [totalSlides]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setScale(Math.min(width / CANVAS_W, height / CANVAS_H));
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const realProgressTime = slideConfig
        .slice(0, index)
        .reduce((acc, slide) => acc + slide.duration * 1000, 0);

    useEffect(() => {
        const handleKey = (e) => {
            e.preventDefault();
            if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) next();
            else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) prev();
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
            const isInteractive = e.target.closest('button, a, [role="button"], [tabindex]');
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
            if (delta > 0) prev();
            else next();
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
    }, [next, prev]);

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

    const slide = slideConfig[index];
    const SlideComponent = slide?.component;

    return (
        <div className="slideshow-container v2" ref={containerRef}>
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
                    width: CANVAS_W,
                    height: CANVAS_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                <div className="slide-counter">
                    {index + 1} / {totalSlides}
                </div>
                <div className="slide-stack">
                    <SlideHeader index={index} title={slide?.title} />
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
                            ? <Portada theme={theme} />
                            : SlideComponent && <SlideComponent theme={theme} />
                        }
                    </div>
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
