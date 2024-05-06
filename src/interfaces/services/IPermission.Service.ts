export interface IPermissionService {
  getAdminPermission: (adminTypeId: string) => Promise<any>;
}
