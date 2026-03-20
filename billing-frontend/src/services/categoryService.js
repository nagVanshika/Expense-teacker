import api from './api';

const categoryService = {
  getCategories: async (status = 'all', type = 'all') => {
    return api.get('/categories', { params: { status, type } });
  },

  createCategory: async ({ name, description, type }) => {
    return api.post('/categories', { name, description, type });
  },

  updateCategory: async (id, { name, description, type }) => {
    return api.put(`/categories/${id}`, { name, description, type });
  },

  deleteCategory: async (id) => {
    return api.delete(`/categories/${id}`);
  }
};

export default categoryService;
