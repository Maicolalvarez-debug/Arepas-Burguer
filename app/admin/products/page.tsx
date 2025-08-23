import { headers } from 'next/headers'
import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Product = {
  id: number | string
  name: string
  price?: number
  cost?: number
  stock?: number
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

function formatCurrency(v?: number) {
  if (typeof v !== 'number') return '-'
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
  } catch {
    return String(v)
  }
}

async function getCategories(): Promise<{id:number|string, name:string}[]>{
  try {
    const hdrs = headers();
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || '';
    const protocol = (hdrs.get('x-forwarded-proto') || 'https');
    const base = process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.trim().length > 0
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (host ? `${protocol}://${host}` : '');
    const url = base ? `${base}/api/categories` : `/api/categories`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch { return []; }
}

import ProductsTable from './ProductsTable'

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  return (
    <div className="p-4 space-y-4">
      {/* Header inline (sin import) */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <ProductsTable products={products} categories={categories} />
      </div>
    </div>
  )
}
