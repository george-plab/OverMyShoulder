import './ChatMessage.css';

const ChatMessage = ({ message, isUser, timestamp }) => {
    return (
        <div className={`message-container ${isUser ? 'user' : 'bot'}`}>
            <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                <div className="message-content">
                    {message}
                </div>
                <div className="message-time">
                    {timestamp}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
