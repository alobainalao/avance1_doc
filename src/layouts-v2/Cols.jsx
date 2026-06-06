import React from 'react';
import './SlideLayout.css';

/**
 * Cols — LaTeX \begin{columns} equivalent.
 * Col  — LaTeX \begin{column}{width} equivalent.
 */
export const Cols = ({ children, gap = '4%', align = 'stretch' }) => (
    <div className="sl-cols" style={{ gap, alignItems: align }}>
        {children}
    </div>
);

export const Col = ({ children, flex = 1, style }) => (
    <div className="sl-col" style={{ flex, ...style }}>
        {children}
    </div>
);
