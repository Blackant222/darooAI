'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  admin: boolean;
  loading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/status');
        if (res.ok) {
          const { admin } = await res.json();
          setAdmin(admin);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        setAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmin(true);
        return { success: true };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAdmin(false);
    router.push('/ash');
  };

  const value = { admin, loading, login, logout };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }
  return context;
}
