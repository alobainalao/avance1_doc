import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import './Slide27b.css';

const methods = [
    { name: 'Descenso del gradiente', hessian: 'No',          order: 'Lineal',      selected: false },
    { name: 'Newton',                 hessian: 'Sí (exacto)', order: 'Cuadrática',  selected: false },
    { name: 'L-BFGS',                hessian: 'Aproximado',  order: 'Superlineal', selected: false },
    { name: 'NCG',                    hessian: 'No',          order: 'Superlineal', selected: true  },
];

const Slide27b = ({ theme = 'dark' }) => (
    <SlideLayout title="Método de optimización seleccionado" theme={theme}>
        <table className="s27b-table">
            <thead>
                <tr>
                    <th>Método</th>
                    <th>Hessiano</th>
                    <th>Orden</th>
                </tr>
            </thead>
            <tbody>
                {methods.map((m) => (
                    <tr key={m.name} className={m.selected ? 's27b-selected' : ''}>
                        <td className="s27b-name">{m.name}</td>
                        <td>{m.hessian}</td>
                        <td>{m.order}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </SlideLayout>
);

export default Slide27b;
