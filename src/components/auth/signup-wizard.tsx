"use client"

import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Car, FileText, User, Camera, Upload, X, RefreshCw, CreditCard, ShieldCheck } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupWizard({ callbackUrl }: { callbackUrl?: string }) {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState("USER")
    const [loading, setLoading] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        // Account
        email: "",
        password: "",
        role: "USER",
        name: "", // Full Name

        // Personal (Step 1)
        dob: "",
        address: "",
        city: "",
        termsAccepted: false,

        // Host Verification (Step 2 & 3)
        phone: "",
        nic: "",
        driverLicense: "",
        licenseExpiry: "",

        // Financials (Step 4)
        bankName: "",
        branch: "",
        accountName: "",
        accountNumber: "",
        accountType: "Savings",

        // Consents
        vehicleOwnershipConfirmed: false,
    })

    // File storage
    const [selfieFile, setSelfieFile] = useState<File | null>(null)
    const [nicFrontFile, setNicFrontFile] = useState<File | null>(null)
    const [nicBackFile, setNicBackFile] = useState<File | null>(null)
    const [licenseFrontFile, setLicenseFrontFile] = useState<File | null>(null)

    // Previews
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
    const [nicFrontPreview, setNicFrontPreview] = useState<string | null>(null)
    const [nicBackPreview, setNicBackPreview] = useState<string | null>(null)
    const [licenseFrontPreview, setLicenseFrontPreview] = useState<string | null>(null)

    // Webcam State
    const [isWebcamOpen, setIsWebcamOpen] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Hidden Inputs
    const selfieInputRef = useRef<HTMLInputElement>(null)
    const nicFrontInputRef = useRef<HTMLInputElement>(null)
    const nicBackInputRef = useRef<HTMLInputElement>(null)
    const licenseFrontInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleRoleChange = (value: string) => {
        setRole(value)
        setFormData({ ...formData, role: value })
    }

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault()

        // Validation Logic
        if (step === 2 && role === "HOST") {
            const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/
            if (!nicRegex.test(formData.nic)) {
                alert("Invalid NIC format. Use 9 digits + V/X or 12 digits.")
                return
            }
            const phoneRegex = /^(\+94|0)?7[0-9]{8}$/
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
                alert("Invalid Phone format. Use +947XXXXXXXX or 07XXXXXXXX.")
                return
            }
        }

        // Step 3 Validation (Vehicle Ownership)
        if (step === 3 && role === "HOST") {
            if (!formData.vehicleOwnershipConfirmed) {
                alert("You must confirm vehicle ownership/authorization to proceed.")
                return
            }
        }

        setStep(step + 1)
    }

    const prevStep = () => {
        setStep(step - 1)
    }

    // --- File Handling ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'selfie' | 'nicFront' | 'nicBack' | 'licenseFront') => {
        const file = e.target.files?.[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            if (type === 'selfie') {
                setSelfieFile(file)
                setSelfiePreview(previewUrl)
            } else if (type === 'nicFront') {
                setNicFrontFile(file)
                setNicFrontPreview(previewUrl)
            } else if (type === 'nicBack') {
                setNicBackFile(file)
                setNicBackPreview(previewUrl)
            } else if (type === 'licenseFront') {
                setLicenseFrontFile(file)
                setLicenseFrontPreview(previewUrl)
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
            finalData.append(key, String(value))
        })
        finalData.append("callbackUrl", callbackUrl || "/")

        // Append files
        if (selfieFile) finalData.append("selfie", selfieFile)
        if (nicFrontFile) finalData.append("nicFront", nicFrontFile)
        if (nicBackFile) finalData.append("nicBack", nicBackFile)
        if (licenseFrontFile) finalData.append("licenseFront", licenseFrontFile)

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Full Name (as per NIC)</Label>
                                    <Input id="name" name="name" required placeholder="Pasindu Silva" value={formData.name} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" required value={formData.dob} onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" name="email" type="email" required placeholder="Email address" value={formData.email} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="address">Residential Address</Label>
                                    <Input id="address" name="address" required placeholder="No. 123, Galle Road" value={formData.address} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="city">City / Area</Label>
                                    <Input id="city" name="city" required placeholder="Colombo 03" value={formData.city} onChange={handleChange} />
                                </div>
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

                            <div className="flex items-start space-x-2 pt-2">
                                <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={(c) => setFormData({ ...formData, termsAccepted: c as boolean })} />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I agree to the Terms of Service and Privacy Policy
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        By signing up you agree to our policies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Identification (Host Only) */}
                    {step === 2 && role === "HOST" && (
                        <div className="space-y-6">
                            <div className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded text-center">
                                We need to verify your identity before you can list cars.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">Mobile Number</Label>
                                    <Input id="phone" name="phone" type="tel" required placeholder="+94 7X XXX XXXX" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="nic">NIC Number</Label>
                                    <Input id="nic" name="nic" required placeholder="199XXXXXXXXX or 9XXXXXXXXV" value={formData.nic} onChange={handleChange} />
                                </div>
                            </div>

                            {/* NIC Front & Back */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NIC Front</Label>
                                    {nicFrontPreview ? (
                                        <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                            <img src={nicFrontPreview} alt="NIC Front" className="w-full h-full object-contain" />
                                            <Button type="button" variant="secondary" size="sm" className="absolute bottom-1 right-1 h-6 text-xs" onClick={() => { setNicFrontPreview(null); setNicFrontFile(null) }}>Change</Button>
                                        </div>
                                    ) : (
                                        <div onClick={() => nicFrontInputRef.current?.click()} className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                            <FileText className="text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Upload Front</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" ref={nicFrontInputRef} onChange={(e) => handleFileSelect(e, 'nicFront')} />
                                </div>

                                <div className="space-y-2">
                                    <Label>NIC Back</Label>
                                    {nicBackPreview ? (
                                        <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                            <img src={nicBackPreview} alt="NIC Back" className="w-full h-full object-contain" />
                                            <Button type="button" variant="secondary" size="sm" className="absolute bottom-1 right-1 h-6 text-xs" onClick={() => { setNicBackPreview(null); setNicBackFile(null) }}>Change</Button>
                                        </div>
                                    ) : (
                                        <div onClick={() => nicBackInputRef.current?.click()} className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                            <FileText className="text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Upload Back</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" ref={nicBackInputRef} onChange={(e) => handleFileSelect(e, 'nicBack')} />
                                </div>
                            </div>

                            {/* Selfie Section (Existing) */}
                            <div className="space-y-3 pt-4 border-t">
                                <canvas ref={canvasRef} className="hidden" />
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
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border h-48 mx-auto">
                                        <img src={selfiePreview} alt="Selfie Preview" className="w-full h-full object-cover" />
                                        <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => { setSelfiePreview(null); setSelfieFile(null); }}>
                                            <RefreshCw size={14} className="mr-2" /> Retake
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button type="button" variant="outline" className="h-20 flex flex-col gap-2" onClick={startWebcam}>
                                            <Camera size={20} className="text-primary" />
                                            <span className="text-xs">Take Selfie</span>
                                        </Button>
                                        <Button type="button" variant="outline" className="h-20 flex flex-col gap-2" onClick={() => selfieInputRef.current?.click()}>
                                            <Upload size={20} className="text-gray-500" />
                                            <span className="text-xs">Upload</span>
                                        </Button>
                                        <input type="file" accept="image/*" className="hidden" ref={selfieInputRef} onChange={(e) => handleFileSelect(e, 'selfie')} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Driver Verification (Host Only) */}
                    {step === 3 && role === "HOST" && (
                        <div className="space-y-6">
                            <div className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded text-center">
                                Verify your driving license details (Optional for now).
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="driverLicense">License Number <span className="text-xs text-gray-400">(Optional)</span></Label>
                                    <Input id="driverLicense" name="driverLicense" placeholder="Optional" value={formData.driverLicense} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="licenseExpiry">Expiry Date <span className="text-xs text-gray-400">(Optional)</span></Label>
                                    <Input id="licenseExpiry" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>License Front Image <span className="text-xs text-gray-400">(Optional)</span></Label>
                                {licenseFrontPreview ? (
                                    <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={licenseFrontPreview} alt="License Front" className="w-full h-full object-contain" />
                                        <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => { setLicenseFrontPreview(null); setLicenseFrontFile(null) }}>Change</Button>
                                    </div>
                                ) : (
                                    <div onClick={() => licenseFrontInputRef.current?.click()} className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                        <CreditCard className="text-gray-400 mb-2" />
                                        <div className="text-sm text-gray-600">Upload License Front</div>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="hidden" ref={licenseFrontInputRef} onChange={(e) => handleFileSelect(e, 'licenseFront')} />
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="vehicleOwnership" checked={formData.vehicleOwnershipConfirmed} onCheckedChange={(c) => setFormData({ ...formData, vehicleOwnershipConfirmed: c as boolean })} />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="vehicleOwnership" className="text-sm font-medium leading-none">
                                            I confirm I have legal authority to rent the vehicles I list.
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            You must be the owner or have explicit permission.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Financials (Host Only) */}
                    {step === 4 && role === "HOST" && (
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500 mb-4 bg-green-50 p-3 rounded text-center">
                                Where should we send your earnings?
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Account Type</Label>
                                    <Select value={formData.accountType} onValueChange={(val) => setFormData({ ...formData, accountType: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Savings">Savings</SelectItem>
                                            <SelectItem value="Current">Current</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Select value={formData.bankName} onValueChange={(val) => setFormData({ ...formData, bankName: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BOC">Bank of Ceylon</SelectItem>
                                            <SelectItem value="Peoples">People's Bank</SelectItem>
                                            <SelectItem value="Sampath">Sampath Bank</SelectItem>
                                            <SelectItem value="HNB">Hatton National Bank</SelectItem>
                                            <SelectItem value="Commercial">Commercial Bank</SelectItem>
                                            <SelectItem value="NDB">National Development Bank</SelectItem>
                                            <SelectItem value="Seylan">Seylan Bank</SelectItem>
                                            <SelectItem value="Nations">Nations Trust Bank</SelectItem>
                                            <SelectItem value="Pan Asia">Pan Asia Bank</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="branch">Branch</Label>
                                <Input id="branch" name="branch" type="text" required placeholder="e.g. Colombo 03" value={formData.branch} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="accountName">Account Name</Label>
                                <Input id="accountName" name="accountName" type="text" required placeholder="Name on Account" value={formData.accountName} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input id="accountNumber" name="accountNumber" type="text" required placeholder="00000000" value={formData.accountNumber} onChange={handleChange} />
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
