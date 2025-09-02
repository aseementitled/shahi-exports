'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import SimpleLoanForm from '@/components/SimpleLoanForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewLoanPage() {
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
        <div className="max-w-2xl mx-auto">
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
          
          <SimpleLoanForm />
        </div>
      </div>
    </div>
  );
}
