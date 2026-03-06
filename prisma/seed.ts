import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const STATIONS = [
  { code: 'HNO', name: 'Hanoi', nameVi: 'Hà Nội', province: 'Hanoi' },
  { code: 'HPH', name: 'Hai Phong', nameVi: 'Hải Phòng', province: 'Hai Phong' },
  { code: 'NDI', name: 'Nam Dinh', nameVi: 'Nam Định', province: 'Nam Dinh' },
  { code: 'NBH', name: 'Ninh Binh', nameVi: 'Ninh Bình', province: 'Ninh Binh' },
  { code: 'THH', name: 'Thanh Hoa', nameVi: 'Thanh Hóa', province: 'Thanh Hoa' },
  { code: 'VNH', name: 'Vinh', nameVi: 'Vinh', province: 'Nghe An' },
  { code: 'DHO', name: 'Dong Hoi', nameVi: 'Đồng Hới', province: 'Quang Binh' },
  { code: 'DHA', name: 'Dong Ha', nameVi: 'Đông Hà', province: 'Quang Tri' },
  { code: 'HUE', name: 'Hue', nameVi: 'Huế', province: 'Thua Thien Hue' },
  { code: 'DAN', name: 'Da Nang', nameVi: 'Đà Nẵng', province: 'Da Nang' },
  { code: 'QNI', name: 'Quang Ngai', nameVi: 'Quảng Ngãi', province: 'Quang Ngai' },
  { code: 'QNH', name: 'Quy Nhon', nameVi: 'Quy Nhơn', province: 'Binh Dinh' },
  { code: 'NTR', name: 'Nha Trang', nameVi: 'Nha Trang', province: 'Khanh Hoa' },
  { code: 'SGN', name: 'Saigon (HCMC)', nameVi: 'TP. Hồ Chí Minh', province: 'Ho Chi Minh City' },
  { code: 'LCI', name: 'Lao Cai', nameVi: 'Lào Cai', province: 'Lao Cai' },
]

const TRAINS = [
  { code: 'SE1', name: 'Reunification Express' },
  { code: 'SE3', name: 'Reunification Express' },
  { code: 'SE7', name: 'Reunification Express' },
  { code: 'SE21', name: 'North-Central Express' },
  { code: 'SE22', name: 'North-Central Express' },
  { code: 'HP1', name: 'Hanoi-Haiphong Express' },
  { code: 'HP3', name: 'Hanoi-Haiphong Express' },
  { code: 'HP5', name: 'Hanoi-Haiphong Express' },
]

type TrainScheduleTemplate = {
  trainCode: string
  originCode: string
  destinationCode: string
  departureTime: string
  arrivalTime: string
  durationMins: number
  carTemplates: CarTemplate[]
}

type CarTemplate = {
  carNumber: number
  carType: string
  carTypeName: string
  priceUsd: number
  seatCount: number
}

