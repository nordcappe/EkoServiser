import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@ekoserviser.rs" },
    update: {},
    create: {
      ime: "Admin",
      email: "admin@ekoserviser.rs",
      lozinka: adminHash,
      role: Role.ADMIN,
      grad: "Beograd",
      bio: "Administrator platforme EkoServiser.",
    },
  });

  // Demo majstor
  const majstorHash = await bcrypt.hash("majstor123", 12);
  const majstor = await prisma.user.upsert({
    where: { email: "marko@primer.rs" },
    update: {},
    create: {
      ime: "Marko Petrović",
      email: "marko@primer.rs",
      lozinka: majstorHash,
      role: Role.MAJSTOR,
      grad: "Beograd",
      bio: "Iskusni majstor za elektroniku i kućne uređaje. Pomažem zajednici već 10 godina.",
      ocena: 4.9,
      brojOcena: 47,
    },
  });

  // Demo korisnik
  const korisnikHash = await bcrypt.hash("korisnik123", 12);
  const korisnik = await prisma.user.upsert({
    where: { email: "jovana@primer.rs" },
    update: {},
    create: {
      ime: "Jovana Nikolić",
      email: "jovana@primer.rs",
      lozinka: korisnikHash,
      role: Role.KORISNIK,
      grad: "Novi Sad",
    },
  });

  // Demo objave
  const kategorije = [
    { naslov: "Toster koji ne greje", kategorija: "kucni-uredjaji", grad: "Beograd", lat: 44.8176, lng: 20.4569 },
    { naslov: "Bicikl - spao lanac", kategorija: "bicikli", grad: "Novi Sad", lat: 45.2671, lng: 19.8335 },
    { naslov: "Jakna - pukao rajsferšlus", kategorija: "odeca", grad: "Niš", lat: 43.3209, lng: 21.8954 },
    { naslov: "Laptop ne pali se", kategorija: "elektronika", grad: "Beograd", lat: 44.8050, lng: 20.4750 },
    { naslov: "Stolica - klimaju noge", kategorija: "namestaj", grad: "Kragujevac", lat: 44.0165, lng: 20.9270 },
  ];

  for (const kat of kategorije) {
    await prisma.objava.create({
      data: {
        ...kat,
        opis: "Potrebna pomoć oko popravke.",
        status: "AKTIVNA",
        autorId: korisnik.id,
      },
    });
  }

  // Jedna ponuda
  const prvaObjava = await prisma.objava.findFirst({ where: { autorId: korisnik.id } });
  if (prvaObjava) {
    await prisma.ponuda.upsert({
      where: { majstorId_objavaId: { majstorId: majstor.id, objavaId: prvaObjava.id } },
      update: {},
      create: {
        poruka: "Mogu da pomognem! Imam alat i iskustvo sa sličnim problemom.",
        majstorId: majstor.id,
        objavaId: prvaObjava.id,
      },
    });
  }

  console.log("✅ Seed završen.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
