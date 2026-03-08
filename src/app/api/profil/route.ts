import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const schema = z.object({
  ime:           z.string().min(2).max(80).optional(),
  grad:          z.string().max(60).optional().nullable(),
  bio:           z.string().max(500).optional().nullable(),
  telefon:       z.string().max(30).optional().nullable(),
  stara_lozinka: z.string().optional(),
  nova_lozinka:  z.string().min(6).max(100).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautorizovan." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { ime: true, email: true, grad: true, bio: true, telefon: true },
  });
  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautorizovan." }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 });
    }

    const { ime, grad, bio, telefon, stara_lozinka, nova_lozinka } = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (ime)          updateData.ime     = ime;
    if (grad !== undefined) updateData.grad = grad;
    if (bio  !== undefined) updateData.bio  = bio;
    if (telefon !== undefined) updateData.telefon = telefon;

    // Password change — only if both fields are provided
    if (nova_lozinka) {
      if (!stara_lozinka) {
        return NextResponse.json({ error: "Unesite staru lozinku." }, { status: 400 });
      }
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { lozinka: true },
      });
      if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

      const valid = await bcrypt.compare(stara_lozinka, user.lozinka);
      if (!valid) {
        return NextResponse.json({ error: "Stara lozinka nije ispravna." }, { status: 400 });
      }
      updateData.lozinka = await bcrypt.hash(nova_lozinka, 12);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, ime: true, email: true, grad: true, bio: true, telefon: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Greška servera." }, { status: 500 });
  }
}
