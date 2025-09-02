'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function WithdrawalConfirmationContent() {
  const [withdrawalData, setWithdrawalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    // Get withdrawal data from URL params
    const amount = searchParams.get('amount');
    const id = searchParams.get('id');
    
    if (amount && id) {
      setWithdrawalData({
        amount: parseFloat(amount),
        id: id,
        status: 'processing',
        requestedAt: new Date().toISOString()
      });
    } else {
      // If no params, redirect back to dashboard
      router.push('/ewa/dashboard');
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleBackToDashboard = () => {
    router.push('/ewa/dashboard');
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

  if (!withdrawalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black">No withdrawal data found.</p>
          <button
            onClick={() => router.push('/ewa/dashboard')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
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
            {t('withdrawalRequestSubmitted', 'services')}
          </h1>
          <p className="text-black">
            {t('withdrawalRequestMessage', 'services')}
          </p>
        </div>

        {/* Withdrawal Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-black font-medium">{t('withdrawalAmount', 'services')}:</span>
              <span className="text-black font-bold text-lg">₹{withdrawalData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-medium">{t('requestId', 'services')}:</span>
              <span className="text-black font-mono text-sm">{withdrawalData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-medium">Status:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                Processing
              </span>
            </div>
          </div>
        </div>

        {/* Processing Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              {t('processingWithdrawal', 'services')}
            </h3>
          </div>
          <p className="text-sm text-blue-800 mb-2">
            <strong>{t('estimatedProcessing', 'services')}:</strong> 2-4 hours
          </p>
          <p className="text-sm text-blue-800">
            {t('processingTime', 'services')}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-3">
            {t('nextSteps', 'services')}
          </h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">•</span>
              <span>{t('teamReview', 'services')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">•</span>
              <span>{t('notificationSent', 'services')}</span>
            </li>
          </ul>
        </div>

        {/* Back to Dashboard Button */}
        <button
          onClick={handleBackToDashboard}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>{t('backToDashboard', 'services')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function WithdrawalConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    }>
      <WithdrawalConfirmationContent />
    </Suspense>
  );
}
