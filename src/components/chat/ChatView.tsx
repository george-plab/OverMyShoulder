"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import "./ChatView.css";

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

export default function ChatView({ mode = "default" }: ChatViewProps) {
    const config = getModeConfig(mode);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: getRandomInitialMessage(mode),
            isUser: false,
            timestamp: formatTime(new Date()),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [useLocal, setUseLocal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (text: string) => {
        const userMessage: Message = {
            id: Date.now(),
            text,
            isUser: true,
            timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: text,
                    use_local: useLocal,
                }),
            });
            const response = await res.json();

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
