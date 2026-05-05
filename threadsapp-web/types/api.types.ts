export interface ApiErrorItem {
  field: string;
  message: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  errors?: ApiErrorItem[];
}

export interface SearchParamsBase {
  page?: number;
  limit?: number;
  sort?: string;
}
