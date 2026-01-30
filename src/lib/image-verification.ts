import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl'; // Ensure backend is loaded (optional if tfjs is full)
// Note: We'll rely on global tf or direct imports. Mobilenet loads tfjs internally usually or expects peer.

let model: mobilenet.MobileNet | null = null;
let isLoading = false;

// Labels mapping
const ALLOWED_KEYWORDS: Record<string, string[]> = {
    'COVER': ['car', 'cab', 'minivan', 'jeep', 'limousine', 'sports car', 'convertible', 'racer', 'vehicle', 'wheel', 'grille'],
    'FRONT': ['car', 'cab', 'minivan', 'jeep', 'limousine', 'sports car', 'convertible', 'racer', 'vehicle', 'grille', 'bumper'],
    'REAR': ['car', 'cab', 'minivan', 'jeep', 'limousine', 'sports car', 'convertible', 'racer', 'vehicle', 'trunk'],
    'SIDE': ['car', 'cab', 'minivan', 'jeep', 'limousine', 'sports car', 'convertible', 'racer', 'vehicle', 'door'],
    'WHEELS': ['wheel', 'disc brake', 'tire', 'car wheel', 'rim'],
    'INTERIOR_FRONT': ['steering wheel', 'odometer', 'seat belt', 'dashboard', 'car mirror'],
    'INTERIOR_REAR': ['seat belt', 'car seat', 'upholstery'],
    'BOOT': ['car', 'trunk', 'bag', 'luggage'], // Hard to detect empty boot
    'DAMAGE': [], // No verification for damage
    'GALLERY': [] // No verification
}

export const loadModel = async () => {
    if (model) return model;
    if (isLoading) {
        // Simple poll to wait for loading
        while (!model) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return model;
    }

    isLoading = true;
    try {
        console.log('Loading MobileNet model...');
        model = await mobilenet.load({ version: 2, alpha: 1.0 });
        console.log('MobileNet model loaded.');
    } catch (error) {
        console.error('Failed to load MobileNet:', error);
    } finally {
        isLoading = false;
    }
    return model;
}

export const verifyImage = async (imageElement: HTMLImageElement, label: string): Promise<{ valid: boolean, probability: number, prediction: string }> => {
    // Skip if no keywords for this label
    const keywords = ALLOWED_KEYWORDS[label];
    if (!keywords || keywords.length === 0) return { valid: true, probability: 1, prediction: 'Skipped' };

    const net = await loadModel();
    if (!net) return { valid: true, probability: 0, prediction: 'Model Failed' }; // Fail open

    try {
        const predictions = await net.classify(imageElement);
        // predictions is array of { className: string, probability: number }

        console.log(`Predictions for ${label}:`, predictions);

        // Check if any top prediction matches strict keywords
        const bestMatch = predictions.find(p =>
            keywords.some(k => p.className.toLowerCase().includes(k))
        );

        if (bestMatch && bestMatch.probability > 0.1) { // Low threshold because models vary
            return { valid: true, probability: bestMatch.probability, prediction: bestMatch.className };
        }

        // If no match, return invalid
        return {
            valid: false,
            probability: predictions[0]?.probability || 0,
            prediction: predictions[0]?.className || 'Unknown'
        };

    } catch (e) {
        console.error('Verification error:', e);
        return { valid: true, probability: 0, prediction: 'Error' }; // Fail open
    }
}
