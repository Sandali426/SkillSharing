import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const getLearningPlans = () => api.get('/learning-plans');

export default api;
