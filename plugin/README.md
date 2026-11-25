# red-de-seguridad

Mi red de seguridad para Claude Code: un revisor que no edita y dos hooks que frenan lo peligroso.

## Qué trae

| Pieza | Qué hace |
|---|---|
| `agents/tech-lead.md` | El Tech Lead (`red-de-seguridad:tech-lead`): auditor de solo lectura (`Read, Grep, Glob`) que contesta una rúbrica de seis preguntas (R1 a R6) y devuelve un informe con severidades, archivo y línea. No edita y no lee `docs/`. |
| `hooks/hooks.json` + `scripts/bloquear-peligroso.js` | PreToolUse en Bash, PowerShell, Read, Grep y Glob. Bloquea `git reset --hard`, `git checkout --`, `git restore`, `git push --force`, `git clean -f` y borrados recursivos (`rm -rf`, `Remove-Item -Recurse`, `rd /s`). También impide que el Tech Lead lea `docs/`. |
| `hooks/hooks.json` + `scripts/exigir-pruebas.js` | Stop. Si cambió código fuera de `docs/` y `npm test` falla, el agente no puede darse por terminado. Si el proyecto no tiene script `test`, no exige nada. |
| `skills/answer-style` | Respuestas breves que explican, paso a paso, los conceptos técnicos nuevos. |
| `skills/valores-ajustables` | Mantiene los valores ajustables en `lib/constants/`. **Es de MercadoTech Lite**: cita sus archivos y líneas, y solo tiene sentido en un proyecto con esa estructura. |
| `scripts/probar-hooks.js` | Prueba los dos hooks con 27 eventos falsos: `node plugin/scripts/probar-hooks.js` desde la raíz del repositorio. No ejecuta nada peligroso. |

## Cómo se instala

Siempre con `--scope local`: sin esa opción, Claude Code escribe en la configuración global.

```bash
claude plugin marketplace add <ruta-al-repositorio> --scope local
claude plugin install red-de-seguridad@tienda-ensayo --scope local
```

`<ruta-al-repositorio>` es la carpeta que contiene `.claude-plugin/marketplace.json`.

No lo instales en el proyecto donde ya están estos hooks en `.claude/settings.json`: correrían dos veces.

## Qué quedó fuera

- **Permisos** de `.claude/settings.json`: son rutas y scripts de la app de origen, y un plugin no los distribuye.
- **Servidor MCP `conversaciones`**: lee una carpeta de la máquina de su autor.
- **Output style**: no existe ninguno en el proyecto de origen.
- **CI y revisión de PRs** (`.github/workflows/`): son de GitHub, no de Claude Code.
- **`probar-hooks.js` de `.claude/hooks/`**: lo reemplaza el probador de este plugin.
- `LICENSE` e ícono: no se publica en ningún directorio.
