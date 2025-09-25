import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, PlusCircle } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";

const mockMedications = [
  {
    id: "1",
    name: "Lisinopril",
    use: "High Blood Pressure",
    tags: ["ACE inhibitor", "daily", "with food"],
    lastTaken: "Today, 8:00 AM",
  },
  {
    id: "2",
    name: "Metformin",
    use: "Diabetes Type 2",
    tags: ["biguanide", "twice daily", "oral"],
    lastTaken: "Today, 9:00 AM",
  },
  {
    id: "3",
    name: "Simvastatin",
    use: "High Cholesterol",
    tags: ["statin", "evening", "lipid-lowering"],
    lastTaken: "Yesterday, 9:00 PM",
  },
  {
    id: "4",
    name: "Amlodipine",
    use: "High Blood Pressure",
    tags: ["calcium channel blocker", "daily"],
    lastTaken: "Today, 8:00 AM",
  },
];

export default function PharmacyPage() {
  return (
    <Card className="neumorphic-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Virtual Pharmacy</CardTitle>
          <CardDescription>
            All your saved medications in one place.
          </CardDescription>
        </div>
        <ScanDrugDialog>
          <Button className="neumorphic-button">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
          </Button>
        </ScanDrugDialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Primary Use</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Last Taken</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMedications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.use}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {med.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{med.lastTaken}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="neumorphic-button">
                      <Clock className="mr-2 h-4 w-4" /> Log Dosage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
