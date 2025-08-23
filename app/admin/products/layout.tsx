import WipeAllButton from './WipeAllButton'
import React from 'react'
import Link from 'next/link'

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Link href="/admin/products/new" className="border rounded px-3 py-1 hover:bg-white/10 transition">
          Crear producto
        </Link>
        <div className="flex items-center gap-2">
      <a className="border rounded px-3 py-1 hover:bg-white/10 transition" href="/admin/products/new">Crear producto</a>
      {/* Danger Zone */}
      {/* @ts-expect-error Server/Client boundary */}
      <WipeAllButton />
    </div>
  </div>
      <div>{children}  <div className="flex items-center gap-2">
      <a className="border rounded px-3 py-1 hover:bg-white/10 transition" href="/admin/products/new">Crear producto</a>
      {/* Danger Zone */}
      {/* @ts-expect-error Server/Client boundary */}
      <WipeAllButton />
    </div>
  </div>
      <div className="flex items-center gap-2">
      <a className="border rounded px-3 py-1 hover:bg-white/10 transition" href="/admin/products/new">Crear producto</a>
      {/* Danger Zone */}
      {/* @ts-expect-error Server/Client boundary */}
      <WipeAllButton />
    </div>
  </div>
  )
}
