import { TYPES, statusCodes } from '@constants';
import { type IRoleQueryParamsDTO, type IRoleDTO } from '@dtos';
import { IRoleService } from '@interfaces';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';

@controller('/v1/admin/role', TYPES.LoggerMiddleware)
export class RoleController {
  private readonly roleService: IRoleService;
  constructor(@inject(TYPES.RoleService) _roleService: IRoleService) {
    this.roleService = _roleService;
  }

  @httpPost('/create-role')
  async createRole(req: Request, res: Response) {
    try {
      const role = await this.roleService.createRole(req.body as IRoleDTO);
      res.status(statusCodes.success_status).json(role);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpPut('/update-role/:id')
  async updateRole(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await this.roleService.updateRole(id, req.body as IRoleDTO);
      res.status(statusCodes.success_status).json(role);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpDelete('/delete-role/:id')
  async deleteRole(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await this.roleService.deleteRole(id);
      res.status(statusCodes.success_status).json(role);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpGet('/role-listing')
  async getRole(req: Request, res: Response) {
    try {
      const query: IRoleQueryParamsDTO = req.query;
      const role = await this.roleService.roleListing(query);
      res.status(statusCodes.success_status).json(role);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpGet('/role-listing/:id')
  async getRoleById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await this.roleService.roleListingById(id);
      res.status(statusCodes.success_status).json(role);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }
}
