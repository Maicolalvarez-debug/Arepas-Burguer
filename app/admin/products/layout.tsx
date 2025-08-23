import React from 'react'
import Link from 'next/link'

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Link
          href="/admin/products/new"
          className="border rounded px-3 py-1 hover:bg-white/10 transition"
        >
          Crear producto
        </Link>
      </div>
      <div>{children}</div>
    </div>
  )
}
