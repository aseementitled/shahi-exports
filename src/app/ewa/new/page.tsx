'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewEWAPage() {
  const [kycData, setKYCData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if KYC is completed
    const savedKYC = localStorage.getItem('kycData');
    
    if (savedKYC) {
      try {
        const parsed = JSON.parse(savedKYC);
        // Check if all required documents are present
        const missingDocs = [];
        if ((!parsed.panDocument || parsed.panDocument === null || parsed.panDocument === '') && !parsed.panSkipped) {
          missingDocs.push('PAN Card');
        }
        if ((!parsed.aadhaarDocument || parsed.aadhaarDocument === null || parsed.aadhaarDocument === '') && !parsed.aadhaarSkipped) {
          missingDocs.push('Aadhaar Card');
        }
        if (!parsed.selfieDocument || parsed.selfieDocument === null || parsed.selfieDocument === '') {
          missingDocs.push('Live selfie verification');
        }
        
        if (missingDocs.length === 0) {
          setKYCData(parsed);
        } else {
          router.push('/kyc/collect/pan');
        }
      } catch {
        router.push('/kyc/collect/pan');
      }
    } else {
      router.push('/kyc/collect/pan');
    }
  }, [router]);

  const handleProceed = async () => {
    if (!consentChecked) return;
    
    setIsLoading(true);
    
    // Save EWA application data
    const ewaApplication = {
      id: `EWA-${Date.now()}`,
      status: 'mandate_setup',
      maxDrawdown: 16000,
      salary: 20000,
      createdAt: new Date().toISOString(),
      consentGiven: true
    };
    localStorage.setItem('ewaApplication', JSON.stringify(ewaApplication));
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to EWA mandate setup
    router.push('/ewa/mandate');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Loading...</h2>
          <p className="text-black">Please wait while we process your request</p>
        </div>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}


          {/* Main Content */}
          <div className="p-6">
            {/* Back to Home Button */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/services')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backToHome', 'services')}</span>
              </button>
            </div>
            {/* EWA Setup Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                {t('salaryAdvanceSetup', 'services')}
              </h2>
              <p className="text-gray-600">
                {t('salaryAdvanceDescription', 'services')}
              </p>
            </div>

            {/* Consent & Authorization */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {t('consentAuthorization', 'services')}
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                {t('consentText', 'services')}
              </p>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-sm text-blue-800">
                  {t('agreeToTerms', 'services')}
                </label>
              </div>
            </div>

            {/* EWA Limits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                {t('yourSalaryAdvanceLimits', 'services')}
              </h3>
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-sm font-medium text-green-700">
                    {t('maxDrawdown', 'services')}
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">₹16,000</div>
                <p className="text-sm text-green-700">
                  {t('basedOnSalary', 'services')}
                </p>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="text-center">
              <button
                onClick={handleProceed}
                disabled={!consentChecked}
                className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2 mx-auto ${
                  consentChecked
                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{t('completeSetupProceed', 'services')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
