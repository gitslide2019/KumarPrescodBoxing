/**
 * API Response Types and Interfaces
 * Standardized types for all API communications
 */

import type {
  ID,
  Timestamp,
  User,
  Fight,
  Media,
  Product,
  Sponsor,
  Donation,
  FundingGoal,
  CommunityEvent,
  BlogPost,
  TrainingPhase,
  MetricData,
  Achievement,
} from './index';

// Base API Response Structure
export interface BaseApiResponse {
  success: boolean;
  timestamp: Timestamp;
  requestId?: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data: T;
  meta?: ResponseMeta;
}

export interface ApiErrorResponse extends BaseApiResponse {
  error: ApiError;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  filters?: FilterMeta;
  sorting?: SortMeta;
  total?: number;
  cached?: boolean;
  cacheExpiry?: Timestamp;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage?: number;
  previousPage?: number;
}

export interface FilterMeta {
  applied: Record<string, any>;
  available: FilterOption[];
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  options?: { value: any; label: string }[];
}

export interface SortMeta {
  field: string;
  direction: 'asc' | 'desc';
  available: SortOption[];
}

export interface SortOption {
  field: string;
  label: string;
  default?: boolean;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string; // For validation errors
  stack?: string; // Only in development
}

export interface ValidationError extends ApiError {
  field: string;
  value?: any;
  constraint: string;
}

// Request Types
export interface PaginationRequest {
  page?: number;
  pageSize?: number;
  limit?: number; // Alternative to pageSize
  offset?: number; // Alternative to page
}

export interface SortRequest {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterRequest {
  filters?: Record<string, any>;
  search?: string;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
}

export interface BaseListRequest extends PaginationRequest, SortRequest, FilterRequest {}

// User API Types
export interface UserResponse extends ApiResponse<User> {}
export interface UsersResponse extends ApiResponse<User[]> {}

export interface CreateUserRequest {
  email: string;
  name: string;
  role?: string;
  membershipTier?: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: string;
  membershipTier?: string;
  preferences?: Partial<User['preferences']>;
}

export interface UserListRequest extends BaseListRequest {
  role?: string;
  membershipTier?: string;
  active?: boolean;
}

// Fight API Types
export interface FightResponse extends ApiResponse<Fight> {}
export interface FightsResponse extends ApiResponse<Fight[]> {}

export interface CreateFightRequest {
  title: string;
  date: Timestamp;
  time: string;
  location: string;
  venue: string;
  opponent: {
    name: string;
    record: string;
    nickname?: string;
    image?: string;
  };
  description?: string;
  weightClass?: string;
  rounds?: number;
}

export interface UpdateFightRequest {
  title?: string;
  date?: Timestamp;
  time?: string;
  location?: string;
  venue?: string;
  description?: string;
  status?: string;
  result?: {
    outcome: string;
    method: string;
    round?: number;
    time?: string;
    notes?: string;
  };
}

export interface FightListRequest extends BaseListRequest {
  status?: string;
  year?: number;
  upcoming?: boolean;
}

// Media API Types
export interface MediaResponse extends ApiResponse<Media> {}
export interface MediaListResponse extends ApiResponse<Media[]> {}

export interface CreateMediaRequest {
  type: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  memberOnly?: boolean;
}

export interface UpdateMediaRequest {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  memberOnly?: boolean;
}

export interface MediaListRequest extends BaseListRequest {
  type?: string;
  category?: string;
  featured?: boolean;
  memberOnly?: boolean;
  tags?: string[];
}

export interface MediaUploadRequest {
  file: File;
  metadata: CreateMediaRequest;
}

export interface MediaUploadResponse extends ApiResponse<{
  media: Media;
  uploadUrl?: string;
}> {}

// Product API Types
export interface ProductResponse extends ApiResponse<Product> {}
export interface ProductsResponse extends ApiResponse<Product[]> {}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  sku: string;
  images?: string[];
  tags?: string[];
  featured?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  inventory?: number;
  status?: string;
  featured?: boolean;
  tags?: string[];
}

export interface ProductListRequest extends BaseListRequest {
  category?: string;
  status?: string;
  featured?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
}

// Sponsor API Types
export interface SponsorResponse extends ApiResponse<Sponsor> {}
export interface SponsorsResponse extends ApiResponse<Sponsor[]> {}

export interface CreateSponsorRequest {
  name: string;
  tier: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  description?: string;
  benefits: string[];
  contactInfo: {
    email: string;
    phone?: string;
    contactPerson?: string;
  };
}

export interface UpdateSponsorRequest {
  name?: string;
  tier?: string;
  status?: string;
  endDate?: Timestamp;
  description?: string;
  benefits?: string[];
}

export interface SponsorListRequest extends BaseListRequest {
  tier?: string;
  status?: string;
  active?: boolean;
}

// Donation API Types
export interface DonationResponse extends ApiResponse<Donation> {}
export interface DonationsResponse extends ApiResponse<Donation[]> {}

export interface CreateDonationRequest {
  amount: number;
  goalId?: ID;
  anonymous?: boolean;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  paymentMethod: string;
}

export interface DonationListRequest extends BaseListRequest {
  goalId?: ID;
  status?: string;
  anonymous?: boolean;
  amountRange?: {
    min: number;
    max: number;
  };
}

// Funding Goal API Types
export interface FundingGoalResponse extends ApiResponse<FundingGoal> {}
export interface FundingGoalsResponse extends ApiResponse<FundingGoal[]> {}

