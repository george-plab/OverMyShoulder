"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Onboarding.module.css";

export default function StepPersonalize() {
    const router = useRouter();
    const [emotionalState, setEmotionalState] = useState<string>("");
    const [tone, setTone] = useState<string>("normal");

    const emotionalOptions = [
        { value: "sad", label: "Triste", emoji: "😢" },
        { value: "anxious", label: "Ansioso/a", emoji: "😰" },
        { value: "lonely", label: "Solo/a", emoji: "🫂" },
        { value: "confused", label: "Confundido/a", emoji: "😕" },
        { value: "skip", label: "Prefiero no decirlo", emoji: "🤐" },
    ];

    const toneOptions = [
        { value: "soft", label: "Suave", description: "Cálido y muy delicado", emoji: "🌸" },
        { value: "normal", label: "Normal", description: "Equilibrado y claro", emoji: "💬" },
        { value: "direct", label: "Directo", description: "Claro y respetuoso", emoji: "🎯" },
    ];

    const handleSubmit = () => {
        // Save preferences to localStorage
        const preferences = {
            emotionalState,
            tone,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem("oms_user_preferences", JSON.stringify(preferences));

        // Navigate to chat
        router.push("/chat");
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Personaliza tu experiencia</h1>
                <p className={styles.stepDescription}>
                    Cuéntanos un poco sobre ti para adaptar las respuestas.
                </p>
            </div>

            {/* Emotional State */}
            <div style={{ marginBottom: "var(--space-8)" }}>
                <p className={styles.sectionLabel}>¿Cómo te sientes ahora?</p>
                <div className={styles.selectionGrid}>
                    {emotionalOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setEmotionalState(option.value)}
                            className={`${styles.selectionCard} ${emotionalState === option.value ? styles.selected : ""
                                }`}
                        >
                            <div className={styles.selectionEmoji}>{option.emoji}</div>
                            <div className={styles.selectionLabel}>{option.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tone */}
            <div style={{ marginBottom: "var(--space-8)" }}>
                <p className={styles.sectionLabel}>¿Qué tono prefieres en las respuestas?</p>
                <div className={`${styles.selectionGrid} ${styles.tones}`}>
                    {toneOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setTone(option.value)}
                            className={`${styles.selectionCard} ${tone === option.value ? styles.selected : ""
                                }`}
                        >
                            <div className={styles.selectionEmoji}>{option.emoji}</div>
                            <div className={styles.selectionLabel}>{option.label}</div>
                            <div className={styles.selectionDesc}>{option.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={handleSubmit} className={styles.continueBtn}>
                Empezar chat
            </button>
        </div>
    );
}
