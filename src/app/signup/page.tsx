import Link from "next/link";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-dvh py-12 bg-background">
      <Card className="mx-auto max-w-sm w-full neumorphic-card">
        <CardHeader>
          <Link
            href="/"
            className="flex items-center justify-center mb-4"
            prefetch={false}
          >
            <Pill className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl text-center font-headline">
            Create your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="John Doe"
                required
                className="neumorphic-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="neumorphic-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="neumorphic-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="health-conditions">
                Health Conditions (Optional)
              </Label>
              <Textarea
                id="health-conditions"
                placeholder="e.g., Hypertension, Diabetes Type 2"
                className="neumorphic-input"
              />
              <p className="text-xs text-muted-foreground">
                This helps us provide personalized insights.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard" className="w-full h-full flex items-center justify-center">Create an account</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline" prefetch={false}>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
