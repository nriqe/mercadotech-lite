# 00 — Antes (Fase 1.1, 2026-11-07)

Punto de partida antes de generar nada. Las secciones de factura y daños se agregan en la Fase 1.3.

## 1. Entorno

| Herramienta | Comando | Salida real | Nota |
|---|---|---|---|
| Node | `node --version` | `v22.21.1` | Cumple el mínimo de 20. |
| npm | `npm --version` | `10.9.4` | El que trae este Node. |
| Git | `git --version` | `git version 2.56.0` | Instalado. |
| Claude Code | `claude --version` | `2.1.319 (Claude Code)` | Autenticado: `claude auth status` → `loggedIn: true`. |
| GitHub CLI | `gh --version` | `gh version 2.97.0 (2026-07-31)` | No es requisito; ya estaba instalado. |

No faltaba ningún requisito, así que no se instaló nada.

## 2. Cómo pago

Tengo el plan Claude Pro (`claude auth status` → `authMethod: claude.ai`, `subscriptionType: pro`) y no tengo saldo de API configurado (no hay variable `ANTHROPIC_API_KEY`).
Cuando se agota el uso de la ventana, el agente se detiene hasta que se renueve el límite. No se cobra nada extra, así que lo que me frena primero es el **techo de uso**, no el dinero.

> Plan = techo de uso (te detiene, no te cobra más). Saldo de API = techo de dinero (cada token se descuenta hasta llegar a cero).

## 3. Modo de aprobación

Modos que ofrece esta instalación (`claude --help` → `--permission-mode`; `~/.claude/settings.json` no fija ninguno), de "pregunta por todo" a "actúa sin preguntar":

1. `plan`: solo lee y propone. No edita ni ejecuta nada hasta que apruebo.
2. `manual`: pide permiso para cada edición y cada comando.
3. `acceptEdits`: edita archivos sin preguntar y pide permiso para los comandos.
4. `auto`: un clasificador decide. Ejecuta lo que juzga seguro y pregunta lo riesgoso.
5. `dontAsk`: nunca pregunta. Hace lo que está pre-permitido y rechaza el resto.
6. `bypassPermissions`: todo sin preguntar. La ayuda lo recomienda solo para sandboxes sin internet.

**Elegido: `auto`.**

**Riesgo que acepto:** el agente puede correr `npm install` y agregar o actualizar dependencias en `package.json` sin preguntarme, porque el clasificador lo considera seguro, y yo me entero del cambio solo al revisar el diff.

## Criterio para elegir modelo

- Vale pagar por más capacidad cuando equivocarse cuesta más que el modelo: una migración de base de datos, un cambio de arquitectura, algo difícil de revertir.
- No vale cuando el error es barato de detectar y deshacer: renombrar, documentar, generar boilerplate.
- Hoy solo queda escrito el criterio. La elección medida se hace en la sesión 3.

## FACTURA (Fase 1.2, 2026-11-07)

Generación de MercadoTech Lite en `curso-ed5/mercado-lite/`, con el encargo de `ENCARGO_LITE.md` §1 tal cual.

| Concepto | Valor | Nota |
|---|---|---|
| Costo en dinero | USD 0 | Plan Pro, sin saldo de API ni uso extra (`extraUsage.enabled: false`). |
| Costo en uso del plan | ventana de 5 h: de 4 % a 9 % (+5 puntos); semanal: de 1 % a 2 % | Medido con el uso de la cuenta antes y después. Es de toda la cuenta, no solo de esta conversación. |
| Contexto de la conversación | ~117 000 tokens de 1 000 000 (12 %) | ~46 000 de mensajes; el resto es carga fija (herramientas, prompt del sistema, skills). |
| Duración | ~6 min (17:42 → 17:48) | Desde la primera escritura hasta la app verificada en el navegador. |
| Turnos del usuario | 1 | Un solo prompt: "Ejecuta la Fase 1.2". |
| Preguntas del agente | 0 | No preguntó nada. |
| Aprobaciones pedidas | 0 | Modo `auto`. |
| Arreglos para que arranque | 0 | Arrancó al primer intento. Hubo un ajuste visual antes de entregar (títulos de tarjeta enormes en el celular). |
| Pruebas escritas | 0 | No se pidieron y no se escribieron. |
| Tokens (recuperado) | entrada 66 · caché escrita 67 342 · caché leída 3 126 002 · salida 28 226 | Recuperado el 2026-11-12 de la conversación guardada `52677471…jsonl`, solo turnos del 2026-11-07 (los posteriores, del 12-nov, son de la Sesión 3). Cada respuesta contada una vez (32 respuestas): `tokens.py` suma cada respuesta varias veces porque Claude Code repite el contador en cada línea; con su método saldría 132 · 165 235 · 6 266 991 · 60 759. |
| Equivalente en dólares (recuperado) | ~USD 1,53 | Recuperado el 2026-11-12 con las tarifas públicas de Opus 5.5 que trae `tokens.py` (consultadas el 2026-11-09). No se cobró: es el valor de lo consumido. |
| Duración (recuperada) | 7 min 21 s (17:40:58 → 17:48:19) | Recuperado el 2026-11-12 de las marcas de tiempo de la conversación: del primer mensaje a la última respuesta de la generación. La fila "Duración" de arriba mide desde la primera escritura. |
| Caché (recuperado) | leídos de caché: US$ 5,94; como entrada nueva habrían costado US$ 118,83; 95,0 % de la entrada entró por caché (29 706 568 ÷ 31 269 323) | Recuperado el 2026-11-12: línea final de `tokens.py`, tal cual. Abarca **todas** las conversaciones del proyecto hasta esa fecha, no solo la generación, y lleva el doble conteo de la herramienta. |

