'use client'
import React from 'react'
import Link from 'next/link'

type Product = {
  id: number | string
  name: string
  price?: number
  cost?: number
  stock?: number
  isActive?: boolean | null
  category?: { id?: number|string; name?: string } | null
}

type Category = { id: number | string; name: string }

function formatCOP(v: number | undefined) {
  if (typeof v !== 'number' || isNaN(v)) return '—'
  return v.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
}

export default function ProductsTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [q, setQ] = React.useState('')
  const [catId, setCatId] = React.useState<string>('')
  const [status, setStatus] = React.useState<'all' | 'active' | 'archived'>('all')

  const filtered = React.useMemo(() => {
    return (products || []).filter(p => {
      if (q && !String(p.name || '').toLowerCase().includes(q.toLowerCase())) return false
      if (catId && String(p?.category?.id || p?.category) !== String(catId)) return false
      if (status === 'active' && !(p.isActive ?? true)) return false
      if (status === 'archived' && (p.isActive ?? true)) return false
      return true
    })
  }, [products, q, catId, status])

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input
          placeholder="Filtrar por nombre..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400"
        />
        <select
          value={catId}
          onChange={(e) => setCatId(e.target.value)}
          className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700"
        >
          <option value="">Todas las categorías</option>
          {(categories || []).map((c) => (
            <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700"
        >
          <option value="all">Todos los productos</option>
          <option value="active">Activos</option>
          <option value="archived">Archivados</option>
        </select>
      </div>

      <div className="text-sm text-gray-400">{filtered.length} producto(s)</div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400">
            <tr>
              <th className="py-2">Nombre</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td className="py-6 text-center text-gray-400" colSpan={5}>
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={String(p.id)} className="border-t border-gray-800">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.category?.name || '—'}</td>
                <td className="py-2">{formatCOP(p.price)}</td>
                <td className="py-2">{(p.isActive ?? true) ? 'Activo' : 'Archivado'}</td>
                <td className="py-2">
                  <Link href={`/admin/products/${p.id}`} className="underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
