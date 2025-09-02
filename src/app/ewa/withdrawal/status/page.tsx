'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function WithdrawalStatusContent() {
  const [withdrawalData, setWithdrawalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    // Get withdrawal ID from URL params
    const id = searchParams.get('id');
    
    if (id) {
      // Get withdrawal data from localStorage
      const existingWithdrawals = JSON.parse(localStorage.getItem('ewaWithdrawals') || '[]');
      const withdrawal = existingWithdrawals.find((w: any) => w.id === id);
      
      if (withdrawal) {
        setWithdrawalData(withdrawal);
      } else {
        // Withdrawal not found, redirect to dashboard
        router.push('/ewa/dashboard');
      }
    } else {
      // No ID provided, redirect to dashboard
      router.push('/ewa/dashboard');
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'disbursed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'disbursed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Your withdrawal request is being processed';
      case 'disbursed':
        return 'Your withdrawal has been disbursed successfully';
      case 'rejected':
        return 'Your withdrawal request was rejected';
      default:
        return 'Unknown status';
    }
  };

  const handleBackToDashboard = () => {
    router.push('/ewa/dashboard');
  };

  const handleRefresh = () => {
    // Simulate refreshing status
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
          <p className="text-black">Withdrawal not found.</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Withdrawal Status</h1>
              <p className="text-gray-600">
                Track your withdrawal request
              </p>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold text-lg">Kosh</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Status Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">Request Details</h2>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">Request ID:</span>
                  <span className="text-black font-mono text-sm">{withdrawalData.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">Amount:</span>
                  <span className="text-black font-bold text-lg">₹{withdrawalData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">Requested At:</span>
                  <span className="text-black text-sm">
                    {new Date(withdrawalData.requestedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">Status:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(withdrawalData.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(withdrawalData.status)}`}>
                      {withdrawalData.status.charAt(0).toUpperCase() + withdrawalData.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                {getStatusIcon(withdrawalData.status)}
                <div>
                  <h3 className="font-semibold text-blue-900">Current Status</h3>
                  <p className="text-sm text-blue-800">
                    {getStatusMessage(withdrawalData.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            {withdrawalData.status === 'processing' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Processing Steps</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-yellow-800">Request submitted</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Under review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Processing payment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Disbursement</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              
              {withdrawalData.status === 'processing' && (
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Status</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WithdrawalStatusPage() {
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
      <WithdrawalStatusContent />
    </Suspense>
  );
}
