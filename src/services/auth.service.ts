/* eslint-disable no-async-promise-executor */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { Messages, TYPES, statusCodes } from '@constants';
import { type AdminLoginDTO } from '@dtos';
import {
  type Tokens,
  // type IClientLogin,
  type IAuthService,
  // type Tokens,
  type Payload as PayloadType,
  IUserService,
} from '@interfaces';
import { User, EmailToken } from '@models';
import { inject, injectable } from 'inversify';
import {
  comparePassword,
  createTokens,
  emailJWTToken,
  jwtTokenVerifier,
} from '@utils';
import config from 'config';

@injectable()
export class AuthService implements IAuthService {
  private readonly userService: IUserService;

  constructor(
    @inject(TYPES.UserService)
    _userService: IUserService
  ) {
    this.userService = _userService;
  }

  async login(loginData: AdminLoginDTO) {
    try {
      const user = await User.findOne({
        email: loginData.email,
        isDeleted: false,
      });

      if (!user) {
        return {
          status: statusCodes.error_status,
          message: Messages.invalidCredentials,
        };
      }
      const ispasswordMatch = await comparePassword(
        loginData.password,
        user.hash
      );
      if (!ispasswordMatch) {
        return {
          status: statusCodes.error_status,
          message: Messages.invalidCredentials,
        };
      }

      const tokenData = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        birthDate: user.birthDate,
      };
      const userData = {
        ...tokenData,
      };

      const tokens: Tokens = await createTokens(tokenData);
      return {
        status: statusCodes.success_status,
        data: { userData, authToken: tokens, user },
        message: Messages.loginSuccessMessage,
      };
    } catch (error) {
      return {
        status: statusCodes.error_status,
        message: error.message,
        error: error ? error.name : '',
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await User.findOne({
        email,
        isDeleted: false,
      });
      if (!user) {
        return {
          status: statusCodes.error_status,
          message: Messages.invalidEmail,
        };
      }

      const emailTokenData = {
        _id: user._id,
        email,
      };

      const resetPasswordToken = await emailJWTToken(emailTokenData);

      const resetPasswordLink = `${config.get('URLS.DOMAIN')}${config.get(
        'URLS.LINKVERIFICATION'
      )}/${resetPasswordToken}`;
      console.log(
        '🚀 ~ AuthService ~ resetPasswordLink ~ resetPasswordLink:',
        resetPasswordLink
      );

      const emailToken = new EmailToken({
        jwtToken: resetPasswordToken,
        userId: user._id,
      });

      console.log(
        '🚀 ~ AuthService ~ forgotPassword ~ emailToken:',
        emailToken
      );
      // send email
      // await Promise.allSettled([

      //   emailSender(
      //     [user.email],
      //     forgetPasswordContent(user, resetPasswordLink, emailToken.expiresAt)
      //   ),
      //   emailToken.save(),
      // ]);

      return {
        status: statusCodes.success_status,
        message: Messages.verificationEmailSent,
      };
    } catch (error) {
      return {
        status: statusCodes.error_status,
        message: error.message,
        error: error ? error.name : '',
      };
    }
  }

  async verifyJWTToken(token: string) {
    try {
      if (!token) {
        return {
          status: statusCodes.error_status,
          message: Messages.tokenError,
          success: false,
        };
      }
      const emailData = await EmailToken.findOne({ jwtToken: token });
      if (!emailData) {
        return {
          status: statusCodes.error_status,
          message: Messages.userNotFound,
          success: false,
        };
      }

      const decodedToken = await jwtTokenVerifier(token);
      if (!decodedToken.success) {
        return decodedToken;
      }
      const decodedUser = decodedToken.payload.user as PayloadType;
      const user = await User.findById(decodedUser._id);
      if (!user) {
        return {
          status: statusCodes.error_status,
          message: Messages.userNotFound,
        };
      }
      // const decodedId = new mongoose.Types.ObjectId(id);

      if (emailData.userId?.equals(decodedUser._id)) {
        if (emailData.verified) {
          return {
            status: statusCodes.success_status,
            message: Messages.alreadyVerified,
            success: false,
          };
        }

        if (emailData.expiresAt < new Date()) {
          return {
            status: statusCodes.error_status,
            message: Messages.expiredVerificationCode,
            success: false,
          };
        }

        emailData.verified = true;
        emailData.isDeleted = true;
        await emailData.save();

        return {
          status: statusCodes.success_status,
          message: Messages.verificationsuccess,
          user,
          emailData,
          success: true,
        };
      }
      return {
        status: statusCodes.error_status,
        message: Messages.userNotFound,
        success: false,
      };
    } catch (error) {
      return {
        status: statusCodes.error_status,
        message: error.message,
        error: error ? error.name : '',
      };
    }
  }

