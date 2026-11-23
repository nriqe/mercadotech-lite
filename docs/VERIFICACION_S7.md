# Verificación del terreno — Sesión 7

Fecha: 2026-11-22

## Versiones

- claude: 2.1.327 (mínimo 2.1.283)
- node: v22.21.1 (mínimo 20)
- npm: 10.9.4
- git: 2.56.0
- gh: 2.97.0, conectado a github.com como `nriqe` (protocolo ssh, token en el llavero; no se muestra)

## Sistema operativo y consolas del agente

- Linux 7.3.3-200.fc44.x86_64 (Fedora).
- Consolas del agente: solo Bash. No hay PowerShell entre las herramientas.

## Commit de arranque

- `cc70188` docs: close Sesión 6 with the safety net.
- Subido: sí, `main...origin/main` sin adelanto ni retraso.
- Único cambio sin seguimiento: `doc_sesions/sesion7/` (la carpeta de la sesión).

## Mi repositorio

- `git@github.com:nriqe/mercadotech-lite.git`

## Red de seguridad (sesión 6)

Lista `deny`, citada de `.claude/settings.json`:

```json
"deny": [
  "Edit(./docs/00-ANTES.md)",
  "Edit(./docs/MEDICIONES.md)",
  "Edit(./.claude/settings.json)",
  "Edit(./.claude/hooks/**)"
]
```

La red es de la versión 2:

- Matcher de PreToolUse: `Bash|PowerShell|Read|Grep|Glob`, nombra PowerShell: sí.
- `git push` en `ask`: `Bash(git push *)` y `PowerShell(git push *)`, y también las formas sin argumentos.
- Listas `allow` y `ask` presentes; hooks PreToolUse y Stop presentes.
- Aún no están las dos reglas `Read(./.env)` y `Read(./.env.*)`: las pega la persona en la Fase 7.1.

Salida final de `node .claude/hooks/probar-hooks.js`:

```
23 de 23 casos dan lo esperado.
```

## Cómo pago Claude

Plan Claude Pro (`docs/00-ANTES.md` §2: `authMethod: claude.ai`, `subscriptionType: pro`), sin saldo de API.
Secreto de la Fase 7.2: **`CLAUDE_CODE_OAUTH_TOKEN`** (se genera con `claude setup-token`). No `ANTHROPIC_API_KEY`.

## Regla de seguridad del CLAUDE.md

> - /admin y createProductAction exigen un administrador, no solo una sesión. Hoy solo comprueban `if (!user)`
>   (app/admin/page.tsx:9 y app/actions.ts:144), y el registro es libre.
>   Verificación: `grep -rniE "role|is_admin|isAdmin" lib app components` no debe salir vacío, y debe haber una comprobación en los dos archivos.

## Otras comprobaciones

- `npm test`: pasa (1 archivo, 3 pruebas).
- `.gitignore` excluye `.env`, `.env*.local` y `.env.*`, y la base local (`data/*.db`, `data/*.db-*`).
- `.github/workflows/` no existe todavía.

## Veredicto

Terreno listo para la Fase 7.1: todo coincide con lo esperado, con `gh` ya conectado y la red de la versión 2.
