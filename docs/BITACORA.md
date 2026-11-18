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

### Decisiones que tomé sin que me las pidieran

*Recuperada el 2026-11-12, en la sesión 2, de la conversación original de la Fase 1.2, no en el momento.* Es la lista que el agente escribió en el chat al cerrar la generación, con las mismas palabras. No se rehízo leyendo el código. La tabla de arriba se armó después, en la 1.3 y el cierre, revisando el código.

1. Las páginas leen la base de datos directamente, sin una capa de por medio.
2. No hay archivo de constantes: los textos de moneda, los límites de stock y similares están escritos dentro del código.
3. No hay pruebas ni script `test`.
4. Agregué dos tablas que el encargo no menciona: `sessions` y `order_items`.
5. Las contraseñas se guardan cifradas con `scrypt`, y la sesión vive en una cookie que el navegador no puede editar.
6. Para cargar productos solo hay que haber iniciado sesión. No hay rol de administrador, así que cualquier usuario registrado puede crear productos.

**Total: 6 decisiones.**

**⚠️ Las que habría querido aprobar antes:**

| # | ⚠️ Decisión | Por qué |
|---|---|---|
| 1 | ⚠️ Páginas que consultan la base directamente | Fija la arquitectura de todo el proyecto, y cambiarla después obliga a tocar cada página. |
| 4 | ⚠️ Dos tablas fuera de las 4 del alcance | Cambia el modelo de datos acordado, y todo lo que venga después se apoya en él. |
| 5 | ⚠️ `scrypt` y sesión en cookie con tabla propia | Elige el mecanismo de autenticación, que es caro de migrar cuando ya hay usuarios. |
| 6 | ⚠️ Cualquier usuario registrado carga productos | Abre una escritura privilegiada a cualquiera que cree una cuenta: es una decisión de seguridad del dueño del negocio. |

Las decisiones 2 y 3 no las habría querido aprobar: son omisiones que se corrigen sin romper nada (2) o que el encargo dejó fuera a propósito (3).

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

---

## Sesión 2 — Memoria y contexto: `CLAUDE.md` como contrato (2026-11-13)

### Qué reglas escribí y a qué fila del inventario apunta cada una

`CLAUDE.md` en la raíz, 31 líneas. Seis reglas, cada una con su comando de verificación:

| Regla del `CLAUDE.md` | Sección | Fila de `00-ANTES.md` |
|---|---|---|
| No hay pruebas ni script `test`; no decir que pasaron | Comandos | 3 · Cero pruebas |
| Los `.tsx` no consultan la base (`getDb()`, `.prepare(`) | Reglas de arquitectura | 1 · Componentes que consultan la base |
| Los valores ajustables viven en `lib/constants/` | Valores ajustables | 2 · Valores ajustables incrustados |
| `/admin` y `createProductAction` exigen administrador | Seguridad | 4 · Seguridad abierta (la forma que apareció) |
| El `next` del login solo acepta rutas internas | Seguridad | 5 · Redirección abierta (extra) |
| La sesión también vence en el servidor | Seguridad | 6 · Sesiones sin vencimiento (extra) |

No hay sección "estado de la interfaz": ningún defecto del inventario la pedía.

### La auditoría

Con el comando: `/doctor prompt-audit`.

* **1 hallazgo** del audit: `CLAUDE.md` decía `app/page.tsx:26` para el stock bajo, y ahí solo hay `return (`. El valor estaba en la línea 59.
* **1 regla falsa más**, que encontró la verificación (correr el comando de cada regla), no el audit: el grep de valores ajustables nunca podía salir limpio, porque `placehold\.co/600x450` también encontraba las URLs fijas de la semilla en `lib/db.ts`. Se cambió por `placehold\.co/600x450/[^?]*\?text=[$]\{`.
* **Acepté 2 de 2.** El audit dejó además tres notas sin propuesta de edición (los números de línea van a seguir envejeciendo; el bloque de `AGENTS.md` lo reescribe `next dev`; `CLAUDE.md` no importa `AGENTS.md`). No se aplicó ninguna.

### Fase 2.2: el caso de historial

El Prompt 0 lo clasificó como **caso D**. Al revisar el historial, el agente vio que en la práctica era **caso A**: el commit mezclado es `2cd75d8` (filtro por categoría de la sesión 1), pero la línea base se rehízo en la sesión 2 con la paginación, aislada en `e4bbfa2`.

Qué hubo que hacer:

