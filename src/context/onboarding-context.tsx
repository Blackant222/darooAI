'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
        const fetchOnboardingStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116: row not found
                    throw error;
                }

                if (data) {
                    setIsFirstTime(!data.onboarding_completed);
                } else {
                    // If no profile exists, assume it's their first time.
                    setIsFirstTime(true);
                }
            } catch (error) {
                console.error("Error fetching user profile for onboarding status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOnboardingStatus();
    }, [user]);

    const completeOnboarding = async () => {
        if (!user) return;
        
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('id', user.id);

            if (error) throw error;

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
