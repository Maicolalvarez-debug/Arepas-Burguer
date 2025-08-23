import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const categories = [{ name: 'Arepas' },{ name: 'Hamburguesas' },{ name: 'Bebidas' },{ name: 'Adiciones' }]
  const catMap = {}
  for (const c of categories) { const up = await prisma.category.upsert({ where: { name: c.name }, update: {}, create: { name: c.name } }); catMap[c.name] = up.id }
  const modifiers = [{ name: 'Queso extra', price: 3000, cost: 1000 },{ name: 'Tocineta', price: 3500, cost: 1500 },{ name: 'Salsa de ajo', price: 0, cost: 200 }]
  for (const m of modifiers) { await prisma.modifier.upsert({ where: { name: m.name }, update: { price: m.price, cost: m.cost }, create: m }) }
  const products = [
    { name: 'Arepa Rellena Pollo', category: 'Arepas', price: 12000, cost: 6000 },
    { name: 'Arepa Rellena Carne', category: 'Arepas', price: 13000, cost: 6500 },
    { name: 'Hamburguesa Clásica', category: 'Hamburguesas', price: 18000, cost: 9000 },
    { name: 'Hamburguesa Doble', category: 'Hamburguesas', price: 23000, cost: 12000 },
    { name: 'Gaseosa 350ml', category: 'Bebidas', price: 4000, cost: 1500 },
    { name: 'Jugo Natural', category: 'Bebidas', price: 6000, cost: 2500 },
  ]
  for (const p of products) {
    const categoryId = catMap[p.category]; if (!categoryId) continue
    await prisma.product.upsert({ where: { name: p.name }, update: { price: p.price, cost: p.cost, categoryId, isActive: true }, create: { name: p.name, price: p.price, cost: p.cost, categoryId, isActive: true } })
  }
}
main().then(async()=>{ console.log('✅ Seed completado.'); await prisma.$disconnect() }).catch(async(e)=>{ console.error('❌ Seed error:', e); await prisma.$disconnect(); process.exit(1) })