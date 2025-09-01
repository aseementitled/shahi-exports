'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import LoanForm from '@/components/LoanForm';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function NewLoanPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const [kycData, setKYCData] = useState(null);
  const { currentLanguage, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Check if KYC is completed
    const savedKYC = localStorage.getItem('kycData');
    
    if (savedKYC) {
      try {
        const parsed = JSON.parse(savedKYC);
        if (parsed.isVerified) {
          setKYCData(parsed);
        } else {
          router.push('/kyc');
        }
        } catch {
    router.push('/kyc');
  }
    } else {
      router.push('/kyc');
    }
  }, [router]);

  // Initialize Shepherd tour
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          cancelIcon: { enabled: true },
          classes: 'shadow-md bg-purple-dark',
          scrollTo: true
        },
        useModalOverlay: true
      });

      tour.addStep({
        id: 'welcome',
        title: t('welcomeToLoanApplication', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('aboutToStartLoanProcess', 'loan')}</p>
            <p class="text-sm mt-2"><strong>${t('kycVerifiedFasterProcess', 'loan')}</strong></p>
          </div>
        `,
        buttons: [{ text: t('next') as string, action: () => tour.next() }]
      });

      tour.addStep({
        id: 'language-selection',
        title: t('chooseYourLanguage', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('selectPreferredLanguage', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('englishDefaultLanguage', 'loan')}</li>
              <li>• ${t('hindiLanguage', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('chooseComfortable', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '.max-w-xs', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('next') as string, action: () => tour.next() }
        ]
      });

      tour.addStep({
        id: 'loan-form',
        title: t('loanApplicationForm', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('formWillAsk', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('askLoanAmountTenure', 'loan')}</li>
              <li>• ${t('showConsentAuthorization', 'loan')}</li>
              <li>• ${t('simulateInfoFetching', 'loan')}</li>
              <li>• ${t('submitYourApplication', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('fillDetailsSubmit', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '.max-w-2xl', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('finishTour', 'services') as string, action: () => tour.complete() }
        ]
      });

      setTour(tour);
    }
  }, [t]);

  if (!kycData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('newLoanTitle', 'loan')}</h1>
          <p className="text-gray-600">{t('newLoanSubtitle', 'loan')}</p>
          
          {/* Help Button */}
          <div className="mt-4">
            <button
              onClick={() => tour?.start()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mx-auto"
            >
              <span>{t('getHelp')}</span>
            </button>
          </div>
          
          {/* Language Selector */}
          <div className="mt-6 max-w-xs mx-auto">
            <LanguageSelector size="md" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <LoanForm />
        </div>
      </div>
    </div>
  );
}
