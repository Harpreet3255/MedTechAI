
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import DashboardStats from "@/components/DashboardStats";
import PatientFlow from "@/components/PatientFlow";
import BedAllocation from "@/components/BedAllocation";
import WaitTimePredictor from "@/components/WaitTimePredictor";
import HospitalMap from "@/components/HospitalMap";
import TriageAnalyzer from "@/components/TriageAnalyzer";
import SystemStatus from "@/components/SystemStatus";
import { Badge } from "@/components/ui/badge";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, Settings } from "lucide-react";

const Index = () => {
  const { loading, lastUpdated, refreshData } = useHospitalData();
  const [activeView, setActiveView] = useState("dashboard");

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time overview of hospital operations and patient flow
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {formatDate(lastUpdated)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                System Online
              </Badge>
              
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={loading}
                className="relative"
              >
                {loading ? "Refreshing..." : "Refresh Data"}
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-medflow-purple rounded-full"></span>
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Dashboard Settings</DropdownMenuItem>
                  <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
                  <DropdownMenuItem>View System Logs</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="mb-6 flex flex-nowrap overflow-x-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="patients">Patient Management</TabsTrigger>
              <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
              <TabsTrigger value="analysis">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <section>
                <DashboardStats />
              </section>
              
              <section>
                <PatientFlow />
              </section>
              
              <section className="grid md:grid-cols-2 gap-6">
                <HospitalMap />
                <div className="grid gap-6">
                  <BedAllocation />
                  <WaitTimePredictor />
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="patients" className="space-y-6">
              <section>
                <PatientFlow fullView={true} />
              </section>
              <section>
                <TriageAnalyzer />
              </section>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-6">
              <section className="grid md:grid-cols-2 gap-6">
                <BedAllocation fullView={true} />
                <HospitalMap />
              </section>
              <section>
                <WaitTimePredictor fullView={true} />
              </section>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6">
              <section>
                <DashboardStats fullView={true} />
              </section>
              <section className="grid md:grid-cols-2 gap-6">
                <TriageAnalyzer />
                <SystemStatus />
              </section>
            </TabsContent>
          </Tabs>
          
          <footer className="py-6 border-t mt-6">
            <div className="container mx-auto px-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>MedFlowAI © 2025 - AI Hospital Flow Optimization System</p>
                <p className="mt-1">All patient data is simulated for demonstration purposes.</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
