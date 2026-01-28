import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], // Providers added in auth.ts for Node.js environment
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
        authorized({ auth, request: nextUrl }) {
            const isLoggedIn = !!auth?.user
            const isOnHostPage = nextUrl.nextUrl.pathname.startsWith("/host")
            const isHostLandingPage = nextUrl.nextUrl.pathname === "/host"
            const isHostCreatePage = nextUrl.nextUrl.pathname === "/host/create"

            if (isOnHostPage && !isHostLandingPage && !isLoggedIn) {
                if (isHostCreatePage) {
                    // Logic handled in middleware usually, but authorized callback can also handle generic access
                    return false
                }
                return false
            }
            return true
        },
    },
} satisfies NextAuthConfig
