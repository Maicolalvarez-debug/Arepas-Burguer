# Changelog — Arepas Burguer

## v7 (2025-08-23)
### Cambios
- Hotfix de compilación: corrección en `app/admin/products/new/page.tsx` (eliminadas anotaciones inválidas en `useState` para **price**, **cost** y **stock**).
- Este paquete fue probado localmente para evitar el error `Expected ',' got ':'`.

## v8 (2025-08-23)
### Cambios (crear producto)
- **Formulario:** normaliza `price`, `cost` y `stock` a números antes de hacer `fetch`.
- **Formulario:** envía `categoryId: null` cuando no se elige categoría.
- **API:** coerciones/validaciones para números y `categoryId` nullable (si existe `app/api/products/route.ts`).
- Objetivo: evitar `"No se pudo crear"` por tipos/validación.

## v9 (2025-08-23)
### Fix
- Se eliminaron propiedades **duplicadas** en el payload del formulario (`price`, `cost`, `stock`) que causaban el error: *An object literal cannot have multiple properties with the same name* durante el build de TypeScript.
