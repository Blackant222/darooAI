import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function ProfilePage() {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          Update your personal information and health conditions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 neumorphic-card p-1">
            <AvatarImage src="https://picsum.photos/seed/avatar1/80/80" data-ai-hint="person portrait"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="neumorphic-button">
            Change Photo
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="User" className="neumorphic-input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="user@example.com"
              disabled
              className="neumorphic-input"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="health-conditions">Health Conditions</Label>
          <Textarea
            id="health-conditions"
            defaultValue="Hypertension, Diabetes Type 2"
            className="neumorphic-input"
          />
        </div>
        <div className="flex justify-end">
          <Button className="neumorphic-button">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
