"use client"

import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Car, FileText, User, Camera, Upload, X, RefreshCw } from "lucide-react"

export default function SignupWizard({ callbackUrl }: { callbackUrl?: string }) {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState("USER")
    const [loading, setLoading] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "USER",
        phone: "",
        nic: "",
        bankName: "",
        branch: "",
        accountName: "",
        accountNumber: "",
        // Store base64 strings or real files here? For server actions, FormData is easier with Files.
        // But for previews we need local URLs.
    })

    // File storage (separate from simple state to avoid complexity with value binding)
    const [selfieFile, setSelfieFile] = useState<File | null>(null)
    const [nicFile, setNicFile] = useState<File | null>(null)

    // Previews
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
    const [nicPreview, setNicPreview] = useState<string | null>(null)

    // Webcam State
    const [isWebcamOpen, setIsWebcamOpen] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Hidden Inputs
    const selfieInputRef = useRef<HTMLInputElement>(null)
    const nicInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleRoleChange = (value: string) => {
        setRole(value)
        setFormData({ ...formData, role: value })
    }

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault()
        setStep(step + 1)
    }

    const prevStep = () => {
        setStep(step - 1)
    }

    // --- File Handling ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'selfie' | 'nic') => {
        const file = e.target.files?.[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            if (type === 'selfie') {
                setSelfieFile(file)
                setSelfiePreview(previewUrl)
            } else {
                setNicFile(file)
                setNicPreview(previewUrl)
            }
        }
    }

    // --- Webcam Logic ---

    const startWebcam = async () => {
        setIsWebcamOpen(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }
        } catch (err) {
            console.error("Error accessing webcam:", err)
            alert("Could not access camera. Please upload a file instead.")
            setIsWebcamOpen(false)
        }
    }

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setIsWebcamOpen(false)
    }

    const captureSelfie = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            if (context) {
                // Set canvas dimensions to match video
                canvasRef.current.width = videoRef.current.videoWidth
                canvasRef.current.height = videoRef.current.videoHeight

                // Draw
                context.drawImage(videoRef.current, 0, 0)

                // Get Base64
                const dataUrl = canvasRef.current.toDataURL('image/jpeg')
                setSelfiePreview(dataUrl)

                // Convert to File
                fetch(dataUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })
                        setSelfieFile(file)
                    })

                stopWebcam()
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Create FormData
        const finalData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            finalData.append(key, value)
        })
        finalData.append("callbackUrl", callbackUrl || "/")

        // Append files
        if (selfieFile) finalData.append("selfie", selfieFile)
        if (nicFile) finalData.append("nic", nicFile)

        try {
            await register(finalData)
        } catch (error) {
            console.error("Signup failed", error)
            alert("Signup failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    return (
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border">

                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        {role === "HOST" ? "Become a Host" : "Create an account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {role === "HOST"
                            ? `Step ${step} of 4: ${step === 1 ? "Account Info" :
                                step === 2 ? "Personal Details" :
                                    step === 3 ? "Verification" : "Financials"
                            }`
                            : "Sign up to start your journey"
                        }
                    </p>
                </div>

                {/* Progress Bar (Host Only) */}
                {role === "HOST" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={step === 4 || role === "USER" ? handleSubmit : nextStep}>

                    {/* STEP 1: Account Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="sr-only">Email address</Label>
                                <Input
                                    id="email" name="email" type="email" required placeholder="Email address"
                                    value={formData.email} onChange={handleChange}
                                    className="rounded-md"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="sr-only">Password</Label>
                                <Input
                                    id="password" name="password" type="password" required placeholder="Password"
                                    value={formData.password} onChange={handleChange}
                                    className="rounded-md"
                                />
                            </div>
                            <div className="pt-2">
                                <Label className="text-sm font-medium text-gray-700">I want to:</Label>
                                <RadioGroup value={role} onValueChange={handleRoleChange} className="mt-2 space-y-2">
                                    <div className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer ${role === "USER" ? "border-primary bg-primary/5" : "hover:bg-gray-50"}`}>
                                        <RadioGroupItem value="USER" id="r1" />
                                        <Label htmlFor="r1" className="flex-1 cursor-pointer flex items-center gap-2"><User size={16} /> Rent a car (Guest)</Label>
                                    </div>
                                    <div className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer ${role === "HOST" ? "border-primary bg-primary/5" : "hover:bg-gray-50"}`}>
                                        <RadioGroupItem value="HOST" id="r2" />
                                        <Label htmlFor="r2" className="flex-1 cursor-pointer flex items-center gap-2"><Car size={16} /> List my car (Host)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Identification (Host Only) */}
                    {step === 2 && role === "HOST" && (
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded text-center">
                                We need to verify your identity before you can list cars.
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone" name="phone" type="tel" required placeholder="+1 234 567 890"
                                    value={formData.phone} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="nic">NIC / ID Number</Label>
                                <Input
                                    id="nic" name="nic" type="text" required placeholder="National ID Number"
                                    value={formData.nic} onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Verification (Host Only) */}
                    {step === 3 && role === "HOST" && (
                        <div className="space-y-6">

                            {/* Webcam Preview/Capture */}
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Selfie Section */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Camera size={18} /> Selfie Verification
                                </Label>

                                {isWebcamOpen ? (
                                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                                        <div className="absolute bottom-4 flex gap-4">
                                            <Button type="button" variant="destructive" size="sm" onClick={stopWebcam}>Cancel</Button>
                                            <Button type="button" onClick={captureSelfie}>Capture</Button>
                                        </div>
                                    </div>
                                ) : selfiePreview ? (
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={selfiePreview} alt="Selfie Preview" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="absolute bottom-2 right-2"
                                            onClick={() => { setSelfiePreview(null); setSelfieFile(null); }}
                                        >
                                            <RefreshCw size={14} className="mr-2" /> Retake
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button type="button" variant="outline" className="h-24 flex flex-col gap-2" onClick={startWebcam}>
                                            <Camera size={24} className="text-primary" />
                                            <span>Take Selfie</span>
                                        </Button>
                                        <Button type="button" variant="outline" className="h-24 flex flex-col gap-2" onClick={() => selfieInputRef.current?.click()}>
                                            <Upload size={24} className="text-gray-500" />
                                            <span>Upload Selfie</span>
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={selfieInputRef}
                                            onChange={(e) => handleFileSelect(e, 'selfie')}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* NIC Section */}
                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <FileText size={18} /> NIC / ID Upload
                                </Label>

                                {nicPreview ? (
                                    <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={nicPreview} alt="NIC Preview" className="w-full h-full object-contain" />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="absolute bottom-2 right-2"
                                            onClick={() => { setNicPreview(null); setNicFile(null); }}
                                        >
                                            <RefreshCw size={14} className="mr-2" /> Change
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer" onClick={() => nicInputRef.current?.click()}>
                                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <Upload className="text-gray-500" />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={nicInputRef}
                                    onChange={(e) => handleFileSelect(e, 'nic')}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Financials (Host Only) */}
                    {step === 4 && role === "HOST" && (
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500 mb-4 bg-green-50 p-3 rounded text-center">
                                Where should we send your earnings?
                            </div>
                            <div>
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input
                                    id="bankName" name="bankName" type="text" required placeholder="e.g. Bank of Ceylon, Sampath Bank"
                                    value={formData.bankName} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="branch">Branch</Label>
                                <Input
                                    id="branch" name="branch" type="text" required placeholder="e.g. Colombo 03"
                                    value={formData.branch} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="accountName">Account Name</Label>
                                <Input
                                    id="accountName" name="accountName" type="text" required placeholder="Name on Account"
                                    value={formData.accountName} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                    id="accountNumber" name="accountNumber" type="text" required placeholder="00000000"
                                    value={formData.accountNumber} onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                                Back
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading ? "Processing..." : (step === 4 || role === "USER" ? "Complete Signup" : "Next")}
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:text-primary/90">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
