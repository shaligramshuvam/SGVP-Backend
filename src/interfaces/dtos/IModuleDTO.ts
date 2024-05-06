// Interface for module data transfer object
export interface IModuleDto {
  id?: string; // Optional since it's used in updates
  moduleName: string; // Name of the module
  isSubModule: boolean;
  moduleId?: string;
  routesName: string[];
  sequence?: number;
}

// Interface for module query parameters data transfer object
export interface ModuleQueryParamsDTO {
  pageNum?: number; // Optional: page number for pagination
  pageLimit?: number; // Optional: limit of items per page for pagination
  search?: string; // Optional: search term
  module_name: string; // Name of the module
  jwtTokendata: any;
}
