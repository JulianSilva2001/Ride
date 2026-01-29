"use server"

import { signIn } from "@/auth"


import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

async function saveFile(file: File | null): Promise<string | null> {
    if (!file || file.size === 0) return null

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), "public/uploads")
        await mkdir(uploadDir, { recursive: true })

        // Generate unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
        const filepath = join(uploadDir, filename)

        await writeFile(filepath, buffer)
        return `/uploads/${filename}`
    } catch (error) {
        console.error("Error saving file:", error)
        return null
    }
}

export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string || "USER"
    const callbackUrl = formData.get("callbackUrl") as string || "/"
    const name = formData.get("name") as string || email.split('@')[0]

    console.log("Registering user:", email, role)

    if (!email || !password) {
        throw new Error("Missing credentials")
    }

    const { db } = await import("@/lib/db")

    const existingUser = await db.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        // Proceed to sign in if user exists
    } else {
        try {
            // Personal Info
            const dobString = formData.get("dob") as string
            const dob = dobString ? new Date(dobString) : null
            const address = formData.get("address") as string
            const city = formData.get("city") as string
            const termsAccepted = formData.get("termsAccepted") === "true"

            // Host KYC Data
            const phone = formData.get("phone") as string || null
            const nic = formData.get("nic") as string || null

            // Driver Data
            const driverLicense = formData.get("driverLicense") as string || null
            const licenseExpiryString = formData.get("licenseExpiry") as string
            const licenseExpiry = licenseExpiryString ? new Date(licenseExpiryString) : null

            // Consents
            const vehicleOwnershipConfirmed = formData.get("vehicleOwnershipConfirmed") === "true"

            // Financials
            const bankName = formData.get("bankName") as string || null
            const branch = formData.get("branch") as string || null
            const accountName = formData.get("accountName") as string || null
            const accountNumber = formData.get("accountNumber") as string || null
            const accountType = formData.get("accountType") as string || "Savings"

            // File Uploads
            const nicFrontUrl = await saveFile(formData.get("nicFront") as File)
            const nicBackUrl = await saveFile(formData.get("nicBack") as File)
            const selfieUrl = await saveFile(formData.get("selfie") as File)
            const licenseFrontUrl = await saveFile(formData.get("licenseFront") as File)

            // Create User
            const newUser = await db.user.create({
                data: {
                    email,
                    name,
                    role,
                    dob,
                    address,
                    city,
                    termsAccepted,
                    // Host Specific Relation
                    ...(role === "HOST" ? {
                        kyc: {
                            create: {
                                phone,
                                nic,
                                nicFront: nicFrontUrl,
                                nicBack: nicBackUrl,
                                selfie: selfieUrl,
                                driverLicense,
                                licenseExpiry,
                                licenseFront: licenseFrontUrl,
                                vehicleOwnershipConfirmed,
                                bankName,
                                branch,
                                accountName,
                                accountNumber,
                                accountType,
                                status: "PENDING"
                            }
                        }
                    } : {})
                }
            })

            console.log("Created user in Postgres:", newUser.id);

        } catch (error) {
            console.error("Failed to create user in Postgres:", error);
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
