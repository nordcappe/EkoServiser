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

Distribuira se pod [MIT licencom](LICENSE). Slobodno za lično i komercijalno korišćenje.

---

<div align="center">

Napravljeno sa 💚 za planetu · 2026 · [nordcappe](https://github.com/nordcappe)

</div>

---

## Funkcije

- ✅ Registracija i prijava (email + lozinka)
- ✅ Uloge: Korisnik, Majstor, Volonter, Admin
- ✅ Kreiranje i pregled objava za popravku
- ✅ Slanje i prihvatanje ponuda  
- ✅ Interaktivna mapa sa lokacijama objava
- ✅ Admin panel: upravljanje korisnicima i objavama
- ✅ Blokiranje korisnika, brisanje objava, menjanje uloga

---

## Licenca

Pogledajte [LICENSE](LICENSE) fajl.


> **Popravi umesto baci** - platforma koja spaja ljude sa pokvarenim predmetima i majstore, hobiste i volontere koji mogu da pomognu.

---

## O projektu

EkoServiser je web platforma namenjena stanovnicima Balkana koja olakšava pronalaženje pomoći za popravku svakodnevnih predmeta. Cilj je jednostavan: produžiti životni vek stvari koje već posedujemo i smanjiti nepotrebno bacanje.

Svake godine ogromna količina uređaja, odeće i kućnih predmeta završi na otpadu, iako se mnogi od njih mogu popraviti za svega nekoliko minuta ili uz minimalan trošak. EkoServiser to menja.

---

## Kako funkcioniše

1. **Korisnik napravi objavu** - napiše šta je pokvareno, doda sliku i označi lokaciju. Traje manje od jednog minuta.
2. **Majstori i volonteri u blizini dobijaju notifikaciju** - mogu ponuditi brz savet ili direktnu pomoć besplatno.
3. **Korisnik bira** - na osnovu ocena, iskustva i udaljenosti odabira osobu koja mu najviše odgovara.

### Primeri objava

- Toster koji ne greje
- Bicikl kome je spao lanac
- Jakna kojoj je pukao rajsferšlus
- Stolica kojoj se klimaju noge

---

## Ključne funkcije

| Funkcija | Opis |
|---|---|
| **Mapa popravki** | Interaktivna mapa sa majstorima, volonterima i aktivnim objavama u blizini |
| **Brze objave** | Objava problema za manje od jednog minuta |
| **Ocene i komentari** | Sistem ocenjivanja koji gradi poverenje u zajednici |
| **Saveti zajednice** | Drugi korisnici mogu davati uputstva i savete za popravku |
| **Kategorije** | Pretraga po kategorijama predmeta |

---

## Kategorije popravki

- Mali kućni uređaji
- Bicikli i sportska oprema
- Odeća i obuća
- Nameštaj
- Elektronika

---

## Tehnički stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Mapa:** [Leaflet.js](https://leafletjs.com/)
- *(Backend i mobilna aplikacija - u planu za naredne faze)*

---

## Pokretanje lokalno

```bash
# Kloniranje repozitorijuma
git clone https://github.com/your-username/EkoServiser.git
cd EkoServiser

# Otvorite index.html u pregledaču
# Nema potrebe za serverom - radi kao statična web aplikacija
start index.html
```

---

## Struktura projekta

```
EkoServiser/
├── index.html          # Glavna stranica
├── css/
│   └── style.css       # Stilovi
├── js/
│   └── app.js          # Logika aplikacije
└── README.md
```

---

## Društveni i ekološki efekat

- **Smanjuje otpad** - predmeti se koriste duže umesto da završe u smeću
- **Podstiče kulturu popravljanja** - umesto refleksnog kupovanja novog
- **Gradi zajednicu** - razmena znanja i pomoći između komšija

### Repair Café događaji

Platforma planira organizaciju lokalnih **repair dana** - događaja gde ljudi donose pokvarene stvari, a majstori i volonteri zajedno pokušavaju da ih poprave. Ovakvi događaji već postoje širom sveta pod imenom *Repair Café* i pokazali su se kao odličan način za smanjenje otpada i povezivanje zajednice.

---

## Licenca

Pogledajte [LICENSE](LICENSE) fajl.

