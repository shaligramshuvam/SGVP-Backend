import { TYPES, statusCodes } from '@constants';
import { type IDepartmentQueryParamsDTO, type IDepartmentDTO } from '@dtos';
import { IDepartmentService } from '@interfaces';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';

@controller('/v1/admin/department', TYPES.LoggerMiddleware)
export class DepartmentController {
  private readonly departmentService: IDepartmentService;
  constructor(
    @inject(TYPES.DepartmentService) _departmentService: IDepartmentService
  ) {
    this.departmentService = _departmentService;
  }

  @httpPost('/createDepartment')
  async createDepartment(req: Request, res: Response) {
    try {
      const department = await this.departmentService.createDepartment(
        req.body as IDepartmentDTO
      );
      res.status(statusCodes.success_status).json(department);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpPut('/update-department/:id')
  async updateDepartment(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const department = await this.departmentService.updateDepartment(
        id,
        req.body as IDepartmentDTO
      );
      res.status(statusCodes.success_status).json(department);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpDelete('/delete-department/:id')
  async deleteDepartment(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const department = await this.departmentService.deleteDepartment(id);
      res.status(statusCodes.success_status).json(department);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpGet('/department-listing')
  async departmentListing(req: Request, res: Response) {
    try {
      const query: IDepartmentQueryParamsDTO = req.query;
      const department = await this.departmentService.departmentListing(query);
      res.status(statusCodes.success_status).json(department);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }

  @httpGet('/department-listing/:id')
  async departmentListingById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const department = await this.departmentService.departmentListingById(id);
      res.status(statusCodes.success_status).json(department);
    } catch (error) {
      res
        .status(statusCodes.badRequest_status)
        .json({ error: error.message, status: false });
    }
  }
}
