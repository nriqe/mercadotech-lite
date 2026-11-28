# Plugin `red-de-seguridad` — Fase 8.1

Fecha: 2026-11-24. Plugin `red-de-seguridad` 1.0.0, en el marketplace `tienda-ensayo`.
Las piezas se copiaron, no se movieron: `.claude/` quedó como estaba.

## 1. Tabla de decisión

Criterio único: **¿sirve en un proyecto que no es el mío?**

| Pieza | Qué depende de mi app | ¿Entra? | Por qué |
|---|---|---|---|
| Tech Lead (`agents/tech-lead.md`) | Casi nada: su rúbrica busca patrones genéricos (SQL en `.tsx`, constantes, pruebas, `isAdmin`, `next`, expiración de sesión) y no cita rutas mías | **Sí** | Revisor de solo lectura, útil en cualquier repo |
| Hook `bloquear-peligroso.js` | Nada de mi app; solo compara el nombre del agente con `"tech-lead"` exacto | **Sí, adaptado** | Dentro del plugin el agente es `<plugin>:tech-lead` (decisión 1) |
| Hook `exigir-pruebas.js` | Supone que existe `npm test` | **Sí, adaptado** | Fuera de mi proyecto puede no haber pruebas (decisión 2) |
| `probar-hooks.js` de `.claude/hooks/` | Prueba los hooks de mi proyecto (23 casos) | **No** | Lo reemplaza el probador del plugin (27 casos) |
| Permisos (`settings.json`) | Todo: `npm run build`, `npm test`, `docs/00-ANTES.md`, `docs/MEDICIONES.md`, `.claude/hooks/**` | **No** | Son rutas y scripts míos; un plugin no distribuye `permissions` |
| Servidor MCP `conversaciones` | Lee `~/.claude/projects/...` de mi máquina | **No** | Una ruta personal no puede ir en `plugin/` |
| Skill `answer-style` | Casi nada: explica conceptos nuevos de forma breve | **Sí** (decisión mía) | Genérica |
| Skill `valores-ajustables` | Todo: cita MercadoTech Lite, `lib/constants/` y archivos con línea | **Sí** (decisión mía) | Entra por decisión expresa; el README avisa que es de MercadoTech Lite. La 8.2 comprobará si sirve fuera |
| Output style | No existe `.claude/output-styles/` | **No hay nada** | La decisión 7 dice que no se inventa |
| Workflows (`ci.yml`, `claude-review.yml`) | Son de GitHub y de mi repo | **No** | No son de Claude Code |

## 2. Probador de los hooks

### Corrida 1 — con los hooks de mi proyecto, copiados tal cual: 25 de 27

```
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git reset --hard después de &&
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: git reset --hard después de ;
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git push --force
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git push con +rama
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: git clean -fd
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git checkout -- .
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: git restore .
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: rm -rf
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: rm -r -f
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: rm --recursive --force
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: Remove-Item -Recurse -Force
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: rd /s /q
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Evento que no es JSON
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Bash: git status pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · PowerShell: git status pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Bash: git restore --staged pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Bash: rm de un archivo pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · PowerShell: Remove-Item -Force de un archivo pasa
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Tech Lead: Read de docs/ (ruta de Windows)
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Tech Lead: Grep con path docs
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Tech Lead: Read de package.json pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Conversación principal: Read de docs/ pasa
FALLA  exit=0 (esperado 2)  bloquear-peligroso.js · Plugin: <plugin>:tech-lead, Read de docs/
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Plugin: <plugin>:tech-lead, Read de package.json pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Otro agente con nombre parecido, Read de docs/ pasa
OK     exit=0 (esperado 0)  exigir-pruebas.js · Stop en la segunda vuelta pasa
FALLA  exit=2 (esperado 0)  exigir-pruebas.js · Stop en un proyecto con cambios y sin script test pasa

25 de 27 casos dan lo esperado.
```

**Qué falló y por qué fuera de mi proyecto:**

1. `Plugin: <plugin>:tech-lead, Read de docs/` (dio 0, debía dar 2). El hook compara `e.agent_type === "tech-lead"`. Dentro de un plugin el evento trae `red-de-seguridad:tech-lead`, así que no coincide y el Tech Lead podría leer `docs/` sin que nada lo frene. Falla en silencio.
2. `Stop en un proyecto con cambios y sin script test` (dio 2, debía dar 0). El hook corre `npm test` sin comprobar que exista. En un proyecto sin ese script, `npm test` falla y el hook bloquea cada cierre del agente. En mi proyecto no pasa porque `package.json` sí tiene `"test": "vitest run"`.

