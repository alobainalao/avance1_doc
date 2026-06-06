import React from 'react';

const EqCard = ({ title, num, children, style, className }) => (
    <div className={`sl-eq-card${className ? ' ' + className : ''}`} style={style}>
        {(title || num !== undefined) && (
            <div className="sl-eq-card__head">
                <span className="sl-eq-card__label">{title || ''}</span>
                {num !== undefined && <span className="sl-eq-card__num">({num})</span>}
            </div>
        )}
        <div className="sl-eq-card__body">{children}</div>
    </div>
);

export default EqCard;
