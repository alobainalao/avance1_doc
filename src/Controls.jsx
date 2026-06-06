import React from 'react';
import './SlideShow.css';
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa';

const Controls = ({ onNext, onPrev, fullscreen, handleFullscreen, theme, onThemeToggle }) => {

    const toggleFullscreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
            handleFullscreen(true);
        } else {
            document.exitFullscreen();
            handleFullscreen(false);
        }
    };

    return (
        <> 
            <div className="controls-theme">
                <div onClick={onThemeToggle} title="Cambiar tema">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </div>
            </div>
            <div className="controls-overlay">
                <div className="icon-button" onClick={toggleFullscreen} title="Modo presentación">
                    {fullscreen ? <FaCompressArrowsAlt size={25} /> : <FaExpandArrowsAlt size={20} />}
                </div>
            </div>
        </>
    );
};

export default Controls;
