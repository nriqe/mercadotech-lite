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
