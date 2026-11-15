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
| A | opus-5-5 | medium | a la primera; los 5 pasos de `TAREA_PATRON.md` §2 recorridos en el navegador (el agente reportó 21:03:08 → 21:04:21) | 0 | 12, 4 con ⚠️ (lista del agente en el chat, no recontada sobre el diff de `19689e5`): (1) `?pagina=N`, la 1 sin parámetro; (2) ⚠️ cambiar de categoría vuelve a la página 1 y la paginación conserva la categoría; (3) ⚠️ página fuera de rango o no numérica → la última o la primera, sin 404; (4) ⚠️ enlaces «← Anterior», números y «Siguiente →»; (5) con una sola página no se muestran; (6) «Anterior» y «Siguiente» desactivados en los extremos; (7) `PRODUCTS_PER_PAGE` en `lib/constants/catalog.ts`; (8) ⚠️ consultas movidas a `lib/catalog.ts` (`getCatalogPage`); (9) `COUNT` y `LIMIT`/`OFFSET`; (10) orden `id DESC`; (11) clases `.pagination` y `.chip-disabled`; (12) nombró el commit «corrida A» por el revert anterior | entrada 52 · caché esc 44,695 · caché lec 2,206,421 · salida 10,136 · US$ 0.87 (bloque 1 de `177b3c15`, `tokens.py` corregido, tarifas del 2026-11-09). **El bloque incluye** la enumeración de decisiones, el commit y la medición, pedidos en el mismo mensaje: la cifra incluye trabajo que B y C no hicieron. El propio agente reportó US$ 0.78 antes de seguir la conversación | 2 minutos |
| B | opus-5-5 | low | funciona según su informe; comprobó en el navegador `?pagina=2` y F5; no recorrió los 5 pasos y no hizo commit | 0 | sin medir (no las enumeró) | entrada 20 · caché esc 19,612 · caché lec 650,041 · salida 3,586 · US$ 0.30 (bloque 1 de `43766c09`, `tokens.py` corregido, tarifas del 2026-11-09) | 1 minuto |
| C | sonnet-5-5 | medium | a la primera (sin correcciones; F5 y barra de direcciones sin comprobar en navegador, solo `curl` contra `:3000`) | 0 | 9, 4 con ⚠️: (1) página fuera de rango → la última, valor inválido → la primera; (2) la página 1 no se escribe en la URL; (3) cambiar de categoría vuelve a la página 1 y la paginación conserva la categoría; (4) la paginación se oculta si hay una sola página; (5) enlaces numerados con estilo de chip, sin Anterior/Siguiente, con `aria-current` y `aria-label`; (6) ⚠️ consultas del catálogo movidas a `lib/catalog.ts` (lo pide `CLAUDE.md`, pero no el enunciado); (7) ⚠️ `lib/constants/catalog.ts` con `PRODUCTS_PER_PAGE`; (8) consultas con `COUNT` y `LIMIT`/`OFFSET`; (9) ⚠️ `git stash -u` del árbol sucio previo, con tu OK | entrada 30 · caché esc 61,238 · caché lec 1,311,198 · salida 6,935 · US$ 0.35 (bloque 1 de `249010a7`, `tokens.py` corregido, tarifas del 2026-11-09) | 2 minutos |

## Precios de lista usados

`tokens.py`, tarifas por millón de tokens consultadas el 2026-11-09:

| Modelo | entrada | caché escrita | caché leída | salida |
|---|---|---|---|---|
| claude-opus-5-5 | US$ 4.00 | US$ 5.00 | US$ 0.20 | US$ 20.00 |
| claude-sonnet-5-5 | US$ 2.00 | US$ 2.50 | US$ 0.10 | US$ 10.00 |

Las cifras de C vienen de la fila anterior de este archivo; hoy no las reverifiqué contra el bloque (el script no lo desglosa por su cuenta). Las de A y B salen de `tokens.py --patron` del 2026-11-14.

## Regla

Para tareas con varios criterios que tengo que poder comprobar (paginación, estado en la URL, recarga), uso opus-5-5 · medium, porque pasó los 5 pasos a la primera aunque costó US$ 0.87 y tardó 2 min. Para cambios chicos que reviso yo mismo, uso opus-5-5 · low (US$ 0.30, 1 min) y miro el resultado a mano.
