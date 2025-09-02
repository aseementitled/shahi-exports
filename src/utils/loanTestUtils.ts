// Utility functions for testing loan status changes

export const createTestLoan = (status: 'pending' | 'approved' | 'disbursed' = 'approved') => {
  return {
    id: `LOAN-${Date.now()}`,
    amount: 50000,
    tenure: 12,
    status: status,
    appliedDate: new Date().toISOString(),
    disbursedDate: status === 'disbursed' ? new Date().toISOString() : null
  };
};

export const simulateLoanStatusChange = (newStatus: 'pending' | 'approved' | 'disbursed') => {
  const existingLoan = localStorage.getItem('loanApplication');
  if (existingLoan) {
    try {
      const loanData = JSON.parse(existingLoan);
      loanData.status = newStatus;
      if (newStatus === 'disbursed') {
        loanData.disbursedDate = new Date().toISOString();
      }
      localStorage.setItem('loanApplication', JSON.stringify(loanData));
      return loanData;
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  }
  return null;
};

export const clearLoanData = () => {
  localStorage.removeItem('loanApplication');
  localStorage.removeItem('loanProgress');
};

export const addTestLoan = () => {
  const testLoan = createTestLoan('approved');
  localStorage.setItem('loanApplication', JSON.stringify(testLoan));
  return testLoan;
};

// Test the automatic status change flow
export const testAutomaticStatusChanges = () => {
  console.log('Testing automatic loan status changes...');
  
  // Test 1: Application submission -> Approved
  console.log('Test 1: Application submission to approved...');
  const testLoan = createTestLoan('pending');
  localStorage.setItem('loanApplication', JSON.stringify(testLoan));
  console.log('Created test loan with pending status:', testLoan);
  
  // Simulate automatic approval after 20 seconds
  setTimeout(() => {
    const updatedLoan = simulateLoanStatusChange('approved');
    console.log('Loan automatically approved after 20 seconds:', updatedLoan);
  }, 20000);
  
  // Test 2: Agreement completion -> Disbursed (after 20 seconds)
  setTimeout(() => {
    console.log('Test 2: Agreement completion to disbursed...');
    const loanProgress = {
      currentStep: 'agreement',
      completedSteps: ['terms', 'enach'],
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('loanProgress', JSON.stringify(loanProgress));
    console.log('Loan progress set:', loanProgress);
    
    // Simulate automatic disbursement after 20 seconds
    setTimeout(() => {
      const disbursedLoan = simulateLoanStatusChange('disbursed');
      console.log('Loan automatically disbursed after 20 seconds:', disbursedLoan);
      
      // Verify the final status
      const savedLoan = localStorage.getItem('loanApplication');
      if (savedLoan) {
        const parsed = JSON.parse(savedLoan);
        console.log('Final loan status:', parsed.status);
        console.log('Disbursed date:', parsed.disbursedDate);
      }
    }, 20000);
  }, 5000);
};
