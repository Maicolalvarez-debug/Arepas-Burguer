# Baseline de migraciones (opcional post-deploy)

Este proyecto está listo para **un solo deploy** porque el postinstall usa `prisma db push` (crea/actualiza el esquema en una base vacía).

Si más adelante quieres migraciones formales desde cero, genera una migración baseline:

```bash
rm -rf prisma/migrations/*
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0000_init/migration.sql
git add prisma/migrations/0000_init
git commit -m "baseline: 0000_init"
git push
```

Después de eso puedes volver a usar `prisma migrate deploy` en vez de `db push`.
