import { Request, Response } from 'express';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from 'inversify-express-utils';
import { type IModuleDto, type ModuleQueryParamsDTO } from '@dtos';
import { inject } from 'inversify';
import { IModuleService } from '@interfaces';
import { statusCodes, Messages, TYPES } from '@constants';
import { module } from '@utils';

//  module name: modules
@controller('/v1/admin/modules', TYPES.JwtMiddleware, module('modules'))
export class ModuleController {
  private readonly moduleService: IModuleService;

  constructor(@inject(TYPES.ModuleService) moduleService: IModuleService) {
    this.moduleService = moduleService;
  }

  @httpPost('/createModule', TYPES.WritePermissionMiddleware)
  async createModule(req: Request, res: Response) {
    try {
      const module = req.body as IModuleDto;
      const newModule = await this.moduleService.createModule(module);
      return res.status(newModule.status).json(newModule);
    } catch (error) {
      return res.status(500).json({
        status: statusCodes.error_status,
        message: Messages.genericError,
        error: (error as Error).message || 'An unknown error occurred.',
      });
    }
  }

  @httpPost('/getAllModules')
  async getAllModules(req: Request, res: Response) {
    try {
      const values = req.body as ModuleQueryParamsDTO;
      const modules = await this.moduleService.getAllModules(values);
      return res.status(modules.status).json(modules);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @httpGet('/getModuleById/:id', TYPES.ReadPermissionMiddleware)
  async getModuleById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const module = await this.moduleService.getModuleById(id);
      res.status(module.status).json(module);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @httpPut('/editModule/:id', TYPES.WritePermissionMiddleware)
  async editModule(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const module = req.body as IModuleDto;
      module.id = id;
      const updatedModule = await this.moduleService.editModule(module);
      if (updatedModule) {
        res.status(updatedModule.status).json(updatedModule);
      } else {
        res.status(404).json({ message: 'Module not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @httpDelete('/deleteModule/:id', TYPES.ReadPermissionMiddleware)
  async deleteModule(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deleted = await this.moduleService.deleteModule(id);
      if (deleted) {
        res.status(deleted.status).json(deleted);
      } else {
        res.status(404).json({ message: 'Module not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
