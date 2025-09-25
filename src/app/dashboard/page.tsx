import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Lightbulb, Pill } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of your pharmacy.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="neumorphic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Medications
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              in your virtual pharmacy
            </p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              new recommendations available
            </p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card col-span-full lg:col-span-1 flex flex-col justify-center items-center p-6">
          <CardTitle className="text-lg font-semibold mb-2">
            Add New Medication
          </CardTitle>
          <CardDescription className="text-center mb-4">
            Scan a medicine label to get started.
          </CardDescription>
          <ScanDrugDialog>
            <Button className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90">
              <FileUp className="mr-2 h-4 w-4" /> Scan Now
            </Button>
          </ScanDrugDialog>
        </Card>
      </div>

      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            An overview of your recent dosage logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent activity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
