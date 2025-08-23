# Importación masiva de productos y modificadores

Este paquete añade:
- `data/productos_y_modificadores.csv` (copiado del archivo que enviaste)
- `scripts/importProducts.ts` (script Node/TypeScript con Prisma + csv-parse)
- Soporte **GET** en `/api/products/[id]` para evitar 405 al editar (si aplica en tu estructura)
- Script de npm: `npm run import:products`

## Requisitos
- Variables de entorno Prisma: `DATABASE_URL` apuntando a tu BD (local o producción).
- Dependencias añadidas: `csv-parse`, `@prisma/client`, y dev deps `ts-node`, `typescript`.

## Cómo correr el import
```bash
# 1) Instala dependencias
npm i

# 2) Ejecuta migraciones si es necesario (opcional)
npx prisma migrate deploy

# 3) Importa (usa el CSV en /data por defecto)
npm run import:products

# O con ruta explícita:
npx ts-node scripts/importProducts.ts ./data/productos_y_modificadores.csv
```

El script hace **upsert** por nombre:
- Si existe, **actualiza** precio, coste, categoría/isActive.
- Si no existe, **crea** el registro.

### Notas
- Considera como **modificadores** todas las filas con categoría `MODIFICADORES`, `MODIFICADOR` o `ADICIONALES`.
- Todo lo demás se considera **producto**.
- Si no tenías los modelos `Product` y `Modifier` en `prisma/schema.prisma`, los agregué/aseguré campos mínimos.
- Si editabas y te devolvía `405`, ahora hay un handler GET en `/api/products/[id]` (cuando se detectó la ruta).

## Deploy en Vercel
- Realiza el deploy normal (Vercel detecta Next.js). 
- Para poblar la base de datos de producción, ejecuta el script **localmente** con `DATABASE_URL` apuntando a tu BD de producción (o ejecuta un job temporal). No se recomienda exponer un endpoint público para importar.


## Importar desde producción (sin entorno local)

Si ya hiciste deploy en Vercel y no tienes entorno local, puedes usar un endpoint **seguro** para importar:

1. En Vercel → Project Settings → **Environment Variables**:
   - `DATABASE_URL` → tu base de datos de producción
   - `IMPORT_TOKEN` → un token secreto (ej: `ABG-IMP-2025-SECRET`)
2. Haz redeploy para que tome las variables.
3. Ejecuta el import con:
```bash
curl -X POST https://TU_DOMINIO.vercel.app/api/admin/import-products   -H "Authorization: Bearer IMPORT_TOKEN_AQUI"
```
> El CSV `data/productos_y_modificadores.csv` del repo se usa por defecto. Puedes actualizarlo y redeploy para reimportar.
