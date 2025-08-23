'use client'
import React from 'react'
import ProductsTable from './ProductsTable'

type Product = {
  id: number | string
  name: string
  price?: number
  cost?: number
  stock?: number
  isActive?: boolean | null
  category?: { id?: number|string; name?: string } | null
}
type Category = { id: number | string; name: string }

async function fetchJSON(path: string) {
  try {
    const res = await fetch(path, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as any).items)) return (data as any).items
    return []
  } catch {
    return []
  }
}

export default function ProductsClient({ initialProducts, initialCategories }:{ initialProducts: Product[]; initialCategories: Category[] }) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts || [])
  const [categories, setCategories] = React.useState<Category[]>(initialCategories || [])

  React.useEffect(() => {
    // Si SSR vino vacío, reintentar en cliente
    const needProducts = !products || products.length === 0
    const needCats = !categories || categories.length === 0
    if (!needProducts && !needCats) return
    ;(async () => {
      const [ps, cs] = await Promise.all([
        needProducts ? fetchJSON('/api/products?status=all') : Promise.resolve(products),
        needCats ? fetchJSON('/api/categories') : Promise.resolve(categories)
      ])
      setProducts(ps as Product[])
      setCategories(cs as Category[])
    })()
  }, [])

  return <ProductsTable products={products} categories={categories} />
}
