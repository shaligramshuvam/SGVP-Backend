import { ContainerModule } from 'inversify';
import {
  AuthService,
  UserService,
  PermissionService,
  ModuleService,
  DepartmentService,
  RoleService,
} from './';
import {
  type IAuthService,
  type IUserService,
  type IPermissionService,
  type IModuleService,
  type IDepartmentService,
  type IRoleService,
} from '@interfaces';
import { TYPES } from '@constants';
// Define a container module for services.
const serviceModule = new ContainerModule((bind) => {
  // Bind services to their respective interfaces.
  bind<IAuthService>(TYPES.AuthService).to(AuthService);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<IPermissionService>(TYPES.PermissionService).to(PermissionService);
  bind<IModuleService>(TYPES.ModuleService).to(ModuleService);
  bind<IDepartmentService>(TYPES.DepartmentService).to(DepartmentService);
  bind<IRoleService>(TYPES.RoleService).to(RoleService);
});
export default serviceModule;
