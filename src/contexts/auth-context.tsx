import React, { createContext, useContext, useState } from "react";
import {
  login as loginAPI,
  register as registerAPI,
  LoginResponse,
  RegisterRequest,
} from "@/apiHelpers";

/* =====================
   TYPES
   ===================== */
interface AuthContextType {
  user: LoginResponse["user"] | null;
  applicationId: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    appName?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* =====================
     LOGIN
     ===================== */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginAPI({ email, password });
      if (res.user && res.access_token) {
        setUser(res.user);
        localStorage.setItem("access_token", res.access_token);
        
        // Extract application_id from owned_applications
        if (res.user.owned_applications && res.user.owned_applications.length > 0) {
          const appId = res.user.owned_applications[0].id;
          setApplicationId(appId);
          localStorage.setItem("application_id", appId);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================
     REGISTER (auto-login after success)
     ===================== */
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    appName: string = "DefaultApp"
  ) => {
    setIsLoading(true);
    try {
      const payload: RegisterRequest = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        app_name: appName,
      };

      const response = await registerAPI(payload);
      
      // Registration response format: { user, application, access_token, refresh_token }
      if (response.user && response.access_token) {
        setUser(response.user);
        localStorage.setItem("access_token", response.access_token);
        
        if (response.refresh_token) {
          localStorage.setItem("refresh_token", response.refresh_token);
        }
        
        // Set application_id from registration response (application.id field)
        if (response.application?.id) {
          setApplicationId(response.application.id);
          localStorage.setItem("application_id", response.application.id);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================
     LOGOUT
     ===================== */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("application_id");
    setUser(null);
    setApplicationId(null);
  };

  return (
    <AuthContext.Provider value={{ user, applicationId, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* =====================
   HOOK
   ===================== */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};