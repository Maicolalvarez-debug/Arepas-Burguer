export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Status = 'all' | 'active' | 'archived'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = (searchParams.get('status') || 'all') as Status
  const q = (searchParams.get('q') || '').trim()
  const categoryIdParam = searchParams.get('categoryId')

  const where: any = {}
  if (q) where.name = { contains: q, mode: 'insensitive' }
  if (categoryIdParam) where.categoryId = Number(categoryIdParam)

  if (status === 'active') {
    where.OR = [{ isActive: true }, { isActive: null as any }]
  } else if (status === 'archived') {
    where.isActive = false
  }

  const items = await prisma.product.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    include: { category: true },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json().catch(() => ({}))

    const name = (data?.name ?? '').toString().trim()
    if (!name) {
      return NextResponse.json({ ok: false, error: 'name_required' }, { status: 400 })
    }

    const price = Number(String(data?.price ?? '0').replace(/[\.,\s]/g, ''))
    const cost  = Number(String(data?.cost ?? '0').replace(/[\.,\s]/g, ''))
    const stock = Number(String(data?.stock ?? '0').replace(/\D+/g, '') || '0')

    const categoryId = data?.categoryId ? Number(data.categoryId) : null
    const description = (data?.description ?? null) || null
    const image = (data?.image ?? data?.imageUrl ?? null) || null
    const isActive = data?.active ?? data?.isActive ?? true
    const sortOrder = typeof data?.sortOrder === 'number' ? data.sortOrder : 0

    const created = await prisma.product.create({
      data: {
        name, price, cost, stock,
        isActive,
        active: isActive,
        categoryId, description, image, sortOrder,
      },
    })

    return NextResponse.json({ ok: true, item: created }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'create_failed' }, { status: 500 })
  }
}
