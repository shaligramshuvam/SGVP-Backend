import { Request, Response } from 'express';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { type IUserService } from '@interfaces';
import { Messages, TYPES, statusCodes } from '@constants';
import { upsertUserRegisterRequestSchema } from '@validators';
import mongoose from 'mongoose';
import { type UserQueryParamsDTO } from '@dtos';

// Define a controller for user entities
@controller('/v1/user', TYPES.JwtMiddleware)
export class UserController {
  private readonly userService: IUserService;

  constructor(@inject(TYPES.UserService) _userService: IUserService) {
    this.userService = _userService;
  }

  @httpPost('/getAllUsers', TYPES.LoggerMiddleware)
  async getAllUsers(req: Request, res: Response) {
    try {
      const params: UserQueryParamsDTO = req.body;

      const users = await this.userService.getAllUsers(params);
      res.status(statusCodes.success_status).json(users);
    } catch (error) {
      res
        .status(statusCodes.error_status)
        .json({ message: error.message, status: false });
    }
  }

  @httpGet('/getUser/:id', TYPES.LoggerMiddleware)
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new Error(Messages.invalidIds);
      }
      const user = await this.userService.getUserById(userId);
      res.status(statusCodes.success_status).json(user);
    } catch (error) {
      res
        .status(statusCodes.error_status)
        .json({ message: error.message, status: false });
    }
  }

  @httpPost('/addUser', TYPES.CreateAuditMiddleware)
  async addUser(req: Request, res: Response) {
    try {
      await upsertUserRegisterRequestSchema.validate(req.body, {
        abortEarly: false,
      });
      const user = await this.userService.addNewUser(req.body);
      res.status(statusCodes.created_status).json({ ...user });
    } catch (error) {
      if (error?.name === 'ValidationError') {
        res.status(statusCodes.badRequest_status).json({
          message: Messages.validationError,
          error: error?.errors,
          status: false,
        });
      } else {
        return res
          .status(statusCodes.badRequest_status)
          .json({ message: error.message, status: false });
      }
    }
  }

  @httpPut('/editUser/:id', TYPES.UpdateAuditMiddleware)
  async editUser(req: Request, res: Response) {
    try {
      await upsertUserRegisterRequestSchema.validate(req.body, {
        abortEarly: false,
      });
      const user = await this.userService.editUser(req.params.id, req.body);
      res.status(statusCodes.success_status).json({ ...user });
    } catch (error) {
      if (error?.name === 'ValidationError') {
        res.status(statusCodes.badRequest_status).json({
          message: Messages.validationError,
          error: error?.errors,
          status: false,
        });
      } else {
        return res
          .status(statusCodes.badRequest_status)
          .json({ message: error.message, status: false });
      }
    }
  }

  @httpDelete('/deleteUserAccount/:id', TYPES.DeleteAuditMiddleware)
  async deleteUserAccount(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const userData = await this.userService.deleteUserAccount(id);
      res.status(statusCodes.success_status).json(userData);
    } catch (error) {
      return res
        .status(statusCodes.badRequest_status)
        .json({ message: error.message, status: false });
    }
  }
}
