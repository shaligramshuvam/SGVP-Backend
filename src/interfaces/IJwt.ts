// This interface defines the structure of a user object.

import { type Admin } from 'mongodb';
// import { type IClientDetails } from 'src/interfaces/dtos';
import type mongoose from 'mongoose';

export interface User {
  // Unique identifier for the user.
  _id: mongoose.Types.ObjectId;
  // The email address of the user.
  email?: string;

  permission?: any;

  permissionTemplateId?: string;
}

// This interface defines the structure of authentication tokens.

export interface Tokens {
  // Access token used for authorization.
  accessToken: string;

  // Refresh token used to obtain a new access token.
  refreshToken: string;
}

export interface Payload {
  exp: number;
  iat: number;
  iss: string;
  user: User;
  _id: string;
  admin?: Admin;
}
