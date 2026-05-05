export interface ApiErrorItem {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: ApiErrorItem[];
}

export interface PaginatedData<T> {
  items?: T[];
  data?: T[];
  [key: string]: unknown;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
