# Guion de presentación — MercadoTech Lite

Cinco minutos, cronometrados. Cinco bloques de un minuto. **Cada bloque dice qué
se muestra, el dato exacto y de qué archivo sale.** Si un dato no se midió, dice
"sin medir" y se dice en voz alta; no se completa de memoria.

**Repositorio:** `nriqe/mercadotech-lite` (público). No hay URL desplegada: todo
se muestra desde archivos y terminal.

---

## Antes de empezar (el día anterior, no cinco minutos antes)

- [ ] `git status --short` no muestra cambios sin commitear salvo los esperados.
- [ ] `npm test` termina en verde (`Tests 8 passed (8)`, exit 0).
- [ ] `node .claude/hooks/probar-hooks.js` termina en `23 de 23 casos dan lo esperado.`
- [ ] `node plugin/scripts/probar-hooks.js` termina en `27 de 27 casos dan lo esperado.`
- [ ] Tres pestañas del editor abiertas, en este orden: `docs/00-ANTES.md`, `docs/REVISION.md`, `docs/PLUGIN.md`.
- [ ] Una terminal en la raíz del proyecto con los greps de los bloques 1 y 4 ya escritos, sin ejecutar.
- [ ] Una terminal en `curso-ed5/prueba_plugin` para el bloque 5.
- [ ] Notificaciones del sistema silenciadas.
- [ ] No abrir ningún archivo `.env*`. Ninguna parte del guion los necesita.

> **Regla del guion:** cada cifra de abajo está en el archivo que se cita. Si el
> archivo cambia, el guion cambia; no al revés.

---

## Minuto 0–1 · El antes (sesión 1)

**En pantalla:** `docs/00-ANTES.md`, sección "INVENTARIO DE DAÑOS", y la terminal
con `npm test`.

**Dato grande:** `npm test` → **`Missing script: "test"`** (sesión 1) contra
**`Tests 8 passed (8)`, exit 0** (hoy).

| Dato | Valor | Archivo |
|---|---|---|
| Defectos del inventario que aparecieron | 6 de 6 (4 de la lista, 2 extra) | `docs/00-ANTES.md`, Inventario de daños |
| Archivos `.tsx` que consultaban la base | 5 | `docs/00-ANTES.md`, defecto 1 |
| Pruebas en la sesión 1 | 0 | `docs/00-ANTES.md`, defecto 3 |
| Pruebas hoy | 8, en 2 archivos | `docs/BITACORA.md`, Sesión 7 · `npm test` en vivo |
| Fila S1 de la tarea patrón | a la primera · 0 turnos · 1 minuto · US$ 0.43 · 7 decisiones no pedidas | `docs/MEDICIONES.md`, fila S1 |
| Costo de generar la app | US$ 1.53 · 7 min 21 s · 1 turno | `docs/00-ANTES.md`, FACTURA |

Decir: "Esto es lo que había antes de escribir una sola regla. Seis defectos, cero
pruebas. De los seis, hoy están cerrados el 3 y el 4."

Mostrar en la terminal, en vivo, lo que sigue abierto:

```bash
grep -rlE "getDb\(\)|\.prepare\(" app components --include="*.tsx"
```

Hoy devuelve 4 archivos (eran 5; `CLAUDE.md` nombra los mismos 4). Los defectos
5 y 6 (`app/actions.ts:47`, `lib/auth.ts:35`) siguen abiertos según `CLAUDE.md`. Defecto 2 (valores sueltos) tras la sesión 4: **sin medir**
(`docs/BITACORA.md`, "Pendiente para la sesión 8", punto 6).

---

## Minuto 1–2 · El contrato y el costo (sesiones 2 y 3)

**En pantalla:** `CLAUDE.md` (las reglas de arquitectura) y `docs/COSTOS.md`.

**Dato grande:** la misma tarea con tres configuraciones: **US$ 0.87 · US$ 0.30 ·
US$ 0.35** (A, B, C).

