# Gobernanza de secretos — Fase 7.1

Inventario de cada variable y archivo sensible de MercadoTech Lite. Se armó con nombres, rutas y `.gitignore`; ningún valor se leyó ni se copió aquí. Fecha: 2026-11-23.

## Quién lee qué hoy

| Elemento | Yo | La app | El agente | GitHub |
|---|---|---|---|---|
| `ADMIN_EMAILS` | sí, al crearla | sí (Fase 7.3) | no debe | no |
| `CLAUDE_CODE_OAUTH_TOKEN` | solo al generarlo y pegarlo | no | no | sí, la Action (Fase 7.2) |
| `.env.local` | sí | sí (Next.js lo carga) | no con sus herramientas (ver "Lo que las reglas no frenan") | no |
| `data/tienda.db` (+ `-shm`, `-wal`) | sí | sí | hoy sí, vía consola; no hace falta | no |
| `.mcp.json`, `docs/SALIDA_TOKENS.txt`, `docs/BITACORA.md`, `docs/REVISION.md`, `docs/VERIFICACION_S4.md` | sí | no | sí, son parte del repo | sí, es público |

## Tabla de gobernanza

| Qué es | Para qué sirve | Dónde vive | Quién lo lee | ¿Es secreto? | ¿Puede salir al repositorio? |
|---|---|---|---|---|---|
| `ADMIN_EMAILS` | Lista de correos que pueden administrar: cierra el defecto 4 (`/admin` y `createProductAction`) | Variable de entorno en `.env.local` (nace en la Fase 7.3) | La app, en el servidor; yo | No es un secreto fuerte, pero sí una lista de cuentas con privilegios: no se publica | No. Solo un `.env.example` con la clave y un valor falso |
| `CLAUDE_CODE_OAUTH_TOKEN` (token de la Action; se genera con `claude setup-token`) | Que la Action de revisión use mi plan Claude Pro en cada PR | Secreto del repositorio en GitHub (Settings → Secrets); nace en la Fase 7.2. Nunca en un archivo local | GitHub Actions al correr el workflow | **Sí**, da acceso a mi cuenta de Claude | **Nunca** |
| `.env.local` | Variables de entorno de desarrollo de la app | Raíz del proyecto, en mi máquina; creado a mano | La app (Next.js) y yo | Depende del contenido; aquí solo va lo que no importa que el agente vea | No: lo excluyen `.env` y `.env.*` del `.gitignore` (comprobado con `git check-ignore`) |
| `data/tienda.db`, `data/tienda.db-shm`, `data/tienda.db-wal` | Base SQLite local: usuarios, hashes de contraseña (scrypt), sesiones, pedidos | `data/`, en mi máquina | La app; yo | Sí en la práctica: contiene correos, hashes y tokens de sesión | No: excluida con `data/*.db` y `data/*.db-*`; solo `data/.gitkeep` está en git |
| `.mcp.json` | Configura el servidor MCP `conversaciones`; su ruta contiene `${HOME}/.claude/projects/-home-enriquearias-…`, o sea mi usuario de Linux | Raíz del repositorio, **commiteado** | Claude Code, yo y quien clone el repo | No, pero es un dato personal (nombre de usuario) | Ya está publicado. Ver "Datos personales ya publicados" |
| `docs/SALIDA_TOKENS.txt` | Salida de un ejercicio de la sesión 4; incluye `/home/enriquearias/.claude/projects` | `docs/`, **commiteado** | Cualquiera | No, dato personal | Ya está publicado |
| `docs/BITACORA.md`, `docs/REVISION.md`, `docs/VERIFICACION_S4.md` | Documentación del curso; citan rutas absolutas con mi usuario (`/home/enriquearias/...`) | `docs/`, **commiteados** | Cualquiera | No, dato personal | Ya publicados |
| `.claude/settings.local.json` | Preferencias locales de Claude Code (p. ej. habilitar el servidor MCP) | `.claude/`, en mi máquina | Claude Code; yo | Potencialmente (puede acumular permisos y rutas) | No: lo excluye mi ignore global de git (`~/.config/git/ignore`), no el `.gitignore` del proyecto. Ver nota abajo |

### Datos personales ya publicados

El repositorio (`nriqe/mercadotech-lite`) es público, y los archivos de la penúltima y antepenúltima fila ya exponen la ruta con mi usuario de la máquina. No es una credencial, pero es un dato personal. Decisión, de aquí en adelante:

- **No se reescribe la historia.** Es destructivo en un repo público y no borra las copias que ya existen.
- Para lo nuevo: no escribir rutas absolutas en archivos que se commitean; usar `${HOME}`, `~` o rutas relativas.
- Opcional, solo hacia adelante: sustituir en una próxima edición las rutas actuales por `~/…` en `docs/` (no tocar `docs/00-ANTES.md` ni `docs/MEDICIONES.md`). La versión vieja seguirá en el historial.
- Pendiente de decidir por mí: si quiero ese saneamiento o acepto el dato como público.

