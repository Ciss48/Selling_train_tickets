'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftRight, Users, CalendarDays, ChevronDown, ArrowRight, Search } from 'lucide-react'

type Station = {
  id: string
  code: string
  name: string
  nameVi: string
}

function StationDropdown({
  label,
  value,
  onChange,
  stations,
  exclude,
}: {
  label: string
  value: Station | null
  onChange: (s: Station) => void
  stations: Station[]
  exclude?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = stations.filter(
    (s) =>
      s.code !== exclude &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => { setOpen(!open); setQuery('') }}
        className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/60"
      >
        <p className="text-xs text-white/60 font-medium mb-0.5">{label}</p>
        {value ? (
          <div>
            <span className="text-white font-semibold text-sm">{value.name}</span>
            <span className="ml-2 text-white/50 text-xs">{value.code}</span>
          </div>
        ) : (
          <span className="text-white/40 text-sm">Select station</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 w-72 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              placeholder="Search stations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/40 text-sm rounded-lg outline-none"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-white/40 text-sm">No stations found</p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { onChange(s); setOpen(false) }}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                >
                  <span className="text-white text-sm font-medium">{s.name}</span>
                  <span className="text-white/40 text-xs bg-white/10 px-2 py-0.5 rounded">{s.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchForm() {
  const router = useRouter()
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')
  const [stations, setStations] = useState<Station[]>([])
  const [from, setFrom] = useState<Station | null>(null)
  const [to, setTo] = useState<Station | null>(null)
  const [departDate, setDepartDate] = useState(new Date().toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [showPassengers, setShowPassengers] = useState(false)
  const passengerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/stations')
      .then((r) => r.json())
      .then((d) => setStations(d.data ?? []))
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (passengerRef.current && !passengerRef.current.contains(e.target as Node)) {
        setShowPassengers(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function swapStations() {
    const tmp = from
    setFrom(to)
    setTo(tmp)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!from || !to || !departDate) return
    const params = new URLSearchParams({
      origin: from.code,
      destination: to.code,
      date: departDate,
      adults: String(adults),
      children: String(children),
      tripType,
    })
    if (tripType === 'round-trip' && returnDate) params.set('returnDate', returnDate)
    router.push(`/search?${params}`)
  }

  const totalPassengers = adults + children

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* Trip type toggle */}
      <div className="flex gap-2">
        {(['one-way', 'round-trip'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTripType(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              tripType === t
                ? 'bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.4)]'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {t === 'one-way' ? 'One Way' : 'Round Trip'}
          </button>
        ))}
      </div>

      {/* Station row */}
      <div className="flex items-center gap-2">
        <StationDropdown
          label="From"
          value={from}
          onChange={setFrom}
          stations={stations}
          exclude={to?.code}
        />
        <button
          type="button"
          onClick={swapStations}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-[#FF6B35] border border-white/20 rounded-full transition-all hover:border-[#FF6B35] hover:shadow-[0_0_12px_rgba(255,107,53,0.4)]"
        >
          <ArrowLeftRight className="w-4 h-4 text-white" />
        </button>
        <StationDropdown
          label="To"
          value={to}
          onChange={setTo}
          stations={stations}
          exclude={from?.code}
        />
      </div>

      {/* Date + Passengers row */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-white/60 font-medium mb-1 ml-1">Departure</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="date"
              value={departDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#FF6B35]/60 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {tripType === 'round-trip' && (
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-white/60 font-medium mb-1 ml-1">Return</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="date"
                value={returnDate}
                min={departDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#FF6B35]/60 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        )}

        {/* Passengers */}
        <div ref={passengerRef} className="relative flex-1 min-w-[160px]">
          <label className="block text-xs text-white/60 font-medium mb-1 ml-1">Passengers</label>
          <button
            type="button"
            onClick={() => setShowPassengers(!showPassengers)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/60"
          >
            <Users className="w-4 h-4 text-white/40" />
            <span className="text-white text-sm flex-1 text-left">
              {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
            </span>
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showPassengers ? 'rotate-180' : ''}`} />
          </button>

          {showPassengers && (
            <div className="absolute z-50 top-full mt-2 left-0 w-64 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl p-4 space-y-4">
              {[
                { label: 'Adults', sub: '12+ years', value: adults, set: setAdults, min: 1 },
                { label: 'Children', sub: '3–11 years', value: children, set: setChildren, min: 0 },
              ].map(({ label, sub, value, set, min }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-white/40 text-xs">{sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => set(Math.max(min, value - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors disabled:opacity-30"
                      disabled={value <= min}
                    >
                      −
                    </button>
                    <span className="text-white font-semibold w-5 text-center">{value}</span>
                    <button
                      type="button"
                      onClick={() => set(value + 1)}
                      className="w-8 h-8 rounded-full bg-[#FF6B35] hover:bg-[#e85c28] text-white flex items-center justify-center font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        disabled={!from || !to}
        className="w-full py-4 bg-[#FF6B35] hover:bg-[#e85c28] active:bg-[#d44e1f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all shadow-[0_6px_20px_rgba(255,107,53,0.35)] hover:shadow-[0_8px_28px_rgba(255,107,53,0.5)] flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        Search Trains
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  )
}
