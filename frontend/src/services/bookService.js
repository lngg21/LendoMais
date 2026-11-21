import axios from 'axios';

// Prioriza import.meta.env.VITE_API_URL com suporte a variações de nomenclatura e fallback local
const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_URL_API ||
  import.meta.env.VITE_BACKEND_URL;

const getBaseUrl = () => {
  if (!rawApiUrl) {
    return 'http://localhost:3001/api';
  }
  const cleanUrl = rawApiUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

export const bookService = {
  async getAll() {
    const response = await api.get('/books');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async create(bookData) {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  async update(id, bookData) {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  async remove(id) {
    await api.delete(`/books/${id}`);
  },
};


