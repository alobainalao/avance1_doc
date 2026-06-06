import React from 'react';
import './SlideLayout.css';

/**
 * Fig — LaTeX \includegraphics wrapped in a card.
 * style: extra styles on the container
 * imgStyle: extra styles on the img tag
 * fill: if true, img fills the container height (use with explicit container height)
 */
const Fig = ({ src, alt = '', caption, style, imgStyle, fill }) => (
    <div className="sl-fig" style={style}>
        <img
            src={src}
            alt={alt}
            style={fill
                ? { width: '100%', height: '100%', objectFit: 'contain', display: 'block', ...imgStyle }
                : { display: 'block', width: '100%', height: 'auto', ...imgStyle }
            }
        />
        {caption && <p className="sl-fig__caption">{caption}</p>}
    </div>
);

export default Fig;
