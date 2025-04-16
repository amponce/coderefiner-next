import { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";
import type { PrismaClient } from "@prisma/client";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    createUser: async (data: Omit<AdapterUser, "id">) => {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          avatar_url: data.image, // Map image to avatar_url
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar_url, // Map avatar_url back to image
      };
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar_url, // Map avatar_url to image
      };
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar_url, // Map avatar_url to image
      };
    },
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      });
      if (!account) return null;
      
      const { user } = account;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar_url, // Map avatar_url to image
      };
    },
    updateUser: async (data) => {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name,
          email: data.email,
          avatar_url: data.image, // Map image to avatar_url
        },
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar_url, // Map avatar_url to image
      };
    },
    deleteUser: async (userId) => {
      await prisma.user.delete({
        where: { id: userId },
      });
    },
    linkAccount: async (data: AdapterAccount) => {
      await prisma.account.create({
        data: {
          userId: data.userId,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          type: data.type,
          refresh_token: data.refresh_token,
          access_token: data.access_token,
          expires_at: data.expires_at,
          token_type: data.token_type,
          scope: data.scope,
          id_token: data.id_token,
          session_state: data.session_state,
        },
      });
    },
    unlinkAccount: async ({ provider, providerAccountId }) => {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },
    createSession: async (data: AdapterSession) => {
      return await prisma.session.create({
        data,
      });
    },
    getSessionAndUser: async (sessionToken) => {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;

      const { user } = session;
      return {
        session: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: null,
          image: user.avatar_url, // Map avatar_url to image
        },
      };
    },
    updateSession: async (data) => {
      return await prisma.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      });
    },
    deleteSession: async (sessionToken) => {
      await prisma.session.delete({
        where: { sessionToken },
      });
    },
    createVerificationToken: async (data: VerificationToken) => {
      return await prisma.verificationToken.create({
        data,
      });
    },
    useVerificationToken: async (identifier_token) => {
      try {
        return await prisma.verificationToken.delete({
          where: {
            identifier_token,
          },
        });
      } catch (error) {
        // If token is not found, return null
        return null;
      }
    },
  };
} 