# MercadoTech Lite

Tienda de práctica del curso: catálogo con filtro y paginación, carrito, pedidos y un panel `/admin`, en Next.js con SQLite (`better-sqlite3`).
Está gobernada con un contrato, un revisor, permisos, hooks, CI y un plugin; su punto de partida y sus defectos medidos están en `docs/00-ANTES.md`.

## Cómo correrlo

```bash
npm install
npm run dev      # servidor de desarrollo
npm test         # Vitest; tiene que terminar en verde
npm run build
npm run start
```

Administración: `/admin` y la creación de productos exigen que el correo esté en la variable `ADMIN_EMAILS`; sin ella, nadie es administrador (`lib/admin.ts`).

## Dónde está cada pieza del gobierno

| Pieza | Archivo | Nació en |
|---|---|---|
| Contrato | `CLAUDE.md` | Sesión 2 |
| Skill | `.claude/skills/valores-ajustables/` | Sesión 4 |
| Revisor (Tech Lead) | `.claude/agents/tech-lead.md` | Sesión 5 |
| Permisos | `.claude/settings.json` y `docs/PERMISOS.md` | Sesión 6 |
| Hooks | `.claude/hooks/bloquear-peligroso.js`, `exigir-pruebas.js` y su probador `probar-hooks.js` | Sesión 6 |
| CI y revisión de PR | `.github/workflows/ci.yml` y `claude-review.yml` | Sesión 7 |
| Plugin | `plugin/` y `.claude-plugin/marketplace.json` (ver `plugin/README.md`) | Sesión 8 |

Las mediciones y decisiones están en `docs/` (`MEDICIONES.md`, `COSTOS.md`, `REVISION.md`, `SECRETOS.md`, `INYECCION.md`, `DECISIONES.md`, `PLUGIN.md`). El guion de la presentación es `docs/SHOWCASE.md`.
