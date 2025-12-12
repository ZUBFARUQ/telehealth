import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';

interface AccessibilityContextType {
  fontSizeLevel: number;
  setFontSizeLevel: (level: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 0 = Normal (16px), 1 = Large (20px), 2 = Extra Large (24px)
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { language } = useLanguage();

  // Handle Visual Changes
  useEffect(() => {
    const root = document.documentElement;
    // Tailwind uses rems. 1rem = root font size.
    // Default is usually 16px.
    if (fontSizeLevel === 0) root.style.fontSize = '16px';
    if (fontSizeLevel === 1) root.style.fontSize = '20px';
    if (fontSizeLevel === 2) root.style.fontSize = '24px';

    // Inject High Contrast Styles
    if (highContrast) {
      document.body.classList.add('high-contrast');
      // We inject a style tag to force high contrast variables
      const styleId = 'high-contrast-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .high-contrast, .high-contrast body {
            background-color: #000000 !important;
            color: #FFFF00 !important;
          }
          .high-contrast * {
            background-color: #000000 !important;
            color: #FFFF00 !important;
            border-color: #FFFF00 !important;
            box-shadow: none !important;
          }
          .high-contrast img {
            filter: grayscale(100%) !important;
          }
          .high-contrast button, .high-contrast input, .high-contrast select, .high-contrast textarea {
            background-color: #000000 !important;
            color: #FFFF00 !important;
            border: 2px solid #FFFF00 !important;
          }
          .high-contrast .bg-blue-600, .high-contrast .bg-teal-600 {
             background-color: #000000 !important;
             border: 2px solid #FFFF00 !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove('high-contrast');
      const style = document.getElementById('high-contrast-styles');
      if (style) style.remove();
    }
  }, [fontSizeLevel, highContrast]);

  // Handle Speech
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set language
    if (language === 'ha') {
      // Hausa might not be available on all devices, fallback to generic African or English
      utterance.lang = 'ha-NG'; 
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleHighContrast = () => setHighContrast(!highContrast);

  return (
    <AccessibilityContext.Provider value={{ 
      fontSizeLevel, 
      setFontSizeLevel, 
      highContrast, 
      toggleHighContrast,
      speak,
      stopSpeaking,
      isSpeaking
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};