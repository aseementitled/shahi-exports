'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DisbursementPage() {
  const [loanData, setLoanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  // Hardcoded EMI data
  const emiData = {
    emiAmount: '₹4,500',
    emiDate: '15th',
    daysToNextEmi: 12
  };

  useEffect(() => {
    // Get loan application data
    const savedLoan = localStorage.getItem('loanApplication');
    if (savedLoan) {
      try {
        const loan = JSON.parse(savedLoan);
        setLoanData(loan);
      } catch (error) {
        console.error('Error parsing loan data:', error);
        router.push('/services');
      }
    } else {
      router.push('/services');
    }
    setIsLoading(false);
  }, [router]);

  const handleBackToServices = () => {
    router.push('/services');
  };

  if (isLoading) {
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

  if (!loanData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black">No loan data found.</p>
          <button
            onClick={() => router.push('/services')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            {t('congratulations', 'services')}
          </h1>
          <p className="text-black">
            {t('loanDisbursed', 'services')}
          </p>
        </div>

        {/* EMI Information Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-black mb-2">
              {t('disbursementInfo', 'services')}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">EMI Amount</span>
              </div>
              <p className="text-2xl font-bold text-black">{emiData.emiAmount}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">EMI Date</span>
              </div>
              <p className="text-lg font-semibold text-black">{emiData.emiDate} of every month</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
          <p className="text-sm text-blue-800 mb-2">
            {t('emiPaymentInfo', 'services')} <strong>{emiData.emiAmount}</strong> {t('everyMonth', 'services')}
          </p>
          <p className="text-sm text-blue-800">
            {t('upcomingEmiDue', 'services')} <strong>{emiData.daysToNextEmi} {t('days', 'services')}</strong>
          </p>
        </div>

        {/* Back to Services Button */}
        <button
          onClick={handleBackToServices}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Back to Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
