# Arepas Burguer — Base Estable (v21)

Este paquete contiene la versión **estable** con todos los arreglos realizados:

## ✅ Incluye
- **Next.js 14** (App Router) y **Prisma** en **runtime Node.js** para todas las rutas que tocan BD.
- **Productos**
  - Listado con filtros (nombre, categoría, estado).
  - Crear, editar (**PATCH /api/products/:id**), **eliminar** (en edición y desde la tabla).
  - API: `GET/POST /api/products`, `GET/PATCH/DELETE /api/products/[id]`.
- **Categorías**
  - Listado, crear, editar (**PATCH /api/categories/:id**), eliminar.
  - API: `GET/POST /api/categories`, `GET/PATCH/DELETE /api/categories/[id]`.
- **UX**
  - Tema oscuro consistente en formularios.
  - Redirecciones tras crear/guardar.
  - Sin botones duplicados ni botón “Eliminar TODOS”.

## 🚀 Puesta en marcha (local)
1. Crea `.env` con tu conexión a Postgres (Neon, supabase, etc.):
   ```env
   DATABASE_URL="postgres://usuario:pass@host:port/dbname"
   ```
2. Instalar dependencias y preparar Prisma:
   ```bash
   npm i
   npx prisma db push
   npm run dev
   ```
3. Abre `http://localhost:3000`

> **Nota Prisma**: `package.json#prisma` está deprecado por Prisma 7. Más adelante puedes migrar a `prisma.config.ts`. El proyecto funciona correctamente con Prisma 6.x.

## 🌐 Despliegue en Vercel
1. En **Environment Variables**, define:
   - `DATABASE_URL` (cadena de conexión Postgres).
2. Deploy normal.  
   Las rutas de API sensibles ya fuerzan `runtime = 'nodejs'` y `dynamic = 'force-dynamic'` cuando aplica.

## 🧪 Endpoints útiles
- `GET /api/health` → `{ "ok": true }`
- `GET /api/categories` / `POST /api/categories`
- `GET /api/categories/:id` / `PATCH` / `DELETE`
- `GET /api/products` / `POST /api/products`
- `GET /api/products/:id` / `PATCH` / `DELETE`

## 📁 Estructura relevante
```
app/
  admin/
    products/
      page.tsx                # SSR + cliente de refuerzo
      ProductsTable.tsx       # Tabla con filtros y eliminar inline
      [id]/page.tsx           # Editar + botón Eliminar
    categories/
      new/page.tsx            # Crear
      [id]/page.tsx           # Editar
  api/
    health/route.ts           # Health check
    products/route.ts         # GET/POST
    products/[id]/route.ts    # GET/PATCH/DELETE
    categories/route.ts       # GET/POST
    categories/[id]/route.ts  # GET/PATCH/DELETE
```

---

Si quieres, puedo dejarte scripts opcionales de **seed** y una pequeña guía para backup/restauración. ¡Éxitos! 🍔
