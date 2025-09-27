'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Users, LogOut, Package, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlagMedicationForm } from "./flag-medication-form";
import { useAdminAuth } from "@/context/admin-auth-context";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types"; // Assuming this type is still valid or can be adapted
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns-jalali";
import { IbnSinaLogo } from "@/components/ibn-sina-logo";

interface Stats {
    users: number;
    drugs: number;
    blogPosts: number;
}

export function AdminDashboard() {
  const { logout } = useAdminAuth();
  const [stats, setStats] = useState<Stats>({ users: 0, drugs: 0, blogPosts: 3 });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true);
      try {
        const { count: usersCount, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        const { count: drugsCount, error: drugsError } = await supabase
            .from('drugs')
            .select('*', { count: 'exact', head: true });

        if (drugsError) throw drugsError;

        setStats(prev => ({...prev, users: usersCount ?? 0, drugs: drugsCount ?? 0 }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoadingStats(false);
    }
    
    async function fetchUsers() {
        setLoadingUsers(true);
        try {
            const { data: usersData, error } = await supabase
                .from('profiles')
                .select('id, full_name, created_at, email') // Assuming email is needed and available
                .order('created_at', { ascending: false });

            if (error) throw error;

            // The user type might need adjustment based on the 'profiles' table structure
            const formattedUsers = usersData.map(u => ({
                id: u.id,
                fullName: u.full_name,
                email: u.email, // This might not be on the profiles table by default
                createdAt: u.created_at,
            })) as User[];

            setAllUsers(formattedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoadingUsers(false);
    }

    fetchStats();
    fetchUsers();
  }, []);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <Link href="/ash" className="flex items-center gap-2" prefetch={false}>
          <IbnSinaLogo className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold font-headline">
            ادمین ابن سینا
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            بازگشت به اپلیکیشن
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="ml-2" />
            خروج
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">داشبورد ادمین</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>
            <TabsTrigger value="drugs" disabled>مدیریت داروها</TabsTrigger>
            <TabsTrigger value="blog" disabled>مدیریت بلاگ</TabsTrigger>
            <TabsTrigger value="feedback">بازخورد هوش مصنوعی</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">تعداد کل کاربران</CardTitle>
                    <Users className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loadingStats ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.users}</div>}
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">تعداد کل داروهای مدیریت شده</CardTitle>
                    <Package className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loadingStats ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{stats.drugs}</div>}
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">تعداد پست های وبلاگ</CardTitle>
                    <FileText className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.blogPosts}</div>
                </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>همه کاربران</CardTitle>
                <CardDescription>تمام کاربران سیستم را مدیریت کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-xl border neumorphic-light dark:neumorphic-dark">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>نام کامل</TableHead>
                                    <TableHead>ایمیل</TableHead>
                                    <TableHead>تاریخ ثبت‌نام</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingUsers ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : allUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.email || 'N/A'}</TableCell>
                                        <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'yyyy/MM/dd') : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="feedback" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>پرچم های عدم انطباق هوش مصنوعی</CardTitle>
                <CardDescription>
                    داروهایی که توسط هوش مصنوعی برای عدم انطباق علامت گذاری شده اند را بررسی کنید. این ابزار به شبیه سازی این فرآیند کمک می کند.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Dialog>
                    <DialogTrigger asChild>
                    <Button>
                        پرچم گذاری عدم انطباق داروها
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>بررسی عدم انطباق توسط هوش مصنوعی</DialogTitle>
                        <DialogDescription>
                        برای بررسی عدم انطباق های احتمالی، جزئیات دارو را وارد کنید.
                        </DialogDescription>
                    </DialogHeader>
                    <FlagMedicationForm />
                    </DialogContent>
                </Dialog>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
