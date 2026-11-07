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

**Verificación de la fase:** `npm run dev` sirve el catálogo con 12 productos; registro, salir e inicio de sesión funcionan con un usuario de prueba; compra completa: pedido #1 registrado y stock del producto 1 de 8 a 7. No hay filtro por categoría.

> Una conversación anterior escribió aquí una FACTURA sin haber generado la app. Esta sección la reemplaza.

**Revisión en la Fase 1.3:** la factura ya tiene las cuatro cifras que pide la fase (costo, duración, turnos, aprobaciones), todas medidas en la 1.2. No se agregó ni se estimó nada.

