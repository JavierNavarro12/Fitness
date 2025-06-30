import { render } from '@testing-library/react';
import Privacy from './Privacy';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  }),
}));

describe('Privacy', () => {
  it('renderiza sin errores', () => {
    render(<Privacy />);
  });
}); 