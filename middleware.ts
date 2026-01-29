import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnHostPage = req.nextUrl.pathname.startsWith("/host")
    const isHostLandingPage = req.nextUrl.pathname === "/host"
    const isHostCreatePage = req.nextUrl.pathname === "/host/create"

    if (isOnHostPage && !isHostLandingPage && !isLoggedIn) {
        if (isHostCreatePage) {
            const newUrl = new URL("/signup", req.nextUrl.origin)
            newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
            return Response.redirect(newUrl)
        }
        const newUrl = new URL("/api/auth/signin", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
