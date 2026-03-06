import { randomUUID } from 'crypto'
import { writeFileSync } from 'fs'

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
  { code: 'SE1',  name: 'Reunification Express' },
  { code: 'SE3',  name: 'Reunification Express' },
  { code: 'SE7',  name: 'Reunification Express' },
  { code: 'SE21', name: 'North-Central Express' },
  { code: 'SE22', name: 'North-Central Express' },
  { code: 'HP1',  name: 'Hanoi-Haiphong Express' },
  { code: 'HP3',  name: 'Hanoi-Haiphong Express' },
  { code: 'HP5',  name: 'Hanoi-Haiphong Express' },
]

const SCHEDULE_TEMPLATES = [
  {
    trainCode: 'SE1', originCode: 'HNO', destinationCode: 'SGN',
    departureTime: '19:00', arrivalTime: '04:00+2', durationMins: 1740,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT',      carTypeName: 'Hard Seat',               priceUsd: 1200, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT',      carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1800, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth',     priceUsd: 3500, seatCount: 42 },
      { carNumber: 4, carType: 'SOFT_SLEEPER_4', carTypeName: 'Soft Sleeper 4-berth',     priceUsd: 4500, seatCount: 28 },
    ],
  },
  {
    trainCode: 'SE3', originCode: 'HNO', destinationCode: 'SGN',
    departureTime: '19:30', arrivalTime: '05:10+2', durationMins: 1780,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT',      carTypeName: 'Hard Seat',               priceUsd: 1100, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT',      carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1600, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth',     priceUsd: 3200, seatCount: 42 },
      { carNumber: 4, carType: 'VIP',            carTypeName: 'VIP Air-conditioned',       priceUsd: 7000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'SE7', originCode: 'HNO', destinationCode: 'SGN',
    departureTime: '06:00', arrivalTime: '14:20+1', durationMins: 1700,
    cars: [
      { carNumber: 1, carType: 'SOFT_SEAT',      carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1900, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth',     priceUsd: 3800, seatCount: 42 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_4', carTypeName: 'Soft Sleeper 4-berth',     priceUsd: 5000, seatCount: 28 },
      { carNumber: 4, carType: 'VIP',            carTypeName: 'VIP Air-conditioned',       priceUsd: 7500, seatCount: 20 },
    ],
  },
  {
    trainCode: 'SE21', originCode: 'HNO', destinationCode: 'DAN',
    departureTime: '06:00', arrivalTime: '15:39', durationMins: 579,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT',      carTypeName: 'Hard Seat',               priceUsd:  900, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT',      carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1400, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth',     priceUsd: 2800, seatCount: 42 },
      { carNumber: 4, carType: 'SOFT_SLEEPER_4', carTypeName: 'Soft Sleeper 4-berth',     priceUsd: 3800, seatCount: 28 },
    ],
  },
  {
    trainCode: 'SE22', originCode: 'DAN', destinationCode: 'HNO',
    departureTime: '21:50', arrivalTime: '07:17+1', durationMins: 567,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT',      carTypeName: 'Hard Seat',               priceUsd:  900, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT',      carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1400, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SLEEPER_6', carTypeName: 'Soft Sleeper 6-berth',     priceUsd: 2800, seatCount: 42 },
      { carNumber: 4, carType: 'VIP',            carTypeName: 'VIP Air-conditioned',       priceUsd: 6000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'HP1', originCode: 'HNO', destinationCode: 'HPH',
    departureTime: '06:00', arrivalTime: '08:25', durationMins: 145,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat',               priceUsd:  800, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 4, carType: 'VIP',       carTypeName: 'VIP Air-conditioned',       priceUsd: 2000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'HP3', originCode: 'HNO', destinationCode: 'HPH',
    departureTime: '09:25', arrivalTime: '12:00', durationMins: 155,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat',               priceUsd:  800, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 4, carType: 'VIP',       carTypeName: 'VIP Air-conditioned',       priceUsd: 2000, seatCount: 20 },
    ],
  },
  {
    trainCode: 'HP5', originCode: 'HNO', destinationCode: 'HPH',
    departureTime: '15:15', arrivalTime: '18:00', durationMins: 165,
    cars: [
      { carNumber: 1, carType: 'HARD_SEAT', carTypeName: 'Hard Seat',               priceUsd:  800, seatCount: 56 },
      { carNumber: 2, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 3, carType: 'SOFT_SEAT', carTypeName: 'Soft Seat Air-conditioned', priceUsd: 1100, seatCount: 56 },
      { carNumber: 4, carType: 'VIP',       carTypeName: 'VIP Air-conditioned',       priceUsd: 2000, seatCount: 20 },
    ],
  },
]

