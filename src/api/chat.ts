import { apiFetch } from "./client";


// API function to send message
export interface Setting {
    //mode: string; Deprecated
    emotionalState: string;
    tone: string;
}

export interface HistoryItem {
    role: "user" | "assistant";
    content: string;
}



export async function chat(message: string, history: any[],setting:Setting,use_local=false) {
    return apiFetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, setting, use_local }),
    });
}