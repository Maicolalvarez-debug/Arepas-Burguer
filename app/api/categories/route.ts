export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' as any }, { name: 'asc' }],
  })
  return NextResponse.json(items, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = (body?.name ?? '').toString().trim()
    if (!name) {
      return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 })
    }
    const created = await prisma.category.create({
      data: { name },
    })
    return NextResponse.json({ ok: true, item: created }, { status: 201 })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'create_failed' }, { status: 500 })
  }
}
