'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EWAMandatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authorizationChecked, setAuthorizationChecked] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleProceed = async () => {
    if (!authorizationChecked) return;
    
    setIsLoading(true);
    
    // Save progress in localStorage
    const ewaProgress = {
      currentStep: 'agreement',
      completedSteps: ['setup', 'mandate'],
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('ewaProgress', JSON.stringify(ewaProgress));
    
    // Simulate eNACH setup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to agreement
    router.push('/ewa/agreement');
  };

  const handleBack = () => {
    router.push('/ewa/new');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Review & Authenticate EWA Mandate</h1>
              <div className="mt-2 text-sm text-gray-500">
                EWA Account ID: <span className="font-mono">EWA-{Date.now()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold text-lg"></div>
            </div>
          </div>
          
          {/* Know about Mandates */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-yellow-800 text-sm">Know about Mandates</span>
            <span className="text-yellow-600">✨</span>
          </div>
          
          {/* Mandate Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">EWA Mandate Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date - End Date</label>
                <p className="text-sm text-black">25th Sep 2025 - 25th Sep 2028</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <p className="text-sm text-black">Monthly</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                <p className="text-sm text-black">ADHI FINANCIAL AD...</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount</label>
                <p className="text-sm text-green-600 font-semibold">₹ 16,000</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <p className="text-sm text-black">Earned Wage Access</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utility Code</label>
                <p className="text-sm text-black font-mono">NACH00000000057248</p>
              </div>
            </div>
          </div>
          
          {/* Bank Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-black">Bank Details</span>
                <span className="text-gray-600">🏦</span>
              </div>
              <div className="text-right">
                <div className="text-blue-600 font-semibold text-lg">Canara Bank</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <p className="text-sm text-black">D**** P*****</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <p className="text-sm text-black">Savings</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <p className="text-sm text-black">XXXX0643</p>
              </div>
            </div>
          </div>
          
          {/* Authentication Mode Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">Select Authentication Mode</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-2 border-blue-500 rounded-lg p-4 text-center cursor-pointer bg-blue-50">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🏦</span>
                </div>
                <div className="text-sm font-medium text-blue-900">Net Banking</div>
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mt-2"></div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🆔</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Aadhaar</div>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mx-auto mt-2"></div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">💳</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Debit Card</div>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mx-auto mt-2"></div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Pan/Customer ID</div>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>
          
          {/* Authorization Checkbox */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="authorization"
                checked={authorizationChecked}
                onChange={(e) => setAuthorizationChecked(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="authorization" className="text-sm text-black leading-relaxed">
                I am authorising  AFA, to debit my account based on the instructions herein. I understand that the bank where I have authorised the debit may levy one time mandate processing charges as mentioned in the bank&apos;s latest schedule of charges. I understand that I am authorised to cancel / amend this mandate by appropriately communicating the cancellation/amendment request to the creditor or to the bank where I have authorised the mandate.
              </label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftCircle className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleProceed}
              disabled={!authorizationChecked}
              className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                authorizationChecked
                  ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
