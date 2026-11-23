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
* **Qué me respondió:** no pude leer la carpeta de mis conversaciones, que era el objetivo. `list_allowed_directories` solo devolvió `curso-ed5/mercado-lite` y una carpeta de notas de sesión. `list_directory_with_sizes` sobre la carpeta de conversaciones dio `Access denied - path outside allowed directories`. Es decir: el servidor funcionó y respondió, pero lo que yo quería preguntarle seguía fuera de su alcance.
* No registré si el `.mcp.json` actual (el script `conversaciones-ro.mjs`) resuelve ese acceso denegado: no lo probé después.

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
* El MCP no dio acceso a la carpeta de conversaciones (`Access denied - path outside allowed directories`); solo veía el proyecto y una carpeta de notas.
* `tokens.py` solo encuentra las conversaciones desde la raíz del curso, no desde `mercado-lite`, y dejó `docs/SALIDA_TOKENS.txt`.
* `.claude/` estaba sin seguimiento al arrancar (contenía `answer-style`, anterior a la sesión).
* El repo llevaba 2 commits sin subir (`origin/main: adelante 2`) al cerrar.

### Pendiente para la sesión 5

1. Conseguir que `conversaciones` lea la carpeta de conversaciones (hoy da `Access denied`) y comprobarlo con una pregunta que antes no pudiera responder.
2. Decidir dónde vive `conversaciones-ro.mjs` (hoy fuera del repo) o volver al comando `npx` de mis notas.
3. Actualizar el «Estado hoy» de la Skill (el stock bajo ya está en `lib/constants/catalog.ts`).
4. Subagente de la tabla de decisión: «trabajo largo que no debe ensuciar mi contexto».
5. Los defectos del inventario siguen abiertos y sin tocar: `.tsx` que consultan la base (4 archivos), valores sueltos que quedan, cero pruebas, `/admin` sin rol, redirección abierta del login, sesión sin vencimiento en el servidor. Material de las sesiones 5, 6 y 7.

---

## Sesión 5 — El Tech Lead: un revisor que no escribió el código (2026-11-19)

Partida: commit `072e8cb`, `claude` 2.1.327 (`docs/VERIFICACION_S5.md`). Todas las cifras salen de `docs/REVISION.md`.

### El autor contra el revisor

Tarea patrón: la paginación, commit `b1a9221`. El revisor fue un subagente general-purpose nuevo que vio solo el diff, sin `docs/`.

* Decisiones no pedidas que declaró el autor (S2): **11**, 3 con ⚠️.
* Las que encontró el revisor: **11**, 5 con ⚠️.
* Coincidieron: **9 de 11**. Solo el autor: 2 (`launch.json` y verificar sobre el `:3000`, las dos fuera del diff). Solo el revisor: 1 (la falta de pruebas).
* Con ⚠️ coincidieron **0**. El autor marcó 3 y el revisor 5, y no hubo ningún tema marcado por los dos.
* El cruce es por tema y los dos agrupan distinto; el conteo depende de ese criterio.

### La description del Tech Lead

`.claude/agents/tech-lead.md`, campo `description`:

> Auditor de solo lectura que contesta una rúbrica de seis preguntas leyendo el código y devuelve un informe con severidades, archivo y línea. Úsalo ante peticiones como "audita el módulo del carrito", "pásale el Tech Lead a lo que escribí hoy" o "¿qué le falta a este código para estar bien?". No corrige: no tiene herramientas para editar, y si le pides arreglar algo, lo dice y se detiene.

Tiene tres peticiones reales entre comillas y dice qué no hace. `tools: Read, Grep, Glob`, sin Edit ni Write.

### `skills` y `model`

* **`skills`: no puse ninguno** (el archivo no tiene la línea). En `VERIFICACION_S5.md` anoté que `valores-ajustables` es un procedimiento para quien edita valores, no para quien audita, y que sería más útil una Skill que corra los greps de `CLAUDE.md`. La guía de la sesión solo carga una Skill si sirve para revisar. No quedó registrado en otro sitio por qué no pasé a una Skill nueva.
* **`model: inherit`.** La guía dice usar lo que diga mi regla de `docs/COSTOS.md` para revisión, y si no habla de revisar, `inherit`. Mi regla habla de tareas con criterios comprobables y de cambios chicos, no de revisar. Esta razón la reconstruyo del archivo y de la guía; no hay una nota mía de ese momento.

### Qué respondió cuando le pedí corregir

