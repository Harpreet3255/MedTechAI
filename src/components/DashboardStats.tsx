
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@/components/ui/chart";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Bed, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardStats = ({ fullView = false }: { fullView?: boolean }) => {
  const { hospitalStats } = useHospitalData();
  
  const chartData = {
    data: [
      {
        name: "Last 24 Hours",
        patients: [32, 40, 37, 30, 25, 22, 28, 35, 42, 45, 48, 52, 55, 58, 62, 65, 69, 72, 75, 78, 80, 82, 81, 78],
        beds: [60, 58, 55, 52, 50, 48, 46, 44, 42, 40, 38, 36, 35, 34, 32, 30, 28, 26, 25, 28, 30, 28, 26, 28],
      }
    ]
  };
  
  const weekData = {
    data: [
      {
        name: "Last 7 Days",
        patients: [285, 290, 305, 320, 310, 315, 330],
        beds: [40, 38, 35, 32, 34, 30, 28],
      }
    ]
  };
  
  const monthData = {
    data: [
      {
        name: "Last 30 Days",
        patients: Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 280),
        beds: Array.from({length: 30}, () => Math.floor(Math.random() * 15) + 25),
      }
    ]
  };

  return (
    <div className={`space-y-6 ${fullView ? "" : ""}`}>
      <div className="grid-dashboard">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            {fullView && (
              <div className="mt-4 h-1 bg-gray-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-medflow-purple" 
                  style={{ width: `${(hospitalStats.totalPatients / 500) * 100}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.availableBeds}</div>
            <p className="text-xs text-muted-foreground">-5% from yesterday</p>
            {fullView && (
              <div className="mt-4 h-1 bg-gray-100 rounded overflow-hidden">
                <div 
                  className={`h-full ${hospitalStats.availableBeds < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${(hospitalStats.availableBeds / 150) * 100}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.averageWaitTime} min</div>
            <p className="text-xs text-muted-foreground">+8 minutes from yesterday</p>
            {fullView && (
              <div className="mt-4 h-1 bg-gray-100 rounded overflow-hidden">
                <div 
                  className={`h-full ${hospitalStats.averageWaitTime > 30 ? 'bg-red-500' : hospitalStats.averageWaitTime > 20 ? 'bg-orange-400' : 'bg-green-500'}`}
                  style={{ width: `${(hospitalStats.averageWaitTime / 60) * 100}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Triage Distribution</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-1 text-xs">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span>Urgent ({hospitalStats.triageDistribution.urgent})</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                <span>High ({hospitalStats.triageDistribution.high})</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span>Med ({hospitalStats.triageDistribution.medium})</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span>Low ({hospitalStats.triageDistribution.low})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hospital Activity</CardTitle>
          {fullView && (
            <Tabs defaultValue="day" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="day">24 Hours</TabsTrigger>
                <TabsTrigger value="week">7 Days</TabsTrigger>
                <TabsTrigger value="month">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          {!fullView && (
            <Badge variant="outline">Last 24h</Badge>
          )}
        </CardHeader>
        <CardContent>
          {fullView ? (
            <div>
              <TabsContent value="day" className="h-[300px]">
                <AreaChart
                  data={chartData.data}
                  index="name"
                  categories={["patients", "beds"]}
                  colors={["#9b87f5", "#0EA5E9"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={40}
                />
              </TabsContent>
              <TabsContent value="week" className="h-[300px]">
                <AreaChart
                  data={weekData.data}
                  index="name"
                  categories={["patients", "beds"]}
                  colors={["#9b87f5", "#0EA5E9"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={40}
                />
              </TabsContent>
              <TabsContent value="month" className="h-[300px]">
                <AreaChart
                  data={monthData.data}
                  index="name"
                  categories={["patients", "beds"]}
                  colors={["#9b87f5", "#0EA5E9"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={40}
                />
              </TabsContent>
            </div>
          ) : (
            <div className="h-[200px]">
              <AreaChart
                data={chartData.data}
                index="name"
                categories={["patients", "beds"]}
                colors={["#9b87f5", "#0EA5E9"]}
                valueFormatter={(value) => `${value} units`}
                yAxisWidth={40}
              />
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#9b87f5]"></span>
                <span className="text-sm">Patients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0EA5E9]"></span>
                <span className="text-sm">Available Beds</span>
              </div>
            </div>
            
            {fullView && (
              <Button variant="outline" size="sm">Export Data</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
