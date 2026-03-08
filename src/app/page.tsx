import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { ObjavaCard } from "@/components/ObjavaCard";
import { KATEGORIJE } from "@/lib/utils";
import { AnimateIn } from "@/components/AnimateIn";
import { FloatingLeaves } from "@/components/home/FloatingLeaves";
import { ArrowRight, Wrench, Leaf, Users, Star, Zap, Recycle, TreePine, Globe } from "lucide-react";

export const revalidate = 60;

async function getStats() {
  const [objave, korisnici] = await Promise.all([
    prisma.objava.count(),
    prisma.user.count(),
  ]);
  return { objave, korisnici };
}

async function getPoslednje() {
  return prisma.objava.findMany({
    where: { status: { not: "OBRISANA" } },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true, naslov: true, kategorija: true, grad: true,
      status: true, createdAt: true,
      ponude: { select: { id: true } },
      autor:  { select: { ime: true } },
    },
  });
}

export default async function HomePage() {
  const [stats, poslednje] = await Promise.all([getStats(), getPoslednje()]);

  return (
    <>
      {/* -------------------------------------------------------
          HERO  dark forest green + floating leaves
      ------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 -mt-[64px] pt-[calc(64px+6rem)] pb-32 lg:pt-[calc(64px+8rem)] text-white">
        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-green-700/30 animate-morph blur-3xl" />
          <div className="absolute top-1/2 -right-32 size-80 rounded-full bg-green-600/20 animate-morph blur-2xl" style={{ animationDelay: "5s" }} />
          <div className="absolute bottom-8 left-1/3 size-60 rounded-full bg-green-800/50 blur-3xl" />
        </div>

        <FloatingLeaves />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left — text */}
            <div className="animate-slide-up">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-600/50 bg-green-900/60 px-4 py-1.5 text-sm font-semibold text-green-300 backdrop-blur-sm">
                <Leaf size={13} className="text-green-400 animate-sway" />
                Ekološka platforma za Balkan
              </div>

              {/* Headline */}
              <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight lg:text-6xl xl:text-7xl">
                Popravi<br />
                <span className="text-gradient-light">umesto baci.</span>
              </h1>

              <p className="mt-6 max-w-md text-base text-green-200 leading-relaxed lg:text-lg">
                Povezi se sa majstorima, hobistima i volonterima u blizini koji
                mogu da pomognu i produže životni vek stvari koje već imaš.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/objave/nova">
                  <Button size="lg" className="btn-shimmer bg-white text-green-900 hover:bg-green-50 shadow-lg hover:shadow-green-glow active:scale-[.97]">
                    Objavi problem <ArrowRight size={17} />
                  </Button>
                </Link>
                <Link href="/mapa">
                  <Button variant="outline" size="lg" className="border-green-500/50 text-green-100 hover:bg-green-800/50 hover:border-green-400 active:scale-[.97]">
                    Pogledaj mapu
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 flex flex-wrap gap-8 border-t border-green-800/50 pt-8">
                <HeroStat icon="📦" n={`${stats.objave}+`} label="objava" />
                <HeroStat icon="👥" n={`${stats.korisnici}+`} label="korisnika" />
                <HeroStat icon="🏙" n="15+" label="gradova" />
              </div>
            </div>

            {/* Right — mockup cards */}
            <div className="relative hidden lg:block">
              <div className="space-y-4 pl-4">
                {[
                  { icon: "🍞", title: "Toster koji ne greje",     grad: "Beograd",  ponude: 3, status: "Aktivna",  delay: "0s"   },
                  { icon: "🚲", title: "Bicikl — spao lanac",       grad: "Novi Sad", ponude: 1, status: "U toku",   delay: ".15s" },
                  { icon: "💻", title: "Laptop ne pali se",          grad: "Niš",      ponude: 5, status: "Aktivna",  delay: ".3s"  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="glass flex items-center gap-4 rounded-2xl px-5 py-4 shadow-card animate-slide-up"
                    style={{
                      animationDelay: item.delay,
                      transform: `translateX(${i % 2 === 1 ? "24px" : "0"})`,
                    }}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">📍 {item.grad}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`block text-xs font-bold ${item.status === "Aktivna" ? "text-green-600" : "text-blue-600"}`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-400">{item.ponude} ponude</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Glow under cards */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 size-48 rounded-full bg-green-500/10 blur-2xl" />
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* -------------------------------------------------------
          WHY ECO  impact strip
      ------------------------------------------------------- */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: <Recycle size={22} className="text-green-600" />, title: "Manje otpada", desc: "Svaki popravljen predmet je jedan manje na deponiji. Zajedno smanjujemo elektronski i tekstilni otpad." },
                { icon: <TreePine size={22} className="text-emerald-600" />, title: "Lokalna zajednica", desc: "Povezi se sa strucnjacima u svom gradu i gradi poverenje kroz zajednicu uzajamne pomoci." },
                { icon: <Globe size={22} className="text-teal-600" />, title: "Cirkularna ekonomija", desc: "Produžujemo vek produktima — suprotstavljamo se kulturi bacanja i promovišemo odgovornu potrošnju." },
              ].map((item, i) => (
                <AnimateIn key={i} delay={i * 120}>
                  <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft hover:shadow-card hover:border-green-200 transition-all duration-300 group">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* -------------------------------------------------------
          KAKO RADI  3 steps
      ------------------------------------------------------- */}
      <section id="kako" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <SectionHeader
              title="Kako funkcioniše"
              subtitle="Jednostavan proces u tri koraka."
            />
          </AnimateIn>

          <div className="relative mt-14 grid gap-6 sm:grid-cols-3">
            {/* Connecting line (desktop) */}
            <div className="pointer-events-none absolute top-11 hidden h-0.5 w-full border-t-2 border-dashed border-green-100 sm:block" style={{ left: "17%", right: "17%", width: "66%" }} />

            {[
              { n: "01", icon: <Zap size={22} />, title: "Napravi objavu", desc: "Napiši šta je pokvareno, dodaj sliku i lokaciju. Traje manje od jednog minuta.", color: "bg-green-600" },
              { n: "02", icon: <Users size={22} />, title: "Dobij ponude", desc: "Majstori i volonteri u blizini vide tvoju objavu i nude pomoc ili brz savet.", color: "bg-emerald-600" },
              { n: "03", icon: <Star size={22} />, title: "Oceni iskustvo", desc: "Nakon popravke oceni majstora i pomogni zajednici da zna kome može da veruje.", color: "bg-teal-600" },
            ].map((step, i) => (
              <AnimateIn key={step.n} delay={i * 150}>
                <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-soft hover:shadow-card hover:border-green-200 transition-all duration-300 hover:-translate-y-1">
                  {/* Big background number */}
                  <span className="absolute right-5 top-4 text-6xl font-extrabold text-gray-50 group-hover:text-green-50 transition-colors select-none">
                    {step.n}
                  </span>
                  {/* Icon */}
                  <div className={`mb-5 flex size-11 items-center justify-center rounded-xl ${step.color} text-white shadow-sm`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
          KATEGORIJE
      ------------------------------------------------------- */}
      <section id="kategorije" className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <SectionHeader title="Kategorije popravki" subtitle="Pronadi strucnjaka za tvoj problem." />
          </AnimateIn>

          <div className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {KATEGORIJE.map((k, i) => (
              <AnimateIn key={k.id} delay={i * 80}>
                <Link
                  href={`/objave?kategorija=${k.id}`}
                  className={`group flex flex-col items-center gap-3 rounded-2xl border ${k.border} ${k.bg} p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card`}
                >
                  <span className="block text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {k.ikona}
                  </span>
                  <span className={`text-xs font-semibold leading-tight ${k.text}`}>
                    {k.naziv}
                  </span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
          POSLEDNJE OBJAVE
      ------------------------------------------------------- */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mb-10 flex items-end justify-between">
              <SectionHeader title="Poslednje objave" subtitle="Pogledaj šta je nedavno objavljeno." className="mb-0 text-left" />
              <Link href="/objave">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex shrink-0">
                  Sve objave <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </AnimateIn>

          {poslednje.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {poslednje.map((o, i) => (
                <AnimateIn key={o.id} delay={i * 80}>
                  <ObjavaCard objava={o} />
                </AnimateIn>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/objave">
              <Button variant="outline" size="sm">Sve objave <ArrowRight size={14} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
          CTA
      ------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 py-24">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-green-700/40 animate-morph blur-3xl" />
        <div className="pointer-events-none absolute -top-10 -right-10 size-56 rounded-full bg-emerald-600/30 animate-morph blur-2xl" style={{ animationDelay: "6s" }} />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <AnimateIn>
            <div className="mb-5 inline-flex size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm animate-bounce-soft">
              <Wrench size={30} className="text-green-200" />
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Imaš pokvaren predmet?
            </h2>
            <p className="mt-4 text-lg text-green-200 max-w-xl mx-auto leading-relaxed">
              Objavi problem za manje od jednog minuta i dobij ponude od majstora u blizini.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/objave/nova">
                <Button size="lg" className="btn-shimmer bg-white text-green-900 hover:bg-green-50 shadow-lg hover:shadow-green-glow active:scale-[.97]">
                  Objavi problem <ArrowRight size={17} />
                </Button>
              </Link>
              <Link href="/registracija">
                <Button variant="outline" size="lg" className="border-green-500/50 text-white hover:bg-green-700/50 active:scale-[.97]">
                  Registruj se besplatno
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}

/* --- Helper components -------------------------------------- */

function HeroStat({ icon, n, label }: { icon: string; n: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xl font-extrabold text-white leading-none">{n}</p>
        <p className="text-xs text-green-400">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, className }: { title: string; subtitle: string; className?: string }) {
  return (
    <div className={`text-center ${className ?? ""}`}>
      <h2 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">{title}</h2>
      <p className="mt-2 text-gray-500">{subtitle}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
      <span className="text-5xl animate-bounce-soft">??</span>
      <p className="font-semibold text-gray-500">Nema objava. Budi prvi!</p>
      <Link href="/objave/nova">
        <Button size="sm">Objavi problem</Button>
      </Link>
    </div>
  );
}
