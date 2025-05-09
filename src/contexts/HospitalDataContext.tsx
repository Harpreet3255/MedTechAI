
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

// Patient interface
export interface Patient {
  id: string;
  name: string;
  age: number;
  urgency: "urgent" | "high" | "medium" | "low";
  waitTime: number;
  department: string;
  status: "waiting" | "in-progress" | "completed";
}

// Route recommendation interface
export interface RouteRecommendation {
  patientId: string;
  currentDept: string;
  recommendedDept: string;
  reason: string;
  urgency: "urgent" | "high" | "medium" | "low";
}

// Define the context type
interface HospitalDataContextType {
  patients: Patient[];
  departments: any[];
  beds: any[];
  hospitalStats: any;
  waitTimeTrends: any;
  routeRecommendations: RouteRecommendation[];
  triageSamples: string[];
  loading: boolean;
  lastUpdated: Date;
  refreshData: () => void;
  addPatient: (patient: Omit<Patient, "id" | "waitTime" | "status">) => string;
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

  // Function to add a new patient
  const addPatient = (patientData: Omit<Patient, "id" | "waitTime" | "status">) => {
    // Generate a new patient ID
    const newPatientId = `P${String(currentPatients.length + 1).padStart(3, "0")}`;

    // Create the new patient object
    const newPatient: Patient = {
      id: newPatientId,
      ...patientData,
      waitTime: 0, // New patients start with 0 wait time
      status: "waiting", // New patients start with waiting status
    };

    // Add the new patient to the current patients
    setCurrentPatients(prevPatients => [...prevPatients, newPatient]);

    // Update hospital statistics
    setCurrentStats(prevStats => ({
      ...prevStats,
      totalPatients: prevStats.totalPatients + 1,
    }));

    // Update department patient count
    setCurrentDepartments(prevDepartments =>
      prevDepartments.map(dept =>
        dept.id === patientData.department
          ? { ...dept, currentPatients: dept.currentPatients + 1 }
          : dept
      )
    );

    // Generate an AI recommendation based on patient data
    const generateRecommendation = () => {
      // Get all departments except the current one
      const otherDepts = currentDepartments.filter(dept => dept.id !== patientData.department);

      // If no other departments, return null
      if (otherDepts.length === 0) return null;

      // Select a random department for recommendation
      const randomDept = otherDepts[Math.floor(Math.random() * otherDepts.length)];

      // Generate a reason based on urgency and departments
      let reason = "";

      // Generate reason based on urgency and departments
      if (patientData.urgency === "urgent") {
        if (randomDept.id === "cardiology") {
          reason = "Urgent cardiac evaluation required based on initial assessment";
        } else if (randomDept.id === "surgery") {
          reason = "Immediate surgical consultation needed for acute symptoms";
        } else if (randomDept.id === "icu") {
          reason = "Critical care monitoring recommended due to unstable vitals";
        } else if (randomDept.id === "radiology") {
          reason = "Stat imaging needed to rule out critical condition";
        } else {
          reason = "Urgent specialist consultation required";
        }
      } else if (patientData.urgency === "high") {
        if (randomDept.id === "cardiology") {
          reason = "Cardiac monitoring advised based on symptoms";
        } else if (randomDept.id === "surgery") {
          reason = "Surgical evaluation recommended for potential intervention";
        } else if (randomDept.id === "radiology") {
          reason = "Diagnostic imaging needed for proper assessment";
        } else {
          reason = "Specialist consultation recommended for proper treatment";
        }
      } else {
        if (randomDept.id === "cardiology") {
          reason = "Cardiology follow-up recommended based on risk factors";
        } else if (randomDept.id === "radiology") {
          reason = "Imaging would provide valuable diagnostic information";
        } else {
          reason = "Follow-up with specialist recommended for comprehensive care";
        }
      }

      // Create the recommendation object
      const recommendation: RouteRecommendation = {
        patientId: newPatientId,
        currentDept: patientData.department,
        recommendedDept: randomDept.id,
        reason,
        urgency: patientData.urgency,
      };

      return recommendation;
    };

    // Generate and add the recommendation
    const newRecommendation = generateRecommendation();
    if (newRecommendation) {
      setCurrentRecommendations(prevRecs => [...prevRecs, newRecommendation]);
    }

    // Set the last updated time
    setLastUpdated(new Date());

    // Return the new patient ID
    return newPatientId;
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
    refreshData,
    addPatient
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