**Verificación de la fase:** `npm run dev` sirve el catálogo con 12 productos; registro, salir e inicio de sesión funcionan con un usuario de prueba; compra completa: pedido #1 registrado y stock del producto 1 de 8 a 7. No hay filtro por categoría.

> Una conversación anterior escribió aquí una FACTURA sin haber generado la app. Esta sección la reemplaza.

**Revisión en la Fase 1.3:** la factura ya tiene las cuatro cifras que pide la fase (costo, duración, turnos, aprobaciones), todas medidas en la 1.2. No se agregó ni se estimó nada.

## INVENTARIO DE DAÑOS (Fase 1.3, 2026-11-07)

Comprobado con los greps de `ENCARGO_LITE.md` §3, ejecutados desde `curso-ed5/mercado-lite/`. No se corrigió nada.

> **Aviso sobre los greps.** Los greps de los defectos 1 y 2 buscan `createClient`, `from(`, `.limit(` y `.range(`, que son funciones de Supabase (la versión 1 del encargo). Esta app usa SQLite con `better-sqlite3`, así que esos greps salen vacíos aunque el defecto esté. Abajo va primero el grep literal, con su salida, y después el equivalente para SQLite. Conviene avisar al docente para que actualice §3.

| # · Defecto | Comando → salida (recortada) | ¿Apareció? | Se cierra en |
|---|---|---|---|
| 1 · Componentes que consultan la base | Literal: `grep -rl "createClient\|from(" app components --include="*.tsx"` → sin resultados. SQLite: `grep -rlE "getDb\(\)\|\.prepare\(" app components --include="*.tsx"` → 5 archivos: `app/page.tsx`, `app/layout.tsx`, `app/producto/[id]/page.tsx`, `app/carrito/page.tsx`, `app/pedido/[id]/page.tsx` | **Sí** | S2 y S5 |
| 2 · Valores ajustables incrustados | `ls lib/constants/` → `No existe el fichero o el directorio`. Literal: `grep -rnE "\.limit\(\|\.range\(\|0\.18\|S/ " app components` → sin resultados. SQLite: ver evidencia 2 (6 valores sueltos en 5 archivos) | **Sí** | S2 y S5 |
| 3 · Cero pruebas | `ls **/*.test.*` (sin `node_modules`) → sin resultados; `npm test` → `npm error Missing script: "test"` | **Sí** | S6 |
| 4 · Seguridad abierta | `grep -rniE "role\|is_admin\|isAdmin" lib app components` → sin resultados. `/admin` y `createProductAction` solo comprueban `if (!user)`; el registro es libre (`app/actions.ts:29`). Cualquiera que cree una cuenta puede cargar productos | **Sí, en una de sus tres formas** | S6 y S7 |
| 5 · Redirección abierta en el login (extra) | `grep -n 'next.startsWith' app/actions.ts` → `46:  redirect(next.startsWith("/") ? next : "/");` | **Sí** (no estaba en la lista) | S5 (revisor) / S7 |
| 6 · Sesiones sin vencimiento en el servidor (extra) | `grep -rn "expires\|created_at <\|DELETE FROM sessions" lib app` → solo `lib/auth.ts:35` (borrar al salir). No hay limpieza por antigüedad | **Sí** (no estaba en la lista) | S7 |

### Evidencia por defecto

