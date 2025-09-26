'use client';

import { useAdminAuth } from "@/context/admin-auth-context";
import { AdminDashboard } from "./admin-dashboard";
import { AdminLogin } from "./admin-login";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">در حال بررسی دسترسی...</p>
      </div>
    );
  }
  
  return admin ? <AdminDashboard /> : <AdminLogin />;
}
