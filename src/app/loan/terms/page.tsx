'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoanTermsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  // Hardcoded loan terms data
  const loanTerms = {
    loanAmount: '₹50,000',
    interestRate: '12% per annum',
    emiAmount: '₹4,500',
    firstEmiDate: '15th March 2024',
    totalAmount: '₹54,000',
    processingFees: '₹2,000'
  };

  const handleProceed = async () => {
    if (!agreedToTerms) return;
    
    setIsLoading(true);
    
    // Save progress in localStorage
    const loanProgress = {
      currentStep: 'enach',
      completedSteps: ['terms'],
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('loanProgress', JSON.stringify(loanProgress));
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to eNACH setup
    router.push('/loan/enach');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">{t('loading', 'services')}</h2>
          <p className="text-black">{t('pleaseWait', 'services')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            {t('approvedLoanTerms', 'services')}
          </h1>
          <p className="text-black">
            {t('loanTerms', 'services')}
          </p>
        </div>

        {/* Loan Terms Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-black font-medium">{t('loanAmountApproved', 'services')}:</span>
              <span className="text-black font-bold">{loanTerms.loanAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black font-medium">{t('interestRate', 'services')}:</span>
              <span className="text-black">{loanTerms.interestRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black font-medium">{t('emiAmount', 'services')}:</span>
              <span className="text-black font-bold">{loanTerms.emiAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black font-medium">{t('firstEmiDate', 'services')}:</span>
              <span className="text-black">{loanTerms.firstEmiDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black font-medium">{t('totalAmount', 'services')}:</span>
              <span className="text-black font-bold">{loanTerms.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black font-medium">{t('processingFees', 'services')}:</span>
              <span className="text-black">{loanTerms.processingFees}</span>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-black">
              {t('agreeToTerms', 'services')}
            </span>
          </label>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          disabled={!agreedToTerms}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>{t('proceedToEnach', 'services')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
