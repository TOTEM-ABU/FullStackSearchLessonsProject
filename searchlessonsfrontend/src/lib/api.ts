import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - xatolarni boshqarish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Export all types directly
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "CEO";
  avatar: string;
  regionId?: string;
  region?: Region;
  status?: boolean;
  yearOfBirth?: string;
  createdAt?: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface EducationalCenter {
  id: string;
  name: string;
  image: string;
  address: string;
  phoneNumber: string;
  regionId?: string;
  region?: Region;
  averageStar?: number;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  image: string;
  address: string;
  phoneNumber: string;
  regionId?: string;
  region?: Region;
  educationalCenterId?: string;
  educationalCenter?: EducationalCenter;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  image: string;
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  image: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  media: string;
  image: string;
  resourceCategoryId?: string;
  resourceCategory?: ResourceCategory;
  createdAt: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  image: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  message: string;
  educationalCenterId: string;
  userId: string;
  user?: UserData;
  createdAt: string;
}

export interface Star {
  id: string;
  star: number;
  educationalCenterId: string;
  userId: string;
  createdAt: string;
}



// Auth API
export const authAPI = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    yearOfBirth: string;
    regionId?: string;
  }) => api.post("/users/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/users/login", data),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post("/users/verify-otp", data),

  resendOtp: (data: { email: string }) => api.post("/users/resend-otp", data),

  refreshToken: (data: { refreshToken: string }) =>
    api.post("/users/refresh-token", data),
};

// Educational Centers API
export const educationalCentersAPI = {
  getAll: (params?: {
    name?: string;
    address?: string;
    phoneNumber?: string;
    regionId?: string;
    sortBy?: "name" | "createdAt" | "phoneNumber";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => api.get("/educational-center", { params }),

  getById: (id: string) => api.get(`/educational-center/${id}`),
};

// Branches API
export const branchesAPI = {
  getAll: (params?: {
    name?: string;
    address?: string;
    phoneNumber?: string;
    regionId?: string;
    educationalCenterId?: string;
    sortBy?: "name" | "createdAt" | "phoneNumber";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => api.get("/branch", { params }),

  getById: (id: string) => api.get(`/branch/${id}`),
};

// Subjects API
export const subjectsAPI = {
  getAll: (params?: {
    name?: string;
    sort?: "asc" | "desc";
    sortBy?: "name" | "createdAt";
    page?: number;
    limit?: number;
  }) => api.get("/subject", { params }),

  getById: (id: string) => api.get(`/subject/${id}`),
};

// Fields API
export const fieldsAPI = {
  getAll: (params?: {
    name?: string;
    sort?: "asc" | "desc";
    sortBy?: "name" | "createdAt";
    page?: number;
    limit?: number;
  }) => api.get("/field", { params }),

  getById: (id: string) => api.get(`/field/${id}`),
};

// Resources API
export const resourcesAPI = {
  getAll: (params?: {
    name?: string;
    sort?: "asc" | "desc";
    sortBy?: "name" | "createdAt";
    page?: number;
    limit?: number;
  }) => api.get("/resource", { params }),

  getById: (id: string) => api.get(`/resource/${id}`),
};

// Comments API
export const commentsAPI = {
  create: (data: { message: string; educationalCenterId: string }) =>
    api.post("/comment", data),

  getByEducationalCenter: (educationalCenterId: string) =>
    api.get(`/comment/${educationalCenterId}`),
};

// Stars API
export const starsAPI = {
  create: (data: { star: number; educationalCenterId: string }) =>
    api.post("/star", data),

  getByEducationalCenter: (educationalCenterId: string) =>
    api.get(`/star/${educationalCenterId}`),
};

// Regions API
export const regionsAPI = {
  getAll: () => api.get("/region"),
};

// Export type aliases for better semantics
export type CommentType = Comment;
export type StarType = Star;

export default api;
