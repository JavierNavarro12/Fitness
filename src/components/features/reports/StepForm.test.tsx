import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepForm from './StepForm';
import { UserProfile } from '../../../types';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'stepForm.age': 'Edad',
        'stepForm.gender': 'Género',
        'stepForm.weight': 'Peso',
        'stepForm.height': 'Altura',
        'stepForm.experienceLevel': 'Nivel de experiencia',
        'stepForm.trainingFrequency': 'Frecuencia de entrenamiento',
        'stepForm.mainSport': 'Deporte principal',
        'stepForm.objective': 'Objetivo',
        'stepForm.error.missingFields': 'Campos requeridos: {fields}',
        'stepForm.error.age.range': 'La edad debe estar entre 14 y 99 años',
        'stepForm.error.weight.range': 'El peso debe estar entre 30 y 300 kg',
        'stepForm.error.height.range': 'La altura debe estar entre 100 y 250 cm',
        'stepForm.error.objective': 'El objetivo es requerido',
        'stepForm.nextButton': 'Siguiente',
        'stepForm.previousButton': 'Anterior',
        'stepForm.backButton': 'Anterior',
        'stepForm.submitButton': 'Generar Reporte',
        'stepForm.personalInfo': 'Información Personal',
        'stepForm.bodyMeasures': 'Medidas Corporales',
        'stepForm.sportExperience': 'Experiencia Deportiva',
        'stepForm.healthGoals': 'Objetivos de Salud',
        'stepForm.selectPlaceholder': 'Seleccionar...',
        'gender.male': 'Masculino',
        'gender.female': 'Femenino',
        'gender.other': 'Otro',
        'experience.beginner': 'Principiante',
        'experience.intermediate': 'Intermedio',
        'experience.advanced': 'Avanzado',
        'frequency.low': 'Baja',
        'frequency.medium': 'Media',
        'frequency.high': 'Alta',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de react-select
jest.mock('react-select', () => {
  return function MockSelect({ options, value, onChange, placeholder }: any) {
    return (
      <select
        data-testid="select"
        value={value?.value || ''}
        onChange={(e) => {
          const option = options.find((opt: any) => opt.value === e.target.value);
          onChange(option);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
});

// Mock de react-icons
jest.mock('react-icons/fa', () => ({
  FaUser: () => <div data-testid="fa-user">User Icon</div>,
  FaRuler: () => <div data-testid="fa-ruler">Ruler Icon</div>,
  FaDumbbell: () => <div data-testid="fa-dumbbell">Dumbbell Icon</div>,
  FaHeartbeat: () => <div data-testid="fa-heartbeat">Heartbeat Icon</div>,
}));

// Mock de formData
jest.mock('../../../data/formData', () => ({
  sportProfiles: [
    { name: 'running', label: 'Running' },
    { name: 'cycling', label: 'Cycling' },
    { name: 'swimming', label: 'Swimming' },
  ],
}));

describe('StepForm Component', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  test('renders first step with age and gender fields', () => {
    render(<StepForm onComplete={mockOnComplete} />);
    
    // Verificar que los campos del primer paso están presentes
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
    expect(screen.getByText(/género/i)).toBeInTheDocument();
  });

  test('shows error when trying to proceed without required fields', async () => {
    render(<StepForm onComplete={mockOnComplete} />);
    
    // Intentar avanzar sin llenar campos requeridos
    const nextButton = screen.getByText(/siguiente/i);
    userEvent.click(nextButton);
    
    // Verificar que se muestra el error
    await waitFor(() => {
      expect(screen.getByText(/campos requeridos/i)).toBeInTheDocument();
    });
  });

  test('validates age range correctly', async () => {
    render(<StepForm onComplete={mockOnComplete} />);
    
    // Ingresar edad inválida
    const ageInput = screen.getByLabelText(/edad/i);
    userEvent.type(ageInput, '5');
    
    // Seleccionar género para que pase la primera validación
    const genderSelect = screen.getByTestId('select');
    userEvent.selectOptions(genderSelect, 'male');
    
    // Intentar avanzar
    const nextButton = screen.getByText(/siguiente/i);
    userEvent.click(nextButton);
    
    // Verificar que se muestra el error de rango de edad
    await waitFor(() => {
      expect(screen.getByText(/la edad debe estar entre 14 y 99 años/i)).toBeInTheDocument();
    });
  });

  test('allows valid age input', async () => {
    render(<StepForm onComplete={mockOnComplete} />);
    
    // Ingresar edad válida
    const ageInput = screen.getByLabelText(/edad/i);
    userEvent.type(ageInput, '25');
    
    // Verificar que el valor se establece correctamente
    expect(ageInput).toHaveValue(25);
  });

  test('can select gender option', async () => {
    render(<StepForm onComplete={mockOnComplete} />);
    
    // Seleccionar género
    const genderSelect = screen.getByTestId('select');
    userEvent.selectOptions(genderSelect, 'male');
    
    // Verificar que se seleccionó correctamente
    expect(genderSelect).toHaveValue('male');
  });

  test('can navigate to next step with valid data', async () => {
    render(<StepForm onComplete={mockOnComplete} />);
    
    // Llenar campos requeridos del primer paso
    const ageInput = screen.getByLabelText(/edad/i);
    userEvent.type(ageInput, '25');
    
    const genderSelect = screen.getByTestId('select');
    userEvent.selectOptions(genderSelect, 'male');
    
    // Avanzar al siguiente paso
    const nextButton = screen.getByText(/siguiente/i);
    userEvent.click(nextButton);
    
    // Verificar que se avanzó al segundo paso (peso y altura)
    await waitFor(() => {
      // Usar el título del paso para verificar que cambió
      expect(screen.getByRole('heading', { name: 'Medidas Corporales' })).toBeInTheDocument();
      expect(screen.getByText(/peso/i)).toBeInTheDocument();
      expect(screen.getByText(/altura/i)).toBeInTheDocument();
    });
  });
}); 