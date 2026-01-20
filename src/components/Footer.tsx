import styles from "./Footer.module.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>OverMyShoulder</h3>
                        <p className={styles.tagline}>
                            Tu espacio de escucha y acompañamiento emocional.
                        </p>
                    </div>

                    <nav className={styles.nav}>
                        <div className={styles.navGroup}>
                            <h4 className={styles.navTitle}>Legal</h4>
                            <ul className={styles.navList}>
                                <li><a href="/privacidad">Política de privacidad</a></li>
                                <li><a href="/terminos">Términos de uso</a></li>
                            </ul>
                        </div>

                        <div className={styles.navGroup}>
                            <h4 className={styles.navTitle}>Contacto</h4>
                            <ul className={styles.navList}>
                                <li><a href="mailto:hola@overmyshoulder.app">hola@overmyshoulder.app</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} OverMyShoulder. Todos los derechos reservados.
                    </p>

                    <p className={styles.privacyNote}>
                        🔒 Respetamos tu privacidad: no almacenamos conversaciones en nuestros servidores.
                        Tu historial permanece solo en tu dispositivo.
                    </p>
                </div>
            </div>
        </footer>
    );
}
