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
type Category = { id: number | string; name: string }

function formatCurrency(v?: number) {
  if (typeof v !== 'number') return '-'
  return v.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
}

export default function ProductsTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [q, setQ] = React.useState('')
  const [catName, setCatName] = React.useState<string>('')
  const [status, setStatus] = React.useState<'all'|'active'|'archived'>('all')

  const catNames = React.useMemo(
    () => Array.from(new Set((categories || []).map((c) => c.name).filter(Boolean))).sort(),
    [categories]
  )

  const filtered = React.useMemo(() => {
    return (products || []).filter((p) => {
      const byName = q.trim().length === 0 || (p.name || '').toLowerCase().includes(q.trim().toLowerCase())
      const byCat = !catName || (p.category?.name || '') === catName
      const byStatus = status === 'all' ? true : (status === 'active' ? !!p.isActive : p.isActive === false)
      return byName && byCat && byStatus
    })
  }, [q, catName, status, products])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar por nombre…"
          className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
        />
        <select
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
        >
          <option value="">Todas las categorías</option>
          {catNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e)=> setStatus(e.target.value as any)}
          className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="archived">Archivados</option>
        }
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
          ) : filtered.map((p) => (
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
