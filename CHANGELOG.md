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

## v11 (2025-08-23)
### UX Crear producto
- Manejador **handleSubmit** robusto: normaliza números, envía JSON con `Content-Type`, muestra error real y **redirige** a `/admin/products` en éxito.
- Limpieza de duplicados `price/cost/stock` en el payload.

## v12 (2025-08-23)
### Listado de productos
- **Fetch robusto** en `app/admin/products/page.tsx` usando `headers()` para construir una URL absoluta en SSR.
- `cache: 'no-store'` para evitar resultados vacíos por caché.

## v13 (2025-08-23)
### Fix build
- Se eliminó una llave `}` extra después de `getProducts()` en `app/admin/products/page.tsx` que causaba el error *Expression expected* en el build.

## v14 (2025-08-23)
### Fix build (products list)
- Cerrado correctamente `type Product` y eliminado `}` duplicado en `app/admin/products/page.tsx`.
