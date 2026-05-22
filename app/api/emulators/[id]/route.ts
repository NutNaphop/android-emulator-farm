import { NextResponse } from 'next/server'
import { destroyEmulator } from '@/lib/podman'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await destroyEmulator(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to destroy emulator' }, { status: 500 })
  }
}