* Revertir `e4bbfa2` con `git revert`. `2cd75d8` no se tocó: es otra tarea y revertirlo habría cambiado `docs/MEDICIONES.md`.
* El primer intento falló: el comando se lanzó desde la carpeta del curso, que no es un repositorio. Se repitió dentro de `curso-ed5/mercado-lite`, sin conflictos.
* `--amend` solo para cambiarle el mensaje al commit de revert. Queda `3cc9d48`; `e4bbfa2` sigue en el historial.
* `git diff 6bbd251 HEAD -- app/` → sin diferencias.
* `git status` no quedó vacío: `CLAUDE.md` seguía sin seguimiento. Se commitea al cerrar esta sesión.

### La fila S2 al lado de la S1

| | S1 · sin reglas | S2 · con `CLAUDE.md` |
|---|---|---|
| Resultado | a la primera | tras corregir |
| Turnos de corrección | 0 | 1 |
| Estado del filtro | En la URL, leído en `app/page.tsx` | En la URL, leído en `app/page.tsx`; la consulta en `lib/catalog.ts` |
| Costo (fila de `tokens.py`) | US$ 26.87 (caché leída 41.5M) | US$ 1.89 (caché leída 4,334,323) |
| Duración | 1 minuto | 7 minutos (el código solo: 1 min 9 s) |
| Decisiones no pedidas | 7 | 11, 3 con ⚠️ |
| Commit | `e4bbfa2` | `b1a9221` |

**El turno de corrección de S2.** El primer mensaje de la corrida no fue el enunciado: fue la frase de cabecera de `docs/MEDICIONES.md`. El agente preguntó qué corrida hacer y yo elegí "S2 con `CLAUDE.md`". Después corrió el enunciado 2 (paginación). Ese es el turno. La comparación de resultado y turnos mide eso, no el contrato.

**La duración de S2** incluye esa pregunta y la configuración del navegador. La de S1 no la tiene desglosada: sin medir.

**El costo** es la fila de `tokens.py` de cada conversación entera. Cuánto de cada una fue la tarea y cuánto el resto: sin medir.

### Qué cambió y qué no

* **Cambió:** dónde vive el código. En S2 las consultas del catálogo salieron de `app/page.tsx` a `lib/catalog.ts`, y el 6 por página es `PRODUCTS_PER_PAGE` en `lib/constants/catalog.ts`. Las dos cosas las pide el `CLAUDE.md` (filas 1 y 2). En S1, `app/page.tsx` tenía más consultas que antes.
* **Empató:** dónde quedó el estado del filtro. En las dos, en la URL (`?pagina=N`). El `CLAUDE.md` no dice nada sobre el estado de la interfaz: no tiene esa sección, porque el agente ya lo ponía en la URL sin reglas. Esa columna no mide el contrato.
* **No comparable:** resultado y turnos (S2 tuvo un turno por un primer mensaje equivocado, no por el código), costo y duración (cada uno es de la conversación entera).

### Verificación del `CLAUDE.md` al cerrar

Corrí el comando de cada regla después de la corrida S2. Ninguna regla se cumple todavía, y eso el archivo lo dice. Pero **tres afirmaciones de "hoy" quedaron falsas por la corrida S2**:

1. "Hoy no se cumple en 5 archivos": son 4. `app/page.tsx` ya no consulta la base.
2. "`lib/constants/`, que todavía no existe": existe, con `catalog.ts`.
3. "stock bajo `5` (app/page.tsx:59 …)": ahora está en `app/page.tsx:66`.

Las tres se corrigieron al cerrar, con mi aprobación. Son correcciones de hechos, no reglas nuevas: el comando de cada regla no cambió.

### Qué salió mal

* El primer mensaje de la corrida S2 no fue el enunciado. Costó un turno y ensucia la columna "Turnos".
* El agente de S2 llenó primero la fila como "a la primera", 0 turnos y 9 decisiones. La corregí yo: tras corregir, 1 turno, 11 decisiones.
* El revert de la 2.2 se lanzó primero fuera del repositorio.
* El `CLAUDE.md` pasó toda la sesión sin commitear: la guía pedía commitearlo en la 2.1, antes de probar `/init`.
* La corrida S2 creó `.claude/launch.json` en la carpeta del curso, fuera del repositorio. Sigue ahí.
* % del plan: sin medir, otra vez.

### Pendiente para la sesión 3

