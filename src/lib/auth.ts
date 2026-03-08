import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  lozinka: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as never,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:   { label: "Email",    type: "email" },
        lozinka: { label: "Lozinka",  type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.aktivan) return null;

        const valid = await bcrypt.compare(parsed.data.lozinka, user.lozinka);
        if (!valid) return null;

        return {
          id:    user.id,
          name:  user.ime,
          email: user.email,
          role:  user.role,
        };
      },
    }),
  ],
});
