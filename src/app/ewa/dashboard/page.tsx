'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageSelector from '../../../components/LanguageSelector';
import EWADisbursementDetailsPage from '../../../components/EWADisbursementDetailsPage';

interface EWAApplication {
  id: string;
  maxWithdrawal: number;
  withdrawalFrequency: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface DrawdownRequest {
  id: string;
  amount: number;
  status: 'requested' | 'processing' | 'completed' | 'rejected' | 'disbursed';
  requestedAt: string;
  completedAt?: string;
  reason?: string;
}

export default function EWADashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const [ewaApplication, setEwaApplication] = useState<EWAApplication | null>(null);
  const [drawdownRequests, setDrawdownRequests] = useState<DrawdownRequest[]>([]);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [showDisbursementDetails, setShowDisbursementDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DrawdownRequest | null>(null);
  const { currentLanguage, t } = useLanguage();
  const router = useRouter();

  // Load EWA application and drawdown requests
  useEffect(() => {
    const savedEWA = localStorage.getItem('ewaApplication');
    const savedDrawdowns = localStorage.getItem('ewaDrawdownRequests');

    if (savedEWA) {
      try {
        setEwaApplication(JSON.parse(savedEWA));
      } catch (error) {
        console.error('Error parsing EWA data:', error);
      }
    }

    if (savedDrawdowns) {
      try {
        setDrawdownRequests(JSON.parse(savedDrawdowns));
      } catch (error) {
        console.error('Error parsing drawdown data:', error);
      }
    }
  }, []);

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
        title: t('welcomeToEWADashboard', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('ewaControlCenter', 'loan')}</p>
            <p class="text-sm mt-2"><strong>${t('trackWithdrawalsManage', 'loan')}</strong></p>
          </div>
        `,
        buttons: [{ text: t('next') as string, action: () => tour.next() }]
      });

      tour.addStep({
        id: 'balance-overview',
        title: t('yourEWABalanceOverview', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('hereYouCanSee', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('yourMaxWithdrawalLimit', 'loan')}</li>
              <li>• ${t('availableBalanceWithdrawal', 'loan')}</li>
              <li>• ${t('totalAmountWithdrawnMonth', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('keepTrackSpendingLimits', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '#balance-overview', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('next') as string, action: () => tour.next() }
        ]
      });

      tour.addStep({
        id: 'withdrawal-requests',
        title: t('withdrawalRequests', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('thisSectionShows', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('allYourWithdrawalRequests', 'loan')}</li>
              <li>• ${t('currentStatusEachRequest', 'loan')}</li>
              <li>• ${t('requestHistoryDetails', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('monitorWithdrawalActivity', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '#withdrawal-requests', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('next') as string, action: () => tour.next() }
        ]
      });

      tour.addStep({
        id: 'new-request',
        title: t('requestNewWithdrawal', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('whenYouNeedMoney', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('clickNewWithdrawalRequest', 'loan')}</li>
              <li>• ${t('enterAmountYouNeed', 'loan')}</li>
              <li>• ${t('submitYourRequest', 'loan')}</li>
              <li>• ${t('moneyTransferredBank', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('accessEarnedWagesAnytime', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '#new-request-section', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('finishTour', 'services') as string, action: () => tour.complete() }
        ]
      });

      setTour(tour);
    }
  }, [t]);

  // Calculate available balance
  const calculateAvailableBalance = () => {
    if (!ewaApplication) return 0;
    
    const monthlyLimit = ewaApplication.maxWithdrawal;
    const usedThisMonth = drawdownRequests
      .filter(req => {
        const requestDate = new Date(req.requestedAt);
        const now = new Date();
        return requestDate.getMonth() === now.getMonth() && 
               requestDate.getFullYear() === now.getFullYear() &&
               req.status !== 'rejected';
      })
      .reduce((sum, req) => sum + req.amount, 0);
    
    return Math.max(0, monthlyLimit - usedThisMonth);
  };

  // Check if new request can be made
  const canMakeNewRequest = () => {
    // User can only make a new request if all existing requests are either 'rejected', 'completed', or 'disbursed'
    return drawdownRequests.length === 0 || drawdownRequests.every(req => 
      req.status === 'rejected' || req.status === 'completed' || req.status === 'disbursed'
    );
  };

  // Handle new withdrawal request
  const handleNewRequest = async () => {
    if (!withdrawalAmount || !canMakeNewRequest()) return;

    const amount = parseInt(withdrawalAmount);
    const availableBalance = calculateAvailableBalance();

    if (amount > availableBalance) {
      alert(`Amount exceeds available balance. Maximum: ₹${availableBalance.toLocaleString()}`);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newRequest: DrawdownRequest = {
        id: `DRAWDOWN-${Date.now()}`,
        amount,
        status: 'requested',
        requestedAt: new Date().toISOString()
      };

      const updatedRequests = [...drawdownRequests, newRequest];
      setDrawdownRequests(updatedRequests);
      localStorage.setItem('ewaDrawdownRequests', JSON.stringify(updatedRequests));
      
      setWithdrawalAmount('');
      setShowNewRequest(false);
      setIsLoading(false);
    }, 2000);
  };

  // Handle status change for testing/simulation
  const handleStatusChange = (requestId: string, newStatus: DrawdownRequest['status']) => {
    const updatedRequests = drawdownRequests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: newStatus,
            completedAt: newStatus === 'completed' || newStatus === 'disbursed' ? new Date().toISOString() : req.completedAt
          }
        : req
    );
    setDrawdownRequests(updatedRequests);
    localStorage.setItem('ewaDrawdownRequests', JSON.stringify(updatedRequests));
  };

  // Handle EWA request deletion
  const handleDeleteRequest = (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this EWA withdrawal request? This action cannot be undone.')) {
      const updatedRequests = drawdownRequests.filter(req => req.id !== requestId);
      setDrawdownRequests(updatedRequests);
      localStorage.setItem('ewaDrawdownRequests', JSON.stringify(updatedRequests));
    }
  };

  // Handle callback request
  const handleCallbackRequest = () => {
    setShowCallbackModal(true);
    
    // Simulate callback registration
    setTimeout(() => {
      setCallbackRequested(true);
      
      // Auto close modal after 3 seconds
      setTimeout(() => {
        setShowCallbackModal(false);
        setCallbackRequested(false);
      }, 3000);
    }, 1000);
  };

  const handleRequestClick = (request: DrawdownRequest) => {
    if (request.status === 'disbursed') {
      setSelectedRequest(request);
      setShowDisbursementDetails(true);
    }
  };

  if (!ewaApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">No EWA account found</p>
          <button
            onClick={() => router.push('/ewa/new')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Setup EWA Account
          </button>
        </div>
      </div>
    );
  }

  const availableBalance = calculateAvailableBalance();
  const usedThisMonth = ewaApplication.maxWithdrawal - availableBalance;

  // Show disbursement details if selected
  if (showDisbursementDetails && selectedRequest) {
    return (
      <EWADisbursementDetailsPage
        requestId={selectedRequest.id}
        amount={selectedRequest.amount}
        status={selectedRequest.status}
        requestedAt={selectedRequest.requestedAt}
        completedAt={selectedRequest.completedAt}
        onBack={() => {
          setShowDisbursementDetails(false);
          setSelectedRequest(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => router.push('/services')}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToServices')}</span>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('title', 'ewa')}</h1>
            <p className="text-gray-600 mb-4">{t('subtitle', 'ewa')}</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              <button
                onClick={() => tour?.start()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto"
              >
                {t('getHelp')}
              </button>
              <button
                onClick={handleCallbackRequest}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
              >
                {t('requestCallback')}
              </button>
            </div>
            
            {/* Language Selector */}
            <div className="mt-6 max-w-xs mx-auto">
              <LanguageSelector size="md" />
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <div id="balance-overview" className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{t('maxMonthlyLimit', 'ewa')}</span>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">₹{ewaApplication.maxWithdrawal.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{t('withdrawalLimit', 'ewa')}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{t('usedThisMonth', 'ewa')}</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900">₹{usedThisMonth.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{t('amountWithdrawn', 'ewa')}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{t('available')}</span>
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">₹{availableBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{t('readyToWithdraw', 'ewa')}</p>
            </div>
          </div>
        </div>

        {/* New Request Section */}
        <div id="new-request-section" className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('newWithdrawalRequest', 'ewa')}</h2>
              {!showNewRequest && (
                <button
                  onClick={() => setShowNewRequest(true)}
                  disabled={!canMakeNewRequest()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    canMakeNewRequest()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('newWithdrawalRequest', 'ewa')}</span>
                </button>
              )}
            </div>

            {showNewRequest && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('newWithdrawalRequest', 'ewa')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('withdrawalAmount', 'ewa')}
                    </label>
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      max={availableBalance}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                      placeholder={`Max: ₹${availableBalance.toLocaleString()}`}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {t('available')}: <span className="font-semibold text-green-600">₹{availableBalance.toLocaleString()}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleNewRequest}
                      disabled={!withdrawalAmount || isLoading}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                        withdrawalAmount && !isLoading
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {t('processing')}...
                        </span>
                      ) : t('submitRequest', 'ewa')}
                    </button>
                    
                    <button
                      onClick={() => setShowNewRequest(false)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors font-medium border border-gray-300"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!canMakeNewRequest() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ {t('cannotMakeNewRequest', 'ewa')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Requests */}
        <div id="withdrawal-requests" className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('withdrawalRequests', 'ewa')}</h2>
            
            {drawdownRequests.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('noRequestsYet', 'ewa')}</p>
                <p className="text-sm text-gray-500">{t('makeFirstRequest', 'ewa')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drawdownRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                      request.status === 'disbursed' ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={() => handleRequestClick(request)}
                  >
                    <div className="space-y-4">
                      {/* Main Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('requestId', 'ewa')}</label>
                          <p className="text-sm text-gray-900 font-mono break-all">{request.id}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'requested' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            request.status === 'disbursed' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'requested' ? t('requested', 'ewa') :
                             request.status === 'processing' ? t('processing', 'ewa') :
                             request.status === 'completed' ? t('completed', 'ewa') :
                             request.status === 'disbursed' ? t('disbursed', 'ewa') :
                             t('rejected', 'ewa')}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount')}</label>
                          <p className="text-sm text-gray-900 font-semibold">₹{request.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('requestedOn')}</label>
                          <p className="text-sm text-gray-900">
                            {new Date(request.requestedAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {request.reason && (
                            <span>{t('reason', 'ewa')}: {request.reason}</span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex items-center space-x-2">
                            <label className="text-xs font-medium text-gray-700 hidden sm:inline">{t('status')}:</label>
                            <select
                              value={request.status}
                              onChange={(e) => handleStatusChange(request.id, e.target.value as DrawdownRequest['status'])}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-900 font-medium flex-1 sm:flex-none"
                            >
                              <option value="requested">{t('requested', 'ewa')}</option>
                              <option value="processing">{t('processing', 'ewa')}</option>
                              <option value="completed">{t('completed', 'ewa')}</option>
                              <option value="disbursed">{t('disbursed', 'ewa')}</option>
                              <option value="rejected">{t('rejected', 'ewa')}</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium w-full sm:w-auto"
                            title={t('delete') as string}
                          >
                            🗑️ {t('delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Callback Request Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            {!callbackRequested ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Registering Callback Request</h2>
                <p className="text-gray-600">
                  Please wait while we process your callback request...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Callback Request Registered!</h2>
                <p className="text-gray-600 mb-4">
                  We have registered your callback request. Our team will contact you soon.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>📞 Expected call time:</strong> Within 2-4 hours during business hours
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
