'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Train, ArrowLeft, Search } from 'lucide-react'
import DateBar from '@/components/DateBar'
import TrainCard from '@/components/TrainCard'
import SeatMap from '@/components/SeatMap'

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

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const origin = searchParams.get('origin') ?? ''
  const destination = searchParams.get('destination') ?? ''
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]
  const adults = parseInt(searchParams.get('adults') ?? '1')
  const children = parseInt(searchParams.get('children') ?? '0')

  const [trains, setTrains] = useState<TrainResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrain, setSelectedTrain] = useState<TrainResult | null>(null)

  useEffect(() => {
    if (!origin || !destination) return
    setLoading(true)
    setError(null)
    fetch(`/api/trains/search?origin=${origin}&destination=${destination}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error)
        else setTrains(d.data ?? [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load trains')
        setLoading(false)
      })
  }, [origin, destination, date])

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0B2545] text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FF6B35] rounded flex items-center justify-center">
                <Train className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">VietRail</span>
            </div>
          </div>

          {/* Route summary */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white/60 text-xs">From</p>
                <p className="text-white font-bold text-lg">{origin}</p>
              </div>
              <div className="text-[#FF6B35]">→</div>
              <div>
                <p className="text-white/60 text-xs">To</p>
                <p className="text-white font-bold text-lg">{destination}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20 mx-2" />
            <div>
              <p className="text-white/60 text-xs">Date</p>
              <p className="text-white text-sm font-medium">{formatDate(date)}</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20 mx-2" />
            <div>
              <p className="text-white/60 text-xs">Passengers</p>
              <p className="text-white text-sm font-medium">
                {adults} adult{adults !== 1 ? 's' : ''}
                {children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="ml-auto flex items-center gap-1.5 text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg text-sm transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              Modify
            </button>
          </div>
        </div>
      </div>

      {/* Date bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Suspense>
            <DateBar currentDate={date} />
          </Suspense>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF6B35]/30 border-t-[#FF6B35] rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Searching for trains...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">Error loading trains</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : trains.length === 0 ? (
          <div className="text-center py-20">
            <Train className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold text-lg mb-1">No trains found</p>
            <p className="text-gray-400 text-sm">
              No trains run on {origin} → {destination} on {formatDate(date)}. Try another date.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {trains.length} train{trains.length !== 1 ? 's' : ''} found for{' '}
              <span className="font-medium text-gray-700">{origin} → {destination}</span>
            </p>
            <div className="space-y-3">
              {trains.map((train) => (
                <TrainCard key={train.id} train={train} onSelectSeat={setSelectedTrain} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Seat selection modal */}
      {selectedTrain && (
        <SeatMap
          train={selectedTrain}
          adults={adults}
          childCount={children}
          onClose={() => setSelectedTrain(null)}
        />
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
