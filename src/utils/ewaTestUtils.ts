// Utility functions for testing EWA withdrawal logic

export const createTestWithdrawal = (amount: number, status: 'processing' | 'disbursed' | 'rejected' = 'processing') => {
  return {
    id: `WD${Date.now()}`,
    amount,
    status,
    requestedAt: new Date().toISOString(),
    processedAt: status !== 'processing' ? new Date().toISOString() : null
  };
};

export const simulateWithdrawalStatusChange = (withdrawalId: string, newStatus: 'disbursed' | 'rejected') => {
  const existingWithdrawals = JSON.parse(localStorage.getItem('ewaWithdrawals') || '[]');
  const updatedWithdrawals = existingWithdrawals.map((w: any) => 
    w.id === withdrawalId 
      ? { ...w, status: newStatus, processedAt: new Date().toISOString() }
      : w
  );
  localStorage.setItem('ewaWithdrawals', JSON.stringify(updatedWithdrawals));
  return updatedWithdrawals;
};

export const clearAllWithdrawals = () => {
  localStorage.removeItem('ewaWithdrawals');
};

export const addTestWithdrawals = () => {
  const testWithdrawals = [
    createTestWithdrawal(5000, 'disbursed'),
    createTestWithdrawal(3000, 'processing'),
    createTestWithdrawal(2000, 'rejected')
  ];
  localStorage.setItem('ewaWithdrawals', JSON.stringify(testWithdrawals));
  return testWithdrawals;
};