### Qué cambió entre una corrida y otra

Solo la copia de `plugin/scripts/`; los hooks de `.claude/hooks/` siguen idénticos.

| Hook | Cambio |
|---|---|
| `bloquear-peligroso.js` | `e.agent_type === "tech-lead"` pasó a `/(^\|:)tech-lead$/.test(String(e.agent_type \|\| ""))`: reconoce el nombre con o sin prefijo. `mi-tech-lead-2` sigue sin coincidir. |
| `exigir-pruebas.js` | Antes de correr `npm test`, lee `package.json` del proyecto; si no tiene `scripts.test`, sale con 0. |

En ambos se añadió además una frase de "Versión que viaja en el plugin" en el comentario inicial.

### Corrida 2 — con la versión que viaja: 27 de 27

```
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git reset --hard después de &&
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: git reset --hard después de ;
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git push --force
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git push con +rama
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: git clean -fd
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: git checkout -- .
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: git restore .
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: rm -rf
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: rm -r -f
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Bash: rm --recursive --force
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: Remove-Item -Recurse -Force
OK     exit=2 (esperado 2)  bloquear-peligroso.js · PowerShell: rd /s /q
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Evento que no es JSON
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Bash: git status pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · PowerShell: git status pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Bash: git restore --staged pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Bash: rm de un archivo pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · PowerShell: Remove-Item -Force de un archivo pasa
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Tech Lead: Read de docs/ (ruta de Windows)
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Tech Lead: Grep con path docs
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Tech Lead: Read de package.json pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Conversación principal: Read de docs/ pasa
OK     exit=2 (esperado 2)  bloquear-peligroso.js · Plugin: <plugin>:tech-lead, Read de docs/
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Plugin: <plugin>:tech-lead, Read de package.json pasa
OK     exit=0 (esperado 0)  bloquear-peligroso.js · Otro agente con nombre parecido, Read de docs/ pasa
OK     exit=0 (esperado 0)  exigir-pruebas.js · Stop en la segunda vuelta pasa
OK     exit=0 (esperado 0)  exigir-pruebas.js · Stop en un proyecto con cambios y sin script test pasa

27 de 27 casos dan lo esperado.
```

## 3. Validación

```
$ claude plugin validate ./plugin
Validating plugin manifest: <repo>/plugin/.claude-plugin/plugin.json

Provides:

  ❯ hooks: PreToolUse Bash|PowerShell|Read|Grep|Glob command "node \"${CLAUDE_PLUGIN_ROOT}/scripts/bloquear-peligroso.js\""
  ❯ hooks: Stop command "node \"${CLAUDE_PLUGIN_ROOT}/scripts/exigir-pruebas.js\""
  ❯ skills: red-de-seguridad:answer-style
  ❯ skills: red-de-seguridad:valores-ajustables
  ❯ agents: red-de-seguridad:tech-lead

Plugin directory checks ... (subconjunto de lo que corre el directorio público)

✘ Found 1 problem the plugin directory refuses a submission for:
  ❯ LICENSE: License missing (LICENSE_MISSING).

⚠ Found 1 plugin directory warning:
  ❯ .claude-plugin/plugin.json icon: No icon (ICON_MISSING).

These plugin directory checks do not change the result below.

✔ Validation passed
(exit 0)

$ claude plugin validate .
Validating marketplace manifest: <repo>/.claude-plugin/marketplace.json

✔ Validation passed
(exit 0)
```

`<repo>` sustituye la ruta absoluta de mi máquina, que la salida real sí imprime. El aviso de `LICENSE` y el del ícono se ignoran a propósito: el plugin no se publica en ningún directorio (spec, Fase 8.1, "Cómo verificar", punto 2). Las líneas intermedias del bloque de "Plugin directory checks" se resumieron; el veredicto y los avisos están completos.

## 4. Instalado en limpio — Fase 8.2

Fuente: las notas de la prueba (`docs/PRUEBA_PLUGIN.md`, en la carpeta de prueba) y dos archivos de configuración que se leyeron al cerrar. Lo que las notas no dicen aparece como "no consta".

### La carpeta de prueba

- Nombre: `prueba_plugin`, un repositorio que no es MercadoTech Lite.
- Último commit al empezar: `f4c3ffb docs: add project log and update CLAUDE.md at close of Sesión 8`.
- No se commiteó nada en ella.

### Comandos

