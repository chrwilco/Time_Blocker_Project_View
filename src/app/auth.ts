import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { db } from "./lib/drizzle"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

export const authConfig = {
    providers: [GitHub],
    adapter: DrizzleAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({session, user}) {
            session.user.id = user.id
            return session
        }
    }
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig)

