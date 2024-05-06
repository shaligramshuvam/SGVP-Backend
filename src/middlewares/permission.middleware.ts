import { type Request, type Response, type NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { Permission } from '@models';
import mongoose from 'mongoose';
import { Messages, PERMISSIONTYPES, statusCodes } from '@constants';

// Define the PermissionMiddleware class as an injectable
@injectable()
export class PermissionMiddleware extends BaseMiddleware {
  async getPermissions(id?: string, moduleName?: string) {
    const permissions = await Permission.aggregate([
      {
        $match: {
          ...(id && { adminTypeId: new mongoose.Types.ObjectId(id) }),
        },
      },
      {
        $lookup: {
          from: 'modules',
          foreignField: '_id',
          localField: 'moduleId',
          as: 'modules',
        },
      },

      {
        $match: {
          ...(moduleName && { 'modules.backendModuleName': moduleName }),
        },
      },
      {
        $project: {
          read: 1,
          write: 1,
          _id: 0,
        },
      },
    ]);

    return permissions;
  }

  constructor(readonly permit: string) {
    super();
  }

  public async handler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const requestModule = req.headers.module?.toString();
      const { adminTypeId } = req.body.jwtTokendata;
      const [permission]: any = await this.getPermissions(
        adminTypeId,
        requestModule
      );
      if (!this.permit) {
        next();
      }
      if (permission) {
        if (this.permit === PERMISSIONTYPES.read && permission.read) {
          next();
        } else if (
          (this.permit === PERMISSIONTYPES.write ||
            this.permit === PERMISSIONTYPES.read) &&
          permission.write
        ) {
          next();
        } else {
          return res
            .status(statusCodes.badRequest_status)
            .json({ message: Messages.unauthorizeResourse, status: false });
        }
      } else {
        return res
          .status(statusCodes.unauthorised_status)
          .json({ message: Messages.unauthorizeResourse, status: false });
      }
    } catch (error) {
      return res
        .status(statusCodes.unauthorised_status)
        .json({ message: Messages.unauthorizeResourse, status: false });
    }
  }
}
