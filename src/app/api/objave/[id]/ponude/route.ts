import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const schema = z.object({ poruka: z.string().min(5).max(600) });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautorizovan." }, { status: 401 });

  const { id: objavaId } = await params;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 });

    const objava = await prisma.objava.findUnique({ where: { id: objavaId } });
    if (!objava || objava.status === "OBRISANA")
      return NextResponse.json({ error: "Objava ne postoji." }, { status: 404 });

    if (objava.autorId === session.user.id)
      return NextResponse.json({ error: "Ne možeš ponuditi pomoć za svoju objavu." }, { status: 400 });

    const ponuda = await prisma.ponuda.create({
      data: { poruka: parsed.data.poruka, majstorId: session.user.id, objavaId },
    });

    return NextResponse.json(ponuda, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "Već si poslao/la ponudu za ovu objavu." }, { status: 409 });
    return NextResponse.json({ error: "Greška servera." }, { status: 500 });
  }
}
