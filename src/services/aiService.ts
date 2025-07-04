import { UserProfile } from '../types';

interface AIResponse {
  success: boolean;
  content: string;
  source: 'ai' | 'fallback';
  error?: string;
}

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export class AIService {
  private static defaultRetryOptions: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000, // 1 segundo
    maxDelay: 8000, // 8 segundos máximo
  };

  /**
   * Genera reporte con retry logic y fallback automático
   */
  static async generateReport(
    prompt: string,
    userProfile: UserProfile,
    onProgress?: (status: string, attempt?: number) => void
  ): Promise<AIResponse> {
    const options = this.defaultRetryOptions;

    // Intentar con IA primero
    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        onProgress?.(`Generando reporte personalizado...`, attempt);

        const response = await fetch('/.netlify/functions/openai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.reply || data.reply.trim().length < 100) {
          throw new Error('Respuesta de IA insuficiente');
        }

        return {
          success: true,
          content: data.reply,
          source: 'ai',
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';

        if (attempt === options.maxRetries) {
          // Último intento fallido - usar fallback
          onProgress?.('Generando recomendaciones básicas...');
          return this.generateFallbackReport(userProfile, errorMessage);
        }

        // Calcular delay con exponential backoff
        const delay = Math.min(
          options.baseDelay * Math.pow(2, attempt - 1),
          options.maxDelay
        );

        onProgress?.(
          `Reintentando... (${attempt}/${options.maxRetries})`,
          attempt
        );

        await this.sleep(delay);
      }
    }

    // Esto nunca debería ejecutarse, pero por seguridad
    return this.generateFallbackReport(userProfile, 'Error inesperado');
  }

  /**
   * Genera reporte de fallback basado en el perfil del usuario
   */
  private static generateFallbackReport(
    profile: UserProfile,
    originalError: string
  ): AIResponse {
    const fallbackContent = this.createFallbackContent(profile);

    return {
      success: true,
      content: fallbackContent,
      source: 'fallback',
      error: `Reporte generado con recomendaciones estándar. Error original: ${originalError}`,
    };
  }

  /**
   * Crea contenido de fallback personalizado según el perfil
   */
  private static createFallbackContent(profile: UserProfile): string {
    const { objective, sport, experience, gender, age } = profile;

    // Recomendaciones base por objetivo
    const objectiveRecommendations =
      this.getObjectiveRecommendations(objective);
    const sportRecommendations = this.getSportRecommendations(sport);
    const experienceNotes = this.getExperienceNotes(experience);

    return `# Reporte Personalizado - Recomendaciones Estándar

## Introducción Personalizada
Hola! Este reporte está basado en tu perfil: ${age} años, ${gender}, objetivo principal de **${objective}** y práctica de **${sport}**.

${objectiveRecommendations}

${sportRecommendations}

${experienceNotes}

## Notas Adicionales
- **Importante**: Consulta con un profesional de la salud antes de iniciar cualquier suplementación
- **Hidratación**: Mantén una ingesta adecuada de agua (35ml por kg de peso corporal)
- **Alimentación**: Los suplementos complementan, no sustituyen una dieta equilibrada
- **Progreso**: Evalúa los resultados cada 4-6 semanas

### Productos Recomendados
- Proteína en Polvo - Optimum Nutrition Gold Standard Whey
- Creatina Monohidratada - Universal Nutrition
- Multivitamínico - Centrum Performance
- Omega-3 - Nordic Naturals Ultimate Omega

*Reporte generado con recomendaciones estándar basadas en tu perfil*`;
  }

  private static getObjectiveRecommendations(objective: string): string {
    const recommendations = {
      'ganar masa muscular': `## Suplementos para Ganancia de Masa Muscular

## Proteína Whey
Dosis recomendada: 25-30g
Momento de toma: Inmediatamente después del entrenamiento
Observaciones: Fundamental para la síntesis proteica muscular

## Creatina Monohidratada
Dosis recomendada: 5g
Momento de toma: En cualquier momento del día
Observaciones: Mejora la fuerza y potencia, puede causar retención de agua

## BCAA
Dosis recomendada: 10-15g
Momento de toma: Durante el entrenamiento
Observaciones: Reduce la fatiga muscular y mejora la recuperación`,

      'perder peso': `## Suplementos para Pérdida de Peso

## L-Carnitina
Dosis recomendada: 2-3g
Momento de toma: 30 minutos antes del cardio
Observaciones: Facilita el uso de grasas como energía

## Té Verde (EGCG)
Dosis recomendada: 400-500mg
Momento de toma: Entre comidas
Observaciones: Acelera el metabolismo, evitar antes de dormir

## CLA (Ácido Linoleico Conjugado)
Dosis recomendada: 3-6g
Momento de toma: Con las comidas principales
Observaciones: Puede ayudar a mantener masa muscular durante la pérdida de peso`,

      'mejorar rendimiento': `## Suplementos para Rendimiento

## Cafeína
Dosis recomendada: 200-400mg
Momento de toma: 30-45 minutos antes del ejercicio
Observaciones: Mejora focus y rendimiento, evitar por la tarde

## Beta-Alanina
Dosis recomendada: 3-5g
Momento de toma: Dividido en 2-3 tomas diarias
Observaciones: Reduce fatiga muscular, puede causar hormigueo

## Citrulina Malato
Dosis recomendada: 6-8g
Momento de toma: 30 minutos antes del entrenamiento
Observaciones: Mejora el flujo sanguíneo y reduce la fatiga`,
    } as const;

    const key = objective.toLowerCase() as keyof typeof recommendations;
    return recommendations[key] || recommendations['mejorar rendimiento'];
  }

  private static getSportRecommendations(sport: string): string {
    const sportLower = sport.toLowerCase();

    if (sportLower.includes('running') || sportLower.includes('cardio')) {
      return `## Suplementos Específicos para Resistencia

## Electrolitos
Dosis recomendada: Según indicaciones del fabricante
Momento de toma: Durante y después del ejercicio prolongado
Observaciones: Mantiene el equilibrio hidro-electrolítico

## Maltodextrina
Dosis recomendada: 30-60g por hora de ejercicio
Momento de toma: Durante ejercicios de más de 60 minutos
Observaciones: Mantiene los niveles de glucosa durante el ejercicio`;
    }

    if (sportLower.includes('crossfit') || sportLower.includes('hiit')) {
      return `## Suplementos para CrossFit/HIIT

## HMB
Dosis recomendada: 3g
Momento de toma: Dividido en 3 tomas con las comidas
Observaciones: Reduce el catabolismo muscular

## Taurina
Dosis recomendada: 2-3g
Momento de toma: Antes del entrenamiento
Observaciones: Mejora la hidratación celular y el rendimiento`;
    }

    return `## Suplementos para tu Deporte (${sport})

## Proteína Completa
Dosis recomendada: 1.6-2.2g por kg de peso corporal
Momento de toma: Distribuida a lo largo del día
Observaciones: Ajustar según intensidad del entrenamiento

## Multivitamínico
Dosis recomendada: 1 cápsula
Momento de toma: Con el desayuno
Observaciones: Cubre posibles deficiencias nutricionales`;
  }

  private static getExperienceNotes(experience: string): string {
    const notes = {
      beginner: `## Notas para Principiantes
- Comienza con suplementos básicos: proteína y multivitamínico
- Enfócate primero en establecer una rutina de entrenamiento constante
- La alimentación es más importante que la suplementación al inicio`,

      intermediate: `## Notas para Nivel Intermedio
- Puedes incorporar suplementos más específicos según tus objetivos
- Considera la periodización de la suplementación
- Evalúa tu progreso cada 6-8 semanas`,

      advanced: `## Notas para Nivel Avanzado
- Optimiza el timing de los suplementos según tu entrenamiento
- Considera suplementos más especializados
- Realiza análisis de sangre periódicos para evaluar el estado nutricional`,
    } as const;

    const key = experience as keyof typeof notes;
    return notes[key] || notes['intermediate'];
  }

  /**
   * Función auxiliar para pausas
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
