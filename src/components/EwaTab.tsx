'use client';

import { CreditCard } from 'lucide-react';

interface EwaTabProps {
  language: string;
}

// Language translations for the EWA tab
const ewaTranslations = {
  en: {
    title: 'EWA (Earned Wage Access)',
    underDevelopment: 'This feature is currently under development.',
    comingSoon: 'Earned Wage Access functionality will be available soon.'
  },
  hi: {
    title: 'ईडब्ल्यूए (अर्जित वेतन पहुंच)',
    underDevelopment: 'यह सुविधा वर्तमान में विकास के अधीन है।',
    comingSoon: 'अर्जित वेतन पहुंच कार्यक्षमता जल्द ही उपलब्ध होगी।'
  },
  te: {
    title: 'EWA (సంపాదించిన వేతన ప్రాప్యత)',
    underDevelopment: 'ఈ ఫీచర్ ప్రస్తుతం అభివృద్ధిలో ఉంది.',
    comingSoon: 'సంపాదించిన వేతన ప్రాప్యత ఫంక్షనాలిటీ త్వరలో అందుబాటులో ఉంటుంది.'
  },
  kn: {
    title: 'EWA (ಸಂಪಾದಿಸಿದ ವೇತನ ಪ್ರವೇಶ)',
    underDevelopment: 'ಈ ವೈಶಿಷ್ಟ್ಯವು ಪ್ರಸ್ತುತ ಅಭಿವೃದ್ಧಿಯಲ್ಲಿದೆ.',
    comingSoon: 'ಸಂಪಾದಿಸಿದ ವೇತನ ಪ್ರವೇಶ ಕಾರ್ಯವಿಧಾನವು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗುತ್ತದೆ.'
  },
  mr: {
    title: 'EWA (कमावलेली मजुरी प्रवेश)',
    underDevelopment: 'ही वैशिष्ट्ये सध्या विकासात आहेत.',
    comingSoon: 'कमावलेली मजुरी प्रवेश कार्यक्षमता लवकरच उपलब्ध होईल.'
  },
  hig: {
    title: 'EWA (Earned Wage Access)',
    underDevelopment: 'This feature is currently under development.',
    comingSoon: 'Earned Wage Access functionality will be available soon.'
  }
};

export default function EwaTab({ language }: EwaTabProps) {
  const t = ewaTranslations[language as keyof typeof ewaTranslations] || ewaTranslations.en;

  return (
    <div className="bg-white">
      <div className="p-4 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-500" />
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.title}</h2>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
          <p className="text-gray-700 text-base font-medium mb-2">
            {t.underDevelopment}
          </p>
          <p className="text-gray-600 text-sm">
            {t.comingSoon}
          </p>
        </div>
      </div>
    </div>
  );
}
