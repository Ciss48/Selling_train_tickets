'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Train, ArrowLeft, Construction } from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const scheduleId = searchParams.get('scheduleId')
  const seatIds = searchParams.get('seatIds')?.split(',') ?? []
  const adults = searchParams.get('adults') ?? '1'
  const children = searchParams.get('children') ?? '0'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Construction className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Checkout — Coming Soon</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Payment and passenger details (Phase 2) are not yet implemented.
          Your seat selection was received successfully.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-left text-xs text-gray-500 space-y-1 mb-6">
          <p><span className="font-medium">Schedule:</span> {scheduleId}</p>
          <p><span className="font-medium">Seats selected:</span> {seatIds.length}</p>
          <p><span className="font-medium">Adults:</span> {adults} · <span className="font-medium">Children:</span> {children}</p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#e85c28] text-white font-bold rounded-xl transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#0B2545] px-6 py-4 flex items-center gap-3">
        <div className="w-6 h-6 bg-[#FF6B35] rounded flex items-center justify-center">
          <Train className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold">VietRail</span>
      </nav>
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
