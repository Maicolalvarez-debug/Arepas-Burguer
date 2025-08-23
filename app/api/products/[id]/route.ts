export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    const item = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!item) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'get_failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    const data = await req.json().catch(() => ({}))
    const name = (data?.name ?? '').toString().trim()
    if (!name) return NextResponse.json({ ok: false, error: 'name_required' }, { status: 400 })

    const price = Number(String(data?.price ?? '0').replace(/[\.,\s]/g, ''))
    const cost  = Number(String(data?.cost ?? '0').replace(/[\.,\s]/g, ''))
    const stock = Number(String(data?.stock ?? '0').replace(/\D+/g, '') || '0')
    const categoryId = data?.categoryId ? Number(data.categoryId) : null
    const description = (data?.description ?? null) || null
    const image = (data?.image ?? data?.imageUrl ?? null) || null
    const isActive = data?.active ?? data?.isActive ?? true
    const sortOrder = typeof data?.sortOrder === 'number' ? data.sortOrder : 0

    const updated = await prisma.product.update({
      where: { id },
      data: { name, price, cost, stock, isActive, active: isActive, categoryId, description, image, sortOrder },
    })
    return NextResponse.json({ ok: true, item: updated })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'update_failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'delete_failed' }, { status: 500 })
  }
}
