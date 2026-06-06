import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';

const Slide37 = ({ theme = 'dark' }) => (
    <SlideLayout title="Referencias bibliográficas II" theme={theme}>
        <ul className="sl-ref-list">
            <li className="sl-ref-entry">
                <FaRegFileAlt className="sl-ref-icon" />
                <div className="sl-ref-text">
                    <span className="sl-ref-authors">
                        García-Chan, N., Pantoja, D. A., Filonov, A., Vázquez-Mendéz, M. E.,
                        and Gasca-Ortiz, T. (2018).
                    </span>
                    <span className="sl-ref-title">
                        An approach to an optimal t-head jetty: a numerical simulation case
                        in chamela bay, mexico.
                    </span>
                    <span className="sl-ref-venue">
                        Coastal Engineering Journal, 60(3):327–339.
                    </span>
                </div>
            </li>
            <li className="sl-ref-entry">
                <FaRegFileAlt className="sl-ref-icon" />
                <div className="sl-ref-text">
                    <span className="sl-ref-authors">
                        Nocedal, J. and Wright, S. (2006).
                    </span>
                    <span className="sl-ref-title">
                        Numerical Optimization.
                    </span>
                    <span className="sl-ref-venue">
                        Springer, 2 edition.
                    </span>
                </div>
            </li>
            <li className="sl-ref-entry">
                <FaRegFileAlt className="sl-ref-icon" />
                <div className="sl-ref-text">
                    <span className="sl-ref-authors">
                        Shanbhag, U. and Ghattas, O. (2020).
                    </span>
                    <span className="sl-ref-title">
                        Adjoint-based optimization for pde constrained problems.
                    </span>
                    <span className="sl-ref-venue">
                        SIAM Review, 62(4):803–838.
                    </span>
                </div>
            </li>
        </ul>
    </SlideLayout>
);

export default Slide37;
