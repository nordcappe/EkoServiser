import { prisma } from "@/lib/db";
import { STATUS_LABELS, getKategorija, formatRelativeTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";

export const metadata = { title: "Objave — Admin" };

export default async function AdminObjavaePage() {
  const objave = await prisma.objava.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      autor:  { select: { ime: true } },
      ponude: { select: { id: true } },
    },
  });

  async function obrisiObjavu(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.objava.update({ where: { id }, data: { status: "OBRISANA" } });
    revalidatePath("/admin/objave");
  }

  async function vratiObjavu(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.objava.update({ where: { id }, data: { status: "AKTIVNA" } });
    revalidatePath("/admin/objave");
  }

  const statusColor: Record<string, string> = {
    AKTIVNA:  "bg-green-100 text-green-700",
    U_TOKU:   "bg-blue-100 text-blue-700",
    ZAVRSENA: "bg-gray-100 text-gray-600",
    OBRISANA: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Objave</h1>
        <p className="text-sm text-gray-500 mt-1">{objave.length} objava ukupno</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Naslov</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-500 hidden sm:table-cell">Kategorija</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-500 hidden md:table-cell">Status</th>
              <th className="text-center px-4 py-3.5 font-semibold text-gray-500 hidden lg:table-cell">Ponude</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-500">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {objave.map((o) => {
              const kat = getKategorija(o.kategorija);
              return (
                <tr key={o.id} className={o.status === "OBRISANA" ? "opacity-50" : ""}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 max-w-[220px] truncate">{o.naslov}</p>
                    <p className="text-xs text-gray-400">{o.autor.ime} · {o.grad} · {formatRelativeTime(o.createdAt)}</p>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 text-gray-600">
                    {kat.ikona} {kat.naziv}
                  </td>
                  <td className="hidden md:table-cell px-4 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[o.status] ?? "bg-gray-100"}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 text-center text-gray-600">
                    {o.ponude.length}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {o.status !== "OBRISANA" ? (
                      <form action={obrisiObjavu}>
                        <input type="hidden" name="id" value={o.id} />
                        <button type="submit" className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 ml-auto transition-colors">
                          <Trash2 size={12} /> Obriši
                        </button>
                      </form>
                    ) : (
                      <form action={vratiObjavu}>
                        <input type="hidden" name="id" value={o.id} />
                        <button type="submit" className="rounded-xl bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors">
                          Vrati
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