1. Al revertir `b1a9221`, las tres afirmaciones corregidas hoy vuelven a ser falsas (5 archivos, sin `lib/constants/`, línea 59). Correr las verificaciones después del revert.
2. Revertir `b1a9221` antes de la corrida S3, como se revirtió `e4bbfa2`.
3. Correr la fila S3 con el enunciado 2, pegando el enunciado como primer mensaje.
4. Medir el % del plan en la corrida.
5. Decidir si `CLAUDE.md` importa `AGENTS.md` (`@AGENTS.md`) y qué hacer con `.claude/launch.json`.
6. Avisar al docente de los greps de Supabase en `ENCARGO_LITE.md` §3 (sigue pendiente de la sesión 1).
7. Los defectos siguen abiertos: 1 y 2 en parte (lo que hizo S2 en el catálogo), 3, 4, 5 y 6 enteros. Material de las sesiones 5, 6 y 7.

---

## Sesión 3 — Costos medidos: modelo, effort y caché (2026-11-14)

Los números salen de `docs/COSTOS.md` y `docs/MEDICIONES.md`, medidos con el `tokens.py` corregido (tarifas del 2026-11-09).

### La hipótesis y si se cumplió

Escrita antes de medir, en `docs/COSTOS.md`:

1. **La caché explica mi número; cambiar de modelo o de effort mueve la factura mucho menos que romper la caché.** Primera mitad: se cumplió. La entrada que vino de caché fue 98.0 % en A, 97.1 % en B y 95.5 % en C. Segunda mitad: no se probó, porque ninguna corrida rompió la caché. Lo que sí se midió la contradice en parte: la factura pasó de US$ 0.87 (A) a US$ 0.30 (B) y US$ 0.35 (C), aunque A incluye trabajo extra (ver más abajo).
2. **Bajar el effort (B) ahorra menos que cambiar de modelo (C).** No se cumplió: B costó US$ 0.30 y C US$ 0.35. Son 5 centavos, sin trabajo igual en las tres corridas; no lo defendería como diferencia.
3. **C cuesta cerca de la mitad que A.** No se cumplió a la letra: 0.35 ÷ 0.87 = 0.40. La tarifa de Sonnet es exactamente la mitad de la de Opus, y C además leyó menos caché (1,311,198 contra 2,206,421). Pero la cifra de A está inflada, así que 0.40 no es una proporción limpia.

La pregunta de la spec "¿el effort paga igual con los dos modelos?" no se podía responder con tres corridas. Se reformuló antes de correr (nota en `COSTOS.md`).

### Las tres configuraciones

Mismo enunciado en las tres. Decisión del 2026-11-14: 3 corridas A/B/C, no las 5 de la spec v1.2.

| | Config | Resultado | Entrada · caché esc · caché lec · salida | US$ | Duración |
|---|---|---|---|---|---|
| A | opus-5-5 · medium (la de S2) | a la primera; 5 pasos en el navegador; 0 turnos | 52 · 44,695 · 2,206,421 · 10,136 | 0.87 | 2 min |
| B | opus-5-5 · low | funciona según su informe; solo `?pagina=2` y F5; sin commit; 0 turnos | 20 · 19,612 · 650,041 · 3,586 | 0.30 | 1 min |
| C | sonnet-5-5 · medium | a la primera; solo `curl`, sin F5 ni barra de direcciones en navegador; 0 turnos | 30 · 61,238 · 1,311,198 · 6,935 | 0.35 | 2 min |

**Las tres no hicieron el mismo trabajo.** A pidió todo en un solo mensaje: recorrió los 5 pasos en el navegador, enumeró 12 decisiones, hizo el commit y se midió. Su bloque incluye todo eso; el propio agente reportó US$ 0.78 antes de seguir la conversación, y la cifra de hoy es US$ 0.87. B no hizo commit ni los 5 pasos. C verificó con `curl`. La diferencia de costo mezcla la configuración con la cantidad de trabajo, y con estos datos no se separan.

Decisiones no pedidas: A, 12 (4 con ⚠️); C, 9 (4 con ⚠️); B, sin medir.

### Cuál elegí y por qué

**A (opus-5-5 · medium).** Mis palabras: "a pesar del precio y del tiempo, lo hace a la primera."

Lo que dicen los registros: C también quedó "a la primera" con 0 turnos. Lo que A tiene y C no es la verificación completa en el navegador (C usó `curl`). Con los datos de hoy, "a la primera" no separa a A de C; la verificación sí.

### Qué dice mi regla

Última línea de `docs/COSTOS.md`: "Para tareas con varios criterios que tengo que poder comprobar (paginación, estado en la URL, recarga), uso opus-5-5 · medium, porque pasó los 5 pasos a la primera aunque costó US$ 0.87 y tardó 2 min. Para cambios chicos que reviso yo mismo, uso opus-5-5 · low (US$ 0.30, 1 min) y miro el resultado a mano."

