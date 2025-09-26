'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '@/firebase/client';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from './auth-context';

export interface Drug {
  id: string;
  brandName?: string;
  activeIngredients: { name: string; dosage?: string }[];
  category: string;
  tags: string[];
  summary: string;
  sideEffects: string;
  addedAt: string; // ISO String
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
        const q = query(drugsCollectionRef, orderBy('addedAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const drugsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Drug));
            setDrugs(drugsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching drugs from Firestore:", error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user]);

    const addDrug = async (drug: Omit<Drug, 'id' | 'addedAt'>) => {
        if (!user) throw new Error("User not authenticated to add drug.");
        const drugsCollectionRef = collection(db, 'users', user.uid, 'drugs');
        await addDoc(drugsCollectionRef, {
            ...drug,
            addedAt: new Date().toISOString(),
        });
    };

    const removeDrug = async (id: string) => {
        if (!user) throw new Error("User not authenticated to remove drug.");
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
