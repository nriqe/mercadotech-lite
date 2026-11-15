# Verificación del terreno — Sesión 3

Fecha: 2026-11-14 · Plan de la Fase 3.2: **tres corridas A/B/C** (decisión del alumno, no las cinco de la spec v1.2).

## Versiones

- claude: 2.1.319 (Claude Code) — mínimo 2.1.283 ✅
- node: v22.21.1
- npm: 10.9.4
- git: 2.56.0
- python: 3.14.10

## Commit en el que arranqué hoy

`a288b34` docs: close Sesión 2 with the contract and the second measurement. Árbol limpio salvo `doc_sesions/sesion3/` sin seguir (la carpeta de la sesión).

## Los cuatro datos de la FACTURA (citados de `docs/00-ANTES.md`)

- Costo: "USD 0" (Plan Pro) · equivalente: "~USD 1,53"
- Duración: "~6 min (17:42 → 17:48)" · recuperada: "7 min 21 s (17:40:58 → 17:48:19)"
- Tokens: "entrada 66 · caché escrita 67 342 · caché leída 3 126 002 · salida 28 226"
- Caché: "leídos de caché: US$ 5,94; como entrada nueva habrían costado US$ 118,83; 95,0 % de la entrada entró por caché (29 706 568 ÷ 31 269 323)"

## Filas de `docs/MEDICIONES.md`

S1 llena · S2 llena · S3 vacía.

## ¿Dicen de qué bloque salieron?

- Consumo de la FACTURA: **no**. Deduplicado a mano y filtrado por fecha, no por bloque ni con el `tokens.py` corregido; los dos números de la caché dicen ellos mismos que "lleva el doble conteo". → **volver a medir**.
- Fila S1: **no**. "US$ 26.87 (fila de `tokens.py`)": fila de conversación, script viejo (41.5M leídos de caché delata el inflado). → **volver a medir**.
- Fila S2: **no**. "US$ 1.89 (fila de `tokens.py`)", sin bloque ni versión del script. → **volver a medir**.

## EL ENUNCIADO DE LA TAREA PATRÓN

"Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

(Enunciado 2 de `TAREA_PATRON.md`, el que está al pie de la tabla.)

## El commit de la tarea patrón

`b1a9221` feat: pattern task, S2 run with CLAUDE.md — `app/globals.css`, `app/page.tsx`, `lib/catalog.ts`, `lib/constants/catalog.ts`. Ningún commit posterior toca `app/`, `lib/` ni `components/`: se revierte limpio.

`CLAUDE.md` (31 líneas) está commiteado en `a288b34`, no en `b1a9221`: revertir la tarea no se lo lleva.

## Veredicto

Hay que volver a medir con el Paso 2 de la ruta, y va antes de todo lo demás.
