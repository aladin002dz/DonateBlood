export const mockTranslations = {
  'Auth.SignIn.title': 'Sign In',
  'Auth.SignIn.email': 'Email',
  'Auth.SignIn.password': 'Password',
  'Auth.SignIn.submit': 'Sign In',
  'Validation.required': 'This field is required',
  'Validation.email': 'Invalid email',
  'Validation.requiredIdentifier': 'Email or phone is required',
  'Validation.requiredPassword': 'Password is required',
  'Validation.minPassword6': 'Password must be at least 6 characters',
  'Validation.identifierInvalid': 'Invalid email or phone number',
};

export const mockUseTranslations = (namespace?: string) => {
  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return mockTranslations[fullKey as keyof typeof mockTranslations] || key;
  };
};

export const mockUseLocale = () => 'en';
export const mockUseMessages = () => ({});

