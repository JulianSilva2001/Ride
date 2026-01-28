import NextAuth from "next-auth"
import CredentialsKey from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
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

                // Import Firestore dynamically
                const { adminDb } = await import("@/lib/firebase")

                const usersRef = adminDb.collection('users');
                const snapshot = await usersRef.where('email', '==', email).limit(1).get();

                if (snapshot.empty) {
                    return null
                }

                const userDoc = snapshot.docs[0];
                const userData = userDoc.data();

                return {
                    id: userDoc.id,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    image: userData.image,
                }
            },
        }),
    ],
})
