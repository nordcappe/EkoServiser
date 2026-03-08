import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  ime:     z.string().min(2).max(80),
  email:   z.string().email(),
  lozinka: z.string().min(8).max(128),
  grad:    z.string().min(2).max(60),
  role:    z.enum(["KORISNIK", "MAJSTOR", "VOLONTER"]).default("KORISNIK"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 });
    }

    const { ime, email, lozinka, grad, role } = parsed.data;

    const postoji = await prisma.user.findUnique({ where: { email } });
    if (postoji) {
      return NextResponse.json({ error: "Email je već registrovan." }, { status: 409 });
    }

    const hash = await bcrypt.hash(lozinka, 12);
    await prisma.user.create({
      data: { ime, email, lozinka: hash, grad, role },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
