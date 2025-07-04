export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other' | '';
  weight: number;
  height: number;
  objective: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | '';
  frequency: 'low' | 'medium' | 'high' | '';
  sport: string;
  medicalConditions: string[];
  allergies: string[];
  currentSupplements: string[];
  photo?: string;
}

export interface UserAccount {
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
}

export interface Supplement {
  name: string;
  description: string;
  benefits: string[];
  recommendedFor: string[];
  dosage: string;
  timing: string;
  genderSpecific?: {
    male?: string;
    female?: string;
    other?: string;
  };
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SportProfile {
  name: string;
  intensity: 'low' | 'medium' | 'high';
  focus: string[];
  recommendedSupplements: string[];
  description: string;
  suitableFor: {
    experience: ('beginner' | 'intermediate' | 'advanced')[];
    gender: ('male' | 'female' | 'other')[];
  };
}

export interface Report {
  id?: string;
  content: string;
  createdAt: string;
  userId: string;
}

// Nuevos tipos para estados del reporte
export interface ReportGenerationState {
  status: 'idle' | 'generating' | 'retrying' | 'fallback' | 'success' | 'error';
  message: string;
  attempt?: number;
  maxRetries?: number;
  source?: 'ai' | 'fallback';
  error?: string;
}
