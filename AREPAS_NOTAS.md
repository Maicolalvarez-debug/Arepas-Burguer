# Notas rápidas para Arepas Burguer (fix productos)

## Cómo poblar la base de datos
1. Define `DATABASE_URL` (PostgreSQL o SQLite).
2. Ejecuta:
   ```bash
   npm install
   npx prisma db push
   npm run seed   # corre prisma/seed.mjs
   npm run dev
   ```

## Cambios aplicados
- Botón "Crear producto" duplicado arreglado:
  - Se conserva el header en `app/admin/products/layout.tsx`
  - `app/admin/products/page.tsx` ahora solo lista la tabla (sin header)
  - Eliminado `app/admin/products/HeaderCreateButton.tsx` (ya no se usa)
- `package.json`: agregado `"prisma": { "seed": "node prisma/seed.mjs" }` y script `npm run seed`.
