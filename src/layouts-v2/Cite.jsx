import React from 'react';

/** Cite — LaTeX \textcolor{blue}{\cite{}} equivalent. */
const Cite = ({ children }) => (
    <span className="sl-cite">{children}</span>
);

export default Cite;
