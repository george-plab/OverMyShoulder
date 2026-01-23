"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import "./ChatView.css";

const CHAT_HISTORY_KEY = "oms_chat_history";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// API function to send message
interface Settings {
    mode: string;
    emotionalState: string;
    tone: string;
}

interface HistoryItem {
    role: "user" | "assistant";
    content: string;
}

async function sendMessage(
    message: string,
    history: HistoryItem[],
    settings: Settings,
    useLocal: boolean = true
) {
    const payload = {
        message,
        history,
        setting: {
            mode: settings.mode || "default",
            emotionalState: settings.emotionalState || "",
            tone: settings.tone || "",
        },
        use_local: useLocal,
    };

    console.log("CHAT PAYLOAD:", payload);
    console.log("CHAT PAYLOAD JSON:", JSON.stringify(payload));

    const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("CHAT STATUS:", res.status, "CHAT BODY:", text);

    const data = JSON.parse(text);
    if (!res.ok) {
        throw new Error(data?.detail || "Error en /api/chat");
    }
    return data;
}

// Mode configuration
const modeConfig = {
    default: {
        initialMessages: [
            "Hola. Estoy aquí. Cuéntame qué tienes en la cabeza.",
            "Hola. Este espacio es tuyo. Nada se comparte ni se publica.",
            "Hola. Dime qué te ronda por la mente.",
        ],
        statusText: "Aquí contigo",
        placeholder: "Escribe lo que necesites decir...",
        errorMessage: "No he podido conectar. Vuelve a intentarlo en un momento.",
    },
};

function getModeConfig(mode = "default") {
    return modeConfig[mode as keyof typeof modeConfig] || modeConfig.default;
}

function getRandomInitialMessage(mode = "default") {
    const config = getModeConfig(mode);
    const messages = config.initialMessages;
    return messages[Math.floor(Math.random() * messages.length)];
}

function formatTime(date: Date) {
    return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: string;
}

interface ChatViewProps {
    mode?: string;
    emotionalState?: string;
    tone?: string;
}

// Helper to convert messages to API history format
function messagesToHistory(messages: Message[]): HistoryItem[] {
    return messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
    }));
}

// Load chat history from localStorage
function loadChatHistory(): Message[] | null {
    try {
        const stored = localStorage.getItem(CHAT_HISTORY_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Could not load chat history:", e);
    }
    return null;
}

// Save chat history to localStorage
function saveChatHistory(messages: Message[]) {
    try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (e) {
        console.warn("Could not save chat history:", e);
    }
}

export default function ChatView({ mode = "default", emotionalState = "", tone = "" }: ChatViewProps) {
    const config = getModeConfig(mode);

    // Initialize with stored history or default welcome message
    const [messages, setMessages] = useState<Message[]>(() => {
        // Try to load from localStorage on initial render
        if (typeof window !== "undefined") {
            const stored = loadChatHistory();
            if (stored && stored.length > 0) {
                return stored;
            }
        }
        return [
            {
                id: 1,
                text: getRandomInitialMessage(mode),
                isUser: false,
                timestamp: formatTime(new Date()),
            },
        ];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [useLocal, setUseLocal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            saveChatHistory(messages);
        }
    }, [messages]);

    const handleSend = async (text: string) => {
        const userMessage: Message = {
            id: Date.now(),
            text,
            isUser: true,
            timestamp: formatTime(new Date()),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Build settings from ChatViewProps
            const settings = { mode, emotionalState, tone };

            // Build history from all messages (excluding the just-added user message for the request)
            const history = messagesToHistory(messages);

            // Use the sendMessage function from api.js
            const response = await sendMessage(text, history, settings, useLocal);

            const botMessage: Message = {
                id: Date.now() + 1,
                text: response.response || response.message || config.errorMessage,
                isUser: false,
                timestamp: formatTime(new Date()),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);

            const errorMessage: Message = {
                id: Date.now() + 1,
                text: `⚠️ ${config.errorMessage}`,
                isUser: false,
                timestamp: formatTime(new Date()),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-app">
            {/* Header */}
            <header className="chat-header">
                <div className="header-content">
                    <div className="avatar">
                        <span className="avatar-icon">💬</span>
                    </div>
                    <div className="header-info">
                        <h1>OverMyShoulder</h1>
                        <span className="status">
                            <span className="status-dot"></span>
                            {config.statusText}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <label className="toggle-local">
                        <input
                            type="checkbox"
                            checked={useLocal}
                            onChange={(e) => setUseLocal(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Local</span>
                    </label>
                </div>
            </header>

            {/* Messages Area */}
            <main className="chat-messages">
                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg.text}
                        isUser={msg.isUser}
                        timestamp={msg.timestamp}
                    />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <ChatInput
                onSend={handleSend}
                disabled={isLoading}
                placeholder={config.placeholder}
            />
        </div>
    );
}
