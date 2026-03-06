'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatShort(dateStr: string): { day: string; date: string } {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }
}

export default function DateBar({ currentDate }: { currentDate: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function navigate(date: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', date)
    router.push(`/search?${params}`)
  }

  const today = new Date().toISOString().split('T')[0]
  const dates = Array.from({ length: 15 }, (_, i) => addDays(currentDate, i - 7))

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => navigate(addDays(currentDate, -1))}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-[#FF6B35] transition-all z-10"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      <div className="flex-1 overflow-x-auto scrollbar-hide mx-1">
        <div className="flex gap-1 px-1">
          {dates.map((d) => {
            const isSelected = d === currentDate
            const isToday = d === today
            const isPast = d < today
            const { day, date } = formatShort(d)

            return (
              <button
                key={d}
                onClick={() => !isPast && navigate(d)}
                disabled={isPast}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-center transition-all min-w-[64px] ${
                  isSelected
                    ? 'bg-[#FF6B35] text-white shadow-[0_4px_12px_rgba(255,107,53,0.35)]'
                    : isPast
                    ? 'opacity-30 cursor-not-allowed text-gray-400'
                    : 'bg-white hover:bg-orange-50 hover:border-[#FF6B35] border border-gray-200 text-gray-700'
                }`}
              >
                <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : isToday ? 'text-[#FF6B35]' : 'text-gray-500'}`}>
                  {isToday && !isSelected ? 'Today' : day}
                </span>
                <span className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {date}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={() => navigate(addDays(currentDate, 1))}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-[#FF6B35] transition-all z-10"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  )
}
