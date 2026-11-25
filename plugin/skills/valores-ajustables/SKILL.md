---
name: valores-ajustables
description: Mantiene los valores ajustables de MercadoTech Lite (umbrales, límites, duraciones, moneda, imagen por defecto) en lib/constants/ y verifica con grep que no queden sueltos. Úsala ante peticiones como "sube el umbral de stock bajo a 10", "pon la contraseña mínima en 8" o "cambia la duración de la cookie". No cubre lógica de negocio, acceso a datos, estilos ni seguridad (roles, sesiones, redirecciones).
---

# Valores ajustables

Regla: los valores ajustables viven en `lib/constants/`.

## Estado hoy

La regla no se cumple. Solo está en `lib/constants/` el tamaño de página (`lib/constants/catalog.ts`). Siguen sueltos:

- stock bajo `5` (app/page.tsx:66 y app/producto/[id]/page.tsx:24)
- contraseña mínima `6` (app/actions.ts:22)
- imagen por defecto (app/actions.ts:159)
- duración de la cookie (lib/auth.ts:28)
- moneda y locale (lib/db.ts:106)

## Pasos

1. Identifica el valor que la petición cambia o mueve. Si es uno de los de arriba, ubícalo en la línea indicada.
2. Si el valor no está en `lib/constants/`, defínelo ahí (en `lib/constants/catalog.ts` si es del catálogo, o en un archivo nuevo de esa carpeta si no) y expórtalo.
3. Cambia el sitio donde se usa para que importe la constante. No dejes el número, el texto o la configuración fijos en `app/`, `components/` ni `lib/` fuera de `lib/constants/`.
4. Si el mismo valor está repetido en varios archivos (como el stock bajo `5`), conviértelos todos a la misma constante.
5. Ejecuta la verificación.

## Verificación

`grep -rnE "maxAge|60 \* 60|length < 6|<= 5|\"PEN\"|es-PE|placehold\.co/600x450/[^?]*\?text=[$]\{" app components lib`

Solo debe devolver líneas dentro de `lib/constants/`. Si devuelve algo fuera, el valor sigue suelto: dilo en lugar de dar la tarea por terminada.

No hay pruebas ni script de pruebas (`npm test` → `Missing script: "test"`): no digas que las pruebas pasaron.
