import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')
    const date = searchParams.get('date')

    if (!origin || !destination || !date) {
      return NextResponse.json(
        { data: null, error: 'origin, destination, and date are required' },
        { status: 400 }
      )
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        travelDate: date,
        origin: { code: origin },
        destination: { code: destination },
      },
      include: {
        train: true,
        origin: true,
        destination: true,
        cars: {
          include: {
            seats: true,
          },
          orderBy: { carNumber: 'asc' },
        },
      },
      orderBy: { departureTime: 'asc' },
    })

    const data = schedules.map((s) => {
      const totalSeats = s.cars.reduce((sum, c) => sum + c.seats.length, 0)
      const availableSeats = s.cars.reduce(
        (sum, c) => sum + c.seats.filter((seat) => seat.status === 'AVAILABLE').length,
        0
      )
      const lowestPrice = Math.min(...s.cars.map((c) => c.priceUsd))

      return {
        id: s.id,
        trainCode: s.train.code,
        trainName: s.train.name,
        origin: { code: s.origin.code, name: s.origin.name },
        destination: { code: s.destination.code, name: s.destination.name },
        departureTime: s.departureTime,
        arrivalTime: s.arrivalTime,
        durationMins: s.durationMins,
        travelDate: s.travelDate,
        totalSeats,
        availableSeats,
        lowestPrice,
        cars: s.cars.map((c) => ({
          id: c.id,
          carNumber: c.carNumber,
          carType: c.carType,
          carTypeName: c.carTypeName,
          priceUsd: c.priceUsd,
          totalSeats: c.seats.length,
          availableSeats: c.seats.filter((seat) => seat.status === 'AVAILABLE').length,
        })),
      }
    })

    return NextResponse.json({ data, error: null })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(err)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