export interface CreateFundingGoalRequest {
  title: string;
  description: string;
  targetAmount: number;
  startDate: Timestamp;
  endDate: Timestamp;
  category: string;
}

export interface UpdateFundingGoalRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  endDate?: Timestamp;
  status?: string;
}

export interface FundingGoalListRequest extends BaseListRequest {
  status?: string;
  category?: string;
  active?: boolean;
}

// Community Event API Types
export interface CommunityEventResponse extends ApiResponse<CommunityEvent> {}
export interface CommunityEventsResponse extends ApiResponse<CommunityEvent[]> {}

export interface CreateCommunityEventRequest {
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  capacity?: number;
  price?: number;
  category: string;
  organizer: string;
  requirements?: string[];
}

export interface UpdateCommunityEventRequest {
  title?: string;
  description?: string;
  date?: Timestamp;
  location?: string;
  capacity?: number;
  price?: number;
  status?: string;
}

export interface CommunityEventListRequest extends BaseListRequest {
  category?: string;
  status?: string;
  upcoming?: boolean;
  free?: boolean;
}

// Blog API Types
export interface BlogPostResponse extends ApiResponse<BlogPost> {}
export interface BlogPostsResponse extends ApiResponse<BlogPost[]> {}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status?: string;
  tags?: string[];
  category: string;
  featuredImage?: string;
}

export interface UpdateBlogPostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: string;
  tags?: string[];
  category?: string;
  featuredImage?: string;
}

export interface BlogPostListRequest extends BaseListRequest {
  status?: string;
  category?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

// Training Progress API Types
export interface TrainingPhaseResponse extends ApiResponse<TrainingPhase> {}
export interface TrainingPhasesResponse extends ApiResponse<TrainingPhase[]> {}

export interface CreateTrainingPhaseRequest {
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  description: string;
  focus: string[];
  coach: string;
  location: string;
}

export interface UpdateTrainingPhaseRequest {
  title?: string;
  endDate?: Timestamp;
  description?: string;
  focus?: string[];
  coach?: string;
  location?: string;
  isActive?: boolean;
}

export interface TrainingPhaseListRequest extends BaseListRequest {
  active?: boolean;
  coach?: string;
  focus?: string[];
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
}

export interface MetricDataResponse extends ApiResponse<MetricData> {}
export interface MetricDataListResponse extends ApiResponse<MetricData[]> {}

export interface CreateMetricDataRequest {
  name: string;
  value: number;
  unit: string;
  date: Timestamp;
  category: string;
  notes?: string;
  baseline?: number;
  target?: number;
}

export interface UpdateMetricDataRequest {
  value?: number;
  notes?: string;
  target?: number;
}

export interface MetricDataListRequest extends BaseListRequest {
  category?: string;
  phaseId?: ID;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  metricName?: string;
}

export interface AchievementResponse extends ApiResponse<Achievement> {}
export interface AchievementsResponse extends ApiResponse<Achievement[]> {}

export interface CreateAchievementRequest {
  title: string;
  description: string;
  date: Timestamp;
  category: string;
  significance: string;
  mediaIds?: ID[];
  isHighlighted?: boolean;
}

export interface UpdateAchievementRequest {
  title?: string;
  description?: string;
  significance?: string;
  isHighlighted?: boolean;
  mediaIds?: ID[];
}

export interface AchievementListRequest extends BaseListRequest {
  category?: string;
  highlighted?: boolean;
  phaseId?: ID;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
}

// Analytics API Types
export interface AnalyticsDataResponse extends ApiResponse<{
  metrics: Record<string, number>;
  trends: Record<string, number[]>;
  comparisons: Record<string, { current: number; previous: number; change: number }>;
}> {}

export interface AnalyticsRequest {
  metrics: string[];
  dateRange: {
    start: Timestamp;
    end: Timestamp;
  };
  granularity?: 'hour' | 'day' | 'week' | 'month';
  filters?: Record<string, any>;
}

// Search API Types
export interface SearchResponse extends ApiResponse<{
  results: SearchResult[];
  suggestions: string[];
  facets: Record<string, SearchFacet[]>;
}> {}

export interface SearchResult {
  id: ID;
  type: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  relevance: number;
  highlights?: Record<string, string[]>;
}

export interface SearchFacet {
  value: string;
  count: number;
  selected?: boolean;
}

export interface SearchRequest {
  query: string;
  types?: string[];
  filters?: Record<string, any>;
  facets?: string[];
  page?: number;
  pageSize?: number;
}

// Batch Operations
export interface BatchRequest<T> {
  operations: BatchOperation<T>[];
}

export interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete';
  id?: ID;
  data?: T;
}

export interface BatchResponse<T> extends ApiResponse<BatchResult<T>[]> {}

export interface BatchResult<T> {
  operation: string;
  id?: ID;
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Health Check
export interface HealthCheckResponse extends ApiResponse<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, ServiceHealth>;
  timestamp: Timestamp;
  version: string;
}> {}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: Timestamp;
  error?: string;
}

// Type Guards for API Responses
export const isApiResponse = <T>(obj: any): obj is ApiResponse<T> => {
  return obj && typeof obj.success === 'boolean' && obj.data !== undefined;
};

export const isApiErrorResponse = (obj: any): obj is ApiErrorResponse => {
  return obj && typeof obj.success === 'boolean' && obj.error !== undefined;
};

export const hasValidationErrors = (error: ApiError): error is ValidationError => {
  return error.code === 'VALIDATION_ERROR' && typeof error.field === 'string';
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Error Codes
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INVALID_REQUEST: 'INVALID_REQUEST',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
} as const;