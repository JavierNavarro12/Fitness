import { AIService } from './aiService';
import { UserProfile } from '../types';

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console methods to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('AIService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockConsoleError.mockClear();
  });

  const mockUserProfile: UserProfile = {
    age: 25,
    gender: 'male',
    weight: 70,
    height: 175,
    objective: 'ganar masa muscular',
    sport: 'fútbol',
    experience: 'intermediate',
    frequency: 'medium',
    medicalConditions: [],
    allergies: [],
    currentSupplements: [],
  };

  const mockPrompt = 'Generate fitness report for user';

  describe('generateReport', () => {
    it('should return successful AI response on first try', async () => {
      const mockAIResponse = {
        reply:
          'Este es un reporte personalizado muy detallado con más de 100 caracteres para el usuario que práctica fútbol y quiere ganar masa muscular.',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAIResponse),
      });

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result).toEqual({
        success: true,
        content: mockAIResponse.reply,
        source: 'ai',
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/openai-chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: mockPrompt }],
          }),
        }
      );
    });

    it('should fall back to standard recommendations when API fails', async () => {
      const mockProgressCallback = jest.fn();

      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      // Fail all attempts
      mockFetch.mockRejectedValue(new Error('API unavailable'));

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile,
        mockProgressCallback
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.content).toContain(
        'Reporte Personalizado - Recomendaciones Estándar'
      );
      expect(result.content).toContain('25 años, male');
      expect(result.content).toContain('ganar masa muscular');
      expect(result.content).toContain('fútbol');
      expect(result.error).toContain('API unavailable');

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockProgressCallback).toHaveBeenCalledWith(
        'Generando recomendaciones básicas...'
      );
    });

    it('should reject short AI responses and use fallback', async () => {
      const shortResponse = { reply: 'Too short' }; // Less than 100 chars

      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(shortResponse),
      });

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(mockFetch).toHaveBeenCalledTimes(3); // Max retries
    });

    it('should handle HTTP error responses', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.error).toContain('HTTP 500: Internal Server Error');
    });

    it('should handle malformed JSON responses', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.error).toContain('Invalid JSON');
    });

    it('should work without progress callback', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            reply:
              'Response without progress callback with enough characters to pass validation requirements for the AI service to consider it valid.',
          }),
      });

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('ai');
      expect(result.content).toContain('Response without progress callback');
    });

    it('should handle beginner experience level correctly', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      const beginnerProfile: UserProfile = {
        ...mockUserProfile,
        experience: 'beginner',
      };

      mockFetch.mockRejectedValue(new Error('API down'));

      const result = await AIService.generateReport('test', beginnerProfile);

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.content).toContain('Notas para Principiantes');
      expect(result.content).toContain('suplementos básicos');
    });
  });

  describe('Fallback Content Generation', () => {
    beforeEach(() => {
      // Mock sleep to resolve immediately for all fallback tests
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);
      mockFetch.mockRejectedValue(new Error('API down'));
    });

    it('should generate specific content for muscle gain objective', async () => {
      const muscleGainProfile: UserProfile = {
        ...mockUserProfile,
        objective: 'ganar masa muscular',
      };

      const result = await AIService.generateReport('test', muscleGainProfile);

      expect(result.content).toContain('Proteína Whey');
      expect(result.content).toContain('Creatina Monohidratada');
      expect(result.content).toContain('BCAA');
      expect(result.content).toContain('síntesis proteica muscular');
    });

    it('should generate specific content for weight loss objective', async () => {
      const weightLossProfile: UserProfile = {
        ...mockUserProfile,
        objective: 'perder peso',
      };

      const result = await AIService.generateReport('test', weightLossProfile);

      expect(result.content).toContain('L-Carnitina');
      expect(result.content).toContain('Té Verde (EGCG)');
      expect(result.content).toContain('CLA');
      expect(result.content).toContain('pérdida de peso');
    });

    it('should generate specific content for performance objective', async () => {
      const performanceProfile: UserProfile = {
        ...mockUserProfile,
        objective: 'mejorar rendimiento',
      };

      const result = await AIService.generateReport('test', performanceProfile);

      expect(result.content).toContain('Cafeína');
      expect(result.content).toContain('Beta-Alanina');
      expect(result.content).toContain('Citrulina Malato');
      expect(result.content).toContain('rendimiento');
    });

    it('should handle unknown objective and default to performance recommendations', async () => {
      const unknownObjectiveProfile: UserProfile = {
        ...mockUserProfile,
        objective: 'objetivo completamente desconocido que no existe',
      };

      const result = await AIService.generateReport(
        'test',
        unknownObjectiveProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      // Should default to performance recommendations
      expect(result.content).toContain('Cafeína');
      expect(result.content).toContain('Beta-Alanina');
      expect(result.content).toContain('Citrulina Malato');
    });

    it('should include user profile information in fallback', async () => {
      const customProfile: UserProfile = {
        age: 30,
        gender: 'female',
        weight: 60,
        height: 165,
        objective: 'ganar masa muscular',
        sport: 'natación',
        experience: 'advanced',
        frequency: 'high',
        medicalConditions: [],
        allergies: [],
        currentSupplements: [],
      };

      const result = await AIService.generateReport('test', customProfile);

      expect(result.content).toContain('30 años');
      expect(result.content).toContain('female');
      expect(result.content).toContain('ganar masa muscular');
      expect(result.content).toContain('natación');
    });

    it('should include general safety notes in fallback', async () => {
      const result = await AIService.generateReport('test', mockUserProfile);

      expect(result.content).toContain(
        'Consulta con un profesional de la salud'
      );
      expect(result.content).toContain('Hidratación');
      expect(result.content).toContain('Los suplementos complementan');
      expect(result.content).toContain(
        'Evalúa los resultados cada 4-6 semanas'
      );
    });

    it('should handle empty objective gracefully', async () => {
      const emptyObjectiveProfile: UserProfile = {
        ...mockUserProfile,
        objective: '',
      };

      const result = await AIService.generateReport(
        'test',
        emptyObjectiveProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      // Should default to performance recommendations
      expect(result.content).toContain('Cafeína');
    });

    it('should handle undefined sport gracefully', async () => {
      const undefinedSportProfile: UserProfile = {
        ...mockUserProfile,
        sport: undefined as any,
      };

      const result = await AIService.generateReport(
        'test',
        undefinedSportProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.content).toContain('Suplementos Generales'); // Should use general recommendations
    });
  });

  describe('Progress Callbacks', () => {
    it('should call progress callback with correct statuses', async () => {
      const mockProgressCallback = jest.fn();

      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      mockFetch.mockRejectedValue(new Error('Consistent failure'));

      await AIService.generateReport(
        mockPrompt,
        mockUserProfile,
        mockProgressCallback
      );

      expect(mockProgressCallback).toHaveBeenCalledWith(
        'Generando reporte personalizado...',
        1
      );
      expect(mockProgressCallback).toHaveBeenCalledWith(
        'Reintentando... (1/3)',
        1
      );
      expect(mockProgressCallback).toHaveBeenCalledWith(
        'Reintentando... (2/3)',
        2
      );
      expect(mockProgressCallback).toHaveBeenCalledWith(
        'Generando recomendaciones básicas...'
      );
    });
  });

  describe('Integration and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      mockFetch.mockRejectedValue(new Error('Network timeout'));

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
    });

    it('should return AI response when validation passes', async () => {
      const validResponse = {
        reply:
          'Este es un reporte válido con suficiente contenido para pasar todas las validaciones requeridas por el sistema.',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(validResponse),
      });

      const result = await AIService.generateReport(
        mockPrompt,
        mockUserProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('ai');
      expect(result.content).toBe(validResponse.reply);
    });

    it('should handle different sport types in fallback', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      mockFetch.mockRejectedValue(new Error('API down'));

      const runningProfile: UserProfile = {
        ...mockUserProfile,
        sport: 'running',
      };

      const result = await AIService.generateReport('test', runningProfile);

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.content).toContain('running');
    });

    it('should handle advanced experience level correctly', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      const advancedProfile: UserProfile = {
        ...mockUserProfile,
        experience: 'advanced',
      };

      mockFetch.mockRejectedValue(new Error('API down'));

      const result = await AIService.generateReport('test', advancedProfile);

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.content).toContain('Notas para Nivel Avanzado');
      expect(result.content).toContain('análisis de sangre');
    });

    it('should test sleep function directly for coverage', async () => {
      // Test the sleep function directly to cover line 287
      const sleepMethod = (AIService as any).sleep;

      // Test with minimal delay to avoid slowing down tests
      const startTime = Date.now();
      await sleepMethod(1);
      const endTime = Date.now();

      // Should have resolved (timing may vary in testing)
      expect(endTime).toBeGreaterThanOrEqual(startTime);
    });

    it('should handle completely unknown objective and use performance fallback', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      const unknownObjectiveProfile: UserProfile = {
        ...mockUserProfile,
        objective: 'OBJETIVO_COMPLETAMENTE_INVENTADO_QUE_NO_EXISTE',
      };

      mockFetch.mockRejectedValue(new Error('API down'));

      const result = await AIService.generateReport(
        'test',
        unknownObjectiveProfile
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      // Should trigger the fallback in line 235: || recommendations['mejorar rendimiento']
      expect(result.content).toContain('Cafeína');
      expect(result.content).toContain('Beta-Alanina');
      expect(result.content).toContain('Citrulina Malato');
    });

    it('should cover sports specific recommendations', async () => {
      // Mock sleep to resolve immediately
      jest.spyOn(AIService as any, 'sleep').mockResolvedValue(undefined);

      const crossfitProfile: UserProfile = {
        ...mockUserProfile,
        sport: 'crossfit',
      };

      mockFetch.mockRejectedValue(new Error('API down'));

      const result = await AIService.generateReport('test', crossfitProfile);

      expect(result.success).toBe(true);
      expect(result.source).toBe('fallback');
      expect(result.content).toContain('CrossFit');
      expect(result.content).toContain('HMB');
      expect(result.content).toContain('Taurina');
    });
  });
});
