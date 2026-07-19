# avance1_doc — Presentación (doctorado)

Presentación de avances/defensa del doctorado sobre **control óptimo de la
contaminación en acuíferos profundos** (flujo + transporte, RBF-FD, MRMT, método
adjunto). App React (Create React App, React 19) con fórmulas en KaTeX.

Deploy en vivo: <https://alobainalao.github.io/avance1_doc>

## Arranque

```bash
npm install                      # primera vez
BROWSER=none PORT=3005 npm start # → http://localhost:3005/avance1_doc
```

La ruta `/avance1_doc` es necesaria (coincide con `homepage` para GitHub Pages).

## Estructura

- `src/slideConfig.js` — registro central de slides: `{ id, title, component, duration, section, videoMetodo }`. Aquí se ordena la presentación y se fija la duración (segundos) de cada slide para cronometrar la charla.
- `src/slides-v2/SlideNN.jsx` — una diapositiva por archivo (arquitectura **V2**).
- `src/layouts-v2/` — layouts reutilizables (`ScientificLayout`, `TwoColumnLayout`, `HeroLayout`, `Block`, `Cols`, `EqCard`, `Fig`, `Cite`).
- `SlideShowV2.jsx` — motor: navegación (teclado/swipe), fullscreen, timing, progreso.
- `VideoPlayer.jsx` — overlay de video de simulaciones (se abre con Tab en slides con `videoMetodo`).

Secciones del arco: Portada → Precedente → Objetivos → MRMT → Optimización → Estado Adjunto.

## Arquitectura V2 — regla importante

El slideshow original (`SlideShow.jsx`, `Controls.jsx`, `Portada.jsx`, etc.) es
**estable y no debe modificarse destructivamente**. Toda evolución va en `slides-v2/`
y `layouts-v2/`. Debe preservarse: navegación teclado/swipe, fullscreen, timing,
indicadores de progreso, temas claro/oscuro, overlays de video, animaciones y responsive.

## Scripts

- `npm start` — desarrollo.
- `npm run build` — build de producción.
- `npm run deploy` — build + publicar a GitHub Pages (`gh-pages`).
- `npm test` — tests.

## Añadir una slide

1. Crear `src/slides-v2/SlideNN.jsx` reusando un layout de `layouts-v2/`.
2. Importarla y registrarla en `src/slideConfig.js` (posición, `section`, `duration`).
3. Verificar con `npm start`.
