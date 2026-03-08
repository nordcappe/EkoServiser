import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getKategorija, formatRelativeTime, STATUS_LABELS } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { MapPin, Clock, User, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PonudaForm from "./PonudaForm";
import OcenaForm from "@/components/OcenaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const objava = await prisma.objava.findUnique({ where: { id }, select: { naslov: true } });
  return { title: objava?.naslov ?? "Objava" };
}

export default async function ObjavaDetaljiPage({ params }: Props) {
  const { id } = await params;
  const [objava, session] = await Promise.all([
    prisma.objava.findUnique({
      where: { id },
      include: {
        autor:  { select: { id: true, ime: true, grad: true, ocena: true, brojOcena: true, role: true } },
        ponude: { include: { majstor: { select: { id: true, ime: true, ocena: true, role: true, grad: true } } }, orderBy: { createdAt: "desc" } },
      },
    }),
    getSession(),
  ]);

  if (!objava || objava.status === "OBRISANA") notFound();

  const kat = getKategorija(objava.kategorija);
  const jePrihvacena = objava.ponude.some((p) => p.prihvacena);
  const prihvacenaPonuda = objava.ponude.find((p) => p.prihvacena);
  const jeAutor = session?.user.id === objava.autorId;
  const vecPonudio = session ? objava.ponude.some((p) => p.majstorId === session.user.id) : false;

  // Check if the author has already rated the accepted majstor
  const vecOcenio = session && jeAutor && prihvacenaPonuda
    ? !!(await prisma.ocena.findUnique({
        where: { autorId_majstorId: { autorId: session.user.id, majstorId: prihvacenaPonuda.majstorId } },
        select: { id: true },
      }))
    : false;

  const statusVariant: Record<string, "green" | "blue" | "gray"> = {
    AKTIVNA: "green", U_TOKU: "blue", ZAVRSENA: "gray", OBRISANA: "gray",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/objave" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={14} /> Nazad na objave
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                {kat.ikona}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-gray-900">{objava.naslov}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={statusVariant[objava.status] ?? "gray"}>
                    {STATUS_LABELS[objava.status]}
                  </Badge>
                  <Badge variant="gray">{kat.naziv}</Badge>
                </div>
              </div>
            </div>

            {objava.opis && (
              <p className="mt-6 text-gray-600 leading-relaxed whitespace-pre-line">{objava.opis}</p>
            )}

            {/* Image */}
            {objava.slika && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={objava.slika}
                alt={objava.naslov}
                className="mt-6 w-full rounded-xl object-cover max-h-80"
              />
            )}

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-green-600" />
                {objava.grad}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatRelativeTime(objava.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={14} />
                {objava.ponude.length} {objava.ponude.length === 1 ? "ponuda" : "ponude/ponuda"}
              </span>
            </div>
          </div>

          {/* Ponude */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Ponude ({objava.ponude.length})
            </h2>
            {objava.ponude.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">Još nema ponuda. Budi prvi!</p>
            ) : (
              <div className="space-y-4">
                {objava.ponude.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-4 ${p.prihvacena ? "border-green-300 bg-green-50" : "border-gray-100 bg-gray-50"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{p.majstor.ime}</p>
                        <p className="text-xs text-gray-500">
                          ⭐ {p.majstor.ocena.toFixed(1)} · {p.majstor.grad} · {formatRelativeTime(p.createdAt)}
                        </p>
                      </div>
                      {p.prihvacena && <Badge variant="green">Prihvaćena ✓</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{p.poruka}</p>
                    {jeAutor && !jePrihvacena && (
                      <PrihvatiBtn ponudaId={p.id} objavaId={objava.id} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nova ponuda forma */}
          {session && !jeAutor && !vecPonudio && objava.status === "AKTIVNA" && (
            <PonudaForm objavaId={objava.id} />
          )}
          {!session && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500 mb-3">Prijavi se da ponudiš pomoć.</p>
              <Link href={`/prijava?callbackUrl=/objave/${objava.id}`}>
                <Button variant="outline" size="sm">Prijavi se</Button>
              </Link>
            </div>
          )}

          {/* Rating form - shown to author when a ponuda was accepted */}
          {jeAutor && prihvacenaPonuda && !vecOcenio && (
            <OcenaForm majstorId={prihvacenaPonuda.majstorId} objavaId={objava.id} />
          )}
          {jeAutor && prihvacenaPonuda && vecOcenio && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center gap-2">
              ⭐ Već si ocenio majstora za ovu objavu.
            </div>
          )}
        </div>

        {/* Sidebar - autor */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Objavio</h3>
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                {objava.autor.ime[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{objava.autor.ime}</p>
                <p className="text-xs text-gray-500">📍 {objava.autor.grad ?? "-"}</p>
              </div>
            </div>
            {objava.autor.ocena > 0 && (
              <div className="mt-4 flex items-center gap-1 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{objava.autor.ocena.toFixed(1)}</span>
                <span className="text-gray-400">({objava.autor.brojOcena} ocena)</span>
              </div>
            )}
          </div>

          {jeAutor && objava.status === "AKTIVNA" && (
            <ZatvoriObjavaBtn objavaId={objava.id} />
          )}
        </div>
      </div>
    </div>
  );
}

function PrihvatiBtn({ ponudaId, objavaId }: { ponudaId: string; objavaId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await prisma.ponuda.update({ where: { id: ponudaId }, data: { prihvacena: true } });
        await prisma.objava.update({ where: { id: objavaId }, data: { status: "U_TOKU" } });
      }}
    >
      <button
        type="submit"
        className="mt-3 rounded-xl bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500 transition-colors"
      >
        Prihvati ponudu ✓
      </button>
    </form>
  );
}

function ZatvoriObjavaBtn({ objavaId }: { objavaId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await prisma.objava.update({ where: { id: objavaId }, data: { status: "ZAVRSENA" } });
      }}
    >
      <button
        type="submit"
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-soft transition-colors"
      >
        Označi kao završeno ✓
      </button>
    </form>
  );
}
