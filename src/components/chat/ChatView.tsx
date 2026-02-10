"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import "./ChatView.css";
import { HistoryItem } from "@/api/chat";
import { apiChat, PaywallError, PaywallReason } from "@/api/auth";
import { useAuth } from "@/providers/AuthProvider";
import PaywallModal from "@/components/PaywallModal";

const CHAT_HISTORY_KEY = "oms_chat_history";
const COUNT_MSG_KEY = "oms_count_msg";



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

// DEPRECATED
function getModeConfig(mode = "default") {
    return modeConfig[mode as keyof typeof modeConfig] || modeConfig.default;
}

function getRandomInitialMessage(mode = "default") {
    const config = getModeConfig(); // DEPRECATED   
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
    //mode?: string; // DEPRECATED
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

export default function ChatView({// mode = "default", DEprecated
    emotionalState = "", tone = "" }: ChatViewProps) {
    const config = getModeConfig();//mode = "default", DEprecated
    const { user, isAuthenticated, maxMessages, logout, isLoading: isAuthLoading, refreshPolicy } = useAuth();

    // Modal state for paywall/login prompt with reason
    const [paywallReason, setPaywallReason] = useState<PaywallReason | "LOGIN" | null>(null);

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
                text: getRandomInitialMessage(),
                isUser: false,
                timestamp: formatTime(new Date()),
            },
        ];
    });
    //const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
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
    const limitReached = userMsgCount >= maxMessages;

    // Handle login button click
    const handleLoginClick = () => {
        setPaywallReason("LOGIN");
    };

    // Effect to close modal when auth changes
    useEffect(() => {
        if (isAuthenticated && paywallReason) {
            setPaywallReason(null);
        }
    }, [isAuthenticated, paywallReason]);

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
                    text: getRandomInitialMessage(),
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
    }, [messages, isSending]);

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
        // Check if user has reached the message limit
        if (userMsgCount >= maxMessages) {
            // Show appropriate paywall modal
            setPaywallReason(isAuthenticated ? "AUTH_LIMIT_REACHED" : "ANON_LIMIT_REACHED");
            return;
        }

        // Increment counter BEFORE sending
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
        setIsSending(true);

        try {
            // Build history from all messages
            const history = messagesToHistory(updatedMsg);

            // Use apiChat from auth.ts
            const data = await apiChat({
                message,
                history,
                setting: { emotionalState, tone },
                use_local: false,
            });

            const assistantMsg: Message = {
                id: Date.now() + 1,
                text: data.response || config.errorMessage,
                isUser: false,
                timestamp: formatTime(new Date()),
            };

            // Add assistant message, filtering out previous error messages
            setMessages((prev) => {
                const cleaned = prev.filter(m => !m.isError);
                return [...cleaned, assistantMsg];
            });

        } catch (error: any) {
            console.error("Error sending message:", error);

            // Handle PaywallError - show modal with reason
            if (error instanceof PaywallError || error?.status === 402) {
                // Decrement the counter since the message wasn't processed
                setUserMsgCount(prev => Math.max(0, prev - 1));
                // Remove the user message from UI
                setMessages(prev => prev.filter(m => m.id !== userMessage.id));
                // Show paywall modal with appropriate reason
                const reason = error?.detail?.reason || (isAuthenticated ? "AUTH_LIMIT_REACHED" : "ANON_LIMIT_REACHED");
                setPaywallReason(reason);
                return;
            }

            // Generic error handling
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: `⚠️ ${config.errorMessage}`,
                isUser: false,
                timestamp: formatTime(new Date()),
                isError: true,
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
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
                    <span className="beta-indicator">🧪 BETA</span>
                    <span className="message-counter">
                        {userMsgCount} / {maxMessages} mensajes
                        {!isAuthenticated && <span className="login-hint"> · Inicia sesión → 100</span>}
                    </span>
                    {!isAuthLoading && !user && (
                        <button className="login-btn" onClick={handleLoginClick}>
                            Iniciar sesión
                        </button>
                    )}
                    {!isAuthLoading && user && (
                        <button className="logout-btn" onClick={logout}>
                            Cerrar sesión
                        </button>
                    )}
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
                {isSending && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <ChatInput
                onSend={handleSend}
                disabled={isSending || limitReached}
                placeholder={limitReached ? `🧪 Has alcanzado el máximo de ${maxMessages} mensajes por sesión. ${isAuthenticated ? 'Únete a la waitlist para acceso ampliado.' : 'Inicia sesión para continuar.'}` : config.placeholder}
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

            {/* Paywall Modal */}
            <PaywallModal
                open={paywallReason !== null}
                onClose={() => setPaywallReason(null)}
                reason={paywallReason || "LOGIN"}
            />
        </div>
    );
}
