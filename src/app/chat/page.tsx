"use client";

import { useEffect, useState } from "react";
import ChatView from "@/components/chat/ChatView";

interface UserPreferences {
    emotionalState?: string;
    tone?: string;
    savedAt?: string;
}

export default function ChatPage() {
    const [preferences, setPreferences] = useState<UserPreferences>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Read preferences from localStorage (saved by onboarding)
        const stored = localStorage.getItem("oms_user_preferences");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences(parsed);
            } catch (e) {
                console.warn("Could not parse user preferences:", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Wait for client-side hydration to avoid SSR mismatch
    if (!isLoaded) {
        return null;
    }

    return (
        <ChatView
            emotionalState={preferences.emotionalState}
            tone={preferences.tone}
        />
    );
}
