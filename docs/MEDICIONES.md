# Mediciones — la tarea patrón

La misma tarea, tres veces: hoy sin reglas, en la sesión 2 con `CLAUDE.md` y en la sesión 3 con la configuración elegida. El enunciado es el de `curso-ed5/TAREA_PATRON.md` §1, sin cambiar una palabra.

| Corrida | Resultado | Turnos | Estado del filtro | Costo | Duración | Decisiones no pedidas |
|---|---|---|---|---|---|---|
| S1 · sin reglas | a la primera | 0 | En la URL (`?pagina=N`, junto a `?categoria=` si hay una), leída en `app/page.tsx` | entrada 1,045 · caché esc 2.38M · caché lec 41.5M · salida 333K · US$ 26.87 (fila de `tokens.py`) | 1 minuto | 7 — contadas sobre el diff del commit `e4bbfa2`: (1) una página fuera de rango se lleva a la más cercana; (2) la página 1 no se escribe en la URL; (3) cambiar de categoría vuelve a la página 1; (4) la paginación se oculta si hay una sola página; (5) botones Anterior/Siguiente, con estilo desactivado; (6) consultas reescritas con `COUNT` y `LIMIT`/`OFFSET`; (7) atributos `aria-*` y `rel="prev"`/`"next"` |
| S2 · con `CLAUDE.md` | | | | | | |
| S3 · configuración elegida | | | | | | |

Enunciado usado (enunciado 2 de `curso-ed5/TAREA_PATRON.md`, porque la app ya filtraba por categoría):

> "Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

**Nota.** Mi línea base se midió en la sesión 2 porque la de la sesión 1 no quedó commiteada. La validación de las tres corridas se hace sobre esta tarea.

## Corrida de la sesión 1 (2026-11-07), anterior a esta línea base

**La fila que ocupaba en la tabla (enunciado 1, filtro por categoría).** Resultado: ✅ sin intervención. Turnos: 0. Estado: en la URL (`/?categoria=Audio`), leída en `app/page.tsx`. Costo: USD 0 (plan Pro); 61 490 tokens del agente; % del plan: sin medir. Recuperado el 2026-11-12 del registro del subagente que corrió la tarea (`7d7ab2ff…/subagents/agent-a729d79d….jsonl`), contando cada respuesta una vez: entrada 16 · caché escrita 60 709 · caché leída 378 527 · salida 3 156 → ~USD 0,44 (tarifas de `tokens.py`, Opus 5.5). Duración: 1 min 19 s (18:20:31 → 18:21:50).

**Cómo se corrió.** Un agente nuevo, sin el contexto de esta sesión, recibió solo dos cosas: la ruta del proyecto (`curso-ed5/mercado-lite`) y el enunciado literal. No leyó la spec del curso. Trabajó 38 s, con 8 usos de herramientas, y no hizo ninguna pregunta.

**Verificación de `TAREA_PATRON.md` §2**, recorrida en el navegador sin abrir archivos:

| Paso | Resultado |
|---|---|
| 1 · La app arranca sin errores en la consola | ✅ Consola sin errores. El servidor (`localhost:3100`) ya estaba corriendo y recargó el cambio solo; no se reinició. |
| 2 · Elegir una categoría muestra solo esos productos | ✅ "Audio" → 2 productos, los dos de Audio. |
| 3 · Recargar (F5): el filtro sigue | ✅ Sigue en "Audio", con 2 productos. |
| 4 · Abrir la URL en otra pestaña: el mismo listado | ✅ `/?categoria=Audio` en una pestaña nueva → el mismo listado filtrado. |
| 5 · Volver a "Todas" | ✅ Reaparecen los 12 productos. |

**Dónde quedó el estado del filtro.** En la URL. La barra de direcciones muestra `?categoria=Audio`, y el navegador no guardó nada (`localStorage` y `sessionStorage` vacíos). En el código vive en `app/page.tsx`, que lee `searchParams.categoria`.

**Qué cambió.** Dos archivos:

* `app/page.tsx`: lee la categoría de la URL, pide la lista de categorías a la base y filtra el listado. Los botones son enlaces normales.
* `app/globals.css`: estilos de los botones de categoría.

**Lo que esto dice del "antes".** `TAREA_PATRON.md` predice que, sin reglas, el agente usa `useState` y el filtro se pierde al recargar. No pasó: lo puso en la URL a la primera. Las consultas a la base siguen escritas dentro de la página (`getDb().prepare(...)` en `app/page.tsx`), así que el defecto 1 del inventario creció: ahora hay tres consultas en ese archivo en lugar de una.

**Avisos sobre la medición.**

* El costo en dinero es 0 porque uso el plan Pro. No medí cuánto del uso del plan consumió esta corrida.
* La duración va del envío del enunciado al final del paso 5. Lo verificó un agente en el navegador, no una persona; a mano tardaría más.
* El modelo fue el de esta sesión (Opus 5.5) en modo `auto`.
