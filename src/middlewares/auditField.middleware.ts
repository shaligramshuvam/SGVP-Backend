import { type Request, type Response, type NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { AUDITTYPES, Messages, statusCodes } from '@constants';

// Define the AuditFieldMiddleware class as an injectable
@injectable()
export class AuditFieldMiddleware extends BaseMiddleware {
  constructor(readonly auditType: string) {
    super();
  }

  public async handler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _id } = req.body.jwtTokendata;
      if (!_id) {
        throw new Error(Messages.unauthorizeResourse);
      }
      if (this.auditType === AUDITTYPES.create) {
        req.body = {
          ...req.body,
          'auditFields.createdby': _id,
          'auditFields.updatedBy': _id,
        };
      } else if (this.auditType === AUDITTYPES.update) {
        req.body = {
          ...req.body,
          'auditFields.updatedBy': _id,
        };
      } else if (this.auditType === AUDITTYPES.delete) {
        req.body = {
          ...req.body,
          isDeleted: true,
          'auditFields.deletedBy': _id,
          'auditFields.deletedAt': new Date().toUTCString(),
        };
      } else {
        return res
          .status(statusCodes.unauthorised_status)
          .json({ message: Messages.unauthorizeResourse, status: false });
      }
      next();
    } catch (error) {
      return res
        .status(statusCodes.unauthorised_status)
        .json({ message: Messages.unauthorizeResourse, status: false });
    }
  }
}
