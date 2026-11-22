# CLAUDE.md

## Qué es esto
Tienda de práctica del curso. Sus defectos medidos están en docs/00-ANTES.md; aquí solo entran como reglas.

## Comandos
- `npm run dev`, `npm run build`, `npm run start`, `npm test`: son los scripts de package.json.
- Pruebas: hay (Vitest, `lib/format.test.ts`). `npm test` tiene que pasar antes de dar algo por terminado, y el hook Stop (`.claude/hooks/exigir-pruebas.js`) lo exige.
  Verificación: `npm test` termina en verde (exit 0).

## Reglas de arquitectura
- Los archivos .tsx no consultan la base: nada de `getDb()` ni `.prepare(` en páginas ni layouts. Reciben los datos ya listos de un solo módulo de acceso a datos.
  Hoy no se cumple en 4 archivos: app/layout.tsx, app/producto/[id]/page.tsx, app/carrito/page.tsx, app/pedido/[id]/page.tsx.
  Verificación: `grep -rlE "getDb\(\)|\.prepare\(" app components --include="*.tsx"` debe devolver vacío.

## Seguridad
Esto se exige, aunque hoy no se cumpla.
- /admin y createProductAction exigen un administrador, no solo una sesión. Hoy solo comprueban `if (!user)`
  (app/admin/page.tsx:9 y app/actions.ts:144), y el registro es libre.
  Verificación: `grep -rniE "role|is_admin|isAdmin" lib app components` no debe salir vacío, y debe haber una comprobación en los dos archivos.
- El `next` del login solo acepta rutas internas: empieza por `/` y no por `//`. Hoy app/actions.ts:46 acepta `//sitio-externo.com`.
  Verificación: `grep -n 'redirect(next.startsWith("/") ? next' app/actions.ts` debe devolver vacío.
- La sesión también vence en el servidor: la fila de `sessions` deja de valer cuando vence la cookie (7 días, lib/auth.ts:28).
  Hoy solo se borra al salir (lib/auth.ts:35).
  Verificación: `grep -rn "expires\|created_at <\|DELETE FROM sessions" lib app` debe devolver algo más que lib/auth.ts:35.
