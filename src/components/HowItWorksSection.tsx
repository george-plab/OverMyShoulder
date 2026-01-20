import styles from "./HowItWorksSection.module.css";

export default function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Escribe lo que sientes",
            description: "Sin filtros, sin presión. Expresa lo que necesites en el momento que lo necesites.",
            icon: "✍️"
        },
        {
            number: "02",
            title: "La IA responde con escucha activa",
            description: "Recibes una respuesta empática que te acompaña, sin juzgar ni dar consejos no solicitados.",
            icon: "💬"
        },
        {
            number: "03",
            title: "Tu conversación permanece en tu dispositivo",
            description: "El historial se guarda solo en tu navegador. Puedes revisarlo o borrarlo cuando quieras.",
            icon: "📱"
        }
    ];

    return (
        <section className={`section ${styles.howItWorks}`} id="como-funciona">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>¿Cómo funciona?</h2>
                    <p className={styles.subtitle}>Tres pasos simples. Sin complicaciones.</p>
                </div>

                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className={styles.connector}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
