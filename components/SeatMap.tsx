'use client'

import { useState, useEffect } from 'react'
import { X, Clock, MapPin } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Seat = {
  id: string
  seatNo: string
  status: 'AVAILABLE' | 'BOOKED' | 'HELD'
}

type Car = {
  id: string
  carNumber: number
  carType: string
  carTypeName: string
  priceUsd: number
  seats: Seat[]
}

type ScheduleDetail = {
  id: string
  trainCode: string
  trainName: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  durationMins: number
  travelDate: string
  cars: Car[]
}

type TrainSummary = {
  id: string
  trainCode: string
  travelDate: string
  lowestPrice: number
  origin: { name: string }
  destination: { name: string }
  departureTime: string
  arrivalTime: string
  durationMins: number
}

export default function SeatMap({
  train,
  adults,
  childCount,
  onClose,
}: {
  train: TrainSummary
  adults: number
  childCount: number
  onClose: () => void
}) {
  const router = useRouter()
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null)
  const [activeCar, setActiveCar] = useState(0)
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const totalPassengers = adults + childCount

  useEffect(() => {
    setLoading(true)
    fetch(`/api/trains/${train.id}/seats`)
      .then((r) => r.json())
      .then((d) => {
        setSchedule(d.data)
        setLoading(false)
      })
  }, [train.id])

  function toggleSeat(seatId: string) {
    setSelectedSeats((prev) => {
      const next = new Set(prev)
      if (next.has(seatId)) {
        next.delete(seatId)
      } else if (next.size < totalPassengers) {
        next.add(seatId)
      }
      return next
    })
  }

  function handleBook() {
    if (!schedule) return
    const car = schedule.cars[activeCar]
    const params = new URLSearchParams({
      scheduleId: schedule.id,
      carId: car.id,
      seatIds: Array.from(selectedSeats).join(','),
      adults: String(adults),
      children: String(childCount),
    })
    router.push(`/checkout?${params}`)
  }

  const currentCar = schedule?.cars[activeCar]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B2545] px-5 py-4 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">{train.trainCode}</span>
                <span className="text-xs text-white/60">{train.travelDate ?? schedule?.travelDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xl font-bold">{train.departureTime}</p>
                  <p className="text-xs text-white/60">{train.origin.name}</p>
                </div>
                <div className="flex flex-col items-center text-white/40">
                  <Clock className="w-3 h-3 mb-0.5" />
                  <span className="text-xs">{formatDuration(train.durationMins)}</span>
                  <div className="w-12 h-px bg-white/30 mt-0.5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{train.arrivalTime}</p>
                  <p className="text-xs text-white/60">{train.destination.name}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#FF6B35]/30 border-t-[#FF6B35] rounded-full animate-spin" />
          </div>
        ) : schedule ? (
          <>
            {/* Car tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto flex-shrink-0 bg-gray-50">
              {schedule.cars.map((car, idx) => {
                const available = car.seats.filter((s) => s.status === 'AVAILABLE').length
                return (
                  <button
                    key={car.id}
                    onClick={() => { setActiveCar(idx); setSelectedSeats(new Set()) }}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 text-center transition-all border-b-2 ${
                      activeCar === idx
                        ? 'border-[#FF6B35] bg-white'
                        : 'border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span className={`text-xs font-bold ${activeCar === idx ? 'text-[#FF6B35]' : 'text-gray-500'}`}>
                      Car {car.carNumber}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{car.carTypeName}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-gray-800">{formatPrice(car.priceUsd)}</span>
                      <span className="text-xs text-emerald-600">·{available} left</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Seat grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {currentCar && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{currentCar.carTypeName}</h3>
                      <p className="text-sm text-gray-500">Car {currentCar.carNumber} · {formatPrice(currentCar.priceUsd)} per seat</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        Selected: {selectedSeats.size}/{totalPassengers}
                      </p>
                      <p className="text-xs text-gray-400">
                        {currentCar.seats.filter((s) => s.status === 'AVAILABLE').length} seats available
                      </p>
                    </div>
                  </div>

                  {/* Train front indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Front of train</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Seat grid — rows of 4 with center aisle */}
                  <div className="max-w-xs mx-auto space-y-1.5">
                    {Array.from({ length: Math.ceil(currentCar.seats.length / 4) }, (_, rowIdx) => {
                      const rowSeats = currentCar.seats.slice(rowIdx * 4, rowIdx * 4 + 4)
                      return (
                        <div key={rowIdx} className="flex items-center gap-1">
                          {rowSeats.slice(0, 2).map((seat) => {
                            const isAvailable = seat.status === 'AVAILABLE'
                            const isBooked = seat.status === 'BOOKED' || seat.status === 'HELD'
                            const isSelected = selectedSeats.has(seat.id)
                            return (
                              <button
                                key={seat.id}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => toggleSeat(seat.id)}
                                className={`flex-1 h-10 rounded-lg text-xs font-bold transition-all ${
                                  isBooked
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-[#FF6B35] text-white shadow-[0_2px_8px_rgba(255,107,53,0.4)] scale-105'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-400'
                                } disabled:cursor-not-allowed`}
                              >
                                {seat.seatNo}
                              </button>
                            )
                          })}
                          {/* Aisle gap */}
                          <div className="w-4 flex-shrink-0 flex items-center justify-center">
                            <div className="w-px h-5 bg-gray-200" />
                          </div>
                          {rowSeats.slice(2, 4).map((seat) => {
                            const isAvailable = seat.status === 'AVAILABLE'
                            const isBooked = seat.status === 'BOOKED' || seat.status === 'HELD'
                            const isSelected = selectedSeats.has(seat.id)
                            return (
                              <button
                                key={seat.id}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => toggleSeat(seat.id)}
                                className={`flex-1 h-10 rounded-lg text-xs font-bold transition-all ${
                                  isBooked
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-[#FF6B35] text-white shadow-[0_2px_8px_rgba(255,107,53,0.4)] scale-105'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-400'
                                } disabled:cursor-not-allowed`}
                              >
                                {seat.seatNo}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-6">
                    {[
                      { color: 'bg-emerald-100 border border-emerald-200', label: 'Available' },
                      { color: 'bg-gray-200', label: 'Sold' },
                      { color: 'bg-[#FF6B35]', label: 'Selecting' },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded ${color}`} />
                        <span className="text-xs text-gray-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer action */}
            <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-[#0B2545]">
                    {currentCar ? formatPrice(currentCar.priceUsd * selectedSeats.size) : '$0.00'}
                  </p>
                </div>
                <button
                  onClick={handleBook}
                  disabled={selectedSeats.size !== totalPassengers}
                  className="px-8 py-3 bg-[#FF6B35] hover:bg-[#e85c28] active:bg-[#d44e1f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(255,107,53,0.35)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.5)]"
                >
                  Book {totalPassengers} {totalPassengers === 1 ? 'ticket' : 'tickets'}
                </button>
              </div>
              {selectedSeats.size < totalPassengers && (
                <p className="text-xs text-center text-gray-400">
                  Please select {totalPassengers - selectedSeats.size} more seat{totalPassengers - selectedSeats.size !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 text-gray-500">
            Failed to load seat map
          </div>
        )}
      </div>
    </div>
  )
}
