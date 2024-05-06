/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Request, Response } from 'express';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES, statusCodes, Messages } from '@constants';
import { type IAuthService } from '@interfaces';
import config from 'config';
import { type UserLoginDTO } from 'src/interfaces/dtos/IUserDto';

@controller('/v1/auth')
export class AuthController {
  private readonly authService: IAuthService;

  constructor(@inject(TYPES.AuthService) authService: IAuthService) {
    this.authService = authService;
  }

  @httpPost('/login', TYPES.LoggerMiddleware)
  async logIn(req: Request, res: Response) {
    try {
      const loginData: UserLoginDTO = req.body;
      const authUser = await this.authService.login(loginData);
      res.status(statusCodes.success_status).json(authUser);
    } catch (error) {
      res
        .status(statusCodes.internal_server)
        .json({ message: Messages.internalServerError });
    }
  }

  @httpGet('/healthCheck', TYPES.LoggerMiddleware)
  async healthCheck(req: Request, res: Response) {
    try {
      res.status(statusCodes.success_status).json({});
    } catch (error) {
      res
        .status(statusCodes.internal_server)
        .json({ message: Messages.internalServerError });
    }
  }
  @httpPost('/forgotpassword', TYPES.LoggerMiddleware)
  async forgotpassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const authUser = await this.authService.forgotPassword(email);
      res.status(statusCodes.success_status).json(authUser);
    } catch (error) {
      res
        .status(statusCodes.internal_server)
        .json({ message: Messages.internalServerError });
    }
  }

  @httpGet('/link-verification/:token')
  async linkVerification(req: Request, res: Response) {
    try {
      await this.authService.verifyJWTToken(req.params.token);
      const successURL = `${config.get('URLS.BASE_URL')}${config.get(
        'URLS.RESETLINK'
      )}/${req.params.token}`;
      res.redirect(successURL);
    } catch (error) {
      const errorURL = `${config.get('URLS.BASE_URL')}/login?token=false`;
      res.redirect(errorURL);
    }
  }

  @httpPost('/reset-password')
  async modifyPassword(req: Request, res: Response) {
    try {
      const { token, password, oldPassword, isResetLink, userId } = req.body;
      const tokenData = await this.authService.modifyPassword(
        token,
        password,
        userId,
        oldPassword,
        isResetLink,
        req.headers.authorization ? req.headers.authorization : ''
      );
      res.status(statusCodes.success_status).json(tokenData);
    } catch (error) {
      res
        .status(statusCodes.internal_server)
        .json({ message: Messages.internalServerError });
    }
  }
}
