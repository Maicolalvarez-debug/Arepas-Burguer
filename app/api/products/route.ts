export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = ((searchParams.get('status') || 'all') as 'active'|'archived'|'all')
  const q = (searchParams.get('q') || '').trim()
  const categoryId = searchParams.get('categoryId')

  const baseWhere: any = {}
  if (q) baseWhere.name = { contains: q, mode: 'insensitive' }
  if (categoryId) baseWhere.categoryId = Number(categoryId)

  let where: any = { ...baseWhere }
  if (status === 'active') where = { ...baseWhere, OR: [{ isActive: true }, { isActive: null as any }] }
  if (status === 'archived') where = { ...baseWhere, isActive: false }
  if (status === 'all') where = baseWhere

  async function safeFind(w: any) {
    try {
      return await prisma.product.findMany({  where: w, include: { category: { select: { name: true } } }, orderBy: [{ categoryId: 'asc' }, { name: 'asc' }] })
    } catch (_e) {
      return await prisma.product.findMany({  include: { category: { select: { name: true } } }, orderBy: [{ categoryId: 'asc' }, { name: 'asc' }] })
    }
  }

  let products = await safeFind(where)
  if (!products.length && status === 'active') {
    products = await safeFind(baseWhere)
  }
  return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store' } })
}


export async function POST(req: NextRequest) {
  try {
    const data = await req.json().catch(() => ({}))
    const name = (data?.name ?? '').toString().trim()
    if (!name) {
      return NextResponse.json({ ok:false, error:'name_required' }, { status: 400 })
    }
    const price = Number(String(data?.price ?? '0').replace(/[\.,\s]/g,''))
    const cost  = Number(String(data?.cost ?? '0').replace(/[\.,\s]/g,''))
    const stock = Number(String(data?.stock ?? '0').replace(/\D+/g,'') || '0')
    const categoryId = data?.categoryId ? Number(data.categoryId) : null
    const isActive = (data?.isActive ?? data?.active) === false ? false : true
    const description = data?.description ? String(data.description) : null
    const image = data?.image ? String(data.image) : null

    const created = await prisma.product.create({ data: {
        name,
        price,
        cost,
        stock,
        isActive,
        active: isActive,
        categoryId,
        description,
        image,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'create_failed' }, { status: 500 })
  }
}
