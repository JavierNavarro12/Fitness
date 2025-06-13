import { Supplement, SportProfile } from '../types';

export const supplements: Supplement[] = [
  {
    name: "Proteína Whey",
    description: "Suplemento de proteína de suero de leche de rápida absorción, ideal para la recuperación muscular post-entrenamiento",
    benefits: [
      "Recuperación muscular acelerada",
      "Aumento de masa muscular magra",
      "Control del apetito",
      "Mejora de la composición corporal"
    ],
    recommendedFor: ["Culturismo", "CrossFit", "Atletismo", "Powerlifting"],
    dosage: "20-30g por toma",
    timing: "Después del entrenamiento y/o en el desayuno",
    genderSpecific: {
      male: "25-30g por toma",
      female: "20-25g por toma"
    },
    experienceLevel: "beginner"
  },
  {
    name: "Creatina Monohidratada",
    description: "Suplemento científicamente probado para mejorar el rendimiento en ejercicios de alta intensidad y corta duración",
    benefits: [
      "Aumento de fuerza y potencia",
      "Mejora de recuperación entre series",
      "Ganancia muscular",
      "Mejora del rendimiento anaeróbico"
    ],
    recommendedFor: ["Culturismo", "Powerlifting", "CrossFit", "Deportes de fuerza"],
    dosage: "5g diarios",
    timing: "Cualquier momento del día, preferiblemente con una comida",
    experienceLevel: "intermediate"
  },
  {
    name: "BCAA",
    description: "Aminoácidos de cadena ramificada esenciales para la recuperación muscular y prevención del catabolismo",
    benefits: [
      "Reducción de fatiga durante el entrenamiento",
      "Recuperación muscular acelerada",
      "Prevención del catabolismo muscular",
      "Mejora de la resistencia"
    ],
    recommendedFor: ["Running", "Ciclismo", "Triatlón", "Deportes de resistencia"],
    dosage: "5-10g por toma",
    timing: "Durante el entrenamiento o en ayunas",
    genderSpecific: {
      male: "7-10g por toma",
      female: "5-7g por toma"
    },
    experienceLevel: "intermediate"
  },
  {
    name: "Beta-Alanina",
    description: "Aminoácido que ayuda a reducir la fatiga muscular y mejorar el rendimiento en ejercicios de alta intensidad",
    benefits: [
      "Mejora de la resistencia muscular",
      "Reducción de fatiga",
      "Mejor rendimiento en series múltiples",
      "Aumento de la capacidad de trabajo"
    ],
    recommendedFor: ["CrossFit", "Atletismo", "Natación", "Deportes de alta intensidad"],
    dosage: "3-5g diarios",
    timing: "Dividido en 2-3 tomas a lo largo del día",
    experienceLevel: "advanced"
  }
];

export const sportProfiles: SportProfile[] = [
  {
    name: "Culturismo",
    intensity: "high",
    focus: ["Hipertrofia", "Fuerza", "Definición muscular", "Simetría"],
    recommendedSupplements: ["Proteína Whey", "Creatina Monohidratada", "BCAA"],
    description: "Deporte enfocado en el desarrollo muscular y la estética corporal",
    suitableFor: {
      experience: ["beginner", "intermediate", "advanced"],
      gender: ["male", "female"]
    }
  },
  {
    name: "CrossFit",
    intensity: "high",
    focus: ["Fuerza", "Resistencia", "Potencia", "Agilidad"],
    recommendedSupplements: ["Creatina Monohidratada", "Proteína Whey", "BCAA"],
    description: "Programa de entrenamiento que combina ejercicios funcionales de alta intensidad",
    suitableFor: {
      experience: ["intermediate", "advanced"],
      gender: ["male", "female"]
    }
  },
  {
    name: "Atletismo",
    intensity: "medium",
    focus: ["Resistencia", "Velocidad", "Técnica", "Recuperación"],
    recommendedSupplements: ["BCAA", "Beta-Alanina", "Proteína Whey"],
    description: "Deporte que engloba pruebas de pista y campo, centrado en la velocidad, resistencia y técnica.",
    suitableFor: {
      experience: ["beginner", "intermediate", "advanced"],
      gender: ["male", "female", "other"]
    }
  },
  {
    name: "Powerlifting",
    intensity: "high",
    focus: ["Fuerza máxima", "Potencia", "Técnica", "Recuperación"],
    recommendedSupplements: ["Creatina Monohidratada", "Proteína Whey"],
    description: "Deporte de fuerza que consiste en levantar el máximo peso posible en sentadilla, press de banca y peso muerto.",
    suitableFor: {
      experience: ["beginner", "intermediate", "advanced"],
      gender: ["male", "female"]
    }
  }
]; 