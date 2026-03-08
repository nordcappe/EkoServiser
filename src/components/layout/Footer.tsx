import Link from "next/link";
import { Leaf, Heart, Wrench } from "lucide-react";

const ECO_STATS = [
  { n: "2 300+", label: "kg CO₂ uštedeno" },
  { n: "840+",   label: "predmeta popravljeno" },
  { n: "15+",    label: "gradova u mreži" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-green-950 text-green-400">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-12 -right-16 size-64 rounded-full bg-green-900/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-48 rounded-full bg-green-900/40 blur-2xl" />

      {/* Eco stats bar */}
      <div className="relative border-b border-green-900/60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {ECO_STATS.map((s) => (
              <div key={s.n} className="text-center">
                <p className="text-xl font-extrabold text-white">{s.n}</p>
                <p className="text-xs text-green-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-white group">
              <div className="flex size-9 items-center justify-center rounded-xl bg-green-700 group-hover:bg-green-600 transition-colors">
                <Leaf size={17} className="text-white" />
              </div>
              EkoServiser
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-green-500">
              Popravi umesto baci. Platforma koja spaja ljude sa majstorima i volonterima na Balkanu.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600">
              <Wrench size={12} />
              <span>Manje otpada. Više zajednice.</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">Platforma</h4>
            <ul className="space-y-2.5 text-sm">
              <FooterLink href="/objave">Objave</FooterLink>
              <FooterLink href="/mapa">Mapa popravki</FooterLink>
              <FooterLink href="/#kategorije">Kategorije</FooterLink>
              <FooterLink href="/objave/nova">Nova objava</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">Zajednica</h4>
            <ul className="space-y-2.5 text-sm">
              <FooterLink href="/registracija">Postani majstor</FooterLink>
              <FooterLink href="/registracija">Postani volonter</FooterLink>
              <FooterLink href="/#kako">Kako funkcioniše</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">Nalog</h4>
            <ul className="space-y-2.5 text-sm">
              <FooterLink href="/prijava">Prijava</FooterLink>
              <FooterLink href="/registracija">Registracija</FooterLink>
              <FooterLink href="/profil">Moj profil</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-green-900/60 pt-6 text-xs text-green-700 sm:flex-row">
          <span>© {new Date().getFullYear()} EkoServiser. Napravljeno za Balkan.</span>
          <span className="flex items-center gap-1.5">
            Napravljeno sa <Heart size={11} className="text-red-500 fill-red-500" /> za planetu
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-green-500 transition-colors hover:text-white hover:translate-x-0.5 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}


