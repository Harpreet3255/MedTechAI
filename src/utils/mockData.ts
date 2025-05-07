
export interface Department {
  id: string;
  name: string;
  currentPatients: number;
  capacity: number;
  waitTime: number;
  coordinates: { x: number; y: number; width: number; height: number };
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  urgency: "urgent" | "high" | "medium" | "low";
  waitTime: number;
  department: string;
  status: "waiting" | "in-progress" | "completed";
}

export interface Bed {
  id: string;
  department: string;
  status: "available" | "occupied" | "cleaning" | "reserved";
  patientId?: string;
  aiRecommendation?: boolean;
}

export interface HospitalStats {
  totalPatients: number;
  availableBeds: number;
  occupiedBeds: number;
  averageWaitTime: number;
  triageDistribution: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Mock departments with physical layout coordinates
export const departments: Department[] = [
  {
    id: "emergency",
    name: "Emergency",
    currentPatients: 28,
    capacity: 35,
    waitTime: 42,
    coordinates: { x: 10, y: 10, width: 150, height: 100 },
  },
  {
    id: "radiology",
    name: "Radiology",
    currentPatients: 15,
    capacity: 20,
    waitTime: 35,
    coordinates: { x: 180, y: 10, width: 120, height: 80 },
  },
  {
    id: "surgery",
    name: "Surgery",
    currentPatients: 12,
    capacity: 15,
    waitTime: 90,
    coordinates: { x: 320, y: 10, width: 170, height: 120 },
  },
  {
    id: "icu",
    name: "ICU",
    currentPatients: 8,
    capacity: 10,
    waitTime: 0,
    coordinates: { x: 10, y: 130, width: 120, height: 100 },
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    currentPatients: 18,
    capacity: 25,
    waitTime: 25,
    coordinates: { x: 150, y: 130, width: 140, height: 90 },
  },
  {
    id: "cardiology",
    name: "Cardiology",
    currentPatients: 22,
    capacity: 30,
    waitTime: 38,
    coordinates: { x: 310, y: 150, width: 150, height: 100 },
  },
];

// Mock patients
export const patients: Patient[] = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    urgency: "high",
    waitTime: 15,
    department: "emergency",
    status: "waiting",
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 32,
    urgency: "medium",
    waitTime: 28,
    department: "radiology",
    status: "in-progress",
  },
  {
    id: "P003",
    name: "Robert Johnson",
    age: 67,
    urgency: "urgent",
    waitTime: 0,
    department: "cardiology",
    status: "in-progress",
  },
  {
    id: "P004",
    name: "Emily Wilson",
    age: 8,
    urgency: "medium",
    waitTime: 22,
    department: "pediatrics",
    status: "waiting",
  },
  {
    id: "P005",
    name: "Michael Brown",
    age: 56,
    urgency: "high",
    waitTime: 10,
    department: "surgery",
    status: "waiting",
  },
  {
    id: "P006",
    name: "Sarah Davis",
    age: 29,
    urgency: "low",
    waitTime: 42,
    department: "radiology",
    status: "waiting",
  },
  {
    id: "P007",
    name: "James Wilson",
    age: 72,
    urgency: "urgent",
    waitTime: 5,
    department: "emergency",
    status: "in-progress",
  },
  {
    id: "P008",
    name: "Linda Martin",
    age: 62,
    urgency: "medium",
    waitTime: 30,
    department: "cardiology",
    status: "waiting",
  },
];

// Mock beds
export const beds: Bed[] = [
  { id: "B001", department: "emergency", status: "occupied", patientId: "P001" },
  { id: "B002", department: "emergency", status: "occupied", patientId: "P007" },
  { id: "B003", department: "emergency", status: "available", aiRecommendation: true },
  { id: "B004", department: "emergency", status: "cleaning" },
  { id: "B005", department: "emergency", status: "reserved" },
  { id: "B006", department: "icu", status: "occupied", patientId: "P003" },
  { id: "B007", department: "icu", status: "available" },
  { id: "B008", department: "icu", status: "occupied" },
  { id: "B009", department: "surgery", status: "cleaning" },
  { id: "B010", department: "surgery", status: "reserved", aiRecommendation: true },
  { id: "B011", department: "cardiology", status: "occupied" },
  { id: "B012", department: "cardiology", status: "available" },
  { id: "B013", department: "pediatrics", status: "occupied", patientId: "P004" },
  { id: "B014", department: "pediatrics", status: "available", aiRecommendation: true },
  { id: "B015", department: "radiology", status: "occupied", patientId: "P002" },
];

// Mock hospital statistics
export const hospitalStats: HospitalStats = {
  totalPatients: 82,
  availableBeds: 28,
  occupiedBeds: 52,
  averageWaitTime: 34,
  triageDistribution: {
    urgent: 12,
    high: 25,
    medium: 35,
    low: 10,
  },
};

// Mock triage text samples
export const triageSamples = [
  "Patient presents with severe chest pain radiating to left arm. Shortness of breath, sweating profusely. History of hypertension.",
  "12-year-old with fever (38.2°C), mild sore throat, and runny nose for the past 2 days. Drinking well, no signs of dehydration.",
  "Elderly patient found unconscious at home. Not responding to verbal stimuli. Irregular breathing observed.",
  "Minor laceration on right hand from kitchen accident. Minimal bleeding, no signs of tendon damage. Tetanus up to date.",
  "Patient complains of moderate abdominal pain for 24 hours, worsening. No fever, but has had two episodes of vomiting.",
];

// Mock route recommendations
export const routeRecommendations = [
  {
    patientId: "P001",
    currentDept: "emergency",
    recommendedDept: "cardiology",
    reason: "Abnormal ECG results indicate cardiac involvement",
    urgency: "high",
  },
  {
    patientId: "P005",
    currentDept: "surgery",
    recommendedDept: "radiology",
    reason: "Pre-surgical imaging required",
    urgency: "medium",
  },
  {
    patientId: "P002",
    currentDept: "radiology",
    recommendedDept: "surgery",
    reason: "Imaging shows appendicitis requiring immediate surgical intervention",
    urgency: "urgent",
  },
];

// Trend data for charts
export const waitTimeTrends = {
  labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
  datasets: [
    {
      department: "Emergency",
      data: [25, 40, 35, 50, 45, 60, 42],
    },
    {
      department: "Radiology",
      data: [15, 20, 30, 40, 30, 25, 35],
    },
    {
      department: "Surgery",
      data: [60, 65, 70, 85, 80, 90, 90],
    },
  ],
};

export const patientFlowTrends = {
  labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
  datasets: [
    {
      type: "Admissions",
      data: [5, 8, 6, 10, 7, 12, 9],
    },
    {
      type: "Discharges",
      data: [3, 5, 8, 6, 9, 7, 11],
    },
    {
      type: "Transfers",
      data: [2, 4, 3, 5, 6, 4, 3],
    },
  ],
};
