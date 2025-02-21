import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import Role from "../../constants/role.js";
import { UserDocument } from "../models/user.model";
import { SessionDocument } from "../models/session.model";

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  userRole: Role[];
  sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "10m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (payload: AccessTokenPayload | RefreshTokenPayload, options?: SignOptionsAndSecret) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...signOpts,
  });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  },
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...verifyOpts,
    }) as TPayload;
    return {
      payload,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
