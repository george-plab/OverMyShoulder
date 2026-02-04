"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";

declare global {
  interface Window {
    google?: any;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const SCRIPT_ID = "google-gis";

// export async function loginWithGoogle(credential: string) {
//   const res = await fetch("http://127.0.0.1:8000/api/auth/google", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ credential }),
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err?.detail || `Login failed: ${res.status}`);
//   }

//   return res.json();
// }



export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;

    const renderButton = () => {
      if (!buttonRef.current) return;
      if (!window.google?.accounts?.id) return;

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response: { credential: string }) => {
          try {
            console.log("credential prefix:", response.credential?.slice(0, 12));
            console.log("credential suffix:", response.credential);
            await loginWithGoogle(response.credential);
          } catch (err) {
            console.error("Google login failed", err);
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 220,
      });
    };

    if (document.getElementById(SCRIPT_ID)) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.head.appendChild(script);
  }, [loginWithGoogle]);

  if (!CLIENT_ID) {
    return null;
  }

  return <div ref={buttonRef} />;
}
