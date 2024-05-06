import { EncryptJWT, jwtDecrypt } from 'jose';
import { type User, type Tokens } from '@interfaces'; // Importing User and Tokens interfaces from a specific location.
import config from 'config';
import { Messages, statusCodes } from '@constants';

const code: string = config.get('JWT.SECRET'); // Replace with your actual secret key.
const encHeader = { alg: 'dir', enc: 'A256GCM' };

export const createTokens = async (user: User): Promise<Tokens> => {
  const expiryTime: string = config.get('JWT.ACCESSTOKENTIME') ?? '1d';
  const refreshTime: string = config.get('JWT.ACCESSTOKENTIME') ?? '1d';
  const secret = new TextEncoder().encode(code);

  const token = new EncryptJWT({ user })
    .setProtectedHeader(encHeader)
    .setIssuedAt()
    .setIssuer(user._id.toString());

  const accessToken: string = await token
    .setExpirationTime(expiryTime)
    .encrypt(secret);
  const refreshToken: string = await token
    .setExpirationTime(refreshTime)
    .encrypt(secret);

  return { accessToken, refreshToken };
};

export const jwtTokenVerifier = async (token: string): Promise<any> => {
  try {
    const secret = new TextEncoder().encode(code);
    const { payload } = await jwtDecrypt(token, secret, {
      contentEncryptionAlgorithms: ['A256GCM'],
      keyManagementAlgorithms: ['dir'],
    });
    if (!payload) {
      return {
        status: statusCodes.error_status,
        message: Messages.tokenError,
        success: false,
      };
    }
    return {
      payload,
      success: true,
    };
  } catch (error) {
    return {
      status: statusCodes.error_status,
      message: error.message,
      success: false,
    };
  }
};

// need to work around after
// export const decodeToken = async (token: any) => {
//   const jwtToken = token;
//   try {
//     const decoded = await jwtTokenVerifier(jwtToken);
//     return decoded;
//   } catch (error) {
//     return {
//       status: statusCodes.error_status,
//       message: error.message,
//       success: false,
//     };
//   }
// };

export const emailJWTToken = async (user: User) => {
  const expiryTime: string = config.get('JWT.RESETPASSWORDLINKEXP') ?? '10m';
  const secret = new TextEncoder().encode(code);

  const token = await new EncryptJWT({ user })
    .setProtectedHeader(encHeader)
    .setIssuedAt()
    .setIssuer(user._id.toString())
    .setExpirationTime(expiryTime)
    .encrypt(secret);

  return token;
};
