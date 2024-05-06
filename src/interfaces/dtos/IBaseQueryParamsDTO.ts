export interface IBaseQueryParamsDTO {
  pageNum?: number; // Page number for pagination
  pageLimit?: number; // Limit of items per page for pagination
  search?: string; // Optional search term
  sortField?: string;
  sortOrder?: string;
}
