import type { NextAuthConfig } from "next-auth";

// Minimal NextAuth config safe to import in Edge contexts (middleware).
// Does NOT reference Prisma, bcrypt, or any Node.js-only modules.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/prijava",
    error:  "/prijava",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
