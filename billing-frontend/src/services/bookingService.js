import api from './api';

const bookingService = {
  getCollections: async (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit };
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo)   params.dateTo   = filters.dateTo;
    if (filters.region)   params.region   = filters.region;
    if (filters.category) params.category = filters.category;
    if (filters.period)   params.period   = filters.period;
    return api.get('/bookings/collections', { params });
  },

  createCollection: async (collectionData) => {
    return api.post('/bookings/collections', collectionData);
  },
};

export default bookingService;

