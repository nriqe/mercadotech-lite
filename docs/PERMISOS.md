# Matriz de permisos: qué hace el agente solo, qué te pregunta y qué no hace nunca, con el origen de cada regla.

| # | Acción | Lista | Regla exacta | Origen |
|---|---|---|---|---|
| 1 | Editar la foto de la sesión 1 | deny | `Edit(./docs/00-ANTES.md)` | Archivo que los prompts del curso repiten que no se toca |
| 2 | Editar las mediciones cerradas | deny | `Edit(./docs/MEDICIONES.md)` | Archivo que los prompts del curso repiten que no se toca |
| 3 | Instalar un paquete | ask | `Bash(npm install *)` | Riesgo aceptado en la sesión 1 (`docs/00-ANTES.md` §3) |
| 4 | Instalar un paquete | ask | `PowerShell(npm install *)` | Riesgo aceptado en la sesión 1 (`docs/00-ANTES.md` §3) |
| 5 | `npm install` sin argumentos | ask | `Bash(npm install)` | Riesgo aceptado en la sesión 1 (`docs/00-ANTES.md` §3) |
| 6 | `npm install` sin argumentos | ask | `PowerShell(npm install)` | Riesgo aceptado en la sesión 1 (`docs/00-ANTES.md` §3) |
| 7 | Publicar en el remoto | ask | `Bash(git push *)` | Lo que sale de tu máquina |
| 8 | Publicar en el remoto | ask | `PowerShell(git push *)` | Lo que sale de tu máquina |
| 9 | `git push` sin argumentos | ask | `Bash(git push)` | Lo que sale de tu máquina |
| 10 | `git push` sin argumentos | ask | `PowerShell(git push)` | Lo que sale de tu máquina |
| 11 | Compilar (solo comprueba) | allow | `Bash(npm run build)` | CLAUDE.md L7 |
| 12 | Compilar (solo comprueba) | allow | `PowerShell(npm run build)` | CLAUDE.md L7 |

## Por qué cada regla de comando está dos veces

En Windows el agente tiene dos consolas, `Bash` y `PowerShell`, y elige cuál usar. Una regla `Bash(...)` no alcanza a la herramienta `PowerShell`, así que sin la copia el comando pasaría sin preguntar por la otra consola. `.claude/settings.json` se commitea y lo usa todo el equipo, aunque hoy esta máquina (Linux) solo tenga `Bash`; en macOS y Linux la regla `PowerShell(...)` no estorba. Las reglas `Edit(...)` van una sola vez porque también frenan lo que escribe cualquiera de las dos consolas. No hay ningún `deny` de comandos: un `deny` de `Bash` con patrón apaga la consola `PowerShell` sin avisar.
