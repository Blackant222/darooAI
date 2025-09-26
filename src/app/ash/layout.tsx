import { AdminProvider } from "@/context/admin-auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div dir="rtl" className="min-h-dvh flex flex-col bg-muted/20 dark:bg-background/40">
        {children}
      </div>
    </AdminProvider>
  );
}