function q(str) {
  return `'${String(str).replace(/'/g, "''")}'`
}

function getDateString(offsetDays) {
  const d = new Date('2026-03-06')
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

// ── Build lookup maps ──────────────────────────────────────────────────────────
const stationRows = STATIONS.map(s => ({ ...s, id: randomUUID() }))
const trainRows   = TRAINS.map(t => ({ ...t, id: randomUUID() }))

const stationByCode = Object.fromEntries(stationRows.map(s => [s.code, s]))
const trainByCode   = Object.fromEntries(trainRows.map(t => [t.code, t]))

// ── Generate SQL ───────────────────────────────────────────────────────────────
const lines = []

lines.push('-- ============================================================')
lines.push('-- Vietnam Train Ticket — Seed Data')
lines.push('-- Run this in Supabase SQL Editor')
lines.push('-- ============================================================\n')

// Truncate in dependency order
lines.push('TRUNCATE "Seat", "BookingSeat", "Passenger", "Payment", "Booking", "Car", "Schedule", "Train", "Station" RESTART IDENTITY CASCADE;\n')

// Stations
lines.push('-- Stations')
const stationValues = stationRows.map(s =>
  `(${q(s.id)}, ${q(s.code)}, ${q(s.name)}, ${q(s.nameVi)}, ${q(s.province)})`
)
lines.push(`INSERT INTO "Station" ("id","code","name","nameVi","province") VALUES\n${stationValues.join(',\n')};\n`)

// Trains
lines.push('-- Trains')
const trainValues = trainRows.map(t =>
  `(${q(t.id)}, ${q(t.code)}, ${q(t.name)})`
)
lines.push(`INSERT INTO "Train" ("id","code","name") VALUES\n${trainValues.join(',\n')};\n`)

// Schedules, Cars, Seats
const scheduleValues = []
const carValues      = []
const seatValues     = []

// Fixed seed for reproducible ~30% booking rate
let rngState = 12345
function seededRand() {
  rngState ^= rngState << 13
  rngState ^= rngState >> 17
  rngState ^= rngState << 5
  return (rngState >>> 0) / 0xFFFFFFFF
}

for (let day = 0; day < 30; day++) {
  const travelDate = getDateString(day)

  for (const tmpl of SCHEDULE_TEMPLATES) {
    const scheduleId = randomUUID()
    const originId      = stationByCode[tmpl.originCode].id
    const destinationId = stationByCode[tmpl.destinationCode].id
    const trainId       = trainByCode[tmpl.trainCode].id

    scheduleValues.push(
      `(${q(scheduleId)}, ${q(trainId)}, ${q(originId)}, ${q(destinationId)}, ` +
      `${q(tmpl.departureTime)}, ${q(tmpl.arrivalTime)}, ${tmpl.durationMins}, ${q(travelDate)})`
    )

    for (const car of tmpl.cars) {
      const carId = randomUUID()
      carValues.push(
        `(${q(carId)}, ${q(scheduleId)}, ${car.carNumber}, ` +
        `${q(car.carType)}, ${q(car.carTypeName)}, ${car.priceUsd})`
      )

      for (let s = 1; s <= car.seatCount; s++) {
        const status = seededRand() < 0.3 ? 'BOOKED' : 'AVAILABLE'
        seatValues.push(
          `(${q(randomUUID())}, ${q(carId)}, ${q(String(s))}, '${status}')`
        )
      }
    }
  }
}

// Batch inserts in chunks of 500 to stay under Supabase limits
function batchInsert(table, columns, values, chunkSize = 500) {
  const chunks = []
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize)
    chunks.push(`INSERT INTO "${table}" (${columns}) VALUES\n${chunk.join(',\n')};`)
  }
  return chunks.join('\n')
}

lines.push('-- Schedules')
lines.push(batchInsert('Schedule',
  '"id","trainId","originId","destinationId","departureTime","arrivalTime","durationMins","travelDate"',
  scheduleValues
) + '\n')

lines.push('-- Cars')
lines.push(batchInsert('Car',
  '"id","scheduleId","carNumber","carType","carTypeName","priceUsd"',
  carValues
) + '\n')

lines.push('-- Seats (~30% pre-booked)')
lines.push(batchInsert('Seat',
  '"id","carId","seatNo","status"',
  seatValues
) + '\n')

const sql = lines.join('\n')
writeFileSync('prisma/seed.sql', sql, 'utf8')

console.log(`Generated prisma/seed.sql`)
console.log(`  Stations:  ${stationRows.length}`)
console.log(`  Trains:    ${trainRows.length}`)
console.log(`  Schedules: ${scheduleValues.length}`)
console.log(`  Cars:      ${carValues.length}`)
console.log(`  Seats:     ${seatValues.length}`)
