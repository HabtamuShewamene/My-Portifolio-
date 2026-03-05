import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export async function fetchProjects() {
  const { data } = await api.get('/projects');
  return data;
}

export async function sendContactMessage(payload) {
  const { data } = await api.post('/contact', payload);
  return data;
}

export async function sendChatMessage(message) {
  const { data } = await api.post('/chat', { message });
  return data;
}

