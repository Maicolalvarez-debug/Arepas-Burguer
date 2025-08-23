import { headers } from 'next/headers'
import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Product = {
  id: number | string
  name: string
  price?: number
  category?: { name?: string } | null
  isActive?: boolean
}

async function getProducts(): Promise<Product[]> {
  try {
    const hdrs = headers();
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || '';
    const protocol = (hdrs.get('x-forwarded-proto') || 'https');
    const base = process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.trim().length > 0
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (host ? `${protocol}://${host}` : '');

    const url = base ? `${base}/api/products` : `/api/products`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch {
    return [];
  }
}
}

function formatCurrency(v?: number) {
  if (typeof v !== 'number') return '-'
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
  } catch {
    return String(v)
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-4 space-y-4">
      {/* Header inline (sin import) */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="text-left px-3 py-2">Nombre</th>
              <th className="text-left px-3 py-2">Categoría</th>
              <th className="text-left px-3 py-2">Precio</th>
              <th className="text-left px-3 py-2">Estado</th>
              <th className="text-left px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((p) => (
                <tr key={String(p.id)} className="border-t border-white/10">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p?.category?.name ?? '-'}</td>
                  <td className="px-3 py-2">{formatCurrency(p.price)}</td>
                  <td className="px-3 py-2">{p?.isActive === false ? 'Inactivo' : 'Activo'}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="border rounded px-2 py-1 hover:bg-white/10 transition"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-6 text-center opacity-70" colSpan={5}>
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
