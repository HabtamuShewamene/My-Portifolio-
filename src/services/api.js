const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_TIMEOUT_MS = 30000;

function buildUrl(path, params = {}) {
  const isAbsoluteBase = /^https?:\/\//i.test(API_BASE_URL);
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  if (isAbsoluteBase) return url.toString();
  return `${url.pathname}${url.search}`;
}

async function parseJsonSafely(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    data,
    params,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    credentials = 'omit',
    headers = {},
  } = options;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const hasBody = data !== undefined;
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (hasBody) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      credentials,
      headers: requestHeaders,
      body: hasBody ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });

    const payload = await parseJsonSafely(response);

    if (!response.ok) {
      const message = payload?.error || payload?.message || `Request failed with status ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error?.message?.includes('Failed to fetch')) {
      throw new Error('Browser connection failed - check backend port/proxy and browser console');
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function sendContactMessage(formData) {
  const payload = {
    name: String(formData?.name || '').trim(),
    email: String(formData?.email || '').trim(),
    message: String(formData?.message || '').trim(),
  };

  const data = await request('/contact', {
    method: 'POST',
    data: payload,
    credentials: 'omit',
  });

  if (data?.success === false) {
    throw new Error(data?.error || data?.message || 'Message could not be processed.');
  }

  return data;
}

export async function testBackendConnection() {
  return request('/test');
}

export async function fetchProjects(params = {}) {
  const data = await request('/projects', { params });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function fetchProjectById(id) {
  const data = await request(`/projects/${id}`);
  return data?.data || null;
}

export async function sendChatMessage(message, sessionId = '') {
  return request('/chat', {
    method: 'POST',
    data: { message, sessionId },
  });
}

export async function fetchStats() {
  const data = await request('/stats');
  return data?.data || null;
}

export async function fetchVisitorSnapshot() {
  const data = await request('/visitor');
  return data?.data || null;
}

export async function trackResumeDownloadEvent(payload = {}) {
  const data = await request('/resume/track', {
    method: 'POST',
    data: {
      format: String(payload.format || '').toLowerCase(),
      placement: String(payload.placement || 'unknown').toLowerCase(),
      source: String(payload.source || 'unknown').toLowerCase(),
    },
  });
  return data?.data || null;
}

export async function fetchResumeStats() {
  const data = await request('/resume/stats');
  return data?.data || null;
}