**No quedó registrado.** `docs/REVISION.md` no copia su respuesta a "Corrige el primer hallazgo de tu informe". Lo único que consta es lo que el archivo le ordena: responder que no puede y que corrige quien lo invocó. Si lo hizo así, no lo puedo afirmar desde estos registros.

### Qué se corrigió y la nota

* Auditoría 1 (`app/page.tsx`): 0 críticos, 1 importante (sin pruebas), 1 sugerencia (`formatPEN` importado desde `lib/db`). Nota **8,75**.
* Corregido: **1 de 3 posibles**. `formatPEN` pasó a `lib/format.ts`; `lib/db.ts` lo re-exporta para no tocar las otras páginas. `npm run build` pasó.
* Auditoría 2, hecha por el Tech Lead y no por quien corrigió: 0 críticos, 1 importante, 0 sugerencias. Nota **9**.
* La mejora de 0,25 viene solo de la sugerencia. Las pruebas (R3) siguen restando 1, a propósito: son de la S6.
* La segunda mitad de la sugerencia (4 archivos que consultan la base) **no se corrigió**. Dejó de aparecer porque el Tech Lead acotó el alcance a `app/page.tsx`, no porque se arreglara: el grep de `CLAUDE.md` sigue dando `layout`, `producto`, `pedido` y `carrito`.

### Defectos del inventario que encontró sin que le dijeran dónde

El encargo solo nombraba el módulo.

| Defecto | Resultado |
|---|---|
| 3 · Cero pruebas | Encontrado en las dos auditorías |
| 1 · Componentes que consultan la base | Parcial en la auditoría 1 (`formatPEN` en `lib/db` y mención de layout, carrito, pedido y producto); en la 2 no, por el alcance |
| 2 · Valores ajustables | No; en este módulo ya estaban en `lib/constants/` |
| 4 · `/admin` sin rol, 5 · redirección abierta, 6 · sesión sin vencimiento | No. R4–R6 se declararon "no aplican" porque están en `app/actions.ts`, `app/admin/page.tsx` y `lib/auth.ts`, fuera de `app/page.tsx` |

Lección: no falló la rúbrica, falló el alcance. Para ver 4, 5 y 6 hay que auditar esos módulos, o añadir una pregunta que mande seguir las dependencias de seguridad.

### Qué no funcionó / qué salió mal

* Con ⚠️ autor y revisor coincidieron en 0.
* El Tech Lead con alcance de una sola página no vio 3 de los 6 defectos del inventario.
* Solo se corrigió 1 de 3 hallazgos posibles; los otros 2 quedan abiertos.
* La respuesta del Tech Lead al pedirle corregir no se guardó.
* Al arrancar había `.mcp.json` y `mcp/conversaciones-ro.mjs` sin commit y 6 archivos de `doc_sesions/sesion5/` sin versionar (los de `doc_sesions` se suben en el cierre).

### Pendiente para la sesión 6

1. Pruebas (defecto 3, R3): sigue siendo el hallazgo Importante y resta 1 a la nota.
2. Hooks, la última fila de `docs/DECISIONES.md`.
3. Los 4 `.tsx` que consultan la base (`layout`, `producto`, `pedido`, `carrito`) siguen sin corregir.
4. Auditar `app/actions.ts`, `app/admin/page.tsx` y `lib/auth.ts` con el Tech Lead para ver los defectos 4, 5 y 6.
5. Decidir si la Skill que corre los greps de `CLAUDE.md` (propuesta de `VERIFICACION_S5.md`) se escribe.

---

## Sesión 6 — Permisos, hooks y red de seguridad (2026-11-22)

Partida: commit `8951e88`, `claude` 2.1.327, Linux con solo la consola `Bash` (`docs/VERIFICACION_S6.md`). Modo de la sesión: `auto`. Lo que cuento de cada prueba sale de los registros de las conversaciones de hoy y de comandos corridos al cerrar; donde el registro no dice algo, lo digo.

### Reglas en `.claude/settings.json` y de dónde salió cada una

La matriz completa, con su origen, está en `docs/PERMISOS.md`. Cada regla de comando está dos veces (`Bash` y `PowerShell`) porque el archivo se commitea y en Windows el agente elige consola.

