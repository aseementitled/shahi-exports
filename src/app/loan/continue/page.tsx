'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper function to check if loan is in disbursement period
const isInDisbursementPeriod = (loanStatus: string | null, loanProgress: any): boolean => {
  // Debug logging
  console.log('Loan Continue - Checking disbursement period:', {
    loanStatus,
    loanProgress,
    hasProgress: !!loanProgress,
    currentStep: loanProgress?.currentStep,
    completedSteps: loanProgress?.completedSteps,
    lastUpdated: loanProgress?.lastUpdated
  });
  
  // Only show disbursement message if:
  // 1. Status is 'approved' (not yet 'disbursed')
  // 2. Agreement has been completed (currentStep is 'completed' AND agreement is in completedSteps)
  // 3. Agreement was completed recently (within last 25 seconds to account for the 20-second disbursement delay)
  const now = new Date().getTime();
  const lastUpdated = loanProgress?.lastUpdated ? new Date(loanProgress.lastUpdated).getTime() : 0;
  const timeSinceCompletion = (now - lastUpdated) / 1000; // seconds
  
  const result = loanStatus === 'approved' && 
         loanProgress && 
         loanProgress.currentStep === 'completed' && 
         loanProgress.completedSteps && 
         Array.isArray(loanProgress.completedSteps) &&
         loanProgress.completedSteps.includes('agreement') &&
         timeSinceCompletion <= 25; // Only show for 25 seconds after agreement completion
  
  console.log('Loan Continue - Disbursement period result:', result, 'Time since completion:', timeSinceCompletion);
  return result;
};

export default function LoanContinuePage() {
  const [loanData, setLoanData] = useState<any>(null);
  const [loanProgress, setLoanProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Get loan application data
    const savedLoan = localStorage.getItem('loanApplication');
    const loanProgressData = localStorage.getItem('loanProgress');
    
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

    // Get loan progress data
    if (loanProgressData) {
      try {
        const progress = JSON.parse(loanProgressData);
        setLoanProgress(progress);
      } catch (error) {
        console.error('Error parsing loan progress:', error);
      }
    }
    
    setIsLoading(false);
  }, [router]);

  const handleContinue = () => {
    if (!loanData) return;
    
    // Check if loan is disbursed
    if (loanData.status === 'disbursed') {
      router.push('/loan/disbursement');
      return;
    }
    
    // Check saved progress first
    const savedProgress = localStorage.getItem('loanProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        switch (progress.currentStep) {
          case 'enach':
            router.push('/loan/enach');
            return;
          case 'agreement':
            router.push('/loan/agreement');
            return;
          case 'completed':
            router.push('/services');
            return;
        }
      } catch (error) {
        console.error('Error parsing loan progress:', error);
      }
    }
    
    // Fallback to status-based routing
    switch (loanData.status) {
      case 'approved':
        router.push('/loan/terms');
        break;
      case 'document_check':
        router.push('/loan/terms');
        break;
      case 'mandate_completed':
        router.push('/loan/agreement');
        break;
      case 'completed':
        router.push('/loan/agreement');
        break;
      default:
        router.push('/services');
    }
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
          <p className="text-black">No loan application found.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            Continue Loan Application
          </h1>
          <p className="text-black">
            Your loan application is in progress
          </p>
        </div>

        {/* Loan Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-black">Loan Amount:</span>
              <span className="font-medium text-black">₹{loanData.loanAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Tenure:</span>
              <span className="font-medium text-black">{loanData.tenure} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Status:</span>
              <span className="font-medium text-black capitalize">{loanData.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Continue Button - Only show if not pending and not in disbursement period */}
        {loanData.status !== 'pending' && !isInDisbursementPeriod(loanData.status, loanProgress) && (
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Pending Status Message */}
        {loanData.status === 'pending' && (
          <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 py-3 px-6 rounded-lg text-center">
            <p className="text-sm">
              {t('pendingStatusMessage', 'services')}
            </p>
          </div>
        )}

        {/* Disbursement in Progress Message */}
        {isInDisbursementPeriod(loanData.status, loanProgress) && (
          <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 py-3 px-6 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">
                <strong>Disbursement in Progress:</strong> Your loan is being processed and will be disbursed shortly..
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
