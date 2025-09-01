'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftCircle, Calendar, DollarSign, CheckCircle, Clock, Percent } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface EWADisbursementDetailsPageProps {
  requestId: string;
  amount: number;
  status: string;
  requestedAt: string;
  completedAt?: string;
  onBack: () => void;
}

export default function EWADisbursementDetailsPage({ 
  requestId, 
  amount, 
  status,
  requestedAt,
  completedAt,
  onBack 
}: EWADisbursementDetailsPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const { t } = useLanguage();

  // Calculate withdrawal terms 
  const maxSalary = 20000; // Hardcoded monthly salary
  const maxWithdrawal = Math.floor(maxSalary * 0.8); // 80% of salary
  const processingFee = Math.floor(amount * 0.02); // 2% processing fee
  const netAmount = amount - processingFee;

  // Initialize Shepherd tour
  useEffect(() => {
    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        scrollTo: { behavior: 'smooth', block: 'center' }
      }
    });

    newTour.addStep({
      title: t('ewaWithdrawalDetails', 'ewa') as string,
      text: `
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">${t('yourWithdrawalDetails', 'ewa')} 💰</h3>
          <p class="text-sm">${t('hereYouCanSee', 'ewa')}:</p>
          <ul class="text-sm text-left mt-2">
            <li>• ${t('requestedAmount', 'ewa')}</li>
            <li>• ${t('processingFees', 'ewa')}</li>
            <li>• ${t('netAmountReceived', 'ewa')}</li>
            <li>• ${t('repaymentSchedule', 'ewa')}</li>
          </ul>
        </div>
      `,
      attachTo: {
        element: '#withdrawal-summary-section',
        on: 'bottom'
      },
      buttons: [
        {
          text: t('next') as string,
          action: newTour.next
        }
      ]
    });

    newTour.addStep({
      title: t('repaymentDetails', 'ewa') as string,
      text: `
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">${t('repaymentInformation', 'ewa')} 📅</h3>
          <p class="text-sm">${t('repaymentDetailsText', 'ewa')}</p>
        </div>
      `,
      attachTo: {
        element: '#repayment-section',
        on: 'bottom'
      },
      buttons: [
        {
          text: t('previous') as string,
          action: newTour.back
        },
        {
          text: t('next') as string,
          action: newTour.next
        }
      ]
    });

    newTour.addStep({
      title: t('withdrawalTerms', 'ewa') as string,
      text: `
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">${t('importantTerms', 'ewa')} 📋</h3>
          <p class="text-sm">${t('withdrawalTermsText', 'ewa')}</p>
        </div>
      `,
      attachTo: {
        element: '#terms-section',
        on: 'top'
      },
      buttons: [
        {
          text: t('previous') as string,
          action: newTour.back
        },
        {
          text: t('finish') as string,
          action: newTour.complete
        }
      ]
    });

    setTour(newTour);

    return () => {
      if (newTour) {
        newTour.complete();
      }
    };
  }, [t]);

  // Calculate repayment date (assuming next month's salary date - 25th)
  const repaymentDate = new Date();
  repaymentDate.setMonth(repaymentDate.getMonth() + 1);
  repaymentDate.setDate(25); // Salary date

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm">
          
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('ewaWithdrawalDetails', 'ewa')}
                </h1>
                <p className="text-gray-600">
                  {t('trackWithdrawalStatus', 'ewa')}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  {t('requestId', 'ewa')}: <span className="font-mono">{requestId}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                {/* Language Selector */}
                <div className="w-48">
                  <LanguageSelector size="sm" />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => tour?.start()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <span>{t('getHelp')}</span>
                  </button>
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <ArrowLeftCircle className="w-4 h-4" />
                    <span>{t('backToDashboard', 'ewa')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Summary */}
          <div className="p-6">
            <div id="withdrawal-summary-section" className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                {t('withdrawalSummary', 'ewa')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('requestedAmount', 'ewa')}:</span>
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold text-purple-900">₹{amount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('processingFee', 'ewa')}:</span>
                    <Percent className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold text-purple-900">₹{processingFee.toLocaleString()}</p>
                  <p className="text-xs text-purple-700">(2% {t('ofAmount', 'ewa')})</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('netAmountReceived', 'ewa')}:</span>
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold text-purple-900">₹{netAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Repayment Information */}
            <div id="repayment-section" className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {t('repaymentInformation', 'ewa')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('repaymentDate', 'ewa')}:</span>
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-900">
                    {repaymentDate.toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-green-700">{t('nextSalaryDate', 'ewa')}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('repaymentAmount', 'ewa')}:</span>
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-900">₹{amount.toLocaleString()}</p>
                  <p className="text-xs text-green-700">{t('fullAmountDeducted', 'ewa')}</p>
                </div>
              </div>
            </div>

            {/* Withdrawal Terms */}
            <div id="terms-section" className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">{t('withdrawalTermsConditions', 'ewa')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-yellow-900 mb-3">{t('withdrawalRules', 'ewa')}</h4>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('maxWithdrawalLimit', 'ewa')}: ₹{maxWithdrawal.toLocaleString()}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('processingFeeInfo', 'ewa')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('repaymentAutoDeduction', 'ewa')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-3">{t('importantNotes', 'ewa')}</h4>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('instantTransfer', 'ewa')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('noInterestCharge', 'ewa')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('lateDeductionFee', 'ewa')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
