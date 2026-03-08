import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const schema = z.object({
  naslov:     z.string().min(3).max(120),
  opis:       z.string().max(1000).optional(),
  kategorija: z.string().min(1),
  grad:       z.string().min(2).max(60),
  slika:      z.string().max(2_000_000).optional().nullable(),
  lat:        z.number().optional().nullable(),
  lng:        z.number().optional().nullable(),
  adresa:     z.string().max(200).optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kategorija = searchParams.get("kategorija");
  const grad = searchParams.get("grad");

  const objave = await prisma.objava.findMany({
    where: {
      status: { not: "OBRISANA" },
      ...(kategorija && { kategorija }),
      ...(grad && { grad: { contains: grad } }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { ponude: { select: { id: true } }, autor: { select: { ime: true } } },
  });

  return NextResponse.json(objave);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautorizovan." }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 });

    const objava = await prisma.objava.create({
      data: { ...parsed.data, autorId: session.user.id },
    });

    return NextResponse.json(objava, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Greška servera." }, { status: 500 });
  }
}
