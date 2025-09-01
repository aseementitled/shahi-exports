'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftCircle, Calendar, DollarSign, CheckCircle, Clock, Percent } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface DisbursementDetailsPageProps {
  applicationId: string;
  loanAmount: string;
  tenure: string;
  status: string;
  onBack: () => void;
}

export default function DisbursementDetailsPage({ 
  applicationId, 
  loanAmount, 
  tenure, 
  status,
  onBack 
}: DisbursementDetailsPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const { t } = useLanguage();

  // Calculate loan terms (same as terms page)
  const disbursalAmount = parseFloat(loanAmount);
  const tenureMonths = parseInt(tenure);
  const interestRate = 12.5; // Annual interest rate
  const monthlyInterestRate = interestRate / 12 / 100;
  
  // Calculate EMI using formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi = disbursalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths) / 
              (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - disbursalAmount;

  // Generate EMI schedule with payment status
  const generateEMISchedule = () => {
    const schedule = [];
    const disbursementDate = new Date();
    disbursementDate.setDate(disbursementDate.getDate() - 30); // Disbursed 30 days ago
    
    for (let i = 1; i <= tenureMonths; i++) {
      const emiDate = new Date(disbursementDate);
      emiDate.setMonth(emiDate.getMonth() + i);
      emiDate.setDate(15); // 15th of each month
      
      const today = new Date();
      // For closed loans, show all EMIs as paid
      const isPaid = status === 'closed' ? true : emiDate < today;
      const isOverdue = status === 'closed' ? false : (!isPaid && emiDate < today);
      const isUpcoming = emiDate > today;
      
      schedule.push({
        emiNumber: i,
        dueDate: emiDate,
        amount: Math.round(emi),
        status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'upcoming',
        paidDate: isPaid ? new Date(emiDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null // Paid 2 days after due date
      });
    }
    
    return schedule;
  };

  const emiSchedule = generateEMISchedule();
  const paidEMIs = emiSchedule.filter(emi => emi.status === 'paid').length;
  const overdueEMIs = emiSchedule.filter(emi => emi.status === 'overdue').length;
  const upcomingEMIs = emiSchedule.filter(emi => emi.status === 'upcoming').length;

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
        title: t('welcomeToLoanDashboard', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('loanDashboardExplanation', 'loan')}</p>
            <p class="text-sm mt-2"><strong>${t('trackPaymentsAndNext', 'loan')}</strong></p>
          </div>
        `,
        buttons: [
          {
            text: t('next') as string,
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'loan-summary',
        title: t('yourLoanSummaryDashboard', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('loanSummaryHereYouCanSee', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('howMuchMoneyReceived', 'loan')}</li>
              <li>• ${t('monthlyPaymentAmount', 'loan')}</li>
              <li>• ${t('totalNumberPayments', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('loanOverviewKeepHandy', 'loan')}</strong></p>
          </div>
        `,
        attachTo: {
          element: '#loan-summary-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('previous', 'services') as string,
            action: () => tour.back()
          },
          {
            text: t('next') as string,
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'payment-status',
        title: t('paymentStatusOverviewDashboard', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('paymentStatusShows', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('howManyPaymentsMade', 'loan')}</li>
              <li>• ${t('anyLatePayments', 'loan')}</li>
              <li>• ${t('howManyPaymentsComing', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('keepTrackPaymentProgress', 'loan')}</strong></p>
          </div>
        `,
        attachTo: {
          element: '#payment-status-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('previous', 'services') as string,
            action: () => tour.back()
          },
          {
            text: t('next') as string,
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'emi-schedule',
        title: t('completeEMISchedule', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('emiScheduleTableShows', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('everyPaymentDate', 'loan')}</li>
              <li>• ${t('howMuchPayEachMonth', 'loan')}</li>
              <li>• ${t('whichPaymentsDone', 'loan')}</li>
              <li>• ${t('ifPaymentsLate', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('paymentRoadmapCheck', 'loan')}</strong></p>
          </div>
        `,
        attachTo: {
          element: '#emi-schedule-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('previous', 'services') as string,
            action: () => tour.back()
          },
          {
            text: t('next') as string,
            action: () => tour.next()
          }
        ]
      });

      tour.addStep({
        id: 'loan-terms',
        title: t('importantLoanRules', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('rememberImportantPoints', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('paymentsdue15th', 'loan')}</li>
              <li>• ${t('latePaymentsCost500', 'loan')}</li>
              <li>• ${t('payEarlySmallCharge', 'loan')}</li>
              <li>• ${t('interestRateStaysSame', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('followingRulesSavesMoney', 'loan')}</strong></p>
          </div>
        `,
        attachTo: {
          element: '#loan-terms-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('previous', 'services') as string,
            action: () => tour.back()
          },
          {
            text: t('finishTour', 'services') as string,
            action: () => tour.complete()
          }
        ]
      });

      setTour(tour);
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {status === 'closed' ? t('loanCompletionDetails', 'loan') : t('loanDisbursementDetails', 'loan')}
                </h1>
                <p className="text-gray-600">
{status === 'closed' 
                    ? t('loanCompletionMessage', 'loan') 
                    : t('trackPaymentsMessage', 'loan')
                  }
                </p>
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
                    <span>{t('getHelp')}</span>
                  </button>
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <ArrowLeftCircle className="w-4 h-4" />
                    <span>{t('backToApplications', 'loan')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

                      {/* Loan Summary */}
            <div className="p-6">
              {/* Loan Completion Banner for Closed Status */}
              {status === 'closed' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-green-900 mb-2">🎉 Loan Successfully Completed!</h2>
                      <p className="text-green-800 mb-4">
                        Congratulations! You have successfully paid all EMIs and completed your loan.
                      </p>
                      <div className="bg-green-100 border border-green-300 rounded-lg p-4 inline-block">
                        <p className="text-sm font-medium text-green-900">
                          ✅ All {tenureMonths} EMIs have been paid in full<br/>
                          💰 Total amount repaid: ₹{Math.round(totalAmount).toLocaleString()}<br/>
                          📅 Loan account is now closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div id="loan-summary-section" className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-teal-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
{t('loanSummary', 'loan')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('disbursedAmount', 'loan')}:</span>
                    <DollarSign className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-lg font-semibold text-teal-900">₹{disbursalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('monthlyEMI', 'loan')}:</span>
                    <DollarSign className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-lg font-semibold text-teal-900">₹{Math.round(emi).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('totalEMIs', 'loan')}:</span>
                    <Percent className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-lg font-semibold text-teal-900">{tenureMonths} {t('payments', 'loan')}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div id="payment-status-section" className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
{t('paymentStatusOverview', 'loan')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('paidEMIs', 'loan')}:</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{paidEMIs}</p>
                  <p className="text-xs text-green-700">{t('successfullyPaid', 'loan')}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('overdueEMIs', 'loan')}:</span>
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{overdueEMIs}</p>
                  <p className="text-xs text-red-700">{t('pastDueDate', 'loan')}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('upcomingEMIs', 'loan')}:</span>
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{upcomingEMIs}</p>
                  <p className="text-xs text-blue-700">{t('futurePayments', 'loan')}</p>
                </div>
              </div>
            </div>

            {/* EMI Schedule */}
            <div id="emi-schedule-section" className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
{t('emiPaymentSchedule', 'loan')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">{t('emiNumber', 'loan')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">{t('dueDate', 'loan')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">{t('amount', 'loan')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">{t('status')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">{t('paidDate', 'loan')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emiSchedule.map((emi) => (
                      <tr key={emi.emiNumber} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">EMI {emi.emiNumber}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {emi.dueDate.toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{emi.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            emi.status === 'paid' ? 'bg-green-100 text-green-800' :
                            emi.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
{emi.status === 'paid' ? `✓ ${t('paid', 'loan')}` :
                             emi.status === 'overdue' ? `⚠ ${t('overdue', 'loan')}` :
                             `📅 ${t('upcoming', 'loan')}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {emi.paidDate ? emi.paidDate.toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loan Terms */}
            <div id="loan-terms-section" className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">{t('loanTermsConditions', 'loan')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-yellow-900 mb-3">{t('paymentTerms', 'loan')}</h4>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('emiAutoDeduction', 'loan')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('latePaymentCharges', 'loan')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('prepaymentCharges', 'loan')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-3">{t('interestCharges', 'loan')}</h4>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{(t('interestRateText', 'loan') as string).replace('{rate}', interestRate.toString())}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('totalInterestPayable', 'loan')}: ₹{Math.round(totalInterest).toLocaleString()}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{t('totalAmountPayable', 'loan')}: ₹{Math.round(totalAmount).toLocaleString()}</span>
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
