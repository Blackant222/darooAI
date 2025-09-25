'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    addedAt: string;
    isTaking?: boolean;
    frequency?: string;
    startDate?: string;
}

interface DrugContextType {
    drugs: Drug[];
    addDrug: (drug: Drug) => void;
    removeDrug: (id: string) => void;
}

const DrugContext = createContext<DrugContextType | undefined>(undefined);

export function DrugProvider({ children }: { children: ReactNode }) {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage only on the client-side, after initial render
    useEffect(() => {
        try {
            const localData = localStorage.getItem('drugs');
            if (localData) {
                setDrugs(JSON.parse(localData));
            }
        } catch (error) {
            console.error("Failed to parse drugs from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever drugs change, but only after initial load
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('drugs', JSON.stringify(drugs));
            } catch (error) {
                console.error("Failed to save drugs to localStorage", error);
            }
        }
    }, [drugs, isLoaded]);

    const addDrug = (drug: Drug) => {
        setDrugs(prevDrugs => [...prevDrugs, drug]);
    };

    const removeDrug = (id: string) => {
        setDrugs(prevDrugs => prevDrugs.filter(drug => drug.id !== id));
    };

    return (
        <DrugContext.Provider value={{ drugs, addDrug, removeDrug }}>
            {children}
        </DrugContext.Provider>
    );
}

export function useDrugContext() {
    const context = useContext(DrugContext);
    if (context === undefined) {
        throw new Error('useDrugContext must be used within a DrugProvider');
    }
    return context;
}
