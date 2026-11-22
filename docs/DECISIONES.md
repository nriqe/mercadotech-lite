# Decisiones

| si necesitas | usas | mi caso |
|---|---|---|
| Una regla que vale siempre | CLAUDE.md | «Los archivos .tsx no consultan la base: nada de `getDb()` ni `.prepare(` en páginas ni layouts.» |
| Un procedimiento que vale a veces | Skill | `valores-ajustables`: mueve a `lib/constants/` umbrales, límites y moneda, y verifica con grep. |
| Datos o acciones de un sistema externo | MCP | Servidor `conversaciones` (solo lectura): lee la carpeta de mis conversaciones de Claude Code. |
| Trabajo largo que no debe ensuciar mi contexto | Subagente | Revisión del commit `b1a9221` por un agente nuevo que no vio mi contexto ni `docs/`: devolvió 11 decisiones no pedidas; mi `/context` pasó de 49,9 mil a 69,9 mil y su registro (392 KB) quedó en `subagents/`. |
| Algo que se cumpla aunque el modelo no obedezca | Hook | Hook PreToolUse (bloquear-peligroso.js): frena git reset --hard, git push --force, git clean -f y rm -rf en Bash y PowerShell aunque vengan después de un &&, y que el Tech Lead lea docs/. Una regla de permisos no veía el comando entero; probar-hooks.js da 22 de 22. |

Lo que necesito en cada conversación va al contrato; lo que necesito de vez en cuando, a una Skill; lo que vive fuera de mi proyecto, a un MCP.
