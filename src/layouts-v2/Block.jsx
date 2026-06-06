import React from 'react';
import './SlideLayout.css';

/**
 * Block — LaTeX \begin{block}{title} equivalent.
 * accent: 'default' | 'alert' | 'example'
 */
const Block = ({ title, children, accent = 'default', style }) => (
    <div className={`sl-block sl-block--${accent}`} style={style}>
        {title && <div className="sl-block__title">{title}</div>}
        <div className="sl-block__body">{children}</div>
    </div>
);

export default Block;
