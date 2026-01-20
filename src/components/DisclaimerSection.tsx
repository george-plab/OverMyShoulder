import styles from "./DisclaimerSection.module.css";

export default function DisclaimerSection() {
    return (
        <section className={`section ${styles.disclaimer}`} id="aviso">
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.icon}>⚠️</div>

                    <h2 className={styles.title}>Aviso importante</h2>

                    <div className={styles.text}>
                        <p>
                            <strong>OverMyShoulder no sustituye a un profesional de la salud mental.</strong>
                        </p>
                        <p>
                            Si estás atravesando ideación suicida, depresión severa u otros problemas
                            de salud mental graves, esta aplicación no es la solución adecuada para ti.
                        </p>
                        <p>
                            En esos casos, te recomendamos buscar ayuda profesional o contactar con
                            líneas de atención en crisis.
                        </p>
                    </div>

                    <div className={styles.resources}>
                        <h3 className={styles.resourcesTitle}>Recursos de ayuda:</h3>
                        <ul className={styles.resourcesList}>
                            <li>
                                <strong>Teléfono de la Esperanza:</strong> 717 003 717 (España)
                            </li>
                            <li>
                                <strong>Línea de Atención a la Conducta Suicida:</strong> 024 (España)
                            </li>
                            <li>
                                <strong>En otros países:</strong> Busca la línea de crisis local o acude a urgencias
                            </li>
                        </ul>
                    </div>

                    <p className={styles.note}>
                        Tu bienestar es lo más importante. No estás solo/a.
                    </p>
                </div>
            </div>
        </section>
    );
}
