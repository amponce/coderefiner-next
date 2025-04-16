import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler; 