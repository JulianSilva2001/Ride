import NextAuth from "next-auth"
import CredentialsKey from "next-auth/providers/credentials"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsKey({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string

                let user = await db.user.findUnique({ where: { email } })

                if (!user) {
                    user = await db.user.create({
                        data: {
                            email,
                            name: "New User",
                            role: "USER"
                        }
                    })
                }

                return user
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token }) {
            return token
        }
    }
})
