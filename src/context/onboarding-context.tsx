'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '@/firebase/client';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './auth-context';

interface OnboardingContextType {
    isFirstTime: boolean;
    completeOnboarding: () => Promise<void>;
    loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // If `onboardingCompleted` is explicitly false or doesn't exist, it's their first time.
                setIsFirstTime(data.onboardingCompleted === false);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user profile for onboarding status:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const completeOnboarding = async () => {
        if (!user) return;
        
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, { onboardingCompleted: true }, { merge: true });
            setIsFirstTime(false);
        } catch (error) {
            console.error("Error completing onboarding:", error);
        }
    };

    return (
        <OnboardingContext.Provider value={{ isFirstTime, completeOnboarding, loading }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
