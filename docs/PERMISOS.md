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

## El hook

`.claude/hooks/bloquear-peligroso.js`, registrado en `.claude/settings.json` como `PreToolUse` con el matcher `Bash|PowerShell|Read|Grep|Glob`. Se probó con `node .claude/hooks/probar-hooks.js` (22 de 22 casos).

**Qué bloquea** (dos cosas y ninguna más):
1. En `Bash` o `PowerShell`, en cualquier parte del comando: `git reset --hard`; `git checkout --` y `git restore` sin `--staged`; `git push --force` o con `+rama`; `git clean -f`; y borrar una carpeta entera (`rm -rf`, `rm -r -f`, `rm --recursive --force`, `Remove-Item -Recurse` y sus alias, `rd /s`).
2. `Read`, `Grep` o `Glob` sobre `docs/` cuando quien los usa es el subagente `tech-lead`. La conversación principal sí puede leer `docs/`.

Un evento que el hook no puede leer también se bloquea: un hook roto no debe abrir la puerta.

**En qué consolas:** `Bash` y `PowerShell`. En esta máquina (Linux) solo existe `Bash`; el matcher nombra `PowerShell` porque el archivo se commitea y en Windows el agente elige entre las dos consolas, y un matcher que solo dice `Bash` nunca se activa para `PowerShell`.

**Por qué no podía hacerlo una regla de permisos:**
- Una regla `Bash(...)` compara el comando contra un patrón y no ve el mismo programa por otro camino (`git status && git reset --hard`, `sh -c '…'`, una ruta completa). Además, un `deny` de comandos apaga la consola `PowerShell` sin avisar. El hook lee el comando entero y busca el texto en cualquier parte.
- `tools: Read, Grep, Glob` del Tech Lead le da la herramienta entera, no una ruta, y una regla de permisos vale para toda la sesión, también para la conversación principal, que sí necesita `docs/`. Solo el hook ve `agent_type` y frena al subagente y a nadie más.

**Qué no cubre:**
- Un `Grep` del Tech Lead sin ruta, sobre todo el proyecto, puede devolver líneas de `docs/`: el hook frena lo que nombra `docs/`, no lo que lo recorre de paso.
- Un comando que borra o descarta por otro camino (un script, `node -e`, `find -delete`).
- También frena un comando que solo menciona esas palabras, sin ejecutarlas (por eso los archivos de la sesión se escriben con la herramienta de edición, no con `cat >>` ni `echo >`).

## Deshacer

**Qué deshace `/rewind`:** lo que el agente editó con sus herramientas de archivo (Edit/Write). Restaura el código, la conversación o ambos, al checkpoint anterior a un mensaje tuyo.

**Qué no deshace, y qué uso:** un archivo cambiado solo por un comando de consola, lo que hizo un subagente y lo que editaste tú a mano. Para eso uso git, en mi terminal: `git restore <archivo>` (o `git diff` primero para ver el daño). El hook de la 6.2 no deja que lo corra el agente. Tampoco se deshace con ninguno de los dos un `git push`: por eso va en `ask`.

**Qué no frenan las reglas `deny`:** un programa que escribe un archivo por dentro, como `node -e "fs.writeFileSync(...)"`. El `deny` de `Edit` cubre la herramienta de edición, las redirecciones (`>`, `>>`, `tee`, `sed`) y lo que escribe `PowerShell`, pero no el subproceso que abre el archivo por su cuenta. Por eso `.claude/settings.json` y `.claude/hooks/**` quedan protegidos contra el uso normal del agente, no contra un programa decidido a saltarse la regla; lo último lo cubre la revisión de `git diff` antes de cada commit.

**Sandbox en mi sistema:** esta máquina es Linux nativo (Fedora, no WSL) y tiene `bubblewrap` y `socat` instalados, así que el sandbox está disponible y se activa con `/sandbox`. Limita los comandos de `Bash` y `PowerShell` y los procesos que abren: escriben solo en la carpeta del proyecto y en un temporal, no leen archivos como `~/.ssh`, y salen a internet solo hacia dominios permitidos (al principio, ninguno). Cerraría justo el hueco de `node -e`. Hoy **no está activado**: es opcional y la red de esta sesión no depende de él. (En Windows nativo no existiría: los comandos corren sin aislar; en WSL1 hace falta WSL2.)
