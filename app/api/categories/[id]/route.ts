export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    const body = await req.json().catch(() => ({}))
    const name = (body?.name ?? '').toString().trim()
    if (!name) {
      return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 })
    }
    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    })
    return NextResponse.json({ ok: true, item: updated })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'update_failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'delete_failed' }, { status: 500 })
  }
}
