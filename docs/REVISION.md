# Revisión

## 1. El autor contra el revisor

**Commit:** `b1a9221` · `feat: pattern task, S2 run with CLAUDE.md`. El revisor lo vio con `git show b1a9221 -- . ':(exclude)docs'`, sin leer nada de `docs/`.

**Enunciado:** "Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

**Quién es quién.** El autor es el agente que hizo la tarea en la S2; su lista está en la celda S2 de `docs/MEDICIONES.md`. El revisor es un subagente general-purpose nuevo, sin el contexto de esta sesión. Cada uno dijo lo siguiente; aquí no se decide quién tiene razón.

### Las dos listas, lado a lado

| Tema | Autor (S2): 11, 3 con ⚠️ | Revisor: 11, 5 con ⚠️ |
|---|---|---|
| URL `?pagina=` y página 1 sin escribir | (1) | ⚠️ (1) `?pagina=N`; (9) página 1 con URL limpia, helpers `first()` y `catalogHref()` |
| Página fuera de rango o inválida | (2) a la última / a la primera | ⚠️ (3) corrección silenciosa, sin 404 ni redirección |
| Cambio de categoría | (3) vuelve a la página 1 y la paginación conserva la categoría | ⚠️ (2) vuelve a la página 1; además `URLSearchParams` en vez de `encodeURIComponent` |
| Paginación oculta con una sola página | (4) | ⚠️ (4), junto con el punto siguiente |
| Enlaces numerados, sin Anterior/Siguiente | (5) estilo de los chips | ⚠️ (4) solo números, no escala con muchas páginas |
| Consultas movidas a `lib/catalog.ts` | ⚠️ (6) | (7) refactor, `getCategories()` y `CatalogPage` |
| `PRODUCTS_PER_PAGE` en `lib/constants/` | ⚠️ (7) | (8) |
| `COUNT` y `LIMIT`/`OFFSET` | (8) | ⚠️ (5) `OFFSET` sobre un orden mutable; (6) `COUNT(*)` extra |
| `aria-current` y `aria-label` | (9) | (10) también `<nav>` y la clase `.pagination` fuera del `@media` |
| `.claude/launch.json` en la carpeta del curso | ⚠️ (10), fuera del diff | no aparece |
| Verifica sobre el servidor de `:3000` | (11), fuera del diff | no aparece |
| Sin pruebas para la paginación | no aparece | (11), que él llama omisión |

### El conteo

El cruce es por tema. Los dos agrupan distinto: el revisor junta ocultar la barra y los enlaces numerados en un ítem, y parte `COUNT` y `OFFSET` en dos.

- **Coinciden:** 9 de las 11 decisiones del autor.
- **Solo el autor:** 2, `launch.json` y verificar sobre el `:3000`. Las dos quedan fuera del diff de `b1a9221`.
- **Solo el revisor:** 1 ítem completo, la falta de pruebas. Hay además detalles dentro de ítems que sí coinciden: `URLSearchParams`, los helpers, la inestabilidad de `OFFSET` y la ubicación de `.pagination`.

**Con ⚠️:**

- **Coinciden:** 0.
- **Solo el autor:** 3, `lib/catalog.ts`, `lib/constants/` y `launch.json`. El revisor vio las dos primeras, pero sin ⚠️.
- **Solo el revisor:** 5, que son temas que el autor listó sin ⚠️.

### Contexto y archivo del subagente

- **`/context` antes de delegar:** 49,9 mil.
- **`/context` cuando volvió el resultado:** 69,9 mil, es decir, 20 mil más.
- **Archivo del subagente:** `agent-a8700f266286e59e1.jsonl`, 392,000 bytes (~383 KiB), en `f3025e99-20c2-4a8a-aae2-13adc89bd7ea/subagents/`. No se abrió. Al lado hay `agent-a8700f266286e59e1.meta.json` (299 bytes) y `agent-a8700f266286e59e1.prefix.json` (5,046 bytes).
- **Cómo se obtuvo el tamaño:** el servidor `conversaciones` no lista `subagents/`, así que se midió con `ls -l`.

## 2. Primera auditoría

**Fecha:** 2026-11-19 · **Módulo:** `app/page.tsx` · **Encargo:** "Audita app/page. Usa tu rúbrica."

## Informe del Tech Lead
Alcance: /home/enriquearias/datapath-claude-code-for-developers/curso-ed5/mercado-lite/app/page.tsx. Leí también lo que consume (lib/catalog.ts, lib/constants/catalog.ts, lib/db.ts por formatPEN) y package.json. R4, R5 y R6 no aplican a esta página: no tiene acciones, redirecciones ni sesión.

### Crítico
ninguno

### Importante
- /home/enriquearias/datapath-claude-code-for-developers/curso-ed5/mercado-lite/package.json:5 · R3 · No hay archivos *.test.* ni *.spec.* propios (solo aparecen los de node_modules) y la sección scripts solo tiene dev, build y start. La lógica de paginación y filtrado de getCatalogPage no tiene pruebas.

### Sugerencia
- /home/enriquearias/datapath-claude-code-for-developers/curso-ed5/mercado-lite/app/page.tsx:2 · R1 · La página cumple R1: no consulta la base y recibe todo de getCatalogPage (lib/catalog.ts). Pero importa formatPEN desde lib/db, el módulo de conexión, así que el formato de moneda queda mezclado con el acceso a datos. Además, el acceso a datos no es único: lib/catalog.ts convive con consultas directas en otras páginas fuera de este alcance (carrito, pedido, producto, layout).

