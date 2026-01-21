const API_URL = 'http://localhost:8000';

export const sendMessage = async (
  prompt, 
  useLocal = true
) => {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      use_local: useLocal 
    })
  });
  return res.json();
};
