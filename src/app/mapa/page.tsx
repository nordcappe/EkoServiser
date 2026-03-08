import { prisma } from "@/lib/db";
import { MapView } from "@/components/MapView";
import { getKategorija } from "@/lib/utils";

export const metadata = { title: "Mapa popravki" };

export default async function MapaPage() {
  const objave = await prisma.objava.findMany({
    where: { status: { not: "OBRISANA" }, lat: { not: null }, lng: { not: null } },
    select: { id: true, naslov: true, grad: true, kategorija: true, lat: true, lng: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const points = objave
    .filter((o) => o.lat && o.lng)
    .map((o) => ({
      lat:   o.lat!,
      lng:   o.lng!,
      label: `${getKategorija(o.kategorija).ikona} ${o.naslov} - ${o.grad}`,
      type:  "objava" as const,
      id:    o.id,
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Mapa popravki</h1>
        <p className="text-gray-500 mt-1">
          {objave.length} aktivnih objava na mapi
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-card overflow-hidden">
        <MapView points={points} height="600px" />
      </div>

      <p className="mt-3 text-xs text-gray-400 text-center">
        Napomena: Lokacije se dodaju automatski kad korisnik označi adresu pri objavljivanju.
      </p>
    </div>
  );
}
