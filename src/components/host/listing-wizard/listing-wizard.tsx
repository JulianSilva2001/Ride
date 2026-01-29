"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateDraft, publishListing } from "@/app/actions/listing"
import VehicleBasics from "./steps/step-1-basics"
import LocationStep from "./steps/step-2-location"
import PricingStep from "./steps/step-3-pricing"
import DetailsStep from "./steps/step-4-details"
import ImagesStep from "./steps/step-5-images"
import ProtectionStep from "./steps/step-6-protection"
import LegalStep from "./steps/step-7-legal"
import ReviewStep from "./steps/step-8-review"
import { Loader2 } from "lucide-react"

import { validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateStep6, validateStep7 } from "@/lib/validators"
import { useToast } from "@/hooks/use-toast"

// Defines the shape of the wizard
const STEPS = [
    { id: 'basics', title: 'Vehicle Basics', component: VehicleBasics, validator: validateStep1 },
    { id: 'location', title: 'Location & Availability', component: LocationStep, validator: validateStep2 },
    { id: 'pricing', title: 'Pricing & Rules', component: PricingStep, validator: validateStep3 },
    { id: 'details', title: 'Details & Features', component: DetailsStep, validator: validateStep4 },
    { id: 'images', title: 'Photos', component: ImagesStep, validator: validateStep5 },
    { id: 'protection', title: 'Protection & GPS', component: ProtectionStep, validator: validateStep6 },
    { id: 'legal', title: 'Legal & Verification', component: LegalStep, validator: validateStep7 },
    { id: 'review', title: 'Review & Publish', component: ReviewStep, validator: () => ({}) },
]

export default function ListingWizard({ carId, initialData }: { carId: string, initialData?: any }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [data, setData] = useState<any>(initialData || {})
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { toast } = useToast()

    const StepComponent = STEPS[currentStep].component

    const handleUpdate = (newData: any) => {
        setData((prev: any) => ({ ...prev, ...newData }))
        // Clear errors for modified fields
        const newErrors = { ...errors }
        Object.keys(newData).forEach(key => delete newErrors[key])
        setErrors(newErrors)
    }

    const handleNext = async () => {
        // Validate current step
        const stepValidator = STEPS[currentStep].validator
        const stepErrors = stepValidator(data)

        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors)
            const firstError = Object.values(stepErrors)[0]
            toast({
                title: "Validation Error",
                description: firstError,
                variant: "destructive",
            })
            return
        }

        setSaving(true)
        // Auto-save on next
        await updateDraft(carId, data)
        setSaving(false)

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            // Publish flow
            await publishListing(carId)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{STEPS[currentStep].title}</h2>
                    <span className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm min-h-[400px]">
                <StepComponent data={data} updateData={handleUpdate} errors={errors} />
            </div>

            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(currentStep - 1)}
                >
                    Back
                </Button>
                <Button onClick={handleNext} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentStep === STEPS.length - 1 ? "Publish Listing" : "Next"}
                </Button>
            </div>
        </div>
    )
}
