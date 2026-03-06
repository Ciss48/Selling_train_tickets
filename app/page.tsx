import SearchForm from '@/components/SearchForm'
import { Train, MapPin, Shield, Clock } from 'lucide-react'

const POPULAR_ROUTES = [
  { from: 'Hanoi', to: 'Ho Chi Minh City', duration: '29h', fromCode: 'HNO', toCode: 'SGN' },
  { from: 'Hanoi', to: 'Da Nang', duration: '16h', fromCode: 'HNO', toCode: 'DAN' },
  { from: 'Hanoi', to: 'Hue', duration: '12h', fromCode: 'HNO', toCode: 'HUE' },
  { from: 'Da Nang', to: 'Hanoi', duration: '16h', fromCode: 'DAN', toCode: 'HNO' },
]

export default function HomePage() {
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="relative min-h-[80vh] flex flex-col overflow-hidden bg-[#0B2545]">
        {/* Layered gradient background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(11,37,69,0.8) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, rgba(15,52,96,0.6) 0%, transparent 50%)',
            }}
          />
          {/* SVG grain texture */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <Train className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">VietRail</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">About</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Help</a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-3xl w-full text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span className="text-white/80 text-xs font-medium">Vietnam Railway Network</span>
            </div>
            <h1
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1]"
              style={{ letterSpacing: '-0.03em' }}
            >
              Travel Vietnam
              <br />
              <span className="text-[#FF6B35]">by Train</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
              Book Vietnam&apos;s scenic railway network. From Hanoi to Ho Chi Minh City,
              discover the country at your own pace.
            </p>
          </div>

          {/* Search form card */}
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <SearchForm />
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative z-10 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Popular routes */}
      <section className="bg-white px-6 md:px-12 py-14">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#0B2545] mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Popular Routes
          </h2>
          <p className="text-gray-500 mb-8">Most-booked journeys by travelers like you</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ROUTES.map((route) => (
              <a
                key={`${route.fromCode}-${route.toCode}`}
                href={`/search?origin=${route.fromCode}&destination=${route.toCode}&date=${today}&adults=1&children=0&tripType=one-way`}
                className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#FF6B35]/50 hover:shadow-[0_8px_24px_rgba(255,107,53,0.12)] transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                  <div className="flex-1 h-px bg-gray-200 group-hover:bg-[#FF6B35]/30 transition-colors" />
                  <div className="w-2 h-2 rounded-full bg-[#0B2545]" />
                </div>
                <p className="font-bold text-gray-900 text-sm">{route.from}</p>
                <p className="text-gray-500 text-sm">→ {route.to}</p>
                <div className="flex items-center gap-1 mt-3">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{route.duration}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-gray-50 px-6 md:px-12 py-14 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Secure Booking',
              desc: 'Your personal information and payment details are always protected.',
            },
            {
              icon: Train,
              title: 'Real Schedules',
              desc: 'Live seat availability synced with VNR systems for accurate bookings.',
            },
            {
              icon: Clock,
              title: 'Instant Confirmation',
              desc: 'E-ticket delivered to your email immediately after booking.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-[1.7]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