| Corrida | Configuración | Turnos | Duración | Costo | Archivo |
|---|---|---|---|---|---|
| S1 | sin reglas | 0 | 1 minuto | US$ 0.43 | `docs/MEDICIONES.md` |
| S2 | con `CLAUDE.md` | 1 | 7 minutos | US$ 1.89 (script viejo, no comparable) | `docs/MEDICIONES.md` |
| A | opus-5-5 · medium | 0 | 2 minutos | US$ 0.87 | `docs/COSTOS.md` |
| B | opus-5-5 · low | 0 | 1 minuto | US$ 0.30 | `docs/COSTOS.md` |
| C | sonnet-5-5 · medium | 0 | 2 minutos | US$ 0.35 | `docs/COSTOS.md` |

Decisiones no pedidas: S1 7 · S2 11 (3 con ⚠️) · A 12 (4 con ⚠️) · B sin medir ·
C 9 (4 con ⚠️). Fuente: `docs/MEDICIONES.md` y `docs/COSTOS.md`.

Decir, con los límites incluidos: "S2 no se puede comparar: se midió con el script
viejo. A incluye la enumeración, el commit y la medición; B y C no hicieron ese
trabajo. B no recorrió los 5 pasos de verificación."

**La regla** (`docs/COSTOS.md`, sección Regla): tareas con varios criterios que
hay que poder comprobar → opus-5-5 · medium (pasó los 5 pasos a la primera);
cambios chicos que reviso yo → opus-5-5 · low.

---

## Minuto 2–3 · El revisor (sesión 5)

**En pantalla:** `docs/REVISION.md`, la tabla de la sección 3 "Nota".

**Dato grande:** nota del Tech Lead sobre `app/page.tsx`: **8,75 → 9**.

| Dato | Valor | Archivo |
|---|---|---|
| Nota antes | 10 − (3 × 0) − (1 × 1) − (0,25 × 1) = 8,75 | `docs/REVISION.md` §2 |
| Nota después | 10 − (3 × 0) − (1 × 1) − (0,25 × 0) = 9 | `docs/REVISION.md` §3 |
| Qué se corrigió | 1 hallazgo de 3: `formatPEN` pasó a `lib/format.ts` | `docs/REVISION.md` §3 |
| Qué sigue igual | falta de pruebas (Importante, resta 1) | `docs/REVISION.md` §3 |
| Autor contra revisor, mismo commit `b1a9221` | autor 11 decisiones (3 con ⚠️) · revisor 11 (5 con ⚠️) | `docs/REVISION.md` §1 |
| Coincidencias | 9 de 11 · con ⚠️: 0 | `docs/REVISION.md` §1, "El conteo" |
| Contexto de la conversación al delegar | 49,9 mil → 69,9 mil | `docs/REVISION.md` §1 |

Decir: "La mejora de 0,25 viene solo de la sugerencia corregida. El revisor ve lo
que está dentro del módulo que se le da: no vio los defectos 4, 5 y 6 porque
viven en otros archivos."

---

## Minuto 3–4 · La red (sesiones 6 y 7)

**En pantalla:** `docs/PERMISOS.md`, la tabla; después `docs/BITACORA.md`, la tabla
de PR de la Sesión 7; en la terminal, el grep de seguridad.

**Dato grande:** `grep -rniE "role|is_admin|isAdmin" lib app components` →
**sin resultados** (sesión 1) contra **`isAdmin` en `app/admin/page.tsx:11` y
`app/actions.ts:146`** (hoy).

| Qué | Dato | Archivo |
|---|---|---|
| Lo que bloquea | hook `bloquear-peligroso.js`: 23 de 23 casos | `docs/VERIFICACION_S8.md` |
| Reglas de la matriz | 12 (2 `deny` de `Edit`, 8 `ask`, 2 `allow`) | `docs/PERMISOS.md` |
| Intentos de leer `.env.local` | 4 intentos, 0 lecturas (2 por regla, 1 por el clasificador, 1 no aplica) | `docs/SECRETOS.md` |
| Lo que exige | Stop: `npm test` en verde antes de terminar | `CLAUDE.md`, `.claude/hooks/exigir-pruebas.js` |
| PR revisados | 2 de 2: CI `success`, revisión `success`, 0 comentarios | `docs/BITACORA.md`, Sesión 7 |
| Inyección (issue 3) | el agente trabajó en solo lectura; `docs/00-ANTES.md` y `docs/MEDICIONES.md` sin cambios | `docs/INYECCION.md`, `docs/BITACORA.md` |
| Qué frenó al agente en la inyección | **sin medir** (`docs/INYECCION.md` termina a mitad de la sección 2) | `docs/INYECCION.md` |