La cifra de US$ 0.87 de A incluye la enumeración, el commit y la medición; el propio agente reportó US$ 0.78 antes de seguir la conversación. B no recorrió los 5 pasos ni hizo commit, así que la regla manda a B a cambios que reviso a mano.

### Qué cambió a lo largo del curso y qué no

Filas S1, S2 y S3 (=A) de `docs/MEDICIONES.md`.

* **Cambió:** dónde vive el código. En S2 y S3 las consultas salen de `app/page.tsx` a `lib/catalog.ts` y el 6 es `PRODUCTS_PER_PAGE`; lo pide el `CLAUDE.md`. Decisiones no pedidas: 7 → 11 → 12. Costo: solo S1 y S3 son comparables, US$ 0.43 → US$ 0.87; subió, y S3 incluye trabajo extra, así que no muestra una mejora ni una pérdida limpia.
* **Empató:** el estado del filtro, en la URL (`?pagina=N`, leído en `app/page.tsx`), en las tres filas. Significa que el `CLAUDE.md` no cambió esa decisión: sin reglas el agente ya lo ponía en la URL. Resultado "a la primera" y 0 turnos empataron entre S1 y S3.
* **No comparable:** el costo de S2 (US$ 1.89, `tokens.py` viejo, no se pudo volver a medir), y duración y turnos de S2 (7 min y 1 turno por un primer mensaje equivocado, no por el código).

### Qué salió mal

* A y B no se corrieron con el mismo alcance (ver arriba), y la cifra de A incluye la medición.
* La spec v1.2 se contradecía (3 vs 5 corridas, D/E sin definir).
* La Fase 3.3 no estaba hecha al cerrar la sesión: `COSTOS.md` no tenía la regla ni los precios, y la fila S3 estaba vacía. Se completó después.
* Las filas A y B de `COSTOS.md` decían "sin medir en este chat". Se recuperaron de `tokens.py --patron` identificando las conversaciones por configuración y hora.
* La corrida C hizo `git stash -u` del árbol sucio previo, con mi OK.

### Pendiente para la sesión 4

1. El repositorio quedó con el código de la corrida C commiteado (`cd052aa`), y elegí A (`19689e5`, revertido en `32e374b`). Decidir si se revierte C y se vuelve a aplicar A.
2. Si quiero un costo de A limpio, repetirla con la tarea sola y la enumeración, el commit y la medición en mensajes aparte.
3. Decidir si `CLAUDE.md` importa `AGENTS.md` y qué hacer con `.claude/launch.json` (de la sesión 2).
4. Avisar al docente de los greps de Supabase en `ENCARGO_LITE.md` §3 (de la sesión 1).
5. Los defectos del inventario siguen abiertos: material de las sesiones 5, 6 y 7.

---

## Sesión 4 — Skills y MCP para tu forma de trabajar (2026-11-16; cierre 2026-11-17)

Partida: commit `69841d0`, `claude` 2.1.319, node v22.21.1 (`docs/VERIFICACION_S4.md`).

### La regla que saqué del contrato y por qué

Saqué **«Valores ajustables»**: los umbrales, límites, duraciones, moneda e imagen por defecto viven en `lib/constants/`. La quité de `CLAUDE.md` y la puse en la Skill `valores-ajustables`.

Por qué: en la propuesta de `VERIFICACION_S4.md` la marqué como regla de «a veces» (solo hace falta cuando la tarea añade o cambia números, textos o configuración fijos), y `CLAUDE.md` es para lo que vale en cada conversación. Las otras seis reglas se quedaron en el contrato; esa propuesta es la tabla de la verificación, no una medición.

Resultado comprobado: `CLAUDE.md` pasó de 31 a 24 líneas. La regla **no** quedó en los dos sitios: está solo en la Skill.

### Cómo quedó la descripción de la Skill

`.claude/skills/valores-ajustables/SKILL.md`, campo `description`:

> Mantiene los valores ajustables de MercadoTech Lite (umbrales, límites, duraciones, moneda, imagen por defecto) en lib/constants/ y verifica con grep que no queden sueltos. Úsala ante peticiones como "sube el umbral de stock bajo a 10", "pon la contraseña mínima en 8" o "cambia la duración de la cookie". No cubre lógica de negocio, acceso a datos, estilos ni seguridad (roles, sesiones, redirecciones).

