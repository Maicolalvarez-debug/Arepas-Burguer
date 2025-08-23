'use client'
import React from 'react'

export default function DeleteProductInlineButton({ id, onDeleted }:{ id: number | string, onDeleted?: (id: number | string) => void }) {
  const [loading, setLoading] = React.useState(false)
  const onClick = async () => {
    if (loading) return
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(()=>null)
      if (res.ok && (data?.ok !== false)) {
        onDeleted?.(id)
        return
      }
      alert('No se pudo eliminar: ' + (data?.error || res.statusText))
    } catch (e:any) {
      alert('No se pudo eliminar: ' + (e?.message || 'Error'))
    } finally {
      setLoading(false)
    }
  }
  return (
    <button onClick={onClick} disabled={loading} className="border border-red-500 text-red-300 rounded px-2 py-1 hover:bg-red-500/10 transition ml-2">
      {loading ? 'Eliminando…' : 'Eliminar'}
    </button>
  )
}
