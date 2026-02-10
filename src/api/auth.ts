// src/api/auth.ts - Centralized auth and chat API functions

import { ApiError } from "./client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Types
export type User = {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
};

export interface PolicyResponse {
    ok: boolean;
    isAuthenticated: boolean;
    maxMessages: number;
    limits?: { messages: number };
    user?: User;
}

export type PaywallReason = "ANON_LIMIT_REACHED" | "AUTH_LIMIT_REACHED";

export interface PaywallDetail {
    error: "PAYWALL";
    reason: PaywallReason;
    anon_limit?: { messages: number };
    usage?: { messages: number };
    actions?: string[];
}

export interface ChatPayload {
    message: string;
    history: { role: "user" | "assistant"; content: string }[];
    setting: {
        emotionalState: string;
        tone: string;
    };
    use_local?: boolean;
}

export interface ChatResponse {
    response: string;
}

// Custom error for paywall responses
export class PaywallError extends Error {
    status: number = 402;
    detail: PaywallDetail;

    constructor(detail: PaywallDetail) {
        super("PAYWALL");
        this.name = "PaywallError";
        this.detail = detail;
    }
}

/**
 * GET /api/me - Check authentication status
 * Returns user if authenticated, null if not
 */
export async function apiMe(): Promise<User | null> {
    const res = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        // 401 means not authenticated - this is expected
        if (res.status === 401) {
            return null;
        }
        throw new ApiError("Error checking auth status", res.status);
    }

    const data = await res.json();
    return data?.user ?? null;
}

/**
 * POST /api/auth/google - Login with Google credential
 * Returns user on success, throws on failure
 */
export async function apiLogin(credential: string): Promise<User> {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new ApiError(data?.detail || "Login failed", res.status, data);
    }

    const data = await res.json();
    return data?.user ?? null;
}

/**
 * POST /api/logout - Logout user
 */
export async function apiLogout(): Promise<void> {
    await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        credentials: "include",
    });
}

/**
 * GET /api/me/policy - Get auth policy with limits
 * Returns isAuthenticated, maxMessages, optional user
 */
export async function apiPolicy(): Promise<PolicyResponse> {
    const res = await fetch(`${API_BASE}/api/me/policy`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        // Default fallback for anonymous
        return {
            ok: false,
            isAuthenticated: false,
            maxMessages: 10,
        };
    }

    const data = await res.json();
    return {
        ok: data.ok ?? true,
        isAuthenticated: data.isAuthenticated ?? false,
        maxMessages: data.maxMessages ?? 10,
        limits: data.limits,
        user: data.user,
    };
}

/**
 * POST /api/chat - Send chat message
 * Returns response on success, throws PaywallError on 402, ApiError on other errors
 */
export async function apiChat(payload: ChatPayload): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any = {};
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { raw: text };
    }

    // Handle 402 PAYWALL response
    if (res.status === 402 && data?.detail?.error === "PAYWALL") {
        throw new PaywallError(data.detail as PaywallDetail);
    }

    if (!res.ok) {
        throw new ApiError(
            data?.detail || data?.raw || "Error en /api/chat",
            res.status,
            data
        );
    }

    return data as ChatResponse;
}
