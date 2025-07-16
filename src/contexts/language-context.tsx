import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from '@/lib/i18n';
import { useAuth } from './auth-context';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from user profile or localStorage
  useEffect(() => {
    if (profile?.language) {
      setLanguageState(profile.language as Language);
      setIsLoading(false);
    } else {
      // Fallback to localStorage or browser language
      const savedLanguage = localStorage.getItem('preferred-language') as Language;
      const browserLanguage = navigator.language.startsWith('es') ? 'es' : 'en';
      setLanguageState(savedLanguage || browserLanguage);
      setIsLoading(false);
    }
  }, [profile]);

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);

    // Update user profile if logged in
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ language: newLanguage })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  };

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}