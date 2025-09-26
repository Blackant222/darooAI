import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Avicenna - ابن سینا",
  description: "دستیار داروخانه شخصی شما",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased relative")}>
        <div className="fixed inset-0 z-[-1] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-white dark:from-blue-950/50 dark:via-purple-950/50 dark:to-black"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-pink-300 rounded-full filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <ThemeProvider>
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
