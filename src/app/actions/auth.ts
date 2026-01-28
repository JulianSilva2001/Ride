"use server"

import { signIn } from "@/auth"


export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string || "USER"
    const callbackUrl = formData.get("callbackUrl") as string || "/"

    console.log("Registering user:", email, role)

    if (!email || !password) {
        throw new Error("Missing credentials")
    }

    // Check if user already exists to avoid duplicate error or unintended role overwrite
    // Check if user already exists in Firestore
    const { adminDb } = await import("@/lib/firebase");
    const snapshot = await adminDb.collection('users').where('email', '==', email).limit(1).get();
    const existingUser = !snapshot.empty;

    if (existingUser) {
        // Decide logic: Fail if exists? Or just sign in?
        // For 'Signup', typically we want to fail if taken, OR just log them in if password matches.
        // Given current simple auth (no real password check), we'll just log them in.
        // But if they wanted to be a HOST and are already a USER, we might want to update? 
        // For now, let's keep it simple: Just proceed to signIn. 
        // Real-world: return error "User already exists".
        console.log("User exists, proceeding to sign in")
    } else {
        try {
            const { adminDb } = await import("@/lib/firebase");

            // Generate a new ID for the user
            const usersRef = adminDb.collection('users');
            // We can check existence here too just in case, but let's assume valid
            // Or better, let's strictly check by email before creating

            const snapshot = await usersRef.where('email', '==', email).limit(1).get();
            if (!snapshot.empty) {
                console.log("User already exists in Firestore");
            } else {
                // Determine ID? We can let Firestore generate one, or use email hash, or just random
                const newUserRef = usersRef.doc();

                await newUserRef.set({
                    id: newUserRef.id, // Store ID in doc too for convenience
                    email,
                    name: email.split('@')[0],
                    role: role,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    image: null
                });
                console.log("Created user in Firestore:", newUserRef.id);
            }

        } catch (error) {
            console.error("Failed to create user in Firestore:", error);
            throw new Error("Registration failed");
        }
    }

    // Sign in using the credentials provider
    await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
    })
}

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const callbackUrl = formData.get("callbackUrl") as string || "/"

    if (!email || !password) {
        throw new Error("Missing credentials")
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl,
        })
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            throw new Error("Invalid credentials.")
        }
        throw error
    }
}
