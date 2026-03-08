import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const schema = z.object({
  vrednost:  z.number().int().min(1).max(5),
  komentar:  z.string().max(500).optional(),
  majstorId: z.string().min(1),
  objavaId:  z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautorizovan." }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 });
    }

    const { vrednost, komentar, majstorId, objavaId } = parsed.data;

    // Verify the objava exists and current user is the author
    const objava = await prisma.objava.findUnique({
      where: { id: objavaId },
      include: { ponude: { where: { prihvacena: true, majstorId } } },
    });

    if (!objava) {
      return NextResponse.json({ error: "Objava nije pronađena." }, { status: 404 });
    }
    if (objava.autorId !== session.user.id) {
      return NextResponse.json({ error: "Nisi autor ove objave." }, { status: 403 });
    }
    if (objava.ponude.length === 0) {
      return NextResponse.json({ error: "Ovaj korisnik nema prihvaćenu ponudu." }, { status: 400 });
    }
    if (majstorId === session.user.id) {
      return NextResponse.json({ error: "Ne možeš oceniti sam sebe." }, { status: 400 });
    }

    // Create the rating (unique constraint [autorId, majstorId] prevents duplicates)
    await prisma.ocena.create({
      data: { vrednost, komentar, autorId: session.user.id, majstorId },
    });

    // Recalculate majstor's average rating
    const agg = await prisma.ocena.aggregate({
      where:  { majstorId },
      _avg:   { vrednost: true },
      _count: true,
    });
    await prisma.user.update({
      where: { id: majstorId },
      data: {
        ocena:     agg._avg.vrednost ?? 0,
        brojOcena: agg._count,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Već si ocenio ovog korisnika." }, { status: 409 });
    }
    return NextResponse.json({ error: "Greška servera." }, { status: 500 });
  }
}
