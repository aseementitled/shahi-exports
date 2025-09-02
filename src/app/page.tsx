'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if language is selected
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    
    if (selectedLanguage) {
      // Language is selected, check user registration status
      const userData = localStorage.getItem('userData');
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.isRegistered) {
            // User is registered, check KYC status
            const kycAvailability = localStorage.getItem('kycAvailability');
            if (kycAvailability) {
              const kyc = JSON.parse(kycAvailability);
              if (kyc.canProceed) {
                // KYC can proceed, redirect to services
                router.push('/services');
              } else {
                // KYC incomplete, redirect to services (with KYC nudge)
                router.push('/services');
              }
            } else {
              // No KYC data, redirect to services (with KYC nudge)
              router.push('/services');
            }
          } else {
            // User not registered, redirect to auth choice
            router.push('/auth/choice');
          }
        } catch (error) {
          // Error parsing user data, redirect to auth choice
          router.push('/auth/choice');
        }
      } else {
        // No user data, redirect to auth choice
        router.push('/auth/choice');
      }
    } else {
      // No language selected, redirect to language selection
      router.push('/language');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
