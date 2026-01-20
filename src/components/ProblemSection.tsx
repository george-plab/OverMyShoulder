import styles from "./ProblemSection.module.css";

export default function ProblemSection() {
    return (
        <section className={`section ${styles.problem}`}>
            <div className="container">
                <div className={styles.content}>
                    <h2 className={styles.title}>A veces, las palabras pesan demasiado para guardarlas</h2>

                    <div className={styles.situations}>
                        <p className={styles.situation}>
                            Noches que se hacen largas, pensamientos que no se dicen en voz alta.
                        </p>
                        <p className={styles.situation}>
                            Una ruptura que todavía duele, aunque hayas dicho que ya pasó.
                        </p>
                        <p className={styles.situation}>
                            Esa sensación de soledad, incluso rodeado de gente.
                        </p>
                        <p className={styles.situation}>
                            Ansiedad que aparece sin avisar y no sabes cómo explicar.
                        </p>
                    </div>

                    <p className={styles.closing}>
                        No siempre necesitas soluciones. <strong>A veces solo necesitas un espacio donde soltarlo todo.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
}