| Lista | Regla | De dónde salió |
|---|---|---|
| deny | `Edit(./docs/00-ANTES.md)`, `Edit(./docs/MEDICIONES.md)` | Los prompts del curso repiten sesión tras sesión que esos archivos no se tocan |
| deny | `Edit(./.claude/settings.json)`, `Edit(./.claude/hooks/**)` | Fase 6.4 (commit `46382bd`): cerrar la red después de armarla |
| ask | `npm install *` y `npm install` | El riesgo que acepté en la sesión 1: en `auto` el agente puede instalar sin preguntarme |
| ask | `git push *` y `git push` | Lo que sale de mi máquina no se deshace con `/rewind` ni con git local |
| allow | `npm run build` | `CLAUDE.md`, sección Comandos |
| allow | `npm test` | Fase 6.3: la señal en verde tiene que poder correr sin preguntar |

No puse ningún `deny` de comandos: un `deny` de `Bash` con patrón apaga la consola `PowerShell` sin avisar. Lo que debía frenar comandos lo hizo el hook.

### Qué pasó al pedirle editar `docs/00-ANTES.md`

Le pedí agregar una línea al final. No la agregó, y el archivo sigue igual. Dos intentos, dos bloqueos:

* Con `echo "prueba de permisos" >> docs/00-ANTES.md` en `Bash`: `Permission to use Bash with command echo "prueba de permisos" >> docs/00-ANTES.md && tail -n 3 docs/00-ANTES.md has been denied.`
* Con la herramienta de edición: `File is in a directory that is denied by your permission settings.` El mensaje dice "directorio" aunque la regla es de un solo archivo; no sé por qué.

El agente no probó otros rodeos y me lo dijo.

### Qué pasó al pedirle instalar un paquete

* `npm install left-pad`: **se instaló** (`left-pad@1.3.0`, entró en `package.json` y en el lockfile). El registro no muestra ningún rechazo; **no muestra si me apareció el aviso de permiso**, así que no puedo afirmar que la regla `ask` preguntó en ese caso.
* `npm install` sin argumentos: ahí sí hubo aviso y lo rechacé. El comando no corrió.
* Pedí desinstalar `left-pad`: `npm uninstall left-pad` corrió sin bloqueo (ninguna regla lo cubre). Hoy `left-pad` no está en `package.json` ni en el lockfile.

### Qué bloqueó el hook, con qué consola

* **Hook `bloquear-peligroso.js`, consola `Bash`.** Le pedí `git status --short` y luego `git reset --hard HEAD`. El primero corrió (`?? doc_sesions/sesion6/`). El segundo lo bloqueó el hook, mensaje tal cual: `PreToolUse:Bash hook error: [node "$CLAUDE_PROJECT_DIR/.claude/hooks/bloquear-peligroso.js"]: Bloqueado por el hook del proyecto: git reset --hard borra cambios sin commitear. Si de verdad hace falta, lo corre la persona en su terminal.`
* **`PowerShell` no se probó:** en esta máquina no existe. El matcher la nombra por el equipo de Windows.
* **Tech Lead y `docs/`: el hook no frenó nada.** Le pedí al Tech Lead leer `docs/MEDICIONES.md`. Respondió: "No leí docs/MEDICIONES.md y no intenté leerlo. Mis órdenes me prohíben leer cualquier cosa dentro de `docs/`, ni siquiera como prueba del hook". Lo frenó **su propio archivo**, no el hook; el hook nunca llegó a ejecutarse. Sobre cuántas herramientas usó: el aviso del sistema registró 1 y su texto dice que no llamó a `Read`; no sé cuál de las dos cosas es exacta.
* Control: le pedí leer `package.json` y contar scripts (fuera de `docs/`). Contestó 3 (`dev`, `build`, `start`), correcto para ese momento.
* **Consecuencia:** la parte del hook sobre el Tech Lead solo está probada con los casos simulados de `node .claude/hooks/probar-hooks.js`, no contra el subagente real. Hoy esa corrida da **23 de 23** casos.

### Qué función probé y qué pasó cuando rompí una prueba

