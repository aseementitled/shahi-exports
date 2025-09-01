'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftCircle, CheckCircle, Calculator, Calendar, DollarSign, Percent } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface LoanTermsScreenProps {
  applicationId: string;
  loanAmount: string;
  tenure: string;
  onBack: () => void;
  onAcceptTerms: () => void;
}

export default function LoanTermsScreen({ 
  applicationId, 
  loanAmount, 
  tenure, 
  onBack, 
  onAcceptTerms 
}: LoanTermsScreenProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const { t } = useLanguage();

  // Calculate loan terms (simulated)
  const disbursalAmount = parseFloat(loanAmount);
  const tenureMonths = parseInt(tenure);
  const interestRate = 12.5; // Annual interest rate
  const monthlyInterestRate = interestRate / 12 / 100;
  
  // Calculate EMI using formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi = disbursalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths) / 
              (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - disbursalAmount;
  
  // Calculate first EMI date (next month from current date)
  const firstEmiDate = new Date();
  firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);
  firstEmiDate.setDate(15); // Set to 15th of next month

  // Initialize Shepherd tour
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'shadow-md bg-purple-dark',
          scrollTo: true
        },
        useModalOverlay: true
      });

      tour.addStep({
        id: 'welcome',
        text: `
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Welcome to Loan Terms Review! 📋</h3>
            <p class="text-sm">This page shows you all the important details about your loan before you agree to it.</p>
            <p class="text-sm mt-2"><strong>Take your time to read everything carefully!</strong></p>
          </div>
        `,
        buttons: [
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });

      tour.addStep({
        id: 'loan-summary',
        text: `
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Your Loan Summary 💰</h3>
            <p class="text-sm">Here you can see:</p>
            <ul class="text-sm text-left mt-2">
              <li>• How much money you're borrowing</li>
              <li>• How long you have to pay it back</li>
              <li>• What interest rate you'll pay</li>
              <li>• Your monthly payment amount</li>
            </ul>
            <p class="text-sm mt-2"><strong>Make sure these numbers look right to you!</strong></p>
          </div>
        `,
        attachTo: {
          element: '.bg-blue-50',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Previous',
            action: () => tour.back()
          },
          {
            text: 'Next',
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'emi-schedule',
        text: `
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">EMI Payment Schedule 📅</h3>
            <p class="text-sm">This shows you:</p>
            <ul class="text-sm text-left mt-2">
              <li>• When your first payment is due</li>
              <li>• How much you'll pay each month</li>
              <li>• Total number of payments</li>
            </ul>
            <p class="text-sm mt-2"><strong>Mark these dates in your calendar!</strong></p>
          </div>
        `,
        attachTo: {
          element: '.bg-green-50',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Previous',
            action: () => tour.back()
          },
          {
            text: 'Next',
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'terms-conditions',
        text: `
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Important Terms & Conditions ⚠️</h3>
            <p class="text-sm">Read these carefully:</p>
            <ul class="text-sm text-left mt-2">
              <li>• When payments are due</li>
              <li>• What happens if you pay late</li>
              <li>• Extra charges you might face</li>
              <li>• When you'll get your money</li>
            </ul>
            <p class="text-sm mt-2"><strong>These rules are important - don't skip them!</strong></p>
          </div>
        `,
        attachTo: {
          element: '.bg-yellow-50',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Previous',
            action: () => tour.back()
          },
          {
            text: 'Next',
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'acceptance',
        text: `
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Ready to Accept? ✅</h3>
            <p class="text-sm">By clicking "Accept & Proceed":</p>
            <ul class="text-sm text-left mt-2">
              <li>• You agree to all the loan terms</li>
              <li>• You promise to pay back the money</li>
              <li>• You'll go to the next step (mandate setup)</li>
            </ul>
            <p class="text-sm mt-2"><strong>Only click this when you're sure about everything!</strong></p>
          </div>
        `,
        attachTo: {
          element: '.bg-gray-50',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Previous',
            action: () => tour.back()
          },
          {
            text: 'Finish Tour',
            action: () => tour.complete()
          }
        ]
      });

      setTour(tour);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('loanTermsConditions', 'loan')}</h1>
                <p className="text-gray-600">{t('reviewLoanDetailsBeforeProceeding', 'loan')}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {t('applicationId')}: <span className="font-mono">{applicationId}</span>
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
                    <span>🎯 {t('getHelp')}</span>
                  </button>
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <ArrowLeftCircle className="w-4 h-4" />
                    <span>{t('backToDocumentCheck', 'loan')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Terms Content */}
          <div className="p-6">
            {/* Loan Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
{t('loanSummary', 'loan')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t('loanAmount', 'loan')}:</span>
                    <span className="text-lg font-semibold text-blue-900">₹{disbursalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t('tenure', 'loan')}:</span>
                    <span className="text-lg font-semibold text-blue-900">{tenureMonths} {tenureMonths === 1 ? (t('months', 'loan') as unknown as string[])[0] : (t('months', 'loan') as unknown as string[])[tenureMonths - 1]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t('interestRate', 'loan')}:</span>
                    <span className="text-lg font-semibold text-blue-900">{interestRate}% p.a.</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t('monthlyEMI', 'loan')}:</span>
                    <span className="text-lg font-semibold text-green-600">₹{Math.round(emi).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t('totalInterest', 'loan')}:</span>
                    <span className="text-lg font-semibold text-orange-600">₹{Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t('totalAmount', 'loan')}:</span>
                    <span className="text-lg font-semibold text-purple-600">₹{Math.round(totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EMI Schedule Preview */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
{t('emiSchedule', 'loan')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('firstEMIDate', 'loan')}:</span>
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-900">
                    {firstEmiDate.toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('emiAmount', 'loan')}:</span>
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-900">₹{Math.round(emi).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('totalEMIs', 'loan')}:</span>
                    <Percent className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-900">{(t('paymentsText', 'loan') as string).replace('{count}', tenureMonths.toString())}</p>
                </div>
              </div>
            </div>

            {/* Important Terms */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">{t('importantTermsConditions', 'loan')}</h3>
              <ul className="space-y-3 text-sm text-yellow-800">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>{t('emiAutoDeductionBank', 'loan')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>{t('latePaymentChargesBankText', 'loan')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>{t('prepaymentChargesBankText', 'loan')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>{t('interestRateFixed', 'loan')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>{t('loanDisbursementProcessing', 'loan')}</span>
                </li>
              </ul>
            </div>

            {/* Acceptance Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('acceptance', 'loan')}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('acceptanceText', 'loan')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onAcceptTerms}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('acceptProceedMandate', 'loan')}
                </button>
                
                <button
                  onClick={onBack}
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  {t('back')}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                {t('acceptanceRecorded', 'loan')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
