"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/api/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data?.user ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = async () => {
    setIsLoading(true);
    try {
      const me = await fetchMe();
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) {
      throw new Error("Login failed");
    }
    const data = await res.json();
    setUser(data?.user ?? null);
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (user) return;
    if (!pathname) return;

    const protectedPrefixes = ["/analysis", "/admin"];
    const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (isProtected && pathname !== "/start" && pathname !== "/login") {
      router.replace("/start");
    }
  }, [isLoading, user, pathname, router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, refresh, loginWithGoogle, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
