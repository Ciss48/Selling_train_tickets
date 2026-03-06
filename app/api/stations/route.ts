import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ data: stations, error: null })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}
