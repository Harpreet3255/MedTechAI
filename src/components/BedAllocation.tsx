
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const BedAllocation = ({ fullView = false }: { fullView?: boolean }) => {
  const { beds, departments } = useHospitalData();
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  
  // Group beds by department
  const bedsByDepartment = departments.map((dept) => {
    const departmentBeds = beds.filter((bed) => bed.department === dept.id);
    return {
      department: dept,
      beds: departmentBeds,
    };
  });

  const handleBedClick = (bedId: string) => {
    setSelectedBed(selectedBed === bedId ? null : bedId);
  };

  const selectedBedInfo = selectedBed 
    ? beds.find(bed => bed.id === selectedBed) 
    : null;

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Bed Allocation</CardTitle>
          {fullView && <Badge className="bg-medflow-purple">AI Assisted</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emergency">
          <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
            {departments.map((dept) => (
              <TabsTrigger key={dept.id} value={dept.id} className="whitespace-nowrap">
                {dept.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {bedsByDepartment.map((deptBeds) => (
            <TabsContent key={deptBeds.department.id} value={deptBeds.department.id}>
              <div className="text-sm mb-2">
                <span className="font-medium">{deptBeds.department.currentPatients}/{deptBeds.department.capacity}</span> beds in use
              </div>
              
              <div className={`grid ${fullView ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8' : 'grid-cols-3 sm:grid-cols-4'} gap-2 mt-4`}>
                {deptBeds.beds.map((bed) => (
                  <div
                    key={bed.id}
                    className={`relative p-2 rounded-md text-center cursor-pointer transition-transform ${
                      selectedBed === bed.id ? 'transform scale-105 ring-2 ring-offset-2 ring-primary' : ''
                    } ${
                      bed.status === "available"
                        ? "bed-available"
                        : bed.status === "occupied"
                        ? "bed-occupied"
                        : bed.status === "cleaning"
                        ? "bed-cleaning"
                        : "bed-reserved"
                    } ${bed.aiRecommendation ? "ring-2 ring-offset-2 ring-medflow-purple" : ""}`}
                    onClick={() => handleBedClick(bed.id)}
                  >
                    <div className="font-medium text-xs">{bed.id}</div>
                    <div className="text-xs">{bed.status}</div>
                    {bed.aiRecommendation && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-medflow-purple">AI</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-gray-500"></span>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                  <span>Cleaning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  <span>Reserved</span>
                </div>
              </div>
              
              {selectedBedInfo && (
                <div className="mt-4 border rounded-md p-3 text-sm animate-fade-in">
                  <h4 className="font-semibold mb-2">Bed {selectedBedInfo.id} Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground">Status:</p>
                      <p className="font-medium capitalize">{selectedBedInfo.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department:</p>
                      <p className="font-medium">{departments.find(d => d.id === selectedBedInfo.department)?.name}</p>
                    </div>
                    {selectedBedInfo.patientId && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Patient ID:</p>
                        <p className="font-medium">{selectedBedInfo.patientId}</p>
                      </div>
                    )}
                    {selectedBedInfo.aiRecommendation && (
                      <div className="col-span-2 bg-medflow-purple bg-opacity-10 p-2 rounded mt-1">
                        <p className="font-semibold text-medflow-purple">AI Recommendation:</p>
                        <p>{selectedBedInfo.aiRecommendation}</p>
                      </div>
                    )}
                  </div>
                  
                  {fullView && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Change Status
                      </Button>
                      <Button size="sm" className="flex-1 bg-medflow-purple hover:bg-medflow-dark-purple">
                        Assign Patient
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BedAllocation;
