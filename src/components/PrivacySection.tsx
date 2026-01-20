import styles from "./PrivacySection.module.css";

export default function PrivacySection() {
    const privacyPoints = [
        {
            icon: "🔐",
            title: "Sin almacenamiento en servidores",
            description: "No guardamos tus conversaciones en nuestros servidores. Tu privacidad es nuestra prioridad."
        },
        {
            icon: "📱",
            title: "Historial en tu dispositivo",
            description: "Tus chats se almacenan solo en tu navegador (localStorage). Nadie más tiene acceso."
        },
        {
            icon: "🗑️",
            title: "Borrado cuando quieras",
            description: "Puedes eliminar todo tu historial con un solo clic. Sin rastros, sin preguntas."
        }
    ];

    return (
        <section className={`section ${styles.privacy}`} id="privacidad">
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.badge}>🛡️ Privacidad ante todo</div>

                    <h2 className={styles.title}>
                        Lo que dices aquí no se publica, no se comparte y no se queda en nuestra base de datos.
                    </h2>

                    <div className={styles.grid}>
                        {privacyPoints.map((point, index) => (
                            <div key={index} className={styles.point}>
                                <div className={styles.pointIcon}>{point.icon}</div>
                                <h3 className={styles.pointTitle}>{point.title}</h3>
                                <p className={styles.pointDesc}>{point.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.disclosure}>
                        <div className={styles.disclosureIcon}>ℹ️</div>
                        <div className={styles.disclosureContent}>
                            <h4 className={styles.disclosureTitle}>Transparencia sobre nuestro funcionamiento</h4>
                            <p className={styles.disclosureText}>
                                Para responder a tus mensajes, utilizamos proveedores de inteligencia artificial externos
                                (como GPT o Claude). Estos mensajes se envían a sus servidores para generar respuestas.
                                Cada proveedor tiene sus propias políticas de privacidad y tratamiento de datos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
