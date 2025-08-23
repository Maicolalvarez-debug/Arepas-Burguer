'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id }: { id: number | string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const onDelete = async () => {
    if (loading) return
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => null)
      if (res.ok && (data?.ok !== false)) {
        try { router.replace('/admin/products') } catch {}
        if (typeof window !== 'undefined') window.location.replace('/admin/products')
        return
      }
      alert('No se pudo eliminar: ' + (data?.error || res.statusText))
    } catch (e: any) {
      alert('No se pudo eliminar: ' + (e?.message || 'Error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={onDelete} disabled={loading} className="border border-red-500 text-red-300 rounded px-3 py-2 hover:bg-red-500/10 transition">
      {loading ? 'Eliminando…' : 'Eliminar'}
    </button>
  )
}
