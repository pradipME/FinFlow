export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiMeta;
  error?: ApiError | null;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  message: string | null;
}

export interface ApiError {
  code: string;
  message: string;
  target?: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  first: boolean;
  last: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
}
