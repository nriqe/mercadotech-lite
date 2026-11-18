# Verificación de partida — Sesión 4 (2026-11-16)

## Versiones
- claude: 2.1.319 (mínimo 2.1.283: cumple)
- node: v22.21.1
- npm: 10.9.4
- npx: 10.9.4
- git: 2.56.0
- python: 3.14.10

## Commit de partida
`69841d0 Reapply "feat: pattern task run A for Fase 3.2"`
Repo no limpio al arrancar: `?? .claude/` (contiene `.claude/skills/answer-style/SKILL.md`, ya existía; se ignora hoy).

## Reglas de CLAUDE.md (31 líneas) y propuesta
Propuesta, no decisión: la eliges tú en la fase siguiente.

| # | Línea | Regla | Propuesta |
|---|---|---|---|
| 1 | 7 | Solo existen los scripts `dev`, `build`, `start` | Siempre |
| 2 | 8 | No hay pruebas; no decir que pasaron | Siempre |
| 3 | 11 | Los `.tsx` no consultan la base (`getDb()`, `.prepare(`) | A veces: tareas que tocan páginas, layouts o acceso a datos |
| 4 | 16 | Valores ajustables en `lib/constants/` | A veces: tareas que añaden o cambian números, textos o configuración fijos |
| 5 | 24 | `/admin` y `createProductAction` exigen administrador | A veces: tareas de autenticación, roles, `/admin` |
| 6 | 27 | `next` del login solo acepta rutas internas | A veces: tareas de login y redirecciones |
| 7 | 29 | La sesión vence también en el servidor | A veces: tareas de sesiones y cookies |

Criterio: "siempre" = hace falta en cada conversación; "a veces" = solo cuando la tarea es del tipo indicado (eso iría en la descripción de la Skill).

## Defectos del inventario que aparecieron (docs/00-ANTES.md)
1. Componentes que consultan la base
2. Valores ajustables incrustados
3. Cero pruebas
4. Seguridad abierta (una de sus tres formas: `/admin` solo comprueba sesión)
5. Redirección abierta en el login (extra)
6. Sesiones sin vencimiento en el servidor (extra)

## LA CARPETA DE MIS CONVERSACIONES
`Conversaciones en: /home/enriquearias/.claude/projects/-home-enriquearias-datapath-claude-code-for-developers`

Nota: salió al correr `tokens.py` desde la raíz del curso. Corrido desde `mercado-lite` no la encuentra.

## Veredicto
Se puede seguir, con tres avisos: el repo no estaba limpio (`.claude/`), `tokens.py` solo halla las conversaciones desde la raíz, y `tokens.py` dejó archivos `docs/SALIDA_TOKENS.txt` (en `mercado-lite/docs/` y en la raíz).
