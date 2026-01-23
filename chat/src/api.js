//const API_URL = 'http://localhost:8000';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
/**
 * Creates settings object from ChatViewProps
 * @param {object} props - ChatViewProps containing mode, emotionalState, tone
 * @returns {object} Settings object for API
 */
export const createSettings = ({ mode, emotionalState, tone }) => ({
  mode: mode || 'default',
  emotionalState: emotionalState || '',
  tone: tone || '',
});



const payload_sample = {
  "message": "hola", "history": [],
  "setting": { "tone": "suave", "emotionalState": "solo", "mode": "normal" }
}

/**
 * Send a message to the chat API
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @param {object} settings - Settings from ChatViewProps (mode, emotionalState, tone)
 * @param {boolean} useLocal - Whether to use local model
 * @returns {Promise} API response
 */
export const sendMessage = async (message, history, settings, useLocal = true) => {
  // const payload = { message, history,
  // setting: {mode: settings.mode, emotionalState: settings.emotionalState, tone: settings.tone },
  // use_local: useLocal,
  // }
  const payload = {
    "message": message,
    "history": history,
    "setting": createSettings(settings),
    "use_local": useLocal,
  }
  console.log("CHAT PAYLOAD:", payload);
  console.log("CHAT PAYLOAD JSON:", JSON.stringify(payload));

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  // útil para ver el 422 detail
  const text = await res.text();
  console.log("CHAT STATUS:", res.status, "CHAT BODY:", text);

  // si fue OK, parsea json; si no, lanza error con detalle
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data?.detail || "Error en /api/chat");
    return data;
  } catch {
    if (!res.ok) throw new Error("Error en /api/chat (respuesta no JSON)");
    return {}; // raro, pero por seguridad
  }
};


