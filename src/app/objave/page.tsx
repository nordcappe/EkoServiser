import { prisma } from "@/lib/db";
import { ObjavaCard } from "@/components/ObjavaCard";
import { KATEGORIJE } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Objave" };

interface Props {
  searchParams: Promise<{ kategorija?: string; grad?: string; status?: string; q?: string }>;
}

export default async function ObjaveListePage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim();

  const objave = await prisma.objava.findMany({
    where: {
      status: params.status ? params.status as never : { not: "OBRISANA" as never },
      ...(params.kategorija && { kategorija: params.kategorija }),
      ...(params.grad && { grad: { contains: params.grad } }),
      ...(q && { naslov: { contains: q } }),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, naslov: true, kategorija: true, grad: true,
      status: true, createdAt: true,
      ponude: { select: { id: true } },
      autor:  { select: { ime: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Objave</h1>
          <p className="text-gray-500 mt-1">{objave.length} {q ? "rezultata pretrage" : "aktivnih objava"}</p>
        </div>
        <Link href="/objave/nova">
          <Button>
            <Plus size={16} /> Nova objava
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form method="GET" action="/objave" className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Pretraži objave..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
        {params.kategorija && (
          <input type="hidden" name="kategorija" value={params.kategorija} />
        )}
        <Button type="submit" variant="secondary" size="sm">Traži</Button>
        {q && (
          <Link href={params.kategorija ? `/objave?kategorija=${params.kategorija}` : "/objave"}>
            <Button type="button" variant="ghost" size="sm">✕ Resetuj</Button>
          </Link>
        )}
      </form>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterLink href={q ? `/objave?q=${encodeURIComponent(q)}` : "/objave"} label="Sve kategorije" active={!params.kategorija} />
        {KATEGORIJE.map((k) => (
          <FilterLink
            key={k.id}
            href={`/objave?kategorija=${k.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            label={`${k.ikona} ${k.naziv}`}
            active={params.kategorija === k.id}
          />
        ))}
      </div>

      {/* Grid */}
      {objave.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {objave.map((o) => (
            <ObjavaCard key={o.id} objava={o} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
          <span className="text-5xl">🔧</span>
          <p className="font-semibold text-gray-500">Nema objava u ovoj kategoriji.</p>
          <Link href="/objave/nova">
            <Button size="sm">Objavi problem</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-green-600 text-white shadow-sm"
          : "bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"
      }`}
    >
      {label}
    </Link>
  );
}
