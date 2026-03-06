import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: params.scheduleId },
      include: {
        train: true,
        origin: true,
        destination: true,
        cars: {
          include: {
            seats: {
              orderBy: { seatNo: 'asc' },
            },
          },
          orderBy: { carNumber: 'asc' },
        },
      },
    })

    if (!schedule) {
      return NextResponse.json({ data: null, error: 'Schedule not found' }, { status: 404 })
    }

    const data = {
      id: schedule.id,
      trainCode: schedule.train.code,
      trainName: schedule.train.name,
      origin: schedule.origin.name,
      destination: schedule.destination.name,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      durationMins: schedule.durationMins,
      travelDate: schedule.travelDate,
      cars: schedule.cars.map((c) => ({
        id: c.id,
        carNumber: c.carNumber,
        carType: c.carType,
        carTypeName: c.carTypeName,
        priceUsd: c.priceUsd,
        seats: c.seats.map((s) => ({
          id: s.id,
          seatNo: s.seatNo,
          status: s.status,
        })),
      })),
    }

    return NextResponse.json({ data, error: null })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}
