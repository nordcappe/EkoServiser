import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import ProfilUrediForm from "./ProfilUrediForm";

export const metadata = { title: "Uredi profil" };

export default async function ProfilUrediPage() {
  const session = await getSession();
  if (!session) redirect("/prijava");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { ime: true, email: true, grad: true, bio: true, telefon: true },
  });
  if (!user) redirect("/prijava");

  return <ProfilUrediForm user={user} />;
}
