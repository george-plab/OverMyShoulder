"use client";

import "./TypingIndicator.css";

const TypingIndicator = () => {
    return (
        <div className="typing-container">
            <div className="typing-bubble">
                <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
