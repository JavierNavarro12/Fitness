export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  sport: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  trainingFrequency: 'low' | 'medium' | 'high';
  goals: string[];
  dietaryRestrictions: string[];
  medicalConditions: string[];
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