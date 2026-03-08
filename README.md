# EkoServiser

> **Popravi umesto baci** — web platforma koja spaja ljude sa pokvarenim predmetima i majstore, hobiste i volontere koji mogu da pomognu.

---

## Tech Stack

| Sloj | Tehnologija |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Stilovi | Tailwind CSS |
| Auth | NextAuth.js v5 (credentials) |
| Baza | Prisma ORM + SQLite (dev) / PostgreSQL (prod) |
| Mapa | Leaflet.js (dinamički import) |
| Deploy | Vercel |

---

## Kako pokrenuti lokalno

```bash
# 1. Kloniraj projekat
git clone https://github.com/your-username/EkoServiser.git
cd EkoServiser

# 2. Instaliraj pakete
npm install

# 3. Kreiraj .env fajl
cp .env.example .env
# Popuni DATABASE_URL i NEXTAUTH_SECRET

# 4. Kreiraj bazu i generiši klijent
npm run db:push

# 5. (Opciono) Popuni demo podatke
npm run db:seed

# 6. Pokreni development server
npm run dev
```

Otvori http://localhost:3000

---

## Demo nalozi (posle seeda)

| Email | Lozinka | Uloga |
|---|---|---|
| admin@ekoserviser.rs | admin123 | Admin |
| marko@primer.rs | majstor123 | Majstor |
| jovana@primer.rs | korisnik123 | Korisnik |

---

## Deploy na Vercel

1. Push na GitHub
2. Uvezi projekat na [vercel.com](https://vercel.com)
3. Dodaj Environment Variables u Vercel dashboard:
   - `DATABASE_URL` — Vercel Postgres ili Neon/Supabase PostgreSQL URL
   - `NEXTAUTH_SECRET` — nasumičan string (min 32 karaktera)
   - `NEXTAUTH_URL` — URL tvoje Vercel aplikacije, npr. `https://ekoserviser.vercel.app`
4. Vercel automatski pokreće `prisma generate && next build`

> Za produkciju promeni `provider = "sqlite"` u `prisma/schema.prisma` na `provider = "postgresql"` i koristi Vercel Postgres, Neon ili Supabase.

---

## Struktura projekta

```
src/
  app/
    page.tsx              # Početna stranica
    objave/               # Lista, detalj, nova objava
    prijava/              # Login stranica
    registracija/         # Registracija
    profil/               # Korisnički profil
    mapa/                 # Interaktivna mapa
    admin/                # Admin panel (dashboard, korisnici, objave)
    api/                  # API rute (auth, objave, registracija)
  components/
    ui/                   # Button, Input, Card, Badge, Select
    layout/               # Navbar, Footer
    MapView.tsx           # Leaflet mapa (client component)
    ObjavaCard.tsx        # Kartica objave
    Providers.tsx         # SessionProvider wrapper
  lib/
    auth.ts               # NextAuth konfiguracija
    db.ts                 # Prisma singleton
    session.ts            # Auth helpers
    utils.ts              # Kategorije, helper funkcije
prisma/
  schema.prisma           # Baza podataka (User, Objava, Ponuda, Ocena)
  seed.ts                 # Demo podaci
```

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


> **Popravi umesto baci** — platforma koja spaja ljude sa pokvarenim predmetima i majstore, hobiste i volontere koji mogu da pomognu.

---

## O projektu

EkoServiser je web platforma namenjena stanovnicima Balkana koja olakšava pronalaženje pomoći za popravku svakodnevnih predmeta. Cilj je jednostavan: produžiti životni vek stvari koje već posedujemo i smanjiti nepotrebno bacanje.

Svake godine ogromna količina uređaja, odeće i kućnih predmeta završi na otpadu, iako se mnogi od njih mogu popraviti za svega nekoliko minuta ili uz minimalan trošak. EkoServiser to menja.

---

## Kako funkcioniše

1. **Korisnik napravi objavu** — napiše šta je pokvareno, doda sliku i označi lokaciju. Traje manje od jednog minuta.
2. **Majstori i volonteri u blizini dobijaju notifikaciju** — mogu ponuditi brz savet ili direktnu pomoć besplatno.
3. **Korisnik bira** — na osnovu ocena, iskustva i udaljenosti odabira osobu koja mu najviše odgovara.

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
- *(Backend i mobilna aplikacija — u planu za naredne faze)*

---

## Pokretanje lokalno

```bash
# Kloniranje repozitorijuma
git clone https://github.com/your-username/EkoServiser.git
cd EkoServiser

# Otvorite index.html u pregledaču
# Nema potrebe za serverom — radi kao statična web aplikacija
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

- **Smanjuje otpad** — predmeti se koriste duže umesto da završe u smeću
- **Podstiče kulturu popravljanja** — umesto refleksnog kupovanja novog
- **Gradi zajednicu** — razmena znanja i pomoći između komšija

### Repair Café događaji

Platforma planira organizaciju lokalnih **repair dana** — događaja gde ljudi donose pokvarene stvari, a majstori i volonteri zajedno pokušavaju da ih poprave. Ovakvi događaji već postoje širom sveta pod imenom *Repair Café* i pokazali su se kao odličan način za smanjenje otpada i povezivanje zajednice.

---

## Licenca

Pogledajte [LICENSE](LICENSE) fajl.

