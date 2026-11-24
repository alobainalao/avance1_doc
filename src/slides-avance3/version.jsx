import React, { createContext, useContext } from 'react';

// Dos versiones del avance 3 con las mismas láminas (slideConfig.avance3.js): la completa (#/avance3-completa), con
// toda la explicación, y la pública (#/avance3), para exponer: menos texto y letra más grande (avance3.css,
// .deck-a3-publica). Cada lámina marca su texto con clases: `a3-completa` solo en la completa, `a3-publica` solo en la
// pública (la frase corta que reemplaza a un párrafo). El contexto queda para lo que no se resuelve con CSS.
export const VersionContext = createContext('completa');
export const usePublica = () => useContext(VersionContext) === 'publica';

// Componente de lámina envuelto en una versión; conserva las propiedades estáticas que lee la numeración de ecuaciones.
export function enVersion(Componente, version) {
    if (!Componente) return Componente;
    const Envuelto = (props) => (
        <VersionContext.Provider value={version}><Componente {...props} /></VersionContext.Provider>
    );
    Envuelto.ecuaciones = Componente.ecuaciones;
    return Envuelto;
}
