'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowRight, Plus, ArrowLeft, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EWADashboardPage() {
  const [ewaData, setEwaData] = useState<any>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  // Hardcoded data
  const maxDrawdown = 16000;
  
  // Calculate available amount based on disbursed withdrawals
  const calculateAvailableAmount = () => {
    const disbursedAmount = withdrawals
      .filter(w => w.status === 'disbursed')
      .reduce((sum, w) => sum + w.amount, 0);
    return maxDrawdown - disbursedAmount;
  };
  
  const availableAmount = calculateAvailableAmount();
  
  // Check if there's any request in processing
  const hasProcessingRequest = withdrawals.some(w => w.status === 'processing');
  
  // Check if withdrawal section should be shown (no processing requests)
  const showWithdrawalSection = !hasProcessingRequest;

  useEffect(() => {
    // Get EWA application data
    const savedEWA = localStorage.getItem('ewaApplication');
    if (savedEWA) {
      try {
        const ewa = JSON.parse(savedEWA);
        setEwaData(ewa);
      } catch (error) {
        console.error('Error parsing EWA data:', error);
        router.push('/services');
      }
    } else {
      router.push('/services');
    }

    // Get withdrawal history
    const savedWithdrawals = localStorage.getItem('ewaWithdrawals');
    if (savedWithdrawals) {
      try {
        const withdrawals = JSON.parse(savedWithdrawals);
        setWithdrawals(withdrawals);
      } catch (error) {
        console.error('Error parsing withdrawals:', error);
      }
    }

    setIsLoading(false);
  }, [router]);

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0 || amount > availableAmount) return;
    
    setIsSubmitting(true);
    
    // Simulate withdrawal request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save withdrawal request
    const withdrawalRequest = {
      id: `WITHDRAWAL-${Date.now()}`,
      amount: amount,
      status: 'processing',
      requestedAt: new Date().toISOString(),
      processedAt: null
    };
    
    // Save to localStorage (in real app, this would be sent to backend)
    const existingWithdrawals = JSON.parse(localStorage.getItem('ewaWithdrawals') || '[]');
    existingWithdrawals.push(withdrawalRequest);
    localStorage.setItem('ewaWithdrawals', JSON.stringify(existingWithdrawals));
    
    setIsSubmitting(false);
    setWithdrawalAmount('');
    
    // Redirect to withdrawal confirmation page
    router.push(`/ewa/withdrawal/confirmation?amount=${amount}&id=${withdrawalRequest.id}`);
  };

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

  if (!ewaData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black">No EWA data found.</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Salary Advance Dashboard</h1>
              <p className="text-gray-600">
                Manage your salary advance withdrawals
              </p>
              <div className="mt-2 text-sm text-gray-500">
                EWA Account ID: <span className="font-mono">{ewaData.id}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold text-lg">Kosh</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Available Amount Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Available Amount</h2>
                <div className="text-4xl font-bold text-green-600 mb-2">₹{availableAmount.toLocaleString()}</div>
                <p className="text-sm text-green-700">
                  Maximum: ₹{maxDrawdown.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Withdrawal Section - Only show if no processing requests */}
            {showWithdrawalSection && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Request Withdrawal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Enter Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    max={availableAmount}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    Maximum: ₹{availableAmount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleWithdrawal}
                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > availableAmount || isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    withdrawalAmount && parseFloat(withdrawalAmount) > 0 && parseFloat(withdrawalAmount) <= availableAmount && !isSubmitting
                      ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Request Withdrawal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            )}

            {/* Processing Request Message */}
            {hasProcessingRequest && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900">{t('withdrawalInProgress', 'services')}</h3>
                    <p className="text-sm text-yellow-800">
                      {t('withdrawalInProgressMessage', 'services')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Withdrawal History */}
            {withdrawals.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Withdrawals</h3>
                <div className="space-y-3">
                  {withdrawals.slice(0, 3).map((withdrawal, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-black">₹{withdrawal.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(withdrawal.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'processing' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : withdrawal.status === 'disbursed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {withdrawal.status}
                          </span>
                          <button
                            onClick={() => router.push(`/ewa/withdrawal/status?id=${withdrawal.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center">
              <button
                onClick={handleBackToServices}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Services</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}