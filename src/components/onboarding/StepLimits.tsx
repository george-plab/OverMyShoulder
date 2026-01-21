import styles from "./Onboarding.module.css";

interface StepLimitsProps {
    onNext: () => void;
}

export default function StepLimits({ onNext }: StepLimitsProps) {
    const items = [
        {
            icon: "💬",
            title: "Acompañamiento, no terapia",
            description:
                "Ofrecemos escucha activa y respuestas empáticas, pero esto no sustituye la atención de un profesional.",
            isWarning: false,
        },
        {
            icon: "📋",
            title: "Sin diagnósticos",
            description:
                "No podemos diagnosticar ni evaluar condiciones de salud mental.",
            isWarning: false,
        },
        {
            icon: "🆘",
            title: "Situaciones graves",
            description:
                "Si experimentas ideación suicida, depresión severa u otros problemas graves, por favor busca ayuda profesional inmediata.",
            isWarning: true,
        },
    ];

    const resources = [
        { name: "Teléfono de la Esperanza (España)", number: "717 003 717" },
        { name: "Línea de la Vida (México)", number: "800 911 2000" },
    ];

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Lo que debes saber</h1>
                <p className={styles.stepDescription}>
                    OverMyShoulder es un espacio de escucha, pero tiene limitaciones
                    importantes.
                </p>
            </div>

            <div className={styles.infoCards}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.infoCard} ${item.isWarning ? styles.warning : ""}`}
                    >
                        <div className={styles.infoIcon}>{item.icon}</div>
                        <div className={styles.infoContent}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.resourcesBox}>
                <h4>Recursos de ayuda</h4>
                {resources.map((resource, index) => (
                    <p key={index} className={styles.resourceItem}>
                        {resource.name}:{" "}
                        <span className={styles.resourceNumber}>{resource.number}</span>
                    </p>
                ))}
            </div>

            <button onClick={onNext} className={styles.continueBtn}>
                Lo entiendo, continuar
            </button>
        </div>
    );
}
