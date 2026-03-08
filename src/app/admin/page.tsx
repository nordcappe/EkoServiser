import { prisma } from "@/lib/db";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [ukupnoKorisnika, ukupnoObjava, aktivneObjave, zavseneObjave, poslednji] = await Promise.all([
    prisma.user.count(),
    prisma.objava.count(),
    prisma.objava.count({ where: { status: "AKTIVNA" } }),
    prisma.objava.count({ where: { status: "ZAVRSENA" } }),
    prisma.objava.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { autor: { select: { ime: true } }, ponude: { select: { id: true } } },
    }),
  ]);

  const stats = [
    { icon: <Users size={22} />, number: ukupnoKorisnika, label: "Korisnika",      color: "bg-blue-50 text-blue-700" },
    { icon: <FileText size={22} />, number: ukupnoObjava, label: "Ukupno objava",  color: "bg-green-50 text-green-700" },
    { icon: <Clock size={22} />, number: aktivneObjave,   label: "Aktivnih",       color: "bg-yellow-50 text-yellow-700" },
    { icon: <CheckCircle size={22} />, number: zavseneObjave, label: "Završenih",  color: "bg-gray-100 text-gray-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled platforme EkoServiser</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
            <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.number}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-soft overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">Poslednje objave</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {poslednji.map((o) => (
            <div key={o.id} className="flex items-center gap-4 px-6 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm">{o.naslov}</p>
                <p className="text-xs text-gray-500">{o.autor.ime} · {o.grad}</p>
              </div>
              <StatusChip status={o.status} />
              <span className="text-xs text-gray-400 shrink-0">{o.ponude.length} ponuda</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    AKTIVNA:  "bg-green-100 text-green-700",
    U_TOKU:   "bg-blue-100 text-blue-700",
    ZAVRSENA: "bg-gray-100 text-gray-600",
    OBRISANA: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    AKTIVNA: "Aktivna", U_TOKU: "U toku", ZAVRSENA: "Završena", OBRISANA: "Obrisana",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}
