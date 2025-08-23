export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import ProductsClient from './ProductsClient'
import { headers } from 'next/headers'

type Product = {
  id: number | string
  name: string
  price?: number
  cost?: number
  stock?: number
  category?: { id?: number|string; name?: string } | null
  isActive?: boolean
}

type Category = { id: number | string; name: string }

function getBaseUrl() {
  const h = headers()
  const env = process.env
  const proto = h.get('x-forwarded-proto') || 'https'
  const host = h.get('x-forwarded-host') || h.get('host') || env.VERCEL_URL || env.NEXT_PUBLIC_BASE_URL || ''
  if (!host) return ''
  if (host.startsWith('http')) return host
  return `${proto}://${host}`
}

async function getJSON(path: string) {
  try {
    const base = (process.env.NEXT_PUBLIC_BASE_URL?.trim() || getBaseUrl())
    const url = base ? `${base}${path}` : path
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as any).items)) return (data as any).items
    return []
  } catch {
    return []
  }
}

export default async function Page() {
  const [products, categories] = await Promise.all([
    getJSON('/api/products?status=all'),
    getJSON('/api/categories')
  ])

  return <ProductsClient initialProducts={products as Product[]} initialCategories={categories as Category[]} />
}
