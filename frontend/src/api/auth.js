import client from './client';

export const registerApi = async (userData) => {
  const response = await client.post('/api/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await client.post('/api/auth/login', credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await client.get('/api/auth/me');
  return response.data;
};
