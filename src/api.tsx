export const BASE_URL = "http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
  // Auth
  login: `${BASE_URL}/users/login`,
  register: `${BASE_URL}/users/register-with-app`,

  // Products
  createProductWithKeywords: `${BASE_URL}/products/with-keywords`,

  // Analytics
  getKeywordAnalytics: (keywordId: string, date: string) =>
    `${BASE_URL}/analytics/keywords/${keywordId}?date=${date}`,

  getProductAnalytics: (productId: string, date: string) =>
    `${BASE_URL}/analytics/products/${productId}?date=${date}`,

  // Product by Application ID
  getProductsByApplication: (applicationId: string) =>
    `${BASE_URL}/products/application/${applicationId}`
};
