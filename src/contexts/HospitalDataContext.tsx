
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  patients, 
  departments, 
  beds, 
  hospitalStats, 
  waitTimeTrends, 
  routeRecommendations,
  triageSamples
} from "@/utils/mockData";
import { toast } from "@/hooks/use-toast";

// Define the context type
interface HospitalDataContextType {
  patients: any[];
  departments: any[];
  beds: any[];
  hospitalStats: any;
  waitTimeTrends: any;
  routeRecommendations: any[];
  triageSamples: string[];
  loading: boolean;
  lastUpdated: Date;
  refreshData: () => void;
}

// Create context with a default value
const HospitalDataContext = createContext<HospitalDataContextType | undefined>(undefined);

// Provider component
export const HospitalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [currentPatients, setCurrentPatients] = useState(patients);
  const [currentDepartments, setCurrentDepartments] = useState(departments);
  const [currentBeds, setCurrentBeds] = useState(beds);
  const [currentStats, setCurrentStats] = useState(hospitalStats);
  const [currentWaitTimeTrends, setCurrentWaitTimeTrends] = useState(waitTimeTrends);
  const [currentRecommendations, setCurrentRecommendations] = useState(routeRecommendations);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Function to refresh data
  const refreshData = () => {
    setLoading(true);
    
    // Simulate API calls with setTimeout
    setTimeout(() => {
      // Update patients with some random changes
      const updatedPatients = currentPatients.map(patient => ({
        ...patient,
        waitTime: Math.max(0, patient.waitTime + Math.floor(Math.random() * 5) - 2),
        status: Math.random() > 0.8 ? 
          (patient.status === 'waiting' ? 'in-progress' : 
           patient.status === 'in-progress' ? 'completed' : 'waiting') : 
          patient.status
      }));
      
      // Update department stats with some variations
      const updatedDepartments = currentDepartments.map(dept => ({
        ...dept,
        currentPatients: Math.min(
          dept.capacity,
          dept.currentPatients + Math.floor(Math.random() * 3) - 1
        )
      }));
      
      // Update beds with some status changes
      const updatedBeds = currentBeds.map(bed => ({
        ...bed,
        status: Math.random() > 0.9 ? 
          (bed.status === 'available' ? 'occupied' : 
           bed.status === 'occupied' ? 'cleaning' : 
           bed.status === 'cleaning' ? 'available' : bed.status) : 
          bed.status
      }));
      
      // Update hospital statistics
      const updatedStats = {
        ...currentStats,
        totalPatients: currentStats.totalPatients + Math.floor(Math.random() * 5) - 2,
        availableBeds: Math.max(10, currentStats.availableBeds + Math.floor(Math.random() * 3) - 1),
        averageWaitTime: Math.max(5, currentStats.averageWaitTime + Math.floor(Math.random() * 4) - 2),
      };
      
      // Set the updated data
      setCurrentPatients(updatedPatients);
      setCurrentDepartments(updatedDepartments);
      setCurrentBeds(updatedBeds);
      setCurrentStats(updatedStats);
      setLastUpdated(new Date());
      setLoading(false);
      
      // Show success toast
      toast({
        title: "Data refreshed",
        description: `Hospital data updated at ${new Date().toLocaleTimeString()}`,
      });
    }, 1000);
  };
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentPatients, currentDepartments, currentBeds, currentStats]);
  
  const value = {
    patients: currentPatients,
    departments: currentDepartments,
    beds: currentBeds,
    hospitalStats: currentStats,
    waitTimeTrends: currentWaitTimeTrends,
    routeRecommendations: currentRecommendations,
    triageSamples,
    loading,
    lastUpdated,
    refreshData
  };
  
  return (
    <HospitalDataContext.Provider value={value}>
      {children}
    </HospitalDataContext.Provider>
  );
};

// Custom hook for using the context
export const useHospitalData = () => {
  const context = useContext(HospitalDataContext);
  if (context === undefined) {
    throw new Error("useHospitalData must be used within a HospitalDataProvider");
  }
  return context;
};
