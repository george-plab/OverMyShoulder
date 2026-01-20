import styles from "./FinalCTASection.module.css";

export default function FinalCTASection() {
    return (
        <section className={`section ${styles.finalCTA}`} id="app">
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.decoration}>
                        <span>💜</span>
                    </div>

                    <h2 className={styles.title}>
                        Tu espacio seguro te está esperando
                    </h2>

                    <p className={styles.subtitle}>
                        No tienes que guardarte lo que sientes. Habla cuando quieras,
                        como quieras, sin que nadie te juzgue.
                    </p>

                    <a href="#" className="btn btn-primary btn-large">
                        Habla ahora. Sin juicios. Sin prisa.
                    </a>

                    <p className={styles.note}>
                        Gratuito para empezar • Sin datos personales requeridos
                    </p>
                </div>
            </div>
        </section>
    );
}
