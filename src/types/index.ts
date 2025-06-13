export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  sport: string;
  trainingFrequency: 'low' | 'medium' | 'high';
  goals: string[] | string;
  dietaryRestrictions?: string[] | string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  bodyFat?: number;
  medicalConditions?: string[] | string;
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