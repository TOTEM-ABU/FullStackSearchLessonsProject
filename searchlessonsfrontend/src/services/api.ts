import axios from "axios";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  Region,
  Field,
  Subject,
  EducationalCenter,
  Branch,
  Resource,
  ResourceCategory,
  CommentToEduCenter,
  Star,
  SearchFilters,
  PaginatedResponse,
  CreateEducationalCenterRequest,
  CreateBranchRequest,
  CreateResourceRequest,
  CreateResourceCategoryRequest,
  CreateCommentRequest,
  CreateStarRequest,
  // Auth response types
  LoginResponse,
} from "../types";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await api.post("/users/refresh-token", {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data as { access_token: string };
          localStorage.setItem("access_token", access_token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/users/login", data);
    return response.data;
  },

  // Register returns created user (no tokens)
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  verifyOtp: async (data: {
    email: string;
    otp: string;
  }): Promise<{ message: string }> => {
    const response = await api.post("/users/verify-otp", data);
    return response.data;
  },

  resendOtp: async (data: { email: string }): Promise<{ message: string }> => {
    const response = await api.post("/users/resend-otp", data);
    return response.data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ access_token: string }> => {
    const response = await api.post("/users/refresh-token", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  updatePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.patch("/users/update-password", data);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users", { params: filters });
    return response.data;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.post("/users", data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await api.patch(`/users/update/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Regions API
export const regionsAPI = {
  getRegions: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Region>> => {
    const response = await api.get("/region", { params: filters });
    return response.data;
  },

  getRegion: async (id: string): Promise<Region> => {
    const response = await api.get(`/region/${id}`);
    return response.data;
  },

  createRegion: async (data: { name: string }): Promise<Region> => {
    const response = await api.post("/region", data);
    return response.data;
  },

  updateRegion: async (id: string, data: { name: string }): Promise<Region> => {
    const response = await api.patch(`/region/${id}`, data);
    return response.data;
  },

  deleteRegion: async (id: string) => {
    const response = await api.delete(`/region/${id}`);
    return response.data;
  },
};

// Fields API
export const fieldsAPI = {
  getFields: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Field>> => {
    const response = await api.get("/field", { params: filters });
    return response.data;
  },

  getField: async (id: string): Promise<Field> => {
    const response = await api.get(`/field/${id}`);
    return response.data;
  },

  createField: async (data: {
    name: string;
    image: string;
  }): Promise<Field> => {
    const response = await api.post("/field", data);
    return response.data;
  },

  updateField: async (
    id: string,
    data: { name?: string; image?: string }
  ): Promise<Field> => {
    const response = await api.patch(`/field/${id}`, data);
    return response.data;
  },

  deleteField: async (id: string) => {
    const response = await api.delete(`/field/${id}`);
    return response.data;
  },
};

// Subjects API
export const subjectsAPI = {
  getSubjects: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Subject>> => {
    const response = await api.get("/subject", { params: filters });
    return response.data;
  },

  getSubject: async (id: string): Promise<Subject> => {
    const response = await api.get(`/subject/${id}`);
    return response.data;
  },

  createSubject: async (data: {
    name: string;
    image: string;
  }): Promise<Subject> => {
    const response = await api.post("/subject", data);
    return response.data;
  },

  updateSubject: async (
    id: string,
    data: { name?: string; image?: string }
  ): Promise<Subject> => {
    const response = await api.patch(`/subject/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: string) => {
    const response = await api.delete(`/subject/${id}`);
    return response.data;
  },
};

// Educational Centers API
export const educationalCentersAPI = {
  getCenters: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<EducationalCenter>> => {
    const response = await api.get("/educational-center", { params: filters });
    return response.data;
  },

  getCenter: async (id: string): Promise<EducationalCenter> => {
    const response = await api.get(`/educational-center/${id}`);
    return response.data;
  },

  createCenter: async (
    data: CreateEducationalCenterRequest
  ): Promise<EducationalCenter> => {
    const response = await api.post("/educational-center", data);
    return response.data;
  },

  updateCenter: async (
    id: string,
    data: Partial<CreateEducationalCenterRequest>
  ): Promise<EducationalCenter> => {
    const response = await api.patch(`/educational-center/${id}`, data);
    return response.data;
  },

  deleteCenter: async (id: string) => {
    const response = await api.delete(`/educational-center/${id}`);
    return response.data;
  },
};

// Branches API
export const branchesAPI = {
  getBranches: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Branch>> => {
    const response = await api.get("/branch", { params: filters });
    return response.data;
  },

  getBranch: async (id: string): Promise<Branch> => {
    const response = await api.get(`/branch/${id}`);
    return response.data;
  },

  createBranch: async (data: CreateBranchRequest): Promise<Branch> => {
    const response = await api.post("/branch", data);
    return response.data;
  },

  updateBranch: async (
    id: string,
    data: Partial<CreateBranchRequest>
  ): Promise<Branch> => {
    const response = await api.patch(`/branch/${id}`, data);
    return response.data;
  },

  deleteBranch: async (id: string) => {
    const response = await api.delete(`/branch/${id}`);
    return response.data;
  },
};

// Resource Categories API
export const resourceCategoriesAPI = {
  getCategories: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<ResourceCategory>> => {
    const response = await api.get("/resourcecategory", { params: filters });
    return response.data;
  },

  getCategory: async (id: string): Promise<ResourceCategory> => {
    const response = await api.get(`/resourcecategory/${id}`);
    return response.data;
  },

  createCategory: async (
    data: CreateResourceCategoryRequest
  ): Promise<ResourceCategory> => {
    const response = await api.post("/resourcecategory", data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: Partial<CreateResourceCategoryRequest>
  ): Promise<ResourceCategory> => {
    const response = await api.patch(`/resourcecategory/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/resourcecategory/${id}`);
    return response.data;
  },
};

// Resources API
export const resourcesAPI = {
  getResources: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get("/resource", { params: filters });
    return response.data;
  },

  getResource: async (id: string): Promise<Resource> => {
    const response = await api.get(`/resource/${id}`);
    return response.data;
  },

  createResource: async (data: CreateResourceRequest): Promise<Resource> => {
    const response = await api.post("/resource", data);
    return response.data;
  },

  updateResource: async (
    id: string,
    data: Partial<CreateResourceRequest>
  ): Promise<Resource> => {
    const response = await api.patch(`/resource/${id}`, data);
    return response.data;
  },

  deleteResource: async (id: string) => {
    const response = await api.delete(`/resource/${id}`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getComments: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<CommentToEduCenter>> => {
    const response = await api.get("/comment", { params: filters });
    return response.data;
  },

  createComment: async (
    data: CreateCommentRequest
  ): Promise<CommentToEduCenter> => {
    const response = await api.post("/comment", data);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await api.delete(`/comment/${id}`);
    return response.data;
  },
};

// Stars API
export const starsAPI = {
  getStars: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Star>> => {
    const response = await api.get("/star", { params: filters });
    return response.data;
  },

  createStar: async (data: CreateStarRequest): Promise<Star> => {
    const response = await api.post("/star", data);
    return response.data;
  },

  deleteStar: async (id: string) => {
    const response = await api.delete(`/star/${id}`);
    return response.data;
  },
};

// File Upload API
export const fileAPI = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
