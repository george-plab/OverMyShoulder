"use client";

import { useState } from "react";
import styles from "../../components/onboarding/Onboarding.module.css";
import StepPrivacy from "../../components/onboarding/StepPrivacy";
import StepLimits from "../../components/onboarding/StepLimits";
import StepPersonalize from "../../components/onboarding/StepPersonalize";

const steps = [
    { id: 1, title: "Privacidad" },
    { id: 2, title: "Límites" },
    { id: 3, title: "Personaliza" },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    return (
        <div className={styles.onboarding}>
            <div className={styles.container}>
                {/* Progress Indicator */}
                <div className={styles.progressContainer}>
                    {steps.map((step, index) => (
                        <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
                            <div
                                className={`${styles.stepCircle} ${step.id < currentStep
                                        ? styles.completed
                                        : step.id === currentStep
                                            ? styles.active
                                            : styles.pending
                                    }`}
                            >
                                {step.id < currentStep ? (
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`${styles.stepLine} ${step.id < currentStep ? styles.completed : styles.pending
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {currentStep === 1 && <StepPrivacy onNext={nextStep} />}
                {currentStep === 2 && <StepLimits onNext={nextStep} />}
                {currentStep === 3 && <StepPersonalize />}
            </div>
        </div>
    );
}
