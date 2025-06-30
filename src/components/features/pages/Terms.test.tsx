import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Terms from './Terms';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

describe('Terms', () => {
  it('renderiza sin errores', () => {
    render(
      <HelmetProvider>
        <Terms />
      </HelmetProvider>
    );
  });
});
