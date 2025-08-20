import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Env } from "../config/env.config";

export type AccessTokenPayload = {
  sub: string;
  role?: string;
  sessionId?: string;
};

export type RefreshTokenPayload = {
  sub: string;
  sessionId: string;
};

const commonSignOptions: SignOptions = {
  issuer: Env.JWT_ISSUER,
  audience: Env.JWT_AUDIENCE,
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    ...commonSignOptions,
    expiresIn: Env.ACCESS_TOKEN_TTL as unknown as number,
  };
  return jwt.sign(
    payload as unknown as string | Buffer | object,
    Env.JWT_ACCESS_SECRET as unknown as jwt.Secret,
    options
  );
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  const options: SignOptions = {
    ...commonSignOptions,
    expiresIn: Env.REFRESH_TOKEN_TTL as unknown as number,
  };
  return jwt.sign(
    payload as unknown as string | Buffer | object,
    Env.JWT_REFRESH_SECRET as unknown as jwt.Secret,
    options
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, Env.JWT_ACCESS_SECRET, {
      issuer: Env.JWT_ISSUER,
      audience: Env.JWT_AUDIENCE,
    }) as JwtPayload;
    return decoded as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, Env.JWT_REFRESH_SECRET, {
      issuer: Env.JWT_ISSUER,
      audience: Env.JWT_AUDIENCE,
    }) as JwtPayload;
    return decoded as unknown as RefreshTokenPayload;
  } catch {
    return null;
  }
};
