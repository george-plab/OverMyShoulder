"use client";

import { useState } from "react";
import styles from "./FinalCTASection.module.css";
import { submitWaitlist } from "@/api/waitlist";

export default function FinalCTASection() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!email) return;

        try {
            setIsLoading(true);
            await submitWaitlist(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setErrorMsg(err?.message || "No se pudo apuntar a la waitlist");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={`section ${styles.finalCTA}`} id="waitlist">
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.decoration}>
                        <span>💛</span>
                    </div>

                    <h2 className={styles.title}>
                        Tu espacio seguro te está esperando
                    </h2>

                    <p className={styles.subtitle}>
                        No tienes que guardarte lo que sientes. Únete a la lista de espera
                        y sé el primero en acceder cuando lancemos.
                    </p>

                    {!isSubmitted ? (
                        <form className={styles.waitlistForm} onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.emailInput}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-large"
                                disabled={isLoading}
                                style={{ opacity: isLoading ? 0.7 : 1 }}
                            >
                                {isLoading ? "Enviando..." : "Únete a la waitlist"}
                            </button>
                            {errorMsg && (
                                <p style={{ color: "#dc2626", marginTop: "0.75rem", fontSize: "0.9rem" }}>
                                    {errorMsg}
                                </p>
                            )}
                        </form>
                    ) : (
                        <div className={styles.successMessage}>
                            <span>✨</span>
                            <p>¡Gracias! Te avisaremos cuando estemos listos.</p>
                        </div>
                    )}

                    <p className={styles.note}>
                        Sin spam • Solo actualizaciones importantes
                    </p>
                </div>
            </div>
        </section>
    );
}
