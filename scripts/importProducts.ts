// scripts/importProducts.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCategoryId(prisma: PrismaClient, name: string | null) {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed || ['MODIFICADORES','MODIFICADOR','ADICIONALES'].includes(trimmed.toUpperCase())) return null;
  const existing = await prisma.category.findFirst({ where: { name: trimmed } });
  if (existing) return existing.id;
  const created = await prisma.category.create({ data: { name: trimmed, active: true } });
  return created.id;
}


type Row = {
  Nombre: string;
  Categoría: string;
  Precio: string | number;
  Coste: string | number;
};

function toNumber(x: any): number {
  if (typeof x === 'number') return x;
  if (!x) return 0;
  const s = String(x).replace(/\./g,'').replace(/,/g,'').replace(/\s/g,'');
  const n = Number(s);
  if (Number.isNaN(n)) {
    throw new Error(`No pude convertir a número: "${x}"`);
  }
  return n;
}

function norm(str: string) {
  return (str || '').trim();
}

async function main() {
  const csvPath = process.argv[2] || path.join(process.cwd(), 'data', 'productos_y_modificadores.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const records: Row[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const summary = { createdProducts: 0, updatedProducts: 0, createdModifiers: 0, updatedModifiers: 0 };

  for (const r of records) {
    const name = norm((r as any)['Nombre']);
    const category = norm((r as any)['Categoría']);
    const price = toNumber((r as any)['Precio']);
    const cost = toNumber((r as any)['Coste']);

    if (!name) continue;

    // Consideramos "MODIFICADORES" como modificadores; todo lo demás es producto
    const isModifier = category.toUpperCase() === 'MODIFICADORES' || category.toUpperCase() === 'MODIFICADOR' || category.toUpperCase() === 'ADICIONALES';

    if (isModifier) {
      // Upsert de Modificador por name
      const existing = await prisma.modifier.findUnique({ where: { name }}).catch(() => null);
      if (existing) {
        await prisma.modifier.update({
          where: { id: existing.id },
          data: {
            price,
            cost,
            isActive: true
          }
        });
        summary.updatedModifiers += 1;
        console.log(`✓ Modificador actualizado: ${name} -> $${price}`);
      } else {
        await prisma.modifier.create({
          data: {
            name,
            price,
            cost,
            isActive: true
          }
        });
        summary.createdModifiers += 1;
        console.log(`+ Modificador creado: ${name} -> $${price}`);
      }
    } else {
      // Producto
      // Upsert por nombre (único)
      const existing = await prisma.product.findUnique({ where: { name }}).catch(() => null);
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            category,
            price,
            cost,
            isActive: true
          }
        });
        summary.updatedProducts += 1;
        console.log(`✓ Producto actualizado: ${name} -> $${price} (${category})`);
      } else {
        await prisma.product.create({
          data: {
            name,
            category,
            price,
            cost,
            isActive: true
          }
        });
        summary.createdProducts += 1;
        console.log(`+ Producto creado: ${name} -> $${price} (${category})`);
      }
    }
  }

  console.log('\nResumen:');
  console.log(summary);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
