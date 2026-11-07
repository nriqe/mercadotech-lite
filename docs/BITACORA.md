# Bitácora — MercadoTech Lite

Una entrada por sesión. Los números salen de `docs/00-ANTES.md` y `docs/MEDICIONES.md`; aquí solo se resumen.

---

## Sesión 1 — Tu app en una sesión (2026-11-07)

### Qué se construyó

MercadoTech Lite: una tienda de tecnología en Next.js 16 + TypeScript con SQLite (`better-sqlite3`) dentro del proyecto (`data/tienda.db`, fuera de git).

* Catálogo con 12 productos de ejemplo en 7 categorías, precios en soles.
* Detalle de producto, carrito, checkout simulado: registra el pedido y descuenta stock.
* Registro, inicio y cierre de sesión.
* Página `/admin` para cargar productos.
* Filtro por categoría (tarea patrón, Fase 1.4), con el estado en la URL: `/?categoria=Audio`.

Generada con el encargo de `ENCARGO_LITE.md` §1 tal cual, en un turno, en modo `auto`. 25 archivos versionados, 4 commits (uno por fase).

### Qué decidió el agente sin que se lo pidiera

| Decisión | Dónde | Efecto |
|---|---|---|
| Contraseñas con `scrypt` + sal aleatoria, comparación con `timingSafeEqual` | `lib/auth.ts` | Evitó la forma "contraseñas sin cifrar" del defecto 4. |
| Sesión como token aleatorio de 32 bytes en la tabla `sessions`, cookie `httpOnly` + `sameSite: lax`, 7 días | `lib/auth.ts` | Evitó la forma "sesión decidida en el navegador" del defecto 4. |
| La sesión no vence en el servidor; solo se borra al salir | `lib/auth.ts:35` | Defecto extra 6. |
| `next` del login aceptado si empieza por `/` | `app/actions.ts:46` | Defecto extra 5 (redirección abierta con `//otro-dominio`). |
| `/admin` solo exige sesión, no rol; registro libre | `app/admin/page.tsx`, `app/actions.ts` | Defecto 4: cualquiera con cuenta carga productos. |
| SQL escrito dentro de las páginas, sin capa de datos | 5 archivos `.tsx` | Defecto 1. |
| Umbral de stock bajo (`5`), mínimo de contraseña (`6`), duración de cookie, URL de imágenes sueltos en el código | ver inventario | Defecto 2. |
| Imágenes de `placehold.co` | `lib/db.ts`, `app/actions.ts:159` | La app depende de un servicio externo para las imágenes. |
| Modo WAL en SQLite, `better-sqlite3` como paquete externo del servidor | `lib/db.ts`, `next.config.ts` | Funciona; crea `tienda.db-wal` y `tienda.db-shm`. |
| Filtro por categoría en la URL, no en `useState` | `app/page.tsx` | Contradice la predicción de `TAREA_PATRON.md`: el filtro sobrevive a F5. |
| `AGENTS.md` versionado | raíz | Lo escribe `next dev`, no el agente. Se subió tal cual. |

### Qué costó

| Medida | Valor |
|---|---|
| Dinero | USD 0 (plan Pro, sin saldo de API ni uso extra) |
| Generación (1.2): uso del plan | ventana de 5 h: 4 % → 9 %; semanal: 1 % → 2 % |
| Generación (1.2): contexto | ~117 000 tokens de 1 000 000 |
| Generación (1.2): duración | ~6 min |
| Generación (1.2): turnos / preguntas / aprobaciones | 1 / 0 / 0 |
| Tarea patrón (1.4) | 0 turnos extra, 61 490 tokens del agente, 1 min 19 s; % del plan sin medir |
| Pruebas escritas | 0 |

### Qué salió mal

* **El Prompt 1.2 pegado tal cual no generó nada.** Funcionó al escribir "Ejecuta la Fase 1.2 de Ed5_sesion1.md". La causa no quedó registrada.
* **Una conversación anterior escribió una FACTURA sin haber generado la app.** Se detectó y se reemplazó; queda la nota en `00-ANTES.md`.
* **Los greps de `ENCARGO_LITE.md` §3 para los defectos 1 y 2 buscan funciones de Supabase.** Con SQLite salen vacíos aunque el defecto exista. Se usaron greps equivalentes; hay que avisar al docente.
* **La app tuvo un ajuste visual antes de entregar** (títulos de tarjeta enormes en el celular). No fue un fallo de arranque.
* **La tarea patrón la verificó un agente en el navegador, no una persona.** El tiempo medido es más corto que el de una verificación manual.
* **No medí el % del plan que consumió la tarea patrón.**
* **Los 4 commits se hicieron juntos a las 18:24**, no al cerrar cada fase. Las horas del historial no sirven como línea de tiempo.
* **El defecto 1 creció con la tarea patrón:** `app/page.tsx` pasó de una consulta a tres.
* Inventario completo, sin corregir: 4 defectos del encargo presentes (el 4 en una de sus tres formas) + 2 extra. Detalle en `00-ANTES.md`.

### Pendiente para la sesión 2

1. Escribir el `CLAUDE.md` del proyecto (hoy no se escribió, a propósito).
2. Correr la fila "S2 · con `CLAUDE.md`" de `docs/MEDICIONES.md` en una conversación nueva, con el enunciado literal de `TAREA_PATRON.md` §1.
3. Medir el % del plan en la corrida S2, para no repetir el "sin medir".
4. Avisar al docente de los greps de Supabase en `ENCARGO_LITE.md` §3.
5. Decidir qué hacer con `AGENTS.md`: convive con el futuro `CLAUDE.md` y `next dev` lo regenera.
6. Los defectos siguen abiertos: 1 y 2 (S2 y S5), 3 (S6), 4 (S6 y S7), 5 (S5/S7), 6 (S7).

Remoto: `git@github.com:nriqe/mercadotech-lite.git`.
