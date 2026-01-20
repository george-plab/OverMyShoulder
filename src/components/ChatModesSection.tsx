import styles from "./ChatModesSection.module.css";

export default function ChatModesSection() {
    const modes = [
        {
            icon: "🤗",
            name: "Acompañamiento",
            description: "Para cuando necesitas compañía y alguien que te escuche. Conversaciones cálidas y empáticas.",
            color: "primary"
        },
        {
            icon: "🌙",
            name: "Modo Noche",
            description: "Para esas noches largas donde los pensamientos no paran. Calma y presencia cuando más la necesitas.",
            color: "night"
        },
        {
            icon: "💔",
            name: "Modo Ruptura",
            description: "Para procesar el duelo de una relación. Sin presiones, a tu ritmo, con escucha comprensiva.",
            color: "rupture"
        },
        {
            icon: "🌊",
            name: "Ansiedad Leve",
            description: "Para esos momentos de inquietud. Técnicas de respiración y conversación tranquilizadora.",
            color: "anxiety"
        },
        {
            icon: "✨",
            name: "Modo Spicy",
            description: "Conversaciones más ligeras y afectivas. Para explorar emociones sin tabúes, siempre con respeto.",
            color: "spicy",
            disclaimer: true
        }
    ];

    return (
        <section className={`section ${styles.chatModes}`} id="modos">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Modos de conversación</h2>
                    <p className={styles.subtitle}>
                        Cada momento requiere un enfoque diferente. Elige el modo que mejor se adapte a cómo te sientes.
                    </p>
                </div>

                <div className={styles.grid}>
                    {modes.map((mode, index) => (
                        <div
                            key={index}
                            className={`${styles.modeCard} ${styles[mode.color]}`}
                        >
                            <div className={styles.modeIcon}>{mode.icon}</div>
                            <h3 className={styles.modeName}>{mode.name}</h3>
                            <p className={styles.modeDesc}>{mode.description}</p>
                            {mode.disclaimer && (
                                <p className={styles.modeDisclaimer}>
                                    *Enfocado en conexión emocional y afectiva. Contenido respetuoso.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
