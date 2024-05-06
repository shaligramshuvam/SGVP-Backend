// Interface for permission template data transfer object
export interface IPermissionTemplateDto {
  id?: any; // ID of the permission template
  permissionTemplateName: string; // Name of the permission template
  defaultType?: string; // Default type with enum [0, 1]
  permissions: any; // Permissions data (you can adjust the type accordingly)
}

// Interface for permission template query parameters data transfer object
export interface PermissionTemplateQueryParamsDTO {
  pageNum?: number; // Optional: page number for pagination
  pageLimit?: number; // Optional: limit of items per page for pagination
  search?: string; // Optional: search term
  permissionTemplateName: string; // Name of the permission template
}

export interface IPermissionsDTO {
  adminTypeId: string;
  moduleId: string;
  read: boolean;
  write: boolean;
}
