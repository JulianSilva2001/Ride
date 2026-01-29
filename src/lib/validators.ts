export const validateStep1 = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.make || data.make.length < 2 || data.make.length > 50) errors.make = "Please enter a valid vehicle make (2-50 chars)."
    if (!data.model || data.model.length < 1 || data.model.length > 50) errors.model = "Please enter a valid vehicle model."
    if (!data.year || data.year < 1995 || data.year > new Date().getFullYear() + 1) errors.year = "Enter a valid vehicle year (1995+)."
    if (!data.category) errors.category = "Please select a vehicle type."
    if (!data.transmission) errors.transmission = "Please select a transmission type."
    if (!data.fuelType) errors.fuelType = "Please select a fuel type."

    return errors
}

export const validateStep2 = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.location || data.location.length < 5 || data.location.length > 120) errors.location = "Please enter a valid pickup location (5-120 chars)."
    if (!data.availabilityType) errors.availabilityType = "Select availability type."
    // Custom date validation could go here if implemented

    return errors
}

export const validateStep3 = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.pricePerDay || data.pricePerDay < 5 || data.pricePerDay > 1000) errors.pricePerDay = "Enter a valid daily price ($5 - $1000)."
    if (data.securityDeposit && (data.securityDeposit < 0 || data.securityDeposit > 5000)) errors.securityDeposit = "Invalid deposit amount (0-5000)."
    if (!data.includedKm || data.includedKm < 0 || data.includedKm > 1000) errors.includedKm = "Enter valid included kilometers (0-1000)."
    if (data.includedKm > 0 && (!data.extraKmFee || data.extraKmFee < 0 || data.extraKmFee > 10)) errors.extraKmFee = "Enter valid extra km fee (0-10)."
    if (!data.fuelPolicy) errors.fuelPolicy = "Select a fuel policy."

    return errors
}

export const validateStep4 = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.description || data.description.length < 30 || data.description.length > 1000) errors.description = "Description must be between 30 and 1000 characters."

    return errors
}

export const validateStep5 = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.imageUrl || !data.imageUrl.startsWith("https://")) errors.imageUrl = "Provide a valid HTTPS image URL."

    return errors
}

export const validateStep6 = (data: any) => {
    const errors: Record<string, string> = {}
    const tier = data.protectionTier || "Basic"

    if ((tier === "Secure" || tier === "Pro") && !data.gpsInstalled) {
        errors.gpsInstalled = "GPS is required for Secure and Pro tiers."
    }

    return errors
}

export const validateStep7 = (data: any) => {
    const errors: Record<string, string> = {}

    if (!data.regNumber || data.regNumber.length < 4 || data.regNumber.length > 20) errors.regNumber = "Enter a valid registration number (4-20 chars)."
    if (!data.ownershipConfirmed) errors.ownershipConfirmed = "You must confirm authorization."

    return errors
}
