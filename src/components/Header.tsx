"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { label: "Cómo funciona", sectionId: "como-funciona" },
        { label: "Privacidad", sectionId: "privacidad" },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <Image
                        src="/logo.png"
                        alt="OverMyShoulder"
                        width={40}
                        height={40}
                        className={styles.logoIcon}
                    />
                    <span className={styles.logoText}>
                        Over<span>My</span>Shoulder
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <button
                            key={item.sectionId}
                            className={styles.navLink}
                            onClick={() => scrollToSection(item.sectionId)}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        className={styles.waitlistBtn}
                        onClick={() => scrollToSection("waitlist")}
                    >
                        Waitlist
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <nav className={styles.navMobile}>
                    {navItems.map((item) => (
                        <button
                            key={item.sectionId}
                            className={styles.navLink}
                            onClick={() => scrollToSection(item.sectionId)}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        className={styles.waitlistBtn}
                        onClick={() => scrollToSection("waitlist")}
                    >
                        Waitlist
                    </button>
                </nav>
            )}
        </header>
    );
}
