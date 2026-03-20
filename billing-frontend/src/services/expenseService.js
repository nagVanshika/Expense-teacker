import api from './api';

const expenseService = {
  getExpenses: async (params = {}) => {
    return api.get('/expenses', { params });
  },
  
  createExpense: async (expenseData) => {
    // If it's FormData (for file upload), axios handles it
    return api.post('/expenses', expenseData, {
      headers: {
        'Content-Type': expenseData instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });
  },

  getExpenseStats: async (params = {}) => {
    // params can include { period, dateFrom, dateTo }
    return api.get('/expenses/stats', { params });
  },

  getRegions: async () => {
    return api.get('/expenses/regions');
  },

  importExpenses: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/expenses/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default expenseService;
