# Costos

## Hipótesis antes de medir

**2026-11-14**

1. Creo que mi número lo explica la caché: casi toda mi entrada fue relectura, así que cambiar de modelo o de effort moverá mi factura mucho menos que romper la caché.
2. Creo que bajar un nivel de effort (B) me ahorra menos que pasar a un modelo más barato (C), porque casi todo mi consumo es relectura de caché y el effort solo toca la salida.
3. Creo que C cuesta cerca de la mitad que A, lo mismo que separa las tarifas de Sonnet y Opus: la caché no cambia la proporción.

> La pregunta de la spec "¿el effort paga igual con los dos modelos?" no se puede responder con tres corridas (A/B/C), así que la hipótesis 2 se reformuló para que la contesten B y C contra A.

## Corridas de la Fase 3.2

Enunciado idéntico en todas: "Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

| Corrida | Modelo | Effort | Resultado | Turnos | Decisiones no pedidas | Costo | Duración |
|---|---|---|---|---|---|---|---|
| C | sonnet-5-5 | medium | a la primera (sin correcciones; F5 y barra de direcciones sin comprobar en navegador, solo `curl` contra `:3000`) | 0 | 9, 4 con ⚠️: (1) página fuera de rango → la última, valor inválido → la primera; (2) la página 1 no se escribe en la URL; (3) cambiar de categoría vuelve a la página 1 y la paginación conserva la categoría; (4) la paginación se oculta si hay una sola página; (5) enlaces numerados con estilo de chip, sin Anterior/Siguiente, con `aria-current` y `aria-label`; (6) ⚠️ consultas del catálogo movidas a `lib/catalog.ts` (lo pide `CLAUDE.md`, pero no el enunciado); (7) ⚠️ `lib/constants/catalog.ts` con `PRODUCTS_PER_PAGE`; (8) consultas con `COUNT` y `LIMIT`/`OFFSET`; (9) ⚠️ `git stash -u` del árbol sucio previo, con tu OK | entrada 30 · caché esc 61,238 · caché lec 1,311,198 · salida 6,935 · US$ 0.35 (bloque 1 de `249010a7`, `tokens.py` corregido, tarifas del 2026-11-09) | 2 minutos |

Filas A y B: sin medir en este chat (las corridas de A y B se registran en sus propias conversaciones).