  async changePassword(
    currentUser: string | undefined,
    userId: string,
    password: string,
    oldPassword: string
  ): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: statusCodes.error_status,
          messgae: Messages.userNotFound,
          success: false,
        };
      }
      // for user to change the password
      if (
        oldPassword !== '' ||
        oldPassword !== null ||
        oldPassword !== undefined
      ) {
        // compare the old password with the hash
        const compare = await comparePassword(oldPassword, user.hash);
        if (!compare) {
          return {
            status: statusCodes.error_status,
            messgae: Messages.currentpasswordwrong,
            success: false,
          };
        }
        // compare new password with the hash
        const compareNewPassword = await comparePassword(password, user.hash);
        if (compareNewPassword) {
          return {
            status: statusCodes.error_status,
            message: Messages.newPasswordSameAsOld,
            success: false,
          };
        }
        user.hash = password;
        await user.save();
        return {
          success: true,
        };
      }
    } catch (error) {
      return {
        status: statusCodes.error_status,
        message: error.message,
        error: error.name || '',
      };
    }
  }

  async modifyPassword(
    token: string,
    password: string,
    userId: string,
    oldPassword: string,
    isResetLink?: boolean,
    authToken?: string
  ): Promise<any> {
    try {
      if (!token && isResetLink) {
        return {
          status: statusCodes.error_status,
          message: Messages.tokenError,
        };
      }
      if (!password) {
        return {
          status: statusCodes.error_status,
          message: Messages.validationError,
        };
      }

      if (token && isResetLink) {
        const emailData = await EmailToken.findOne({ jwtToken: token });
        if (!emailData) {
          return {
            status: statusCodes.error_status,
            message: Messages.tokenError,
            success: false,
          };
        }

        if (!emailData.verified) {
          return {
            status: statusCodes.error_status,
            message: Messages.unverifiedVerificationCode,
          };
        }

        const user = await User.findById(emailData.userId);
        if (!user) {
          return {
            status: statusCodes.error_status,
            message: Messages.userNotFound,
          };
        }
        user.hash = password;

        await user.save();
        await EmailToken.findByIdAndDelete({ _id: emailData._id });
        return {
          status: statusCodes.success_status,
          message: Messages.resetSuccessful,
        };
      }

      if (
        !isResetLink &&
        (authToken !== null || authToken !== undefined || authToken !== '')
      ) {
        if (authToken && authToken.includes('Bearer')) {
          const tokenArray = authToken.split(' ');
          authToken = tokenArray[1];
          const decodedToken = await jwtTokenVerifier(authToken);
          if (!decodedToken.success) {
            return decodedToken;
          }
          const decodedUser = decodedToken.payload.user as PayloadType;
          const changedPassword = await this.changePassword(
            decodedUser._id,
            userId,
            password,
            oldPassword
          );
          if (changedPassword.success) {
            return {
              status: statusCodes.success_status,
              message: Messages.recordUpdatedSuccessfully,
            };
          }
          return changedPassword;
        } else {
          return {
            status: statusCodes.unauthorised_status,
            message: Messages.tokenError,
          };
        }
      }
      return {
        status: statusCodes.error_status,
        message: Messages.genericError,
      };
    } catch (error) {
      return {
        status: statusCodes.error_status,
        message: error.message,
        error: error ? error.name : '',
      };
    }
  }
}
