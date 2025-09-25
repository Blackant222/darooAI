'use client';

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

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drugs">Drug Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="neumorphic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,257</div>
              </CardContent>
            </Card>
            <Card className="neumorphic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Drugs Managed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="drugs" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>All Medications</CardTitle>
              <CardDescription>
                Manage all drugs in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Drug management table would go here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all users in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                User management table would go here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>AI Inconsistency Flags</CardTitle>
              <CardDescription>
                Review medications flagged for inconsistency by the AI. This tool helps simulate that process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="neumorphic-button">
                    Flag Medication Inconsistencies
                  </Button>
                </DialogTrigger>
                <DialogContent className="neumorphic-card">
                  <DialogHeader>
                    <DialogTitle>AI Inconsistency Check</DialogTitle>
                    <DialogDescription>
                      Enter drug details to check for potential inconsistencies.
                    </DialogDescription>
                  </DialogHeader>
                  <FlagMedicationForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
