'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const router = useRouter();
  const { setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' }
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setLanguage(languageCode);
    
    // Store language preference
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Navigate to registration/login choice
    router.push('/auth/choice');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Choose Your Language
          </h1>
          <p className="text-gray-800">
            अपनी भाषा चुनें
          </p>
        </div>

        <div className="space-y-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLanguage === language.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold text-lg text-black">{language.native}</div>
                <div className="text-sm text-gray-700">{language.name}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-700">
            Select your preferred language to continue
          </p>
        </div>
      </div>
    </div>
  );
}
