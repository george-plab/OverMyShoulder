"use client";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import "./PaywallModal.css";

export type PaywallReason = "ANON_LIMIT_REACHED" | "AUTH_LIMIT_REACHED" | "LOGIN";

interface PaywallModalProps {
    open: boolean;
    onClose: () => void;
    reason?: PaywallReason;
}

const MESSAGES: Record<PaywallReason, { title: string; text: string }> = {
    ANON_LIMIT_REACHED: {
        title: "Inicia sesión para continuar",
        text: "Has alcanzado el límite gratuito. Inicia sesión para desbloquear 100 mensajes.",
    },
    AUTH_LIMIT_REACHED: {
        title: "Límite alcanzado",
        text: "Has alcanzado el máximo de mensajes para tu cuenta. Plan premium próximamente.",
    },
    LOGIN: {
        title: "Inicia sesión",
        text: "Inicia sesión para acceder a más funciones y desbloquear 100 mensajes.",
    },
};

export default function PaywallModal({ open, onClose, reason = "LOGIN" }: PaywallModalProps) {
    if (!open) return null;

    const { title, text } = MESSAGES[reason];
    const showGoogleLogin = reason !== "AUTH_LIMIT_REACHED";

    return (
        <div className="paywall-modal-overlay" onClick={onClose}>
            <div className="paywall-modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="paywall-modal-close" onClick={onClose} aria-label="Cerrar">
                    ×
                </button>
                <h2 className="paywall-modal-title">{title}</h2>
                <p className="paywall-modal-text">{text}</p>
                {showGoogleLogin && (
                    <div className="paywall-modal-button">
                        <GoogleSignInButton />
                    </div>
                )}
                {reason === "AUTH_LIMIT_REACHED" && (
                    <button className="paywall-modal-waitlist" onClick={onClose}>
                        Únete a la waitlist
                    </button>
                )}
            </div>
        </div>
    );
}
