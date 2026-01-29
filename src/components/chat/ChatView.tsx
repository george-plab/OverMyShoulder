"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import "./ChatView.css";

const CHAT_HISTORY_KEY = "oms_chat_history";
const COUNT_MSG_KEY = "oms_count_msg";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// API function to send message
interface Setting {
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
    setting: Setting,
    use_local: boolean = true
) {
    const payload = {
        message,
        history,
        setting: {
            mode: setting.mode || "default",
            emotionalState: setting.emotionalState || "",
            tone: setting.tone || "",
        },
        use_local: use_local,
    };

    console.log("CHAT PAYLOAD:", payload);
    console.log("CHAT PAYLOAD JSON:", JSON.stringify(payload));

    const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const text = await res.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    console.log("CHAT STATUS:", res.status, "CHAT BODY:", text);
    if (!res.ok) throw new Error(data?.detail || data?.raw || "Error en /api/chat");
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
    isError?: boolean;
}


interface ChatViewProps {
    mode?: string;
    emotionalState?: string;
    tone?: string;
}

// Helper to convert messages to API history format (filters out error messages)
function messagesToHistory(messages: Message[]): HistoryItem[] {
    return messages
        .filter((msg) => !msg.isError)
        .map((msg) => ({
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

// Save chat history to localStorage (filters out error messages)
function saveChatHistory(messages: Message[]) {
    try {
        const messagesToSave = messages.filter((msg) => !msg.isError)
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messagesToSave));
    } catch (e) {
        console.warn("Could not save chat history:", e);
    }
}


function saveMsgCount(userChatLength: number) {
    try {
        //const msgCount = messages.filter((msg) => !msg.isError).length;
        localStorage.setItem(COUNT_MSG_KEY, userChatLength.toString());
    } catch (e) {
        console.warn("Could not save chat history:", e);
    }
}

function loadMsgCount(): number {
    try {
        const stored = localStorage.getItem(COUNT_MSG_KEY);
        if (stored) {
            return Number(stored)//(JSON.parse(stored));
        }
    } catch (e) {
        console.warn("Could not load chat history:", e);
        return 0;
    }
    return 0;
}

// Beta Mode: Limit user messages per session
const MAX_USER_MESSAGES = 4; // Para testing, cambiar a 10 en producción



// Clear chat history from localStorage and reset state
function clearAllChatData() {
    const keysToRemove = [
        CHAT_HISTORY_KEY,
        COUNT_MSG_KEY, // Añadido para borrar el contador de mensajes Añade setMsgCount(0); en handleClearChat() 
        "oms_user_preferences",                
        // Fallback keys in case they exist
        "chatMessages",
        "messages",
        "chat_history",
        "history",
        //"oms_chat",
        //"oms_history",
        //"OverMyShoulder_chat"
    ];
    keysToRemove.forEach(key => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn(`Could not remove ${key}:`, e);
        }
    });
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
    const useLocal = false; // Fixed value, toggle removed for users
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Estado para el contador de mensajes del usuario (persistido en localStorage)
    const [userMsgCount, setUserMsgCount] = useState<number>(() => {
        if (typeof window !== "undefined") {
            return loadMsgCount();
        }
        return 0;
    });

    // Check if limit reached for CTA styling
    const limitReached = userMsgCount >= MAX_USER_MESSAGES;

    // Clear chat history handler (NO resetea el contador de mensajes)
    const handleClearChat = () => {
        const confirmed = window.confirm(
            "¿Seguro que quieres borrar el chat? Esto eliminará el historial en este dispositivo, pero el límite de mensajes se mantiene."
        );
        if (confirmed) {
            clearAllChatData(); 
            // Reset contador de mensajes y mensaje inicial
            // añade COUNT_MSG_KEY en clearAllChatData,
            //así setUserMsgCount(0) persiste el contador de mensajes a cero  ; 
            setUserMsgCount(0);
            setMessages([
                {
                    id: Date.now(),
                    text: getRandomInitialMessage(mode),
                    isUser: false,
                    timestamp: formatTime(new Date()),
                },
            ]);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            // Guardar historial de chat en localStorage (sin el contador)
            saveChatHistory(messages);
        }
    }, [messages]);

    // Sincronizar contador de mensajes con localStorage cuando cambia
    useEffect(() => {
        saveMsgCount(userMsgCount);
        console.log("Contador de mensajes del usuario:", userMsgCount);
    }, [userMsgCount]);


    //Handle send message
    const handleSend = async (message: string) => {
        // Beta Mode: Check if user has reached the message limit
        console.log("Mensajes del usuario:", userMsgCount);

        if (userMsgCount >= MAX_USER_MESSAGES) {
            const betaLimitMsg: Message = {
                id: Date.now(),
                text: `🧪 Beta: has alcanzado el máximo de ${MAX_USER_MESSAGES} mensajes por sesión.\nÚnete a la waitlist para acceso ampliado.`,
                isUser: false,
                timestamp: formatTime(new Date()),
                isError: true,
            };
            setMessages(prev => [...prev, betaLimitMsg]);
            return;
        }

        // Incrementar contador de mensajes del usuario ANTES de enviar
        const newCount = userMsgCount + 1;
        setUserMsgCount(newCount);

        const userMessage: Message = {
            id: Date.now(),
            text: message,
            isUser: true,
            timestamp: formatTime(new Date()),
        };

        const updatedMsg = [...messages, userMessage];
        setMessages(updatedMsg);
        //setMessages(messages);
        setIsLoading(true);

        try {
            // Build settings from ChatViewProps
            const setting = { mode, emotionalState, tone };

            // Build history from all messages (excluding the just-added user message for the request)
            const history = messagesToHistory(updatedMsg);

            // Use the sendMessage function from api.js
            //const response = await sendMessage(text, history, settings, useLocal);
            const data = await sendMessage(message, history, setting, useLocal);
            console.log("CHAT RESPONSE FIELD:", data?.response);


            const assistantMsg: Message = {
                id: Date.now() + 1,
                text: data.response || data.message || config.errorMessage,
                isUser: false,
                timestamp: formatTime(new Date()),
            };

            // Add assistant message, filtering out previous error messages
            console.log("MESSAGES AFTER SET (next):", updatedMsg?.length);
            setMessages((prev) => {
                const cleaned = prev.filter(m => !m.isError);
                return [...cleaned, assistantMsg];
            });


            console.log("MESSAGES AFTER SET (next):", messages?.length);


        } catch (error: any) {
            console.error("Error sending message:", error);

            // Check if it's a 429 rate limit error
            const is429 = error?.message?.includes("429") || error?.status === 429;
            const errorText = is429
                ? "🧪 Beta: has alcanzado el máximo de 10 mensajes por sesión. Únete a la waitlist para acceso ampliado."
                : `⚠️ ${config.errorMessage}`;

            const errorMessage: Message = {
                id: Date.now() + 1,
                text: errorText,
                isUser: false,
                timestamp: formatTime(new Date()),
                isError: true,
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
                    <span className="beta-indicator">🧪 BETA · Máx. {MAX_USER_MESSAGES} mensajes por sesión</span>
                    <span className="message-counter">Mensajes: {userMsgCount} / {MAX_USER_MESSAGES}</span>
                    <button
                        className={`btn ${limitReached ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => router.push("/#waitlist")}
                    >
                        {limitReached ? "Únete a la waitlist" : "Waitlist"}
                    </button>
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
                disabled={isLoading || limitReached}
                placeholder={limitReached ? `🧪 Beta: has alcanzado el máximo de ${MAX_USER_MESSAGES} mensajes por sesión. Únete a la waitlist para acceso ampliado.` : config.placeholder}
            />

            {/* Clear Chat Button */}
            <button
                className="clear-chat-btn"
                onClick={handleClearChat}
                title="El chat se guarda solo en la memoria local de tu dispositivo. Si lo borras aquí, desaparece de este navegador."
                aria-label="Borrar chat"
            >
                🗑️ Borrar chat
            </button>
        </div>
    );
}
