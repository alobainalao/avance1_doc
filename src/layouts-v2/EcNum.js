import { createContext, useContext } from 'react';

// Numeración dinámica de ecuaciones. Cada slide declara en orden las ecuaciones que numera
// (Componente.ecuaciones = ['id', ...]); numerarEcuaciones() recorre las slides visibles y asigna 1, 2, …
// La presentación pasa el mapa id → número por contexto (SlideShowV2), así que ocultar o mover una slide
// renumera solo las siguientes.
export const EcNumContext = createContext({});

export function numerarEcuaciones(slides) {
    const mapa = {};
    let n = 0;
    slides.forEach(sl => (sl.component?.ecuaciones || []).forEach(id => {
        if (!(id in mapa)) mapa[id] = ++n;
    }));
    return mapa;
}

export const useNumEc = (id) => useContext(EcNumContext)[id];
