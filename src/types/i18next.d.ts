import 'i18next';
import 'react-i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'translation';
    resources: {
      translation: {
        [key: string]: string;
      };
    };
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'translation';
    resources: {
      translation: {
        [key: string]: string;
      };
    };
  }
}
