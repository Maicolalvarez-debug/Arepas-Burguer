AREPAS BURGUER v37 - Patches (Crear producto | Reordenar categorías | Solo modo oscuro)
==================================================================================================

Instrucciones rápidas
---------------------
1) Copia y pega las carpetas de este zip dentro de la raíz de tu proyecto (donde está la carpeta "app/").
   - Reemplaza los archivos cuando el sistema lo pida.

2) Archivos incluidos:
   - app/admin/categories/CategoriesClient.tsx    (UI con subir/bajar y botón "Guardar orden" -> usa /api/categories/reorder)
   - app/admin/layout.tsx                         (Layout Admin solo MODO OSCURO)
   - app/layout.tsx                               (Layout raíz solo MODO OSCURO)
   - app/admin/products/HeaderCreateButton.tsx    (Componente para mostrar el título + botón "Crear producto")

3) Para el botón "Crear producto" en /admin/products:
   - Abre app/admin/products/page.tsx y, en el JSX, inserta en la parte superior:

       import HeaderCreateButton from './HeaderCreateButton'

       // Dentro del JSX, antes del listado:
       <HeaderCreateButton />

   - Si prefieres reemplazar por completo tu page.tsx para que ya lo incluya, avísame y te genero
     una versión completa alineada a tu fetch/render actual.

4) Migraciones y endpoint
   - Asegúrate de tener el campo "sortOrder" en Category y el endpoint POST /api/categories/reorder activo.
   - Luego: npm run dev (o tu comando) y prueba el reordenamiento + guardado.

5) Nota sobre Modo Oscuro
   - Se eliminó la lógica de cambio de tema. Todo queda en oscuro por defecto en layouts.
   - Si tenías componentes que dependían de "dark:" variantes, seguirán funcionando (el <body> ya está oscuro).

Cualquier ajuste extra que necesites (por ejemplo, reemplazar page.tsx de productos) dime y te genero el archivo exacto.
