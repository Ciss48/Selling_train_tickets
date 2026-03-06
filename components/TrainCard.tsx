'use client'

import { Clock, Users, ChevronRight } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/utils'

type Car = {
  id: string
  carNumber: number
  carType: string
  carTypeName: string
  priceUsd: number
  totalSeats: number
  availableSeats: number
}

type TrainResult = {
  id: string
  trainCode: string
  trainName: string
  origin: { code: string; name: string }
  destination: { code: string; name: string }
  departureTime: string
  arrivalTime: string
  durationMins: number
  travelDate: string
  totalSeats: number
  availableSeats: number
  lowestPrice: number
  cars: Car[]
}

export default function TrainCard({
  train,
  onSelectSeat,
}: {
  train: TrainResult
  onSelectSeat: (train: TrainResult) => void
}) {
  const seatsLow = train.availableSeats <= 10
  const soldOut = train.availableSeats === 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)] transition-all overflow-hidden">
      <div className="flex items-center gap-4 p-4 md:p-5">
        {/* Train code badge */}
        <div className="flex-shrink-0 text-center">
          <div className="bg-[#0B2545] text-white rounded-xl px-3 py-2 min-w-[60px]">
            <span className="text-xs text-white/60 block">Train</span>
            <span className="text-base font-bold tracking-wide">{train.trainCode}</span>
          </div>
        </div>

        {/* Times + duration */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 leading-none">{train.departureTime}</p>
            <p className="text-xs text-gray-500 mt-1">{train.origin.name}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-2">
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <Clock className="w-3 h-3" />
              {formatDuration(train.durationMins)}
            </div>
            <div className="relative w-full">
              <div className="h-px bg-gray-200 w-full" />
              <div className="absolute inset-0 flex items-center justify-end pr-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-start pl-0">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 leading-none">{train.arrivalTime}</p>
            <p className="text-xs text-gray-500 mt-1">{train.destination.name}</p>
          </div>
        </div>

        {/* Seats + price + button */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-2">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                soldOut
                  ? 'bg-red-50 text-red-600'
                  : seatsLow
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {soldOut ? 'Sold out' : `${train.availableSeats} seats`}
            </span>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">from</p>
            <p className="text-xl font-bold text-[#0B2545]">{formatPrice(train.lowestPrice)}</p>
          </div>

          <button
            onClick={() => onSelectSeat(train)}
            disabled={soldOut}
            className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e85c28] active:bg-[#d44e1f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(255,107,53,0.3)] hover:shadow-[0_6px_18px_rgba(255,107,53,0.45)] flex items-center gap-1.5 whitespace-nowrap"
          >
            Select Seat
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Car type summary bar */}
      <div className="border-t border-gray-100 px-5 py-2.5 flex gap-3 overflow-x-auto">
        {train.cars.map((car) => (
          <div key={car.id} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            <span className="text-xs text-gray-500">{car.carTypeName}</span>
            <span className="text-xs font-semibold text-gray-700">{formatPrice(car.priceUsd)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
