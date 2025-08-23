'use client'
import React from 'react'

type Product = {
  id: number | string
  name: string
  price?: number
  cost?: number
  stock?: number
  category?: { name?: string } | null
  isActive?: boolean
}
type Category = { id: number | string, name: string }

function formatCurrency(v?: number) {
  if (typeof v !== 'number') return '-'
  return v.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
}

export default function ProductsTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [q, setQ] = React.useState('')
  const [cat, setCat] = React.useState<string>('')

  const filtered = React.useMemo(() => {
    return (products || []).filter(p => {
      const byName = q.trim().length === 0 || (p.name || '').toLowerCase().includes(q.toLowerCase())
      const byCat = !cat || String(cat) === String(categories.find(c => (c.name === (p.category?.name || '')))?.id || '')
      return byName && byCat
    })
  }, [q, cat, products, categories])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Filtrar por nombre..."
          className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
        />
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
        >
          <option value="">Todas las categorías</option>
          {categories?.map(c => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        <div className="text-sm text-white/60">{filtered.length} producto(s)</div>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-white/70">
            <th className="py-2">Nombre</th>
            <th className="py-2">Categoría</th>
            <th className="py-2">Precio</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} className="py-4 text-center text-white/50">No hay productos para mostrar.</td></tr>
          ) : filtered.map(p => (
            <tr key={String(p.id)} className="border-t border-white/10">
              <td className="py-2">{p.name}</td>
              <td className="py-2">{p.category?.name || '-'}</td>
              <td className="py-2">{formatCurrency(p.price)}</td>
              <td className="py-2">{p.isActive ? 'Activo' : 'Inactivo'}</td>
              <td className="py-2">
                <a href={`/admin/products/${p.id}/edit`} className="border rounded px-3 py-1 hover:bg-white/10 transition">Editar</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
