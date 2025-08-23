'use client'
import React from 'react'

export default function WipeAllButton() {
  const onClick = async () => {
    const token = prompt('⚠️ ES PELIGROSO: escribe tu ADMIN_TOKEN para confirmar borrado TOTAL de productos:')
    if (!token) return
    if (!confirm('¿Seguro que deseas ELIMINAR TODOS los productos? Esta acción no se puede deshacer.')) return
    const res = await fetch('/api/admin/products/wipe', {
      method: 'POST',
      headers: { 'x-admin-token': token },
    })
    const data = await res.json().catch(()=>({}))
    if (res.ok && data?.ok) {
      alert('Productos eliminados. Recargando…')
      location.reload()
    } else {
      alert('No se pudo eliminar. ' + (data?.error || res.statusText))
    }
  }
  return (
    <button onClick={onClick} className="border border-red-500 text-red-300 rounded px-3 py-1 hover:bg-red-500/10 transition">
      Eliminar TODOS
    </button>
  )
}
