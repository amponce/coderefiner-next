import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/app/lib/prisma";
import { CustomPrismaAdapter } from "@/lib/auth/custom-prisma-adapter";

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error("Missing GITHUB_CLIENT_ID");
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GITHUB_CLIENT_SECRET");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: CustomPrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
}; 