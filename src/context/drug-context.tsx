'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '@/firebase/client';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './auth-context';

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

interface DrugContextType {
    drugs: Drug[];
    addDrug: (drug: Omit<Drug, 'id' | 'addedAt'>) => Promise<void>;
    removeDrug: (id: string) => Promise<void>;
    loading: boolean;
}

const DrugContext = createContext<DrugContextType | undefined>(undefined);

export function DrugProvider({ children }: { children: ReactNode }) {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setDrugs([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const drugsCollectionRef = collection(db, 'users', user.uid, 'drugs');
        
        const unsubscribe = onSnapshot(drugsCollectionRef, (snapshot) => {
            const drugsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Drug));
            // Sort by addedAt descending
            drugsData.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            setDrugs(drugsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching drugs:", error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user]);

    const addDrug = async (drug: Omit<Drug, 'id' | 'addedAt'>) => {
        if (!user) throw new Error("User not authenticated");
        const drugsCollectionRef = collection(db, 'users', user.uid, 'drugs');
        await addDoc(drugsCollectionRef, {
            ...drug,
            addedAt: new Date().toISOString(),
        });
    };

    const removeDrug = async (id: string) => {
        if (!user) throw new Error("User not authenticated");
        const drugDocRef = doc(db, 'users', user.uid, 'drugs', id);
        await deleteDoc(drugDocRef);
    };

    return (
        <DrugContext.Provider value={{ drugs, addDrug, removeDrug, loading }}>
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
