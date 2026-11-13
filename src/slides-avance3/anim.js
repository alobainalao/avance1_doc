import { useCallback, useEffect, useRef, useState } from 'react';

// Animación de las slides del avance 3: un solo reloj por slide (requestAnimationFrame) que va de 0 a 1.
// Con prefers-reduced-motion la animación salta al estado final. `repetir()` la vuelve a lanzar (clic en la figura).

const reducida = () => typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useProgreso(duracion = 2400, retraso = 300) {
    const [p, setP] = useState(reducida() ? 1 : 0);
    const [ronda, setRonda] = useState(0);
    const raf = useRef(0);
    useEffect(() => {
        if (reducida()) { setP(1); return undefined; }
        let t0 = null;
        setP(0);
        const paso = (t) => {
            if (t0 === null) t0 = t;
            const x = Math.min(1, Math.max(0, (t - t0 - retraso) / duracion));
            setP(x);
            if (x < 1) raf.current = requestAnimationFrame(paso);
        };
        raf.current = requestAnimationFrame(paso);
        return () => cancelAnimationFrame(raf.current);
    }, [duracion, retraso, ronda]);
    const repetir = useCallback(() => setRonda(r => r + 1), []);
    return [p, repetir];
}

// Suavizados y tramos: `tramo(p, a, b)` reescala p del intervalo [a, b] a [0, 1] (para encadenar fases).
export const suave = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const tramo = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
export const lerp = (a, b, x) => a + (b - a) * x;
