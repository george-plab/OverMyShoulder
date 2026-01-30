// lib/api/client.ts

export class ApiError extends Error {
    status: number;
    detail?: any;

    constructor(message: string, status: number, detail?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.detail = detail;
    }
}

// Next.js carga automáticamente .env.local (dev) y .env.production (prod)
// desde la raíz del proyecto. No necesitas dotenv.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
console.log("API_BASE_URL", API_BASE);

if (!API_BASE) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set. Check your .env.local file in the project root.");
}

export async function apiFetch<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const url = `${API_BASE}${path}`;

    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
    });

    let data: any = {};
    try {
        data = await res.json();
    } catch {
        // backend puede devolver vacío
    }

    if (!res.ok) {
        throw new ApiError(
            data?.detail || data?.message || "Error de servidor",
            res.status,
            data
        );
    }

    return data as T;
}
