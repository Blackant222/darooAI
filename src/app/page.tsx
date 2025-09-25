import { ArrowRight, CheckCircle, ChevronDown, Feather } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
      >
        <path
          d="M3 7V5C3 3.89543 3.89543 3 5 3H7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 3H19C20.1046 3 21 3.89543 21 5V7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 17V19C21 20.1046 20.1046 21 19 21H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 21H5C3.89543 21 3 20.1046 3 19V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'اسکن و شناسایی هوشمند',
    description:
      'به سادگی از برچسب داروی خود عکس بگیرید. هوش مصنوعی ما فوراً آن را شناسایی، دسته‌بندی و به داروخانه مجازی شما اضافه می‌کند.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
      >
        <path
          d="M8 21H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15V21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 3C9.25 3 7 5.25 7 8C7 10.75 9.25 13 12 13C14.75 13 17 10.75 17 8C17 5.25 14.75 3 12 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13C13.0625 13 14.0275 12.6175 14.75 11.9675L17.5 15.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'چت‌بات دارویی شخصی',
    description:
      'علائم خود را با چت‌بات هوش مصنوعی ما در میان بگذارید. او با در نظر گرفتن داروهای موجود و شرایط سلامتی شما، بهترین گزینه را پیشنهاد می‌دهد.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
      >
        <path
          d="M4 11V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 11H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11V11.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 11V11.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 11V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'مدیریت موجودی داروها',
    description:
      'تمام داروهای خود را در یک مکان سازماندهی کنید. دیگر نگران تاریخ انقضا یا فراموش کردن داروهای موجود در خانه نباشید.',
  },
];

const blogPosts = [
  {
    slug: 'common-cold-remedies',
    title: 'بهترین داروهای بدون نسخه برای سرماخوردگی',
    excerpt:
      'با شروع فصل سرما، شناخت بهترین و موثرترین داروهای بدون نسخه برای مقابله با علائم سرماخوردگی اهمیت پیدا می‌کند...',
    author: 'تیم دارو AI',
    date: '۱۴۰۳/۰۴/۱۰',
    image: 'https://picsum.photos/seed/blog1/600/400',
    imageHint: 'medicine pills',
  },
  {
    slug: 'headache-types',
    title: 'انواع سردرد و روش‌های درمان هر کدام',
    excerpt:
      'آیا می‌دانستید هر سردردی یکسان نیست؟ از سردردهای تنشی گرفته تا میگرن، هرکدام درمان متفاوتی دارند. در این مقاله به بررسی آن‌ها می‌پردازیم.',
    author: 'دکتر سلام',
    date: '۱۴۰۳/۰۴/۰۸',
    image: 'https://picsum.photos/seed/blog2/600/400',
    imageHint: 'person headache',
  },
  {
    slug: 'ai-in-healthcare',
    title: 'نقش هوش مصنوعی در آینده مراقبت‌های بهداشتی',
    excerpt:
      'هوش مصنوعی در حال ایجاد انقلابی در صنعت بهداشت و درمان است. از تشخیص بیماری‌ها تا شخصی‌سازی درمان، با آینده پزشکی آشنا شوید.',
    author: 'تیم دارو AI',
    date: '۱۴۰۳/۰۴/۰۵',
    image: 'https://picsum.photos/seed/blog3/600/400',
    imageHint: 'AI healthcare',
  },
];

const testimonials = [
  {
    name: 'سارا محمدی',
    title: 'مادر و کارمند',
    avatar: 'https://picsum.photos/seed/person1/100/100',
    avatarHint: 'woman portrait',
    quote:
      '"دارو AI زندگی من را متحول کرده است. مدیریت داروهای خانواده‌ام همیشه یک چالش بود، اما حالا با یک اسکن ساده همه چیز مرتب است. چت‌بات هوشمندش هم همیشه بهترین راهنمایی را می‌کند."',
  },
  {
    name: 'رضا قاسمی',
    title: 'دانشجوی پزشکی',
    avatar: 'https://picsum.photos/seed/person2/100/100',
    avatarHint: 'man portrait',
    quote:
      '"به عنوان کسی که با داروها سروکار دارد، تحت تاثیر دقت و هوشمندی این اپلیکیشن قرار گرفتم. ابزار دسته‌بندی و تگ‌گذاری آن فوق‌العاده است و به درک بهتر داروها کمک می‌کند."',
  },
  {
    name: 'فاطمه احمدی',
    title: 'سالمند',
    avatar: 'https://picsum.photos/seed/person3/100/100',
    avatarHint: 'elderly woman portrait',
    quote:
      '"من همیشه نگران تداخل دارویی بودم. با دارو AI، لیستی از تمام داروهایم دارم و چت‌بات به من کمک می‌کند تا با اطمینان بیشتری از آن‌ها استفاده کنم. استفاده از آن هم بسیار آسان است."',
  },
];

