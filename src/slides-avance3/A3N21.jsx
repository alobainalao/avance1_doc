import React from 'react';
import SlideLayout from '../layouts-v2/SlideLayout.jsx';
import { Punto, Cols, Col } from './ui.jsx';

const E = [
    ['E1', 'Diferencias finitas del gradiente completo en configuración tipo main (pluma en el pozo), BFR y FEniCSx, 3 modelos; barrido del paso y prueba de Taylor.', '#C4511F'],
    ['E2', 'Solución manufacturada 2D del flujo con K variable para el cierre (D): convergencia del estado y del adjunto.', '#C4511F'],
    ['E3', 'Diagnóstico de ∂ₙu: evaluar n·∂ₙu y τ·∂ₙu en Γout con la salida libre.', '#C4511F'],
    ['E4', 'Balance global de masa de soluto en 2D: conservativa vs no conservativa.', '#C4511F'],
    ['E5', 'Adjunto exacto BFR con C modulada y con el recorte activo.', '#C4511F'],
    ['E6', 'Consistencia de BFR y FEniCSx en MRMT (decaimiento ya unificado) con el caso nitrato.', '#0F7A85'],
    ['E7', 'Identidad de dualidad con perturbaciones aleatorias de Q en ambos backends.', '#0F7A85'],
    ['E8', 'Sensibilidad del gradiente en z_p al paso de diferencias y por qué no decrece con la malla.', '#0F7A85'],
];

export default function A3N21({ theme = 'dark' }) {
    return (
        <SlideLayout title="Verificaciones adicionales antes de dar por validado el modelo" theme={theme} justify="flex-start">
            <Cols>
                <Col>{E.slice(0, 4).map(([k, t, c]) => <Punto key={k} color={c} size={21}><b>{k}</b> · {t}</Punto>)}</Col>
                <Col>{E.slice(4).map(([k, t, c]) => <Punto key={k} color={c} size={21}><b>{k}</b> · {t}</Punto>)}</Col>
            </Cols>
        </SlideLayout>
    );
}
