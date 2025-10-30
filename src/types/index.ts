export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Business {
  id: string;
  name: string;
  rating: number;
  address: string;
  distance: number;
  category: string;
  contact: string;
  thumbnail: string;
  position: Location;
  reviewTrend: number[];
}

export interface LocationAnalysis {
  location: Location;
  businessType: string;
  seasonalDemand: { month: string; demand: number; change: number }[];
  demographics: { office: number; residents: number };
  competitors: { name: string; size: number; rating: number; distance: number }[];
  locationProfile: { age: number; income: number; familySize: number; daytimePop: number; accessibility: number };
  competitionDensity: { radius: string; category: string; density: number }[];
  successScore: number;
  kpis: {
    avgRating: number;
    monthlyDemand: number;
    rentSensitivity: number;
    competitorCount: number;
    revenuePotential: number;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AnalysisTab {
  id: string;
  label: string;
  location: string;
  businessType: string;
  isActive: boolean;
  createdAt: Date;
}