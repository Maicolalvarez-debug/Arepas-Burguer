import Link from 'next/link'

// Ajusta imports según cómo obtienes los productos
import { prisma } from '@/lib/db'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-4 space-y-4">
      {/* Encabezado con botón crear producto */}
      

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between border rounded px-3 py-2">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm opacity-70">{p.category?.name}</div>
            </div>
            <Link
              href={`/admin/products/${p.id}`}
              className="border rounded px-2 py-1 hover:bg-white/10 transition"
            >
              Editar
            </Link>
          </div>
        ))}
        {!products.length && <div className="opacity-60">No hay productos.</div>}
      </div>
    </div>
  )
}
