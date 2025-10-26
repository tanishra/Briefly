import { API_BASE_URL } from './constants';

class APIClient {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
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

  async sendEmailManually() {
  return this.request('/email/send', {
    method: 'POST',
  });}
}

export const api = new APIClient();