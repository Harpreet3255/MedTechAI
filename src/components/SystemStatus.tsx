
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

const SystemStatus = () => {
  // services and aiModules data
  const services = [
    { name: "FHIR/HL7 Integration", status: "Online" },
    { name: "Kafka Event Streaming", status: "Online" },
    { name: "FastAPI Backend", status: "Online" },
    { name: "Apache NiFi", status: "Online" },
  ];

  const aiModules = [
    { name: "RL Bed Allocation Agent", version: "2.3", status: "Active" },
    { name: "BERT Triage NLP", version: "1.5", status: "Active" },
    { name: "XGBoost Wait Time Prediction", version: "3.1", status: "Active" },
    { name: "Patient Flow Optimizer", version: "2.0", status: "Active" },
  ];

  return (
    <Card className="col-span-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            System Status
            <Badge className="ml-2 bg-green-500">Online</Badge>
          </h2>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="font-semibold mb-2">Connected Services</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.name} className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <Badge variant={service.status === "Online" ? "default" : "destructive"}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-md border p-4">
            <h3 className="font-semibold mb-2">AI Module Status</h3>
            <div className="space-y-2">
              {aiModules.map((module) => (
                <div key={module.name} className="flex justify-between items-center">
                  <span className="text-sm">{module.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">v{module.version}</span>
                    <Badge variant={module.status === "Active" ? "default" : "outline"}>
                      {module.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatus;
