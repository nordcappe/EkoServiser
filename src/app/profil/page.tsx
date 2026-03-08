import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { ObjavaCard } from "@/components/ObjavaCard";
import { ROLE_LABELS, formatRelativeTime } from "@/lib/utils";
import { MapPin, Star, Wrench, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Moj profil" };

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) redirect("/prijava");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      objave: {
        where:   { status: { not: "OBRISANA" } },
        orderBy: { createdAt: "desc" },
        take:    6,
        include: { ponude: { select: { id: true } }, autor: { select: { ime: true } } },
      },
      ponude: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { objava: { select: { id: true, naslov: true, grad: true } } },
      },
    },
  });

  if (!user) redirect("/prijava");

  const roleVariant: Record<string, "green" | "blue" | "purple" | "gray"> = {
    MAJSTOR:  "blue",
    VOLONTER: "green",
    ADMIN:    "purple",
    KORISNIK: "gray",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Profile header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 p-8 text-white shadow-card">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl font-extrabold">
            {user.ime[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold">{user.ime}</h1>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            {user.grad && (
              <p className="flex items-center gap-1.5 text-green-100 text-sm">
                <MapPin size={13} /> {user.grad}
              </p>
            )}
            {user.bio && <p className="mt-2 text-sm text-green-100 leading-relaxed">{user.bio}</p>}
          </div>
          <div className="flex flex-col items-end gap-3">
            {user.ocena > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2">
                <Star size={18} className="text-yellow-300" fill="currentColor" />
                <span className="text-xl font-extrabold">{user.ocena.toFixed(1)}</span>
                <span className="text-sm text-green-200">({user.brojOcena})</span>
              </div>
            )}
            <Link href="/profil/uredi">
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
                <Pencil size={13} /> Uredi profil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatBox n={user.objave.length} label="Moje objave" />
        <StatBox n={user.ponude.length} label="Poslate ponude" />
        <StatBox n={user.brojOcena}     label="Ocena" />
      </div>

      {/* Objave */}
      {user.objave.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-bold text-gray-900 text-lg flex items-center gap-2">
            <Wrench size={18} className="text-green-600" /> Moje objave
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.objave.map((o) => (
              <ObjavaCard key={o.id} objava={o} />
            ))}
          </div>
        </section>
      )}

      {/* Ponude koje je dao */}
      {user.ponude.length > 0 && (
        <section>
          <h2 className="mb-4 font-bold text-gray-900 text-lg">Moje ponude</h2>
          <div className="space-y-3">
            {user.ponude.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-soft">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{p.objava.naslov}</p>
                  <p className="text-xs text-gray-500">📍 {p.objava.grad} · {formatRelativeTime(p.createdAt)}</p>
                </div>
                {p.prihvacena && <Badge variant="green">Prihvaćena ✓</Badge>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatBox({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-soft">
      <p className="text-2xl font-extrabold text-gray-900">{n}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
