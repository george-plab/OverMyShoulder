"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiPolicy, apiLogin, apiLogout, User, PolicyResponse } from "@/api/auth";

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    maxMessages: number;
    refreshPolicy: () => Promise<void>;
    loginWithGoogle: (credential: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [maxMessages, setMaxMessages] = useState(10); // Default fallback
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Fetch policy from server and update state
    const refreshPolicy = useCallback(async () => {
        setIsLoading(true);
        try {
            const policy = await apiPolicy();
            setIsAuthenticated(policy.isAuthenticated);
            setMaxMessages(policy.maxMessages);
            setUser(policy.user ?? null);
        } catch (error) {
            console.error("Error fetching policy:", error);
            // Keep defaults on error
            setIsAuthenticated(false);
            setMaxMessages(10);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loginWithGoogle = useCallback(async (credential: string) => {
        await apiLogin(credential);
        // Refresh policy to get updated maxMessages
        await refreshPolicy();
    }, [refreshPolicy]);

    const logout = useCallback(async () => {
        await apiLogout();
        // Refresh policy to get anonymous limits
        await refreshPolicy();
    }, [refreshPolicy]);

    // Fetch policy on mount
    useEffect(() => {
        refreshPolicy();
    }, [refreshPolicy]);

    // Protect routes
    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated) return;
        if (!pathname) return;

        const protectedPrefixes = ["/analysis", "/admin"];
        const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
        if (isProtected && pathname !== "/start" && pathname !== "/login") {
            router.replace("/start");
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated,
            isLoading,
            maxMessages,
            refreshPolicy,
            loginWithGoogle,
            logout,
        }),
        [user, isAuthenticated, isLoading, maxMessages, refreshPolicy, loginWithGoogle, logout]
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
