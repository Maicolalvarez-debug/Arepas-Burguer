import ProductsTable from './ProductsTable'
import { headers } from 'next/headers'

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

function getBaseUrl() {
  const hdrs = headers()
  const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || ''
  const proto = hdrs.get('x-forwarded-proto') || 'https'
  return host ? `${proto}://${host}` : ''
}

async function getProducts(): Promise<Product[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || getBaseUrl()
    const url = base ? `${base}/api/products` : `/api/products`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : [])
  } catch { return [] }
}

async function getCategories(): Promise<Category[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || getBaseUrl()
    const url = base ? `${base}/api/categories` : `/api/categories`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : [])
  } catch { return [] }
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <a href="/admin/products/new" className="border rounded px-3 py-1 hover:bg-white/10 transition">
          Crear producto
        </a>
      </div>
      <ProductsTable products={products} categories={categories} />
    </div>
  )
}
