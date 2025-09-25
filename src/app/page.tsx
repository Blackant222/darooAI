import Link from "next/link";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div dir="rtl" className="flex flex-col min-h-dvh bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Pill className="h-6 w-6 text-primary" />
          <span className="mr-2 text-xl font-bold font-headline">دارو AI</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                  دستیار داروخانه شخصی شما
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  داروهای خود را با قدرت هوش مصنوعی اسکن، ردیابی و درک کنید. دارو AI به شما کمک می کند تا سلامتی خود را با سهولت و اطمینan مدیریت کنید.
                </p>
              </div>
              <div className="space-x-4 pt-6">
                <Button
                  asChild
                  size="lg"
                  className="neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/login">ورود</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="neumorphic-button bg-background hover:bg-accent/50"
                >
                  <Link href="/signup">ثبت نام</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; ۲۰۲۴ دارو AI. تمام حقوق محفوظ است.
        </p>
      </footer>
    </div>
  );
}
