import { API_BASE_URL } from './constants';

class APIClient {
  // Core request method
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        data = null; // In case response is not JSON
      }

      if (!response.ok) {
        // Include backend message if available
        const errorMsg = data?.detail || data?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Report APIs
  async generateReport(type) {
    const endpoint = type === 'all' 
      ? '/generate-all-reports' 
      : `/generate-report?type=${type}`;
    return this.request(endpoint);
  }

  async getLatestReport() {
    return this.request('/latest-report');
  }

  async downloadReport(filename) {
    window.open(`${API_BASE_URL}/download-report?filename=${filename}`, '_blank');
  }

  // Visualization APIs
  async getVisualizations() {
    return this.request('/visualizations');
  }

  async getEmailSettings() {
    return this.request('/settings/email');
  }

  async updateEmailSettings(settings) {
    return this.request('/settings/email', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async resetEmailSettings() {
    return this.request('/settings/email', {
      method: 'DELETE',
    });
  }

  // Future: Ask AI
  async askAI(question) {
    return this.request('/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // Dataset APIs
  async getDatasetOverview() {
    return this.request('/dataset/overview');
  }

  async getSalesData(limit = 10) {
    return this.request(`/dataset/sales?limit=${limit}`);
  }

  async getMarketingData(limit = 10) {
    return this.request(`/dataset/marketing?limit=${limit}`);
  }

  async getDatasetColumns() {
    return this.request('/dataset/columns');
  }

  // Email sending API
  async sendEmailManually(emailSettings) {
    return this.request('/email/send', {
      method: 'POST',
      body: JSON.stringify({
        recipient_email: emailSettings.recipient_email,
        user_name: emailSettings.user_name
      })
    });
  }

  async getTelegramSettings() {
    const res = await fetch(`${API_BASE_URL}/telegram/settings`);
    return res.json();
  }

  async saveTelegramSettings(payload) {
    const res = await fetch(`${API_BASE_URL}/telegram/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async sendTelegramManually(payload = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/telegram/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: Object.keys(payload).length ? JSON.stringify(payload) : null,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('API Error (sendTelegramManually):', error);
    return { ok: false, message: `Network error: ${error.message}` };
  }
}
}

export const api = new APIClient();
