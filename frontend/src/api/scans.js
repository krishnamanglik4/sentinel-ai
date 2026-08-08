import client from './client';

export const scanImageApi = async (formData) => {
  const response = await client.post('/api/analyze/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const scanUrlApi = async (url) => {
  const response = await client.post('/api/analyze/url', { url });
  return response.data;
};

export const scanTextApi = async (message) => {
  const response = await client.post('/api/analyze/text', { message });
  return response.data;
};

export const scanAudioApi = async (formData) => {
  const response = await client.post('/api/analyze/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const scanVideoApi = async (formData) => {
  const response = await client.post('/api/analyze/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getScansApi = async (params = {}) => {
  const response = await client.get('/api/scans', { params });
  return response.data;
};

export const getScanDetailApi = async (scanId) => {
  const response = await client.get(`/api/scans/${scanId}`);
  return response.data;
};

export const getDashboardStatsApi = async () => {
  const response = await client.get('/api/scans/stats');
  return response.data;
};

export const deleteScanApi = async (scanId) => {
  const response = await client.delete(`/api/scans/${scanId}`);
  return response.data;
};