### Nota
10 − (3 × 0) − (1 × 1) − (0,25 × 1) = 8,75

## 3. Después

**Fecha:** 2026-11-19 · **Módulo:** `app/page.tsx` · **Encargo:** "Audita app/page. Usa tu rúbrica." (el mismo de la sección 2).

**Corregido (1 de 3 posibles):** `formatPEN` pasó de `lib/db.ts` a `lib/format.ts`; `app/page.tsx` lo importa de ahí y `lib/db.ts` lo re-exporta para no tocar las otras páginas. `npm run build` pasó y la página se ve igual. La segunda auditoría la hizo el Tech Lead, no la conversación que corrigió.

### Informe nuevo del Tech Lead

## Informe del Tech Lead
Alcance: app/page.tsx (catálogo), junto con lo que consume: lib/catalog.ts, lib/constants/catalog.ts, lib/format.ts. R4, R5 y R6 no aplican a esta página, que no tiene acciones ni administración, ni redirecciones, ni sesión. No revisé el resto de la aplicación.

### Crítico
ninguno

### Importante
- package.json:5-9 · R3 · No hay archivos de prueba propios (`*.test.*` y `*.spec.*` solo aparecen en node_modules) ni script `test`. La lógica del catálogo (filtro por categoría, ajuste de página fuera de rango) en lib/catalog.ts:17 no tiene ninguna prueba.

### Sugerencia
ninguno

### Nota
10 − (3 × 0) − (1 × 1) − (0,25 × 0) = 9

Resultado de las demás preguntas sobre app/page.tsx:
- R1 cumple. La página no llama a `getDb()` ni a `.prepare(`. Obtiene los datos de `getCatalogPage` en lib/catalog.ts, que es el único sitio con las consultas SQL de este flujo.
- R2 cumple. `PRODUCTS_PER_PAGE` y `LOW_STOCK_THRESHOLD` están en lib/constants/catalog.ts. El umbral de stock bajo se usa desde esa constante también en app/producto/[id]/page.tsx. El formato de moneda está en lib/format.ts, que es el único sitio con `es-PE` y `PEN`.

### Hallazgo por hallazgo

| Hallazgo (sección 2) | Defecto | Antes | Después |
|---|---|---|---|
| `app/page.tsx:2` · R1 · `formatPEN` importado desde `lib/db` (formato de moneda mezclado con acceso a datos) | 1 | Sugerencia | **Corregido.** Ya no aparece; R2 cita `lib/format.ts` como único sitio de `es-PE`/`PEN`. |
| `package.json:5` · R3 · sin pruebas | 3 | Importante | **Sigue igual**, a propósito: es de la S6. |
| Misma sugerencia, segunda mitad: otras páginas (layout, carrito, pedido, producto) consultan la base | 1 | Sugerencia | **No corregido.** Ya no se menciona, pero porque el Tech Lead acotó el alcance a `app/page.tsx`, no porque se arreglara: `grep -rlE "getDb\(\)\|\.prepare\(" app components --include="*.tsx"` sigue dando 4 archivos (`layout`, `producto`, `pedido`, `carrito`). Queda para la S5/S2 según el inventario. |

### Nota

| | Fórmula | Nota |
|---|---|---|
| Antes (sección 2) | 10 − (3 × 0) − (1 × 1) − (0,25 × 1) | **8,75** |
| Después | 10 − (3 × 0) − (1 × 1) − (0,25 × 0) | **9** |

La mejora de 0,25 viene solo de la sugerencia corregida. La importante (pruebas) sigue restando 1.

### Inventario de `docs/00-ANTES.md` contra las dos auditorías

"Encontrado" significa que apareció en el informe sin que el encargo dijera dónde mirar; el encargo solo nombraba el módulo.

| # · Defecto del inventario | Auditoría 1 | Auditoría 2 | Observación |
|---|---|---|---|
| 1 · Componentes que consultan la base | Sí, parcial: `formatPEN` en `lib/db` y mención de layout, carrito, pedido y producto | No como hallazgo; R1 cumple para `app/page.tsx` | Con alcance de una página, solo ve la suya. Los 4 archivos siguen ahí. |
| 2 · Valores ajustables incrustados | No | No (R2 cumple) | En `app/page.tsx` ya estaban en `lib/constants/` desde la S2; el hardcode del `5` de producto ya no existe. Nada que encontrar en el módulo. |
| 3 · Cero pruebas | Sí | Sí | Lo encontró dos veces con R3. |
| 4 · Seguridad abierta (`/admin`, `createProductAction`) | No | No | R4–R6 se declaran "no aplican" porque la página no tiene acciones ni sesión. |
| 5 · Redirección abierta en el login | No | No | Misma causa: fuera del módulo auditado. |
| 6 · Sesiones sin vencimiento en el servidor | No | No | Misma causa. |

**Lección sobre la rúbrica.** El Tech Lead encontró lo que está dentro del módulo que se le da (1 parcial, 3). Lo que no vio (4, 5, 6) no es un fallo de las preguntas R4–R6: viven en `app/actions.ts`, `app/admin/page.tsx` y `lib/auth.ts`, fuera de `app/page.tsx`. Para verlos hay que auditar esos módulos, o añadir a la rúbrica una pregunta que mande seguir las dependencias de seguridad más allá de la página. El defecto 2 no se vio porque ya no estaba en este módulo.
