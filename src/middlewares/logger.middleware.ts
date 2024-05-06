/* eslint-disable @typescript-eslint/no-useless-constructor */
import { type Request, type Response, type NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

@injectable()
export class LoggerMiddleware extends BaseMiddleware {
  constructor() {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction) {
    console.log(`Request received at: ${new Date().toISOString()}`);
    next();
  }
}
