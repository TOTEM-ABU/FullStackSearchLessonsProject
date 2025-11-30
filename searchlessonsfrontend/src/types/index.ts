// User Types
export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPER_ADMIN = "SUPER_ADMIN",
  CEO = "CEO",
}

export interface User extends Record<string, unknown> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  yearOfBirth: string;
  role: UserRoles;
  avatar: string;
  status: boolean;
  regionId?: string;
  Region?: Region;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  yearOfBirth: string;
  role: UserRoles;
  avatar: string;
  regionId: string;
}

// Backend login returns only tokens
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

// Register returns created user
export type RegisterResponse = User;

export interface VerifyOtpResponse {
  message: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

// Region Types
export interface Region {
  id: string;
  name: string;
  createdAt: string;
}

// Field Types
export interface Field {
  id: string;
  name: string;
  image: string;
  createdAt: string;
}

// Subject Types
export interface Subject extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  image: string;
  fieldId?: string;
  field?: Field;
  educationalCenters?: EducationalCenter[];
  createdAt: string;
}

// Educational Center Types
export interface EducationalCenter {
  id: string;
  name: string;
  image: string;
  address: string;
  phoneNumber: string;
  regionId?: string;
  userId?: string;
  averageStar?: number;
  Region?: Region;
  User?: User;
  fieldEdu?: FieldEdu[];
  subjectEdu?: SubjectEdu[];
  branches?: Branch[];
  comments?: CommentToEduCenter[];
  stars?: Star[];
  createdAt: string;
}

export interface FieldEdu {
  id: string;
  educationalCenterId?: string;
  fieldId?: string;
  Field?: Field;
  createdAt: string;
}

export interface SubjectEdu {
  id: string;
  educationalCenterId?: string;
  subjectId?: string;
  Subject?: Subject;
  createdAt: string;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  image: string;
  address: string;
  phoneNumber: string;
  regionId?: string;
  educationalCenterId?: string;
  userId?: string;
  Region?: Region;
  EducationalCenter?: EducationalCenter;
  User?: User;
  fieldBra?: FieldBra[];
  subjectBra?: SubjectBra[];
  reception?: Reception[];
  createdAt: string;
}

export interface FieldBra {
  id: string;
  fieldId?: string;
  branchId?: string;
  Field?: Field;
  createdAt: string;
}

export interface SubjectBra {
  id: string;
  subjectId?: string;
  branchId?: string;
  Subject?: Subject;
  createdAt: string;
}

// Resource Types
export interface ResourceCategory {
  id: string;
  name: string;
  image: string;
  userId?: string;
  User?: User;
  resources?: Resource[];
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  media: string;
  image: string;
  resourceCategoryId?: string;
  userId?: string;
  ResourceCategory?: ResourceCategory;
  User?: User;
  createdAt: string;
}

// Comment Types
export interface CommentToEduCenter {
  id: string;
  message: string;
  educationalCenterId?: string;
  userId?: string;
  EducationalCenter?: EducationalCenter;
  User?: User;
  createdAt: string;
}

// Star Types
export interface Star extends Record<string, unknown> {
  id: string;
  star: number;
  userId?: string;
  educationalCenterId?: string;
  User?: User;
  EducationalCenter?: EducationalCenter;
  createdAt: string;
}

// Reception Types
export interface Reception {
  id: string;
  branchId?: string;
  userId?: string;
  Branch?: Branch;
  User?: User;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search/Filter Types
export interface SearchFilters {
  name?: string;
  address?: string;
  phoneNumber?: string;
  regionId?: string;
  resourceCategoryId?: string;
  // User-specific filters
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRoles | string;
  status?: boolean;
  // Sorting and pagination
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Form Types
export interface CreateEducationalCenterRequest {
  name: string;
  image: string;
  address: string;
  phoneNumber: string;
  regionId?: string;
}

export interface CreateBranchRequest {
  name: string;
  image: string;
  address: string;
  phoneNumber: string;
  regionId?: string;
  educationalCenterId?: string;
}

export interface CreateResourceRequest {
  name: string;
  description: string;
  media: string;
  image: string;
  resourceCategoryId?: string;
}

export interface CreateResourceCategoryRequest {
  name: string;
  image: string;
}

export interface CreateCommentRequest {
  message: string;
  educationalCenterId: string;
}

export interface CreateStarRequest {
  star: number;
  educationalCenterId: string;
}
