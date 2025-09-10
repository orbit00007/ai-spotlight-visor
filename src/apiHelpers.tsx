// src/apiHelpers.tsx
import axios, { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "./api";

/* =====================
   TYPES
   ===================== */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    owned_applications?: { id: string; company_name: string; project_token: string }[];
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  app_name: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  application: {
    id: string;
    user_id: string;
    company_name: string;
    project_token: string;
  };
  access_token: string;
  refresh_token: string;
}

/* flexible product payloads supported */
export interface ProductPayload {
  name: string;
  description: string;
  website: string;
  business_domain: string;   // ✅ snake_case
  application_id: string;    // ✅ snake_case
  search_keywords: string[]; // ✅ snake_case
} 

/* =====================
   AXIOS CONFIG
   ===================== */
const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.headers) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

/* =====================
   AUTH HELPERS
   ===================== */
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res: AxiosResponse<LoginResponse> = await API.post(API_ENDPOINTS.login, payload);

  if (res.data.access_token) {
    localStorage.setItem("access_token", res.data.access_token);

    // store first owned application id if present
    const appId = res.data.user?.owned_applications?.[0]?.id;
    if (appId) {
      localStorage.setItem("application_id", appId);
    }
  }

  return res.data;
};

export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const res: AxiosResponse<RegisterResponse> = await API.post(API_ENDPOINTS.register, payload);

  if (res.data.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
  }
  if (res.data.application?.id) {
    localStorage.setItem("application_id", res.data.application.id);
  }

  return res.data;
};

/* =====================
   PRODUCT HELPERS
   ===================== */

/**
 * createProductWithKeywords
 * Accepts either:
 *  - { brand, search_keywords, application_id? }  OR
 *  - full backend-shaped object { name, description, website, business_domain, application_id, search_keywords }
 *
 * Returns backend response.
 */
export const createProductWithKeywords = async (payload: ProductPayload): Promise<any> => {
  const appId = (payload as any).application_id || localStorage.getItem("application_id") || "";

  // If caller provided `brand`, map to backend fields.
  if ((payload as any).brand) {
    const brandTrimmed = (payload as any).brand.trim();
    const body = {
      name: brandTrimmed,
      description: brandTrimmed,
      website: brandTrimmed,
      business_domain: brandTrimmed,
      application_id: appId,
      search_keywords: (payload as any).search_keywords?.filter((k: string) => k.trim() !== "") || [],
    };

    const res = await API.post(API_ENDPOINTS.createProductWithKeywords, body);
    return res.data;
  }

  // Otherwise assume payload already has backend fields (defensive copy)
  const {
    name,
    description,
    website,
    business_domain,
    search_keywords,
  } = payload as any;

  const body = {
    name,
    description,
    website,
    business_domain,
    application_id: appId,
    search_keywords: (search_keywords || []).filter((k: string) => k.trim() !== ""),
  };

  const res = await API.post(API_ENDPOINTS.createProductWithKeywords, body);
  return res.data;
};

/* backward-compatible alias — your InputPage can keep importing fetchProductsWithKeywords */
export const fetchProductsWithKeywords = async (
  payload: ProductPayload
): Promise<any> => {
  const res = await API.post(API_ENDPOINTS.createProductWithKeywords, payload);
  return res.data;
};

/* =====================
   ANALYTICS HELPERS
   ===================== */
export const getProductAnalytics = async (productId: string, date: string, accessToken: string): Promise<any> => {
  const res = await API.get(API_ENDPOINTS.getProductAnalytics(productId, date), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getKeywordAnalytics = async (keywordId: string, date: string, accessToken: string): Promise<any> => {
  const res = await API.get(API_ENDPOINTS.getKeywordAnalytics(keywordId, date), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
