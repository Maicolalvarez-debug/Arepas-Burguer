import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!process.env.IMPORT_TOKEN || token !== process.env.IMPORT_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const csvPath = path.join(process.cwd(), 'data', 'productos_y_modificadores.csv');
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const rows: any[] = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

    function toNumber(x: any): number {
      if (typeof x === 'number') return x;
      if (!x) return 0;
      const s = String(x).replace(/\./g,'').replace(/,/g,'').replace(/\s/g,'');
      const n = Number(s);
      if (Number.isNaN(n)) throw new Error(`No pude convertir a número: "${x}"`);
      return n;
    }
    const norm = (s: string) => (s || '').trim();

    const summary = { createdProducts: 0, updatedProducts: 0, createdModifiers: 0, updatedModifiers: 0 };

    for (const r of rows) {
      const name = norm(r['Nombre']);
      const category = norm(r['Categoría']);
      const price = toNumber(r['Precio']);
      const cost = toNumber(r['Coste']);
      if (!name) continue;

      const isModifier = ['MODIFICADORES','MODIFICADOR','ADICIONALES'].includes(category.toUpperCase());

      if (isModifier) {
        const existing = await prisma.modifier.findFirst({ where: { name } }).catch(() => null);
        if (existing) {
          await prisma.modifier.update({ where: { id: existing.id }, data: { price, cost, isActive: true } });
          summary.updatedModifiers++;
        } else {
          await prisma.modifier.create({ data: { name, price, cost, isActive: true } });
          summary.createdModifiers++;
        }
      } else {
        const existing = await prisma.product.findFirst({ where: { name } }).catch(() => null);
        if (existing) {
          await prisma.product.update({ where: { id: existing.id }, data: { category, price, cost, isActive: true } });
          summary.updatedProducts++;
        } else {
          await prisma.product.create({ data: { name, category, price, cost, isActive: true } });
          summary.createdProducts++;
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, summary }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || 'Internal error' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
