import { prisma } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { UserCheck, UserX } from "lucide-react";

export const metadata = { title: "Korisnici — Admin" };

export default async function AdminKorisniciPage() {
  const korisnici = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, ime: true, email: true, role: true, grad: true,
      aktivan: true, createdAt: true, ocena: true, brojOcena: true,
      _count: { select: { objave: true, ponude: true } },
    },
  });

  async function promeniRolu(formData: FormData) {
    "use server";
    const id   = formData.get("id") as string;
    const role = formData.get("role") as "KORISNIK" | "MAJSTOR" | "VOLONTER" | "ADMIN";
    await prisma.user.update({ where: { id }, data: { role } });
    revalidatePath("/admin/korisnici");
  }

  async function toggleAktivan(formData: FormData) {
    "use server";
    const id      = formData.get("id") as string;
    const aktivan = formData.get("aktivan") === "true";
    await prisma.user.update({ where: { id }, data: { aktivan: !aktivan } });
    revalidatePath("/admin/korisnici");
  }

  const roleColor: Record<string, string> = {
    ADMIN:    "bg-purple-100 text-purple-700",
    MAJSTOR:  "bg-blue-100 text-blue-700",
    VOLONTER: "bg-green-100 text-green-700",
    KORISNIK: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Korisnici</h1>
        <p className="text-sm text-gray-500 mt-1">{korisnici.length} registrovanih korisnika</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Korisnik</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Uloga</th>
              <th className="text-center px-4 py-3.5 font-semibold text-gray-500 hidden sm:table-cell">Objave</th>
              <th className="text-center px-4 py-3.5 font-semibold text-gray-500 hidden md:table-cell">Status</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-500">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {korisnici.map((k) => (
              <tr key={k.id} className={!k.aktivan ? "opacity-50" : ""}>
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-900">{k.ime}</p>
                  <p className="text-xs text-gray-400">{k.email}</p>
                  {k.grad && <p className="text-xs text-gray-400">📍 {k.grad}</p>}
                </td>
                <td className="px-4 py-4">
                  <form action={promeniRolu} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={k.id} />
                    <select
                      name="role"
                      defaultValue={k.role}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold border-none outline-none cursor-pointer ${roleColor[k.role]}`}
                    >
                      {["KORISNIK", "MAJSTOR", "VOLONTER", "ADMIN"].map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                    <button type="submit" className="text-xs text-gray-400 hover:text-gray-700 underline">
                      Sačuvaj
                    </button>
                  </form>
                </td>
                <td className="hidden sm:table-cell px-4 py-4 text-center text-gray-600">
                  {k._count.objave}
                </td>
                <td className="hidden md:table-cell px-4 py-4 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${k.aktivan ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {k.aktivan ? "Aktivan" : "Blokiran"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <form action={toggleAktivan}>
                    <input type="hidden" name="id" value={k.id} />
                    <input type="hidden" name="aktivan" value={String(k.aktivan)} />
                    <button
                      type="submit"
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                        k.aktivan
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {k.aktivan ? (
                        <span className="flex items-center gap-1"><UserX size={12} /> Blokiraj</span>
                      ) : (
                        <span className="flex items-center gap-1"><UserCheck size={12} /> Aktiviraj</span>
                      )}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
