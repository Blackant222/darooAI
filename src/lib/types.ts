export interface User {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
    healthConditions?: string[];
    allergies?: string[];
    healthGoals?: string[];
    activityLevel?: string;
    smokingStatus?: string;
    onboardingCompleted?: boolean;
}

export interface Ingredient {
    name: string;
    dosage?: string;
}

export interface Drug {
    id: string;
    brandName?: string;
    activeIngredients: Ingredient[];
    category: string;
    tags: string[];
    summary: string;
    sideEffects: string;
    addedAt: string;
    isTaking?: boolean;
    frequency?: string;
    startDate?: string;
}
