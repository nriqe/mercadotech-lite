# Verificación de partida · Sesión 5

Fecha: 2026-11-19

## Versiones

- claude: 2.1.327 (mínimo 2.1.283, cumple)
- node: v22.21.1
- npm: 10.9.4
- git: 2.56.0

## El commit en el que arranqué hoy

`072e8cb` · docs: record the MCP answer for Sesión 4 (rama `main`)

## EL COMMIT DE LA TAREA PATRÓN

- Identificador: `b1a9221`
- Mensaje: `feat: pattern task, S2 run with CLAUDE.md`
- Archivos: `app/globals.css`, `app/page.tsx`, `lib/catalog.ts`, `lib/constants/catalog.ts`
- Nota: solo cambió código de la app. No tocó `docs/` ni `CLAUDE.md`; el `CLAUDE.md` entró después, en `a288b34`.
  En la Fase 5.1 el revisor ve este commit sin `docs/`, y por eso no hay nada que quitarle.

## EL ENUNCIADO

"Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

## Defectos del inventario que aparecieron

- Componentes que consultan la base
- Valores ajustables incrustados
- Cero pruebas
- Seguridad abierta (una de sus tres formas)
- Redirección abierta en el login
- Sesiones sin vencimiento en el servidor

## Mi Skill de la sesión 4 y mi propuesta

`valores-ajustables`: mueve a `lib/constants/` los umbrales, límites y la moneda, y verifica con grep que no queden sueltos. No tiene `disable-model-invocation: true`.

Propuesta: para quien revisa código me parece poco útil, porque es un procedimiento para quien edita valores y no para quien audita. Sería más útil una Skill que corra los greps de verificación de `CLAUDE.md` e informe qué reglas se cumplen. La decides tú en la Fase 5.2.

## Mi regla de costos

"Para tareas con varios criterios que tengo que poder comprobar (paginación, estado en la URL, recarga), uso opus-5-5 · medium, porque pasó los 5 pasos a la primera aunque costó US$ 0.87 y tardó 2 min. Para cambios chicos que reviso yo mismo, uso opus-5-5 · low (US$ 0.30, 1 min) y miro el resultado a mano."

## Mi modo de aprobación

Pedir aprobación.

## Veredicto

Listo para la Fase 5.1 salvo dos pendientes: `.mcp.json` y `mcp/conversaciones-ro.mjs` (ahora con `--read-only` y dentro del repo) están corregidos pero sin commit, y hay 6 archivos de `doc_sesions/sesion5/` sin versionar; todo lo demás cumple.
