import styles from "./Onboarding.module.css";

interface StepPrivacyProps {
    onNext: () => void;
}

export default function StepPrivacy({ onNext }: StepPrivacyProps) {
    const items = [
        {
            icon: "🔒",
            title: "Historial solo en tu dispositivo",
            description:
                "Tus conversaciones se guardan únicamente en tu navegador. No las almacenamos en ningún servidor.",
        },
        {
            icon: "🚫",
            title: "Sin bases de datos de chats",
            description:
                "No creamos perfiles ni guardamos copias de lo que escribes.",
        },
        {
            icon: "🤖",
            title: "Proveedores de IA externos",
            description:
                "Para generar respuestas, tu texto se envía a servicios como GPT o Claude, sujetos a sus políticas.",
        },
    ];

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Tu privacidad es lo primero</h1>
                <p className={styles.stepDescription}>
                    Antes de empezar, queremos que sepas cómo cuidamos tu información.
                </p>
            </div>

            <div className={styles.infoCards}>
                {items.map((item, index) => (
                    <div key={index} className={styles.infoCard}>
                        <div className={styles.infoIcon}>{item.icon}</div>
                        <div className={styles.infoContent}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onNext} className={styles.continueBtn}>
                Entendido, continuar
            </button>
        </div>
    );
}
