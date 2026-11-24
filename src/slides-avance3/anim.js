import { useCallback, useEffect, useRef, useState } from 'react';

// Animación de las slides del avance 3: un solo reloj por slide (requestAnimationFrame) que va de 0 a 1.
// Con prefers-reduced-motion la animación salta al estado final. `repetir()` la vuelve a lanzar (clic en la figura).

export const reducida = () => typeof window !== 'undefined' && window.matchMedia
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

// Reloj en segundos (0 → total) para animaciones por fases: `ir(s0)` salta al segundo s0 y sigue desde ahí. Con
// prefers-reduced-motion se queda quieto en s0 (al inicio, en total).
export function useReloj(total, retraso = 300) {
    const [s, setS] = useState(reducida() ? total : 0);
    const [desde, setDesde] = useState({ s0: 0, n: 0 });
    const raf = useRef(0);
    useEffect(() => {
        if (reducida()) { setS(desde.n ? desde.s0 : total); return undefined; }
        let t0 = null;
        const espera = desde.n ? 0 : retraso;
        setS(desde.s0);
        const paso = (t) => {
            if (t0 === null) t0 = t;
            const x = Math.min(total, desde.s0 + Math.max(0, t - t0 - espera) / 1000);
            setS(x);
            if (x < total) raf.current = requestAnimationFrame(paso);
        };
        raf.current = requestAnimationFrame(paso);
        return () => cancelAnimationFrame(raf.current);
    }, [total, retraso, desde]);
    const ir = useCallback((s0) => setDesde(d => ({ s0, n: d.n + 1 })), []);
    return [s, ir];
}

// Suavizados y tramos: `tramo(p, a, b)` reescala p del intervalo [a, b] a [0, 1] (para encadenar fases).
export const suave = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const tramo = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
export const lerp = (a, b, x) => a + (b - a) * x;
