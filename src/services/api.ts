// Update this to your actual API URL - you can change this based on your environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; access_token: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Login failed' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async register(email: string, password: string, firstName: string, lastName: string, appName?: string): Promise<ApiResponse<{ user: any; access_token: string; application?: any }>> {
    try {
      const endpoint = appName 
        ? `${API_BASE_URL}/api/v1/users/register-with-app`
        : `${API_BASE_URL}/api/v1/users/register`;
      
      const body = appName 
        ? { email, password, first_name: firstName, last_name: lastName, app_name: appName }
        : { email, password, first_name: firstName, last_name: lastName };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Registration failed' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },
};

// Products API
export const productsApi = {
  async createProductWithKeywords(
    name: string, 
    description: string, 
    website: string, 
    businessDomain: string, 
    applicationId: string, 
    searchKeywords: string[],
    token: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/with-keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          website,
          business_domain: businessDomain,
          application_id: applicationId,
          search_keywords: searchKeywords,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to create product' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async getProductsByApplication(applicationId: string, token: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/application/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to fetch products' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },
};

// Search & Analytics API
export const searchApi = {
  async generateKeywordResults(keywordId: string, token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/search/keywords/${keywordId}/generate-results`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to generate results' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async getKeywordResults(keywordId: string, token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/search/keywords/${keywordId}/results`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to fetch keyword results' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async getSearchKeywordsByProduct(productId: string, token: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/search/keywords/product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to fetch keywords' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },
};

// Analytics API
export const analyticsApi = {
  async generateKeywordAnalytics(keywordId: string, date: string, token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics/keywords/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          keyword_id: keywordId,
          date,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to generate analytics' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async getKeywordAnalytics(keywordId: string, date: string, token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics/keywords/${keywordId}?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to fetch analytics' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async generateProductAnalytics(productId: string, date: string, token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics/products/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          date,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to generate product analytics' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },

  async getProductAnalytics(productId: string, date: string, token: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics/products/${productId}?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to fetch product analytics' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },
};

// Applications API
export const applicationsApi = {
  async getBusinessDomains(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/applications/business-domains`);
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to fetch business domains' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  },
};