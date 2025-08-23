'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

async function safeJson(res: Response) { try { return await res.json() } catch { return null } }

export default function NewCategoriaPage() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [err, setErr] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await safeJson(res)
      if (res.ok) {
        try { router.replace('/admin/categories') } catch {}
        if (typeof window !== 'undefined') window.location.replace('/admin/categories')
        return
      }
      throw new Error((data && (data.error || data.message)) || 'No se pudo crear')
    } catch (e: any) {
      setErr(e?.message || 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 max-w-md space-y-4 bg-gray-900 text-white border border-gray-700 placeholder-gray-400">
      <h1 className="text-xl font-semibold">Nueva Categoría</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            placeholder="Nombre"
            required
          />
        </div>
        <button disabled={saving} className="rounded-xl px-4 py-2 border">
          {saving ? 'Guardando…' : 'Crear'}
        </button>
        {err && <div className="text-sm">{err}</div>}
      </form>
    </div>
  )
}
