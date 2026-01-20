import styles from "./AboutSection.module.css";

export default function AboutSection() {
    const features = [
        {
            icon: "👂",
            title: "Escucha activa",
            description: "Un espacio donde puedes expresarte libremente, sin interrupciones ni consejos no solicitados."
        },
        {
            icon: "🔒",
            title: "Conversaciones privadas",
            description: "Tu historial se guarda solo en tu dispositivo. Tú decides cuándo borrarlo."
        },
        {
            icon: "🚫",
            title: "Sin diagnósticos",
            description: "No somos médicos ni psicólogos. Somos un espacio de compañía, no de evaluación."
        },
        {
            icon: "💭",
            title: "Sin juicios",
            description: "Di lo que necesites decir. Aquí no hay respuestas correctas ni incorrectas."
        }
    ];

    return (
        <section className={`section ${styles.about}`} id="que-es">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>¿Qué es OverMyShoulder?</h2>
                    <p className={styles.subtitle}>
                        Un confidente digital. Un espacio seguro para hablar sin juicios.
                    </p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.feature}>
                            <div className={styles.icon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDesc}>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <p className={styles.note}>
                    OverMyShoulder existe para acompañarte en momentos difíciles, no para reemplazar la ayuda profesional cuando sea necesaria.
                </p>
            </div>
        </section>
    );
}
