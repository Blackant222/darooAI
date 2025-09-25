'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Drug {
    id: string;
    drugName: string;
    category: string;
    tags: string[];
    addedAt: string;
}

interface DrugContextType {
    drugs: Drug[];
    addDrug: (drug: Drug) => void;
    removeDrug: (id: string) => void;
}

const DrugContext = createContext<DrugContextType | undefined>(undefined);

export function DrugProvider({ children }: { children: ReactNode }) {
    const [drugs, setDrugs] = useState<Drug[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const localData = localStorage.getItem('drugs');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Failed to parse drugs from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('drugs', JSON.stringify(drugs));
        } catch (error) {
            console.error("Failed to save drugs to localStorage", error);
        }
    }, [drugs]);

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
