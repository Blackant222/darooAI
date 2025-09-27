'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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

        if (!('id' in user) || !user.id) {
            console.warn('DrugProvider: user has no id yet, skipping fetch', user);
            setDrugs([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const fetchDrugs = async () => {
            try {
                const res = await supabase
                    .from('drugs')
                    .select('*')
                    .eq('user_id', (user as any).id)
                    // Postgres folds unquoted identifiers to lowercase; DB column is `addedat`
                    .order('addedat', { ascending: false });

                // Debug full response
                console.debug('fetchDrugs raw response:', (() => { try { return JSON.stringify(res, Object.getOwnPropertyNames(res)); } catch(e){ return String(res); } })());

                if (res.error) {
                    const errObj = res.error as any;
                    // Build a safe serializable payload to log so Dev overlay doesn't show an empty object
                    let serializable: any = { note: 'Supabase error response' };
                    try {
                        serializable.res = {
                            status: (res as any).status ?? null,
                            statusText: (res as any).statusText ?? null,
                            data: (res as any).data ?? null,
                        };
                        serializable.error = {
                            message: errObj?.message ?? String(errObj),
                            details: errObj?.details ?? null,
                            hint: errObj?.hint ?? null,
                            code: errObj?.code ?? null,
                            status: errObj?.status ?? null,
                        };
                    } catch (e) {
                        serializable.error = { raw: String(errObj) };
                    }

                    try {
                        const safe = (() => {
                            try { return JSON.stringify(serializable); } catch (e) { return String(serializable); }
                        })();
                        // Use warn with a single string to avoid Next dev overlay creating a {} representation
                        console.warn('[Supabase] ' + safe);
                    } catch (e) {
                        // final fallback
                        console.warn('[Supabase] error (unserializable). See raw response in logs.');
                        try { console.warn('raw response:', JSON.stringify(res, Object.getOwnPropertyNames(res))); } catch (er) { console.warn('raw response (toString):', String(res)); }
                    }
                    return;
                }

                const data = res.data ?? [];
                const parsedData = data.map((drug: any) => ({
                    ...drug,
                    // normalize activeIngredients if stored as jsonb string
                    activeIngredients: typeof drug.activeIngredients === 'string'
                        ? JSON.parse(drug.activeIngredients)
                        : drug.activeIngredients,
                    // normalize DB column names to camelCase used in app
                    addedAt: drug.addedat ?? drug.addedAt ?? drug.added_at ?? null,
                }));
                setDrugs(parsedData as Drug[]);
            } catch (error: any) {
                try {
                    const payload = {
                        message: error?.message ?? String(error),
                        stack: error?.stack,
                        raw: (() => { try { return JSON.stringify(error, Object.getOwnPropertyNames(error)); } catch(e){ return String(error); } })(),
                    };
                    console.error('Detailed error fetching drugs from Supabase (catch): ' + JSON.stringify(payload));
                } catch (e) {
                    console.error('Error serializing fetch error: ' + String(e) + ' original error: ' + String(error));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDrugs();

        const channel = supabase.channel(`drugs:${(user as any).id}`);

        channel.on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'drugs',
            filter: `user_id=eq.${(user as any).id}`
        },
        (payload) => {
            console.log('Drug subscription payload received:', payload);
            const handlePayload = (record: any) => ({
                ...record,
                activeIngredients: typeof record.activeIngredients === 'string'
                    ? JSON.parse(record.activeIngredients)
                    : record.activeIngredients,
            });

            if (payload.eventType === 'INSERT') {
                setDrugs(currentDrugs => [handlePayload(payload.new), ...currentDrugs]);
            } else if (payload.eventType === 'UPDATE') {
                setDrugs(currentDrugs => currentDrugs.map(drug =>
                    drug.id === payload.new.id ? handlePayload(payload.new) : drug
                ));
            } else if (payload.eventType === 'DELETE') {
                setDrugs(currentDrugs => currentDrugs.filter(drug => drug.id !== payload.old.id));
            }
        })
        .subscribe((status, err) => {
            console.log('Drug subscription status:', status, 'Error:', err);
            if (status === 'SUBSCRIBED') {
                console.log('Successfully subscribed to drugs channel');
            }
            if (status === 'CHANNEL_ERROR') {
                console.error('Drug subscription channel error:', err);
                // Don't throw the error, just log it to avoid breaking the app
            }
            if (status === 'TIMED_OUT') {
                console.warn('Drug subscription timed out, retrying...');
                // Could implement retry logic here if needed
            }
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const addDrug = async (drug: Omit<Drug, 'id' | 'addedAt'>) => {
        if (!user || !('id' in user) || !user.id) throw new Error("User not authenticated to add drug.");

        const newDrug = {
            brandName: drug.brandName ?? null,
            activeIngredients: JSON.stringify(drug.activeIngredients ?? []),
            category: drug.category ?? null,
            tags: drug.tags ?? [],
            summary: drug.summary ?? null,
            sideEffects: drug.sideEffects ?? null,
            isTaking: !!drug.isTaking,
            frequency: drug.frequency ?? null,
            startDate: drug.startDate ?? null,
            user_id: (user as any).id,
            // insert using the actual DB column name
            addedAt: new Date().toISOString(),
        };

        // Insert and return full response for better error handling
        const res = await supabase.from('drugs').insert(newDrug).select();
        console.debug('addDrug response:', (() => { try { return JSON.stringify(res, Object.getOwnPropertyNames(res)); } catch(e){ return String(res); } })());
        if (res.error) {
            const err = res.error as any;
            const errMsg = { message: err.message ?? null, details: err.details ?? null, code: err.code ?? null, status: err.status ?? null };
            throw new Error(JSON.stringify(errMsg));
        }
    };

    const removeDrug = async (id: string) => {
        if (!user) throw new Error("User not authenticated to remove drug.");
        const res = await supabase.from('drugs').delete().eq('id', id).select();
        if (res.error) throw res.error;
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
