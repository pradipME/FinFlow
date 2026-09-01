import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tokenManager } from "@/shared/api/token-manager";
import type { AuthContextValue, User, AuthTokens } from "../types";
import { loginApi, registerApi, refreshApi, revokeApi } from "../api";

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const isAuthenticated = user !== null;

  const parseUserFromTokens = useCallback(
    (tokens: AuthTokens): User => {
      try {
        const payload = JSON.parse(
          atob(tokens.accessToken.split(".")[1]),
        ) as Record<string, unknown>;
        return {
          id: payload.sub as string,
          email: payload.email as string,
          username: payload.username as string,
          status: (payload.status as string) ?? "ACTIVE",
          createdAt: (payload.iat as string) ?? new Date().toISOString(),
        };
      } catch {
        return {
          id: "",
          email: "",
          username: "",
          status: "UNKNOWN",
          createdAt: new Date().toISOString(),
        };
      }
    },
    [],
  );

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const tokens = await refreshApi(refreshToken);
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
      const restored = parseUserFromTokens(tokens);
      if (mountedRef.current) setUser(restored);
      return true;
    } catch {
      tokenManager.clearTokens();
      if (mountedRef.current) setUser(null);
      return false;
    }
  }, [parseUserFromTokens]);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function restore() {
      if (!tokenManager.hasRefreshToken()) {
        if (mountedRef.current) setIsLoading(false);
        return;
      }
      const success = await refreshSession();
      if (!cancelled && !success && mountedRef.current) {
        setUser(null);
      }
    }

    restore().finally(() => {
      if (mountedRef.current && !cancelled) setIsLoading(false);
    });

    return () => {
      mountedRef.current = false;
      cancelled = true;
    };
  }, [refreshSession]);

  const login = useCallback(
    async (payload: { identifier: string; password: string }) => {
      const tokens = await loginApi(payload);
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
      const loggedIn = parseUserFromTokens(tokens);
      setUser(loggedIn);
    },
    [parseUserFromTokens],
  );

  const register = useCallback(
    async (payload: {
      email: string;
      username: string;
      password: string;
      phoneNumber?: string;
      termsAccepted: boolean;
    }) => {
      const result = await registerApi(payload);
      return {
        id: result.id,
        email: result.email,
        username: result.username,
        status: result.status,
        createdAt: result.createdAt,
      } as User;
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        await revokeApi(refreshToken);
      } catch {
        // Revoke is best-effort
      }
    }
    tokenManager.clearTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, isAuthenticated, isLoading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}