const SCHEDULE_TEMPLATES: TrainScheduleTemplate[] = [
  {
    trainCode: 'SE1',
    originCode: 'HNO',
    destinationCode: 'SGN',
    departureTime: '19:00',
    arrivalTime: '04:00+2',
    durationMins: 1740,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 1200, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1800, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth', priceUsd: 3500, seatCount: 42 },
      { carNumber: 4, carType: 'SOFT_SLEEPER_4', carTypeName: 'Soft Sleeper 4-berth', priceUsd: 4500, seatCount: 28 },
    ],
  },
  {
    trainCode: 'SE3',
    originCode: 'HNO',
    destinationCode: 'SGN',
    departureTime: '19:30',
    arrivalTime: '05:10+2',
    durationMins: 1780,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 1100, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1600, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth', priceUsd: 3200, seatCount: 42 },
      { carNumber: 4, carType: 'VIP', carTypeName: 'VIP Air-conditioned', priceUsd: 7000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'SE7',
    originCode: 'HNO',
    destinationCode: 'SGN',
    departureTime: '06:00',
    arrivalTime: '14:20+1',
    durationMins: 1700,
    carTemplates: [
      { carNumber: 1, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1900, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth', priceUsd: 3800, seatCount: 42 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_4', carTypeName: 'Soft Sleeper 4-berth', priceUsd: 5000, seatCount: 28 },
      { carNumber: 4, carType: 'VIP', carTypeName: 'VIP Air-conditioned', priceUsd: 7500, seatCount: 20 },
    ],
  },
  {
    trainCode: 'SE21',
    originCode: 'HNO',
    destinationCode: 'DAN',
    departureTime: '06:00',
    arrivalTime: '15:39',
    durationMins: 579,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 900, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1400, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth', priceUsd: 2800, seatCount: 42 },
      { carNumber: 4, carType: 'SOFT_SLEEPER_4', carTypeName: 'Soft Sleeper 4-berth', priceUsd: 3800, seatCount: 28 },
    ],
  },
  {
    trainCode: 'SE22',
    originCode: 'DAN',
    destinationCode: 'HNO',
    departureTime: '21:50',
    arrivalTime: '07:17+1',
    durationMins: 567,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 900, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1400, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth', priceUsd: 2800, seatCount: 42 },
      { carNumber: 4, carType: 'VIP', carTypeName: 'VIP Air-conditioned', priceUsd: 6000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'HP1',
    originCode: 'HNO',
    destinationCode: 'HPH',
    departureTime: '06:00',
    arrivalTime: '08:25',
    durationMins: 145,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 800, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 4, carType: 'VIP', carTypeName: 'VIP Air-conditioned', priceUsd: 2000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'HP3',
    originCode: 'HNO',
    destinationCode: 'HPH',
    departureTime: '09:25',
    arrivalTime: '12:00',
    durationMins: 155,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 800, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 4, carType: 'VIP', carTypeName: 'VIP Air-conditioned', priceUsd: 2000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'HP5',
    originCode: 'HNO',
    destinationCode: 'HPH',
    departureTime: '15:15',
    arrivalTime: '18:00',
    durationMins: 165,
    carTemplates: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat', priceUsd: 800, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 4, carType: 'VIP', carTypeName: 'VIP Air-conditioned', priceUsd: 2000, seatCount: 20 },
    ],
  },
]

function getDateString(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.bookingSeat.deleteMany()
  await prisma.passenger.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.car.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.train.deleteMany()
  await prisma.station.deleteMany()

  // Create stations
  const stationMap = new Map<string, string>()
  for (const s of STATIONS) {
    const station = await prisma.station.create({ data: s })
    stationMap.set(s.code, station.id)
  }
  console.log(`Created ${STATIONS.length} stations`)

  // Create trains
  const trainMap = new Map<string, string>()
  for (const t of TRAINS) {
    const train = await prisma.train.create({ data: t })
    trainMap.set(t.code, train.id)
  }
  console.log(`Created ${TRAINS.length} trains`)

  // Create schedules for next 30 days
  let scheduleCount = 0
  let seatCount = 0

  for (let day = 0; day < 30; day++) {
    const travelDate = getDateString(day)

    for (const template of SCHEDULE_TEMPLATES) {
      const originId = stationMap.get(template.originCode)!
      const destinationId = stationMap.get(template.destinationCode)!
      const trainId = trainMap.get(template.trainCode)!

      const schedule = await prisma.schedule.create({
        data: {
          trainId,
          originId,
          destinationId,
          departureTime: template.departureTime,
          arrivalTime: template.arrivalTime,
          durationMins: template.durationMins,
          travelDate,
        },
      })
      scheduleCount++

      for (const carTemplate of template.carTemplates) {
        const car = await prisma.car.create({
          data: {
            scheduleId: schedule.id,
            carNumber: carTemplate.carNumber,
            carType: carTemplate.carType,
            carTypeName: carTemplate.carTypeName,
            priceUsd: carTemplate.priceUsd,
          },
        })

        // Create seats, randomly pre-book ~30%
        const seats = []
        for (let i = 1; i <= carTemplate.seatCount; i++) {
          const isBooked = Math.random() < 0.3
          seats.push({
            carId: car.id,
            seatNo: String(i),
            status: isBooked ? 'BOOKED' : 'AVAILABLE',
          })
        }

        await prisma.seat.createMany({ data: seats })
        seatCount += seats.length
      }
    }
  }

  console.log(`Created ${scheduleCount} schedules`)
  console.log(`Created ${seatCount} seats`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
