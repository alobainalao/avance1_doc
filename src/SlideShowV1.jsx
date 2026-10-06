import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Controls from './Controls.jsx';
import ProgressIndicator from './ProgressIndicator.jsx';
import AnimationButtons from './AnimationButtons.jsx';
import './SlideShow.css';

const TOTAL_EXPECTED_TIME = 900000;

const totalSlides = 22;

const slideDurations = [
    24, 60, 96, 50, 40, 50, 80, 30, 40, 30,
    30, 30, 30, 40, 30, 30, 60, 60, 30, 30,
    15, 15
];

const SlideshowV1 = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const next = () => setIndex((prev) => (prev + 1) % totalSlides);
    const prev = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const realProgressTime = slideDurations
        .slice(0, index)
        .reduce((acc, val) => acc + val * 1000, 0);

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
    }, []);

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

    return (
        <div className="slideshow-container">
            <button className="ssv2-back-btn" onClick={() => navigate('/')} title="Volver al menú">
                ← Menú
            </button>
            <Controls onNext={next} onPrev={prev} fullscreen={fullscreen} handleFullscreen={setFullscreen} />
            <div className="image-wrapper">
                <div className="slide-counter">
                    {index + 1} / {totalSlides}
                </div>
                {index === 2 && <AnimationButtons metodo={'mef'} />}
                {index === 6 && <AnimationButtons metodo={'bfr'} />}
                <ProgressIndicator
                    time={elapsedTime}
                    totalTime={TOTAL_EXPECTED_TIME}
                    top="7.9vh"
                    color="cyan"
                />
                <ProgressIndicator
                    time={realProgressTime}
                    totalTime={TOTAL_EXPECTED_TIME}
                    top="6.2vh"
                    color="red"
                />
                <img
                    src={`${process.env.PUBLIC_URL}/slides-avance1/slide${index + 1}.png`}
                    alt="Slide"
                    className="slide-image"
                />
            </div>
        </div>
    );
};

export default SlideshowV1;
