# Vietnam Train Ticket — Project Spec

## Overview
Website selling Vietnam train tickets targeting foreign tourists.
- UI language: English
- Business: Real commercial deployment
- Data phase: Mock data first → VNR API integration when available

## Tech Stack
- **Framework**: Next.js 14 + TypeScript (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL on Supabase, Prisma ORM
- **Payments**: Stripe (test mode first, live mode when account is ready)
- **Email**: Resend API
- **Deployment**: Vercel

## User Flow
1. **Home**: Search form — one-way/round-trip toggle, station dropdowns, departure date, return date (if round-trip), passengers count
2. **Search Results** (`/search`): Date switcher bar (±7 days), list of trains showing train code, departure→arrival times, duration, seats remaining, price from, "Select Seat" button
3. **Seat Selection** (modal on search results): Car tabs with type/seats/price, visual seat grid (numbered, color-coded: available/sold/selecting), counter, "Book tickets" button
4. **Checkout** (`/checkout`): Passenger info form (name, passport, nationality per passenger), order summary, Stripe payment form
5. **Confirmation** (`/confirmation/[bookingId]`): Booking details, QR code, email sent automatically

## Key UI Reference
Modeled after dsvn.vn design:
- Date bar above train list (scrollable ±7 days, current date highlighted)
- Each train card: train code, departure time → arrival time, duration arrow, seats remaining badge, lowest price, orange "Select seat" button
- Seat map popup: tabs per car (showing car type + seats remaining + price), grid of numbered seats (4 columns), color legend at bottom

## Stations (mock data)
| Code | English Name | Vietnamese |
|------|-------------|------------|
| HNO | Hanoi | Hà Nội |
| HPH | Hai Phong | Hải Phòng |
| NDI | Nam Dinh | Nam Định |
| NBH | Ninh Binh | Ninh Bình |
| THH | Thanh Hoa | Thanh Hóa |
| VNH | Vinh | Vinh |
| DHO | Dong Hoi | Đồng Hới |
| DHA | Dong Ha | Đông Hà |
| HUE | Hue | Huế |
| DAN | Da Nang | Đà Nẵng |
| QNI | Quang Ngai | Quảng Ngãi |
| QNH | Quy Nhon | Quy Nhơn |
| NTR | Nha Trang | Nha Trang |
| SGN | Saigon (HCMC) | TP. Hồ Chí Minh |
| LCI | Lao Cai | Lào Cai |

## Trains (mock — based on real VNR schedules)
| Code | Route | Departure | Arrival |
|------|-------|-----------|---------|
| SE1 | Hanoi → HCMC | 19:00 | +2 days 04:00 |
| SE3 | Hanoi → HCMC | 19:30 | +2 days 05:10 |
| SE7 | Hanoi → HCMC | 06:00 | +1 day 14:20 |
| SE21 | Hanoi → Da Nang | 06:00 | 15:39 same day |
| SE22 | Da Nang → Hanoi | 21:50 | +1 day 07:17 |
| HP1 | Hanoi → Hai Phong | 06:00 | 08:25 |
| HP3 | Hanoi → Hai Phong | 09:25 | 12:00 |
| HP5 | Hanoi → Hai Phong | 15:15 | 18:00 |

## Seat Types & Approximate USD Prices
| Type | Code | Price Range |
|------|------|-------------|
| Hard seat | HARD_SEAT | $8–15 |
| Soft seat | SOFT_SEAT | $12–20 |
| Soft sleeper 6-berth | SOFT_SLEEPER_6 | $25–45 |
| Soft sleeper 4-berth | SOFT_SLEEPER_4 | $30–55 |
| VIP air-conditioned | VIP | $50–80 |

## File Structure
```
/app
  page.tsx                          — Home page (SearchForm component)
  /search
    page.tsx                        — Search results + seat selection modal
  /checkout
    page.tsx                        — Passenger info + Stripe payment
  /confirmation
    /[bookingId]
      page.tsx                      — Success confirmation
  /api
    /trains
      /search
        route.ts                    — GET: search trains by origin/destination/date
      /[scheduleId]
        /seats
          route.ts                  — GET: get seat map for a schedule
    /bookings
      route.ts                      — POST: create booking (hold seats)
    /payments
      /intent
        route.ts                    — POST: create Stripe PaymentIntent
      /webhook
        route.ts                    — POST: Stripe webhook (confirm/fail booking)
    /email
      /confirm
        route.ts                    — POST: send confirmation email

/prisma
  schema.prisma                     — Database schema
  seed.ts                           — Mock data seeder

/lib
  db.ts                             — Prisma client singleton
  stripe.ts                         — Stripe client
  email.ts                          — Resend client

/components
  SearchForm.tsx                    — Home search form (client component)
  TrainCard.tsx                     — Train result card
  SeatMap.tsx                       — Visual seat grid
  CarTabs.tsx                       — Car selector tabs
  DateBar.tsx                       — Scrollable date switcher
  CheckoutForm.tsx                  — Passenger info form
  StripePaymentForm.tsx             — Stripe Elements payment form
```

## Database Schema (Prisma)
```prisma
model Station {
  id           String     @id @default(cuid())
  code         String     @unique   // "HNO"
  name         String               // "Hanoi"
  nameVi       String               // "Hà Nội"
  province     String
  originRoutes Schedule[] @relation("Origin")
  destRoutes   Schedule[] @relation("Destination")
}

model Train {
  id        String     @id @default(cuid())
  code      String     @unique   // "SE1"
  name      String               // "Reunification Express"
  schedules Schedule[]
}

model Schedule {
  id            String    @id @default(cuid())
  trainId       String
  train         Train     @relation(fields: [trainId], references: [id])
  originId      String
  origin        Station   @relation("Origin", fields: [originId], references: [id])
  destinationId String
  destination   Station   @relation("Destination", fields: [destinationId], references: [id])
  departureTime String    // "19:00" — time of day
  arrivalTime   String    // "04:00+2"
  durationMins  Int       // 1740
  cars          Car[]
  bookings      Booking[]
}

model Car {
  id         String   @id @default(cuid())
  scheduleId String
  schedule   Schedule @relation(fields: [scheduleId], references: [id])
  carNumber  Int      // 1, 2, 3, 4
  carType    String   // "SOFT_SEAT" | "HARD_SEAT" | "SOFT_SLEEPER_4" | "SOFT_SLEEPER_6" | "VIP"
  carTypeName String  // "Soft Seat Air-conditioned"
  priceUsd   Int      // cents, e.g. 2000 = $20.00
  seats      Seat[]
}

model Seat {
  id          String       @id @default(cuid())
  carId       String
  car         Car          @relation(fields: [carId], references: [id])
  seatNo      String       // "5", "16", "31"
  status      SeatStatus   @default(AVAILABLE)
  bookingSeat BookingSeat?
}

enum SeatStatus {
  AVAILABLE
  BOOKED
  HELD
}

model Booking {
  id          String        @id @default(cuid())
  scheduleId  String
  schedule    Schedule      @relation(fields: [scheduleId], references: [id])
  passengers  Passenger[]
  seats       BookingSeat[]
  payment     Payment?
  status      BookingStatus @default(PENDING)
  totalUsd    Int           // cents
  createdAt   DateTime      @default(now())
  expiresAt   DateTime?     // for HELD bookings
}

model BookingSeat {
  bookingId String
  booking   Booking @relation(fields: [bookingId], references: [id])
  seatId    String  @unique
  seat      Seat    @relation(fields: [seatId], references: [id])
  @@id([bookingId, seatId])
}

enum BookingStatus {
  PENDING
  HELD
  CONFIRMED
  CANCELLED
  EXPIRED
}

model Passenger {
  id          String        @id @default(cuid())
  bookingId   String
  booking     Booking       @relation(fields: [bookingId], references: [id])
  firstName   String
  lastName    String
  passport    String
  nationality String
  type        PassengerType @default(ADULT)
}

enum PassengerType {
  ADULT
  CHILD
}

model Payment {
  id              String        @id @default(cuid())
  bookingId       String        @unique
  booking         Booking       @relation(fields: [bookingId], references: [id])
  stripePaymentId String        @unique
  amount          Int           // cents USD
  currency        String        @default("usd")
  status          PaymentStatus @default(PENDING)
  createdAt       DateTime      @default(now())
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
}
```

## Environment Variables
```
# Supabase / Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."    # for Prisma migrations

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (email)
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Coding Conventions
- All UI text in **English**
- **TypeScript strict mode** — no `any`
- **Server components** by default; use `'use client'` only for interactive UI (forms, modals, seat map)
- **Prisma** for all database access — no raw SQL
- **Never** handle raw card numbers — always use Stripe Elements
- All prices stored as **integers in cents** (USD), displayed formatted as `$XX.XX`
- Use `cuid()` for all IDs
- API routes return `{ data, error }` shape consistently

## Seed Data Notes
- Create schedules for the next 30 days (loop dates)
- Each schedule has 4 cars with mixed types
- Pre-set ~30% of seats as BOOKED randomly to make the UI look realistic
- Prices: multiply base price by route distance factor

## Current Phase
**Phase 1** — Building from scratch. No files exist yet.
Next: Phase 2 will add Stripe checkout + email confirmation.
