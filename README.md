<div align="center">

# 🌿 EkoServiser

### *Popravi umesto baci.*

Platforma koja spaja ljude sa pokvarenim predmetima i majstore, hobiste i volontere koji mogu da pomognu - za manje otpada i jaču lokalnu zajednicu.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Sadržaj

- [O projektu](#o-projektu)
- [Funkcionalnosti](#funkcionalnosti)
- [Tech stack](#tech-stack)
- [Pokretanje lokalno](#pokretanje-lokalno)
- [Struktura projekta](#struktura-projekta)
- [API rute](#api-rute)
- [Demo nalozi](#demo-nalozi)
- [Deploy](#deploy-na-vercel)

---

## O projektu

**EkoServiser** je full-stack web aplikacija napravljena za Balkansko tržište. Cilj je borba protiv kulture bacanja - umesto kupovine novog, korisnici mogu da objave problem sa predmetom i dobiju pomoć od majstora ili volontera u okruženju.

Svaki popravljen predmet znači:
- ♻️ Manje elektronskog i tekstilnog otpada
- 💚 Manji CO₂ otisak
- 🤝 Jača lokalna zajednica i razmena veština

---

## Funkcionalnosti

### Za korisnike
- 📝 **Objave** - kreiranje, pretraga i filtriranje po kategoriji, statusu i gradu
- 📍 **Interaktivna mapa** - prikaz svih objava na Leaflet karti sa markerima po kategoriji
- 💬 **Sistem ponuda** - majstori i volonteri šalju ponude na objave
- ⭐ **Sistem ocena** - ocenjivanje majstora posle završene popravke (1–5 zvezda)
- 🖼️ **Upload slika** - dodavanje fotografija uz objave (Base64)
- 🔍 **Pretraga** - tekstualna pretraga naslova i opisa objava

### Za korisnički nalog
- 🔐 **Autentifikacija** - registracija i prijava (email + lozinka, bcrypt)
- 👤 **Profil** - pregled i uređivanje ličnih podataka, lista sopstvenih objava
- 🎭 **Uloge** - `KORISNIK`, `MAJSTOR`, `VOLONTER`, `ADMIN`

### Za administratore
- 📊 **Dashboard** - statistike platforme u realnom vremenu
- 👥 **Upravljanje korisnicima** - pregled, promena uloga, brisanje
- 🗂️ **Moderacija objava** - pregled svih objava, brisanje neprikladnog sadržaja

### Dizajn
- 🌿 Moderni ekološki dizajn - tamno zelena paleta (`green-950`)
- ✨ Scroll-triggered animacije (IntersectionObserver)
- 🍃 Floating leaves hero efekat
- 📱 Potpuno responzivan (mobile-first)
- 🔮 Glassmorphism kartice, morphing blob dekoracije
- 🎨 Kategorije sa bojama po tipu popravke

---

## Tech stack

| Sloj | Tehnologija |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) |
| Stilovi | Tailwind CSS v3 + custom animations |
| Auth | NextAuth.js v5 (credentials provider, JWT) |
| Baza (dev) | Prisma ORM + SQLite |
| Baza (prod) | Prisma ORM + PostgreSQL (Neon / Supabase) |
| Mapa | Leaflet.js (dinamički import, SSR-safe) |
| Ikone | Lucide React |
| Edge middleware | Next.js proxy.ts (route protection) |
| Deploy | Vercel |

---

## Pokretanje lokalno

### Preduslovi

- Node.js 18+
- npm ili yarn

### Instalacija

```bash
# 1. Kloniraj repozitorijum
git clone https://github.com/nordcappe/EkoServiser.git
cd EkoServiser

# 2. Instaliraj zavisnosti
npm install

# 3. Kreiraj .env fajl
cp .env.example .env
```

Popuni `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="vas-tajni-kljuc-min-32-karaktera"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# 4. Kreiraj bazu i generiši Prisma klijent
npm run db:push

# 5. (Opciono) Popuni demo podatke
npm run db:seed

# 6. Pokreni razvojni server
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000) u browseru.

### Dostupne npm skripte

| Komanda | Opis |
|---|---|
| `npm run dev` | Razvojni server (Turbopack) |
| `npm run build` | Produkcijski build |
| `npm run db:push` | Primeni Prisma shemu na bazu |
| `npm run db:seed` | Popuni bazu demo podacima |
| `npm run db:studio` | Otvori Prisma Studio (GUI za bazu) |

---

## Struktura projekta

```
EkoServiser/
├── prisma/
│   ├── schema.prisma         # Modeli: User, Objava, Ponuda, Ocena
│   └── seed.ts               # Demo podaci (korisnici, objave, ponude)
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Početna stranica (hero, koraci, kategorije)
│   │   ├── layout.tsx        # Root layout (Navbar, Footer, Providers)
│   │   ├── globals.css       # Globalni stilovi + custom utilities
│   │   ├── objave/
│   │   │   ├── page.tsx      # Lista objava (pretraga, filteri)
│   │   │   ├── nova/         # Kreiranje nove objave
│   │   │   └── [id]/         # Detalj objave + ponude + ocena
│   │   ├── profil/
│   │   │   ├── page.tsx      # Korisnički profil
│   │   │   └── uredi/        # Uređivanje profila
│   │   ├── mapa/             # Interaktivna mapa svih objava
│   │   ├── admin/
│   │   │   ├── page.tsx      # Admin dashboard
│   │   │   ├── korisnici/    # Upravljanje korisnicima
│   │   │   └── objave/       # Moderacija objava
│   │   ├── prijava/          # Login stranica
│   │   ├── registracija/     # Registracija
│   │   └── api/
│   │       ├── auth/         # NextAuth handler
│   │       ├── objave/       # GET/POST objave + ponude
│   │       ├── ocene/        # POST ocena
│   │       ├── profil/       # GET/PUT profil
│   │       └── registracija/ # POST registracija
│   │
│   ├── components/
│   │   ├── ui/               # Button, Input, Card, Badge, Select, Textarea
│   │   ├── layout/
│   │   │   ├── Navbar.tsx    # Scroll-aware navbar sa UserMenu
│   │   │   └── Footer.tsx    # Footer sa eco stats barom
│   │   ├── home/
│   │   │   └── FloatingLeaves.tsx  # Animirani listići u hero sekciji
│   │   ├── AnimateIn.tsx     # Scroll-triggered entrance animacija
│   │   ├── MapView.tsx       # Leaflet mapa (client-only)
│   │   ├── ObjavaCard.tsx    # Kartica objave sa category accent barom
│   │   └── Providers.tsx     # SessionProvider wrapper
│   │
│   └── lib/
│       ├── auth.ts           # NextAuth full config (sa Prisma)
│       ├── auth.config.ts    # Edge-safe NextAuth config (bez Prisma)
│       ├── db.ts             # Prisma singleton
│       ├── session.ts        # Server-side auth helper
│       └── utils.ts          # KATEGORIJE, formatRelativeTime, cn()
│
├── proxy.ts                  # Next.js middleware (route protection)
└── tailwind.config.ts        # Custom keyframes, boje, sjene
```

---

## API rute

| Metoda | Ruta | Opis | Auth |
|---|---|---|---|
| `GET` | `/api/objave` | Lista objava (filteri: kategorija, grad, status, q) | - |
| `POST` | `/api/objave` | Kreiranje objave | ✅ |
| `GET` | `/api/objave/[id]/ponude` | Ponude za objavu | - |
| `POST` | `/api/objave/[id]/ponude` | Nova ponuda | ✅ |
| `POST` | `/api/ocene` | Oceni majstora | ✅ |
| `GET` | `/api/profil` | Podaci prijavljenog korisnika | ✅ |
| `PUT` | `/api/profil` | Ažuriranje profila | ✅ |
| `POST` | `/api/registracija` | Registracija novog korisnika | - |

---

## Demo nalozi

Dostupni nakon pokretanja `npm run db:seed`:

| Email | Lozinka | Uloga |
|---|---|---|
| `admin@ekoserviser.rs` | `admin123` | Admin |
| `marko@primer.rs` | `majstor123` | Majstor |
| `jovana@primer.rs` | `korisnik123` | Korisnik |

---

## Deploy na Vercel

1. **Push na GitHub** (već urađeno)
2. **Uvezi projekat** na [vercel.com](https://vercel.com) → *New Project* → izaberi `EkoServiser`
3. **Postavi environment variables** u Vercel dashboardu:

   ```
   DATABASE_URL      = <Neon / Supabase / Vercel Postgres URL>
   NEXTAUTH_SECRET   = <nasumičan string, min 32 karaktera>
   NEXTAUTH_URL      = https://ekoserviser.vercel.app
   ```

4. Vercel automatski izvršava `prisma generate && next build` pri svakom deployu.

> **Napomena za produkciju:** U `prisma/schema.prisma` promeni `provider = "sqlite"` na `provider = "postgresql"` i koristi [Neon](https://neon.tech), [Supabase](https://supabase.com) ili Vercel Postgres.

---

## Licenca

Ovaj projekat koristi **EkoServiser Attribution License** — prilagođenu licencu zasnovanu na MIT-u.

### Šta smeš
- ✅ Koristiti projekat lično i komercijalno
- ✅ Forkati i modifikovati kod
- ✅ Distribuirati izmenjene verzije

### Šta moraš
- 🔖 **Obavezna atribucija** — u svakoj kopiji, forku ili deployu mora biti vidljivo navedeno:
  ```
  Originally created by nordcappe — https://github.com/nordcappe/EkoServiser
  ```

### Doprinosi (Contributions)
- Slobodno otvori **Pull Request** sa poboljšanjima, ispravkama ili novim funkcijama
- Svaki PR prolazi kroz review — autor ([nordcappe](https://github.com/nordcappe)) odlučuje da li se merge-uje
- Prihvaćeni doprinosi ulaze u projekat pod istom licencom, a tvoje ime ostaje u Git historiji

Pun tekst licence: [LICENSE](LICENSE)

---

<div align="center">

Napravljeno sa 💚 za planetu · 2026 · [nordcappe](https://github.com/nordcappe)

</div>
