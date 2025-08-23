import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Product = {
  id: number | string
  name: string
  price?: number
  category?: { name?: string } | null
  isActive?: boolean
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/products`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    const list = Array.isArray(data?.products) ? data.products : (Array.isArray(data) ? data : [])
    return list as Product[]
  } catch {
    return []
  }
}

function formatCurrency(v?: number) {
  if (typeof v !== 'number') return '-'
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
  } catch {
    return String(v)
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-4 space-y-4">
      {/* Header inline (sin import) */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Link
          href="/admin/products/new"
          className="border rounded px-3 py-1 hover:bg-white/10 transition"
        >
          Crear producto
        </Link>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="text-left px-3 py-2">Nombre</th>
              <th className="text-left px-3 py-2">Categoría</th>
              <th className="text-left px-3 py-2">Precio</th>
              <th className="text-left px-3 py-2">Estado</th>
              <th className="text-left px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((p) => (
                <tr key={String(p.id)} className="border-t border-white/10">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p?.category?.name ?? '-'}</td>
                  <td className="px-3 py-2">{formatCurrency(p.price)}</td>
                  <td className="px-3 py-2">{p?.isActive === false ? 'Inactivo' : 'Activo'}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="border rounded px-2 py-1 hover:bg-white/10 transition"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-6 text-center opacity-70" colSpan={5}>
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
