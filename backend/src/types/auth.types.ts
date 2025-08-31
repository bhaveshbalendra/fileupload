// Authentication request/response types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  };
}

// JWT payload types
export interface JwtPayload {
  userId: string;
  aud?: string[];
  exp?: number;
  iat?: number;
}

// Auth middleware types
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}
