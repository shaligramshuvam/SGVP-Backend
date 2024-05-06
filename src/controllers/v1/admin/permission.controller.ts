import { TYPES, statusCodes } from '@constants';
import { IPermissionService } from '@interfaces';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
@controller('/v1/admin/permission', TYPES.JwtMiddleware)
export class PermissionController {
  private readonly permissionService: IPermissionService;
  constructor(
    @inject(TYPES.PermissionService) _permissionService: IPermissionService
  ) {
    this.permissionService = _permissionService;
  }

  @httpGet('/getAllPermission')
  async getPermission(req: Request, res: Response) {
    try {
      const { adminTypeId } = req.body.jwtTokendata;
      const result =
        await this.permissionService.getAdminPermission(adminTypeId);
      res.status(statusCodes.success_status).json(result);
    } catch (error) {
      return res
        .status(statusCodes.badRequest_status)
        .json({ message: error.message, status: false });
    }
  }
}
