import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { sendMessage } from './api';
import './App.css';

// ============================================================================
// CONVERSATION MODES CONFIGURATION
// future: conversation modes (night, breakup, calm, anxiety, grief, etc.)
// Each mode can define: initialMessages, placeholder, statusText, tone
// ============================================================================

/**
 * @typedef {'default' | 'night' | 'breakup' | 'calm' | 'anxiety' | 'grief'} ConversationMode
 * 
 * future: Each mode will customize:
 * - initialMessages: Array of greeting messages
 * - placeholder: Input placeholder text
 * - statusText: Header status text (e.g., "Aquí contigo")
 * - errorMessage: Connection error text
 * - tone: Passed to backend for response style
 */

// Mode-specific configurations
// future: expand this object with mode-specific settings
const modeConfig = {
  default: {
    initialMessages: [
      'Hola. Estoy aquí. Cuéntame qué tienes en la cabeza.',
      'Hola. Este espacio es tuyo. Nada se comparte ni se publica.',
      'Hola. Dime qué te ronda por la mente.',
    ],
    statusText: 'Aquí contigo',
    placeholder: 'Escribe lo que necesites decir...',
    errorMessage: 'No he podido conectar. Vuelve a intentarlo en un momento.',
  },
  // future: night mode - softer, sleepier tone
  // night: {
  //   initialMessages: ['Es tarde. ¿Qué te mantiene despierto?'],
  //   statusText: 'Despierto contigo',
  //   placeholder: 'Si necesitas desahogarte...',
  // },
  // future: breakup mode - supportive, validating tone
  // breakup: { ... },
  // future: calm mode - slower, breathing-focused
  // calm: { ... },
};

/**
 * Get configuration for a conversation mode
 * @param {ConversationMode} mode 
 * @returns {object} Mode configuration, falls back to default
 */
function getModeConfig(mode = 'default') {
  return modeConfig[mode] || modeConfig.default;
}

function getRandomInitialMessage(mode = 'default') {
  const config = getModeConfig(mode);
  const messages = config.initialMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================================================
// MAIN CHAT COMPONENT
// ============================================================================

/**
 * Main Chat Application
 * @param {object} props
 * @param {ConversationMode} [props.mode='default'] - Conversation mode
 * future: mode prop will be passed from parent/router to customize experience
 */
function App({ mode = 'default' }) {
  // Get mode-specific configuration
  const config = getModeConfig(mode);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getRandomInitialMessage(mode),
      isUser: false,
      timestamp: formatTime(new Date())
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [useLocal, setUseLocal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  function formatTime(date) {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const handleSend = async (text) => {
    const userMessage = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: formatTime(new Date())
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // future: pass mode to backend for tone-aware responses
      const response = await sendMessage(text, useLocal);

      const botMessage = {
        id: Date.now() + 1,
        text: response.response || response.message || config.errorMessage,
        isUser: false,
        timestamp: formatTime(new Date())
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        // Use mode-specific error message
        text: `⚠️ ${config.errorMessage}`,
        isUser: false,
        timestamp: formatTime(new Date())
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="chat-header">
        <div className="header-content">
          <div className="avatar">
            <span className="avatar-icon">💬</span>
          </div>
          <div className="header-info">
            <h1>OverMyShoulder</h1>
            <span className="status">
              <span className="status-dot"></span>
              {/* future: status text varies by mode */}
              {config.statusText}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <label className="toggle-local">
            <input
              type="checkbox"
              checked={useLocal}
              onChange={(e) => setUseLocal(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Local</span>
          </label>
        </div>
      </header>

      {/* Messages Area */}
      <main className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      {/* future: pass mode-specific placeholder */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={config.placeholder}
      />
    </div>
  );
}

export default App;
