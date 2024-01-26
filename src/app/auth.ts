import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { db } from "@/db"

export const authConfig = {
    providers: [GitHub],
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig)
