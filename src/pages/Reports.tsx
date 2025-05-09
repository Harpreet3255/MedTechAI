import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, FileText, BarChart, Calendar, Filter, Search, RefreshCw } from "lucide-react";

// Mock report data
const mockReports = [
  {
    id: "r1",
    title: "Daily Hospital Operations Summary",
    description: "Overview of patient flow, bed utilization, and wait times",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: "daily",
    format: "PDF",
    size: "2.4 MB",
    status: "ready",
  },
  {
    id: "r2",
    title: "Weekly Department Performance",
    description: "Metrics and KPIs for each department",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    type: "weekly",
    format: "XLSX",
    size: "4.1 MB",
    status: "ready",
  },
  {
    id: "r3",
    title: "Monthly Patient Flow Analysis",
    description: "Detailed analysis of patient routing and wait times",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    type: "monthly",
    format: "PDF",
    size: "5.7 MB",
    status: "ready",
  },
  {
    id: "r4",
    title: "Quarterly Resource Utilization",
    description: "Analysis of bed, staff, and equipment utilization",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
    type: "quarterly",
    format: "PDF",
    size: "8.2 MB",
    status: "ready",
  },
  {
    id: "r5",
    title: "AI Recommendation Effectiveness",
    description: "Analysis of AI recommendation accuracy and impact",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    type: "custom",
    format: "PDF",
    size: "3.5 MB",
    status: "ready",
  },
  {
    id: "r6",
    title: "Emergency Department Efficiency",
    description: "Detailed metrics on emergency department performance",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "custom",
    format: "XLSX",
    size: "1.8 MB",
    status: "processing",
  },
];

const Reports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("all");
  
  // Filter reports based on active tab, search query, and filters
  const filteredReports = mockReports.filter(report => {
    // Filter by tab
    if (activeTab !== "all" && report.type !== activeTab) return false;
    
    // Filter by search query
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      if (report.date < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      if (report.date > end) return false;
    }
    
    // Filter by report type
    if (reportType !== "all" && report.format !== reportType) return false;
    
    return true;
  });
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Handle download report
  const handleDownload = (reportId: string) => {
    // In a real app, this would trigger a download
    toast({
      title: "Download Started",
      description: "Your report is being downloaded.",
    });
  };
  
  // Handle generate new report
  const handleGenerateReport = () => {
    toast({
      title: "Report Generation Started",
      description: "Your custom report is being generated. You will be notified when it's ready.",
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setReportType("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-muted-foreground">
                Generate and download hospital reports
              </p>
            </div>
            <Button onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate New Report
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search Reports</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="search" 
                          placeholder="Search by title..." 
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reportType">Report Format</Label>
                      <select 
                        id="reportType" 
                        value={reportType} 
                        onChange={(e) => setReportType(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="all">All Formats</option>
                        <option value="PDF">PDF</option>
                        <option value="XLSX">Excel</option>
                        <option value="CSV">CSV</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetFilters}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <TabsContent value={activeTab} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "all" ? "All Reports" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reports`}
                  </CardTitle>
                  <CardDescription>
                    {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReports.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No reports found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your filters or generate a new report.
                        </p>
                      </div>
                    ) : (
                      filteredReports.map((report) => (
                        <div key={report.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {report.format === "PDF" ? (
                                <FileText className="h-8 w-8 text-red-500" />
                              ) : report.format === "XLSX" ? (
                                <BarChart className="h-8 w-8 text-green-500" />
                              ) : (
                                <FileText className="h-8 w-8 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{report.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {report.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {report.format}
                                </Badge>
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  {report.size}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(report.date)}
                                </div>
                                {report.status === "processing" && (
                                  <Badge className="bg-amber-500">Processing</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <Button 
                              variant="outline" 
                              onClick={() => handleDownload(report.id)}
                              disabled={report.status === "processing"}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;