export default function LandingPage() {
  return (
    <div dir="rtl" className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm transition-all">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Logo collapsed={false} />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a
              href="#features"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              ویژگی‌ها
            </a>
            <a
              href="#how-it-works"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              چطور کار می‌کند؟
            </a>
            <a
              href="#blog"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              بلاگ
            </a>
            <a
              href="#faq"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              سوالات متداول
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:inline-flex hover:bg-muted/50"
            >
              <Link href="/login">ورود</Link>
            </Button>
            <Button
              asChild
              className="neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/signup">رایگان شروع کنید</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 bg-grid-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  دستیار دارویی هوشمند شما
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  داروهای خود را با قدرت هوش مصنوعی اسکن، ردیابی و درک کنید.
                  دارو AI به شما کمک می‌کند تا سلامتی خود را با سهولت و اطمینان
                  مدیریت کنید.
                </p>
              </div>
              <div className="space-x-reverse space-x-4 pt-6">
                <Button
                  asChild
                  size="lg"
                  className="group neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/signup">
                    شروع رایگان
                    <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group neumorphic-button bg-background hover:bg-accent/50"
                >
                  <Link href="#how-it-works">
                    بیشتر بدانید
                    <ChevronDown className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative mt-16 flex justify-center">
              <div className="neumorphic-card rounded-xl p-2 w-full max-w-4xl">
                <Image
                  src="https://picsum.photos/seed/app-dashboard/1200/675"
                  data-ai-hint="app dashboard"
                  width={1200}
                  height={675}
                  alt="App Dashboard"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3 lg:gap-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="neumorphic-button mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-card">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-headline">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 bg-muted/20"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  شروع آسان
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  فقط در سه مرحله ساده
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ما فرایند مدیریت داروها را برای شما ساده کرده‌ایم. با دارو AI،
                  سلامتی در دستان شماست.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="neumorphic-card mb-4 flex h-16 w-16 items-center justify-center rounded-full border text-3xl font-bold text-primary">
                  ۱
                </div>
                <h3 className="text-xl font-bold">ثبت‌نام و ایجاد پروفایل</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  در کمتر از یک دقیقه حساب کاربری خود را بسازید و اطلاعات اولیه
                  سلامتی خود را وارد کنید.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="neumorphic-card mb-4 flex h-16 w-16 items-center justify-center rounded-full border text-3xl font-bold text-primary">
                  ۲
                </div>
                <h3 className="text-xl font-bold">اسکن داروهایتان</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  با دوربین گوشی خود از برچسب داروها عکس بگیرید تا به طور
                  خودکار به قفسه دارویی مجازی شما اضافه شوند.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="neumorphic-card mb-4 flex h-16 w-16 items-center justify-center rounded-full border text-3xl font-bold text-primary">
                  ۳
                </div>
                <h3 className="text-xl font-bold">دریافت راهنمایی هوشمند</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  با چت‌بات ما صحبت کنید و بر اساس داروهای موجود و شرایطتان،
                  توصیه‌های شخصی‌سازی شده دریافت کنید.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                کاربران ما چه می‌گویند؟
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                نگاهی به تجربیات افرادی که با دارو AI سلامتی خود را بهتر مدیریت
                می‌کنند.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="neumorphic-card flex flex-col justify-between rounded-lg p-6"
                >
                  <p className="text-sm text-foreground/80">
                    {testimonial.quote}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      data-ai-hint={testimonial.avatarHint}
                      width={40}
                      height={40}
                      alt={`Avatar of ${testimonial.name}`}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="w-full py-12 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                از بلاگ ما بخوانید
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                جدیدترین مقالات و نکات سلامتی از تیم متخصصین دارو AI.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-lg neumorphic-card h-full flex flex-col">
                    <Image
                      src={post.image}
                      data-ai-hint={post.imageHint}
                      width={600}
                      height={400}
                      alt={post.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="neumorphic-button">
                <Link href="/blog">مشاهده همه مقالات</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                سوالات متداول
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                پاسخ سوالات خود را در اینجا پیدا کنید.
              </p>
            </div>
            <Accordion type="single" collapsible className="mt-12 w-full">
              <AccordionItem value="item-1" className="neumorphic-card mb-4 rounded-lg px-4">
                <AccordionTrigger>آیا دارو AI رایگان است؟</AccordionTrigger>
                <AccordionContent>
                  بله، نسخه فعلی دارو AI با تمام ویژگی‌های اصلی شامل اسکن دارو،
                  مدیریت داروخانه و چت‌بات هوشمند کاملاً رایگان است.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="neumorphic-card mb-4 rounded-lg px-4">
                <AccordionTrigger>
                  اطلاعات پزشکی من چگونه استفاده می‌شود؟
                </AccordionTrigger>
                <AccordionContent>
                  ما به حریم خصوصی شما اهمیت می‌دهیم. اطلاعات شما فقط برای
                  شخصی‌سازی تجربه‌تان در اپلیکیشن، به خصوص برای ارائه
                  توصیه‌های دقیق‌تر توسط چت‌بات، استفاده می‌شود و با هیچ شخص
                  ثالثی به اشتراک گذاشته نمی‌شود.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="neumorphic-card mb-4 rounded-lg px-4">
                <AccordionTrigger>
                  آیا توصیه‌های چت‌بات جایگزین مشاوره پزشک است؟
                </AccordionTrigger>
                <AccordionContent>
                  خیر. چت‌بات دارو AI یک ابزار کمکی هوشمند برای راهنمایی اولیه
                  است و هرگز نباید جایگزین مشاوره با یک پزشک یا داروساز
                  متخصص شود. همیشه برای نگرانی‌های جدی پزشکی با یک متخصص مشورت
                  کنید.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="neumorphic-card mb-4 rounded-lg px-4">
                <AccordionTrigger>
                  چه نوع داروهایی را می‌توانم اسکن کنم؟
                </AccordionTrigger>
                <AccordionContent>
                  شما می‌توانید اکثر داروهای تجویزی و بدون نسخه که دارای
                  بسته‌بندی و برچسب خوانا هستند را اسکن کنید. برای بهترین نتیجه،
                  از یک تصویر واضح و با نور کافی استفاده کنید.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 bg-muted/20">
          <div className="container flex flex-col items-center gap-4 px-4 text-center md:px-6">
            <Feather className="h-10 w-10 text-primary" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              آماده‌اید تا کنترل سلامتی خود را به دست بگیرید؟
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              به هزاران کاربر راضی ما بپیوندید و مدیریت داروهای خود را هوشمند
              کنید.
            </p>
            <Button
              asChild
              size="lg"
              className="group neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
            >
              <Link href="/signup">
                همین حالا شروع کنید
                <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 py-12 md:px-6">
          <div className="grid gap-2">
            <Logo collapsed={false} />
            <p className="text-sm text-muted-foreground">
              دستیار دارویی هوشمند شما.
            </p>
          </div>
          <div className="grid gap-2 text-sm">
            <h3 className="font-semibold">محصول</h3>
            <Link href="#features" className="text-muted-foreground hover:text-foreground">ویژگی‌ها</Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground">سوالات متداول</Link>
          </div>
          <div className="grid gap-2 text-sm">
            <h3 className="font-semibold">شرکت</h3>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground">بلاگ</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">درباره ما</Link>
          </div>
          <div className="grid gap-2 text-sm">
            <h3 className="font-semibold">قوانین</h3>
            <Link href="#" className="text-muted-foreground hover:text-foreground">حریم خصوصی</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">شرایط استفاده</Link>
          </div>
        </div>
        <div className="border-t py-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; ۲۰۲۴ دارو AI. تمام حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}