Decir los límites: "`success` de la revisión solo dice que la Action corrió;
no sé qué concluyó. El hueco de `node -e` lo cerró el clasificador en una
llamada, no una regla; el sandbox no está activado. Que `/admin` rechace a un
usuario sin permiso con la app corriendo: sin medir."

---

## Minuto 4–5 · El paquete (sesión 8)

**En pantalla:** `docs/PLUGIN.md`, §2 (las dos corridas) y la tabla de §4; en la
terminal de `prueba_plugin`, `claude plugin list`.

**Dato grande:** **2 de 5** piezas comprobadas en una carpeta ajena.

| Dato | Valor | Archivo |
|---|---|---|
| Probador de hooks, copia sin adaptar | 25 de 27 | `docs/PLUGIN.md` §2, corrida 1 |
| Probador de hooks, versión que viaja | 27 de 27 | `docs/PLUGIN.md` §2, corrida 2 |
| `claude plugin validate ./plugin` y `.` | `Validation passed`, exit 0 | `docs/PLUGIN.md` §3 |
| Viajaron y se comprobaron | Tech Lead (`red-de-seguridad:tech-lead`), hook `bloquear-peligroso.js` | `docs/PLUGIN.md` §4 |
| Se instaló y no sirvió fuera | skill `valores-ajustables` | `docs/PLUGIN.md` §4 |
| No se probaron | hook `exigir-pruebas.js`, skill `answer-style` | `docs/PLUGIN.md` §4 |
| Quedó fuera | permisos, MCP `conversaciones`, workflows | `plugin/README.md` |

Decir: "Dos de cinco piezas están comprobadas; una cargó y no sirve fuera; dos
no se probaron. Lo que cambiaría está en §4: sacar `valores-ajustables` y
cambiar el mensaje del hook, que dice 'del proyecto' aunque venga del plugin."

---

## Plan B — lo que se rompe en vivo

| Si falla… | Haz esto |
|---|---|
| **`npm test` o un probador de hooks no da el resultado esperado** | No lo depures. Muestra la salida ya registrada: `docs/BITACORA.md` (8 pruebas), `docs/VERIFICACION_S8.md` (23 de 23), `docs/PLUGIN.md` §2 (27 de 27) |
| **`claude plugin list` no muestra el plugin en `prueba_plugin`** | Enseña `docs/PLUGIN.md` §4, "Comandos": el `plugin list` de la prueba dice `red-de-seguridad@tienda-ensayo`, 1.0.0, `Scope: local`, `enabled` |
| **GitHub no carga (PR y CI)** | Usa la tabla de PR de `docs/BITACORA.md`, Sesión 7: PR 1 y PR 2, CI y revisión en `success` |
| **Una cifra no coincide con la que dices** | Di la que está en el archivo y sigue. Se corrige el guion después, no en vivo |
| **Te preguntan algo que no se midió** | Di "sin medir" y señala dónde lo dice el archivo: defecto 2 (`BITACORA.md`), inyección (`INYECCION.md`), hook `exigir-pruebas.js` y `answer-style` en el plugin (`PLUGIN.md` §4) |
| **Te pasas de cinco minutos en el ensayo** | Se recorta contenido, no se habla más rápido. Primero sale la fila S2 del bloque 2 y la fila de contexto del bloque 3 |

**Ten las tres pestañas y el video del ensayo abiertos antes de empezar.** Un plan B que hay que buscar no es un plan B.

---

Ensayo cronometrado: 5:08
