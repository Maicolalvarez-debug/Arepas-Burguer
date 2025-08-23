'use server'
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
  const h = headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('x-forwarded-host') || h.get('host')
  return host ? `${proto}://${host}` : ''
}

async function getJSON(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || getBaseUrl()
  const url = base ? `${base}${path}` : path
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  if (Array.isArray(data)) return data
  if (data && Array.isArray((data as any).items)) return (data as any).items
  return []
}

export default async function Page() {
  const [products, categories] = await Promise.all([
    getJSON('/api/products'),
    getJSON('/api/categories')
  ])
  return <ProductsTable products={products} categories={categories} />
}
