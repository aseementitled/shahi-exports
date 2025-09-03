'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle, Plus, ArrowLeftCircle } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useRouter } from 'next/navigation';
import ESignaturePage from './ESignaturePage';
import LoanTermsScreen from './LoanTermsScreen';
import DisbursementDetailsPage from './DisbursementDetailsPage';
import { useLanguage } from '../contexts/LanguageContext';


type TourType = unknown; // Using unknown for Shepherd.Tour due to complex typing

interface LoanApplication {
  id: string;
  loanAmount: string;
  tenure: string;
  status: 'kyc_done' | 'pending' | 'approved' | 'rejected' | 'document_check' | 'mandate_completed' | 'completed' | 'disbursed' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface DocumentCompletion {
  applicationId: string;
  enachMandate: {
    completed: boolean;
    completedAt?: string;
    authenticationMode: string;
    bankDetails: {
      bankName: string;
      accountName: string;
      accountType: string;
      accountNumber: string;
    };
  };
  eSignature: {
    completed: boolean;
    completedAt?: string;
    documentsSigned: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  loanAmount: string;
  tenure: string;
}

interface FormTranslations {
  loanTitle: string;
  loanSubtitle: string;
  loanAmount: string;
  tenure: string;
  next: string;
  back: string;
  consent: string;
  consentText: string;
  fetchingInfo: string;
  fetchingInfoText: string;
  applicationSubmitted: string;
  applicationSubmittedText: string;
  applicationId: string;
  status: string;
  existingApplication: string;
  submitNewApplication: string;
  tourHelp: string;
  months1: string;
  months2: string;
  months3: string;
  months4: string;
  months5: string;
  months6: string;
  months7: string;
  months8: string;
  months9: string;
  months10: string;
  months11: string;
  months12: string;
}

const formTranslations: Record<string, FormTranslations> = {
  en: {
    loanTitle: 'Loan Application',
    loanSubtitle: 'Complete your loan application in a few simple steps',
    loanAmount: 'Loan Amount',
    tenure: 'Tenure',
    next: 'Next',
    back: 'Back',
    consent: 'Consent & Authorization',
    consentText: 'I hereby consent and authorize the company to fetch my employment and salary information from my employer for the purpose of processing this loan application. I understand that this information will be used solely for loan assessment and approval.',
    fetchingInfo: 'Fetching Information',
    fetchingInfoText: 'We are currently retrieving your employment and salary details from your employer. This may take a few moments.',
    applicationSubmitted: 'Application Submitted Successfully!',
    applicationSubmittedText: 'Your loan application has been submitted successfully. You can track your application status using the application ID below.',
    applicationId: 'Application ID',
    status: 'Status',
    existingApplication: 'Existing Application Found',
    submitNewApplication: 'Submit New Application',
    tourHelp: 'Get Help for Step',
    months1: '1 Month',
    months2: '2 Months',
    months3: '3 Months',
    months4: '4 Months',
    months5: '5 Months',
    months6: '6 Months',
    months7: '7 Months',
    months8: '8 Months',
    months9: '9 Months',
    months10: '10 Months',
    months11: '11 Months',
    months12: '12 Months',
  },
  hi: {
    loanTitle: 'लोन आवेदन',
    loanSubtitle: 'कुछ सरल चरणों में अपना लोन आवेदन पूरा करें',
    loanAmount: 'लोन राशि',
    tenure: 'अवधि',
    next: 'अगला',
    back: 'पीछे',
    consent: 'सहमति और प्राधिकरण',
    consentText: 'मैं यहां सहमति देता/देती हूं और कंपनी को इस लोन आवेदन के प्रसंस्करण के उद्देश्य से मेरे नियोक्ता से मेरी रोजगार और वेतन जानकारी प्राप्त करने का अधिकार देता/देती हूं। मैं समझता/समझती हूं कि यह जानकारी केवल लोन मूल्यांकन और स्वीकृति के लिए उपयोग की जाएगी।',
    fetchingInfo: 'जानकारी प्राप्त कर रहे हैं',
    fetchingInfoText: 'हम वर्तमान में आपके नियोक्ता से आपकी रोजगार और वेतन विवरण प्राप्त कर रहे हैं। इसमें कुछ क्षण लग सकते हैं।',
    applicationSubmitted: 'आवेदन सफलतापूर्वक जमा किया गया!',
    applicationSubmittedText: 'आपका लोन आवेदन सफलतापूर्वक जमा किया गया है। आप नीचे दिए गए आवेदन आईडी का उपयोग करके अपने आवेदन की स्थिति ट्रैक कर सकते हैं।',
    applicationId: 'आवेदन आईडी',
    status: 'स्थिति',
    existingApplication: 'मौजूदा आवेदन मिला',
    submitNewApplication: 'नया आवेदन जमा करें',
    tourHelp: 'चरण के लिए सहायता प्राप्त करें',
    months1: '1 महीना',
    months2: '2 महीने',
    months3: '3 महीने',
    months4: '4 महीने',
    months5: '5 महीने',
    months6: '6 महीने',
    months7: '7 महीने',
    months8: '8 महीने',
    months9: '9 महीने',
    months10: '10 महीने',
    months11: '11 महीने',
    months12: '12 महीने',
  },
  te: {
    loanTitle: 'లోన్ అప్లికేషన్',
    loanSubtitle: 'కొన్ని సరళమైన దశలలో మీ లోన్ అప్లికేషన్‌ని పూర్తి చేయండి',
    loanAmount: 'లోన్ మొత్తం',
    tenure: 'కాల వ్యవధి',
    next: 'తదుపరి',
    back: 'వెనుకకు',
    consent: 'సమ్మతి మరియు అధికారం',
    consentText: 'నేను ఇక్కడ సమ్మతిస్తున్నాను మరియు ఈ లోన్ అప్లికేషన్‌ని ప్రాసెస్ చేయడానికి నా యజమాని నుండి నా ఉపాధి మరియు జీతం సమాచారాన్ని పొందడానికి కంపెనీకి అధికారం ఇస్తున్నాను. ఈ సమాచారం లోన్ అంచనా మరియు ఆమోదం కోసం మాత్రమే ఉపయోగించబడుతుందని నేను అర్థం చేసుకుంటున్నాను.',
    fetchingInfo: 'సమాచారం పొందుతోంది',
    fetchingInfoText: 'మేము ప్రస్తుతం మీ యజమాని నుండి మీ ఉపాధి మరియు జీతం వివరాలను పొందుతున్నాము. దీనికి కొన్ని క్షణాలు పట్టవచ్చు.',
    applicationSubmitted: 'అప్లికేషన్ విజయవంతంగా సమర్పించబడింది!',
    applicationSubmittedText: 'మీ లోన్ అప్లికేషన్ విజయవంతంగా సమర్పించబడింది. క్రింద ఇచ్చిన అప్లికేషన్ ఐడీని ఉపయోగించి మీ అప్లికేషన్ స్థితిని ట్రాక్ చేయవచ్చు.',
    applicationId: 'అప్లికేషన్ ఐడీ',
    status: 'స్థితి',
    existingApplication: 'ప్రస్తుత అప్లికేషన్ దొరికింది',
    submitNewApplication: 'కొత్త అప్లికేషన్ సమర్పించండి',
    tourHelp: 'దశ కోసం సహాయం పొందండి',
    months1: '1 నెల',
    months2: '2 నెలలు',
    months3: '3 నెలలు',
    months4: '4 నెలలు',
    months5: '5 నెలలు',
    months6: '6 నెలలు',
    months7: '7 నెలలు',
    months8: '8 నెలలు',
    months9: '9 నెలలు',
    months10: '10 నెలలు',
    months11: '11 నెలలు',
    months12: '12 నెలలు',
  },
  kn: {
    loanTitle: 'ಸಾಲ ಅರ್ಜಿ',
    loanSubtitle: 'ಕೆಲವು ಸರಳ ಹಂತಗಳಲ್ಲಿ ನಿಮ್ಮ ಸಾಲ ಅರ್ಜಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ',
    loanAmount: 'ಸಾಲದ ಮೊತ್ತ',
    tenure: 'ಅವಧಿ',
    next: 'ಮುಂದೆ',
    back: 'ಹಿಂದೆ',
    consent: 'ಸಮ್ಮತಿ ಮತ್ತು ಅಧಿಕಾರ',
    consentText: 'ಈ ಸಾಲ ಅರ್ಜಿಯನ್ನು ಸಂಸ್ಕರಿಸುವ ಉದ್ದೇಶಕ್ಕಾಗಿ ನನ್ನ ಉದ್ಯೋಗದಾತರಿಂದ ನನ್ನ ಉದ್ಯೋಗ ಮತ್ತು ಸಂಬಳದ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಕಂಪನಿಗೆ ನಾನು ಇಲ್ಲಿ ಸಮ್ಮತಿಸುತ್ತೇನೆ ಮತ್ತು ಅಧಿಕಾರ ನೀಡುತ್ತೇನೆ. ಈ ಮಾಹಿತಿಯನ್ನು ಸಾಲದ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಅನುಮೋದನೆಗಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ.',
    fetchingInfo: 'ಮಾಹಿತಿಯನ್ನು ಪಡೆಯುತ್ತಿದೆ',
    fetchingInfoText: 'ನಾವು ಪ್ರಸ್తుತ ನಿಮ್ಮ ಉದ್ಯೋಗದಾತರಿಂದ ನಿಮ್ಮ ಉದ್ಯೋಗ ಮತ್ತು ಸಂಬಳದ ವಿವರಗಳನ್ನು ಪಡೆಯುತ್ತಿದ್ದೇವೆ. ಇದಕ್ಕೆ ಕೆಲವು ಕ್ಷಣಗಳು ತೆಗೆದುಕೊಳ್ಳಬಹುದು.',
    applicationSubmitted: 'ಅರ್ಜಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!',
    applicationSubmittedText: 'ನಿಮ್ಮ ಸಾಲ ಅರ್ಜಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಕೆಳಗೆ ನೀಡಲಾದ ಅರ್ಜಿ ಐಡಿಯನ್ನು ಬಳಸಿಕೊಂಡು ನಿಮ್ಮ ಅರ್ಜಿಯ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು.',
    applicationId: 'ಅರ್ಜಿ ಐಡಿ',
    status: 'ಸ್ಥಿತಿ',
    existingApplication: 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಅರ್ಜಿ ಕಂಡುಬಂದಿದೆ',
    submitNewApplication: 'ಹೊಸ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    tourHelp: 'ಹಂತಕ್ಕಾಗಿ ಸಹಾಯ ಪಡೆಯಿರಿ',
    months1: '1 ತಿಂಗಳು',
    months2: '2 ತಿಂಗಳುಗಳು',
    months3: '3 ತಿಂಗಳುಗಳು',
    months4: '4 ತಿಂಗಳುಗಳು',
    months5: '5 ತಿಂಗಳುಗಳು',
    months6: '6 ತಿಂಗಳುಗಳು',
    months7: '7 ತಿಂಗಳುಗಳು',
    months8: '8 ತಿಂಗಳುಗಳು',
    months9: '9 ತಿಂಗಳುಗಳು',
    months10: '10 ತಿಂಗಳುಗಳು',
    months11: '11 ತಿಂಗಳುಗಳು',
    months12: '12 ತಿಂಗಳುಗಳು',
  },
  mr: {
    loanTitle: 'कर्ज अर्ज',
    loanSubtitle: 'काही सोप्या पायऱ्यांमध्ये तुमचे कर्ज अर्ज पूर्ण करा',
    loanAmount: 'कर्जाची रक्कम',
    tenure: 'मुदत',
    next: 'पुढे',
    back: 'मागे',
    consent: 'संमती आणि अधिकार',
    consentText: 'मी येथे संमती देतो/देते आणि या कर्ज अर्जाच्या प्रक्रियेसाठी माझ्या नियोक्त्याकडून माझी रोजगार आणि पगाराची माहिती मिळवण्यासाठी कंपनीला अधिकार देतो/देते. मी समजतो/समजते की ही माहिती केवळ कर्ज मूल्यांकन आणि मंजुरीसाठी वापरली जाईल.',
    fetchingInfo: 'माहिती मिळवत आहे',
    fetchingInfoText: 'आम्ही सध्या तुमच्या नियोक्त्याकडून तुमची रोजगार आणि पगाराची तपशील मिळवत आहोत. यासाठी काही क्षण लागू शकतात.',
    applicationSubmitted: 'अर्ज यशस्वीरित्या सादर केले!',
    applicationSubmittedText: 'तुमचे कर्ज अर्ज यशस्वीरित्या सादर केले गेले आहे. खाली दिलेल्या अर्ज आयडीचा वापर करून तुम्ही तुमच्या अर्जाची स्थिती ट्रॅक करू शकता.',
    applicationId: 'अर्ज आयडी',
    status: 'स्थिती',
    existingApplication: 'विद्यमान अर्ज सापडले',
    submitNewApplication: 'नवीन अर्ज सादर करा',
    tourHelp: 'पायरीसाठी मदत मिळवा',
    months1: '1 महिना',
    months2: '2 महिने',
    months3: '3 महिने',
    months4: '4 महिने',
    months5: '5 महिने',
    months6: '6 महिने',
    months7: '7 महिने',
    months8: '8 महिने',
    months9: '9 महिने',
    months10: '10 महिने',
    months11: '11 महिने',
    months12: '12 महिने',
  },
  hinglish: {
    loanTitle: 'Loan Application',
    loanSubtitle: 'Apne loan application ko kuch simple steps mein complete karein',
    loanAmount: 'Loan Amount',
    tenure: 'Tenure',
    next: 'Next',
    back: 'Back',
    consent: 'Consent & Authorization',
    consentText: 'Main yahan consent deta/deti hun aur company ko is loan application ke processing ke liye mere employer se meri employment aur salary information fetch karne ka adhikar deta/deti hun. Main samajhta/samajhti hun ki ye information sirf loan assessment aur approval ke liye use hogi.',
    fetchingInfo: 'Information Fetch Kar Rahe Hain',
    fetchingInfoText: 'Hum abhi aapke employer se aapki employment aur salary details fetch kar rahe hain. Isme kuch time lag sakta hai.',
    applicationSubmitted: 'Application Successfully Submit Ho Gayi!',
    applicationSubmittedText: 'Aapka loan application successfully submit ho gaya hai. Aap niche diye gaye application ID ka use karke apne application ki status track kar sakte hain.',
    applicationId: 'Application ID',
    status: 'Status',
    existingApplication: 'Existing Application Mil Gayi',
    submitNewApplication: 'Naya Application Submit Karein',
    tourHelp: 'Step ke liye Help Lein',
    months1: '1 Month',
    months2: '2 Months',
    months3: '3 Months',
    months4: '4 Months',
    months5: '5 Months',
    months6: '6 Months',
    months7: '7 Months',
    months8: '8 Months',
    months9: '9 Months',
    months10: '10 Months',
    months11: '11 Months',
    months12: '12 Months',
  },
};

export default function LoanForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { currentLanguage, t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    loanAmount: '',
    tenure: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tour, setTour] = useState<TourType | null>(null);
  const [existingApplication, setExistingApplication] = useState<LoanApplication | null>(null);
  const [allApplications, setAllApplications] = useState<LoanApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDocumentCheck, setShowDocumentCheck] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showMandateScreen, setShowMandateScreen] = useState(false);
  const [mandateCompleted, setMandateCompleted] = useState(false);
  const [authorizationChecked, setAuthorizationChecked] = useState(false);
  const [documentCompletion, setDocumentCompletion] = useState<DocumentCompletion | null>(null);
  const [showContractSigning, setShowContractSigning] = useState(false);
  const [contractsSigned, setContractsSigned] = useState<string[]>([]);
  const [showESignature, setShowESignature] = useState(false);
  const [showLoanTerms, setShowLoanTerms] = useState(false);
  const [showDisbursementDetails, setShowDisbursementDetails] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const router = useRouter();

  const totalSteps = 3;

  // Check for existing application on component mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('loanApplications');
    if (savedApplications) {
      try {
        const applications: LoanApplication[] = JSON.parse(savedApplications);
        setAllApplications(applications);
        const latestApplication = applications[applications.length - 1];
        // Only consider application as "existing" if it's not in a final state
        if (latestApplication && !['rejected', 'closed', 'disbursed'].includes(latestApplication.status)) {
          setExistingApplication(latestApplication);
        }
        setShowForm(false); // Start with applications list view
      } catch (error) {
        console.error('Error parsing saved loan applications:', error);
      }
    }
  }, []);

  // Load document completion data when selected application changes
  useEffect(() => {
    if (selectedApplication) {
      const savedDocumentCompletion = localStorage.getItem('documentCompletion');
      if (savedDocumentCompletion) {
        try {
          const allDocumentCompletions: DocumentCompletion[] = JSON.parse(savedDocumentCompletion);
          const currentCompletion = allDocumentCompletions.find(
            doc => doc.applicationId === selectedApplication.id
          );
          setDocumentCompletion(currentCompletion || null);
        } catch (error) {
          console.error('Error parsing saved document completion:', error);
        }
      }
    }
  }, [selectedApplication]);

  // Initialize Shepherd tour
  useEffect(() => {
    const newTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true,
      },
      useModalOverlay: true,
    });

    // Add tour steps based on current step or if showing applications list
    if (allApplications.length > 0 && !showForm) {
      // Tour for applications list page
      newTour.addStep({
        id: 'applications-overview',
        text: 'Welcome to your loan applications dashboard! Here you can view all your applications and their current status.',
        attachTo: {
          element: 'h1',
          on: 'bottom',
        },
        buttons: [
          {
            text: t('next') as string,
            action: () => newTour.next(),
          },
        ],
      });

      newTour.addStep({
        id: 'applications-list',
        text: 'This section shows all your loan applications with details like application ID, status, amount, and tenure.',
        attachTo: {
          element: '.space-y-4',
          on: 'top',
        },
        buttons: [
          {
            text: t('next') as string,
            action: () => newTour.next(),
          },
        ],
      });

      newTour.addStep({
        id: 'status-explanation',
        text: 'Application statuses: KYC Done (blue), Pending (yellow), Approved (green), Rejected (red).',
        attachTo: {
          element: '.space-y-4',
          on: 'bottom',
        },
        buttons: [
          {
            text: t('next') as string,
            action: () => newTour.next(),
          },
        ],
      });

      newTour.addStep({
        id: 'action-buttons',
        text: t('useActionButtonsTour', 'loan') as string,
        attachTo: {
          element: '.flex.flex-col.sm\\:flex-row',
          on: 'top',
        },
        buttons: [
          {
            text: t('finish') as string,
            action: () => newTour.complete(),
          },
        ],
      });
    } else if (currentStep === 1) {
      newTour.addStep({
        id: 'loan-details',
        text: t('fillLoanDetailsTour', 'loan') as string,
        attachTo: {
          element: '.loan-details-section',
          on: 'bottom',
        },
        buttons: [
          {
            text: t('next') as string,
            action: () => newTour.next(),
          },
        ],
      });
    } else if (currentStep === 2) {
      newTour.addStep({
        id: 'consent',
        text: t('readAcceptConsentTerms', 'loan') as string,
        attachTo: {
          element: '.consent-section',
          on: 'bottom',
        },
        buttons: [
          {
            text: t('next') as string,
            action: () => newTour.next(),
          },
        ],
      });
    } else if (currentStep === 3) {
      newTour.addStep({
        id: 'fetching-info',
        text: t('fetchingEmploymentInfo', 'loan') as string,
        attachTo: {
          element: '.fetching-info-section',
          on: 'bottom',
        },
        buttons: [
          {
            text: t('finish') as string,
            action: () => newTour.complete(),
          },
        ],
      });
    }

    setTour(newTour);

    return () => {
      if (newTour) {
        try {
          // @ts-expect-error - Shepherd tour cleanup
          if (newTour.destroy) newTour.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [currentStep, allApplications.length, existingApplication, showForm, t]);

  const startTour = () => {
    if (tour) {
      // @ts-expect-error - Shepherd tour methods
      tour.start();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate loan details
      if (!formData.loanAmount || !formData.tenure) {
        alert('Please fill in all fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Consent accepted, proceed to fetching info
      setCurrentStep(3);
      setIsLoading(true);
      
      // Simulate fetching information
      setTimeout(() => {
        setIsLoading(false);
        submitApplication();
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.loanAmount && formData.tenure;
    }
    return true;
  };

  const submitApplication = () => {
    const application: LoanApplication = {
      id: `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      loanAmount: formData.loanAmount,
      tenure: formData.tenure,
      status: 'kyc_done',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const savedApplications = localStorage.getItem('loanApplications');
    let applications: LoanApplication[] = [];
    
    if (savedApplications) {
      try {
        applications = JSON.parse(savedApplications);
      } catch (error) {
        console.error('Error parsing existing applications:', error);
      }
    }
    
    applications.push(application);
    localStorage.setItem('loanApplications', JSON.stringify(applications));
    
    // Set as existing application
    setExistingApplication(application);
    
    // Redirect to services menu page after successful submission
    setTimeout(() => {
      router.push('/services');
    }, 2000); // 2 second delay to show success message
  };

  const submitNewApplication = () => {
    setExistingApplication(null);
    setFormData({ loanAmount: '', tenure: '' });
    setCurrentStep(1);
    setShowForm(true);
  };

  const goToServices = () => {
    router.push('/services');
  };

  const openDocumentCheck = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowDocumentCheck(true);
  };

  const openMandateScreen = () => {
    setShowMandateScreen(true);
    setAuthorizationChecked(false); // Reset checkbox when opening mandate screen
  };

  const openESignature = () => {
    setShowESignature(true);
  };

  const openLoanTerms = () => {
    setShowLoanTerms(true);
  };

  const handleTermsAcceptance = () => {
    setShowLoanTerms(false);
    setShowMandateScreen(true);
    setAuthorizationChecked(false);
  };

  const openDisbursementDetails = () => {
    setShowDisbursementDetails(true);
  };

  // Handle status change for testing/simulation
  const handleStatusChange = (applicationId: string, newStatus: string) => {
    const updatedApplications = allApplications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus as LoanApplication['status'], updatedAt: new Date().toISOString() }
        : app
    );
    setAllApplications(updatedApplications);
    localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
    
    // Also update existing application if it's the same one
    if (existingApplication && existingApplication.id === applicationId) {
      const updatedApp = updatedApplications.find(app => app.id === applicationId);
      if (updatedApp) {
        setExistingApplication(updatedApp);
      }
    }
  };

  // Handle loan application deletion
  const handleDeleteApplication = (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this loan application? This action cannot be undone.')) {
      const updatedApplications = allApplications.filter(app => app.id !== applicationId);
      setAllApplications(updatedApplications);
      localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
      
      // Clear existing application if it's the one being deleted
      if (existingApplication && existingApplication.id === applicationId) {
        setExistingApplication(null);
      }
      
      // Clear document completion for this application
      const savedCompletion = localStorage.getItem('documentCompletion');
      if (savedCompletion) {
        try {
          const completion = JSON.parse(savedCompletion);
          if (completion[applicationId]) {
            delete completion[applicationId];
            localStorage.setItem('documentCompletion', JSON.stringify(completion));
          }
        } catch (error) {
          console.error('Error updating document completion:', error);
        }
      }
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 loan-details-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('loanDetails', 'loan')}</h2>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>{t('help')}:</strong> {t('loanDetailsHelp', 'loan')}
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('loanAmount', 'loan')} *
                </label>
                <input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder={t('loanAmountPlaceholder', 'loan') as string}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-900 placeholder-gray-600"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('tenure', 'loan')} *
                </label>
                <select
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-900"
                  required
                >
                  <option value="" className="text-gray-600">{t('selectTenure', 'loan')}</option>
                  <option value="1">{(t('months', 'loan') as unknown as string[])[0]}</option>
                  <option value="2">{(t('months', 'loan') as unknown as string[])[1]}</option>
                  <option value="3">{(t('months', 'loan') as unknown as string[])[2]}</option>
                  <option value="4">{(t('months', 'loan') as unknown as string[])[3]}</option>
                  <option value="5">{(t('months', 'loan') as unknown as string[])[4]}</option>
                  <option value="6">{(t('months', 'loan') as unknown as string[])[5]}</option>
                  <option value="7">{(t('months', 'loan') as unknown as string[])[6]}</option>
                  <option value="8">{(t('months', 'loan') as unknown as string[])[7]}</option>
                  <option value="9">{(t('months', 'loan') as unknown as string[])[8]}</option>
                  <option value="10">{(t('months', 'loan') as unknown as string[])[9]}</option>
                  <option value="11">{(t('months', 'loan') as unknown as string[])[10]}</option>
                  <option value="12">{(t('months', 'loan') as unknown as string[])[11]}</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4 consent-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('consent', 'loan')}</h2>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>Help:</strong> Please read the consent terms carefully before proceeding.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{t('consentText', 'loan')}</p>
            </div>
          </div>
        );
        
      case 3:
        if (isLoading) {
          return (
            <div className="space-y-4 fetching-info-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('fetchingInfo', 'loan')}</h2>
              <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                💡 <strong>Help:</strong> Please wait while we retrieve your information.
              </p>
              
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">{t('fetchingInfoText', 'loan')}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4 application-submitted-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('applicationSubmitted', 'loan')}</h2>
              <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                💡 <strong>Help:</strong> Your application has been submitted successfully.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">{t('applicationSubmittedText', 'loan')}</p>
                
                <div className="bg-white border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{t('applicationId')}:</span>
                      <p className="text-gray-900 font-mono mt-1">LOAN-{Date.now()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('status')}:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        KYC Done
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
      default:
        return null;
    }
  };

  const handleSignatureComplete = () => {
    // Update document completion status
    if (selectedApplication && documentCompletion) {
      const updatedCompletion = {
        ...documentCompletion,
        eSignature: {
          completed: true,
          completedAt: new Date().toISOString(),
          documentsSigned: ['Loan Agreement Contract']
        },
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const savedDocumentCompletion = localStorage.getItem('documentCompletion');
      let allDocumentCompletions: DocumentCompletion[] = [];
      
      if (savedDocumentCompletion) {
        try {
          allDocumentCompletions = JSON.parse(savedDocumentCompletion);
        } catch (error) {
          console.error('Error parsing existing document completion:', error);
        }
      }

      const existingIndex = allDocumentCompletions.findIndex(
        doc => doc.applicationId === selectedApplication.id
      );
      
      if (existingIndex >= 0) {
        allDocumentCompletions[existingIndex] = updatedCompletion;
      } else {
        allDocumentCompletions.push(updatedCompletion);
      }

      localStorage.setItem('documentCompletion', JSON.stringify(allDocumentCompletions));
      
      // Update local state
      setDocumentCompletion(updatedCompletion);
    }

    // Update application status to completed
    if (selectedApplication) {
      const savedApplications = localStorage.getItem('loanApplications');
      if (savedApplications) {
        try {
          const applications: LoanApplication[] = JSON.parse(savedApplications);
          const updatedApplications = applications.map(app => 
            app.id === selectedApplication.id 
              ? { ...app, status: 'completed' as const, updatedAt: new Date().toISOString() }
              : app
          );
          localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
          
          // Update local state
          setAllApplications(updatedApplications);
          setSelectedApplication(updatedApplications.find(app => app.id === selectedApplication.id) || null);
        } catch (error) {
          console.error('Error updating application status:', error);
        }
      }
    }

    // Return to document check page
    setShowESignature(false);

    // Simulate disbursement after 5 seconds
    setTimeout(() => {
      if (selectedApplication) {
        const savedApplications = localStorage.getItem('loanApplications');
        if (savedApplications) {
          try {
            const applications: LoanApplication[] = JSON.parse(savedApplications);
            const updatedApplications = applications.map(app => 
              app.id === selectedApplication.id 
                ? { ...app, status: 'disbursed' as const, updatedAt: new Date().toISOString() }
                : app
            );
            localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
            
            // Update local state
            setAllApplications(updatedApplications);
            setSelectedApplication(updatedApplications.find(app => app.id === selectedApplication.id) || null);
          } catch (error) {
            console.error('Error updating application status to disbursed:', error);
          }
        }
      }
    }, 5000); // 5 seconds delay
  };

  const completeMandate = () => {
    if (selectedApplication) {
      // Update application status in localStorage
      const savedApplications = localStorage.getItem('loanApplications');
      if (savedApplications) {
        try {
          const applications: LoanApplication[] = JSON.parse(savedApplications);
          const updatedApplications = applications.map(app => 
            app.id === selectedApplication.id 
              ? { ...app, status: 'mandate_completed' as const, updatedAt: new Date().toISOString() }
              : app
          );
          localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
          
          // Update local state
          setAllApplications(updatedApplications);
          setSelectedApplication(updatedApplications.find(app => app.id === selectedApplication.id) || null);
        } catch (error) {
          console.error('Error updating mandate status:', error);
        }
      }

      // Save detailed mandate completion data to localStorage
      const mandateCompletionData: DocumentCompletion = {
        applicationId: selectedApplication.id,
        enachMandate: {
          completed: true,
          completedAt: new Date().toISOString(),
          authenticationMode: 'Net Banking',
          bankDetails: {
            bankName: 'Canara Bank',
            accountName: 'D**** P*****',
            accountType: 'Savings',
            accountNumber: 'XXXX0643'
          }
        },
        eSignature: {
          completed: false,
          documentsSigned: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const savedDocumentCompletion = localStorage.getItem('documentCompletion');
      let allDocumentCompletions: DocumentCompletion[] = [];
      
      if (savedDocumentCompletion) {
        try {
          allDocumentCompletions = JSON.parse(savedDocumentCompletion);
        } catch (error) {
          console.error('Error parsing existing document completion:', error);
        }
      }

      // Update or add new completion data
      const existingIndex = allDocumentCompletions.findIndex(
        doc => doc.applicationId === selectedApplication.id
      );
      
      if (existingIndex >= 0) {
        allDocumentCompletions[existingIndex] = mandateCompletionData;
      } else {
        allDocumentCompletions.push(mandateCompletionData);
      }

      localStorage.setItem('documentCompletion', JSON.stringify(allDocumentCompletions));
      
      // Update local state
      setDocumentCompletion(mandateCompletionData);
      
      // Mark mandate as completed and return to document check
      setMandateCompleted(true);
      setShowMandateScreen(false);
      
      // Show success message briefly
      setTimeout(() => {
        setMandateCompleted(false);
      }, 3000);
    }
  };

  // If showing E-Signature page
  if (showESignature && selectedApplication) {
    return (
      <ESignaturePage
        applicationId={selectedApplication.id}
        onBack={() => setShowESignature(false)}
        onSignatureComplete={handleSignatureComplete}
      />
    );
  }

  // If showing loan terms screen
  if (showLoanTerms && selectedApplication) {
    return (
      <LoanTermsScreen
        applicationId={selectedApplication.id}
        loanAmount={selectedApplication.loanAmount}
        tenure={selectedApplication.tenure}
        onBack={() => setShowLoanTerms(false)}
        onAcceptTerms={handleTermsAcceptance}
      />
    );
  }

  // If showing disbursement details page
  if (showDisbursementDetails && selectedApplication) {
    return (
      <DisbursementDetailsPage
        applicationId={selectedApplication.id}
        loanAmount={selectedApplication.loanAmount}
        tenure={selectedApplication.tenure}
        status={selectedApplication.status}
        onBack={() => setShowDisbursementDetails(false)}
      />
    );
  }

  // If showing mandate screen
  if (showMandateScreen && selectedApplication) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Top Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-800">⚠️</span>
                  <span className="text-yellow-800 text-sm font-medium">Important: Please read all details carefully before proceeding</span>
                </div>
                <button
                  onClick={() => {
                    // Initialize and start mandate tour
                    const mandateTour = new Shepherd.Tour({
                      defaultStepOptions: {
                        cancelIcon: { enabled: true },
                        classes: 'shadow-md bg-purple-dark',
                        scrollTo: true
                      },
                      useModalOverlay: true
                    });

                    mandateTour.addStep({
                      id: 'welcome',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">${t('welcomeMandateSetup', 'loan')}</h3>
                          <p class="text-sm">${t('mandatePermissionExplain', 'loan')}</p>
                          <p class="text-sm mt-2"><strong>${t('mandateImportantPayback', 'loan')}</strong></p>
                        </div>
                      `,
                      buttons: [{ text: t('next') as string, action: () => mandateTour.next() }]
                    });

                    mandateTour.addStep({
                      id: 'mandate-details',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">${t('yourMandateDetails', 'loan')}</h3>
                          <p class="text-sm">${t('mandateDetailsHere', 'loan')}</p>
                          <ul class="text-sm text-left mt-2">
                            <li>• ${t('loanAmountEMIDetails', 'loan')}</li>
                            <li>• ${t('bankAccountInformation', 'loan')}</li>
                            <li>• ${t('paymentDeductionTiming', 'loan')}</li>
                          </ul>
                          <p class="text-sm mt-2"><strong>${t('checkDetailsCorrect', 'loan')}</strong></p>
                        </div>
                      `,
                      attachTo: { element: '.bg-white', on: 'bottom' },
                      buttons: [
                        { text: t('previous', 'services') as string, action: () => mandateTour.back() },
                        { text: t('next') as string, action: () => mandateTour.next() }
                      ]
                    });

                    mandateTour.addStep({
                      id: 'authentication',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">${t('authenticationMethod', 'loan')}</h3>
                          <p class="text-sm">${t('chooseVerifyMethod', 'loan')}</p>
                          <ul class="text-sm text-left mt-2">
                            <li>• ${t('netBankingOption', 'loan')}</li>
                            <li>• ${t('debitCardOption', 'loan')}</li>
                            <li>• ${t('aadhaarOption', 'loan')}</li>
                          </ul>
                          <p class="text-sm mt-2"><strong>${t('netBankingEasiest', 'loan')}</strong></p>
                        </div>
                      `,
                      attachTo: { element: '.bg-gray-50', on: 'bottom' },
                      buttons: [
                        { text: t('previous', 'services') as string, action: () => mandateTour.back() },
                        { text: t('next') as string, action: () => mandateTour.next() }
                      ]
                    });

                    mandateTour.addStep({
                      id: 'authorization',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">${t('importantAuthorization', 'loan')}</h3>
                          <p class="text-sm">${t('beforeProceedMust', 'loan')}</p>
                          <ul class="text-sm text-left mt-2">
                            <li>• ${t('mustCheckBoxBelow', 'loan')}</li>
                            <li>• ${t('agreeAutomaticPayments', 'loan')}</li>
                            <li>• ${t('understandTermsConditions', 'loan')}</li>
                            <li>• ${t('authorizeEMIDeduction', 'loan')}</li>
                          </ul>
                          <p class="text-sm mt-2"><strong>${t('checkWhenReady', 'loan')}</strong></p>
                        </div>
                      `,
                      attachTo: { element: '.bg-blue-50', on: 'bottom' },
                      buttons: [
                        { text: t('previous', 'services') as string, action: () => mandateTour.back() },
                        { text: t('finishTour', 'services') as string, action: () => mandateTour.complete() }
                      ]
                    });

                    mandateTour.start();
                  }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs"
                >
                  <span>🎯 Get Help</span>
                </button>
              </div>
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Authenticate Mandate</h1>
                <div className="mt-2 text-sm text-gray-500">
                  Application ID: <span className="font-mono">{selectedApplication.id}</span>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mandate Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date - End Date</label>
                  <p className="text-sm text-gray-900">25th Sep 2025 - 25th Sep 2028</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <p className="text-sm text-gray-900">As and When Presented</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Creditor Name</label>
                  <p className="text-sm text-gray-900">ADHI FINANCIAL AD...</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount</label>
                  <p className="text-sm text-green-600 font-semibold">₹ {selectedApplication.loanAmount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <p className="text-sm text-gray-900">Small value mandate</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utility Code</label>
                  <p className="text-sm text-gray-900 font-mono">NACH00000000057248</p>
                </div>
              </div>
            </div>
            
            {/* Bank Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">Bank Details</span>
                  <span className="text-gray-600">🏦</span>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-semibold text-lg">Canara Bank</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <p className="text-sm text-gray-900">D**** P*****</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <p className="text-sm text-gray-900">Savings</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <p className="text-sm text-gray-900">XXXX0643</p>
                </div>
              </div>
            </div>
            
            {/* Authentication Mode Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Authentication Mode</h2>
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
                <label htmlFor="authorization" className="text-sm text-gray-700 leading-relaxed">
                  I am authorising  AFA, to debit my account based on the instructions herein. I understand that the bank where I have authorised the debit may levy one time mandate processing charges as mentioned in the bank&apos;s latest schedule of charges. I understand that I am authorised to cancel / amend this mandate by appropriately communicating the cancellation/amendment request to the creditor or to the bank where I have authorised the mandate.
                </label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMandateScreen(false)}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftCircle className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button
                onClick={completeMandate}
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

  // If showing document check page
  if (showDocumentCheck && selectedApplication) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedApplication.status === 'mandate_completed' ? 'E-Signature & Agreement' : 'Mandate and agreement'}
                </h1>
                <p className="text-gray-600">
                  {selectedApplication.status === 'mandate_completed' 
                    ? 'Complete E-Signature to finalize your loan application' 
                    : 'Complete the following steps to proceed with your loan application'
                  }
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Application ID: <span className="font-mono">{selectedApplication.id}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Initialize and start document check tour
                    const docCheckTour = new Shepherd.Tour({
                      defaultStepOptions: {
                        cancelIcon: { enabled: true },
                        classes: 'shadow-md bg-purple-dark',
                        scrollTo: true
                      },
                      useModalOverlay: true
                    });

                    docCheckTour.addStep({
                      id: 'welcome',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">Welcome to Document Completion! 📋</h3>
                          <p class="text-sm">You need to complete two important steps to finish your loan application.</p>
                          <p class="text-sm mt-2"><strong>Let's go through each step together!</strong></p>
                        </div>
                      `,
                      buttons: [{ text: 'Next', action: () => docCheckTour.next() }]
                    });

                    docCheckTour.addStep({
                      id: 'mandate-card',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">Step 1: Enach Mandate 💳</h3>
                          <p class="text-sm">This is where you:</p>
                          <ul class="text-sm text-left mt-2">
                            <li>• Review your loan terms and conditions</li>
                            <li>• Set up automatic payment authorization</li>
                            <li>• Give permission for EMI deductions</li>
                          </ul>
                          <p class="text-sm mt-2"><strong>Click "Review Loan Terms" to start!</strong></p>
                        </div>
                      `,
                      attachTo: { element: '#enach-mandate-card', on: 'bottom' },
                      buttons: [
                        { text: 'Previous', action: () => docCheckTour.back() },
                        { text: 'Next', action: () => docCheckTour.next() }
                      ]
                    });

                    docCheckTour.addStep({
                      id: 'esignature-card',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">Step 2: E-Signature 📝</h3>
                          <p class="text-sm">After completing the mandate:</p>
                          <ul class="text-sm text-left mt-2">
                            <li>• You'll digitally sign your loan agreement</li>
                            <li>• Review the contract terms carefully</li>
                            <li>• Confirm your acceptance</li>
                          </ul>
                          <p class="text-sm mt-2"><strong>This step becomes available after mandate completion!</strong></p>
                        </div>
                      `,
                      attachTo: { element: '#esignature-card', on: 'bottom' },
                      buttons: [
                        { text: 'Previous', action: () => docCheckTour.back() },
                        { text: 'Next', action: () => docCheckTour.next() }
                      ]
                    });

                    docCheckTour.addStep({
                      id: 'progress',
                      text: `
                        <div class="text-center">
                          <h3 class="text-lg font-semibold mb-2">Track Your Progress 📊</h3>
                          <p class="text-sm">The progress bar shows:</p>
                          <ul class="text-sm text-left mt-2">
                            <li>• How many steps you've completed</li>
                            <li>• What's left to do</li>
                            <li>• Your overall completion status</li>
                          </ul>
                          <p class="text-sm mt-2"><strong>Complete both steps to finish your application!</strong></p>
                        </div>
                      `,
                      attachTo: { element: '#document-progress-section', on: 'bottom' },
                      buttons: [
                        { text: 'Previous', action: () => docCheckTour.back() },
                        { text: 'Finish Tour', action: () => docCheckTour.complete() }
                      ]
                    });

                    docCheckTour.start();
                  }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <span>🎯 Get Help</span>
                </button>
                <button
                  onClick={() => setShowDocumentCheck(false)}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <ArrowLeftCircle className="w-4 h-4" />
                  <span>Back to Applications</span>
                </button>
              </div>
            </div>
            
            {/* Document Check Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Enach Mandate Card */}
              <div id="enach-mandate-card" className={`border rounded-lg p-6 transition-shadow ${
                selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                  ? 'bg-emerald-50 border-emerald-200 cursor-default' 
                  : selectedApplication.status === 'mandate_completed' 
                  ? 'bg-green-50 border-green-200 cursor-default' 
                  : 'bg-blue-50 border-blue-200 hover:shadow-md cursor-pointer'
              }`}>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'bg-emerald-100' 
                      : selectedApplication.status === 'mandate_completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <span className="text-2xl">
                      {selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                        ? '🎉' 
                        : selectedApplication.status === 'mandate_completed' ? '✅' : '📋'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'text-emerald-900' 
                      : selectedApplication.status === 'mandate_completed' ? 'text-green-900' : 'text-blue-900'
                  }`}>
                    Enach Mandate
                  </h3>
                  <p className={`text-sm mb-4 ${
                    selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'All steps completed successfully!' 
                      : selectedApplication.status === 'mandate_completed' 
                      ? 'Mandate completed successfully' 
                      : 'Set up automatic payment authorization for your loan repayment'
                  }`}>
                  </p>
                  {selectedApplication.status !== 'mandate_completed' && selectedApplication.status !== 'completed' && (
                    <button 
                      onClick={openLoanTerms}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Review Loan Terms
                    </button>
                  )}
                  {selectedApplication.status === 'mandate_completed' && !documentCompletion?.eSignature.completed && (
                    <div className="text-green-600 text-sm font-medium">
                      ✓ Completed
                    </div>
                  )}
                  {selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed && (
                    <div className="text-emerald-600 text-sm font-medium">
                      🎉 All Steps Completed!
                    </div>
                  )}
                </div>
              </div>
              
              {/* ESignature Card */}
              <div id="esignature-card" className={`border rounded-lg p-6 transition-shadow ${
                selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                  ? 'bg-emerald-50 border-emerald-200 cursor-default' 
                  : selectedApplication.status === 'mandate_completed' 
                  ? 'bg-blue-50 border-blue-200 hover:shadow-md cursor-pointer' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'bg-emerald-100' 
                      : selectedApplication.status === 'mandate_completed' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <span className="text-2xl">
                      {selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                        ? '✅' 
                        : '✍️'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'text-emerald-900' 
                      : selectedApplication.status === 'mandate_completed' ? 'text-blue-900' : 'text-green-900'
                  }`}>
                    E-Signature
                  </h3>
                  <p className={`text-sm mb-4 ${
                    selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'text-emerald-700' 
                      : selectedApplication.status === 'mandate_completed' 
                      ? 'text-blue-700' 
                      : 'text-green-700'
                  }`}>
                    {selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed
                      ? 'Documents signed successfully' 
                      : selectedApplication.status === 'mandate_completed' 
                      ? 'Ready to sign your loan agreement and documents' 
                      : 'Digitally sign your loan agreement and related documents'
                    }
                  </p>
                  {selectedApplication.status === 'mandate_completed' && !documentCompletion?.eSignature.completed && (
                    <button 
                      onClick={openESignature}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Sign Documents Now
                    </button>
                  )}
                  {selectedApplication.status === 'mandate_completed' && documentCompletion?.eSignature.completed && (
                    <div className="text-emerald-600 text-sm font-medium">
                      ✓ Documents Signed
                    </div>
                  )}
                  {selectedApplication.status !== 'mandate_completed' && (
                    <div className="text-gray-500 text-sm">
                      Complete mandate first
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Success Message */}
            {mandateCompleted && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-green-800 font-medium">Enach Mandate Completed Successfully!</span>
                </div>
                <p className="text-sm text-green-700">
                  Your mandate has been processed and saved. You can now proceed with the E-Signature step.
                </p>
              </div>
            )}

            {/* Disbursement Notification */}
            {selectedApplication?.status === 'completed' && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-blue-600">💰</span>
                  <span className="text-blue-800 font-medium">Application Completed Successfully!</span>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Your loan application has been processed and approved. We will notify you once the money is disbursed to your account.
                </p>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <p className="text-xs text-blue-800 font-medium">
                    💡 <strong>Next Steps:</strong> Your loan amount of ₹{selectedApplication.loanAmount} will be disbursed within 2-3 working days.
                  </p>
                </div>
              </div>
            )}

            {/* Disbursed Status Message */}
            {selectedApplication?.status === 'disbursed' && (
              <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-teal-600">🎉</span>
                  <span className="text-teal-800 font-medium">Loan Disbursed Successfully!</span>
                </div>
                <p className="text-sm text-teal-700 mb-2">
                  Congratulations! Your loan amount has been disbursed to your registered bank account.
                </p>
                <div className="bg-teal-100 border border-teal-300 rounded-lg p-3">
                  <p className="text-xs text-teal-800 font-medium">
                    💳 <strong>Amount Disbursed:</strong> ₹{selectedApplication.loanAmount} | 
                    📅 <strong>First EMI:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
            
            {/* Document Completion Status */}
            {documentCompletion && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Document Completion Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Enach Mandate Status */}
                  <div className="bg-white border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900">Enach Mandate</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        documentCompletion.enachMandate.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {documentCompletion.enachMandate.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    {documentCompletion.enachMandate.completed && (
                      <div className="text-xs text-blue-700">
                        <p>Completed: {new Date(documentCompletion.enachMandate.completedAt!).toLocaleDateString()}</p>
                        <p>Mode: {documentCompletion.enachMandate.authenticationMode}</p>
                        <p>Bank: {documentCompletion.enachMandate.bankDetails.bankName}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* E-Signature Status */}
                  <div className="bg-white border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">E-Signature</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        documentCompletion.eSignature.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {documentCompletion.eSignature.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    {documentCompletion.eSignature.completed && (
                      <div className="text-xs text-green-700">
                        <p>Completed: {new Date(documentCompletion.eSignature.completedAt!).toLocaleDateString()}</p>
                        <p>Documents: {documentCompletion.eSignature.documentsSigned.length}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Progress Indicator */}
            <div id="document-progress-section" className="mt-8 bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Document Check Progress</span>
                <span>
                  {documentCompletion?.enachMandate.completed && documentCompletion?.eSignature.completed ? '2' : 
                   documentCompletion?.enachMandate.completed ? '1' : '0'} of 2 completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ 
                  width: documentCompletion?.enachMandate.completed && documentCompletion?.eSignature.completed ? '100%' :
                         documentCompletion?.enachMandate.completed ? '50%' : '0%' 
                }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {documentCompletion?.enachMandate.completed && documentCompletion?.eSignature.completed 
                  ? 'All steps completed! Your application is ready for processing.' 
                  : documentCompletion?.enachMandate.completed 
                  ? 'Enach Mandate completed. Complete E-Signature to finish.' 
                  : 'Complete both steps to proceed with your loan application'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render applications list if there are existing applications and we're not showing the form
  if (allApplications.length > 0 && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            {/* Back Button */}
            <div className="mb-4">
              <button
                onClick={goToServices}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <ArrowLeftCircle className="w-4 h-4" />
                <span>{t('backToServices')}</span>
              </button>
            </div>
            
            <div className="text-center">
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('title', 'loan')}</h1>
            <p className="text-gray-600 mb-4">{t('subtitle', 'loan')}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <button
                  onClick={startTour}
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
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            
            {/* Applications List */}
            <div className="space-y-4 mb-6">
              {allApplications.map((app) => (
                <div 
                  key={app.id} 
                  className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${
                    app.status === 'document_check' || app.status === 'mandate_completed' || app.status === 'disbursed' || app.status === 'closed' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
                  }`}
                  onClick={
                    app.status === 'document_check' || app.status === 'mandate_completed' ? () => openDocumentCheck(app) :
                    app.status === 'disbursed' || app.status === 'closed' ? () => {
                      setSelectedApplication(app);
                      openDisbursementDetails();
                    } : undefined
                  }
                >
                  <div className="space-y-4">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('applicationId')}</label>
                        <p className="text-sm text-gray-900 font-mono break-all">{app.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === 'kyc_done' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'document_check' ? 'bg-purple-100 text-purple-800' :
                          app.status === 'mandate_completed' ? 'bg-indigo-100 text-indigo-800' :
                          app.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'disbursed' ? 'bg-teal-100 text-teal-800' :
                          app.status === 'closed' ? 'bg-slate-100 text-slate-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status === 'kyc_done' ? 'KYC Done' :
                           app.status === 'pending' ? 'Pending' :
                           app.status === 'approved' ? 'Approved' :
                           app.status === 'document_check' ? 'Document Check' :
                           app.status === 'mandate_completed' ? 'Mandate Completed' :
                           app.status === 'completed' ? 'Completed' :
                           app.status === 'disbursed' ? 'Disbursed' :
                           app.status === 'closed' ? 'Closed' :
                           app.status === 'rejected' ? 'Rejected' :
                           app.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('loanAmount', 'loan')}</label>
                        <p className="text-sm text-gray-900 font-semibold">₹{app.loanAmount}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenure', 'loan')}</label>
                        <p className="text-sm text-gray-900">{app.tenure}</p>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
{t('createdOn')}: {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-xs font-medium text-gray-700 hidden sm:inline">{t('status')}:</label>
                          <select
                            value={app.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(app.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 font-medium flex-1 sm:flex-none"
                          >
                            <option value="kyc_done">KYC Done</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="document_check">Document Check</option>
                            <option value="mandate_completed">Mandate Completed</option>
                            <option value="completed">Completed</option>
                            <option value="disbursed">Disbursed</option>
                            <option value="closed">Closed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteApplication(app.id);
                          }}
                          className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium w-full sm:w-auto"
                          title={t('delete') as string}
                        >
                          🗑️ {t('delete')}
                        </button>
                      </div>
                    </div>

                    {/* Status Messages */}
                    {app.status === 'document_check' && (
                      <div className="mt-2 text-xs text-purple-600 font-medium">
                        💡 Click to complete document check
                      </div>
                    )}
                    {app.status === 'mandate_completed' && (
                      <div className="mt-2 text-xs text-indigo-600 font-medium">
                        💡 Click to proceed with E-Signature
                      </div>
                    )}
                    {app.status === 'completed' && (
                      <div className="mt-2 text-xs text-emerald-600 font-medium">
                        💰 Application completed! Disbursement in progress...
                      </div>
                    )}
                    {app.status === 'disbursed' && (
                      <div className="mt-2 text-xs text-teal-600 font-medium">
                        💰 Click to view EMI schedule
                      </div>
                    )}
                    {app.status === 'closed' && (
                      <div className="mt-2 text-xs text-slate-600 font-medium">
                        ✅ Click to view loan completion details
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Bottom Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col gap-3">
                <button
                  onClick={submitNewApplication}
                  disabled={existingApplication !== null}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium w-full ${
                    existingApplication !== null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>
{existingApplication !== null 
                      ? t('applicationInProgress', 'loan') 
                      : t('submitNewApplication', 'loan')
                    }
                  </span>
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
            
        {/* Help Message */}
        {existingApplication !== null && (
          <div className="mt-4 text-center max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>Note:</strong> You currently have an application with status &quot;{existingApplication.status === 'kyc_done' ? 'KYC Done' : existingApplication.status === 'pending' ? 'Pending' : 'Approved'}&quot; in progress. 
              You can submit a new application only after this one is completed or rejected.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Main form view when no applications exist or when showing the form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('newLoanTitle', 'loan')}</h1>
          <p className="text-gray-600">{t('newLoanSubtitle', 'loan')}</p>
          
          {/* Tour Controls */}
          <div className="mt-4 space-x-2">
            <button
              onClick={startTour}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              {t('getHelp')}
            </button>
            <button
              onClick={handleCallbackRequest}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              📞 {t('requestCallback')}
            </button>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md">
            {/* Progress Bar */}
            <div className="bg-gray-100 rounded-t-lg p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-6">
              {renderStep()}
              
              {currentStep < 3 && (
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('back')}</span>
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={!canProceed() || isLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      canProceed() && !isLoading
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{t('next')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
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
