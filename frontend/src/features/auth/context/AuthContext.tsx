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

/**
 * Decode a JWT payload segment. JWTs use base64url (`-`/`_`), which `atob`
 * cannot decode directly, so normalize to standard base64 first.
 */
function decodeJwtPayload(token: string): string {
  const segment = token.split(".")[1] ?? "";
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);
  const refreshInFlightRef = useRef<Promise<boolean> | null>(null);

  const isAuthenticated = user !== null;

  const parseUserFromTokens = useCallback(
    (tokens: AuthTokens): User => {
      try {
        const payload = JSON.parse(
          decodeJwtPayload(tokens.accessToken),
        ) as Record<string, unknown>;
        const roles = Array.isArray(payload.roles) ? (payload.roles as string[]) : [];
        const email = (payload.email as string) ?? "";
        const username =
          (payload.username as string) ??
          (email.split("@")[0] || email || "User");
        const issuedAt =
          typeof payload.iat === "number"
            ? new Date(payload.iat * 1000).toISOString()
            : new Date().toISOString();
        return {
          id: (payload.sub as string) ?? "",
          email,
          username,
          roles,
          status: (payload.status as string) ?? "ACTIVE",
          createdAt: issuedAt,
        };
      } catch {
        return {
          id: "",
          email: "",
          username: "User",
          roles: [],
          status: "UNKNOWN",
          createdAt: new Date().toISOString(),
        };
      }
    },
    [],
  );

  /**
   * Refresh a session using the stored refresh token. Single-flight: if a
   * refresh is already in progress (React StrictMode double-mount, an API
   * 401 racing the bootstrap restore, etc.) subsequent calls share the same
   * promise. This prevents two concurrent refreshes from racing token
   * rotation and one of them destroying a still-valid session.
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (refreshInFlightRef.current) return refreshInFlightRef.current;

    const attempt = (async (): Promise<boolean> => {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) return false;

      try {
        const tokens = await refreshApi(refreshToken);
        const currentRefresh = tokenManager.getRefreshToken();
        // The session may have been explicitly cleared (logout) or rotated
        // again by a concurrent flow while this request was in flight. Never
        // resurrect a cleared session; when the token was merely rotated, this
        // attempt's result is still valid so only refresh the in-memory token.
        if (currentRefresh === null) return false;
        if (currentRefresh === refreshToken) {
          tokenManager.setTokens(tokens.accessToken, tokens.refreshToken, true);
        } else {
          tokenManager.setAccessToken(tokens.accessToken);
        }
        const restored = parseUserFromTokens(tokens);
        if (mountedRef.current) setUser(restored);
        return true;
      } catch (error) {
        const status =
          typeof error === "object" && error !== null && "response" in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;
        // Only destroy the persisted session when the server definitively
        // rejected the refresh credential: 400 (malformed token rejected by
        // validation), 401 (unauthorized) or 403 (forbidden). A 5xx, 429/408
        // rate-limit/timeout, or a network error without an HTTP status are
        // transient conditions — a valid session must survive so the next
        // attempt can retry instead of logging the user out.
        const invalidCredentials = status === 400 || status === 401 || status === 403;
        if (invalidCredentials && tokenManager.getRefreshToken() === refreshToken) {
          if (mountedRef.current) setUser(null);
          tokenManager.clearTokens();
        }
        return false;
      }
    })();

    refreshInFlightRef.current = attempt;
    void attempt.finally(() => {
      if (refreshInFlightRef.current === attempt) refreshInFlightRef.current = null;
    });
    return attempt;
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
    async (payload: { identifier: string; password: string }, remember = true) => {
      const tokens = await loginApi(payload);
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken, remember);
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
        roles: [],
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