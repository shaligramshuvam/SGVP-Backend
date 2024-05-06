import { Messages } from '@constants';
import { type Request, type Response, type NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { jwtTokenVerifier } from '@utils';

@injectable()
export class JwtMiddleware extends BaseMiddleware {
  public async handler(req: Request, res: Response, next: NextFunction) {
    let jwtToken = req.headers.authorization;

    if (!jwtToken || !jwtToken.includes('Bearer')) {
      return res.status(401).send({
        status: 401,
        message: 'No token provided.',
      });
    }

    try {
      const tokenArray = jwtToken.split(' ');
      jwtToken = tokenArray[1];

      const decoded = await jwtTokenVerifier(jwtToken);
      if (decoded?.payload?.user) {
        req.body.jwtTokendata = decoded?.payload?.user;
      } else {
        throw new Error(Messages.tokenError);
      }
      next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: 'Failed to authenticate token.',
      });
    }
  }
}
