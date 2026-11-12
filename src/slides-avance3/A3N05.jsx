import React from 'react';
import { InlineMath } from 'react-katex';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Tabla, Punto, Cols, Col, Titulo } from './ui.jsx';

// Verificación del gradiente adjunto del modelo sin sumidero, con salida libre (4 nov 2026).
// FEniCSx: tests/test_gradiente_modelo_nuevo.py (C≡1, 3 pasos, 4 direcciones, pasos de diferencias 1e-2 y 3e-3).
// BFR: tests/test_adjunto_exacto.py (adjunto discreto exacto; cierre "libre"; columnas reejecutadas: Q aleatoria y (Q,zp)).
const FEM = [
    { m: 'ADR',         r: '1.3·10⁻¹⁰ – 1.9·10⁻⁷' },
    { m: 'MRMT Semi',   r: '1.4·10⁻⁹ – 6.5·10⁻⁷' },
    { m: 'MRMT Bloque', r: '3.5·10⁻¹⁰ – 1.9·10⁻⁷' },
];
const BFR = [
    { m: 'ADR',         q: '1.5·10⁻⁵', qz: '4.8·10⁻⁶' },
    { m: 'MRMT Semi',   q: '3.0·10⁻⁵', qz: '4.9·10⁻⁶' },
    { m: 'MRMT Bloque', q: '1.4·10⁻⁵', qz: '5.2·10⁻⁶' },
];
const colsFEM = [{ k: 'm', label: 'Modelo' }, { k: 'r', label: '4 direcciones', color: '#2E7D4F', mono: true }];
const colsBFR = [{ k: 'm', label: 'Modelo' }, { k: 'q', label: 'Q aleatoria', color: '#2E7D4F', mono: true },
                 { k: 'qz', label: '(Q, z_p)', color: '#2E7D4F', mono: true }];

export default function A3N05({ theme = 'dark' }) {
    return (
        <SlideLayout title="Verificación del gradiente adjunto — modelo nuevo" theme={theme} justify="flex-start">
            <Cols gap="4%">
                <Col gap={8}>
                    <Titulo>FEniCSx: error relativo frente a diferencias finitas</Titulo>
                    <Tabla cols={colsFEM} rows={FEM} />
                </Col>
                <Col gap={8}>
                    <Titulo>BFR (RBF-FD): adjunto discreto exacto</Titulo>
                    <Tabla cols={colsBFR} rows={BFR} />
                </Col>
            </Cols>
            <Col gap={10}>
                <div style={{ height: 8 }} />
                <Punto color="#2E7D4F">
                    Salida libre en los dos códigos; modelo sin sumidero del pozo, con <InlineMath math={String.raw`-S_s\partial_t h\,C`} /> en
                    el transporte y la fuente <InlineMath math={String.raw`-S_s\partial_t(C\psi_C)`} /> en el adjunto del flujo.
                </Punto>
                <Punto color="#0F7A85">
                    Banco 1D independiente del simulador: adjunto continuo frente a diferencias finitas, error <InlineMath math="O(h)" />;
                    sin la fuente de almacenamiento el error es 0.8–1.6.
                </Punto>
                <Punto color="#C4511F">Aún no verificado: configuración tipo main con la pluma llegando al pozo.</Punto>
            </Col>
        </SlideLayout>
    );
}
