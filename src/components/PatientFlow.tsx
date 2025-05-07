
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

const PatientFlow = ({ fullView = false }: { fullView?: boolean }) => {
  const { patients, routeRecommendations } = useHospitalData();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      patient.id.toLowerCase().includes(query) ||
      patient.name.toLowerCase().includes(query) ||
      patient.status.toLowerCase().includes(query) ||
      patient.department.toLowerCase().includes(query) ||
      patient.urgency.toLowerCase().includes(query)
    );
  });
  
  // Sort patients based on sort field and direction
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (!sortField) return 0;
    
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
    if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Handle sort click
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get sort direction indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };
  
  // Display number of patients to show
  const patientCount = fullView ? sortedPatients.length : Math.min(5, sortedPatients.length);
  const displayPatients = sortedPatients.slice(0, patientCount);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            Patient Flow
            <Badge className="ml-2 bg-medflow-purple hover:bg-medflow-dark-purple">AI Powered</Badge>
          </CardTitle>
          
          {fullView && (
            <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search patients..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                    ID{getSortIndicator('id')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                    Patient{getSortIndicator('name')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('age')} className="cursor-pointer">
                    Age{getSortIndicator('age')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                    Status{getSortIndicator('status')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('department')} className="cursor-pointer">
                    Department{getSortIndicator('department')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('urgency')} className="cursor-pointer">
                    Urgency{getSortIndicator('urgency')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('waitTime')} className="cursor-pointer">
                    Wait Time{getSortIndicator('waitTime')}
                  </TableHead>
                  <TableHead>AI Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayPatients.map((patient) => {
                  const recommendation = routeRecommendations.find(
                    (rec) => rec.patientId === patient.id
                  );
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            patient.status === "waiting"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-500"
                              : patient.status === "in-progress"
                              ? "bg-blue-100 text-blue-800 border-blue-500"
                              : "bg-green-100 text-green-800 border-green-500"
                          }
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{patient.department.charAt(0).toUpperCase() + patient.department.slice(1)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            patient.urgency === "urgent"
                              ? "bg-red-500"
                              : patient.urgency === "high"
                              ? "bg-orange-500"
                              : patient.urgency === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        >
                          {patient.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={patient.waitTime > 30 ? "text-red-500 font-medium" : ""}>
                          {patient.waitTime} min
                        </span>
                      </TableCell>
                      <TableCell>
                        {recommendation ? (
                          <div className="ai-recommendation p-2 rounded-md text-xs font-medium">
                            Move to {recommendation.recommendedDept}: {recommendation.reason}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No recommendation</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {!fullView && patients.length > 5 && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm">
                View All Patients ({patients.length})
              </Button>
            </div>
          )}
          
          {fullView && (
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div>
                Showing {displayPatients.length} of {filteredPatients.length} patients
              </div>
              <div className="flex gap-1 items-center">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="w-8 p-0">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientFlow;
