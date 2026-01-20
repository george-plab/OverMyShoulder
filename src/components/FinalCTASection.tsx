"use client";

import { useState } from "react";
import styles from "./FinalCTASection.module.css";

export default function FinalCTASection() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            // Here you would typically send to your backend/email service
            console.log("Waitlist signup:", email);
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
                            />
                            <button type="submit" className="btn btn-primary btn-large">
                                Únete a la waitlist
                            </button>
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
