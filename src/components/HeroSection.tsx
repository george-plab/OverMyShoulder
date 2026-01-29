"use client";

import styles from "./HeroSection.module.css";

export default function HeroSection() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className={styles.hero}>
            <div className={styles.backgroundGlow}></div>
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    <h1 className={styles.headline}>
                        No necesitas respuestas.
                        <br />
                        <span className={styles.highlight}>
                            A veces solo necesitas que alguien te escuche.
                        </span>
                    </h1>

                    <p className={styles.subheadline}>
                        Un espacio seguro para hablar de lo que sientes. Sin prisa, sin
                        juicios, y con total privacidad. Tu confidente digital está aquí
                        cuando lo necesites.
                    </p>

                    <div className={styles.ctas}>
                        <a href="/onboarding" className="btn btn-primary btn-large">
                            Empieza a hablar ahora
                        </a>
                        <button
                            onClick={() => scrollToSection("waitlist")}
                            className="btn btn-primary btn-medium"
                        >
                            Apuntate a la lista de espera
                        </button>
                        <button
                            onClick={() => scrollToSection("como-funciona")}
                            className="btn btn-secondary"
                        >
                            Cómo funciona
                        </button>
                    </div>

                    <p className={styles.note}>
                        Sin registro obligatorio • Totalmente privado • Gratis para empezar
                    </p>
                </div>

                <div className={styles.visual}>
                    <div className={styles.floatingCard}>
                        <div className={styles.cardIcon}>💬</div>
                        <p className={styles.cardText}>
                            &ldquo;Hoy ha sido un día difícil y no sé con quién hablar...&rdquo;
                        </p>
                        <div className={styles.typingIndicator}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
