'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type Item = { id: number; name: string }

export default function CategoriesClient({ data }: { data: Item[] }) {
  const [items, setItems] = useState<Item[]>(Array.isArray(data) ? data : [])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string>('')

  const dirty = useMemo(() => {
    const original = (Array.isArray(data) ? data : []).map(x => x.id).join(',')
    const current  = items.map(x => x.id).join(',')
    return original !== current
  }, [data, items])

  async function remove(id: number) {
    if (!confirm('¿Eliminar definitivamente?')) return
    try {
      setBusy(True)
      setMsg('')
      const res = await fetch('/api/categories/' + id, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo eliminar')
      setItems(prev => prev.filter(x => x.id !== id))
    } catch (e:any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  function move(id: number, dir: 'up' | 'down') {
    setItems(prev => {
      const idx = prev.findIndex(x => x.id === id)
      if (idx === -1) return prev
      const j = dir === 'up' ? idx - 1 : idx + 1
      if (j < 0 || j >= prev.length) return prev
      const copy = [...prev]
      ;[copy[idx], copy[j]] = [copy[j], copy[idx]]
      return copy
    })
  }

  async function persist() {
    try {
      setBusy(true)
      setMsg('')
      const ids = items.map(x => x.id)
      const res = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      const json = await res.json()
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo guardar el orden')
      setMsg('Orden guardado')
    } catch (e:any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(''), 2000)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Categorías</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!dirty || busy}
            onClick={persist}
            className={`border rounded px-3 py-1 ${dirty ? 'opacity-100' : 'opacity-50'} ${busy ? 'pointer-events-none' : ''}`}
            title="Guardar orden"
          >
            Guardar orden
          </button>
          <Link href="/admin/categories/new" className="border rounded px-3 py-1">
            Nueva categoría
          </Link>
        </div>
      </div>

      {msg && <div className="text-sm opacity-80">{msg}</div>}

      <div className="space-y-2">
        {items.map((x, i) => (
          <div
            key={x.id}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-900 border-gray-700 text-white"
          >
            <span className="w-6 text-xs opacity-60">{i + 1}</span>
            <span className="flex-1">{x.name}</span>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(x.id, 'up')}
                disabled={i === 0 || busy}
                className="rounded-lg px-2 py-1 border disabled:opacity-40"
                title="Subir"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(x.id, 'down')}
                disabled={i === items.length - 1 || busy}
                className="rounded-lg px-2 py-1 border disabled:opacity-40"
                title="Bajar"
              >
                ↓
              </button>
            </div>

            <Link href={`/admin/categories/${x.id}`} className="rounded-lg px-2 py-1 border">
              Editar
            </Link>
            <button type="button" onClick={() => remove(x.id)} className="rounded-lg px-2 py-1 border">
              Eliminar
            </button>
          </div>
        ))}
        {!items.length && <div className="opacity-60">Sin categorías.</div>}
      </div>
    </div>
  )
}