Dice qué hace, da tres ejemplos de petición y dice qué no cubre. El cuerpo trae la regla, el «Estado hoy», cinco pasos y un grep de verificación.

### Las dos peticiones con las que la probé

1. **«sube el umbral de stock bajo a 12»** → la Skill se ejecutó (apareció `valores-ajustables`, origen `projectSettings`). Resultado en el código, sin commitear hasta hoy: `LOW_STOCK_THRESHOLD = 12` en `lib/constants/catalog.ts`, y `app/page.tsx` y `app/producto/[id]/page.tsx` lo importan en vez del `5`. El `5` suelto ya no sale en el grep de la Skill.
2. **«cambia el tamaño de la fuente de la paginación a 1.20rem»** → **la Skill no se ejecutó**, que es lo esperado: es un cambio de estilos y la descripción lo excluye. Tampoco hay cambio en `app/globals.css` (sin modificaciones en el árbol), así que esa petición no quedó aplicada.

No registré cuántas veces probé ni el consumo de contexto de la Skill con una medición propia.

### El servidor MCP que conecté

Servidor `conversaciones`, solo lectura, alcance de proyecto (`.mcp.json`, habilitado en `.claude/settings.local.json`). Apunta a la carpeta de mis conversaciones de Claude Code: `/home/enriquearias/.claude/projects/-home-enriquearias-datapath-claude-code-for-developers`.

Dos cosas que no cuadran y que dejo escritas:

* Mis notas de la sesión (`sesion4.txt`) guardan el comando `claude mcp add --scope project conversaciones -- npx -y @modelcontextprotocol/server-filesystem --read-only …`, pero el `.mcp.json` actual ejecuta `node` sobre `~/.config/Claude/side-session-notes/local_40ef8b05-…/conversaciones-ro.mjs`. Ese script **no está en el repositorio**: en otra máquina, o si se borra esa carpeta, el servidor no arranca.
* **Qué me respondió que antes no podía: no quedó registrado** en ningún archivo del proyecto ni en mis notas. No lo reconstruyo de memoria. Completar a mano aquí: `_______`.

### Qué dice mi tabla de decisión (`docs/DECISIONES.md`)

| si necesitas | usas | mi caso |
|---|---|---|
| Una regla que vale siempre | CLAUDE.md | los `.tsx` no consultan la base |
| Un procedimiento que vale a veces | Skill | `valores-ajustables` |
| Datos o acciones de un sistema externo | MCP | `conversaciones` (solo lectura) |
| Trabajo largo que no debe ensuciar mi contexto | Subagente | sesión 5 |
| Algo que se cumpla aunque el modelo no obedezca | Hook | sesión 6 |

Cierre de la tabla: lo que necesito en cada conversación va al contrato; lo que necesito de vez en cuando, a una Skill; lo que vive fuera de mi proyecto, a un MCP.

### Qué salió mal / qué no funcionó

* La segunda petición no hizo nada: es el resultado esperado de la prueba, pero la fuente de 1.20rem sigue sin cambiar.
* El «Estado hoy» de la Skill quedó desactualizado: sigue diciendo que el stock bajo `5` está suelto en `app/page.tsx:66` y `app/producto/[id]/page.tsx:24`, y ya no lo está. El grep de la Skill hoy aún devuelve 4 valores sueltos fuera de `lib/constants/` (contraseña mínima, imagen por defecto, cookie, moneda y locale).
* La respuesta del MCP no se registró (ver arriba).
* `tokens.py` solo encuentra las conversaciones desde la raíz del curso, no desde `mercado-lite`, y dejó `docs/SALIDA_TOKENS.txt`.
* `.claude/` estaba sin seguimiento al arrancar (contenía `answer-style`, anterior a la sesión).
* El repo llevaba 2 commits sin subir (`origin/main: adelante 2`) al cerrar.

### Pendiente para la sesión 5

1. Registrar qué responde el MCP `conversaciones` que antes no podía (completar el hueco de arriba).
2. Decidir dónde vive `conversaciones-ro.mjs` (hoy fuera del repo) o volver al comando `npx` de mis notas.
3. Actualizar el «Estado hoy» de la Skill (el stock bajo ya está en `lib/constants/catalog.ts`).
4. Subagente de la tabla de decisión: «trabajo largo que no debe ensuciar mi contexto».
5. Los defectos del inventario siguen abiertos y sin tocar: `.tsx` que consultan la base (4 archivos), valores sueltos que quedan, cero pruebas, `/admin` sin rol, redirección abierta del login, sesión sin vencimiento en el servidor. Material de las sesiones 5, 6 y 7.