**1 · Componentes que consultan la base.** No hay capa de datos: cada página llama a `getDb().prepare(...)` con SQL escrito ahí mismo, junto al render.

```
$ grep -rcE "\.prepare\(" app --include="*.tsx" | grep -v ':0'
app/page.tsx:1
app/producto/[id]/page.tsx:1
app/layout.tsx:1
app/carrito/page.tsx:1
app/pedido/[id]/page.tsx:2
```

Además, toda la lógica de negocio (carrito, checkout, alta de productos) está en un solo archivo de acciones de servidor, `app/actions.ts` (~165 líneas), con SQL dentro.

**2 · Valores ajustables incrustados.** No existe `lib/constants/`. Valores sueltos:

```
$ grep -rnE "maxAge|60 \* 60|length < 6|<= 5|\"PEN\"|es-PE|placehold\.co/600x450" app components lib
app/page.tsx:26:              ) : p.stock <= 5 ? (
app/actions.ts:22:  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };
app/actions.ts:159:    p.image_url = `https://placehold.co/600x450/1e293b/e2e8f0?text=${encodeURIComponent(p.title)}`;
lib/auth.ts:28:    maxAge: 60 * 60 * 24 * 7,
app/producto/[id]/page.tsx:24:          <p className={p.stock <= 5 ? "stock-low" : "muted"}>
lib/db.ts:106:  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(amount);
```

El umbral de "pocas unidades" (`5`) está repetido en dos archivos. La moneda sí quedó en una sola función (`formatPEN` en `lib/db.ts`), pero esa función vive en el archivo de la base de datos.

**3 · Cero pruebas.**

```
$ ls **/*.test.*        # excluyendo node_modules
(sin resultados)
$ npm test
npm error Missing script: "test"
```

**4 · Seguridad abierta.** De las tres formas que describe §3, apareció **una**:

* **La página de administración no comprueba quién la usa: sí.** Comprueba que haya *alguien* con sesión, pero no *quién*. No hay rol ni lista de administradores, y el registro está abierto a cualquiera.

  ```
  $ grep -n "getCurrentUser\|redirect" app/admin/page.tsx
  8:  const user = await getCurrentUser();
  9:  if (!user) redirect("/login?next=/admin");
  $ grep -n "createProductAction" -A3 app/actions.ts
  142:export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  143-  const user = await getCurrentUser();
  144-  if (!user) redirect("/login?next=/admin");
  $ grep -rniE "role|is_admin|isAdmin" lib app components
  (sin resultados)
  ```

* **Contraseñas sin cifrar: no apareció.**

  ```
  $ grep -rniE "bcrypt|argon|scrypt|hash" package.json app lib
  lib/auth.ts:9:  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  lib/auth.ts:16:  const check = crypto.scryptSync(password, salt, 64);
  app/actions.ts:30:    .run(email, name, hashPassword(password));
  ```

  Decisión del agente que lo evitó: usó `scrypt` con sal aleatoria del módulo `crypto` de Node (sin dependencias extra) y compara con `timingSafeEqual`.

* **Sesión decidida en el navegador: no apareció.**

  ```
  $ grep -rn "localStorage\|sessionStorage" app components
  (sin resultados)
  ```

  Decisión del agente que lo evitó: la sesión es un token aleatorio de 32 bytes guardado en la tabla `sessions`, enviado en una cookie `httpOnly` y `sameSite: "lax"` (`lib/auth.ts:21-31`). El navegador no puede editar quién es.

**5 · Redirección abierta en el login (no estaba en la lista).** `loginAction` acepta cualquier `next` que empiece por `/`. Un valor como `//sitio-externo.com` empieza por `/` y el navegador lo trata como otro dominio, así que un enlace de login preparado puede mandar al usuario fuera de la tienda después de ingresar.

```
$ grep -n 'next.startsWith' app/actions.ts
46:  redirect(next.startsWith("/") ? next : "/");
```

**6 · Sesiones sin vencimiento en el servidor (no estaba en la lista).** La cookie dura 7 días (`lib/auth.ts:28`), pero la fila de `sessions` no vence: solo se borra al salir. Un token copiado sigue sirviendo después de esos 7 días.

```
$ grep -rn "expires\|created_at <\|DELETE FROM sessions" lib app
lib/auth.ts:35:  if (token) getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
```

**Revisado y sin problema:** el pedido (`/pedido/[id]`) filtra por `user_id`, así que un usuario no ve pedidos de otro. No hay archivos `.env` ni claves en el código (`grep -rniE "api[_-]?key|secret" app lib components` → sin resultados). La base `data/*.db` está en `.gitignore`.
