import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authAPI, usersAPI } from "../services/api";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
} from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification: string | null; // email pending OTP verification
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isCEO: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context so it can be used in the useAuth hook
export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");
        const pendingEmail = localStorage.getItem("pending_verification");

        if (pendingEmail) {
          setPendingVerification(pendingEmail);
        }

        if (token) {
          setIsAuthenticated(true);
        }
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("pending_verification");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await authAPI.login(data);

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      setIsAuthenticated(true);
      // Keep existing user info if present (e.g., after register)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const createdUser: User = await authAPI.register(data);
      // Save user locally; OTP verification and login are separate steps
      setUser(createdUser);
      localStorage.setItem("user", JSON.stringify(createdUser));

      // Registration successful, but user needs to verify OTP
      setPendingVerification(data.email);
      localStorage.setItem("pending_verification", data.email);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      await authAPI.verifyOtp({ email, otp });

      // OTP verification successful
      localStorage.removeItem("pending_verification");
      setPendingVerification(null);

      // Now user can login
      // OTP verification successful, user can now proceed to login
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "OTP verification failed";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    try {
      setIsLoading(true);
      await authAPI.resendOtp({ email });
      // OTP resent successfully
    } catch (error: unknown) {
      console.error("Failed to resend OTP:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to resend OTP";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authAPI.updatePassword({ oldPassword, newPassword });
      // Password updated successfully
    } catch (error: unknown) {
      console.error("Password update failed:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Password update failed";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error("No user to update");

      setIsLoading(true);
      const updatedUser = await usersAPI.updateUser(user.id, userData);

      // Update local state
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error: unknown) {
      console.error("User update failed:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "User update failed";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("pending_verification");
    setUser(null);
    setIsAuthenticated(false);
    setPendingVerification(null);
  };

  // Role-based access helpers
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return hasRole(["ADMIN", "SUPER_ADMIN", "CEO"]);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole("SUPER_ADMIN");
  };

  const isCEO = (): boolean => {
    return hasRole("CEO");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        pendingVerification,
        login,
        register,
        verifyOtp,
        resendOtp,
        updatePassword,
        updateUser,
        logout,
        hasRole,
        isAdmin,
        isSuperAdmin,
        isCEO,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
