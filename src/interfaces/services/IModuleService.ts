import { type IModuleDto } from '@dtos';

// Interface for the ModuleService
export interface IModuleService {
  // Create a new module
  createModule: (module: IModuleDto) => Promise<any>;

  // Get all modules
  getAllModules: (values: any) => Promise<any>;

  // Get a module by ID
  getModuleById: (id: string) => Promise<any>;

  // Update a module
  editModule: (module: IModuleDto) => Promise<any>;

  // Delete a module by ID
  deleteModule: (id: string) => Promise<any>;
}