- `claude plugin list`, en la carpeta de prueba. Mostró `red-de-seguridad@tienda-ensayo`, versión 1.0.0, `Scope: local`, `Status: ✔ enabled`. Leído desde la carpeta `plugin` de este repositorio.
- En la conversación de prueba, con la herramienta Bash: `git status --short` y el reset destructivo con `--hard` sobre `HEAD`.
- Los comandos de instalación (`claude plugin marketplace add` e `install`, con `--scope local`) y los de desinstalación: **no constan** en las notas. Que el plugin quedó instalado consta por el `plugin list`; cómo se desinstaló, no consta.
- PowerShell: no consta. La prueba se hizo solo con Bash.

### Qué actuó

- **Hook `bloquear-peligroso.js`.** `git status --short` corrió sin salida. El reset destructivo no se ejecutó: un hook `PreToolUse` lo bloqueó con el mensaje "Bloqueado por el hook del proyecto: … borra cambios sin commitear", y la línea final dice que viene del plugin `red-de-seguridad@tienda-ensayo`. El árbol ya estaba limpio, así que el comando no habría hecho nada: el hook bloquea por el comando, no por su efecto.
- **Tech Lead.** Apareció en `@` como `red-de-seguridad:tech-lead`. El encargo se escribió como `tech-lead:tech-lead`, que no está en la lista de agentes de la sesión; se usó el más parecido. Con "Audita admin. Usa tu rúbrica." devolvió un informe con la estructura esperada: 4 Críticos, 0 Importantes, 2 Sugerencias, nota con fórmula (-2,5, efectiva 0) y declaración de que no leyó `docs/`. Las notas dicen que sus hallazgos no se verificaron por separado; aquí tampoco.
- **Skill `valores-ajustables`.** Se cargó al invocarla con "sube el umbral de stock bajo a 10". No cambió nada: su texto describe archivos y valores de este proyecto (`app/page.tsx:66` y otros) que no existen en la carpeta de prueba, y allí no hay umbral de stock bajo.

### Qué no actuó o no consta

- **`exigir-pruebas.js` (hook Stop): no consta.** Las notas no lo mencionan.
- **Skill `answer-style`: no consta.**
- **El bloqueo del Tech Lead a leer `docs/` con el nombre con prefijo** (lo que se arregló en la 8.1): no consta. El agente dice que no leyó `docs/`, pero no hubo un intento bloqueado que lo demuestre.
- Las herramientas Grep y Glob no estaban disponibles en esa sesión; la búsqueda se hizo con `grep` desde Bash. La causa no consta.
- Si Claude Code preguntó algo durante la prueba: las notas dicen que no.

### Desinstalación (comprobada al cerrar)

- `.claude/settings.local.json` de la carpeta de prueba: `enabledPlugins` es `{}` y `extraKnownMarketplaces` es `{}`. Lo único más que contiene es `disabledMcpjsonServers: ["mercadotech"]`, que no es del plugin ni de esta prueba y no se tocó.
- `~/.claude/settings.json`: contiene solo `{"theme": "dark"}`. No nombra `tienda-ensayo` ni `red-de-seguridad`.
- La copia en `~/.claude/plugins/cache/`: no se comprobó (según la spec se queda y se borra a mano).

### Qué cambiaría en el plugin (no se cambió en esta fase)

1. **Sacar `valores-ajustables` del plugin, o volverla genérica.** Cargó, pero no sirvió fuera: habla de otro proyecto. La 8.1 ya la marcó como dudosa y la prueba lo confirma.
2. **Cambiar el mensaje del hook.** Dice "hook del proyecto" aunque viene del plugin; en una carpeta ajena confunde.
3. **Escribir en el README el nombre real del agente**, `red-de-seguridad:tech-lead`, para que nadie lo pida como `tech-lead:tech-lead`.
4. **Revisar el alcance del Tech Lead.** Con "admin" auditó también redirecciones y sesión (R5 y R6), y la nota se hundió a 0 con un alcance estrecho. Es una duda de las notas, no un defecto demostrado.

### La pregunta de la 8.1: ¿las piezas que dije que viajaban, viajaron?

| Pieza | ¿Viajó? | Evidencia |
|---|---|---|
| Tech Lead | **Sí** | Aparece como `red-de-seguridad:tech-lead` y audita un proyecto ajeno con su formato |
| Hook `bloquear-peligroso.js` | **Sí** | Bloqueó el reset destructivo y dejó pasar `git status --short` |
| Hook `exigir-pruebas.js` | **No consta** | No se probó |
| Skill `answer-style` | **No consta** | No se probó |
| Skill `valores-ajustables` | **Se instaló, no sirvió** | Cargó, pero su contenido es de MercadoTech Lite y no había nada que ajustar |

Dos de las cinco piezas están comprobadas; una está instalada y no sirve fuera; dos no se probaron.
