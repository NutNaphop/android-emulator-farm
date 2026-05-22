import { NextResponse } from 'next/server'
import { listEmulators, spawnEmulator } from '@/lib/podman'

const MAX_EMULATORS = 3

export async function GET() {
  try {
    const emulators = await listEmulators()
    return NextResponse.json(emulators)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list emulators' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const emulators = await listEmulators()
    if (emulators.length >= MAX_EMULATORS) {
      return NextResponse.json(
        { error: `สร้างได้สูงสุด ${MAX_EMULATORS} emulator` },
        { status: 400 }
      )
    }

    const { device, androidVersion } = await request.json()
    const result = await spawnEmulator(device, androidVersion)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to spawn emulator' }, { status: 500 })
  }
}