import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { authAPI } from "../lib/api";
import type { UserData } from "../lib/api";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    yearOfBirth: string;
    regionId?: string;
  }) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("accessToken");
    if (token) {
      // For now, we'll just check if token exists
      // In a real app, you'd validate the token with the backend
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, refresh_token } = response.data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Since backend doesn't return user data with login, we'll set a basic user object
      // In a real app, you'd want to add a profile endpoint to the backend
      setUser({
        id: "",
        firstName: "",
        lastName: "",
        email,
        role: "USER",
        phoneNumber: "",
        avatar: "",
        status: true,
             } as UserData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    yearOfBirth: string;
    regionId?: string;
  }) => {
    try {
      await authAPI.register(userData);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await authAPI.verifyOtp({ email, otp });
      // OTP verification only returns a message, not tokens
      // User needs to login after verification
      return response.data;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      await authAPI.resendOtp({ email });
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
