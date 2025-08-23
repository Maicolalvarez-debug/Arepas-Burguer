'use client'
import Link from 'next/link'

export default function HeaderCreateButton() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Productos</h1>
      <Link
        href="/admin/products/new"
        className="border rounded px-3 py-1 hover:bg-white/10 transition"
      >
        Crear producto
      </Link>
    </div>
  )
}
