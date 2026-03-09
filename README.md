# 🌍 Twende Africa Tours

**Explore Africa and the World**

Twende Africa Tours is a professional tour and travel agency dedicated to providing memorable travel experiences across Africa and international destinations. We deliver reliable, affordable, and exciting travel services to individuals, families, corporate clients, and tourists seeking adventure, relaxation, and cultural exploration.

---

## ✨ Features

- 🦁 **Tours & Safaris** — Safari adventures, wildlife tours, cultural experiences across Kenya & Africa
- ✈️ **International Travel** — Global packages including city tours, holidays, and guided experiences
- 🏨 **Hotel Booking** — Comfortable and affordable hotels, resorts, and holiday apartments worldwide
- 🎫 **Flight Reservations** — Domestic & international flights, convenient and cost-effective
- 🚖 **Airport Transfers** — Reliable pick-up and drop-off for smooth arrivals and departures
- 🚗 **Car Hire** — Self-drive, chauffeur, safari vehicles, and corporate transport
- 💬 **Travel Consultations** — Expert itinerary planning and destination recommendations

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + Vanilla CSS |
| Database | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| Auth | [Clerk](https://clerk.com/) |
| Payments | [Stripe](https://stripe.com/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)
- Stripe account (for payments)

### Installation

```bash
git clone https://github.com/Akubrecah/wanderlax-travel-agency.git
cd wanderlax-travel-agency
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
travel-agency/
├── app/
│   ├── (public pages)     # Tours, Hotels, Car Hire, Events, etc.
│   ├── admin/             # Admin dashboard & management panels
│   ├── portal/            # Member portal (itinerary, history, loyalty)
│   ├── api/               # API routes (auth, payments, webhooks)
│   └── components/        # Shared layout components (Header, Footer)
├── components/
│   ├── admin/             # Admin-specific components
│   └── HomeClient.tsx     # Homepage client component
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, services & destinations |
| `/tours` | Safari & tour packages |
| `/hotels` | Hotel listings |
| `/car-hire` | Car hire options |
| `/events` | Special events & experiences |
| `/concierge` | Travel consultation |
| `/about` | Company story & values |
| `/contact` | Contact form & office location |
| `/portal` | Member dashboard |
| `/admin` | Admin management panel |

---

## 📍 Contact

**Twende Africa Tours**  
Westlands, Nairobi, Kenya 00100  
📞 +254 700 000000  
📧 info@twendeafricatours.com

---

*Built with ❤️ by the Twende Africa Tours Team*