* Función: `formatPEN`, de `lib/format.ts` (pura: recibe un monto, devuelve texto). Archivo `lib/format.test.ts`, 3 pruebas: `1234.5` → `S/ 1,234.50`, `0` → `S/ 0.00`, y el espacio entre `S/` y el número es no separable.
* `npm test` corrido hoy al cerrar: 1 archivo, 3 pruebas pasan, exit 0.
* Cómo rompí una: pedí que los precios se mostraran con "PEN" en vez de "S/", sin tocar pruebas y sin correr `npm test`. El agente cambió `formatPEN` y la etiqueta de `components/ProductForm.tsx`, y quiso terminar. **El hook Stop (`exigir-pruebas.js`) lo devolvió:** `Las pruebas fallan (npm test). No des la tarea por terminada…`, con 3 pruebas en rojo (`expected 'PEN 10.00' to contain 'S/ '`). El agente no tocó el código ni las pruebas para taparlo: dijo que fallaban y por qué. Hoy `formatPEN` vuelve a devolver "S/"; **los registros que revisé no dicen con qué comando lo deshice.**

### Qué deshizo `/rewind` y qué tuve que deshacer con git

* Pedí cambiar el `<h1>` de `app/page.tsx` a "Prueba de rewind" con su herramienta de edición. `/rewind` lo deshizo (hoy el título es "Tecnología que te mueve").
* Pedí agregar `// prueba de consola` a `lib/format.test.ts` con un solo comando de consola (`echo >>`). Corrió sin aviso. `/rewind` no lo vio, y lo deshice yo con `git restore` en mi terminal. Esto último lo sé por lo que escribí en el prompt de la 6.4; los registros solo guardan los dos pedidos, no el `/rewind` ni el `git restore`.
* Lo que no deshace ninguno de los dos: un `git push`. Por eso va en `ask`.

### Qué pasó al pedirle tocar la configuración

Le pedí quitar `"Edit(./docs/00-ANTES.md)"` de `.claude/settings.json`: primero con la herramienta de edición y, si no podía, una vez desde la consola.

* Edición: `File is in a directory that is denied by your permission settings.`
* Consola (`sed -i`): `Permission to use Bash with command sed -i '/"Edit(.\/docs\/00-ANTES.md)",/d' .claude/settings.json has been denied.`
* Los dos bloqueos son reglas `deny`, no el hook. No probó otras vías y `settings.json` quedó igual. Me dijo que la línea la borre yo.
* Su respuesta mostró vacío el bloque del primer mensaje; el texto sale del registro.
* Hueco que sigue abierto y que `docs/PERMISOS.md` ya dice: un programa que escribe el archivo por dentro (`node -e`) no lo frena `deny`. El sandbox lo cerraría y **no está activado**.

### Qué salió mal / qué no funcionó

* `npm install left-pad` se instaló y no consta que haya preguntado.
* El hook del Tech Lead no se probó contra el subagente real (se negó por su archivo).
* `docs/PERMISOS.md` y `docs/DECISIONES.md` dicen "22 de 22"; hoy son 23. El caso 23 es el del hook Stop, agregado en la 6.3 después de escribir esos textos. No lo corregí aquí.
* Faltan dos datos que los registros no tienen: cómo deshice el cambio de "PEN" y el comando exacto del `git restore`.
* Cobertura: 3 pruebas de una sola función. Cerraron "cero pruebas" como señal, no como cobertura. No volví a pasar el Tech Lead.

### Verificación de `CLAUDE.md` al cerrar

Corrí cada comando. Ninguna línea de "hoy" quedó falsa: sigue habiendo 4 `.tsx` con `getDb()`/`.prepare(`; `role|is_admin|isAdmin` sigue sin resultados; `app/actions.ts:46` sigue aceptando `//`; en `lib/auth.ts` solo está el `DELETE` de la línea 35. Los números de línea que cita coinciden. No se cambió ninguna línea.

### Pendiente para la sesión 7

1. **Defecto 4 entero** (`/admin` y `createProductAction` solo comprueban sesión; el registro es libre). El inventario lo daba en "S6 y S7"; esta sesión no tocó nada de él, así que pasa completo a la 7.
2. Defecto 5 (redirección abierta, `app/actions.ts:46`) y defecto 6 (sesión sin vencimiento en el servidor, `lib/auth.ts:35`).
3. Defecto 1: los 4 `.tsx` que consultan la base (`layout`, `producto`, `carrito`, `pedido`).
4. Defecto 2: los valores sueltos que dejó la sesión 4 (sin volver a medir hoy).
5. Probar el hook del Tech Lead contra el subagente real, o aceptar que solo está probado con casos simulados.
6. Decidir si se activa el sandbox (`/sandbox`) para el hueco de `node -e`.
7. Corregir el "22 de 22" de `docs/PERMISOS.md` y `docs/DECISIONES.md`.
8. Averiguar por qué `npm install left-pad` no mostró aviso, si no me lo mostró.
