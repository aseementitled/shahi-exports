'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, ArrowRight, CheckCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../../components/LanguageSelector';

interface KYCData {
  name: string;
  mobile: string;
  gender: string;
  pancard: File | null;
  adhaar: File | null;
  selfie: string | null;
  otp: string;
  isVerified: boolean;
}



export default function ServicesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const [kycData, setKYCData] = useState<KYCData | null>(null);
  const [hasExistingLoan, setHasExistingLoan] = useState(false);
  const [hasExistingEWA, setHasExistingEWA] = useState(false);
  const router = useRouter();
  const { currentLanguage, t } = useLanguage();

  // Load KYC data and check for existing applications
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const kycAvailability = localStorage.getItem('kycAvailability');
    const savedLoan = localStorage.getItem('loanApplication');
    const savedEWA = localStorage.getItem('ewaApplication');

    // Check if user is registered
    if (!userData) {
      router.push('/auth/choice');
      return;
    }

    // Check KYC availability status
    if (kycAvailability) {
      try {
        const kyc = JSON.parse(kycAvailability);
        if (kyc.canProceed) {
          // KYC can proceed, user can access services
          setKYCData({ isVerified: true } as KYCData);
        } else {
          // KYC incomplete, show nudge
          setKYCData({ isVerified: false } as KYCData);
        }
      } catch (error) {
        console.error('Error parsing KYC availability:', error);
        setKYCData({ isVerified: false } as KYCData);
      }
    } else {
      // No KYC data, show nudge
      setKYCData({ isVerified: false } as KYCData);
    }

    // Check for existing applications
    if (savedLoan) {
      try {
        const loanData = JSON.parse(savedLoan);
        setHasExistingLoan(loanData.status !== 'completed');
      } catch (error) {
        console.error('Error parsing loan data:', error);
      }
    }

    if (savedEWA) {
      try {
        const ewaData = JSON.parse(savedEWA);
        // EWA applications are always active once created, so we check if they exist
        setHasExistingEWA(true);
      } catch (error) {
        console.error('Error parsing EWA data:', error);
      }
    }
  }, [router]);

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
        title: t('welcomeToServicesDashboard', 'services') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('kycVerifiedExplore', 'services')}</p>
            <p class="text-sm mt-2"><strong>${t('letsExploreServices', 'services')}</strong></p>
          </div>
        `,
        buttons: [{ text: t('next') as string, action: () => tour.next() }]
      });

      tour.addStep({
        id: 'loan-service',
        title: t('loanApplicationService', 'services') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('loanServiceOffers', 'services')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('personalLoansCompetitive', 'services')}</li>
              <li>• ${t('quickApprovalProcess', 'services')}</li>
              <li>• ${t('flexibleRepaymentOptions', 'services')}</li>
              <li>• ${t('noHiddenCharges', 'services')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('perfectForMoney', 'services')}</strong></p>
          </div>
        `,
        attachTo: { element: '#loan-service-card', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('next') as string, action: () => tour.next() }
        ]
      });

      tour.addStep({
        id: 'ewa-service',
        title: t('ewaEarnedWageAccess', 'services') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('ewaServiceAllows', 'services')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('accessEarnedWagesEarly', 'services')}</li>
              <li>• ${t('withdrawMoneyInstantly', 'services')}</li>
              <li>• ${t('noInterestFeesCharged', 'services')}</li>
              <li>• ${t('flexibleWithdrawalAmounts', 'services')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('greatForEmergencies', 'services')}</strong></p>
          </div>
        `,
        attachTo: { element: '#ewa-service-card', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('next') as string, action: () => tour.next() }
        ]
      });

      tour.addStep({
        id: 'kyc-benefit',
        title: t('kycVerificationBenefits', 'services') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('sinceKycVerified', 'services')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('detailsPreFilled', 'services')}</li>
              <li>• ${t('fasterApplicationProcess', 'services')}</li>
              <li>• ${t('noDocumentsAgain', 'services')}</li>
              <li>• ${t('quickApprovalDisbursement', 'services')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('allSetToApply', 'services')}</strong></p>
          </div>
        `,
        attachTo: { element: '.bg-white.rounded-lg.shadow-sm', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('finishTour', 'services') as string, action: () => tour.complete() }
        ]
      });

      setTour(tour);
    }
  }, [t]);

  const handleServiceSelect = (service: 'loan' | 'ewa') => {
    if (service === 'loan') {
      if (hasExistingLoan) {
        router.push('/loan/continue');
      } else {
        router.push('/loan/new');
      }
    } else if (service === 'ewa') {
      if (hasExistingEWA) {
        router.push('/ewa/dashboard');
      } else {
        router.push('/ewa/new');
      }
    }
  };

  if (!kycData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show KYC completion nudge if KYC is incomplete
  if (!kycData.isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Complete Basic KYC First
          </h1>
          
          <p className="text-gray-600 mb-6">
            To access our loan and salary advance services, you need to complete your KYC verification first.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">What you need:</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• PAN Card</li>
              <li>• Aadhaar Card</li>
              <li>• Live selfie verification</li>
            </ul>
          </div>
          
          <button
            onClick={() => router.push('/kyc/availability')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Complete KYC Now
          </button>
          
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-green-600 font-medium">{t('kycVerified', 'services')}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title', 'services')}</h1>
          <p className="text-gray-600">{t('subtitle', 'services')}</p>
          
          {/* Help Button */}
          <div className="mt-4">
            <button
              onClick={() => tour?.start()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mx-auto"
            >
              <span>{t('getHelp')}</span>
            </button>
          </div>
          
          {/* Language Selector */}
          <div className="mt-6 max-w-xs mx-auto">
            <LanguageSelector size="md" />
          </div>
          
          {/* User Info */}
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4 inline-block">
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-semibold text-gray-900">
                {JSON.parse(localStorage.getItem('userData') || '{}').name || 'User'}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Mobile: {JSON.parse(localStorage.getItem('userData') || '{}').mobile || 'N/A'}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Loan Service */}
          <div id="loan-service-card" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('loanService', 'services')}</h2>
                  {hasExistingLoan && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {t('inProgress', 'services')}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{t('loanDescription', 'services')}</p>
              
              <ul className="space-y-2 mb-6">
                {(t('loanFeatures', 'services') as unknown as string[]).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleServiceSelect('loan')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{hasExistingLoan ? t('continueApplication') : t('startApplication')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  {t('learnMore')}
                </button>
              </div>
            </div>
          </div>

          {/* EWA Service */}
          <div id="ewa-service-card" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('ewaService', 'services')}</h2>
                  {hasExistingEWA && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {t('active', 'services')}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{t('ewaDescription', 'services')}</p>
              
              <ul className="space-y-2 mb-6">
                {(t('ewaFeatures', 'services') as unknown as string[]).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleServiceSelect('ewa')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{hasExistingEWA ? t('accessDashboard', 'services') : t('startApplication')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  {t('learnMore')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>{t('tip', 'services')}:</strong> {t('tipMessage', 'services')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
