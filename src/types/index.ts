export type Language = 'en' | 'hi';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type RoadCondition = 'Good' | 'Fair' | 'Poor' | 'Dangerous';
export type RepairPriority = 'Emergency (24-48 hrs)' | 'High (3-7 days)' | 'Medium (15-30 days)' | 'Routine Maintenance';

export interface BoundingBox {
  ymin: number; // 0 to 1000
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedPothole {
  id: string;
  box2d: BoundingBox;
  confidence: number; // 0.0 to 1.0
  severity: SeverityLevel;
  approxDimensions: {
    lengthCm: number;
    widthCm: number;
    depthCm: number;
    areaSqMeters: number;
  };
  shape?: 'circular' | 'elongated' | 'cluster' | 'trench' | 'irregular';
  waterFilled?: boolean;
  commuterHazard?: string;
  firstDetectedFrame?: number;
}

export interface RoadScanResult {
  scanId: string;
  timestamp: string;
  imageUrl?: string;
  potholes: DetectedPothole[];
  totalUniquePotholes: number;
  overallCondition: RoadCondition;
  pciScore: number; // Pavement Condition Index (0-100)
  repairPriority: RepairPriority;
  commuterSafetyRisk: 'Low' | 'Moderate' | 'High' | 'Severe / Life Threatening';
  primaryRecommendation: string;
  detectionMode: 'live_ai' | 'demo_fallback' | 'benchmark_sample';
  calibrationNote?: string;
  surfaceType?: string;
}

export interface PwdRateSchedule {
  id: string;
  name: string;
  state: string;
  asphaltPerTonne: number; // in ₹
  tackCoatPerLitre: number; // in ₹
  aggregatePerCuM: number; // in ₹
  masonPerDay: number; // in ₹
  labourPerDay: number; // in ₹
  rollerHirePerDay: number; // in ₹
  sawCutterPerDay: number; // in ₹
  contingencyPercent: number; // typically 5-10%
}

export interface MaterialCostEstimate {
  scheduleId: string;
  scheduleName: string;
  potholeCount: number;
  totalPatchAreaSqM: number;
  totalPatchVolumeCuM: number;
  cuttingMarginPercent: number;
  
  // Materials
  asphaltTonnage: number;
  asphaltCost: number;
  tackCoatLitres: number;
  tackCoatCost: number;
  aggregateCuM: number;
  aggregateCost: number;
  
  // Labour
  masonDays: number;
  masonCost: number;
  labourDays: number;
  labourCost: number;
  
  // Machinery
  rollerDays: number;
  rollerCost: number;
  cutterDays: number;
  cutterCost: number;
  
  subtotal: number;
  contingencyCost: number;
  totalEstimatedCost: number;
  isPreliminary: boolean;
}

export type ReportStatus = 
  | 'Draft' 
  | 'Logged Locally' 
  | 'Submitted to Authority' 
  | 'Work Order Issued' 
  | 'Repair In Progress' 
  | 'Resolved & Verified';

export interface RoadComplaintReport {
  id: string; // e.g., RR-DL-2026-87142
  createdAt: string;
  status: ReportStatus;
  statusHistory: {
    status: ReportStatus;
    timestamp: string;
    note?: string;
  }[];
  
  // Location
  state: string;
  district: string;
  cityMunicipality: string;
  roadAuthority: string;
  roadName: string;
  landmark: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  };
  
  // Inspection Evidence
  scanResult: RoadScanResult;
  costEstimate: MaterialCostEstimate;
  citizenDescription: string;
  photoUrl?: string;
  
  // Authority details
  officialPortalUrl?: string;
  officialReferenceNo?: string;
  verifiedSubmission: boolean;
}

export interface IndianAuthorityOption {
  id: string;
  name: string;
  type: 'NHAI' | 'PWD' | 'Municipal Corp' | 'PMGSY' | 'Cantonment';
  state: string;
  jurisdiction: string;
  portalUrl: string;
  helpline: string;
  twitterHandle?: string;
}
