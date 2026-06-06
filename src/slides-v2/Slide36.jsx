import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide36 = ({ theme = 'dark' }) => (
    <SlideLayout title="Referencias bibliográficas I" theme={theme}>
        <ul className="sl-ref-list">
            <li className="sl-ref-entry">
                <FaRegFileAlt className="sl-ref-icon" />
                <div className="sl-ref-text">
                    <span className="sl-ref-authors">
                        Alvarez-Vázquez, L., García-Chan, N., Martínez, A., and Vázquez-Méndez, M. (2010).
                    </span>
                    <span className="sl-ref-title">
                        Pareto-optimal solutions for a wastewater treatment problem.
                    </span>
                    <span className="sl-ref-venue">
                        Journal of Computational and Applied Mathematics, 234(7):2193–2201.
                        Fourth International Conference on Advanced COmputational Methods
                        in ENgineering (ACOMEN 2008).
                    </span>
                </div>
            </li>
            <li className="sl-ref-entry">
                <FaRegFileAlt className="sl-ref-icon" />
                <div className="sl-ref-text">
                    <span className="sl-ref-authors">
                        Benson, D. A., Wheatcraft, S. W., and Meerschaert, M. M. (2000).
                    </span>
                    <span className="sl-ref-title">
                        Application of a fractional advection-dispersion equation.
                    </span>
                    <span className="sl-ref-venue">
                        Water Resources Research, 36(6):1403–1412.
                    </span>
                </div>
            </li>
            <li className="sl-ref-entry">
                <FaRegFileAlt className="sl-ref-icon" />
                <div className="sl-ref-text">
                    <span className="sl-ref-authors">
                        Fasshauer, G. E. (2007).
                    </span>
                    <span className="sl-ref-title">
                        Meshfree Approximation Methods with MATLAB.
                    </span>
                    <span className="sl-ref-venue">
                        World Scientific.
                    </span>
                </div>
            </li>
        </ul>
    </SlideLayout>
);

export default Slide36;
