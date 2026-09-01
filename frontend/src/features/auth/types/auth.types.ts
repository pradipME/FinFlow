export interface User {
  id: string;
  email: string;
  username: string;
  status: string;
  createdAt: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  termsAccepted: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}