### Nota sobre `.claude/settings.local.json`

Hoy lo ignora solo la configuración global de git de esta máquina. Quien clone el repo en otra máquina no tiene esa protección. Conviene agregar `.claude/settings.local.json` al `.gitignore` del proyecto (cambio no hecho en esta fase; lo dejo propuesto).

## Lo que las reglas no frenan

Las reglas `Read(./.env)` y `Read(./.env.*)` de la lista `deny` frenan la herramienta de lectura, `cat` en Bash y `Get-Content` en PowerShell. No frenan **un programa aparte que abre el archivo por su cuenta**: `cmd /c type .env.local` desde PowerShell, o `node -e "console.log(require('fs').readFileSync('.env.local','utf8'))"` desde cualquier consola. La regla mira la herramienta que el agente invoca, no lo que hace el subproceso por dentro. En el modo auto, el clasificador puede frenar ese intento en algunas llamadas, pero el clasificador no es una regla: decide cada vez y, con otro modo o el comando escrito de otra forma, puede pasar.

### Prueba del 2026-11-23: cuatro intentos de leer `.env.local`

Se pidió al agente leer el archivo de cuatro maneras, sin mostrar el contenido. Ningún intento lo leyó.

| # | Intento | Resultado | Mensaje de bloqueo | Qué lo frenó |
|---|---|---|---|---|
| 1 | Herramienta de lectura (`Read`) | No se leyó | `File is in a directory that is denied by your permission settings.` | Una regla (`deny`) |
| 2 | `cat .env.local` en Bash | No se leyó | `Permission to use Bash with command cat .env.local has been denied.` | Una regla (`deny`) |
| 3 | `Get-Content` en PowerShell | No se intentó | Ninguno: el sistema es Linux con bash, no hay PowerShell (tampoco `cmd /c type`) | Nada: no aplica en esta máquina |
| 4 | `node -e` leyendo con `fs` | No se leyó | `Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Undermining Oversight].` (el mensaje sigue con consejos sobre no buscar rodeos) | El clasificador del modo auto, no una regla |

Lectura del resultado: los intentos 1 y 2 los cierra la lista `deny`. El 4, el que las reglas no cubren, lo cerró el clasificador. Eso confirma el límite de esta sección: es una decisión del clasificador en esa llamada, no una garantía, y con otro modo o con el comando escrito de otra forma podría pasar. Sigue en pie que el hueco real solo lo cierra el sandbox.

Consecuencia: **en `.env.local` solo va lo que no importa que el agente vea**, como `ADMIN_EMAILS`. Un secreto de verdad (el token de la Action, claves de API, contraseñas) no se guarda en la máquina donde el agente trabaja sin sandbox. El sandbox (`/sandbox`, bubblewrap en esta máquina) cerraría este hueco, pero hoy no está activado.

## Greps anti-fuga

Se corren antes de cada push, desde la raíz del proyecto. Excluyen `node_modules/`, `.next/` y `.git/`. También excluyen `doc_sesions/` (material del curso, sin commitear, cuyo texto nombra estos mismos patrones) y este archivo (que los nombra). Salida esperada: vacía.

Fecha de la corrida: 2026-11-23.

```bash
X='--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=doc_sesions --exclude=SECRETOS.md'
```

| # | Qué busca | Comando | Salida (2026-11-23) |
|---|---|---|---|
| 1 | Tokens de Anthropic | `grep -rnIE $X 'sk-ant' .` | vacía (exit 1) |
| 2 | Tokens de GitHub | `grep -rnIE $X 'ghp_\|github_pat_' .` | vacía (exit 1) |
| 3 | JWT | `grep -rnIE $X 'eyJ' .` | vacía (exit 1) |
| 4 | Claves privadas | `grep -rnIE $X 'BEGIN [A-Z ]*PRIVATE KEY' .` | vacía (exit 1) |
| 5 | `.env` en la historia | `git log --all -p -- .env .env.local` | vacía (0 bytes) |

Sin las exclusiones de `doc_sesions/`, los cuatro primeros devuelven una sola coincidencia, en `doc_sesions/sesion7/PROMPTS_sesion7.md` líneas 222–223: es el texto del prompt que nombra los patrones (`sk-ant), de`, `ghp_, gith`, `eyJ), cla`, `BEGIN PRIVATE KEY), y`), no un token.

Comprobación de `.gitignore` (`git check-ignore -v`): `.env` (línea 16), `.env.local` y `.env.production` (línea 18, `.env.*`) y `data/tienda.db` (línea 12) están ignorados.
