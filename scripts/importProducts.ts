// scripts/importProducts.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  if (Number.isNaN(n)) throw new Error(`No pude convertir a número: "${x}"`);
  return n;
}

const norm = (s: string | null | undefined) => (s ?? '').trim();

async function getCategoryId(name: string | null) {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed || ['MODIFICADORES','MODIFICADOR','ADICIONALES'].includes(trimmed.toUpperCase())) return null;
  const existing = await prisma.category.findFirst({ where: { name: trimmed } });
  if (existing) return existing.id;
  const created = await prisma.category.create({ data: { name: trimmed, active: true } });
  return created.id;
}

async function main() {
  const csvPath = process.argv[2] || path.join(process.cwd(), 'data', 'productos_y_modificadores.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const records: Row[] = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

  const summary = { createdProducts: 0, updatedProducts: 0, createdModifiers: 0, updatedModifiers: 0 };

  for (const r of records) {
    const name = norm(r['Nombre']);
    const category = norm(r['Categoría']);
    const price = toNumber(r['Precio']);
    const cost = toNumber(r['Coste']);
    if (!name) continue;

    const isModifier = ['MODIFICADORES','MODIFICADOR','ADICIONALES'].includes(category.toUpperCase());

    if (isModifier) {
      // Modifier: fields are priceDelta, costDelta, active
      const existing = await prisma.modifier.findFirst({ where: { name } }).catch(() => null);
      if (existing) {
        await prisma.modifier.update({
          where: { id: existing.id },
          data: { priceDelta: price, costDelta: cost, active: true }
        });
        summary.updatedModifiers++;
        console.log(`✓ Modificador actualizado: ${name} -> +$${price} delta`);
      } else {
        await prisma.modifier.create({
          data: { name, priceDelta: price, costDelta: cost, active: true }
        });
        summary.createdModifiers++;
        console.log(`+ Modificador creado: ${name} -> +$${price} delta`);
      }
    } else {
      // Product: fields are price, cost, active, categoryId
      const existing = await prisma.product.findFirst({ where: { name } }).catch(() => null);
      const categoryId = await getCategoryId(category);

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: { price, cost, active: true, categoryId }
        });
        summary.updatedProducts++;
        console.log(`✓ Producto actualizado: ${name} -> $${price}`);
      } else {
        await prisma.product.create({
          data: { name, price, cost, active: true, categoryId }
        });
        summary.createdProducts++;
        console.log(`+ Producto creado: ${name} -> $${price}`);
      }
    }
  }

  console.log('\nResumen:');
  console.log(summary);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
